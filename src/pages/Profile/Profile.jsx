import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { useAuth } from '../../context/AuthContext';
import {
    equipProfileAccessory,
    fetchGamificationProfile,
    fetchUserAccessoryPurchases,
    fetchUserProfile,
    fetchUserSummaries,
    fetchUserVideoNotes,
    purchaseProfileAccessory
} from '../../lib/db';
import { ACCESSORY_CATALOG } from '../../lib/accessories';
import { fetchYouTubeVideoById, fetchYouTubeVideosByIds } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Profile.css';

const FALLBACK_USER_ID = '00000000-0000-0000-0000-000000000001';
const PAGE_TIMEOUT_MS = 1400;
const SUMMARY_VIDEO_MARKER_REGEX = /\n?\n?\[\[smartscroll_video:([A-Za-z0-9_-]{6,})\]\]\s*$/;
const SECONDS_PER_MINUTE = 60;

const formatTimeSpent = (totalSeconds) => {
    const normalizedSeconds = Math.max(0, Math.floor(Number(totalSeconds || 0)));
    const hours = Math.floor(normalizedSeconds / 3600);
    const minutes = Math.floor((normalizedSeconds % 3600) / 60);
    const seconds = normalizedSeconds % 60;

    return [hours, minutes, seconds]
        .map((value) => String(value).padStart(2, '0'))
        .join(':');
};

