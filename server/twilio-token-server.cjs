'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { pathToFileURL } = require('url');
const { jwt: { AccessToken } } = require('twilio');

const VideoGrant = AccessToken.VideoGrant;
const app = express();

const PORT = Number(process.env.PORT || process.env.TWILIO_TOKEN_SERVER_PORT || 3007);
const MAX_ALLOWED_SESSION_DURATION = 60 * 60 * 4;
const requiredEnvVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_API_KEY', 'TWILIO_API_SECRET'];
const REDDIT_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';
const REDDIT_API_BASE = 'https://oauth.reddit.com';
const REDDIT_USER_AGENT = process.env.REDDIT_USER_AGENT || 'smartscrolling/1.0';
let redditAccessToken = '';
let redditTokenExpiry = 0;

app.use(cors());
app.use(express.json());

const getMissingEnvVars = () =>
  requiredEnvVars.filter((envVar) => !process.env[envVar] || process.env[envVar].includes('your_'));

app.get('/health', (_request, response) => {
  const missing = getMissingEnvVars();
  response.json({
    status: missing.length ? 'misconfigured' : 'ok',
    port: PORT,
    missing,
    timestamp: new Date().toISOString(),
  });
});

app.get('/token', (request, response) => {
  const { identity, room } = request.query;
  const missing = getMissingEnvVars();

  if (missing.length) {
    return response.status(503).json({
      error: 'Twilio token server is missing required environment variables.',
      missing,
    });
  }

  if (!identity) {
    return response.status(400).json({
      error: 'Query parameter "identity" is required.',
    });
  }

  try {
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      {
        ttl: MAX_ALLOWED_SESSION_DURATION,
        identity: String(identity),
      }
    );

    token.addGrant(new VideoGrant(room ? { room: String(room) } : undefined));

    response.json({
      token: token.toJwt(),
      identity: String(identity),
      room: room ? String(room) : null,
      expiresIn: MAX_ALLOWED_SESSION_DURATION,
    });
  } catch (error) {
    response.status(500).json({
      error: 'Failed to generate Twilio access token.',
      details: error.message,
    });
  }
});

app.get('/youtube-transcript', async (request, response) => {
  const { videoId } = request.query;

  if (!videoId) {
    return response.status(400).json({
      error: 'Query parameter "videoId" is required.',
    });
  }

  try {
    const transcriptModuleUrl = pathToFileURL(
      require.resolve('youtube-transcript/dist/youtube-transcript.esm.js')
    ).href;
    const { fetchTranscript } = await import(transcriptModuleUrl);
    const transcript = await fetchTranscript(String(videoId));
    const text = transcript.map((item) => item.text).join(' ').replace(/\s+/g, ' ').trim();

    response.json({
      videoId: String(videoId),
      transcript: text,
      segments: transcript.length,
    });
  } catch (error) {
    response.status(502).json({
      error: 'Failed to fetch YouTube transcript.',
      details: error.message,
    });
  }
});

const fetchRedditAccessToken = async () => {
  if (redditAccessToken && Date.now() < redditTokenExpiry) {
    return redditAccessToken;
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing REDDIT_CLIENT_ID or REDDIT_CLIENT_SECRET.');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(REDDIT_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': REDDIT_USER_AGENT,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Reddit token request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  redditAccessToken = data.access_token;
  redditTokenExpiry = Date.now() + (data.expires_in || 3600) * 1000 - 60 * 1000;
  return redditAccessToken;
};

app.get('/reddit/hot', async (request, response) => {
  const subreddit = request.query.subreddit || 'educational';
  const limit = Number(request.query.limit || 10);

  try {
    const token = await fetchRedditAccessToken();
    const apiResponse = await fetch(
      `${REDDIT_API_BASE}/r/${encodeURIComponent(subreddit)}/hot?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': REDDIT_USER_AGENT,
        },
      }
    );

    if (!apiResponse.ok) {
      const text = await apiResponse.text();
      return response.status(apiResponse.status).send(text);
    }

    const data = await apiResponse.json();
    response.json(data);
  } catch (error) {
    response.status(502).json({
      error: 'Failed to fetch Reddit posts.',
      details: error.message,
    });
  }
});

app.get('/reddit/comments', async (request, response) => {
  const subreddit = request.query.subreddit;
  const postId = request.query.postId;

  if (!subreddit || !postId) {
    return response.status(400).json({
      error: 'Query parameters "subreddit" and "postId" are required.',
    });
  }

  try {
    const token = await fetchRedditAccessToken();
    const apiResponse = await fetch(
      `${REDDIT_API_BASE}/r/${encodeURIComponent(subreddit)}/comments/${encodeURIComponent(postId)}?limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': REDDIT_USER_AGENT,
        },
      }
    );

    if (!apiResponse.ok) {
      const text = await apiResponse.text();
      return response.status(apiResponse.status).send(text);
    }

    const data = await apiResponse.json();
    response.json(data);
  } catch (error) {
    response.status(502).json({
      error: 'Failed to fetch Reddit comments.',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  const missing = getMissingEnvVars();
  console.log(`Twilio token server listening on http://localhost:${PORT}`);
  if (missing.length) {
    console.log(`Missing env vars: ${missing.join(', ')}`);
  }
});
