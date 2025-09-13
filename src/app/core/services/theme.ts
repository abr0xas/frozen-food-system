import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  
  private readonly themeMode = signal<ThemeMode>('auto');
  private readonly systemPrefersDark = signal<boolean>(false);
  
  readonly currentTheme = computed(() => {
    const mode = this.themeMode();
    if (mode === 'auto') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return mode;
  });
  
  readonly isDark = computed(() => this.currentTheme() === 'dark');
  readonly isLight = computed(() => this.currentTheme() === 'light');
  readonly mode = this.themeMode.asReadonly();

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();
    
    // Effect to automatically apply theme when currentTheme changes
    effect(() => {
      this.applyTheme();
    });
  }

  private initializeTheme(): void {
    // Leer tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      this.themeMode.set(savedTheme);
    }
    
    // Detectar preferencia del sistema
    this.updateSystemPreference();
  }

  private setupSystemThemeListener(): void {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.updateSystemPreference();
      
      mediaQuery.addEventListener('change', () => {
        this.updateSystemPreference();
      });
    }
  }

  private updateSystemPreference(): void {
    if (typeof window !== 'undefined') {
      this.systemPrefersDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }

  private applyTheme(): void {
    const theme = this.currentTheme();
    const body = this.document.body;
    
    // Solo cambiar color-scheme - Material maneja el resto automáticamente
    body.style.colorScheme = theme;
    
    // Actualizar meta theme-color para mobile
    this.updateMetaThemeColor(theme);
    
    // Debug log
    console.log('Theme applied:', theme, 'Mode:', this.themeMode());
  }

  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    const metaThemeColor = this.document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#424242' : '#ffffff');
    }
  }

  setTheme(mode: ThemeMode): void {
    this.themeMode.set(mode);
    localStorage.setItem('theme-mode', mode);
  }

  toggleTheme(): void {
    const currentMode = this.themeMode();
    if (currentMode === 'light') {
      this.setTheme('dark');
    } else if (currentMode === 'dark') {
      this.setTheme('auto');
    } else {
      this.setTheme('light');
    }
  }
}
