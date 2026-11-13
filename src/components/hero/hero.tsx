import { useLanguage } from '../../context/LanguageContext';
import './hero.scss';

interface HeroProps {
    onStartClick?: () => void;
    contentOpacity?: number;
}

export function Hero({ onStartClick, contentOpacity = 1 }: HeroProps) {
    const { lang } = useLanguage();

    const text = {
        es: {
            line1: 'Desarrollador fullstack',
            line2: 'y creador de assets 3D',
            button: 'Comenzar'
        },
        en: {
            line1: 'Fullstack developer',
            line2: 'and 3D asset creator',
            button: 'Start'
        }
    };

    const handleStartClick = () => {
        if (onStartClick) {
            onStartClick();
            return;
        }
        const nextSection = document.getElementById('about');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="home" className="hero">
            {/* Hueco reservado arriba de los textos para el avatar en Home */}
            <div
                id="hero-avatar-slot"
                className="hero_avatar_wrapper"
                aria-hidden="true"
            />

            <div
                className="hero_info"
                style={{
                    opacity: contentOpacity,
                    pointerEvents: contentOpacity < 0.2 ? 'none' : 'auto'
                }}
            >
                <h1 className="hero_title">David Bernal</h1>

                <p className="hero_subtitle">
                    <span>{text[lang].line1}</span>
                    <span>{text[lang].line2}</span>
                </p>

                <button 
                    type="button" 
                    className="hero_btn"
                    onClick={handleStartClick}
                >
                    <span>{text[lang].button}</span>
                    <i className="pi pi-arrow-down hero_btn_icon"></i>
                </button>
            </div>
        </section>
    );
}
