import axios from 'axios';

// ----------------------
// YouTube API
// ----------------------
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchYouTubeVideos = async (query = 'educational shorts', maxResults = 20) => {
    try {
        const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: query,
                maxResults: maxResults,
                type: 'video',
                // videoDuration: 'short', // Optional: Focus on shorts
                key: YOUTUBE_API_KEY
            }
        });
        return response.data.items;
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        return [];
    }
};

// ----------------------
// Reddit API
// ----------------------
// Note: Real Reddit OAuth needs a backend for security or an implicit grant flow.
// We use the open JSON API to fetch public posts without auth if possible,
// or use simple basic auth for installed/script app if allowed by Reddit.
// Using public endpoints (e.g. `https://www.reddit.com/r/science/hot.json`) is the easiest for public feeds without user auth.
export const fetchRedditPosts = async (subreddit = 'educational', limit = 10) => {
    try {
        // Just fetching public JSON directly for simplicity and to avoid complex auth flows on frontend.
        const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json`, {
            params: {
                limit: limit
            }
        });
        return response.data.data.children;
    } catch (error) {
        console.error("Error fetching Reddit posts:", error);
        return [];
    }
};

export const fetchRedditPostComments = async (subreddit, postId) => {
    try {
        const response = await axios.get(`https://www.reddit.com/r/${subreddit}/comments/${postId}.json`);
        // response.data is an array of two items: [0] = the post itself, [1] = the comments tree
        return response.data[1].data.children;
    } catch (error) {
        console.error("Error fetching Reddit comments:", error);
        return [];
    }
};

// ----------------------
// OpenAI API (for reviews/summaries)
// ----------------------
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // This is not recommended for production due to exposing API keys!
});

export const generateAIReview = async (text) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using mini for fast/cheap completion
            messages: [
                {
                    role: "system",
                    content: "You are an AI educational assistant. Review the following content and provide a brief, insightful summary indicating its educational value."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            max_tokens: 150
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error generating AI review:", error);
        return "AI Review unavailable at the moment.";
    }
};
