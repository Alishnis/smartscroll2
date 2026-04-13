import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import Skeleton from '../../components/Skeleton/Skeleton';
import FactModal from '../../components/FactModal/FactModal';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Facts.css';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' }
];

const CATEGORIES = [
    { id: 'all', en: 'All Topics', ru: 'Все темы' },
    { id: 'science', en: 'Science', ru: 'Наука' },
    { id: 'history', en: 'History', ru: 'История' },
    { id: 'technology', en: 'Technology', ru: 'Технологии' },
    { id: 'art', en: 'Art', ru: 'Искусство' },
    { id: 'nature', en: 'Nature', ru: 'Природа' }
];

const Facts = () => {
    const { language, setLanguage } = useLanguage();
    const t = translations[language].facts;
    const [facts, setFacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('all');
    const [selectedFact, setSelectedFact] = useState(null);

    const fetchFacts = async () => {
        setLoading(true);
        setError(null);
        try {
            const offset = Math.floor(Math.random() * 50);
            let url = '';

            if (category === 'all') {
                url = `https://${language}.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&grnlimit=20&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=300&format=json&origin=*`;
            } else {
                const categoryTerm = CATEGORIES.find(c => c.id === category)[language];
                url = `https://${language}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(categoryTerm)}&gsrlimit=20&gsroffset=${offset}&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=300&format=json&origin=*`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch facts from Wikipedia');
            }

            const data = await response.json();
            const pages = data.query?.pages ? Object.values(data.query.pages) : [];

            // Format the needed data
            const formattedFacts = pages.map(data => ({
                id: data.pageid,
                title: data.title,
                extract: data.extract,
                thumbnail: data.thumbnail?.source || null,
                url: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(data.title)}`
            }));

            // Randomly shuffle to ensure variety if it's a search
            setFacts(formattedFacts.sort(() => 0.5 - Math.random()));

        } catch (err) {
            console.error("Error fetching Wikipedia fact:", err);
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch initial facts on mount and whenever filters change
    useEffect(() => {
        fetchFacts();
    }, [language, category]);

    return (
        <div className="page-container facts-page">
            <header className="page-header" style={{ marginBottom: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <LucideIcons.BookOpen className="text-accent" size={32} />
                    <h1 className="tech-font text-gradient">{t.title}</h1>
                </div>
                <p className="subtitle">{t.subtitle}</p>
            </header>

            <div className="facts-filters">
                <select
                    className="glass-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                </select>
                <select
                    className="glass-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat[language]}</option>
                    ))}
                </select>
            </div>

            <div className="facts-content">
                {error ? (
                    <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-xl)', textAlign: 'center', width: '100%' }}>
                        <LucideIcons.AlertTriangle size={32} className="text-secondary" style={{ marginBottom: '16px' }} />
                        <p>{error}</p>
                        <button className="new-fact-btn" onClick={fetchFacts} style={{ margin: '16px auto 0' }}>
                            {t.try_again}
                        </button>
                    </div>
                ) : loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="fact-card loading-fact">
                            <div className="skeleton title" style={{ width: '60%' }}></div>
                            <div className="skeleton bar" style={{ width: '100%' }}></div>
                            <div className="skeleton bar" style={{ width: '100%' }}></div>
                            <div className="skeleton bar" style={{ width: '80%' }}></div>
                        </div>
                    ))
                ) : (
                    facts.map((fact) => (
                        <div
                            key={fact.id}
                            className="fact-card clickable"
                            onClick={() => setSelectedFact(fact)}
                        >
                            <div className="fact-header">
                                <h2 className="fact-title">{fact.title}</h2>
                            </div>
                            <div className="fact-body">
                                {fact.thumbnail && (
                                    <img src={fact.thumbnail} alt={fact.title} className="fact-thumbnail" />
                                )}
                                <p className="fact-extract">{fact.extract}</p>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {selectedFact && (
                <FactModal
                    fact={selectedFact}
                    onClose={() => setSelectedFact(null)}
                />
            )}
        </div>
    );
};

export default Facts;
