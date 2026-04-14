import axios from 'axios';

// ----------------------
// YouTube API
// ----------------------
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const LOCAL_API_BASE_URL = import.meta.env.VITE_LOCAL_API_BASE_URL || 'http://localhost:3007';

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

export const fetchYouTubeTranscript = async (videoId) => {
    try {
        const response = await axios.get(`${LOCAL_API_BASE_URL}/youtube-transcript`, {
            params: { videoId }
        });
        return response.data?.transcript || '';
    } catch (error) {
        console.error('Error fetching YouTube transcript:', error);
        return '';
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
        const response = await axios.get(`${LOCAL_API_BASE_URL}/reddit/hot`, {
            params: {
                subreddit,
                limit
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
        const response = await axios.get(`${LOCAL_API_BASE_URL}/reddit/comments`, {
            params: {
                subreddit,
                postId
            }
        });
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

export const summarizeVideoTranscript = async ({ title, transcript, description = '', language = 'en' }) => {
    const locale = language === 'ru' ? 'Russian' : 'English';
    const sourceMaterial = transcript?.trim() || description?.trim();

    if (!sourceMaterial) {
        return language === 'ru'
            ? 'Не удалось получить субтитры или описание для саммари.'
            : 'No transcript or description was available for summary generation.';
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.4,
            messages: [
                {
                    role: 'system',
                    content:
                        `You are an educational summarizer. Write a concise, high-signal summary of a video in ${locale}. ` +
                        `Focus on the core concepts, not filler. Keep it to one short paragraph followed by 3 bullet-style key takeaways.`
                },
                {
                    role: 'user',
                    content:
                        `Video title:\n${title.trim()}\n\n` +
                        `Source material:\n${sourceMaterial}`
                }
            ],
            max_tokens: 350
        });

        return response.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
        console.error('Error generating transcript summary:', error);
        throw new Error(
            language === 'ru'
                ? 'Сейчас не получилось создать summary по субтитрам.'
                : 'Could not generate a transcript summary right now.'
        );
    }
};

const parseJsonResponse = (rawContent) => {
    if (!rawContent) {
        throw new Error('Empty response from OpenAI.');
    }

    try {
        return JSON.parse(rawContent);
    } catch {
        const match = rawContent.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]);
        }
        throw new Error('Could not parse OpenAI response.');
    }
};

export const evaluateExplainBack = async ({ topic, sourceText, explanation, language = 'en' }) => {
    const locale = language === 'ru' ? 'Russian' : 'English';

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.4,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content:
                        `You are an expert educational evaluator. Assess a student's explanation of a topic. ` +
                        `Return strict JSON with these keys only: overallScore, confidenceLevel, criteria, strengths, gaps, nextStep, sampleRewrite. ` +
                        `criteria must contain completeness, accuracy, depth, confidence. Each criterion must have score and feedback. ` +
                        `overallScore must be a number from 1 to 10. confidenceLevel must be one of: Low, Medium, High. ` +
                        `strengths and gaps must be arrays of short bullet-style strings. ` +
                        `sampleRewrite and nextStep must be concise. Write the content in ${locale}.`
                },
                {
                    role: 'user',
                    content:
                        `Topic:\n${topic.trim()}\n\n` +
                        `Source material or context:\n${(sourceText || 'Not provided').trim()}\n\n` +
                        `Student explanation:\n${explanation.trim()}`
                }
            ],
            max_tokens: 900
        });

        const content = response.choices?.[0]?.message?.content;
        const parsed = parseJsonResponse(content);

        return {
            overallScore: parsed.overallScore ?? 0,
            confidenceLevel: parsed.confidenceLevel ?? 'Medium',
            criteria: parsed.criteria ?? {},
            strengths: parsed.strengths ?? [],
            gaps: parsed.gaps ?? [],
            nextStep: parsed.nextStep ?? '',
            sampleRewrite: parsed.sampleRewrite ?? ''
        };
    } catch (error) {
        console.error('Error evaluating explain-back response:', error);
        throw new Error(
            error?.message?.includes('API key')
                ? 'OpenAI API key is missing or invalid.'
                : 'Explain Back evaluation is unavailable right now.'
        );
    }
};

