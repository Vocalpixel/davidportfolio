import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './about.scss';

interface AboutProps {
    activeParagraph: number;
    onSelectParagraph: (index: number) => void;
}

type OsTheme = 'win11' | 'macos';

const DESKTOP_LINE_COUNT = 7;
const MOBILE_LINE_COUNT = 9;

export function About({ activeParagraph, onSelectParagraph }: AboutProps) {
    const { lang } = useLanguage();
    const [osTheme, setOsTheme] = useState<OsTheme>('win11');
    const [isMaximized, setIsMaximized] = useState<boolean>(false);
    const [fixedLineCount, setFixedLineCount] = useState<number>(DESKTOP_LINE_COUNT);
    const [closingLineNumber, setClosingLineNumber] = useState<number>(6);
    const [stageHeightPx, setStageHeightPx] = useState<number | undefined>(undefined);

    const codeContentRef = useRef<HTMLDivElement>(null);
    const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);

    const content = {
        es: {
            title: 'Sobre mí',
            switchLabel: osTheme === 'win11' ? 'Cambiar a macOS' : 'Cambiar a Windows 11',
            badgeWin: 'VS Code — Windows 11',
            badgeMac: 'VS Code — macOS',
            minimizeTitle: 'Minimizar',
            maximizeTitle: isMaximized ? 'Restaurar tamaño' : 'Maximizar ventana',
            closeTitle: 'Cerrar',
            menuItems: ['Archivo', 'Editar', 'Ver', 'Ir'],
            activityTitles: ['Explorador', 'Buscar', 'Control de código fuente', 'Extensiones'],
            breadcrumbFolder: 'sobre-mi',
            tabs: ['01_desarrollo.ts', '02_modelado3d.ts', '03_intereses.ts'],
            varNames: ['desarrolladorFullstack', 'creativo3D', 'interesesPersonales'],
            lineColLabel: `Lín ${closingLineNumber}, Col 3`,
            paragraphs: [
                'Soy ingeniero en software y desarrollador Full Stack, apasionado por la programación, la tecnología y la creación de proyectos. Disfruto explorar nuevas herramientas, aprender tecnologías y encontrar soluciones creativas a diferentes problemas.',
                'Además del desarrollo, me interesa el diseño digital, el dibujo y el modelado 3D con Blender. Me gusta experimentar con ideas y combinar la creatividad con la tecnología para crear cosas nuevas.',
                'En mi tiempo libre disfruto los videojuegos, especialmente Metal Gear Solid, así como escuchar música y explorar nuevos intereses. Me considero una persona curiosa, creativa y autodidacta, siempre con ganas de aprender, mejorar y llevar mis ideas a la realidad.'
            ]
        },
        en: {
            title: 'About me',
            switchLabel: osTheme === 'win11' ? 'Switch to macOS' : 'Switch to Windows 11',
            badgeWin: 'VS Code — Windows 11',
            badgeMac: 'VS Code — macOS',
            minimizeTitle: 'Minimize',
            maximizeTitle: isMaximized ? 'Restore size' : 'Maximize window',
            closeTitle: 'Close',
            menuItems: ['File', 'Edit', 'View', 'Go'],
            activityTitles: ['Explorer', 'Search', 'Source Control', 'Extensions'],
            breadcrumbFolder: 'about',
            tabs: ['01_stack.ts', '02_blender3d.ts', '03_hobbies.ts'],
            varNames: ['fullstackDev', 'creative3D', 'personalInterests'],
            lineColLabel: `Ln ${closingLineNumber}, Col 3`,
            paragraphs: [
                'I am a software engineer and Full Stack developer, passionate about programming, technology, and building projects. I enjoy exploring new tools, learning technologies, and finding creative solutions to different problems.',
                'Beyond development, I am interested in digital design, drawing, and 3D modeling with Blender. I like experimenting with ideas and combining creativity with technology to create new things.',
                'In my free time I enjoy video games, especially Metal Gear Solid, as well as listening to music and exploring new interests. I consider myself a curious, creative, and self-taught person, always eager to learn, improve, and bring my ideas to life.'
            ]
        }
    };

    const currentContent = content[lang];
    const activeTabName = currentContent.tabs[activeParagraph];

    const measureCodeLines = useCallback(() => {
        const activeP = paragraphRefs.current[activeParagraph];
        if (!activeP) return;

        const isMobile = window.innerWidth <= 640;
        const computed = getComputedStyle(activeP);
        const lineHeight = parseFloat(computed.lineHeight) || (isMobile ? 21 : 28);

        // Líneas que ocupa el párrafo más largo: así todas las pestañas comparten el mismo
        // número fijo de líneas (sin saltos de altura) y ningún texto se recorta.
        const longestLines = paragraphRefs.current.reduce((max, el) => {
            if (!el) return max;
            return Math.max(max, Math.round(el.scrollHeight / lineHeight));
        }, 1);
        const minFixed = isMobile ? MOBILE_LINE_COUNT : DESKTOP_LINE_COUNT;
        const targetFixedLines = Math.max(minFixed, longestLines + 3);
        const maxParagraphLines = targetFixedLines - 3;

        const pHeight = activeP.scrollHeight;
        const pLines = Math.max(1, Math.min(maxParagraphLines, Math.round(pHeight / lineHeight)));

        setFixedLineCount(targetFixedLines);
        // 1 línea para "// Sobre mí" + 1 línea para "export const..." + pLines del párrafo + 1 línea para "`;"
        setStageHeightPx(pLines * lineHeight);
        setClosingLineNumber(2 + pLines + 1);
    }, [activeParagraph]);

    useLayoutEffect(() => {
        measureCodeLines();

        const observer = new ResizeObserver(() => {
            measureCodeLines();
        });

        if (codeContentRef.current) {
            observer.observe(codeContentRef.current);
        }
        paragraphRefs.current.forEach(el => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [measureCodeLines, lang, isMaximized]);

    const toggleMaximize = () => {
        setIsMaximized(prev => !prev);
    };

    return (
        <section id="about" className="about_section">
            <div id="about-sticky" className="about_sticky">
                <div className={`about_container ${isMaximized ? 'ide-maximized' : ''}`}>
                    {/* Columna izquierda: Hueco de anclaje donde aterriza el avatar en medio de la altura */}
                    <div className="about_left">
                        <div id="about-avatar-slot" className="about_avatar_slot" aria-hidden="true" />
                    </div>

                    {/* Columna derecha: Ventana Visual Studio Code (Windows 11 / macOS) */}
                    <div className="about_right">
                        <div className="ide_variant_switcher">
                            <span className="ide_variant_current">
                                <i className={`pi ${osTheme === 'win11' ? 'pi-microsoft' : 'pi-apple'}`}></i>
                                {osTheme === 'win11' ? currentContent.badgeWin : currentContent.badgeMac}
                            </span>
                            <button
                                type="button"
                                className="ide_variant_btn"
                                onClick={() => setOsTheme(prev => (prev === 'win11' ? 'macos' : 'win11'))}
                            >
                                <i className="pi pi-sync"></i>
                                <span>{currentContent.switchLabel}</span>
                            </button>
                        </div>

                        <div className={`vscode_window os-${osTheme} ${isMaximized ? 'is-maximized' : ''}`}>
                            {/* =========================================================
                                1. TITLEBAR NATIVA DE VISUAL STUDIO CODE (macOS / Win 11)
                                ========================================================= */}
                            <div className="vscode_titlebar">
                                {osTheme === 'macos' ? (
                                    /* Botones semáforo de macOS: al pasar por encima revelan ✕, − y ⤢ */
                                    <div className="macos_traffic_lights" aria-label="macOS window controls">
                                        <button
                                            type="button"
                                            className="macos_btn close"
                                            title={currentContent.closeTitle}
                                            aria-label={currentContent.closeTitle}
                                        >
                                            <svg viewBox="0 0 12 12" className="macos_icon">
                                                <path d="M3.2 3.2l5.6 5.6M8.8 3.2l-5.6 5.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="macos_btn minimize"
                                            title={currentContent.minimizeTitle}
                                            aria-label={currentContent.minimizeTitle}
                                        >
                                            <svg viewBox="0 0 12 12" className="macos_icon">
                                                <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="macos_btn fullscreen"
                                            onClick={toggleMaximize}
                                            title={currentContent.maximizeTitle}
                                            aria-label={currentContent.maximizeTitle}
                                        >
                                            <svg viewBox="0 0 12 12" className="macos_icon">
                                                <path d="M3 6.8V9h2.2L3 6.8zM9 5.2V3H6.8L9 5.2z" fill="currentColor" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    /* Izquierda en Windows 11: Logo oficial VS Code + Menú superior */
                                    <div className="win11_titlebar_left">
                                        <svg className="vscode_logo" viewBox="0 0 24 24" aria-hidden="true">
                                            <path
                                                fill="#007ACC"
                                                d="M17.583 2.203L9.49 9.578 4.6 5.792 2.5 6.842v10.315l2.1 1.05 4.89-3.786 8.093 7.376L21.5 19.93V4.07l-3.917-1.867zM4.6 14.37V9.63l2.94 2.37-2.94 2.37zm12.983 2.57L11.83 12l5.753-4.94v9.88z"
                                            />
                                        </svg>
                                        <div className="vscode_menubar" aria-hidden="true">
                                            {currentContent.menuItems.map(item => (
                                                <span key={item}>{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Centro de la Titlebar de VS Code: Barra de título / Command Center */}
                                <div className="vscode_title_center" onDoubleClick={toggleMaximize}>
                                    <i className="pi pi-search vscode_search_icon"></i>
                                    <span>{activeTabName} — davidportfolio — Visual Studio Code</span>
                                </div>

                                {osTheme === 'win11' ? (
                                    /* Derecha en Windows 11: Botones Minimizar, Maximizar/Restaurar y Cerrar */
                                    <div className="win11_window_controls" aria-label="Windows 11 window controls">
                                        <button
                                            type="button"
                                            className="win11_ctrl_btn minimize"
                                            aria-label={currentContent.minimizeTitle}
                                            title={currentContent.minimizeTitle}
                                        >
                                            <svg width="10" height="10" viewBox="0 0 10 10">
                                                <path d="M1 5h8" stroke="currentColor" strokeWidth="1" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="win11_ctrl_btn maximize"
                                            onClick={toggleMaximize}
                                            aria-label={currentContent.maximizeTitle}
                                            title={currentContent.maximizeTitle}
                                        >
                                            {isMaximized ? (
                                                /* Ícono oficial de Restaurar (doble cuadro) en Windows 11 */
                                                <svg width="10" height="10" viewBox="0 0 10 10">
                                                    <path d="M3 1.5h5.5V7H7" fill="none" stroke="currentColor" strokeWidth="1" />
                                                    <rect x="1.5" y="3" width="5.5" height="5.5" fill="none" stroke="currentColor" strokeWidth="1" />
                                                </svg>
                                            ) : (
                                                /* Ícono oficial de Maximizar (cuadro simple) en Windows 11 */
                                                <svg width="10" height="10" viewBox="0 0 10 10">
                                                    <rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="win11_ctrl_btn close"
                                            aria-label={currentContent.closeTitle}
                                            title={currentContent.closeTitle}
                                        >
                                            <svg width="10" height="10" viewBox="0 0 10 10">
                                                <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.1" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="macos_titlebar_spacer" aria-hidden="true" />
                                )}
                            </div>

                            {/* =========================================================
                                2. WORKBENCH DE VS CODE (ACTIVITY BAR + TABS + EDITOR)
                                ========================================================= */}
                            <div className="vscode_workbench">
                                {/* Activity Bar izquierda típica de VS Code */}
                                <div className="vscode_activitybar" aria-hidden="true">
                                    <span className="activity_icon active" title={currentContent.activityTitles[0]}>
                                        <i className="pi pi-copy"></i>
                                    </span>
                                    <span className="activity_icon" title={currentContent.activityTitles[1]}>
                                        <i className="pi pi-search"></i>
                                    </span>
                                    <span className="activity_icon" title={currentContent.activityTitles[2]}>
                                        <i className="pi pi-share-alt"></i>
                                    </span>
                                    <span className="activity_icon" title={currentContent.activityTitles[3]}>
                                        <i className="pi pi-th-large"></i>
                                    </span>
                                </div>

                                <div className="vscode_editor_area">
                                    {/* Barra de Pestañas (Tabs) de VS Code */}
                                    <div className="vscode_tabs_bar" role="tablist" aria-label={currentContent.title}>
                                        {currentContent.tabs.map((tabName, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                role="tab"
                                                aria-selected={index === activeParagraph}
                                                className={`vscode_tab ${index === activeParagraph ? 'active' : ''}`}
                                                onClick={() => onSelectParagraph(index)}
                                            >
                                                <span className="ts_badge">TS</span>
                                                <span className="tab_label">{tabName}</span>
                                                <span className="tab_close_icon" aria-hidden="true">×</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Breadcrumbs de VS Code */}
                                    <div className="vscode_breadcrumbs" aria-hidden="true">
                                        <span>src</span>
                                        <i className="pi pi-angle-right"></i>
                                        <span>{currentContent.breadcrumbFolder}</span>
                                        <i className="pi pi-angle-right"></i>
                                        <span className="active_crumb">{activeTabName}</span>
                                    </div>

                                    {/* Lienzo de código con líneas fijas siempre sin saltos de altura */}
                                    <div
                                        className="ide_body"
                                        style={{ '--ide-fixed-lines': fixedLineCount } as React.CSSProperties}
                                    >
                                        <div className="ide_gutter" aria-hidden="true">
                                            {Array.from({ length: fixedLineCount }, (_, idx) => (
                                                <span key={idx + 1} className="ide_gutter_num">
                                                    {idx + 1}
                                                </span>
                                            ))}
                                        </div>

                                        <div ref={codeContentRef} className="ide_code_content">
                                            <div className="ide_code_line">
                                                <span className="token_comment">// {currentContent.title}</span>
                                            </div>

                                            <div className="ide_code_line">
                                                <span className="token_keyword">export const</span>{' '}
                                                <span className="token_variable">
                                                    {currentContent.varNames[activeParagraph]}
                                                </span>{' '}
                                                <span className="token_operator">=</span>{' '}
                                                <span className="token_string">`</span>
                                            </div>

                                            <div
                                                className="about_paragraphs_stage ide_stage"
                                                style={stageHeightPx ? { height: `${stageHeightPx}px` } : undefined}
                                            >
                                                {currentContent.paragraphs.map((paragraph, index) => {
                                                    let stateClass = 'is-hidden-below';
                                                    if (index === activeParagraph) {
                                                        stateClass = 'is-active';
                                                    } else if (index < activeParagraph) {
                                                        stateClass = 'is-hidden-above';
                                                    }

                                                    return (
                                                        <p
                                                            key={index}
                                                            ref={el => {
                                                                paragraphRefs.current[index] = el;
                                                            }}
                                                            className={`about_paragraph ${stateClass}`}
                                                            aria-hidden={index !== activeParagraph}
                                                        >
                                                            {paragraph}
                                                            <span className="ide_cursor" aria-hidden="true" />
                                                        </p>
                                                    );
                                                })}
                                            </div>

                                            <div className="ide_code_line">
                                                <span className="token_string">`;</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* =========================================================
                                3. STATUS BAR OFICIAL DE VS CODE
                                ========================================================= */}
                            <div className="vscode_statusbar">
                                <div className="status_left">
                                    <span className="status_remote">
                                        <i className="pi pi-code"></i>
                                    </span>
                                    <span className="status_item">
                                        <i className="pi pi-share-alt"></i> main*
                                    </span>
                                    <span className="status_item">
                                        <i className="pi pi-times-circle"></i> 0
                                        <i className="pi pi-exclamation-triangle"></i> 0
                                    </span>
                                </div>
                                <div className="status_right">
                                    <span className="status_item">
                                        {currentContent.lineColLabel}
                                    </span>
                                    <span className="status_item hide_mobile">UTF-8</span>
                                    <span className="status_item accent">
                                        {'{ }'} TypeScript
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
