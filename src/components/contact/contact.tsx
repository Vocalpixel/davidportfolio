import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './contact.scss';

const EMAIL = 'david.bernal.software@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/isaac-david-bernal-chirino/';
const CV_URL = '/cv-david-bernal.pdf';

export function Contact() {
    const { lang } = useLanguage();
    const [copied, setCopied] = useState(false);

    const text = {
        es: {
            title: 'Contacto',
            subtitle: '¿Tienes algún proyecto o idea en mente? Hablemos.',
            copyEmail: 'Copiar correo',
            copied: '¡Copiado!',
            sendEmail: 'Enviar correo',
            linkedin: 'LinkedIn',
            cv: 'Descargar CV'
        },
        en: {
            title: 'Contact',
            subtitle: 'Have a project or idea in mind? Let’s talk.',
            copyEmail: 'Copy email',
            copied: 'Copied!',
            sendEmail: 'Send email',
            linkedin: 'LinkedIn',
            cv: 'Download CV'
        }
    };

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.location.href = `mailto:${EMAIL}`;
        }
    };

    return (
        <section id="contact" className="contact_section">
            <div className="contact_container">
                <div className="contact_header">
                    <h2 className="contact_title">{text[lang].title}</h2>
                    <p className="contact_subtitle">{text[lang].subtitle}</p>
                </div>

                {/* Tarjeta principal de correo electrónico */}
                <div className="contact_email_box">
                    <a
                        href={`mailto:${EMAIL}`}
                        className="contact_email_link"
                        title={text[lang].sendEmail}
                    >
                        <i className="pi pi-envelope contact_email_icon"></i>
                        <span>{EMAIL}</span>
                    </a>

                    <button
                        type="button"
                        className={`contact_copy_btn ${copied ? 'copied' : ''}`}
                        onClick={handleCopyEmail}
                        title={copied ? text[lang].copied : text[lang].copyEmail}
                        aria-label={text[lang].copyEmail}
                    >
                        <i className={`pi ${copied ? 'pi-check' : 'pi-copy'}`}></i>
                        <span>{copied ? text[lang].copied : text[lang].copyEmail}</span>
                    </button>
                </div>

                {/* Botones de LinkedIn y CV */}
                <div className="contact_actions">
                    <a
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact_btn"
                    >
                        <i className="pi pi-linkedin"></i>
                        <span>{text[lang].linkedin}</span>
                    </a>

                    <a
                        href={CV_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        download="David_Bernal_CV.pdf"
                        className="contact_btn"
                    >
                        <i className="pi pi-file-pdf"></i>
                        <span>{text[lang].cv}</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
