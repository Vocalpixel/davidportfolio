import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { RouterLink, RouterLinkActive } from '@angular/router';

const THEME_STORAGE_KEY = 'portfolio-theme';
const LIGHT_THEME_CLASS = 'light-theme';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  protected readonly dateTimestampProvider = dateTimestampProvider;

  isLightTheme = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    this.isLightTheme = savedTheme === 'light';
    this.applyTheme();
  }

  toggleTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isLightTheme = !this.isLightTheme;
    this.applyTheme();
    localStorage.setItem(THEME_STORAGE_KEY, this.isLightTheme ? 'light' : 'dark');
  }

  private applyTheme(): void {
    const body = document.body;
    if (this.isLightTheme) {
      body.classList.add(LIGHT_THEME_CLASS);
    } else {
      body.classList.remove(LIGHT_THEME_CLASS);
    }
  }
}
