import React from 'react';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './About.css';

const About = () => {
    const { language } = useLanguage();
    const t = translations[language].about;

    return (
        <div className="page-container about-page">
            <section className="about-hero">
                <h1 className="about-title">
                    {t.title_main}<br />
                    <span className="about-title-accent">{t.title_accent}</span>
                </h1>
                <p className="about-subtitle">
                    {t.subtitle}
                </p>
                <div className="about-cta-row">
                    <a href="/feed" className="about-btn-primary">{t.btn_primary}</a>
                    <a href="/posts" className="about-btn-secondary">{t.btn_secondary}</a>
                </div>
            </section>

            <section className="about-features">
                <SpotlightCard className="feature-card">
                    <div className="feature-icon">🎬</div>
                    <h3>{t.feature1_title}</h3>
                    <p>{t.feature1_desc}</p>
                </SpotlightCard>
                <SpotlightCard className="feature-card">
                    <div className="feature-icon">📰</div>
                    <h3>{t.feature2_title}</h3>
                    <p>{t.feature2_desc}</p>
                </SpotlightCard>
                <SpotlightCard className="feature-card">
                    <div className="feature-icon">🤖</div>
                    <h3>{t.feature3_title}</h3>
                    <p>{t.feature3_desc}</p>
                </SpotlightCard>
            </section>
        </div>
    );
};

export default About;
