import React, { useEffect, useState, useRef } from 'react';
import { Heart, Eye, MoreVertical, Share2, EyeOff, ArrowLeft, Search, Brain, FileText, LoaderCircle } from 'lucide-react';
import { fetchYouTubeTranscript, fetchYouTubeVideos, summarizeVideoTranscript } from '../../lib/api';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import ExplainBackModal from '../../components/ExplainBackModal/ExplainBackModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import NoteTaker from './NoteTaker';
import './Feed.css';

const Feed = () => {
    const { user } = useAuth();
    const userId = user?.id || '00000000-0000-0000-0000-000000000001';
    const { language } = useLanguage();
    const t = translations[language].feed;
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [currentQuery, setCurrentQuery] = useState('educational tech tutorials');
    const [openMenu, setOpenMenu] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [explainVideo, setExplainVideo] = useState(null);
    const [videoSummary, setVideoSummary] = useState(null);
    const [summaryLoadingId, setSummaryLoadingId] = useState('');
    const menuRef = useRef(null);
    const transcriptCacheRef = useRef({});
    const summaryCacheRef = useRef({});

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

    const buildVideoSourceText = (video, transcript = '') => {
        const transcriptBlock = transcript
            ? `Transcript:\n${transcript}`
            : `Description:\n${video.snippet.description || t.explain_transcript_fallback}`;

        return `${video.snippet.title}\n\n${transcriptBlock}\n\nChannel: ${video.snippet.channelTitle}`;
    };

    const getTranscriptForVideo = async (video) => {
        const videoId = video?.id?.videoId;
        if (!videoId) return '';

        if (transcriptCacheRef.current[videoId]) {
            return transcriptCacheRef.current[videoId];
        }

        const transcript = await fetchYouTubeTranscript(videoId);
        if (transcript) {
            transcriptCacheRef.current[videoId] = transcript;
        }
        return transcript;
    };

    const openExplainBackForVideo = async (video) => {
        setSelectedVideo(video);
        setVideoSummary(null);
        setExplainVideo({
            video,
            sourceText: buildVideoSourceText(video),
        });

        const transcript = await getTranscriptForVideo(video);
        if (!transcript) return;

        setExplainVideo((current) => {
            if (!current || current.video.id.videoId !== video.id.videoId) {
                return current;
            }

            return {
                ...current,
                sourceText: buildVideoSourceText(video, transcript),
            };
        });
    };

    const openSummaryForVideo = async (video) => {
        const videoId = video?.id?.videoId;
        if (!videoId) return;

        setSelectedVideo(video);
        setExplainVideo(null);

        if (summaryCacheRef.current[videoId]) {
            setVideoSummary({
                video,
                text: summaryCacheRef.current[videoId],
            });
            return;
        }

        setSummaryLoadingId(videoId);
        setVideoSummary({
            video,
            text: '',
            isLoading: true,
        });

        try {
            const transcript = await getTranscriptForVideo(video);
            const summaryText = await summarizeVideoTranscript({
                title: video.snippet.title,
                transcript,
                description: video.snippet.description || t.explain_transcript_fallback,
                language
            });

            summaryCacheRef.current[videoId] = summaryText;
            setVideoSummary({
                video,
                text: summaryText,
                isLoading: false,
            });
        } catch (error) {
            setVideoSummary({
                video,
                text: error.message || t.summary_error,
                isLoading: false,
            });
        } finally {
            setSummaryLoadingId('');
        }
    };

    return (
        <div className="page-container feed-page">
            <header className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {selectedVideo && (
                        <button
                            onClick={() => {
                                setSelectedVideo(null);
                                setExplainVideo(null);
                                setVideoSummary(null);
                            }}
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
                <div className={`video-player-container${(explainVideo || videoSummary) ? ' video-player-container--split' : ''}`}>
                    <div className="video-player-main">
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
                            <div className="video-action-row">
                                <button
                                    className="inline-explain-btn"
                                    onClick={() => openExplainBackForVideo(selectedVideo)}
                                    type="button"
                                >
                                    <Brain size={16} />
                                    {t.explain_back}
                                </button>
                                <button
                                    className="inline-explain-btn inline-summary-btn"
                                    onClick={() => openSummaryForVideo(selectedVideo)}
                                    type="button"
                                    disabled={summaryLoadingId === selectedVideo.id.videoId}
                                >
                                    {summaryLoadingId === selectedVideo.id.videoId ? <LoaderCircle size={16} className="spin" /> : <FileText size={16} />}
                                    {t.summary}
                                </button>
                            </div>

                        </div>
                    </div>

                    {explainVideo ? (
                        <div className="explain-split-panel">
                            <ExplainBackModal
                                isOpen={Boolean(explainVideo)}
                                onClose={() => setExplainVideo(null)}
                                sourceLabel={t.explain_video_label}
                                initialTopic={explainVideo?.video?.snippet?.title || ''}
                                initialSourceText={explainVideo?.sourceText || ''}
                                contentId={explainVideo?.video?.id?.videoId || ''}
                                contentType="youtube"
                                sourceTitle={explainVideo?.video?.snippet?.title || ''}
                                userId={userId}
                                variant="embedded"
                            />
                        </div>
                    ) : null}

                    {!explainVideo && videoSummary?.video?.id?.videoId === selectedVideo.id.videoId ? (
                        <div className="explain-split-panel">
                            <SpotlightCard className="video-summary-panel">
                                <button
                                    className="video-summary-close"
                                    type="button"
                                    onClick={() => setVideoSummary(null)}
                                >
                                    <ArrowLeft size={16} />
                                    {t.close_summary}
                                </button>
                                <div className="video-summary-card__header">
                                    <span className="video-summary-chip">{t.summary_chip}</span>
                                    <h3>{t.summary_title}</h3>
                                    <p>{selectedVideo.snippet.channelTitle}</p>
                                </div>
                                <div className="video-summary-content">
                                    {videoSummary.isLoading ? (
                                        <p>{t.summary_loading}</p>
                                    ) : (
                                        <p>{videoSummary.text}</p>
                                    )}
                                </div>
                            </SpotlightCard>
                        </div>
                    ) : null}
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
                                        <button
                                            className="inline-explain-btn inline-explain-btn--card"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openExplainBackForVideo(video);
                                            }}
                                        >
                                            <Brain size={15} />
                                            {t.explain_back}
                                        </button>
                                        <button
                                            className="inline-explain-btn inline-explain-btn--card inline-summary-btn"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openSummaryForVideo(video);
                                            }}
                                            disabled={summaryLoadingId === video.id.videoId}
                                        >
                                            {summaryLoadingId === video.id.videoId ? <LoaderCircle size={15} className="spin" /> : <FileText size={15} />}
                                            {t.summary}
                                        </button>
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
