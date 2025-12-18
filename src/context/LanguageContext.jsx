import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState(en);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
            setTranslations(savedLanguage === 'ar' ? ar : en);
        }
    }, []);

    const switchLanguage = (lang) => {
        setLanguage(lang);
        setTranslations(lang === 'ar' ? ar : en);
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, translations }}>
            {children}
        </LanguageContext.Provider>
    );
};