export const generateExplainBackFollowUps = async ({ topic, sourceText, explanation, language = 'en' }) => {
    const locale = language === 'ru' ? 'Russian' : 'English';

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.5,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content:
                        `You are an educational tutor. A student gave an initial explanation of a topic. ` +
                        `Do not grade yet. Instead, ask 2 or 3 short guiding follow-up questions that help reveal whether the student truly understands the idea. ` +
                        `Questions should probe missing concepts, causal understanding, or ability to apply the idea. ` +
                        `For each question, also provide a short ideal reference answer grounded in the source material. ` +
                        `Return strict JSON with keys only: summary, followUpQuestions, referenceAnswers. ` +
                        `summary must be one short sentence about what still needs clarification. ` +
                        `followUpQuestions must be an array of 2 or 3 concise strings. ` +
                        `referenceAnswers must be an array of the same length with short correct answers. ` +
                        `Write everything in ${locale}.`
                },
                {
                    role: 'user',
                    content:
                        `Topic:\n${topic.trim()}\n\n` +
                        `Source material or context:\n${(sourceText || 'Not provided').trim()}\n\n` +
                        `Student explanation:\n${explanation.trim()}`
                }
            ],
            max_tokens: 400
        });

        const content = response.choices?.[0]?.message?.content;
        const parsed = parseJsonResponse(content);

        return {
            summary: parsed.summary ?? '',
            followUpQuestions: parsed.followUpQuestions ?? [],
            referenceAnswers: parsed.referenceAnswers ?? []
        };
    } catch (error) {
        console.error('Error generating explain-back follow-up questions:', error);
        throw new Error('Could not generate guiding questions right now.');
    }
};

export const evaluateExplainBackWithFollowUps = async ({
    topic,
    sourceText,
    explanation,
    followUpQA,
    language = 'en'
}) => {
    const locale = language === 'ru' ? 'Russian' : 'English';

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.35,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content:
                        `You are an expert educational evaluator. Assess a student's understanding based on an initial explanation and short answers to guiding questions. ` +
                        `Be fair and not overly harsh. If the follow-up answers clarify the idea correctly, raise the score accordingly. ` +
                        `Return strict JSON with these keys only: overallScore, confidenceLevel, criteria, strengths, gaps, nextStep, sampleRewrite, highlights, followUpHighlights. ` +
                        `criteria must contain completeness, accuracy, depth, confidence. Each criterion must have score and feedback. ` +
                        `overallScore must be a number from 1 to 10. confidenceLevel must be one of: Low, Medium, High. ` +
                        `strengths and gaps must be arrays of short bullet-style strings. ` +
                        `sampleRewrite and nextStep must be concise. ` +
                        `highlights must be an object with keys correctTerms and incorrectTerms, both arrays of short exact phrases taken from the student's initial explanation. ` +
                        `followUpHighlights must be an array where each item has keys correctTerms and incorrectTerms for the corresponding follow-up answer. ` +
                        `Use only short phrases that literally appear in the student's text. Write the content in ${locale}.`
                },
                {
                    role: 'user',
                    content:
                        `Topic:\n${topic.trim()}\n\n` +
                        `Source material or context:\n${(sourceText || 'Not provided').trim()}\n\n` +
                        `Initial student explanation:\n${explanation.trim()}\n\n` +
                        `Follow-up questions and answers:\n${followUpQA.trim()}`
                }
            ],
            max_tokens: 900
        });

        const content = response.choices?.[0]?.message?.content;
        const parsed = parseJsonResponse(content);

        return {
            overallScore: parsed.overallScore ?? 0,
            confidenceLevel: parsed.confidenceLevel ?? 'Medium',
            criteria: parsed.criteria ?? {},
            strengths: parsed.strengths ?? [],
            gaps: parsed.gaps ?? [],
            nextStep: parsed.nextStep ?? '',
            sampleRewrite: parsed.sampleRewrite ?? '',
            highlights: parsed.highlights ?? { correctTerms: [], incorrectTerms: [] },
            followUpHighlights: parsed.followUpHighlights ?? []
        };
    } catch (error) {
        console.error('Error evaluating explain-back with follow-ups:', error);
        throw new Error('Final Explain Back evaluation is unavailable right now.');
    }
};
