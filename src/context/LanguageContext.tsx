import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 1. Tipos válidos de idioma
export type Language = 'es' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
}

// 2. Crear el Contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 3. Proveedor (Provider) que envuelve la app y maneja el estado
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Leemos del localStorage si ya existía una preferencia previa, o usamos 'es'
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio_lang') as Language;
    return saved === 'en' || saved === 'es' ? saved : 'es';
  });

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    localStorage.setItem('portfolio_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'es' ? 'en' : 'es'));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 4. Hook personalizado para consumir el idioma en cualquier componente
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de un LanguageProvider');
  }
  return context;
}