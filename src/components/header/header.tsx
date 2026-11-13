import { useState, useEffect } from 'react';
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };
        const handleScroll = () => setMobileMenuOpen(false);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [mobileMenuOpen]);

    const activeNav = activeSection ?? internalNav;

    const handleNav = (e: React.MouseEvent, target: string) => {
        e.preventDefault();
        setInternalNav(target);
        setMobileMenuOpen(false);
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
            home: 'Inicio',
            about: 'Sobre mí', 
            projects: 'Proyectos', 
            contact: 'Contacto',
            effectsOn: 'Desactivar animaciones',
            effectsOff: 'Activar animaciones',
            menuOpen: 'Abrir menú',
            menuClose: 'Cerrar menú'
        },
        en: { 
            brand: 'Portfolio', 
            home: 'Home',
            about: 'About', 
            projects: 'Projects', 
            contact: 'Contact',
            effectsOn: 'Disable animations',
            effectsOff: 'Enable animations',
            menuOpen: 'Open menu',
            menuClose: 'Close menu'
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
                <button
                    type="button"
                    className={`mobile_menu_btn ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    aria-expanded={mobileMenuOpen}
                    aria-label={mobileMenuOpen ? text[lang].menuClose : text[lang].menuOpen}
                >
                    <i className={`pi ${mobileMenuOpen ? 'pi-times' : 'pi-bars'}`}></i>
                </button>
            </div>

            {/* Backdrop táctil para cerrar el menú al tocar fuera */}
            {mobileMenuOpen && (
                <div
                    className="header_mobile_backdrop"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Menú desplegable adaptado a móvil */}
            <nav className={`header_mobile_menu ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Mobile navigation">
                <a
                    href="#home"
                    className={activeNav === '#home' ? 'active' : ''}
                    onClick={(e) => handleNav(e, '#home')}
                >
                    <i className="pi pi-home"></i>
                    <span>{text[lang].home}</span>
                </a>
                <a
                    href="#about"
                    className={activeNav === '#about' ? 'active' : ''}
                    onClick={(e) => handleNav(e, '#about')}
                >
                    <i className="pi pi-user"></i>
                    <span>{text[lang].about}</span>
                </a>
                <a
                    href="#projects"
                    className={activeNav === '#projects' ? 'active' : ''}
                    onClick={(e) => handleNav(e, '#projects')}
                >
                    <i className="pi pi-briefcase"></i>
                    <span>{text[lang].projects}</span>
                </a>
                <a
                    href="#contact"
                    className={activeNav === '#contact' ? 'active' : ''}
                    onClick={(e) => handleNav(e, '#contact')}
                >
                    <i className="pi pi-envelope"></i>
                    <span>{text[lang].contact}</span>
                </a>
            </nav>
        </header>
    );
}
