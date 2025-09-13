import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from '../../components/app-shell/app-shell';
import { AuthService } from '../../../core/services/auth';
import { ThemeService } from '../../../core/services/theme';
import { NavigationItem } from '../../models/layout.interface';

@Component({
  selector: 'app-layout-container',
  imports: [RouterOutlet, AppShellComponent],
  template: `
    <div class="layout-container">
      <app-app-shell
        [sidebarOpen]="sidebarOpen()"
        [isMobile]="isMobile()"
        [currentTheme]="currentTheme()"
        [isDark]="isDark()"
        [user]="user()"
        [isAuthenticated]="isAuthenticated()"
        [navigationItems]="navigationItems"
        (toggleSidebar)="toggleSidebar()"
        (closeSidebar)="closeSidebar()"
        (toggleTheme)="toggleTheme()"
        (logout)="onLogout()"
        (navigate)="closeSidebar()">
        
        <router-outlet></router-outlet>
      </app-app-shell>
    </div>
  `,
  styleUrl: './layout-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutContainer {
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

  // Datos estáticos de navegación
  navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Pedidos',
      icon: 'shopping_cart',
      route: '/pedidos',
      badge: 3
    },
    {
      label: 'Stock',
      icon: 'inventory',
      route: '/stock',
      children: [
        {
          label: 'Productos',
          icon: 'package',
          route: '/stock/productos'
        },
        {
          label: 'Ingredientes',
          icon: 'local_grocery_store',
          route: '/stock/ingredientes'
        }
      ]
    },
    {
      label: 'Producción',
      icon: 'precision_manufacturing',
      route: '/produccion'
    },
    {
      label: 'Entregas',
      icon: 'local_shipping',
      route: '/entregas',
      badge: 2
    },
    {
      label: 'Finanzas',
      icon: 'account_balance',
      route: '/finanzas'
    },
    {
      label: 'Perfil',
      icon: 'person',
      route: '/profile'
    }
  ];

  constructor() {
    // Detectar si es móvil
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    
    // Inicializar tema (el constructor del servicio ya lo hace, pero aseguramos que se ejecute)
    this.themeService.currentTheme(); // Trigger computed signal
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

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(): void {
    this.authService.signOut();
  }
}
