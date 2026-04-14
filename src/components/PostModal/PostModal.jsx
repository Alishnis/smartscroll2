import React, { useEffect, useState } from 'react';
import { X, MessageSquare, ArrowUp, ArrowDown, Brain } from 'lucide-react';
import { fetchRedditPostComments } from '../../lib/api';
import Skeleton from '../Skeleton/Skeleton';
import './PostModal.css';

const decodeHtml = (value) => value ? value.replace(/&amp;/g, '&') : value;
const isImageUrl = (value) => typeof value === 'string' && /\.(jpe?g|png|gif|webp)$/i.test(value);

const getPostImage = (post) => {
    if (!post) return null;

    if (post.preview?.images?.length) {
        const source = post.preview.images[0].source?.url;
        if (source) return decodeHtml(source);
    }

    if (post.is_gallery && post.media_metadata) {
        const firstKey = Object.keys(post.media_metadata)[0];
        const media = post.media_metadata[firstKey];
        const url = media?.s?.u || media?.p?.[media.p.length - 1]?.u;
        if (url) return decodeHtml(url);
    }

    if (post.post_hint === 'image' && post.url) {
        return decodeHtml(post.url);
    }

    const fallbackUrl = post.url_overridden_by_dest || post.url;
    if (isImageUrl(fallbackUrl)) {
        return decodeHtml(fallbackUrl);
    }

    if (post.thumbnail && post.thumbnail.startsWith('http')) {
        return decodeHtml(post.thumbnail);
    }

    return null;
};

const PostModal = ({ post, onClose, onExplainBack }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const imageUrl = getPostImage(post);

    useEffect(() => {
        const loadComments = async () => {
            setLoading(true);
            const data = await fetchRedditPostComments(post.subreddit, post.id);
            setComments(data);
            setLoading(false);
        };
        if (post) {
            loadComments();
        }
    }, [post]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!post) return null;

    return (
        <div className="post-modal-overlay" onClick={onClose}>
            <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
                <a
                    href={`https://reddit.com${post.permalink}`}
                    target="_blank"
                    rel="noreferrer"
                    className="view-reddit-btn"
                >
                    View on Reddit
                </a>
                <button className="close-modal-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="post-modal-header">
                    <div className="post-meta">
                        <span className="community-name">r/{post.subreddit}</span>
                        <span className="post-author" style={{ marginLeft: '8px' }}>• Posted by {post.author}</span>
                    </div>
                </div>

                <div className="post-modal-body custom-scrollbar">
                    <h2 className="post-title" dangerouslySetInnerHTML={{ __html: post.title }} style={{ marginBottom: '12px' }}></h2>

                    {imageUrl && (
                        <div className="post-modal-image-wrap">
                            <img src={imageUrl} alt={post.title} className="post-modal-image" />
                        </div>
                    )}

                    {post.selftext && (
                        <div className="post-full-text">
                            {post.selftext}
                        </div>
                    )}

                    <div className="post-actions" style={{ marginTop: '16px', marginBottom: '24px' }}>
                        <span className="action-btn icon-only" style={{ cursor: 'default', paddingLeft: 0 }}><ArrowUp size={16} /> {post.score >= 1000 ? (post.score / 1000).toFixed(1) + 'k' : post.score} <ArrowDown size={16} /></span>
                        <span className="action-btn" style={{ cursor: 'default' }}><MessageSquare size={16} /> {post.num_comments} Comments</span>
                        {onExplainBack && (
                            <button className="action-btn post-modal-explain-btn" onClick={() => onExplainBack(post)}>
                                <Brain size={16} />
                                Explain Back
                            </button>
                        )}
                    </div>

                    <div className="comments-section">
                        <h3 className="comments-title">Discussion</h3>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="comment-card">
                                    <Skeleton type="text" style={{ width: '100px', marginBottom: '8px' }} />
                                    <Skeleton type="post" lines={2} />
                                </div>
                            ))
                        ) : (
                            comments.map((commentWrapper) => {
                                const comment = commentWrapper.data;
                                // Basic check to skip 'more' items at the end of reddit comment threads
                                if (!comment.body || commentWrapper.kind === 'more') return null;
                                return (
                                    <div key={comment.id} className="comment-card">
                                        <div className="comment-meta">
                                            <span className="comment-author">{comment.author}</span>
                                            <span>•</span>
                                            <span>{comment.score} votes</span>
                                        </div>
                                        <div className="comment-body" dangerouslySetInnerHTML={{ __html: comment.body }}></div>
                                    </div>
                                );
                            })
                        )}
                        {!loading && comments.length === 0 && (
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No comments found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
