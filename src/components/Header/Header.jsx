import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Header.css';

const Header = () => {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const { language } = useLanguage();
    const t = translations[language].header;

    return (
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
                    to="/settings"
                    className={({ isActive }) => `header-link${isActive ? ' active' : ''}`}
                >
                    {t.settings}
                </NavLink>

                {!isAuthenticated ? (
                    <button
                        onClick={() => loginWithRedirect()}
                        className="header-link header-link--cta"
                    >
                        {t.login}
                    </button>
                ) : (
                    <button
                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        className="header-link header-link--cta"
                    >
                        {t.logout}
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;
