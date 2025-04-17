// core/services/theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColor = 'default' | 'blue' | 'green' | 'purple' | 'orange';

export interface ThemeSettings {
  mode: ThemeMode;
  color: ThemeColor;
  fontSize: number; // Base font size in pixels
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'app_theme_settings';
  private readonly DEFAULT_SETTINGS: ThemeSettings = {
    mode: 'light',
    color: 'default',
    fontSize: 16,
  };

  private themeSubject = new BehaviorSubject<ThemeSettings>(
    this.getStoredSettings()
  );
  public readonly theme$: Observable<ThemeSettings> =
    this.themeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  /**
   * Initialize theme settings on app startup
   */
  private initTheme(): void {
    const settings = this.getStoredSettings();
    this.applyTheme(settings);
    this.themeSubject.next(settings);

    // Listen for system preference changes if in system mode
    if (settings.mode === 'system') {
      this.listenForSystemThemeChanges();
    }
  }

  /**
   * Get stored theme settings or return defaults
   */
  private getStoredSettings(): ThemeSettings {
    try {
      const storedSettings = localStorage.getItem(this.STORAGE_KEY);
      return storedSettings
        ? JSON.parse(storedSettings)
        : this.DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error retrieving theme settings:', error);
      return this.DEFAULT_SETTINGS;
    }
  }

  /**
   * Update theme settings
   */
  updateTheme(settings: Partial<ThemeSettings>): void {
    const currentSettings = this.themeSubject.value;
    const newSettings = { ...currentSettings, ...settings };

    // Store in localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newSettings));

    // Apply the theme
    this.applyTheme(newSettings);

    // If changing mode to/from system, handle system preference listener
    if (settings.mode && settings.mode !== currentSettings.mode) {
      if (settings.mode === 'system') {
        this.listenForSystemThemeChanges();
      } else if (currentSettings.mode === 'system') {
        this.removeSystemThemeListener();
      }
    }

    // Update the subject
    this.themeSubject.next(newSettings);
  }

  /**
   * Apply theme settings to document
   */
  private applyTheme(settings: ThemeSettings): void {
    const { mode, color, fontSize } = settings;
    const root = document.documentElement;

    // Apply theme mode
    const effectiveMode = mode === 'system' ? this.getSystemPreference() : mode;

    root.setAttribute('data-theme', effectiveMode);

    // Apply theme color
    root.setAttribute('data-theme-color', color);

    // Apply font size
    root.style.fontSize = `${fontSize}px`;

    // Additional theme-specific CSS variables could be set here
  }

  /**
   * Get system color scheme preference
   */
  private getSystemPreference(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  /**
   * Listen for system theme preference changes
   */
  private listenForSystemThemeChanges(): void {
    this.removeSystemThemeListener(); // Clean up existing listener if any

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const currentSettings = this.themeSubject.value;
      if (currentSettings.mode === 'system') {
        this.applyTheme(currentSettings);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Store the listener reference for cleanup
    (window as any).__themeSystemListener = handleChange;
  }

  /**
   * Remove system theme preference listener
   */
  private removeSystemThemeListener(): void {
    const listener = (window as any).__themeSystemListener;
    if (listener) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', listener);
      delete (window as any).__themeSystemListener;
    }
  }

  /**
   * Get current theme settings
   */
  getCurrentTheme(): ThemeSettings {
    return this.themeSubject.value;
  }

  /**
   * Reset to default theme settings
   */
  resetToDefault(): void {
    this.updateTheme(this.DEFAULT_SETTINGS);
  }
}
