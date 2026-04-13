import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check local storage for saved theme, default to 'dark'
    const storedTheme = localStorage.getItem('smart_scroll_theme');
    const [theme, setThemeState] = useState(storedTheme || 'dark');

    // Function to update state, local storage, and document attribute
    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('smart_scroll_theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // On initial mount, ensure document attribute matches stored theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, []); // Only runs once on mount since theme state handles subsequent updates

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
