import React, { useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    const t = translations[language].auth;
    const { signInWithEmail, signUpWithEmail } = useAuth();
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('Student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const action = mode === 'login'
            ? signInWithEmail(email, password)
            : signUpWithEmail(email, password, username, role);

        const { error: authError } = await action;

        if (authError) {
            if (authError.message?.toLowerCase().includes('database error saving new user')) {
                setError(t.register_db_error);
            } else {
                setError(authError.message);
            }
            setLoading(false);
            return;
        }

        if (mode === 'register') {
            setSuccess(t.register_success);
        } else {
            onClose();
        }

        setLoading(false);
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(event) => event.stopPropagation()}>
                <button className="auth-modal-close" onClick={onClose} type="button">
                    <X size={18} />
                </button>

                <div className="auth-modal-header">
                    <span className="auth-modal-chip">{mode === 'login' ? t.login : t.register}</span>
                    <h2>{mode === 'login' ? t.title_login : t.title_register}</h2>
                    <p>{mode === 'login' ? t.subtitle_login : t.subtitle_register}</p>
                </div>

                <div className="auth-modal-tabs">
                    <button
                        type="button"
                        className={`auth-modal-tab${mode === 'login' ? ' active' : ''}`}
                        onClick={() => setMode('login')}
                    >
                        {t.login}
                    </button>
                    <button
                        type="button"
                        className={`auth-modal-tab${mode === 'register' ? ' active' : ''}`}
                        onClick={() => setMode('register')}
                    >
                        {t.register}
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === 'register' ? (
                        <>
                            <label className="auth-field">
                                <span>{t.username}</span>
                                <input value={username} onChange={(event) => setUsername(event.target.value)} required />
                            </label>

                            <div className="auth-field">
                                <span>{t.role_label}</span>
                                <div className="auth-role-grid">
                                    <button
                                        type="button"
                                        className={`auth-role-option${role === 'Student' ? ' is-active' : ''}`}
                                        onClick={() => setRole('Student')}
                                    >
                                        {t.role_student}
                                    </button>
                                    <button
                                        type="button"
                                        className={`auth-role-option${role === 'Teacher' ? ' is-active' : ''}`}
                                        onClick={() => setRole('Teacher')}
                                    >
                                        {t.role_teacher}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : null}

                    <label className="auth-field">
                        <span>{t.email}</span>
                        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    </label>

                    <label className="auth-field">
                        <span>{t.password}</span>
                        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    </label>

                    {error ? <div className="auth-message auth-message--error">{error}</div> : null}
                    {success ? <div className="auth-message auth-message--success">{success}</div> : null}

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? <LoaderCircle size={18} className="spin" /> : null}
                        {mode === 'login' ? t.login_cta : t.register_cta}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
