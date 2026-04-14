import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Brain,
  CheckCircle2,
  LoaderCircle,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { evaluateExplainBack } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './ExplainBack.css';

const emptyResult = null;

const ExplainBack = () => {
  const { language } = useLanguage();
  const t = translations[language].explain_back;

  const [topic, setTopic] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [result, setResult] = useState(emptyResult);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const canSubmit = useMemo(
    () => topic.trim().length > 0 && explanation.trim().length > 0 && !isLoading,
    [topic, explanation, isLoading]
  );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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
        const base = current.replace(/\s+$/, '');
        const addition = `${finalTranscript}${interimTranscript}`.trim();
        if (!addition) return base;
        return `${base}${base ? ' ' : ''}${addition}`.trim();
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

  const handleEvaluate = async () => {
    setIsLoading(true);
    setError('');
    setResult(emptyResult);

    try {
      const response = await evaluateExplainBack({
        topic,
        sourceText,
        explanation,
        language,
      });
      setResult(response);
    } catch (evaluationError) {
      setError(evaluationError.message || t.generic_error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTopic('');
    setSourceText('');
    setExplanation('');
    setResult(emptyResult);
    setError('');
    stopVoiceInput();
  };

  return (
    <div className="page-container explain-page">
      <section className="explain-hero">
        <div className="explain-hero__copy">
          <span className="explain-eyebrow">
            <Sparkles size={14} />
            {t.eyebrow}
          </span>
          <h1 className="explain-title">{t.title}</h1>
          <p className="explain-subtitle">{t.subtitle}</p>
        </div>

        <div className="explain-score-preview glass">
          <div className="explain-score-preview__icon">
            <Brain size={24} />
          </div>
          <div>
            <strong>{t.preview_title}</strong>
            <p>{t.preview_copy}</p>
          </div>
        </div>
      </section>

      <section className="explain-layout">
        <div className="explain-card glass">
          <div className="explain-card__header">
            <div>
              <h2>{t.input_title}</h2>
              <p>{t.input_subtitle}</p>
            </div>
            <button className="explain-reset-btn" onClick={handleReset}>
              <RotateCcw size={16} />
              {t.reset}
            </button>
          </div>

          <label className="explain-field">
            <span>{t.topic_label}</span>
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder={t.topic_placeholder}
            />
          </label>

          <label className="explain-field">
            <span>{t.source_label}</span>
            <textarea
              value={sourceText}
              onChange={(event) => setSourceText(event.target.value)}
              placeholder={t.source_placeholder}
              rows={6}
            />
          </label>

          <label className="explain-field">
            <div className="explain-field__label-row">
              <span>{t.explanation_label}</span>
              <button
                className={`explain-voice-btn ${isListening ? 'is-live' : ''}`}
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                type="button"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                {isListening ? t.stop_voice : t.start_voice}
              </button>
            </div>
            <textarea
              value={explanation}
              onChange={(event) => setExplanation(event.target.value)}
              placeholder={t.explanation_placeholder}
              rows={8}
            />
          </label>

          {error ? <div className="explain-error">{error}</div> : null}

          <button className="explain-submit-btn" disabled={!canSubmit} onClick={handleEvaluate}>
            {isLoading ? <LoaderCircle size={18} className="spin" /> : <WandSparkles size={18} />}
            {isLoading ? t.loading : t.evaluate}
          </button>
        </div>

        <div className="explain-card glass explain-results">
          <div className="explain-card__header">
            <div>
              <h2>{t.results_title}</h2>
              <p>{t.results_subtitle}</p>
            </div>
          </div>

          {!result ? (
            <div className="explain-empty-state">
              <CheckCircle2 size={22} />
              <p>{t.empty_state}</p>
            </div>
          ) : (
            <div className="explain-results__content">
              <div className="explain-overview">
                <div className="explain-overview__score">
                  <span>{t.overall_score}</span>
                  <strong>{result.overallScore}/10</strong>
                </div>
                <div className="explain-overview__score">
                  <span>{t.confidence}</span>
                  <strong>{result.confidenceLevel}</strong>
                </div>
              </div>

              <div className="explain-metric-grid">
                {Object.entries(result.criteria || {}).map(([key, value]) => (
                  <article key={key} className="explain-metric">
                    <div className="explain-metric__row">
                      <span>{t.criteria[key] || key}</span>
                      <strong>{value.score}/10</strong>
                    </div>
                    <p>{value.feedback}</p>
                  </article>
                ))}
              </div>

              <div className="explain-section">
                <h3>{t.strengths}</h3>
                <ul>
                  {(result.strengths || []).map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="explain-section">
                <h3>{t.gaps}</h3>
                <ul>
                  {(result.gaps || []).map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="explain-section">
                <h3>{t.next_step}</h3>
                <p>{result.nextStep}</p>
              </div>

              <div className="explain-section">
                <h3>{t.rewrite}</h3>
                <p>{result.sampleRewrite}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExplainBack;
