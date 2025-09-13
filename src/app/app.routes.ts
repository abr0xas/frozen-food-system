import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/containers/login-container/login-container').then(m => m.LoginContainerComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/containers/layout-container/layout-container').then(m => m.LayoutContainer),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./shared/components/placeholder/placeholder').then(m => m.PlaceholderComponent),
        data: { title: 'Dashboard', description: 'Panel principal del sistema' }
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./shared/components/placeholder/placeholder').then(m => m.PlaceholderComponent),
        data: { title: 'Pedidos', description: 'Gestión de órdenes de clientes' }
      },
      {
        path: 'stock',
        children: [
          {
            path: 'productos',
            loadComponent: () => import('./shared/components/placeholder/placeholder').then(m => m.PlaceholderComponent),
            data: { title: 'Stock - Productos', description: 'Gestión de productos terminados' }
          },
          {
            path: 'ingredientes',
            loadComponent: () => import('./shared/components/placeholder/placeholder').then(m => m.PlaceholderComponent),
            data: { title: 'Stock - Ingredientes', description: 'Gestión de ingredientes y materias primas' }
          },
          {
            path: '',
            redirectTo: 'productos',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'produccion',
        loadComponent: () => import('./shared/components/placeholder/placeholder').then(m => m.PlaceholderComponent),
        data: { title: 'Producción', description: 'Planificación de fabricación' }
      },
      {
        path: 'entregas',
        loadComponent: () => import('./shared/components/placeholder/placeholder').then(m => m.PlaceholderComponent),
        data: { title: 'Entregas', description: 'Gestión de reparto y cobranza' }
      },
      {
        path: 'finanzas',
        loadComponent: () => import('./shared/components/placeholder/placeholder').then(m => m.PlaceholderComponent),
        data: { title: 'Finanzas', description: 'Control de gastos, ingresos y caja' }
      },
      {
        path: 'profile',
        loadComponent: () => import('./shared/components/placeholder/placeholder').then(m => m.PlaceholderComponent),
        data: { title: 'Mi Perfil', description: 'Configuración de usuario' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
