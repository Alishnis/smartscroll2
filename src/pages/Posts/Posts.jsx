import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Share2, MoreHorizontal, SlidersHorizontal, X, Brain } from 'lucide-react';
import { fetchRedditPosts } from '../../lib/api';
import { REDDIT_CATEGORIES } from '../../lib/redditCategories';
import Skeleton from '../../components/Skeleton/Skeleton';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import PostModal from '../../components/PostModal/PostModal';
import ExplainBackModal from '../../components/ExplainBackModal/ExplainBackModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Posts.css';

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

const Posts = () => {
    const { user } = useAuth();
    const userId = user?.id || '00000000-0000-0000-0000-000000000001';
    const { language } = useLanguage();
    const t = translations[language].posts;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(REDDIT_CATEGORIES[0]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [includeImages, setIncludeImages] = useState(true);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [explainPost, setExplainPost] = useState(null);

    useEffect(() => {
        const getPosts = async () => {
            setLoading(true);
            const subredditQuery = selectedCategory.subreddits.join('+');
            const data = await fetchRedditPosts(subredditQuery, 10); // Fetch more posts as some subreddits might be less active
            setPosts(data);
            setLoading(false);
        };
        getPosts();
    }, [selectedCategory]);

    return (
        <div className="page-container posts-page">
            <header className="page-header" style={{ marginBottom: 'var(--space-3)' }}>
                <h1 className="tech-font text-gradient">{t.title}</h1>
                <p className="subtitle">{t.subtitle}</p>
            </header>

            <div className="posts-header-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', gap: 'var(--space-3)' }}>
                <div className="posts-filter-menu" style={{ marginBottom: 0, paddingBottom: 0, flex: 1 }}>
                    {REDDIT_CATEGORIES.map((category) => (
                        <button
                            key={category.name}
                            className={`filter-chip ${selectedCategory.name === category.name ? 'active' : ''} ${category.name === 'All' ? 'filter-all' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <button
                    className="filter-chip"
                    onClick={() => setIsFilterMenuOpen(true)}
                    style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <SlidersHorizontal size={16} />
                    Filters
                </button>
            </div>

            <div className="posts-container">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="post-card glass" style={{ backgroundColor: 'transparent' }}>
                            <div className="post-votes">
                                <Skeleton type="avatar" count={1} style={{ width: '20px', height: '20px' }} />
                                <Skeleton type="text" count={1} style={{ width: '30px', margin: '10px 0' }} />
                                <Skeleton type="avatar" count={1} style={{ width: '20px', height: '20px' }} />
                            </div>
                            <div className="post-content" style={{ width: '100%' }}>
                                <Skeleton type="title" />
                                <Skeleton type="post" />
                            </div>
                        </div>
                    ))
                ) : (
                    posts.filter((postWrapper) => {
                        if (includeImages) return true;
                        const p = postWrapper.data;
                        const hasImage = p.post_hint === 'image' || p.is_gallery || (p.domain && p.domain.includes('i.redd.it')) || (p.url && p.url.match(/\.(jpeg|jpg|gif|png)$/i));
                        return !hasImage;
                    }).map((postWrapper) => {
                        const post = postWrapper.data;
                        const imageUrl = getPostImage(post);
                        return (
                            <SpotlightCard
                                key={post.id}
                                className="post-card clickable"
                                onClick={() => setSelectedPost(post)}
                            >
                                <div className="post-votes">
                                    <ArrowUp className="vote-btn" size={20} />
                                    <span className="vote-count">{post.score >= 1000 ? (post.score / 1000).toFixed(1) + 'k' : post.score}</span>
                                    <ArrowDown className="vote-btn" size={20} />
                                </div>
                                <div className="post-content">
                                    <div className="post-meta">
                                        <span className="community-name">r/{post.subreddit}</span>
                                        <span className="post-author">• {t.posted_by}{post.author}</span>
                                    </div>
                                    <h2 className="post-title" dangerouslySetInnerHTML={{ __html: post.title }}></h2>
                                    {imageUrl && (
                                        <div className="post-image-wrap">
                                            <img src={imageUrl} alt={post.title} className="post-image" />
                                        </div>
                                    )}
                                    <p className="text-secondary">{post.selftext ? post.selftext.substring(0, 150) + '...' : t.link_post}</p>

                                    <div className="post-actions">
                                        <button className="action-btn"><MessageSquare size={16} /> {post.num_comments} {t.comments}</button>
                                        <button className="action-btn"><Share2 size={16} /> {t.share}</button>
                                        <button
                                            className="action-btn explain-action-btn"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setExplainPost(post);
                                            }}
                                        >
                                            <Brain size={16} /> {t.explain_back}
                                        </button>
                                        <button className="action-btn icon-only"><MoreHorizontal size={16} /></button>
                                    </div>
                                </div>
                            </SpotlightCard>
                        );
                    })
                )}
            </div>

            {selectedPost && (
                <PostModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onExplainBack={(post) => setExplainPost(post)}
                />
            )}

            <ExplainBackModal
                isOpen={Boolean(explainPost)}
                onClose={() => setExplainPost(null)}
                sourceLabel={t.explain_post_label}
                initialTopic={explainPost?.title || ''}
                initialSourceText={
                    explainPost
                        ? `${explainPost.title}\n\n${explainPost.selftext || ''}\n\nSubreddit: r/${explainPost.subreddit}`
                        : ''
                }
                contentId={explainPost?.id || ''}
                contentType="reddit"
                sourceTitle={explainPost?.title || ''}
                userId={userId}
            />

            {isFilterMenuOpen && (
                <div className="filter-menu-overlay" onClick={() => setIsFilterMenuOpen(false)}>
                    <div className="filter-menu-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="filter-menu-header">
                            <h3>Filters</h3>
                            <button className="close-filter-btn" onClick={() => setIsFilterMenuOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="filter-group">
                            <h4>Media</h4>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="media-filter"
                                    checked={includeImages}
                                    onChange={() => setIncludeImages(true)}
                                />
                                <span>All Posts</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="media-filter"
                                    checked={!includeImages}
                                    onChange={() => setIncludeImages(false)}
                                />
                                <span>Text Only</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Posts;
