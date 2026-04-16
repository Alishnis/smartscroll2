import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ClipboardPlus, Copy, LogOut, MessageSquare, PlayCircle, Send, Users } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import SharedWhiteboard from '../../components/SharedWhiteboard/SharedWhiteboard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import {
    DEFAULT_DISCOVER_GROUP,
    createStudyGroupAssignment,
    fetchExplainBackSessionsForGroupVideos,
    fetchStudyGroupAssignments,
    fetchStudyGroupById,
    fetchStudyGroupMembers,
    fetchStudyGroupMembership,
    fetchStudyGroupMessages,
    isSeededStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    postStudyGroupMessage,
    subscribeToStudyGroupMessages
} from '../../lib/studyGroups';
import './GroupDetails.css';

const REQUEST_TIMEOUT_MS = 2600;

const extractVideoId = (value) => {
    if (!value) return '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(value.trim())) return value.trim();

    try {
        const url = new URL(value);
        if (url.hostname.includes('youtu.be')) {
            return url.pathname.replace('/', '').trim();
        }

        return url.searchParams.get('v') || '';
    } catch {
        return '';
    }
};

const withTimeout = async (promiseFactory, fallbackValue, label) => {
    try {
        return await Promise.race([
            Promise.resolve().then(promiseFactory),
            new Promise((resolve) => {
                window.setTimeout(() => {
                    console.warn(`Group details timeout: ${label}`);
                    resolve(fallbackValue);
                }, REQUEST_TIMEOUT_MS);
            })
        ]);
    } catch (error) {
        console.error(`Group details request failed: ${label}`, error);
        return fallbackValue;
    }
};

const sortByCreatedAsc = (items) => [...items].sort(
    (left, right) => new Date(left.created_at) - new Date(right.created_at)
);

const buildAssignmentProgressMap = (assignments, members, sessions) => {
    const memberIds = members.map((member) => member.user_id).filter(Boolean);
    const progressMap = {};

    assignments.forEach((assignment) => {
        const relevantSessions = sessions.filter((session) => session.content_id === assignment.video_id);
        const byUser = {};

        memberIds.forEach((memberId) => {
            const bestSession = relevantSessions
                .filter((session) => session.user_id === memberId)
                .reduce((best, session) => {
                    if (!best) return session;

                    const bestScore = Number(best.overall_score || 0);
                    const currentScore = Number(session.overall_score || 0);

                    if (currentScore > bestScore) {
                        return session;
                    }

                    if (currentScore === bestScore && new Date(session.created_at) > new Date(best.created_at)) {
                        return session;
                    }

                    return best;
                }, null);

            byUser[memberId] = {
                score: bestSession?.overall_score ?? null,
                passed: Number(bestSession?.overall_score || 0) >= Number(assignment.required_score || 7)
            };
        });

        progressMap[assignment.id] = {
            byUser,
            totalMembers: memberIds.length,
            completedMembers: memberIds.filter((memberId) => byUser[memberId]?.passed).length
        };
    });

    return progressMap;
};

