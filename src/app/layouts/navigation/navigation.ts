import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: NavigationItem[];
}

@Component({
  selector: 'app-navigation',
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  navigate = output<void>();

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

  onNavigate(): void {
    this.navigate.emit();
  }
}
