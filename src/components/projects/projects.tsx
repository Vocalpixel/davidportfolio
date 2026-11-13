import { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './projects.scss';

export interface ProjectSlot {
    id: number;
    title: {
        es: string;
        en: string;
    };
    description: {
        es: string;
        en: string;
    };
    image?: string;
    url: string;
}

const PROJECT_SLOTS: ProjectSlot[] = [
    {
        id: 1,
        title: {
            es: 'Proyecto 01',
            en: 'Project 01'
        },
        description: {
            es: 'Espacio reservado para imagen y enlace del proyecto 1.',
            en: 'Reserved slot for project 1 image and link.'
        },
        image: '',
        url: '#projects'
    },
    {
        id: 2,
        title: {
            es: 'Proyecto 02',
            en: 'Project 02'
        },
        description: {
            es: 'Espacio reservado para imagen y enlace del proyecto 2.',
            en: 'Reserved slot for project 2 image and link.'
        },
        image: '',
        url: '#projects'
    },
    {
        id: 3,
        title: {
            es: 'Proyecto 03',
            en: 'Project 03'
        },
        description: {
            es: 'Espacio reservado para imagen y enlace del proyecto 3.',
            en: 'Reserved slot for project 3 image and link.'
        },
        image: '',
        url: '#projects'
    },
    {
        id: 4,
        title: {
            es: 'Proyecto 04',
            en: 'Project 04'
        },
        description: {
            es: 'Espacio reservado para imagen y enlace del proyecto 4.',
            en: 'Reserved slot for project 4 image and link.'
        },
        image: '',
        url: '#projects'
    },
    {
        id: 5,
        title: {
            es: 'Proyecto 05',
            en: 'Project 05'
        },
        description: {
            es: 'Espacio reservado para imagen y enlace del proyecto 5.',
            en: 'Reserved slot for project 5 image and link.'
        },
        image: '',
        url: '#projects'
    }
];

export function Projects() {
    const { lang } = useLanguage();
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const touchStartX = useRef<number | null>(null);

    const text = {
        es: {
            title: 'Proyectos',
            subtitle: 'Explora mis desarrollos y creaciones recientes',
            slotPlaceholder: 'Imagen del proyecto próximamente',
            visitProject: 'Abrir proyecto',
            prev: 'Proyecto anterior',
            next: 'Siguiente proyecto'
        },
        en: {
            title: 'Projects',
            subtitle: 'Explore my recent developments and creations',
            slotPlaceholder: 'Project image coming soon',
            visitProject: 'Open project',
            prev: 'Previous project',
            next: 'Next project'
        }
    };

    const total = PROJECT_SLOTS.length;

    const handlePrev = useCallback(() => {
        setActiveIndex(prev => (prev - 1 + total) % total);
    }, [total]);

    const handleNext = useCallback(() => {
        setActiveIndex(prev => (prev + 1) % total);
    }, [total]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(deltaX) > 40) {
            if (deltaX < 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
        touchStartX.current = null;
    };

    return (
        <section id="projects" className="projects_section">
            <div className="projects_container">
                <div className="projects_header">
                    <h2 className="projects_title">{text[lang].title}</h2>
                    <p className="projects_subtitle">{text[lang].subtitle}</p>
                </div>

                <div className="projects_carousel">
                    {/* Botón Anterior */}
                    <button
                        type="button"
                        className="projects_nav_btn prev"
                        onClick={handlePrev}
                        aria-label={text[lang].prev}
                        title={text[lang].prev}
                    >
                        <i className="pi pi-chevron-left"></i>
                    </button>

                    {/* Viewport del Carrusel con 5 Slots (soporta swipe táctil en móvil) */}
                    <div
                        className="projects_viewport"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="projects_track"
                            style={{
                                transform: `translate3d(-${activeIndex * 100}%, 0, 0)`
                            }}
                        >
                            {PROJECT_SLOTS.map((slot, index) => {
                                const isExternal = slot.url.startsWith('http');
                                return (
                                    <div
                                        key={slot.id}
                                        className={`projects_slide ${index === activeIndex ? 'is-active' : ''}`}
                                        aria-hidden={index !== activeIndex}
                                    >
                                        <a
                                            href={slot.url}
                                            target={isExternal ? '_blank' : undefined}
                                            rel={isExternal ? 'noopener noreferrer' : undefined}
                                            className="projects_card_link"
                                            title={`${slot.title[lang]} — ${text[lang].visitProject}`}
                                        >
                                            <div className="projects_image_slot">
                                                {slot.image ? (
                                                    <img
                                                        src={slot.image}
                                                        alt={slot.title[lang]}
                                                        className="projects_img"
                                                    />
                                                ) : (
                                                    <div className="projects_placeholder">
                                                        <span className="projects_slot_badge">
                                                            SLOT 0{slot.id}
                                                        </span>
                                                        <i className="pi pi-image projects_placeholder_icon"></i>
                                                        <span className="projects_placeholder_text">
                                                            {text[lang].slotPlaceholder}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="projects_card_overlay">
                                                    <span className="projects_overlay_cta">
                                                        <span>{text[lang].visitProject}</span>
                                                        <i className="pi pi-external-link"></i>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="projects_card_info">
                                                <h3 className="projects_card_title">{slot.title[lang]}</h3>
                                                <p className="projects_card_desc">{slot.description[lang]}</p>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Botón Siguiente */}
                    <button
                        type="button"
                        className="projects_nav_btn next"
                        onClick={handleNext}
                        aria-label={text[lang].next}
                        title={text[lang].next}
                    >
                        <i className="pi pi-chevron-right"></i>
                    </button>
                </div>

                {/* Indicadores de los 5 slots (+ flechas compactas en móvil) */}
                <div className="projects_controls_bottom">
                    <button
                        type="button"
                        className="projects_nav_btn mobile_only prev"
                        onClick={handlePrev}
                        aria-label={text[lang].prev}
                        title={text[lang].prev}
                    >
                        <i className="pi pi-chevron-left"></i>
                    </button>

                    <div className="projects_dots" role="tablist" aria-label={text[lang].title}>
                        {PROJECT_SLOTS.map((slot, index) => (
                            <button
                                key={slot.id}
                                type="button"
                                role="tab"
                                aria-selected={index === activeIndex}
                                aria-label={`Slot ${slot.id}`}
                                className={`projects_dot ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => setActiveIndex(index)}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="projects_nav_btn mobile_only next"
                        onClick={handleNext}
                        aria-label={text[lang].next}
                        title={text[lang].next}
                    >
                        <i className="pi pi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}
