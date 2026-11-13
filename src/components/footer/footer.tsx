import { useLanguage } from '../../context/LanguageContext';
import './footer.scss';

export function Footer() {
    const { lang } = useLanguage();

    return (
        <footer className="footer">
            <div className="footer_credits">
                <p>
                    {lang === 'es' 
                        ? "Portafolio de David v1.0 por David Bernal" 
                        : "David's Portfolio v1.0 by David Bernal"}
                </p>
            </div>

            <div className="footer_social">
                <a 
                    href="https://github.com/Vocalpixel" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer_social_btn"
                    aria-label="GitHub de David Bernal"
                >
                    <i className="pi pi-github"></i>
                </a>
                <a 
                    href="https://www.linkedin.com/in/isaac-david-bernal-chirino/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer_social_btn"
                    aria-label="LinkedIn de David Bernal"
                >
                    <i className="pi pi-linkedin"></i>
                </a>
            </div>
        </footer>
    );
}
