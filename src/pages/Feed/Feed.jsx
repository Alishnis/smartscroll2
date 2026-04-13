import React, { useEffect, useState, useRef } from 'react';
import { Heart, Eye, MoreVertical, Share2, EyeOff, ArrowLeft, Search } from 'lucide-react';
import { fetchYouTubeVideos } from '../../lib/api';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import NoteTaker from './NoteTaker';
import './Feed.css';

const Feed = () => {
    const { language } = useLanguage();
    const t = translations[language].feed;
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [currentQuery, setCurrentQuery] = useState('educational tech tutorials');
    const [openMenu, setOpenMenu] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const getVideos = async () => {
            setLoading(true);
            const data = await fetchYouTubeVideos(currentQuery, 9);
            setVideos(data);
            setLoading(false);
        };
        getVideos();
    }, [currentQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setCurrentQuery(searchInput.trim());
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="page-container feed-page">
            <header className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {selectedVideo && (
                        <button
                            onClick={() => setSelectedVideo(null)}
                            style={{
                                background: 'var(--color-surface)',
                                color: 'var(--color-text-primary)',
                                border: '1px solid var(--color-border-default)',
                                borderRadius: 'var(--radius-md)',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                            title="Back to Feed"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h1 className="tech-font text-gradient">{selectedVideo ? selectedVideo.snippet.title : t.title}</h1>
                </div>
                {!selectedVideo && (
                    <form className="feed-search-form" onSubmit={handleSearch}>
                        <div className="search-input-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                className="feed-search-input"
                                placeholder="Search videos..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="feed-search-btn">
                            Search
                        </button>
                    </form>
                )}
            </header>

            {selectedVideo ? (
                <div className="video-player-container">
                    <div className="video-section">
                        <SpotlightCard className="video-player-card" style={{ padding: '0', height: '100%', overflow: 'hidden' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1`}
                                title={selectedVideo.snippet.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ border: 'none', background: '#000' }}
                            ></iframe>
                        </SpotlightCard>
                    </div>
                    <div className="notes-section">
                        <NoteTaker />
                    </div>
                </div>
            ) : (
                <div className="feed-content">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton-thumb"></div>
                                <div className="skeleton-card-info">
                                    <div className="skeleton circle"></div>
                                    <div className="skeleton-card-lines">
                                        <div className="skeleton bar" style={{ width: '90%' }}></div>
                                        <div className="skeleton bar-short"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        videos.map((video) => (
                            <div key={video.id.videoId} className={`video-card-wrapper${openMenu === video.id.videoId ? ' menu-open' : ''}`}>
                                <SpotlightCard className="video-card" onClick={() => setSelectedVideo(video)}>
                                    <div
                                        className="video-thumb"
                                        style={{
                                            backgroundImage: `url(${video.snippet.thumbnails.high.url})`,
                                        }}
                                    ></div>

                                    <div className="video-meta">
                                        <h2 className="video-title">{video.snippet.title}</h2>
                                        <p className="video-channel">{video.snippet.channelTitle}</p>
                                        <div className="video-stats-row">
                                            <span className="video-stat"><Heart size={13} /> 2.6k</span>
                                            <span className="video-stat"><Eye size={13} /> 8.6k</span>
                                            <div className="video-more-wrap" ref={openMenu === video.id.videoId ? menuRef : null}>
                                                <button
                                                    className="video-more-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenu(openMenu === video.id.videoId ? null : video.id.videoId);
                                                    }}
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                                {openMenu === video.id.videoId && (
                                                    <div className="video-dropdown">
                                                        <button className="dropdown-item" onClick={() => setOpenMenu(null)}>
                                                            <Share2 size={14} /> {t.share}
                                                        </button>
                                                        <button className="dropdown-item" onClick={() => setOpenMenu(null)}>
                                                            <EyeOff size={14} /> {t.not_interested}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Feed;