const parseSavedSummary = (summary) => {
    const rawContent = String(summary?.content || '');
    const markerMatch = rawContent.match(SUMMARY_VIDEO_MARKER_REGEX);
    const sourceVideoId = markerMatch?.[1] || '';
    const plainContent = rawContent.replace(SUMMARY_VIDEO_MARKER_REGEX, '').trim();

    return {
        ...summary,
        sourceVideoId,
        plainContent
    };
};

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
    const userId = user?.id || FALLBACK_USER_ID;
    const { language } = useLanguage();
    const t = translations[language].profile;
    const [profile, setProfile] = useState(null);
    const [gamification, setGamification] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [summaries, setSummaries] = useState([]);
    const [writtenNotes, setWrittenNotes] = useState([]);
    const [noteVideoMap, setNoteVideoMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [busyAccessoryId, setBusyAccessoryId] = useState(null);
    const [selectedSummary, setSelectedSummary] = useState(null);
    const [selectedSummaryVideo, setSelectedSummaryVideo] = useState(null);
    const [loadingSummaryVideo, setLoadingSummaryVideo] = useState(false);
    const [pendingSeconds, setPendingSeconds] = useState(0);
    const [syncedSecondsCorrection, setSyncedSecondsCorrection] = useState(0);

    const loadProfileData = async () => {
        setLoading(true);
        try {
            const withTimeout = (promise, fallback) => Promise.race([
                promise,
                new Promise((resolve) => {
                    window.setTimeout(() => resolve(fallback), PAGE_TIMEOUT_MS);
                })
            ]);

            const [profileData, summariesData, gamificationData, purchasesData, videoNotesData] = await Promise.all([
                withTimeout(fetchUserProfile(userId), null),
                withTimeout(fetchUserSummaries(userId), []),
                withTimeout(fetchGamificationProfile(userId), null),
                withTimeout(fetchUserAccessoryPurchases(userId), []),
                withTimeout(fetchUserVideoNotes(userId), [])
            ]);

            setProfile(profileData);
            setSummaries(summariesData);
            setGamification(gamificationData);
            setPurchases(purchasesData);
            setWrittenNotes(videoNotesData);
            setLoading(false);

            const noteVideoIds = videoNotesData.map((note) => note.video_id).filter(Boolean);
            const videoDetails = await withTimeout(fetchYouTubeVideosByIds(noteVideoIds), []);
            const videoMap = Object.fromEntries(videoDetails.map((video) => [video.id.videoId, video]));
            setNoteVideoMap(videoMap);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) {
            return;
        }
        loadProfileData().catch((error) => {
            console.error('Error loading profile page:', error);
            setLoading(false);
        });
    }, [authLoading, userId]);

    useEffect(() => {
        const storageKey = `smartscroll-pending-seconds-${userId}`;
        let previousPendingSeconds = Number(localStorage.getItem(storageKey) || '0');
        setPendingSeconds(previousPendingSeconds);
        setSyncedSecondsCorrection(0);

        const syncPendingSeconds = () => {
            const nextPendingSeconds = Number(localStorage.getItem(storageKey) || '0');
            if (nextPendingSeconds < previousPendingSeconds) {
                const syncedDelta = previousPendingSeconds - nextPendingSeconds;
                setSyncedSecondsCorrection((current) => current + syncedDelta);
            }
            previousPendingSeconds = nextPendingSeconds;
            setPendingSeconds(nextPendingSeconds);
        };

        const handleTimeUpdate = (event) => {
            if (event?.detail?.userId !== userId) {
                return;
            }
            syncPendingSeconds();
        };

        const intervalId = window.setInterval(syncPendingSeconds, 1000);
        window.addEventListener('smartscroll-time-spent-updated', handleTimeUpdate);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener('smartscroll-time-spent-updated', handleTimeUpdate);
        };
    }, [userId]);

    const ownedAccessoryIds = new Set(purchases.map((item) => item.accessory_id));
    const equippedAccessory = ACCESSORY_CATALOG.find(
        (item) => item.id === gamification?.equipped_accessory_id
    );
    const totalTrackedSeconds = (
        Number(gamification?.total_minutes_spent || 0) * SECONDS_PER_MINUTE
    ) + syncedSecondsCorrection + pendingSeconds;

    const handleAccessoryAction = async (accessory) => {
        setBusyAccessoryId(accessory.id);

        if (ownedAccessoryIds.has(accessory.id)) {
            await equipProfileAccessory({
                userId,
                accessoryId: accessory.id
            });
        } else {
            await purchaseProfileAccessory({
                userId,
                accessoryId: accessory.id,
                price: accessory.price,
                title: accessory.title,
                category: accessory.category
            });
        }

        await loadProfileData();
        setBusyAccessoryId(null);
    };

    const openSummaryDetails = async (summary) => {
        const parsedSummary = parseSavedSummary(summary);
        setSelectedSummary(parsedSummary);
        setSelectedSummaryVideo(null);

        if (!parsedSummary.sourceVideoId) {
            setLoadingSummaryVideo(false);
            return;
        }

        setLoadingSummaryVideo(true);
        const video = await fetchYouTubeVideoById(parsedSummary.sourceVideoId);
        setSelectedSummaryVideo(video);
        setLoadingSummaryVideo(false);
    };

    const closeSummaryDetails = () => {
        setSelectedSummary(null);
        setSelectedSummaryVideo(null);
        setLoadingSummaryVideo(false);
    };

    return (
        <div className="page-container profile-page">
            <header className="page-header profile-header">
                <div>
                    <h1 className="tech-font text-gradient">{profile?.username || t.guest_user}</h1>
                    <p className="subtitle">{profile?.role || t.knowledge_explorer}</p>
                </div>
                <Link to="/settings" className="icon-btn">
                    <LucideIcons.Settings size={20} />
                </Link>
            </header>

            <div className="stats-grid">
                <SpotlightCard className="stat-card stat-card--coins">
                    <div className="stat-icon" style={{ color: '#ffbf5f' }}><LucideIcons.Coins size={20} /></div>
                    <div className="stat-content">
                        <h3>{gamification?.smart_coins || 0}</h3>
                        <p className="text-secondary">{t.smart_coins}</p>
                    </div>
                </SpotlightCard>
                <SpotlightCard className="stat-card">
                    <div className="stat-icon"><LucideIcons.BookOpen size={20} className="accent-color" style={{ color: '#5E6AD2' }} /></div>
                    <div className="stat-content">
                        <h3>{profile?.summaries_read || 0}</h3>
                        <p className="text-secondary">{t.summaries_read}</p>
                    </div>
                </SpotlightCard>
                <SpotlightCard className="stat-card">
                    <div className="stat-icon" style={{ color: '#FFAA00' }}><LucideIcons.Clock size={20} /></div>
                    <div className="stat-content">
                        <h3>{formatTimeSpent(totalTrackedSeconds)}</h3>
                        <p className="text-secondary">{t.time_spent}</p>
                    </div>
                </SpotlightCard>
                <SpotlightCard className="stat-card">
                    <div className="stat-icon" style={{ color: '#5D87FF' }}><LucideIcons.Activity size={20} /></div>
                    <div className="stat-content">
                        <h3>{profile?.active_streaks || 0}</h3>
                        <p className="text-secondary">{t.active_streaks}</p>
                    </div>
                </SpotlightCard>
                <SpotlightCard className="stat-card">
                    <div className="stat-icon" style={{ color: equippedAccessory?.color || '#79ffe1' }}>
                        <LucideIcons.Sparkles size={20} />
                    </div>
                    <div className="stat-content">
                        <h3>{equippedAccessory?.title || t.no_accessory}</h3>
                        <p className="text-secondary">{t.equipped_accessory}</p>
                    </div>
                </SpotlightCard>
            </div>

            <div className="profile-shop">
                <div className="section-header">
                    <h2>{t.accessory_shop}</h2>
                    <span className="shop-balance">{t.balance_label}: {gamification?.smart_coins || 0}</span>
                </div>

                <div className="shop-grid">
                    {ACCESSORY_CATALOG.map((accessory) => {
                        const isOwned = ownedAccessoryIds.has(accessory.id);
                        const isEquipped = gamification?.equipped_accessory_id === accessory.id;
                        const isBusy = busyAccessoryId === accessory.id;

                        return (
                            <SpotlightCard key={accessory.id} className="shop-card">
                                <div className="shop-card__swatch" style={{ '--swatch-color': accessory.color }} />
                                <div className="shop-card__body">
                                    <div>
                                        <h4>{accessory.title}</h4>
                                        <p className="text-secondary">{accessory.description}</p>
                                    </div>
                                    <div className="shop-card__footer">
                                        <span className="shop-price">
                                            <LucideIcons.Coins size={14} />
                                            {accessory.price}
                                        </span>
                                        <button
                                            className={`shop-action-btn${isEquipped ? ' is-equipped' : ''}`}
                                            disabled={isBusy}
                                            onClick={() => handleAccessoryAction(accessory)}
                                        >
                                            {isBusy
                                                ? t.processing
                                                : isEquipped
                                                    ? t.equipped
                                                    : isOwned
                                                        ? t.equip
                                                        : t.buy}
                                        </button>
                                    </div>
                                </div>
                            </SpotlightCard>
                        );
                    })}
                </div>
            </div>

            <div className="saved-summaries">
                <div className="section-header">
                    <h2>{t.recent_summaries}</h2>
                    <button className="view-all-btn">{t.view_all}</button>
                </div>

                <div className="summary-list">
                    {loading && summaries.length === 0 ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="summary-item glass">
                                <div className="skeleton circle"></div>
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton bar" style={{ width: '60%', marginBottom: '8px' }}></div>
                                    <div className="skeleton bar-short"></div>
                                </div>
                            </div>
                        ))
                    ) : summaries.length === 0 ? (
                        <div className="text-secondary" style={{ padding: '24px 0' }}>{t.no_summaries}</div>
                    ) : (
                        summaries.map(summary => {
                            const IconComponent = LucideIcons[summary.icon_name] || LucideIcons.TrendingUp;
                            const parsedSummary = parseSavedSummary(summary);
                            return (
                                <SpotlightCard
                                    key={summary.id}
                                    className="summary-item summary-item--interactive"
                                    onClick={() => openSummaryDetails(summary)}
                                >
                                    <div className="summary-icon"><IconComponent size={16} /></div>
                                    <div className="summary-info">
                                        <h4>{summary.title}</h4>
                                        <p className="text-secondary summary-preview">{parsedSummary.plainContent}</p>
                                        <button
                                            type="button"
                                            className="written-note-link summary-open-btn"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                openSummaryDetails(summary);
                                            }}
                                        >
                                            {t.view_summary}
                                        </button>
                                    </div>
                                </SpotlightCard>
                            )
                        })
                    )}
                </div>
            </div>

            <div className="saved-summaries">
                <div className="section-header">
                    <h2>{t.written_notes}</h2>
                </div>

                <div className="summary-list">
                    {loading && writtenNotes.length === 0 ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="summary-item glass">
                                <div className="skeleton circle"></div>
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton bar" style={{ width: '60%', marginBottom: '8px' }}></div>
                                    <div className="skeleton bar-short"></div>
                                </div>
                            </div>
                        ))
                    ) : writtenNotes.length === 0 ? (
                        <div className="text-secondary" style={{ padding: '24px 0' }}>{t.no_written_notes}</div>
                    ) : (
                        writtenNotes.map((note) => {
                            const linkedVideo = noteVideoMap[note.video_id];
                            return (
                                <SpotlightCard key={note.id || note.video_id} className="summary-item written-note-item">
                                    <div className="summary-icon"><LucideIcons.NotebookPen size={16} /></div>
                                    <div className="summary-info">
                                        <h4>{linkedVideo?.snippet?.title || t.video_note_fallback}</h4>
                                        <p className="text-secondary">{note.content}</p>
                                        <Link className="written-note-link" to={`/feed?video=${note.video_id}`}>
                                            {t.open_video_note}
                                        </Link>
                                    </div>
                                </SpotlightCard>
                            );
                        })
                    )}
                </div>
            </div>

            {selectedSummary ? (
                <div className="profile-summary-modal-overlay" onClick={closeSummaryDetails}>
                    <div className="profile-summary-modal glass" onClick={(event) => event.stopPropagation()}>
                        <button type="button" className="profile-summary-modal__close" onClick={closeSummaryDetails}>
                            <LucideIcons.X size={18} />
                        </button>

                        <div className="profile-summary-modal__header">
                            <div>
                                <span className="video-summary-chip">{t.full_summary}</span>
                                <h3>{selectedSummary.title}</h3>
                            </div>
                        </div>

                        <div className="profile-summary-modal__grid">
                            <div className="profile-summary-modal__text">
                                <p>{selectedSummary.plainContent}</p>
                            </div>

                            <div className="profile-summary-modal__video">
                                <div className="profile-summary-modal__video-header">
                                    <span>{t.summary_video}</span>
                                    {selectedSummary.sourceVideoId ? (
                                        <Link className="written-note-link" to={`/feed?video=${selectedSummary.sourceVideoId}`}>
                                            {t.open_video_note}
                                        </Link>
                                    ) : null}
                                </div>

                                {loadingSummaryVideo ? (
                                    <div className="profile-summary-video-placeholder">{t.processing}</div>
                                ) : selectedSummaryVideo?.id?.videoId ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${selectedSummaryVideo.id.videoId}`}
                                        title={selectedSummaryVideo.snippet?.title || selectedSummary.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="profile-summary-video-placeholder">{t.summary_video_unavailable}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Profile;
