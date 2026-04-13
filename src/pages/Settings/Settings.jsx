import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translations } from '../../i18n/translations';
import './Settings.css';

const Settings = () => {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const t = translations[language].settings;

    const [localLanguage, setLocalLanguage] = useState(language);
    const [localTheme, setLocalTheme] = useState(theme);

    useEffect(() => {
        setLocalLanguage(language);
        setLocalTheme(theme);
    }, [language, theme]);

    const handleApplyChanges = () => {
        if (localLanguage !== language) setLanguage(localLanguage);
        if (localTheme !== theme) setTheme(localTheme);
    };

    const hasChanges = localLanguage !== language || localTheme !== theme;

    return (
        <div className="page-container settings-page">
            <header className="page-header">
                <h1 className="tech-font text-gradient">{t.title}</h1>
                <p className="subtitle">{t.subtitle}</p>
            </header>

            <div className="settings-sections">
                <section className="settings-section">
                    <h2 className="section-title">{t.section_pref}</h2>
                    <SpotlightCard className="settings-card">
                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-icon"><LucideIcons.Globe size={20} /></div>
                                <div>
                                    <h3>{t.lang_title}</h3>
                                    <p className="text-secondary">{t.lang_desc}</p>
                                </div>
                            </div>
                            <div className="setting-action">
                                <button className="language-toggle dropdown-toggle" onClick={() => setLocalLanguage(localLanguage === 'en' ? 'ru' : 'en')} style={{ minWidth: '120px', justifyContent: 'center' }}>
                                    <span className={`toggle-option ${localLanguage === 'en' ? 'active' : ''}`}>{t.eng}</span>
                                    <span className={`toggle-option ${localLanguage === 'ru' ? 'active' : ''}`}>{t.rus}</span>
                                </button>
                            </div>
                        </div>

                        <div className="setting-item" style={{ borderTop: '1px solid var(--color-border-default)', paddingTop: '16px', marginTop: '16px' }}>
                            <div className="setting-info">
                                <div className="setting-icon"><LucideIcons.Moon size={20} /></div>
                                <div>
                                    <h3>{t.theme_title}</h3>
                                    <p className="text-secondary">{t.theme_desc}</p>
                                </div>
                            </div>
                            <div className="setting-action">
                                <button className="language-toggle dropdown-toggle" onClick={() => setLocalTheme(localTheme === 'dark' ? 'light' : 'dark')} style={{ minWidth: '160px', justifyContent: 'center' }}>
                                    <span className={`toggle-option ${localTheme === 'light' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <LucideIcons.Sun size={14} /> {t.light}
                                    </span>
                                    <span className={`toggle-option ${localTheme === 'dark' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <LucideIcons.Moon size={14} /> {t.dark}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </SpotlightCard>
                </section>

                <div className="settings-actions" style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className={`join-btn ${hasChanges ? 'accent-bg' : ''}`}
                        onClick={handleApplyChanges}
                        disabled={!hasChanges}
                        style={{ padding: '12px 24px', opacity: hasChanges ? 1 : 0.5 }}
                    >
                        {t.apply}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