const GroupDetails = () => {
    const { user, loading: authLoading } = useAuth();
    const { language } = useLanguage();
    const t = translations[language].group_details;
    const navigate = useNavigate();
    const location = useLocation();
    const { groupId } = useParams();
    const messagesEndRef = useRef(null);
    const currentUserId = user?.id || null;

    const [group, setGroup] = useState(location.state?.initialGroup || null);
    const [membership, setMembership] = useState(location.state?.initialMembership || null);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [memberProgress, setMemberProgress] = useState({});
    const [loadingShell, setLoadingShell] = useState(true);
    const [loadingRoomData, setLoadingRoomData] = useState(true);
    const [pageError, setPageError] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [assignmentVideoUrl, setAssignmentVideoUrl] = useState('');
    const [assignmentRequiredScore, setAssignmentRequiredScore] = useState(7);
    const [creatingAssignment, setCreatingAssignment] = useState(false);
    const [copiedInviteCode, setCopiedInviteCode] = useState(false);
    const [joiningGroup, setJoiningGroup] = useState(false);
    const [leavingGroup, setLeavingGroup] = useState(false);

    const isSeeded = isSeededStudyGroup(group);
    const isOwner = Boolean(group?.owner_user_id && currentUserId && group.owner_user_id === currentUserId);
    const isMember = Boolean(isOwner || membership?.group_id || membership?.role);
    const visibleStudents = useMemo(
        () => members.filter((member) => member.role !== 'teacher'),
        [members]
    );

    const refreshRoomData = async (activeGroupId) => {
        if (!activeGroupId) {
            setMembers([]);
            setMessages([]);
            setAssignments([]);
            setMemberProgress({});
            setLoadingRoomData(false);
            return;
        }

        setLoadingRoomData(true);

        const [memberRows, messageRows, assignmentRows] = await Promise.all([
            withTimeout(() => fetchStudyGroupMembers(activeGroupId), [], 'fetchStudyGroupMembers'),
            withTimeout(() => fetchStudyGroupMessages(activeGroupId), [], 'fetchStudyGroupMessages'),
            withTimeout(() => fetchStudyGroupAssignments(activeGroupId), [], 'fetchStudyGroupAssignments')
        ]);

        setMembers(memberRows);
        setMessages(sortByCreatedAsc(messageRows));
        setAssignments(assignmentRows);

        const explainSessions = await withTimeout(() => fetchExplainBackSessionsForGroupVideos({
            userIds: memberRows.map((member) => member.user_id),
            videoIds: assignmentRows.map((assignment) => assignment.video_id)
        }), [], 'fetchExplainBackSessionsForGroupVideos');

        setMemberProgress(buildAssignmentProgressMap(assignmentRows, memberRows, explainSessions));
        setLoadingRoomData(false);
    };

    useEffect(() => {
        if (authLoading) {
            return;
        }

        let cancelled = false;

        const loadPage = async () => {
            setLoadingShell(true);
            setPageError('');

            const initialGroupFromState = location.state?.initialGroup?.id === groupId
                ? location.state.initialGroup
                : null;
            const initialMembershipFromState = location.state?.initialMembership?.group_id === groupId
                ? location.state.initialMembership
                : null;

            const [groupData, membershipData] = await Promise.all([
                initialGroupFromState
                    ? Promise.resolve(initialGroupFromState)
                    : withTimeout(() => fetchStudyGroupById(groupId), null, 'fetchStudyGroupById'),
                currentUserId
                    ? withTimeout(() => fetchStudyGroupMembership(groupId, currentUserId), null, 'fetchStudyGroupMembership')
                    : Promise.resolve(null)
            ]);

            if (cancelled) return;

            const nextGroup = groupData || initialGroupFromState || (isSeededStudyGroup(groupId) ? DEFAULT_DISCOVER_GROUP : null);
            const nextMembership = membershipData || initialMembershipFromState || (
                nextGroup?.owner_user_id === currentUserId
                    ? { group_id: nextGroup.id, user_id: currentUserId, role: 'teacher' }
                    : null
            );

            setGroup(nextGroup);
            setMembership(nextMembership);
            setLoadingShell(false);

            if (!nextGroup) {
                setPageError(t.not_found);
                setLoadingRoomData(false);
                return;
            }

            if (!isSeededStudyGroup(nextGroup) && (nextMembership || nextGroup.owner_user_id === currentUserId)) {
                await refreshRoomData(nextGroup.id);
            } else {
                setLoadingRoomData(false);
            }
        };

        void loadPage();

        return () => {
            cancelled = true;
        };
    }, [authLoading, groupId, currentUserId]);

    useEffect(() => {
        if (!groupId || !isMember || isSeeded) {
            return undefined;
        }

        const unsubscribe = subscribeToStudyGroupMessages(groupId, (incomingMessage) => {
            setMessages((previous) => {
                if (previous.some((message) => message.id === incomingMessage.id)) {
                    return previous;
                }

                return sortByCreatedAsc([...previous, incomingMessage]);
            });
        });

        return unsubscribe;
    }, [groupId, isMember]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleJoinGroup = async () => {
        if (!group?.id) {
            return;
        }

        setJoiningGroup(true);
        const result = await joinStudyGroup(group.id, currentUserId);
        setJoiningGroup(false);

        if (!result.ok || !result.group) {
            setPageError(result.error || t.join_failed);
            return;
        }

        const nextMembership = {
            group_id: result.group.id,
            user_id: currentUserId,
            role: result.group.membership_role || 'student'
        };

        setGroup(result.group);
        setMembership(nextMembership);
        setPageError('');
        await refreshRoomData(result.group.id);
    };

    const handleLeaveGroup = async () => {
        if (!group?.id || isOwner) {
            return;
        }

        setLeavingGroup(true);
        const result = await leaveStudyGroup(group.id, currentUserId);
        setLeavingGroup(false);

        if (!result.ok) {
            setPageError(result.error || t.leave_group_error);
            return;
        }

        navigate('/groups');
    };

    const handleCopyInviteCode = async () => {
        if (!group?.invite_code) {
            return;
        }

        try {
            await navigator.clipboard.writeText(group.invite_code);
            setCopiedInviteCode(true);
            window.setTimeout(() => setCopiedInviteCode(false), 1800);
        } catch (error) {
            console.error('Error copying invite code:', error);
        }
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();

        if (!newMessage.trim()) {
            return;
        }

        setSendingMessage(true);
        setMessageError('');

        const result = await postStudyGroupMessage({
            groupId,
            content: newMessage.trim(),
            userId: currentUserId
        });

        setSendingMessage(false);

        if (!result.ok || !result.message) {
            setMessageError(result.error || t.message_failed);
            return;
        }

        setNewMessage('');
        setMessages((previous) => {
            if (previous.some((message) => message.id === result.message.id)) {
                return previous;
            }

            return sortByCreatedAsc([...previous, result.message]);
        });
    };

    const handleCreateAssignment = async () => {
        const videoId = extractVideoId(assignmentVideoUrl);

        if (!group?.id || !videoId || !assignmentTitle.trim()) {
            return;
        }

        setCreatingAssignment(true);
        const result = await createStudyGroupAssignment({
            groupId: group.id,
            title: assignmentTitle.trim(),
            description: assignmentDescription.trim(),
            videoId,
            videoTitle: assignmentTitle.trim(),
            requiredScore: Number(assignmentRequiredScore || 7),
            userId: currentUserId
        });
        setCreatingAssignment(false);

        if (!result.ok) {
            setPageError(result.error || t.assignment_failed);
            return;
        }

        setIsAssignmentOpen(false);
        setAssignmentTitle('');
        setAssignmentDescription('');
        setAssignmentVideoUrl('');
        setAssignmentRequiredScore(7);
        await refreshRoomData(group.id);
    };

    if (authLoading || loadingShell) {
        return (
            <div className="page-container study-room-page">
                <div className="study-room-skeleton study-room-skeleton--hero" />
                <div className="study-room-layout">
                    <div className="study-room-skeleton study-room-skeleton--panel" />
                    <div className="study-room-skeleton study-room-skeleton--panel" />
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="page-container study-room-page">
                <SpotlightCard className="study-room-empty">
                    <h2>{t.not_found}</h2>
                    <button type="button" className="study-room-primary" onClick={() => navigate('/groups')}>
                        {t.back}
                    </button>
                </SpotlightCard>
            </div>
        );
    }

    return (
        <div className="page-container study-room-page">
            <section className="study-room-hero" style={{ '--room-accent': group.theme_color || '#79ffe1' }}>
                <div className="study-room-hero__top">
                    <button type="button" className="study-room-back" onClick={() => navigate('/groups')}>
                        <ArrowLeft size={18} />
                    </button>

                    <div className="study-room-hero__identity">
                        <div className="study-room-hero__icon">
                            <Users size={18} />
                        </div>
                        <div>
                            <div className="study-room-hero__badges">
                                <span>{isOwner ? t.owner_badge : t.member_badge}</span>
                                <span>{group.member_count || 0} {t.members}</span>
                            </div>
                            <h1 className="tech-font">{group.name}</h1>
                            <p>{group.description || t.group_description_fallback}</p>
                        </div>
                    </div>

                    <div className="study-room-hero__actions">
                        {isOwner ? (
                            <>
                                <button type="button" className="study-room-ghost" onClick={handleCopyInviteCode}>
                                    <Copy size={15} />
                                    {copiedInviteCode ? t.copied_code : `${t.invite_code_label}: ${group.invite_code}`}
                                </button>
                                <button type="button" className="study-room-primary" onClick={() => setIsAssignmentOpen(true)}>
                                    <ClipboardPlus size={16} />
                                    {t.create_assignment}
                                </button>
                            </>
                        ) : isMember ? (
                            <button
                                type="button"
                                className="study-room-ghost"
                                onClick={handleLeaveGroup}
                                disabled={leavingGroup}
                            >
                                <LogOut size={15} />
                                {leavingGroup ? t.leaving_group : t.leave_group}
                            </button>
                        ) : null}
                    </div>
                </div>
            </section>

            {pageError ? (
                <div className="study-room-feedback study-room-feedback--error">{pageError}</div>
            ) : null}

            {!isMember ? (
                <SpotlightCard className="study-room-preview">
                    <div className="study-room-preview__copy">
                        <span className="groups-modal-chip">{t.preview_badge}</span>
                        <h2>{isSeeded ? t.demo_group_title : t.join_to_enter}</h2>
                        <p>{isSeeded ? t.demo_group_subtitle : t.join_to_enter_subtitle}</p>
                    </div>
                    {isSeeded ? (
                        <button
                            type="button"
                            className="study-room-primary"
                            onClick={() => navigate('/groups')}
                        >
                            {t.back}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="study-room-primary"
                            onClick={handleJoinGroup}
                            disabled={joiningGroup}
                        >
                            {joiningGroup ? t.joining_group : t.join_this_group}
                        </button>
                    )}
                </SpotlightCard>
            ) : (
                <>
                    <div className="study-room-members-strip">
                        {loadingRoomData && members.length === 0 ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={`member-skeleton-${index}`} className="study-room-member study-room-member--skeleton" />
                            ))
                        ) : members.length === 0 ? (
                            <span className="study-room-muted">{t.no_students_yet}</span>
                        ) : (
                            members.map((member) => (
                                <div key={`${member.group_id}-${member.user_id}`} className="study-room-member">
                                    <div className="study-room-member__avatar">
                                        {member.profiles?.avatar_url ? (
                                            <img src={member.profiles.avatar_url} alt={member.profiles?.username || t.unknown_user} />
                                        ) : (
                                            <span>{(member.profiles?.username || t.unknown_user).charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div>
                                        <strong>{member.profiles?.username || t.unknown_user}</strong>
                                        <span>{member.role === 'teacher' ? t.owner_badge : t.student_role}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <SharedWhiteboard
                        groupId={group.id}
                        currentUserId={currentUserId}
                        isMember={isMember}
                        isOwner={isOwner}
                        accentColor={group.theme_color || '#79ffe1'}
                        translations={t}
                    />

                    <div className="study-room-layout">
                        <section className="study-room-panel study-room-panel--assignments">
                            <div className="study-room-panel__header">
                                <div>
                                    <h2>{t.assignments}</h2>
                                    <p>{t.assignments_subtitle}</p>
                                </div>
                            </div>

                            <div className="study-room-assignment-list">
                                {loadingRoomData && assignments.length === 0 ? (
                                    Array.from({ length: 2 }).map((_, index) => (
                                        <div key={`assignment-skeleton-${index}`} className="study-room-assignment study-room-assignment--skeleton" />
                                    ))
                                ) : assignments.length === 0 ? (
                                    <div className="study-room-empty-block">
                                        <ClipboardPlus size={22} />
                                        <p>{t.no_assignments}</p>
                                    </div>
                                ) : (
                                    assignments.map((assignment) => {
                                        const currentUserState = memberProgress[assignment.id]?.byUser?.[currentUserId];
                                        const isPassed = currentUserState?.passed;

                                        return (
                                            <article key={assignment.id} className="study-room-assignment">
                                                <div className="study-room-assignment__top">
                                                    <div>
                                                        <h3>{assignment.title}</h3>
                                                        <p>{assignment.description || t.assignment_default_description}</p>
                                                    </div>
                                                    <span className={`study-room-status ${isPassed ? 'is-pass' : 'is-pending'}`}>
                                                        {isPassed ? t.assignment_done : t.assignment_pending}
                                                    </span>
                                                </div>

                                                <div className="study-room-assignment__meta">
                                                    <span>{t.assignment_requirement.replace('{score}', assignment.required_score)}</span>
                                                    {isOwner ? (
                                                        <span>
                                                            {t.assignment_teacher_progress
                                                                .replace('{done}', memberProgress[assignment.id]?.completedMembers || 0)
                                                                .replace('{total}', memberProgress[assignment.id]?.totalMembers || 0)}
                                                        </span>
                                                    ) : (
                                                        <span>{t.assignment_student_score.replace('{score}', currentUserState?.score ?? '-')}</span>
                                                    )}
                                                </div>

                                                <div className="study-room-assignment__actions">
                                                    <button type="button" className="study-room-primary" onClick={() => navigate(`/feed?video=${assignment.video_id}`)}>
                                                        <PlayCircle size={16} />
                                                        {t.open_assignment_video}
                                                    </button>
                                                </div>

                                                {isOwner ? (
                                                    <div className="study-room-progress-board">
                                                        <div className="study-room-progress-board__header">
                                                            <span>{t.assignment_progress_board}</span>
                                                            <span>
                                                                {t.assignment_teacher_progress
                                                                    .replace('{done}', memberProgress[assignment.id]?.completedMembers || 0)
                                                                    .replace('{total}', memberProgress[assignment.id]?.totalMembers || 0)}
                                                            </span>
                                                        </div>
                                                        <div className="study-room-progress-board__list">
                                                            {visibleStudents.length === 0 ? (
                                                                <div className="study-room-progress-item is-empty">{t.no_students_yet}</div>
                                                            ) : (
                                                                visibleStudents.map((member) => {
                                                                    const status = memberProgress[assignment.id]?.byUser?.[member.user_id];
                                                                    return (
                                                                        <div key={`${assignment.id}-${member.user_id}`} className="study-room-progress-item">
                                                                            <div>
                                                                                <strong>{member.profiles?.username || t.unknown_user}</strong>
                                                                                <span>{member.profiles?.role || t.student_role}</span>
                                                                            </div>
                                                                            <div className={`study-room-progress-pill ${status?.passed ? 'is-pass' : 'is-pending'}`}>
                                                                                {status?.passed
                                                                                    ? t.assignment_passed_with_score.replace('{score}', status?.score ?? '-')
                                                                                    : t.assignment_needs_score.replace('{score}', assignment.required_score)}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </article>
                                        );
                                    })
                                )}
                            </div>
                        </section>

                        <section className="study-room-panel study-room-panel--chat">
                            <div className="study-room-panel__header">
                                <div>
                                    <h2>{t.chat}</h2>
                                    <p>{t.chat_subtitle}</p>
                                </div>
                            </div>

                            <div className="study-room-chat-stream">
                                {loadingRoomData && messages.length === 0 ? (
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <div key={`message-skeleton-${index}`} className="study-room-message study-room-message--skeleton" />
                                    ))
                                ) : messages.length === 0 ? (
                                    <div className="study-room-empty-block">
                                        <MessageSquare size={22} />
                                        <p>{t.no_messages}</p>
                                    </div>
                                ) : (
                                    messages.map((message) => {
                                        const isMine = message.user_id === currentUserId;

                                        return (
                                            <div key={message.id} className={`study-room-message ${isMine ? 'is-mine' : ''}`}>
                                                <div className="study-room-message__meta">
                                                    <strong>{isMine ? t.you_label : (message.profiles?.username || t.unknown_user)}</strong>
                                                    <span>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="study-room-message__bubble">{message.content}</div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="study-room-chat-compose" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(event) => setNewMessage(event.target.value)}
                                    placeholder={t.input_placeholder}
                                />
                                <button type="submit" className="study-room-primary" disabled={sendingMessage || !newMessage.trim()}>
                                    <Send size={15} />
                                    {t.send}
                                </button>
                            </form>

                            {messageError ? (
                                <div className="study-room-feedback study-room-feedback--error compact">{messageError}</div>
                            ) : null}
                        </section>
                    </div>
                </>
            )}

            {isAssignmentOpen ? (
                <div className="groups-modal-overlay" onClick={() => setIsAssignmentOpen(false)}>
                    <div className="groups-modal-card groups-modal-card--fresh" onClick={(event) => event.stopPropagation()}>
                        <div className="groups-modal-header">
                            <div>
                                <span className="groups-modal-chip">{t.assignment_badge}</span>
                                <h3>{t.create_assignment}</h3>
                                <p>{t.create_assignment_subtitle}</p>
                            </div>
                            <button className="groups-modal-close" onClick={() => setIsAssignmentOpen(false)}>
                                ×
                            </button>
                        </div>

                        <label className="groups-modal-field">
                            <span>{t.assignment_title}</span>
                            <input
                                value={assignmentTitle}
                                onChange={(event) => setAssignmentTitle(event.target.value)}
                            />
                        </label>

                        <label className="groups-modal-field">
                            <span>{t.assignment_video}</span>
                            <input
                                value={assignmentVideoUrl}
                                onChange={(event) => setAssignmentVideoUrl(event.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </label>

                        <label className="groups-modal-field">
                            <span>{t.assignment_description}</span>
                            <textarea
                                rows={4}
                                value={assignmentDescription}
                                onChange={(event) => setAssignmentDescription(event.target.value)}
                            />
                        </label>

                        <label className="groups-modal-field">
                            <span>{t.assignment_threshold}</span>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={assignmentRequiredScore}
                                onChange={(event) => setAssignmentRequiredScore(event.target.value)}
                            />
                        </label>

                        <button
                            type="button"
                            className="groups-primary-btn groups-primary-btn--full"
                            onClick={handleCreateAssignment}
                            disabled={!assignmentTitle.trim() || !extractVideoId(assignmentVideoUrl) || creatingAssignment}
                        >
                            <ClipboardPlus size={16} />
                            {creatingAssignment ? t.creating_assignment : t.create_assignment}
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default GroupDetails;
