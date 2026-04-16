import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Copy, KeyRound, LogOut, Plus, Search, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { fetchUserProfile } from '../../lib/db';
import {
    createStudyGroup,
    DEFAULT_DISCOVER_GROUP,
    isSeededStudyGroup,
    joinStudyGroup,
    joinStudyGroupByCode,
    leaveStudyGroup,
    listMyStudyGroups,
    listPublicStudyGroups,
    normalizeStudyGroupInviteCode,
    STUDY_GROUP_THEME_OPTIONS
} from '../../lib/studyGroups';
import './Groups.css';

const REQUEST_TIMEOUT_MS = 6000;
const CREATE_CLASS_TIMEOUT_MS = 4500;

const uniqueById = (items) => items.filter(
    (item, index, collection) => item?.id && collection.findIndex((candidate) => candidate.id === item.id) === index
);

const Groups = () => {
    const { user, loading: authLoading } = useAuth();
    const { language } = useLanguage();
    const t = translations[language].groups;
    const navigate = useNavigate();
    const currentUserId = user?.id || null;

    const [catalogue, setCatalogue] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my');
    const [searchQuery, setSearchQuery] = useState('');
    const [pageNotice, setPageNotice] = useState('');
    const [pageError, setPageError] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [className, setClassName] = useState('');
    const [classDescription, setClassDescription] = useState('');
    const [selectedTheme, setSelectedTheme] = useState(STUDY_GROUP_THEME_OPTIONS[0]);
    const [creatingClass, setCreatingClass] = useState(false);
    const [createClassError, setCreateClassError] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [joiningByCode, setJoiningByCode] = useState(false);
    const [joinCodeError, setJoinCodeError] = useState('');
    const [busyGroupId, setBusyGroupId] = useState('');
    const [copiedInviteCode, setCopiedInviteCode] = useState('');
    const [requestDiagnostics, setRequestDiagnostics] = useState({});

    const resolvedRole = (
        currentProfile?.role ||
        user?.user_metadata?.role ||
        ''
    ).toLowerCase();
    const isTeacher = resolvedRole === 'teacher';

    const updateRequestDiagnostic = (label, patch) => {
        setRequestDiagnostics((previous) => ({
            ...previous,
            [label]: {
                ...(previous[label] || {}),
                ...patch,
                updatedAt: new Date().toISOString()
            }
        }));
    };

    const runTrackedRequest = async (label, promiseFactory, fallbackValue) => {
        updateRequestDiagnostic(label, {
            status: 'loading',
            message: 'Request started'
        });

        let settled = false;
        const requestPromise = Promise.resolve()
            .then(promiseFactory)
            .then((result) => {
                settled = true;
                const sizeHint = Array.isArray(result)
                    ? `${result.length} item(s)`
                    : (result ? 'data received' : 'empty result');

                updateRequestDiagnostic(label, {
                    status: 'success',
                    message: sizeHint
                });
                console.info(`[Groups diagnostics] ${label}: success`, {
                    sizeHint,
                    userId: currentUserId
                });
                return result;
            })
            .catch((error) => {
                settled = true;
                const message = error?.message || 'Unknown request error';
                updateRequestDiagnostic(label, {
                    status: 'error',
                    message
                });
                console.error(`[Groups diagnostics] ${label}: error`, {
                    userId: currentUserId,
                    error
                });
                return fallbackValue;
            });

        const timeoutPromise = new Promise((resolve) => {
            window.setTimeout(() => {
                if (!settled) {
                    updateRequestDiagnostic(label, {
                        status: 'timeout',
                        message: `Timed out after ${REQUEST_TIMEOUT_MS}ms`
                    });
                    console.warn(`[Groups diagnostics] ${label}: timeout`, {
                        userId: currentUserId,
                        timeoutMs: REQUEST_TIMEOUT_MS
                    });
                }
                resolve(fallbackValue);
            }, REQUEST_TIMEOUT_MS);
        });

        return Promise.race([requestPromise, timeoutPromise]);
    };

    const loadDashboard = async () => {
        if (authLoading) {
            return;
        }

        setLoading(true);
        setPageError('');

        console.info('[Groups diagnostics] loadDashboard:start', {
            userId: currentUserId,
            authLoading
        });

        const [catalogueData, myGroupsData, profileData] = await Promise.all([
            runTrackedRequest('listPublicStudyGroups', () => listPublicStudyGroups(), []),
            currentUserId
                ? runTrackedRequest('listMyStudyGroups', () => listMyStudyGroups(currentUserId), [])
                : Promise.resolve([]),
            currentUserId
                ? runTrackedRequest('fetchUserProfile', () => fetchUserProfile(currentUserId), null)
                : Promise.resolve(null)
        ]);

        setCatalogue(catalogueData);
        setMyGroups(uniqueById(myGroupsData));
        setCurrentProfile(profileData);
        setLoading(false);

        console.info('[Groups diagnostics] loadDashboard:done', {
            catalogueCount: catalogueData.length,
            myGroupsCount: myGroupsData.length,
            hasProfile: Boolean(profileData),
            userId: currentUserId
        });
    };

    useEffect(() => {
        void loadDashboard();
    }, [authLoading, currentUserId]);

    useEffect(() => {
        if (!pageNotice && !pageError) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setPageNotice('');
            setPageError('');
        }, 3200);

        return () => window.clearTimeout(timeoutId);
    }, [pageNotice, pageError]);

    const myGroupIds = useMemo(() => new Set(myGroups.map((group) => group.id)), [myGroups]);
    const diagnosticEntries = Object.entries(requestDiagnostics);
    const showDiagnosticsPanel = diagnosticEntries.some(([, value]) => value?.status && value.status !== 'success');

    const discoverGroups = useMemo(() => (
        catalogue.filter((group) => !myGroupIds.has(group.id))
    ), [catalogue, myGroupIds]);

    const visibleGroups = activeTab === 'my' ? myGroups : discoverGroups;

    const filteredGroups = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return visibleGroups;
        }

        return visibleGroups.filter((group) => (
            group.name?.toLowerCase().includes(query) ||
            group.description?.toLowerCase().includes(query) ||
            group.invite_code?.toLowerCase().includes(query)
        ));
    }, [searchQuery, visibleGroups]);

    const handleCreateClass = async () => {
        if (!className.trim()) {
            return;
        }

        if (!currentUserId) {
            setCreateClassError(t.join_code_sign_in);
            return;
        }

        setCreatingClass(true);
        setCreateClassError('');

        const result = await Promise.race([
            createStudyGroup({
                name: className.trim(),
                description: classDescription.trim(),
                themeColor: selectedTheme,
                visibility: 'public',
                userId: currentUserId
            }),
            new Promise((resolve) => {
                window.setTimeout(() => {
                    resolve({
                        ok: false,
                        group: null,
                        error: t.create_class_timeout
                    });
                }, CREATE_CLASS_TIMEOUT_MS);
            })
        ]);

        if (!result.ok || !result.group) {
            setCreateClassError(result.error || t.create_class_error);
            setCreatingClass(false);
            return;
        }

        const createdGroup = result.group;
        setCatalogue((previous) => uniqueById([createdGroup, ...previous]));
        setMyGroups((previous) => uniqueById([createdGroup, ...previous]));
        setPageNotice(t.create_success.replace('{class}', createdGroup.name));
        setClassName('');
        setClassDescription('');
        setSelectedTheme(STUDY_GROUP_THEME_OPTIONS[0]);
        setIsCreateOpen(false);
        setCreatingClass(false);
        navigate(`/groups/${createdGroup.id}`, {
            state: {
                initialGroup: createdGroup,
                initialMembership: {
                    group_id: createdGroup.id,
                    user_id: currentUserId,
                    role: 'teacher'
                }
            }
        });
    };

    const handleJoinGroup = async (group) => {
        if (isSeededStudyGroup(group)) {
            navigate(`/groups/${DEFAULT_DISCOVER_GROUP.id}`, {
                state: {
                    initialGroup: DEFAULT_DISCOVER_GROUP,
                    initialMembership: null
                }
            });
            return;
        }

        if (!currentUserId) {
            setPageError(t.join_code_sign_in);
            return;
        }

        setBusyGroupId(group.id);
        const result = await joinStudyGroup(group.id, currentUserId);
        setBusyGroupId('');

        if (!result.ok || !result.group) {
            setPageError(result.error || t.join_code_failed);
            return;
        }

        setMyGroups((previous) => uniqueById([result.group, ...previous]));
        setPageNotice(t.join_success.replace('{class}', result.group.name));
        navigate(`/groups/${group.id}`, {
            state: {
                initialGroup: result.group,
                initialMembership: {
                    group_id: result.group.id,
                    user_id: currentUserId,
                    role: result.group.membership_role || 'student'
                }
            }
        });
    };

    const handleLeaveGroup = async (group) => {
        if (!currentUserId) {
            return;
        }

        setBusyGroupId(group.id);
        const result = await leaveStudyGroup(group.id, currentUserId);
        setBusyGroupId('');

        if (!result.ok) {
            setPageError(result.error || t.leave_group_error);
            return;
        }

        setMyGroups((previous) => previous.filter((item) => item.id !== group.id));
        setPageNotice(t.leave_success.replace('{class}', group.name));
    };

    const handleJoinByCode = async () => {
        const normalizedCode = normalizeStudyGroupInviteCode(joinCode);

        if (!normalizedCode) {
            setJoinCodeError(t.join_code_missing);
            return;
        }

        if (!currentUserId) {
            setJoinCodeError(t.join_code_sign_in);
            return;
        }

        setJoiningByCode(true);
        setJoinCodeError('');

        const result = await joinStudyGroupByCode(normalizedCode, currentUserId);
        setJoiningByCode(false);

        if (!result.ok || !result.group) {
            setJoinCodeError(result.error || t.join_code_not_found);
            return;
        }

        setMyGroups((previous) => uniqueById([result.group, ...previous]));
        setJoinCode('');
        setPageNotice(t.join_success.replace('{class}', result.group.name));
        navigate(`/groups/${result.group.id}`, {
            state: {
                initialGroup: result.group,
                initialMembership: {
                    group_id: result.group.id,
                    user_id: currentUserId,
                    role: result.group.membership_role || 'student'
                }
            }
        });
    };

    const handleCopyInviteCode = async (group) => {
        if (!group?.invite_code) {
            return;
        }

        try {
            await navigator.clipboard.writeText(group.invite_code);
            setCopiedInviteCode(group.id);
            window.setTimeout(() => {
                setCopiedInviteCode((current) => current === group.id ? '' : current);
            }, 1800);
        } catch (error) {
            console.error('Error copying invite code:', error);
        }
    };

    const renderSkeletonCard = (index) => (
        <div key={`group-skeleton-${index}`} className="study-group-card study-group-card--skeleton">
            <div className="study-group-card__headline">
                <div className="study-group-skeleton study-group-skeleton--orb" />
                <div className="study-group-card__title-block">
                    <div className="study-group-skeleton study-group-skeleton--title" />
                    <div className="study-group-skeleton study-group-skeleton--meta" />
                </div>
            </div>
            <div className="study-group-skeleton study-group-skeleton--paragraph" />
            <div className="study-group-skeleton study-group-skeleton--paragraph short" />
            <div className="study-group-skeleton study-group-skeleton--button" />
        </div>
    );

    return (
        <div className="page-container groups-page groups-page--rebuilt">
            <section className="groups-hero">
                <div className="groups-hero__copy">
                    <span className="groups-eyebrow">
                        <Sparkles size={14} />
                        {t.hero_badge}
                    </span>
                    <h1 className="tech-font">{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>
                <div className="groups-hero__stats">
                    <div className="groups-stat-pill">
                        <strong>{catalogue.length}</strong>
                        <span>{t.stat_public_groups}</span>
                    </div>
                    <div className="groups-stat-pill">
                        <strong>{myGroups.length}</strong>
                        <span>{t.stat_my_groups}</span>
                    </div>
                </div>
            </section>

            {pageNotice ? <div className="groups-feedback groups-feedback--success">{pageNotice}</div> : null}
            {pageError ? <div className="groups-feedback groups-feedback--error">{pageError}</div> : null}
            {showDiagnosticsPanel ? (
                <div className="groups-feedback groups-feedback--error">
                    <strong style={{ display: 'block', marginBottom: '8px' }}>Groups diagnostics</strong>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        {diagnosticEntries.map(([label, value]) => (
                            <div key={label} style={{ fontSize: '13px', lineHeight: 1.5 }}>
                                <strong>{label}</strong>: {value?.status || 'idle'}
                                {value?.message ? ` - ${value.message}` : ''}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            <section className="groups-action-strip">
                <SpotlightCard className="groups-action-card groups-action-card--teacher">
                    <div className="groups-action-card__header">
                        <span className="groups-modal-chip">{t.teacher_badge}</span>
                        <h2>{t.teacher_title}</h2>
                    </div>
                    <p>{t.teacher_subtitle}</p>
                    <button
                        type="button"
                        className="groups-primary-btn"
                        onClick={() => setIsCreateOpen(true)}
                        disabled={!isTeacher}
                    >
                        <Plus size={16} />
                        {t.create_class}
                    </button>
                </SpotlightCard>

                <SpotlightCard className="groups-action-card groups-action-card--student">
                    <div className="groups-action-card__header">
                        <span className="groups-modal-chip">{t.student_join_badge}</span>
                        <h2>{t.student_join_title}</h2>
                    </div>
                    <p>{t.student_join_subtitle}</p>
                    <div className="groups-join-inline">
                        <input
                            type="text"
                            className="groups-code-input"
                            placeholder={t.join_code_placeholder}
                            value={joinCode}
                            onChange={(event) => {
                                setJoinCode(normalizeStudyGroupInviteCode(event.target.value));
                                if (joinCodeError) {
                                    setJoinCodeError('');
                                }
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    void handleJoinByCode();
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="groups-secondary-btn"
                            onClick={handleJoinByCode}
                            disabled={joiningByCode}
                        >
                            <KeyRound size={16} />
                            {joiningByCode ? t.joining_by_code : t.join_by_code}
                        </button>
                    </div>
                    {joinCodeError ? (
                        <div className="groups-inline-error">{joinCodeError}</div>
                    ) : (
                        <div className="groups-inline-hint">{t.join_code_hint}</div>
                    )}
                </SpotlightCard>
            </section>

            <section className="groups-browser">
                <div className="groups-browser__top">
                    <div className="groups-tabs">
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
                            onClick={() => setActiveTab('my')}
                        >
                            {t.tab_my}
                        </button>
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
                            onClick={() => setActiveTab('discover')}
                        >
                            {t.tab_public}
                        </button>
                    </div>

                    <label className="groups-search-shell">
                        <Search size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder={t.search}
                        />
                    </label>
                </div>

                <div className="groups-grid">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => renderSkeletonCard(index))
                    ) : filteredGroups.length === 0 ? (
                        <div className="groups-empty-state">
                            <Users size={28} />
                            <h3>{activeTab === 'my' ? t.no_my : t.no_public}</h3>
                            <p>{searchQuery ? t.no_search : t.empty_state_subtitle}</p>
                        </div>
                    ) : (
                        filteredGroups.map((group) => {
                            const isOwner = group.owner_user_id === currentUserId;
                            const isBusy = busyGroupId === group.id;
                            const isSeeded = isSeededStudyGroup(group);

                            return (
                                <SpotlightCard
                                    key={group.id}
                                    className="study-group-card"
                                    style={{ '--group-accent': group.theme_color || STUDY_GROUP_THEME_OPTIONS[0] }}
                                >
                                    <div className="study-group-card__headline">
                                        <div className="study-group-card__icon">
                                            <Users size={18} />
                                        </div>
                                        <div className="study-group-card__title-block">
                                            <div className="study-group-card__badges">
                                                <span className="study-group-card__pill">
                                                    {isOwner ? t.owner_badge : t.member_badge}
                                                </span>
                                                <span className="study-group-card__members">
                                                    {group.member_count || 0} {t.members}
                                                </span>
                                            </div>
                                            <h3>{group.name}</h3>
                                        </div>
                                    </div>

                                    <p className="study-group-card__description">
                                        {group.description || t.group_description_fallback}
                                    </p>

                                    <div className="study-group-card__meta">
                                        <span>{group.visibility === 'private' ? t.visibility_private : t.visibility_public}</span>
                                        {isOwner && group.invite_code ? (
                                            <button
                                                type="button"
                                                className="study-group-card__code"
                                                onClick={() => handleCopyInviteCode(group)}
                                            >
                                                <Copy size={14} />
                                                {copiedInviteCode === group.id
                                                    ? t.copied_code
                                                    : `${t.invite_code_label}: ${group.invite_code}`}
                                            </button>
                                        ) : null}
                                    </div>

                                        <div className="study-group-card__actions">
                                            {activeTab === 'my' ? (
                                                <>
                                                    <button
                                                    type="button"
                                                    className="groups-primary-btn groups-primary-btn--compact"
                                                    onClick={() => navigate(`/groups/${group.id}`, {
                                                        state: {
                                                            initialGroup: group,
                                                            initialMembership: {
                                                                group_id: group.id,
                                                                user_id: currentUserId,
                                                                role: group.membership_role || (isOwner ? 'teacher' : 'student')
                                                            }
                                                        }
                                                    })}
                                                >
                                                    {t.open_chat}
                                                    <ArrowRight size={15} />
                                                </button>
                                                {!isOwner ? (
                                                    <button
                                                        type="button"
                                                        className="groups-icon-btn"
                                                        onClick={() => handleLeaveGroup(group)}
                                                        disabled={isBusy}
                                                        title={t.leave_group}
                                                    >
                                                        <LogOut size={16} />
                                                    </button>
                                                ) : null}
                                            </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="groups-primary-btn groups-primary-btn--compact"
                                                    onClick={() => handleJoinGroup(group)}
                                                    disabled={isBusy}
                                                >
                                                    {isSeeded ? t.preview_group : (isBusy ? t.joining : t.join)}
                                                    <ArrowRight size={15} />
                                                </button>
                                            )}
                                        </div>
                                </SpotlightCard>
                            );
                        })
                    )}
                </div>
            </section>

            {isCreateOpen ? (
                <div className="groups-modal-overlay" onClick={() => setIsCreateOpen(false)}>
                    <div className="groups-modal-card groups-modal-card--fresh" onClick={(event) => event.stopPropagation()}>
                        <div className="groups-modal-header">
                            <div>
                                <span className="groups-modal-chip">{t.teacher_badge}</span>
                                <h3>{t.create_class}</h3>
                                <p>{t.create_class_subtitle}</p>
                            </div>
                            <button className="groups-modal-close" onClick={() => setIsCreateOpen(false)}>
                                ×
                            </button>
                        </div>

                        <label className="groups-modal-field">
                            <span>{t.class_name}</span>
                            <input
                                value={className}
                                onChange={(event) => setClassName(event.target.value)}
                                placeholder={t.class_name_placeholder}
                            />
                        </label>

                        <label className="groups-modal-field">
                            <span>{t.class_description}</span>
                            <textarea
                                rows={4}
                                value={classDescription}
                                onChange={(event) => setClassDescription(event.target.value)}
                                placeholder={t.class_description_placeholder}
                            />
                        </label>

                        <div className="groups-modal-field">
                            <span>{t.class_theme}</span>
                            <div className="groups-theme-picker">
                                {STUDY_GROUP_THEME_OPTIONS.map((theme) => (
                                    <button
                                        key={theme}
                                        type="button"
                                        className={`groups-theme-swatch ${selectedTheme === theme ? 'is-active' : ''}`}
                                        style={{ '--swatch-color': theme }}
                                        onClick={() => setSelectedTheme(theme)}
                                    />
                                ))}
                            </div>
                        </div>

                        {createClassError ? (
                            <div className="groups-inline-error">{createClassError}</div>
                        ) : null}

                        <button
                            type="button"
                            className="groups-primary-btn groups-primary-btn--full"
                            onClick={handleCreateClass}
                            disabled={creatingClass || !className.trim()}
                        >
                            <Plus size={16} />
                            {creatingClass ? t.creating_class : t.create_class}
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Groups;
