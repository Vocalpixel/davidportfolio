import { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import ankhorPreview from '../../assets/projects/ankhor-preview.png';
import xenithPreview from '../../assets/projects/xenith-preview.png';
import diariventPreview from '../../assets/projects/diarivent-preview.png';
import paaxPreview from '../../assets/projects/paax-preview.png';
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
            es: 'Ankhor',
            en: 'Ankhor'
        },
        description: {
            es: 'App móvil offline de notas con listas de verificación y tablero Kanban mini en SQLite local.',
            en: 'Offline mobile notes app with checklists and a mini Kanban board powered by local SQLite.'
        },
        image: ankhorPreview,
        url: '#projects'
    },
    {
        id: 2,
        title: {
            es: 'Xenith',
            en: 'Xenith'
        },
        description: {
            es: 'App móvil de finanzas personales 100% offline con balance, metas de ahorro, análisis gráfico y calendario de pagos.',
            en: '100% offline personal finance mobile app with period balance, savings goals, chart analytics, and payment calendar.'
        },
        image: xenithPreview,
        url: '#projects'
    },
    {
        id: 3,
        title: {
            es: 'DiariVent',
            en: 'DiariVent'
        },
        description: {
            es: 'App móvil de administración financiera y punto de venta para pequeñas y micro empresas: venta rápida, caja, artículos e historial.',
            en: 'Mobile financial management and POS app for small & micro businesses: fast sale, cash register, inventory, and history.'
        },
        image: diariventPreview,
        url: '#projects'
    },
    {
        id: 4,
        title: {
            es: 'Paax',
            en: 'Paax'
        },
        description: {
            es: 'Reproductor de música móvil con interfaz simple y limpia: biblioteca por canciones, artistas, álbumes y géneros.',
            en: 'Mobile music player with a clean, simple interface: library organized by songs, artists, albums, and genres.'
        },
        image: paaxPreview,
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

interface ProjectsProps {
    activeProject?: number;
    onSelectProject?: (index: number) => void;
}

export function Projects({ activeProject, onSelectProject }: ProjectsProps) {
    const { lang } = useLanguage();
    const [internalIndex, setInternalIndex] = useState<number>(0);
    const touchStartX = useRef<number | null>(null);

    const activeIndex = activeProject ?? internalIndex;

    const selectIndex = useCallback((nextIndex: number) => {
        if (onSelectProject) {
            onSelectProject(nextIndex);
        } else {
            setInternalIndex(nextIndex);
        }
    }, [onSelectProject]);

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
        selectIndex((activeIndex - 1 + total) % total);
    }, [activeIndex, total, selectIndex]);

    const handleNext = useCallback(() => {
        selectIndex((activeIndex + 1) % total);
    }, [activeIndex, total, selectIndex]);

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
            <div id="projects-sticky" className="projects_sticky">
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
                                onClick={() => selectIndex(index)}
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
            </div>
        </section>
    );
}
