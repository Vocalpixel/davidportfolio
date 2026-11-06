# Inventario y Blueprint del Portafolio (Migración a React Web)

Este documento recopila la estructura completa del proyecto original (desarrollado en Angular) para servir como mapa de ruta durante el aprendizaje y la migración a **React Web (Vite + React + TypeScript)**.

---

## 1. Vistas y Rutas

| Ruta Angular | Vista / Componente | Elementos y Funcionalidad | Equivalente en React Web |
| :--- | :--- | :--- | :--- |
| `/` o `/home` | `MainComponent` | • Avatar (`profile.jpg`)<br>• Título: **David Bernal**<br>• Subtítulo: *Fullstack developer and 3d asset creator*<br>• Botón de acción: `Start`<br>• *(Opcional / Prototipo)* Habitación 3D isométrica (`RoomComponent`) | Componente `Home.tsx` (`<section>`, `<img>`, `<h1>`, `<p>`, `<button>`) |
| `/gallery` | `GalleryComponent` | • Carrusel de imágenes con soporte para imágenes propias o mocks (`picsum.photos`)<br>• Botones de navegación (Anterior / Siguiente)<br>• Autoplay con botón Play / Pausa (intervalo 4 seg)<br>• Indicadores de paginación (dots) interactivos<br>• Badge de "mock" si no hay fotos | Componente `Gallery.tsx` con hooks `useState`, `useEffect` |
| *(Pendiente)* | `About` | Enlace existente en el Header ("about me") | Componente `About.tsx` |
| *(Pendiente)* | `CV` | Enlace existente en el Header ("my cv") | Enlace a PDF descargable o ruta `/cv` |

---

## 2. Componentes Compartidos (Layout)

### 2.1 Header (`Header.tsx`)
* **Logo / Home:** Ícono de inicio + Texto `"Portfolio 2027"` (redirige al inicio).
* **Menú de navegación:**
  * Enlace a *about me*
  * Enlace a *gallery*
  * Enlace a *my cv*
* **Acciones y Redes Sociales:**
  * Link a GitHub: `https://github.com/Vocalpixel`
  * Link a LinkedIn: `https://www.linkedin.com/in/isaac-david-bernal-chirino/`
  * Divisor visual
  * Toggle de Modo Oscuro / Modo Claro (guarda estado de tema en `localStorage`)

### 2.2 Footer (`Footer.tsx`)
* Texto de crédito: `"David's Portfolio v1.0 by David Bernal"`.
* Mención de tecnología: `"Made with React"` (SVG con el logo oficial de React).

### 2.3 Fondo Global
* Fondo con patrón de puntos (dot grid) reactivo al modo claro/oscuro (mantiene los estilos CSS ya calibrados).

---

## 3. Características Especiales y Estado

1. **Tema Claro / Oscuro (Theming):**
   * Paleta oscura por defecto (`#09090b` fondo, `#18181b` superficie, `#60a5fa` acento azul).
   * Paleta clara (`#f4f4f5` fondo, `#ffffff` superficie).
   * Persistencia en `localStorage`.
2. **Habitación 3D (`RoomComponent`):**
   * Transformaciones 3D en CSS con inclinación en base al cursor (`mousemove`).
   * Muy fácil de portar a React usando `useRef` o estado para las transformaciones.
3. **Enlaces Externos:**
   * Enlaces directos `<a>` con `target="_blank"` y `rel="noopener noreferrer"`.

---

## 4. Recursos y Assets Existentes

* **Imágenes principales:**
  * `profile.jpg` (Foto de perfil / avatar)
  * `background.png`
  * `hand.png`
  * `landscape.jpeg`
* **Texturas 3D:**
  * `textures/floor.jpg`
  * `textures/mac.jpg`
  * `textures/windows.jpg`
* **Tipografía e Iconografía:**
  * Fuente: *Poppins*
  * Iconos: Lucide Icons (`lucide-react`) o React Icons (`react-icons`)

---

## 5. Hoja de Ruta Sugerida para el Aprendizaje

1. **Paso 1:** Inicializar el proyecto con **Vite + React + TypeScript**.
2. **Paso 2:** Comprender la estructura de React (`main.tsx`, `App.tsx`, JSX/TSX vs HTML de Angular).
3. **Paso 3:** Configurar el sistema de diseño (tokens CSS y fondo de cuadrícula de puntos).
4. **Paso 4:** Crear el componente `Header` con el selector de tema (Dark/Light con `useState` y `localStorage`).
5. **Paso 5:** Crear la sección principal de presentación (`Hero`/`Home` con foto y biografía).
6. **Paso 6:** Navegación o secciones (React Router o One-Page Navigation).
7. **Paso 7:** Recrear la Galería interactiva con hooks de React.

