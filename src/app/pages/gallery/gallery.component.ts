import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface CarouselImage {
  src: string;
  alt: string;
}

const AUTOPLAY_INTERVAL_MS = 4000;

/** Fallback usado cuando `images` está vacío (Picsum con seeds estables). */
const MOCK_IMAGES: CarouselImage[] = [
  { src: 'https://picsum.photos/seed/portfolio-1/1600/900', alt: 'Mock 1' },
  { src: 'https://picsum.photos/seed/portfolio-2/1600/900', alt: 'Mock 2' },
  { src: 'https://picsum.photos/seed/portfolio-3/1600/900', alt: 'Mock 3' },
  { src: 'https://picsum.photos/seed/portfolio-4/1600/900', alt: 'Mock 4' },
  { src: 'https://picsum.photos/seed/portfolio-5/1600/900', alt: 'Mock 5' }
];

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, OnDestroy {

  /**
   * Reemplazá esta lista con tus imágenes.
   * src debe ser una ruta accesible (ej. /assets/img/gallery/foto1.jpg).
   * Si queda vacía, el carrusel muestra las imágenes mock definidas arriba.
   */
  images: CarouselImage[] = [];

  currentIndex = 0;
  isPlaying = true;

  private autoplayTimerId: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /** Lista que efectivamente se renderiza: las del usuario o, si no hay, las mock. */
  get displayImages(): CarouselImage[] {
    return this.images.length > 0 ? this.images : MOCK_IMAGES;
  }

  get isUsingMocks(): boolean {
    return this.images.length === 0;
  }

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  next(): void {
    const total = this.displayImages.length;
    if (total === 0) {
      return;
    }
    this.currentIndex = (this.currentIndex + 1) % total;
  }

  prev(): void {
    const total = this.displayImages.length;
    if (total === 0) {
      return;
    }
    this.currentIndex = (this.currentIndex - 1 + total) % total;
  }

  goTo(index: number): void {
    if (index < 0 || index >= this.displayImages.length) {
      return;
    }
    this.currentIndex = index;
  }

  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  private startAutoplay(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.autoplayTimerId !== null || this.displayImages.length <= 1) {
      return;
    }
    this.autoplayTimerId = setInterval(() => this.next(), AUTOPLAY_INTERVAL_MS);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimerId !== null) {
      clearInterval(this.autoplayTimerId);
      this.autoplayTimerId = null;
    }
  }
}
