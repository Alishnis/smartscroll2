import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Brain,
  CheckCircle2,
  LoaderCircle,
  Mic,
  MicOff,
  WandSparkles,
  X,
} from 'lucide-react';
import {
  evaluateExplainBackWithFollowUps,
  generateExplainBackFollowUps,
} from '../../lib/api';
import {
  awardSmartCoins,
  createExplainBackSessionWithQuestions,
  updateExplainBackSessionEvaluation,
} from '../../lib/db';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './ExplainBackModal.css';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightText = (text, highlights = { correctTerms: [], incorrectTerms: [] }) => {
  if (!text) return [];

  const correctTerms = (highlights.correctTerms || []).filter(Boolean);
  const incorrectTerms = (highlights.incorrectTerms || []).filter(Boolean);
  const allTerms = [...correctTerms, ...incorrectTerms].sort((a, b) => b.length - a.length);

  if (allTerms.length === 0) {
    return [{ text, tone: 'plain' }];
  }

  const pattern = new RegExp(`(${allTerms.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(pattern).filter((part) => part.length > 0);

  return parts.map((part) => {
    const lower = part.toLowerCase();
    const isCorrect = correctTerms.some((term) => term.toLowerCase() === lower);
    const isIncorrect = incorrectTerms.some((term) => term.toLowerCase() === lower);

    if (isCorrect) return { text: part, tone: 'correct' };
    if (isIncorrect) return { text: part, tone: 'incorrect' };
    return { text: part, tone: 'plain' };
  });
};

const HighlightedText = ({ text, highlights }) => {
  const chunks = highlightText(text, highlights);

  return (
    <p className="explain-highlighted-text">
      {chunks.map((chunk, index) => (
        <span
          key={`${chunk.text}-${index}`}
          className={
            chunk.tone === 'correct'
              ? 'is-correct'
              : chunk.tone === 'incorrect'
                ? 'is-incorrect'
                : ''
          }
        >
          {chunk.text}
        </span>
      ))}
    </p>
  );
};

const ExplainBackModal = ({
  isOpen,
  onClose,
  initialTopic = '',
  initialSourceText = '',
  sourceLabel = '',
  contentId = '',
  contentType = 'generic',
  sourceTitle = '',
  userId = '00000000-0000-0000-0000-000000000001',
  assignmentContext = null,
  variant = 'overlay',
}) => {
  const { language } = useLanguage();
  const t = translations[language].explain_back;

  const [topic, setTopic] = useState(initialTopic);
  const [sourceText, setSourceText] = useState(initialSourceText);
  const [explanation, setExplanation] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [followUpPrompt, setFollowUpPrompt] = useState('');
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [followUpAnswers, setFollowUpAnswers] = useState([]);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [assignmentCompletion, setAssignmentCompletion] = useState(null);
  const recognitionRef = useRef(null);

  const canSubmit = useMemo(
    () => topic.trim().length > 0 && explanation.trim().length > 0 && !isLoading,
    [topic, explanation, isLoading]
  );

  const canFinalize = useMemo(
    () =>
      followUpQuestions.length > 0 &&
      followUpAnswers.every((answer) => answer.trim().length > 0) &&
      !isLoading,
    [followUpAnswers, followUpQuestions, isLoading]
  );

  useEffect(() => {
    if (!isOpen) return;
    setTopic(initialTopic);
    setSourceText(initialSourceText);
    setExplanation('');
    setResult(null);
    setError('');
    setFollowUpPrompt('');
    setFollowUpQuestions([]);
    setFollowUpAnswers([]);
    setIsFollowUpOpen(false);
    setSessionId(null);
    setAssignmentCompletion(null);
  }, [isOpen, initialTopic]);

  useEffect(() => {
    if (!isOpen) return;
    setSourceText(initialSourceText);
  }, [initialSourceText, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    if (variant === 'overlay') {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (variant === 'overlay') {
        document.body.style.overflow = 'unset';
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen, variant]);

  if (!isOpen) return null;

  const isEmbedded = variant === 'embedded';

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;

    if (!SpeechRecognition) {
      setError(t.voice_not_supported);
      return;
    }

    setError('');
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ru' ? 'ru-RU' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    let finalTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) {
          finalTranscript += `${text.trim()} `;
        } else {
          interimTranscript += text;
        }
      }

      setExplanation((current) => {
        const addition = `${finalTranscript}${interimTranscript}`.trim();
        if (!addition) return current;
        return addition;
      });
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        setError(t.voice_error.replace('{reason}', event.error));
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleGenerateFollowUps = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setAssignmentCompletion(null);

    try {
      const response = await generateExplainBackFollowUps({
        topic,
        sourceText,
        explanation,
        language,
      });

      const createdSessionId = await createExplainBackSessionWithQuestions({
        userId,
        contentId,
        contentType,
        sourceLabel,
        sourceTitle: sourceTitle || initialTopic,
        topic,
        sourceText,
        explanation,
        followUpSummary: response.summary || '',
        questions: (response.followUpQuestions || []).map((question, index) => ({
          questionText: question,
          answerText: response.referenceAnswers?.[index] || ''
        }))
      });

      setSessionId(createdSessionId);
      setFollowUpPrompt(response.summary || '');
      setFollowUpQuestions(response.followUpQuestions || []);
      setFollowUpAnswers(new Array((response.followUpQuestions || []).length).fill(''));
      setIsFollowUpOpen(true);
    } catch (evaluationError) {
      setError(evaluationError.message || t.generic_error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpAnswerChange = (index, value) => {
    setFollowUpAnswers((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const handleFinalEvaluate = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const followUpQA = followUpQuestions
        .map((question, index) => `Q: ${question}\nA: ${followUpAnswers[index] || ''}`)
        .join('\n\n');

      const response = await evaluateExplainBackWithFollowUps({
        topic,
        sourceText,
        explanation,
        followUpQA,
        language,
      });

      if (sessionId) {
        await updateExplainBackSessionEvaluation({
          sessionId,
          explanation,
          overallScore: response.overallScore,
          confidenceLevel: response.confidenceLevel,
          criteria: response.criteria,
          strengths: response.strengths,
          gaps: response.gaps,
          nextStep: response.nextStep
        });

        const score = Number(response.overallScore || 0);
        const reward =
          score >= 9 ? 26 :
          score >= 7 ? 18 :
          score >= 5 ? 10 :
          4;

        await awardSmartCoins({
          userId,
          amount: reward,
          reason: 'explain_back_score',
          idempotencyKey: `explain-back-score-${sessionId}`,
          metadata: {
            sessionId,
            score,
            topic
          }
        });
      }

      setResult(response);
      if (assignmentContext?.assignmentId && Number(assignmentContext?.requiredScore || 0) > 0) {
        const score = Number(response.overallScore || 0);
        const requiredScore = Number(assignmentContext.requiredScore || 0);

        setAssignmentCompletion({
          isAssignment: true,
          passed: score >= requiredScore,
          score,
          requiredScore,
          title: assignmentContext.assignmentTitle || topic
        });
      } else {
        setAssignmentCompletion(null);
      }
      setIsFollowUpOpen(false);
    } catch (evaluationError) {
      setError(evaluationError.message || t.generic_error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setFollowUpPrompt('');
    setFollowUpQuestions([]);
    setFollowUpAnswers([]);
    setIsFollowUpOpen(false);
    setAssignmentCompletion(null);
  };

  const content = (
    <div
      className={`explain-modal-content${isEmbedded ? ' explain-modal-content--embedded' : ''}`}
      onClick={(event) => event.stopPropagation()}
    >
      {onClose ? (
        <button className={`explain-modal-close${isEmbedded ? ' explain-modal-close--embedded' : ''}`} onClick={onClose}>
          <X size={18} />
        </button>
      ) : null}

      <div className="explain-modal-grid explain-modal-grid--single">
        <section className="explain-modal-panel explain-modal-panel--single">
          <div className="explain-modal-panel__header">
            <div>
              <span className="explain-modal-chip">{sourceLabel || t.inline_chip}</span>
              <h2>{result ? t.results_title : t.inline_title}</h2>
              <p>{result ? t.results_subtitle : t.inline_subtitle}</p>
            </div>
          </div>

          {!result ? (
            <>
              <label className="explain-modal-field">
                <span>{t.topic_label}</span>
                <input value={topic} onChange={(event) => setTopic(event.target.value)} />
              </label>

              <label className="explain-modal-field">
                <span>{t.source_label}</span>
                <textarea
                  value={sourceText}
                  onChange={(event) => setSourceText(event.target.value)}
                  rows={5}
                />
              </label>

              <label className="explain-modal-field">
                <div className="explain-modal-field__row">
                  <span>{t.explanation_label}</span>
                  <button
                    className={`explain-modal-voice ${isListening ? 'is-live' : ''}`}
                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                    type="button"
                  >
                    {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                    {isListening ? t.stop_voice : t.start_voice}
                  </button>
                </div>
                <textarea
                  value={explanation}
                  onChange={(event) => setExplanation(event.target.value)}
                  placeholder={t.explanation_placeholder}
                  rows={7}
                />
              </label>

              {error ? <div className="explain-modal-error">{error}</div> : null}

              <button
                className="explain-modal-submit"
                disabled={!canSubmit}
                onClick={handleGenerateFollowUps}
              >
                {isLoading ? <LoaderCircle size={18} className="spin" /> : <WandSparkles size={18} />}
                {isLoading ? t.loading : t.generate_questions}
              </button>
            </>
          ) : (
            <div className="explain-modal-results__content">
              {assignmentCompletion?.isAssignment ? (
                <div className={`explain-assignment-banner ${assignmentCompletion.passed ? 'is-success' : 'is-pending'}`}>
                  <div className="explain-assignment-banner__title">
                    {assignmentCompletion.passed ? t.assignment_success_title : t.assignment_pending_title}
                  </div>
                  <p>
                    {assignmentCompletion.passed
                      ? t.assignment_success_message
                        .replace('{title}', assignmentCompletion.title || t.assignment_default_title)
                        .replace('{score}', assignmentCompletion.score)
                      : t.assignment_pending_message
                        .replace('{required}', assignmentCompletion.requiredScore)
                        .replace('{score}', assignmentCompletion.score)}
                  </p>
                </div>
              ) : null}

              <div className="explain-modal-summary">
                <div>
                  <span>{t.overall_score}</span>
                  <strong>{result.overallScore}/10</strong>
                </div>
                <div>
                  <span>{t.confidence}</span>
                  <strong>{result.confidenceLevel}</strong>
                </div>
              </div>

              <div className="explain-modal-metrics">
                {Object.entries(result.criteria || {}).map(([key, value]) => (
                  <article key={key} className="explain-modal-metric">
                    <div className="explain-modal-metric__row">
                      <span>{t.criteria[key] || key}</span>
                      <strong>{value.score}/10</strong>
                    </div>
                    <p>{value.feedback}</p>
                  </article>
                ))}
              </div>

              <section className="explain-modal-section">
                <h3>{t.strengths}</h3>
                <ul>
                  {(result.strengths || []).map((item, index) => (
                    <li key={`${item}-${index}`}>
                      <CheckCircle2 size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="explain-modal-section">
                <h3>{t.gaps}</h3>
                <ul>
                  {(result.gaps || []).map((item, index) => (
                    <li key={`${item}-${index}`}>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="explain-modal-section">
                <h3>{t.next_step}</h3>
                <p>{result.nextStep}</p>
              </section>

              <section className="explain-modal-section">
                <h3>{t.annotated_explanation}</h3>
                <HighlightedText text={explanation} highlights={result.highlights} />
              </section>

              {followUpQuestions.length > 0 ? (
                <section className="explain-modal-section">
                  <h3>{t.annotated_followups}</h3>
                  <div className="explain-annotated-list">
                    {followUpQuestions.map((question, index) => (
                      <article key={`${question}-${index}`} className="explain-annotated-item">
                        <strong>{question}</strong>
                        <HighlightedText
                          text={followUpAnswers[index] || ''}
                          highlights={result.followUpHighlights?.[index] || { correctTerms: [], incorrectTerms: [] }}
                        />
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <button className="explain-modal-submit explain-modal-submit--secondary" onClick={handleReset}>
                {t.reset}
              </button>
            </div>
          )}
        </section>
      </div>

      {isFollowUpOpen ? (
        <div
          className={`explain-followup-popup-overlay${isEmbedded ? ' explain-followup-popup-overlay--embedded' : ''}`}
          onClick={() => setIsFollowUpOpen(false)}
        >
          <div className="explain-followup-popup" onClick={(event) => event.stopPropagation()}>
            <div className="explain-followup-popup__header">
              <div>
                <span className="explain-modal-chip">{t.followup_badge}</span>
                <h3>{t.followup_title}</h3>
                <p>{followUpPrompt || t.followup_subtitle}</p>
              </div>
              <button className="explain-followup-popup__close" onClick={() => setIsFollowUpOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="explain-followup-popup__body">
              {followUpQuestions.map((question, index) => (
                <label key={`${question}-${index}`} className="explain-modal-field">
                  <span>{question}</span>
                  <textarea
                    value={followUpAnswers[index] || ''}
                    onChange={(event) => handleFollowUpAnswerChange(index, event.target.value)}
                    rows={3}
                    placeholder={t.followup_answer_placeholder}
                  />
                </label>
              ))}
            </div>

            <div className="explain-followup-popup__actions">
              <button
                className="explain-modal-submit explain-modal-submit--secondary"
                disabled={!canFinalize}
                onClick={handleFinalEvaluate}
              >
                {isLoading ? <LoaderCircle size={18} className="spin" /> : <WandSparkles size={18} />}
                {isLoading ? t.loading : t.final_evaluate}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  if (isEmbedded) {
    return <div className="explain-panel-shell">{content}</div>;
  }

  return (
    <div className="explain-modal-overlay" onClick={onClose}>
      {content}
    </div>
  );
};

export default ExplainBackModal;
