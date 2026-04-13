import React, { useEffect, useState } from 'react';
import { X, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';
import { fetchRedditPostComments } from '../../lib/api';
import Skeleton from '../Skeleton/Skeleton';
import './PostModal.css';

const PostModal = ({ post, onClose }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

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

                    {post.selftext && (
                        <div className="post-full-text">
                            {post.selftext}
                        </div>
                    )}

                    <div className="post-actions" style={{ marginTop: '16px', marginBottom: '24px' }}>
                        <span className="action-btn icon-only" style={{ cursor: 'default', paddingLeft: 0 }}><ArrowUp size={16} /> {post.score >= 1000 ? (post.score / 1000).toFixed(1) + 'k' : post.score} <ArrowDown size={16} /></span>
                        <span className="action-btn" style={{ cursor: 'default' }}><MessageSquare size={16} /> {post.num_comments} Comments</span>
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
