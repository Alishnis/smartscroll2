import React, { useEffect, useMemo, useState } from 'react';
import { Brain, CheckCircle2, FolderPlus, Layers3, RefreshCcw, Sparkles, X } from 'lucide-react';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { useAuth } from '../../context/AuthContext';
import {
    addSessionsToMemoryRefreshGroup,
    createMemoryRefreshGroup,
    fetchExplainBackSessions,
    fetchMemoryRefreshGroups
} from '../../lib/db';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './MemoryRefresh.css';

const FALLBACK_USER_ID = '00000000-0000-0000-0000-000000000001';

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const buildQuizDeck = (group) => {
    const items = group?.memory_refresh_group_items || [];

    return shuffle(
        items.flatMap((item) => {
            const session = item.explain_back_sessions;
            const questions = session?.explain_back_questions || [];

            return questions
                .filter((question) => question.question_text)
                .map((question) => ({
                    id: question.id,
                    question: question.question_text,
                    answer: question.answer_text || '',
                    topic: session?.topic || session?.source_title || '',
                    sourceTitle: session?.source_title || session?.topic || '',
                    contentType: session?.content_type || 'generic'
                }));
        })
    );
};

const MemoryRefresh = () => {
    const { user } = useAuth();
    const userId = user?.id || FALLBACK_USER_ID;
    const { language } = useLanguage();
    const t = translations[language].memory_refresh;
    const [sessions, setSessions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedSessions, setSelectedSessions] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [activeQuizGroupId, setActiveQuizGroupId] = useState(null);
    const [quizDeck, setQuizDeck] = useState([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showReferenceAnswer, setShowReferenceAnswer] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [groupSessionSelection, setGroupSessionSelection] = useState([]);
    const [addingToGroup, setAddingToGroup] = useState(false);

    const loadData = async () => {
        setLoading(true);
        const [fetchedSessions, fetchedGroups] = await Promise.all([
            fetchExplainBackSessions(userId),
            fetchMemoryRefreshGroups(userId)
        ]);

        setSessions(fetchedSessions);
        setGroups(fetchedGroups);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [userId]);

    const selectedCount = selectedSessions.length;
    const activeQuestion = quizDeck[quizIndex] || null;

    const availableSessions = useMemo(
        () => sessions.filter((session) => (session.explain_back_questions || []).length > 0),
        [sessions]
    );

    const toggleSession = (sessionId) => {
        setSelectedSessions((current) =>
            current.includes(sessionId)
                ? current.filter((id) => id !== sessionId)
                : [...current, sessionId]
        );
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedSessions.length === 0) return;

        setCreating(true);
        await createMemoryRefreshGroup({
            userId,
            name: groupName.trim(),
            description: groupDescription.trim(),
            sessionIds: selectedSessions
        });
        setCreating(false);
        setGroupName('');
        setGroupDescription('');
        setSelectedSessions([]);
        await loadData();
    };

    const startQuiz = (group) => {
        const deck = buildQuizDeck(group);
        setActiveQuizGroupId(group.id);
        setQuizDeck(deck);
        setQuizIndex(0);
        setUserAnswer('');
        setShowReferenceAnswer(false);
    };

    const nextQuestion = () => {
        setQuizIndex((current) => current + 1);
        setUserAnswer('');
        setShowReferenceAnswer(false);
    };

    const closeQuiz = () => {
        setActiveQuizGroupId(null);
        setQuizDeck([]);
        setQuizIndex(0);
        setUserAnswer('');
        setShowReferenceAnswer(false);
    };

    const openAddVideosModal = (group) => {
        setEditingGroup(group);
        setGroupSessionSelection([]);
    };

    const closeAddVideosModal = () => {
        setEditingGroup(null);
        setGroupSessionSelection([]);
    };

    const toggleGroupSessionSelection = (sessionId) => {
        setGroupSessionSelection((current) =>
            current.includes(sessionId)
                ? current.filter((id) => id !== sessionId)
                : [...current, sessionId]
        );
    };

    const handleAddVideosToGroup = async () => {
        if (!editingGroup?.id || groupSessionSelection.length === 0) return;

        setAddingToGroup(true);
        await addSessionsToMemoryRefreshGroup({
            groupId: editingGroup.id,
            sessionIds: groupSessionSelection
        });
        setAddingToGroup(false);
        closeAddVideosModal();
        await loadData();
    };

    const groupAvailableSessions = useMemo(() => {
        if (!editingGroup) return [];

        const existingSessionIds = new Set(
            (editingGroup.memory_refresh_group_items || []).map((item) => item.session_id)
        );

        return availableSessions.filter((session) => !existingSessionIds.has(session.id));
    }, [editingGroup, availableSessions]);

    return (
        <div className="page-container memory-page">
            <header className="page-header memory-header">
                <div>
                    <span className="memory-eyebrow">{t.eyebrow}</span>
                    <h1 className="tech-font text-gradient">{t.title}</h1>
                    <p className="subtitle">{t.subtitle}</p>
                </div>
                <button className="memory-refresh-btn" onClick={loadData} type="button">
                    <RefreshCcw size={16} />
                    {t.refresh}
                </button>
            </header>

            <div className="memory-layout">
                <SpotlightCard className="memory-builder-card">
                    <div className="memory-builder-top">
                        <div>
                            <span className="memory-chip">{t.builder_chip}</span>
                            <h2>{t.builder_title}</h2>
                            <p>{t.builder_subtitle}</p>
                        </div>
                        <div className="memory-stat">
                            <strong>{selectedCount}</strong>
                            <span>{t.selected_videos}</span>
                        </div>
                    </div>

                    <div className="memory-builder-form">
                        <label className="memory-field">
                            <span>{t.group_name}</span>
                            <input
                                value={groupName}
                                onChange={(event) => setGroupName(event.target.value)}
                                placeholder={t.group_name_placeholder}
                            />
                        </label>
                        <label className="memory-field">
                            <span>{t.group_description}</span>
                            <textarea
                                rows={3}
                                value={groupDescription}
                                onChange={(event) => setGroupDescription(event.target.value)}
                                placeholder={t.group_description_placeholder}
                            />
                        </label>
                    </div>

                    <div className="memory-session-list">
                        {loading ? (
                            <p className="memory-empty-copy">{t.loading}</p>
                        ) : availableSessions.length === 0 ? (
                            <p className="memory-empty-copy">{t.no_sessions}</p>
                        ) : (
                            availableSessions.map((session) => {
                                const isSelected = selectedSessions.includes(session.id);
                                return (
                                    <button
                                        key={session.id}
                                        className={`memory-session-card${isSelected ? ' is-selected' : ''}`}
                                        onClick={() => toggleSession(session.id)}
                                        type="button"
                                    >
                                        <div>
                                            <strong>{session.source_title || session.topic}</strong>
                                            <p>{session.topic}</p>
                                        </div>
                                        <div className="memory-session-meta">
                                            <span>{(session.explain_back_questions || []).length} {t.questions_count}</span>
                                            {session.overall_score ? <span>{t.score_short}: {session.overall_score}/10</span> : null}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <button
                        className="memory-create-btn"
                        type="button"
                        disabled={!groupName.trim() || selectedSessions.length === 0 || creating}
                        onClick={handleCreateGroup}
                    >
                        <FolderPlus size={18} />
                        {creating ? t.creating : t.create_group}
                    </button>
                </SpotlightCard>

                <div className="memory-groups-column">
                    <div className="memory-groups-header">
                        <div>
                            <span className="memory-chip">{t.quiz_chip}</span>
                            <h2>{t.groups_title}</h2>
                        </div>
                    </div>

                    <div className="memory-groups-grid">
                        {loading ? (
                            <p className="memory-empty-copy">{t.loading}</p>
                        ) : groups.length === 0 ? (
                            <SpotlightCard className="memory-empty-card">
                                <Layers3 size={24} />
                                <p>{t.no_groups}</p>
                            </SpotlightCard>
                        ) : (
                            groups.map((group) => {
                                const questionCount = buildQuizDeck(group).length;
                                return (
                                    <SpotlightCard key={group.id} className="memory-group-card">
                                        <div className="memory-group-card__top">
                                            <div>
                                                <h3>{group.name}</h3>
                                                <p>{group.description || t.group_description_fallback}</p>
                                            </div>
                                            <Sparkles size={18} />
                                        </div>
                                        <div className="memory-group-stats">
                                            <span>{(group.memory_refresh_group_items || []).length} {t.videos_count}</span>
                                            <span>{questionCount} {t.questions_count}</span>
                                        </div>
                                        <div className="memory-group-actions">
                                            <button className="memory-secondary-btn" type="button" onClick={() => openAddVideosModal(group)}>
                                                <FolderPlus size={16} />
                                                {t.add_videos}
                                            </button>
                                            <button className="memory-start-btn" type="button" onClick={() => startQuiz(group)}>
                                                <Brain size={16} />
                                                {t.start_quiz}
                                            </button>
                                        </div>
                                    </SpotlightCard>
                                );
                            })
                        )}
                    </div>

                </div>
            </div>

            {activeQuizGroupId ? (
                <div className="memory-quiz-overlay" onClick={closeQuiz}>
                    <SpotlightCard className="memory-quiz-card memory-quiz-card--modal" onClick={(event) => event.stopPropagation()}>
                        <button className="memory-quiz-close" type="button" onClick={closeQuiz}>
                            <X size={18} />
                        </button>

                        {!activeQuestion ? (
                            <div className="memory-empty-card">
                                <CheckCircle2 size={24} />
                                <p>{t.no_questions_in_group}</p>
                            </div>
                        ) : (
                            <>
                                <div className="memory-quiz-header">
                                    <div>
                                        <span className="memory-chip">{t.quiz_chip}</span>
                                        <h3>{activeQuestion.sourceTitle}</h3>
                                        <p>{activeQuestion.topic}</p>
                                    </div>
                                    <strong>{quizIndex + 1}/{quizDeck.length}</strong>
                                </div>

                                <section className="memory-quiz-question">
                                    <span>{t.question_label}</span>
                                    <h4>{activeQuestion.question}</h4>
                                </section>

                                <label className="memory-field">
                                    <span>{t.your_answer}</span>
                                    <textarea
                                        rows={4}
                                        value={userAnswer}
                                        onChange={(event) => setUserAnswer(event.target.value)}
                                        placeholder={t.answer_placeholder}
                                    />
                                </label>

                                {!showReferenceAnswer ? (
                                    <button className="memory-create-btn" type="button" onClick={() => setShowReferenceAnswer(true)}>
                                        {t.reveal_reference}
                                    </button>
                                ) : (
                                    <div className="memory-reference-answer">
                                        <span>{t.reference_answer}</span>
                                        <p>{activeQuestion.answer || t.reference_missing}</p>
                                    </div>
                                )}

                                <button
                                    className="memory-start-btn"
                                    type="button"
                                    onClick={nextQuestion}
                                    disabled={quizIndex >= quizDeck.length - 1}
                                >
                                    {quizIndex >= quizDeck.length - 1 ? t.quiz_complete : t.next_question}
                                </button>
                            </>
                        )}
                    </SpotlightCard>
                </div>
            ) : null}

            {editingGroup ? (
                <div className="memory-quiz-overlay" onClick={closeAddVideosModal}>
                    <SpotlightCard className="memory-quiz-card memory-quiz-card--modal" onClick={(event) => event.stopPropagation()}>
                        <button className="memory-quiz-close" type="button" onClick={closeAddVideosModal}>
                            <X size={18} />
                        </button>

                        <div className="memory-quiz-header">
                            <div>
                                <span className="memory-chip">{t.add_videos}</span>
                                <h3>{editingGroup.name}</h3>
                                <p>{t.add_videos_subtitle}</p>
                            </div>
                            <strong>{groupSessionSelection.length}</strong>
                        </div>

                        <div className="memory-session-list memory-session-list--modal">
                            {groupAvailableSessions.length === 0 ? (
                                <div className="memory-empty-card">
                                    <CheckCircle2 size={24} />
                                    <p>{t.no_more_videos}</p>
                                </div>
                            ) : (
                                groupAvailableSessions.map((session) => {
                                    const isSelected = groupSessionSelection.includes(session.id);
                                    return (
                                        <button
                                            key={session.id}
                                            className={`memory-session-card${isSelected ? ' is-selected' : ''}`}
                                            onClick={() => toggleGroupSessionSelection(session.id)}
                                            type="button"
                                        >
                                            <div>
                                                <strong>{session.source_title || session.topic}</strong>
                                                <p>{session.topic}</p>
                                            </div>
                                            <div className="memory-session-meta">
                                                <span>{(session.explain_back_questions || []).length} {t.questions_count}</span>
                                                {session.overall_score ? <span>{t.score_short}: {session.overall_score}/10</span> : null}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        <button
                            className="memory-create-btn"
                            type="button"
                            disabled={groupSessionSelection.length === 0 || addingToGroup}
                            onClick={handleAddVideosToGroup}
                        >
                            <FolderPlus size={18} />
                            {addingToGroup ? t.adding_videos : t.confirm_add_videos}
                        </button>
                    </SpotlightCard>
                </div>
            ) : null}
        </div>
    );
};

export default MemoryRefresh;
