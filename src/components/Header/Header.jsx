import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthModal from '../AuthModal/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Header.css';

const Header = () => {
    const { user, isAuthenticated, signOut } = useAuth();
    const { language } = useLanguage();
    const t = translations[language].header;
    const [isAuthOpen, setIsAuthOpen] = React.useState(false);

    return (
        <>
            <header className="site-header">
                <NavLink to="/" className="header-logo">
                    <img src="/assets/logo.svg" alt={t.app_name} className="logo-img" />
                    <span className="logo-text">{t.app_name}</span>
                </NavLink>

                <nav className="header-nav">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `header-link${isActive ? ' active' : ''}`}
                    >
                        {t.about}
                    </NavLink>
                    <NavLink
                        to="/explain-back"
                        className={({ isActive }) => `header-link${isActive ? ' active' : ''}`}
                    >
                        {t.explain_back}
                    </NavLink>
                    <NavLink
                        to="/memory-refresh"
                        className={({ isActive }) => `header-link${isActive ? ' active' : ''}`}
                    >
                        {t.memory_refresh}
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `header-link${isActive ? ' active' : ''}`}
                    >
                        {t.settings}
                    </NavLink>

                    {!isAuthenticated ? (
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="header-link header-link--cta"
                        >
                            {t.login}
                        </button>
                    ) : (
                        <>
                            <span className="header-user-pill">{user?.email}</span>
                            <button
                                onClick={signOut}
                                className="header-link header-link--cta"
                            >
                                {t.logout}
                            </button>
                        </>
                    )}
                </nav>
            </header>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
};

export default Header;
