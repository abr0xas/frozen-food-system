import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation';
import { AuthService } from '../../core/services/auth';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-app-shell',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    RouterOutlet,
    NavigationComponent
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShell {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  
  // Signals para el estado del layout
  sidebarOpen = signal<boolean>(true);
  isMobile = signal<boolean>(false);
  
  // Computed signals del auth service
  user = this.authService.user;
  isAuthenticated = this.authService.isAuthenticated;
  
  // Computed signals del theme service
  currentTheme = this.themeService.currentTheme;
  isDark = this.themeService.isDark;

  constructor() {
    // Detectar si es móvil
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth < 768);
    if (this.isMobile()) {
      this.sidebarOpen.set(false);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  onLogout(): void {
    this.authService.signOut();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
