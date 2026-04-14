import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import Skeleton from '../../components/Skeleton/Skeleton';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { fetchGroups, fetchUserJoinedGroups, joinGroup, leaveGroup } from '../../lib/db';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Groups.css';

const Groups = () => {
    const { language } = useLanguage();
    const t = translations[language].groups;
    const navigate = useNavigate();
    const [publicGroups, setPublicGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [activeTab, setActiveTab] = useState('public'); // 'public' or 'my'
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState({});
    const [leaving, setLeaving] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const currentUserId = '00000000-0000-0000-0000-000000000001'; // Mock user ID

    useEffect(() => {
        const loadAllGroups = async () => {
            setLoading(true);
            const [allGroupsData, myGroupsData] = await Promise.all([
                fetchGroups(),
                fetchUserJoinedGroups(currentUserId)
            ]);

            setPublicGroups(allGroupsData);
            setMyGroups(myGroupsData);
            setLoading(false);
        };
        loadAllGroups();
    }, []);

    const handleJoin = async (groupId) => {
        setJoining(prev => ({ ...prev, [groupId]: true }));
        const success = await joinGroup(currentUserId, groupId);
        if (success) {
            const joinedGroup = publicGroups.find(g => g.id === groupId);
            if (joinedGroup) {
                setMyGroups(prev => [...prev, joinedGroup]);
            }
        }
        setJoining(prev => ({ ...prev, [groupId]: false }));
    };

    const handleLeave = async (groupId) => {
        setLeaving(prev => ({ ...prev, [groupId]: true }));
        const success = await leaveGroup(currentUserId, groupId);
        if (success) {
            setMyGroups(prev => prev.filter(g => g.id !== groupId));
        }
        setLeaving(prev => ({ ...prev, [groupId]: false }));
    };

    if (loading) {
        return (
            <div className="page-container groups-page">
                <header className="page-header">
                    <div className="skeleton title" style={{ width: '120px' }}></div>
                    <div className="skeleton bar" style={{ width: '200px', marginTop: '8px' }}></div>
                </header>
                <div className="groups-grid">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="group-card glass" style={{ minHeight: '200px' }}>
                            <div className="group-header">
                                <div className="skeleton avatar" style={{ width: '50px', height: '50px', borderRadius: '12px' }}></div>
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton bar" style={{ width: '70%', marginBottom: '8px' }}></div>
                                    <div className="skeleton bar-short" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                            <div className="skeleton bar" style={{ width: '100%' }}></div>
                            <div className="skeleton bar" style={{ width: '85%' }}></div>
                            <div className="skeleton button" style={{ width: '100%', marginTop: 'auto' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentGroups = activeTab === 'public' ? publicGroups : myGroups;
    // For public tabs, optionally filter out groups we are already in (or treat it as all catalogue)
    const displayedGroups = activeTab === 'public'
        ? currentGroups.filter(g => !myGroups.some(mg => mg.id === g.id))
        : currentGroups;

    const filteredGroups = displayedGroups.filter(group => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (group.name && group.name.toLowerCase().includes(query)) ||
            (group.description && group.description.toLowerCase().includes(query));
    });

    return (
        <div className="page-container groups-page">
            <header className="page-header">
                <h1 className="tech-font text-gradient">{t.title}</h1>
                <p className="subtitle">{t.subtitle}</p>
            </header>

            <div className="groups-controls">
                <div className="groups-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'public' ? 'active' : ''}`}
                        onClick={() => setActiveTab('public')}
                    >
                        {t.tab_public}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        {t.tab_my}
                    </button>
                </div>

                <div className="search-bar-container">
                    <LucideIcons.Search className="search-icon" size={18} />
                    <input
                        type="text"
                        className="group-search-input glass"
                        placeholder={t.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="clear-search-btn"
                            onClick={() => setSearchQuery('')}
                        >
                            <LucideIcons.X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="groups-grid">
                {filteredGroups.length === 0 ? (
                    <div className="text-secondary" style={{ padding: '24px 0' }}>
                        {currentGroups.length === 0
                            ? (activeTab === 'public' ? t.no_public : t.no_my)
                            : t.no_search}
                    </div>
                ) : (
                    filteredGroups.map((group) => {
                        // Dynamically render icon from Lucide if it exists
                        const IconComponent = LucideIcons[group.icon_name] || LucideIcons.Users;

                        return (
                            <SpotlightCard key={group.id} className="group-card">
                                <div className="group-header">
                                    <div className="group-icon-placeholder">
                                        <IconComponent size={20} style={{ color: group.icon_color || 'var(--color-accent-bright)' }} />
                                    </div>
                                    <div className="group-info">
                                        <h3>{group.name}</h3>
                                        <span className="text-secondary">
                                            {group.member_count >= 1000
                                                ? (group.member_count / 1000).toFixed(1) + 'k'
                                                : group.member_count} {t.members}
                                        </span>
                                    </div>
                                </div>
                                <p className="group-desc">{group.description}</p>
                                <div className="group-actions">
                                    {activeTab === 'my' ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="join-btn accent-bg"
                                                style={{ flex: 1 }}
                                                onClick={() => navigate(`/groups/${group.id}`)}
                                            >
                                                {t.open_chat}
                                            </button>
                                            <button
                                                className="join-btn"
                                                style={{ width: '40px', padding: 0 }}
                                                onClick={() => handleLeave(group.id)}
                                                disabled={leaving[group.id]}
                                                title={t.leave_group}
                                            >
                                                <LucideIcons.LogOut size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="join-btn"
                                            onClick={() => handleJoin(group.id)}
                                            disabled={joining[group.id]}
                                        >
                                            <LucideIcons.UserPlus size={16} />
                                            {joining[group.id] ? t.joining : t.join}
                                        </button>
                                    )}
                                </div>
                            </SpotlightCard>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Groups;
