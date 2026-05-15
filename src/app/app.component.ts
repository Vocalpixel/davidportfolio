import { Component, OnInit, OnDestroy, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

const MAX_PARALLAX_OFFSET_PX = 40;
const LERP_FACTOR = 0.06;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'davidportfolio';

  private bgElement: HTMLElement | null = null;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private animationFrameId: number | null = null;
  private mouseMoveHandler: ((event: MouseEvent) => void) | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.bgElement = document.querySelector<HTMLElement>('.bg');
    if (!this.bgElement) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.mouseMoveHandler = (event: MouseEvent) => {
        const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2;
        const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2;
        this.targetX = normalizedX * MAX_PARALLAX_OFFSET_PX;
        this.targetY = normalizedY * MAX_PARALLAX_OFFSET_PX;
      };

      window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
      this.animate();
    });
  }

  ngOnDestroy(): void {
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animate = (): void => {
    this.currentX += (this.targetX - this.currentX) * LERP_FACTOR;
    this.currentY += (this.targetY - this.currentY) * LERP_FACTOR;

    if (this.bgElement) {
      this.bgElement.style.backgroundPosition = `${this.currentX.toFixed(2)}px ${this.currentY.toFixed(2)}px`;
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}
