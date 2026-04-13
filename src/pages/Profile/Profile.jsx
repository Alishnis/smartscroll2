import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { fetchUserProfile, fetchUserSummaries } from '../../lib/db';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Profile.css';

const Profile = () => {
    const { language } = useLanguage();
    const t = translations[language].profile;
    const [profile, setProfile] = useState(null);
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfileData = async () => {
            setLoading(true);
            const [profileData, summariesData] = await Promise.all([
                fetchUserProfile(),
                fetchUserSummaries()
            ]);
            setProfile(profileData);
            setSummaries(summariesData);
            setLoading(false);
        };
        loadProfileData();
    }, []);

    if (loading) {
        return (
            <div className="page-container profile-page">
                <header className="page-header profile-header">
                    <div>
                        <div className="skeleton title" style={{ width: '140px' }}></div>
                        <div className="skeleton bar" style={{ width: '180px', marginTop: '8px' }}></div>
                    </div>
                    <div className="skeleton avatar" style={{ width: '40px', height: '40px' }}></div>
                </header>

                <div className="stats-grid">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="stat-card glass">
                            <div className="skeleton avatar" style={{ width: '60px', height: '60px', borderRadius: '14px' }}></div>
                            <div style={{ flex: 1 }}>
                                <div className="skeleton bar" style={{ width: '50%', height: '24px', marginBottom: '6px' }}></div>
                                <div className="skeleton bar-short" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="saved-summaries">
                    <div className="section-header">
                        <div className="skeleton bar" style={{ width: '180px', height: '20px' }}></div>
                        <div className="skeleton bar" style={{ width: '60px' }}></div>
                    </div>
                    <div className="summary-list">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="summary-item glass">
                                <div className="skeleton circle"></div>
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton bar" style={{ width: '60%', marginBottom: '8px' }}></div>
                                    <div className="skeleton bar-short"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

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
            </div>

            <div className="saved-summaries">
                <div className="section-header">
                    <h2>{t.recent_summaries}</h2>
                    <button className="view-all-btn">{t.view_all}</button>
                </div>

                <div className="summary-list">
                    {summaries.length === 0 ? (
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
        </div>
    );
};

export default Profile;
