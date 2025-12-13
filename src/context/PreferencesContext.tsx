import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { STORAGE_KEYS, persistJSON, readJSON } from '../utils/storage';

type ThemeMode = 'dark' | 'neon';
type Language = 'ko' | 'en';

type PreferencesContextType = {
  theme: ThemeMode;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('neon');
  const [language, setLang] = useState<Language>('ko');

  useEffect(() => {
    const saved = readJSON<{ theme?: ThemeMode; language?: Language }>(STORAGE_KEYS.preferences, {});
    if (saved.theme) setTheme(saved.theme);
    if (saved.language) setLang(saved.language);
  }, []);

  useEffect(() => {
    persistJSON(STORAGE_KEYS.preferences, { theme, language });
    if (typeof document !== 'undefined') {
      document.body.dataset.theme = theme;
      document.documentElement.lang = language;
    }
  }, [theme, language]);

  const toggleTheme = () => setTheme((prev) => (prev === 'neon' ? 'dark' : 'neon'));
  const setLanguage = (lang: Language) => setLang(lang);

  const value = useMemo(
    () => ({
      theme,
      language,
      toggleTheme,
      setLanguage,
    }),
    [theme, language],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
