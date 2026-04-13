import React, { createContext, useState, useEffect, useContext } from 'react';

// Options: 'en', 'ru'
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Load language from localStorage, defaulting to 'en'
    const [language, setLanguageState] = useState(() => {
        const savedLanguage = localStorage.getItem('smart_scroll_lang');
        return savedLanguage || 'en';
    });

    // Update state and localStorage simultaneously
    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('smart_scroll_lang', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
