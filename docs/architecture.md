# Arquitectura Técnica

## Stack Tecnológico

### Frontend - Angular 18+
- **Standalone Components** (no NgModules)
- **Angular Material** para UI
- **Signals** para state management
- **TypeScript strict mode**

### Backend - Supabase
- **PostgreSQL** como base de datos
- **Row Level Security** para auth
- **Real-time subscriptions** para updates
- **REST API** automática

### Deploy
- **Vercel** para frontend
- **Supabase** hosted backend

## Patrón Presentational/Container

### Containers
Manejan lógica de negocio y estado:
```typescript
@Component({
  selector: 'app-pedidos-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pedidos-table 
      [pedidos]="pedidos()"
      [loading]="loading()"
      (onEdit)="editPedido($event)"
      (onDelete)="deletePedido($event)">
    </app-pedidos-table>
  `
})
export class PedidosListContainer {
  private pedidosService = inject(PedidosService);
  
  pedidos = signal<Pedido[]>([]);
  loading = signal<boolean>(false);
  
  editPedido(id: string) { /* lógica */ }
  deletePedido(id: string) { /* lógica */ }
}
```

### Components (Presentational)
Solo UI, reciben datos y emiten eventos:
```typescript
@Component({
  selector: 'app-pedidos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<!-- Solo UI aquí -->`
})
export class PedidosTableComponent {
  pedidos = input.required<Pedido[]>();
  loading = input<boolean>(false);
  
  onEdit = output<string>();
  onDelete = output<string>();
  
  edit(id: string) {
    this.onEdit.emit(id);
  }
}
```

## Estructura de Carpetas

```
src/
├── core/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── supabase.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── models/
│       └── user.interface.ts
├── shared/
│   ├── components/
│   │   ├── loading-spinner/
│   │   └── confirm-dialog/
│   └── pipes/
│       └── currency.pipe.ts
├── features/
│   ├── auth/
│   │   ├── containers/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   ├── pedidos/
│   ├── stock/
│   ├── produccion/
│   ├── entregas/
│   └── finanzas/
└── layouts/
    ├── app-shell/
    └── navigation/
```

## Modelo de Datos

### Entidades Principales
- **usuarios** - Control de acceso (3 roles)
- **productos** - Catálogo (formato S, L)
- **ingredientes** - Materias primas
- **stock** - Inventario actual
- **pedidos** - Órdenes de clientes
- **entregas** - Control de reparto
- **transacciones** - Movimientos financieros

### Relaciones Clave
```sql
pedidos → productos (many-to-many)
productos → ingredientes (many-to-many vía recetas)
entregas → pedidos (one-to-one)
transacciones → pedidos (one-to-many)
```

## Patrones de Comunicación

### Services
```typescript
@Injectable({ providedIn: 'root' })
export class PedidosService {
  private supabase = inject(SupabaseService);
  
  async getPedidos(): Promise<Pedido[]> {
    // Comunicación con Supabase
  }
}
```

### State Management
- **Local state:** Signals en containers
- **Global state:** Services con signals
- **Derived state:** computed() functions

## Routing

```typescript
const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/containers/login.container')
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./features/pedidos/pedidos.routes'),
    canActivate: [AuthGuard]
  }
];
```

## Testing Strategy

- **Unit tests:** Components y services aislados
- **Integration tests:** Containers con mocked services  
- **E2E tests:** Flujos completos de usuario