import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface EffectsContextType {
  effectsEnabled: boolean;
  toggleEffects: () => void;
}

const EffectsContext = createContext<EffectsContextType | undefined>(undefined);

export function EffectsProvider({ children }: { children: ReactNode }) {
  const [effectsEnabled, setEffectsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('portfolio_effects');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_effects', String(effectsEnabled));
    document.documentElement.setAttribute('data-effects', effectsEnabled ? 'on' : 'off');
  }, [effectsEnabled]);

  const toggleEffects = () => {
    setEffectsEnabled(prev => !prev);
  };

  return (
    <EffectsContext.Provider value={{ effectsEnabled, toggleEffects }}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const context = useContext(EffectsContext);
  if (!context) {
    throw new Error('useEffects debe usarse dentro de un EffectsProvider');
  }
  return context;
}
