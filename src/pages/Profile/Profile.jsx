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
import { fetchYouTubeVideosByIds } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Profile.css';

const FALLBACK_USER_ID = '00000000-0000-0000-0000-000000000001';
const PAGE_TIMEOUT_MS = 1400;

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

    const ownedAccessoryIds = new Set(purchases.map((item) => item.accessory_id));
    const equippedAccessory = ACCESSORY_CATALOG.find(
        (item) => item.id === gamification?.equipped_accessory_id
    );

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
                        <h3>{profile?.time_saved_hours || 0}h</h3>
                        <p className="text-secondary">{t.time_saved}</p>
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
                            return (
                                <SpotlightCard key={summary.id} className="summary-item">
                                    <div className="summary-icon"><IconComponent size={16} /></div>
                                    <div className="summary-info">
                                        <h4>{summary.title}</h4>
                                        <p className="text-secondary">{summary.content}</p>
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
        </div>
    );
};

export default Profile;
