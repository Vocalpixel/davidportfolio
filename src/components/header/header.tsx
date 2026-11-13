import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useEffects } from '../../context/EffectsContext';
import './header.scss'; 

interface HeaderProps {
    activeSection?: string;
    onNavigate?: (sectionId: string) => void;
}

export function Header({ activeSection, onNavigate }: HeaderProps){
    const { lang, toggleLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { effectsEnabled, toggleEffects } = useEffects();
    const [internalNav, setInternalNav] = useState('#home');

    const activeNav = activeSection ?? internalNav;

    const handleNav = (e: React.MouseEvent, target: string) => {
        e.preventDefault();
        setInternalNav(target);
        if (onNavigate) {
            onNavigate(target);
        } else {
            const el = document.querySelector(target);
            el?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const text = {
        es: { 
            brand: 'Portafolio', 
            about: 'Sobre mi', 
            projects: 'Proyectos', 
            contact: 'Contacto',
            effectsOn: 'Desactivar animaciones',
            effectsOff: 'Activar animaciones'
        },
        en: { 
            brand: 'Portfolio', 
            about: 'About', 
            projects: 'Projects', 
            contact: 'Contact',
            effectsOn: 'Disable animations',
            effectsOff: 'Enable animations'
        }
    };

    return(
        <header className="header">
            <div className="header_logo">
                <button
                    type="button"
                    className={`header_logo_btn ${activeNav === '#home' ? 'active' : ''}`}
                    onClick={(e) => handleNav(e, '#home')}
                >
                    <i className="pi pi-home"></i>
                </button>
                <a 
                    href='#home'
                    className={`header_logo_title ${activeNav === '#home' ? 'active' : ''}`}
                    onClick={(e) => handleNav(e, '#home')}
                >
                    {text[lang].brand} <span className="header_logo_year">2027</span>
                </a>
            </div>

            <nav className="header_nav">
                <a 
                    href="#about"
                    className={activeNav === '#about' ? 'active' : ''}
                    onClick={(e) => handleNav(e, '#about')}
                >
                    {text[lang].about}
                </a>
                <a 
                    href="#projects"
                    className={activeNav === '#projects' ? 'active' : ''}
                    onClick={(e) => handleNav(e, '#projects')}
                >
                    {text[lang].projects}
                </a>
                <a 
                    href="#contact"
                    className={activeNav === '#contact' ? 'active' : ''}
                    onClick={(e) => handleNav(e, '#contact')}
                >
                    {text[lang].contact}
                </a>
            </nav>

            <div className="header_actions">
                <div className="header_actions_cv">
                </div>
                <button
                    type="button"
                    className="lang_btn"
                    onClick={toggleLanguage}
                >
                    {lang === 'es' ? 'ES' : 'EN'}
                </button>
                <button
                    type="button"
                    className="theme_btn"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    <i className={`pi ${theme === 'dark' ? 'pi-sun' : 'pi-moon'}`}></i>
                </button>
                <button
                    type="button"
                    className={`effects_btn ${effectsEnabled ? 'active' : ''}`}
                    onClick={toggleEffects}
                    title={effectsEnabled ? text[lang].effectsOn : text[lang].effectsOff}
                    aria-label="Toggle visual effects"
                >
                    <i className={`pi ${effectsEnabled ? 'pi-sparkles' : 'pi-pause'}`}></i>
                </button>
            </div>
        </header>
    );
}
