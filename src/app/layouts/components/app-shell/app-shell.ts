import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { NavigationComponent } from '../navigation/navigation';
import { NavigationItem, UserInfo } from '../../models/layout.interface';

@Component({
  selector: 'app-app-shell',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    NavigationComponent
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  // Inputs - Solo datos que vienen del container
  sidebarOpen = input<boolean>(true);
  isMobile = input<boolean>(false);
  currentTheme = input<'light' | 'dark' | 'auto'>('light');
  isDark = input<boolean>(false);
  user = input<UserInfo | null>(null);
  isAuthenticated = input<boolean>(false);
  navigationItems = input<NavigationItem[]>([]);

  // Outputs - Eventos que emite al container
  toggleSidebar = output<void>();
  closeSidebar = output<void>();
  toggleTheme = output<void>();
  logout = output<void>();
  navigate = output<void>();

  // Métodos solo para UI - delegan al container
  handleToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  handleCloseSidebar(): void {
    this.closeSidebar.emit();
  }

  handleToggleTheme(): void {
    this.toggleTheme.emit();
  }

  handleLogout(): void {
    this.logout.emit();
  }

  handleNavigate(): void {
    this.navigate.emit();
  }
}
