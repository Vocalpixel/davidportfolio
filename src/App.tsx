import { useEffect, useRef, useState, useCallback } from 'react'
import { Header } from './components/header/header'
import { Footer } from './components/footer/footer'
import { Hero } from './components/hero/hero'
import { About } from './components/about/about'
import { Projects } from './components/projects/projects'
import { Contact } from './components/contact/contact'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { EffectsProvider, useEffects } from './context/EffectsContext'
import profileImg from './assets/profile.jpg'
import './App.scss'

const MAX_OFFSET_PX = 35;
const THROTTLE_MS = 48;

interface LayoutMetrics {
  heroCenterX: number;
  heroCenterY: number;
  heroSize: number;
  aboutCenterX: number;
  aboutCenterY: number;
  aboutSize: number;
  aboutStartScroll: number;
  aboutEndScroll: number;
  projectsStartScroll: number;
  projectsEndScroll: number;
  contactStartScroll: number;
}

function AppContent() {
  const { effectsEnabled } = useEffects();
  const { lang } = useLanguage();
  const bgRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState<string>('#home');
  const [activeParagraph, setActiveParagraph] = useState<number>(0);
  const [activeProject, setActiveProject] = useState<number>(0);
  const [heroContentOpacity, setHeroContentOpacity] = useState<number>(1);

  const activeSectionRef = useRef<string>('#home');
  const activeParagraphRef = useRef<number>(0);
  const activeProjectRef = useRef<number>(0);

  const metricsRef = useRef<LayoutMetrics>({
    heroCenterX: 0,
    heroCenterY: 0,
    heroSize: 180,
    aboutCenterX: 0,
    aboutCenterY: 0,
    aboutSize: 200,
    aboutStartScroll: 500,
    aboutEndScroll: 1500,
    projectsStartScroll: 2000,
    projectsEndScroll: 4000,
    contactStartScroll: 4600,
  });

  // 1. Efecto de seguimiento del mouse (se desactiva al apagar los efectos)
  useEffect(() => {
    if (!effectsEnabled) {
      if (bgRef.current) {
        bgRef.current.style.transform = 'translate3d(0px, 0px, 0)';
      }
      return;
    }

    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let lastUpdate = 0;
    let rafId: number | null = null;
    let latestX = 0;
    let latestY = 0;

    const applyTransform = () => {
      rafId = null;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${latestX.toFixed(1)}px, ${latestY.toFixed(1)}px, 0)`;
      }
    };

    const handleResize = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const now = performance.now();
      if (now - lastUpdate < THROTTLE_MS) return;
      lastUpdate = now;

      const normalizedX = (event.clientX / viewportWidth - 0.5) * 2;
      const normalizedY = (event.clientY / viewportHeight - 0.5) * 2;
      latestX = normalizedX * MAX_OFFSET_PX;
      latestY = normalizedY * MAX_OFFSET_PX;

      if (rafId === null) {
        rafId = requestAnimationFrame(applyTransform);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [effectsEnabled]);

  // 2. Coreografía de Scroll, Avatar, URL dinámica y detección de sección activa
  const updateAvatarAndState = useCallback(() => {
    const m = metricsRef.current;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const y = Math.max(0, Math.min(window.scrollY, maxScroll));

    let cx = m.heroCenterX;
    let cy = m.heroCenterY;
    let scale = 1;
    let avatarOpacity = 1;

    if (y <= 0) {
      cx = m.heroCenterX;
      cy = m.heroCenterY;
      scale = 1;
    } else if (y < m.aboutStartScroll) {
      const rawT = y / m.aboutStartScroll;
      const t = rawT * rawT * (3 - 2 * rawT); // Smoothstep
      cx = m.heroCenterX + (m.aboutCenterX - m.heroCenterX) * t;
      cy = m.heroCenterY + (m.aboutCenterY - m.heroCenterY) * t;
      scale = 1 + (m.aboutSize / m.heroSize - 1) * t;
    } else if (y <= m.aboutEndScroll) {
      cx = m.aboutCenterX;
      cy = m.aboutCenterY;
      scale = m.aboutSize / m.heroSize;
    } else {
      const overScroll = y - m.aboutEndScroll;
      cx = m.aboutCenterX;
      cy = m.aboutCenterY - overScroll;
      scale = m.aboutSize / m.heroSize;
      avatarOpacity = Math.max(0, Math.min(1, 1 - overScroll / 260));
    }

    if (avatarRef.current && m.heroSize > 0) {
      const half = m.heroSize / 2;
      avatarRef.current.style.width = `${m.heroSize}px`;
      avatarRef.current.style.height = `${m.heroSize}px`;
      avatarRef.current.style.opacity = `${avatarOpacity.toFixed(2)}`;
      avatarRef.current.style.pointerEvents = avatarOpacity < 0.1 ? 'none' : 'auto';
      avatarRef.current.style.transform = `translate3d(${(cx - half).toFixed(1)}px, ${(cy - half).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    }

    // Desvanecer el texto del Hero al bajar para que nunca pase por detrás del avatar
    const nextHeroOpacity = Math.max(0, Math.min(1, 1 - (y / (m.aboutStartScroll * 0.45))));
    setHeroContentOpacity(prev => (Math.abs(prev - nextHeroOpacity) > 0.02 ? nextHeroOpacity : prev));

    // Determinar sección activa (#home, #about, #projects, #contact) en tiempo real y sincronizar URL + Header
    const vh = window.innerHeight;
    const triggerLine = vh * 0.55;
    const aboutEl = document.getElementById('about');
    const projectsEl = document.getElementById('projects');
    const contactEl = document.getElementById('contact');

    let nextSection = '#home';
    if (
      (contactEl && contactEl.getBoundingClientRect().top <= triggerLine) ||
      (maxScroll > 0 && y >= maxScroll - 30)
    ) {
      nextSection = '#contact';
    } else if (projectsEl && projectsEl.getBoundingClientRect().top <= triggerLine) {
      nextSection = '#projects';
    } else if (aboutEl && aboutEl.getBoundingClientRect().top <= triggerLine) {
      nextSection = '#about';
    }

    if (nextSection !== activeSectionRef.current) {
      activeSectionRef.current = nextSection;
      setActiveSection(nextSection);
    }
    if (window.location.hash !== nextSection) {
      window.history.replaceState(null, '', nextSection);
    }

    // Actualizar cuál de los 3 párrafos está activo conforme avanzamos hacia abajo
    const scrollSpan = Math.max(1, m.aboutEndScroll - m.aboutStartScroll);
    const aboutProgress = Math.max(0, Math.min(1, (y - m.aboutStartScroll) / scrollSpan));

    let nextParagraph = 0;
    if (aboutProgress >= 0.68) {
      nextParagraph = 2;
    } else if (aboutProgress >= 0.34) {
      nextParagraph = 1;
    }

    if (nextParagraph !== activeParagraphRef.current) {
      activeParagraphRef.current = nextParagraph;
      setActiveParagraph(nextParagraph);
    }

    // Actualizar el slot activo del carrusel de Proyectos conforme avanzamos hacia abajo
    const projectsSpan = Math.max(1, m.projectsEndScroll - m.projectsStartScroll);
    const projectsProgress = Math.max(0, Math.min(1, (y - m.projectsStartScroll) / projectsSpan));
    const nextProject = Math.min(4, Math.floor(projectsProgress * 5));

    if (nextProject !== activeProjectRef.current) {
      activeProjectRef.current = nextProject;
      setActiveProject(nextProject);
    }
  }, []);

  useEffect(() => {
    let scrollRafId: number | null = null;

    const measureLayout = () => {
      const heroSlot = document.getElementById('hero-avatar-slot');
      const aboutSection = document.getElementById('about');
      const aboutSticky = document.getElementById('about-sticky');
      const aboutSlot = document.getElementById('about-avatar-slot');
      const projectsSection = document.getElementById('projects');
      const contactSection = document.getElementById('contact');

      if (!heroSlot || !aboutSection || !aboutSticky || !aboutSlot) return;

      const scrollY = window.scrollY;
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const headerEl = document.querySelector('.header');
      const stickyTopPx = headerEl ? headerEl.getBoundingClientRect().height : 4 * rootFontSize;

      const heroRect = heroSlot.getBoundingClientRect();
      const heroDocTop = heroRect.top + scrollY;
      const heroCenterX = heroRect.left + heroRect.width / 2;
      const heroCenterY = heroDocTop + heroRect.height / 2;
      const heroSize = heroRect.width || 180;

      const aboutSectionRect = aboutSection.getBoundingClientRect();
      const aboutSectionDocTop = aboutSectionRect.top + scrollY;
      const aboutSectionHeight = aboutSectionRect.height;

      const aboutStickyRect = aboutSticky.getBoundingClientRect();
      const aboutStickyHeight = aboutStickyRect.height;

      const aboutSlotRect = aboutSlot.getBoundingClientRect();
      const aboutCenterX = aboutSlotRect.left + aboutSlotRect.width / 2;
      const slotOffsetInSticky = (aboutSlotRect.top - aboutStickyRect.top) + aboutSlotRect.height / 2;
      const aboutCenterY = stickyTopPx + slotOffsetInSticky;
      const aboutSize = aboutSlotRect.width || 200;

      const aboutStartScroll = Math.max(1, aboutSectionDocTop - stickyTopPx);
      const aboutEndScroll = aboutStartScroll + Math.max(1, aboutSectionHeight - aboutStickyHeight);

      let projectsStartScroll = aboutEndScroll + aboutStickyHeight;
      let projectsEndScroll = projectsStartScroll + aboutStickyHeight * 4;
      const projectsSticky = document.getElementById('projects-sticky');
      if (projectsSection) {
        const projectsRect = projectsSection.getBoundingClientRect();
        projectsStartScroll = Math.max(aboutEndScroll + 100, projectsRect.top + scrollY - stickyTopPx);
        const stickyH = projectsSticky ? projectsSticky.getBoundingClientRect().height : aboutStickyHeight;
        projectsEndScroll = projectsStartScroll + Math.max(1, projectsRect.height - stickyH);
      }

      let contactStartScroll = projectsEndScroll + aboutStickyHeight;
      if (contactSection) {
        const contactRect = contactSection.getBoundingClientRect();
        contactStartScroll = Math.max(projectsEndScroll + 100, contactRect.top + scrollY - stickyTopPx);
      }

      metricsRef.current = {
        heroCenterX,
        heroCenterY,
        heroSize,
        aboutCenterX,
        aboutCenterY,
        aboutSize,
        aboutStartScroll,
        aboutEndScroll,
        projectsStartScroll,
        projectsEndScroll,
        contactStartScroll,
      };

      updateAvatarAndState();
    };

    const handleScroll = () => {
      if (scrollRafId === null) {
        scrollRafId = requestAnimationFrame(() => {
          scrollRafId = null;
          updateAvatarAndState();
        });
      }
    };

    measureLayout();

    // Si la URL inicial no tiene hash, establecer #home
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#home');
    }

    const resizeObserver = new ResizeObserver(() => {
      measureLayout();
    });

    const heroSlotEl = document.getElementById('hero-avatar-slot');
    const aboutSectionEl = document.getElementById('about');
    const aboutSlotEl = document.getElementById('about-avatar-slot');
    const projectsSectionEl = document.getElementById('projects');
    const contactSectionEl = document.getElementById('contact');
    if (heroSlotEl) resizeObserver.observe(heroSlotEl);
    if (aboutSectionEl) resizeObserver.observe(aboutSectionEl);
    if (aboutSlotEl) resizeObserver.observe(aboutSlotEl);
    if (projectsSectionEl) resizeObserver.observe(projectsSectionEl);
    if (contactSectionEl) resizeObserver.observe(contactSectionEl);
    // Cambios de layout que mueven los slots sin cambiar su tamaño (carga de fuentes, barra del navegador móvil, etc.)
    resizeObserver.observe(document.body);
    const heroInfoEl = document.querySelector('.hero_info');
    if (heroInfoEl) resizeObserver.observe(heroInfoEl);

    let resizeRafId: number | null = null;
    const handleResize = () => {
      measureLayout();
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        measureLayout();
      });
    };

    document.fonts?.ready.then(() => measureLayout());
    window.addEventListener('load', measureLayout);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.visualViewport?.addEventListener('resize', handleResize, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', measureLayout);
      window.visualViewport?.removeEventListener('resize', handleResize);
      if (scrollRafId !== null) {
        cancelAnimationFrame(scrollRafId);
      }
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
    };
  }, [updateAvatarAndState]);

  const handleNavigate = useCallback((sectionId: string) => {
    const behavior = effectsEnabled ? 'smooth' : 'auto';

    activeSectionRef.current = sectionId;
    setActiveSection(sectionId);
    window.history.replaceState(null, '', sectionId);

    if (sectionId === '#home') {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const el = document.querySelector(sectionId);
    if (el) {
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const headerEl = document.querySelector('.header');
      const stickyTopPx = headerEl ? headerEl.getBoundingClientRect().height : 4 * rootFontSize;
      const targetTop = Math.max(0, el.getBoundingClientRect().top + window.scrollY - stickyTopPx);
      window.scrollTo({ top: targetTop, behavior });
    }
  }, [effectsEnabled]);

  const handleSelectParagraph = useCallback((index: number) => {
    const m = metricsRef.current;
    const span = m.aboutEndScroll - m.aboutStartScroll;
    const targetTop = m.aboutStartScroll + (index / 2) * span;
    window.scrollTo({
      top: targetTop,
      behavior: effectsEnabled ? 'smooth' : 'auto'
    });
  }, [effectsEnabled]);

  const handleSelectProject = useCallback((index: number) => {
    const m = metricsRef.current;
    const span = m.projectsEndScroll - m.projectsStartScroll;
    const targetTop = m.projectsStartScroll + (index / 4) * span;
    window.scrollTo({
      top: targetTop,
      behavior: effectsEnabled ? 'smooth' : 'auto'
    });
  }, [effectsEnabled]);

  const showScrollTop = activeSection !== '#home';
  const showAboutBadges = activeSection === '#about';

  return (
    <div className="app">
      {/* Fondo tramado con parallax interactivo */}
      <div ref={bgRef} className="bg" aria-hidden="true" />

      {/* Avatar compartido que viaja del centro del Hero a la izquierda en Sobre mí */}
      <div ref={avatarRef} className="floating_avatar">
        <img
          src={profileImg}
          alt="David Bernal"
          className="floating_avatar_img"
        />

        {/* 3 Placeholders circulares progresivos sobre el borde del avatar (dev, 3d, extra) */}
        <button
          type="button"
          className={`avatar_orbit_badge pos-top-right ${showAboutBadges && activeParagraph >= 0 ? 'is-visible' : ''} ${activeParagraph === 0 ? 'is-current' : ''}`}
          onClick={() => handleSelectParagraph(0)}
          aria-label="dev"
          title="dev"
        >
          <i className="pi pi-code" />
        </button>
        <button
          type="button"
          className={`avatar_orbit_badge pos-mid-left ${showAboutBadges && activeParagraph >= 1 ? 'is-visible' : ''} ${activeParagraph === 1 ? 'is-current' : ''}`}
          onClick={() => handleSelectParagraph(1)}
          aria-label="3d"
          title="3d"
        >
          <i className="pi pi-box" />
        </button>
        <button
          type="button"
          className={`avatar_orbit_badge pos-bottom-right ${showAboutBadges && activeParagraph >= 2 ? 'is-visible' : ''} ${activeParagraph === 2 ? 'is-current' : ''}`}
          onClick={() => handleSelectParagraph(2)}
          aria-label="extra"
          title="extra"
        >
          <i className="pi pi-star" />
        </button>
      </div>

      <Header activeSection={activeSection} onNavigate={handleNavigate} />
      <main>
        <Hero
          contentOpacity={heroContentOpacity}
          onStartClick={() => handleNavigate('#about')}
        />
        <About
          activeParagraph={activeParagraph}
          onSelectParagraph={handleSelectParagraph}
        />
        <Projects
          activeProject={activeProject}
          onSelectProject={handleSelectProject}
        />
        <Contact />
      </main>

      {/* Botón flotante inferior derecho para volver a Home cuando no estamos en #home */}
      <button
        type="button"
        className={`scroll_top_btn ${showScrollTop ? 'is-visible' : ''}`}
        onClick={() => handleNavigate('#home')}
        title={lang === 'es' ? 'Volver al inicio' : 'Back to top'}
        aria-label={lang === 'es' ? 'Volver al inicio' : 'Back to top'}
      >
        <i className="pi pi-arrow-up"></i>
      </button>

      <Footer />

    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <EffectsProvider>
          <AppContent />
        </EffectsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App
