# Estándares de Desarrollo

## TypeScript Best Practices

### Configuración Estricta
- **Strict type checking** activado
- **Evitar `any`** - usar `unknown` si es necesario
- **Type inference** cuando sea obvio
- **Interfaces explícitas** para modelos de datos

```typescript
// ✅ Correcto
interface Pedido {
  id: string;
  clienteId: string;
  estado: PedidoStatus;
  productos: PedidoProducto[];
}

// ❌ Incorrecto
const pedido: any = { ... };
```

## Angular Modern Standards

### Componentes
- **Standalone components** únicamente (no NgModules)
- **`changeDetection: ChangeDetectionStrategy.OnPush`** obligatorio
- **`input()`/`output()`** functions en lugar de decorators
- **Signals** para state management local

```typescript
// ✅ Correcto
@Component({
  selector: 'app-pedido-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PedidoFormComponent {
  pedido = input.required<Pedido>();
  onSave = output<Pedido>();
  
  private formData = signal<Partial<Pedido>>({});
}

// ❌ Incorrecto - decorators antiguos
@Component({...})
export class PedidoFormComponent {
  @Input() pedido!: Pedido;
  @Output() onSave = new EventEmitter<Pedido>();
}
```

### Services
- **`providedIn: 'root'`** para singletons
- **`inject()`** function en lugar de constructor injection
- **Single responsibility** por service

```typescript
// ✅ Correcto
@Injectable({ providedIn: 'root' })
export class PedidosService {
  private supabase = inject(SupabaseService);
  private http = inject(HttpClient);
}

// ❌ Incorrecto
export class PedidosService {
  constructor(
    private supabase: SupabaseService,
    private http: HttpClient
  ) {}
}
```

### Templates
- **Native control flow** (`@if`, `@for`, `@switch`)
- **`class`/`style` bindings** (no `ngClass`/`ngStyle`)
- **Templates simples** - lógica compleja en container
- **Async pipe** para observables

```typescript
// ✅ Correcto
@if (loading()) {
  <app-loading-spinner />
}

@for (pedido of pedidos(); track pedido.id) {
  <div [class.active]="pedido.estado === 'activo'">
    {{ pedido.cliente }}
  </div>
}

// ❌ Incorrecto
<div *ngIf="loading()">...</div>
<div *ngFor="let pedido of pedidos()">...</div>
<div [ngClass]="{'active': pedido.estado === 'activo'}">
```

## State Management

### Signals Pattern
```typescript
// ✅ Local state en containers
export class PedidosListContainer {
  private pedidosService = inject(PedidosService);
  
  // State
  pedidos = signal<Pedido[]>([]);
  loading = signal<boolean>(false);
  selectedPedido = signal<Pedido | null>(null);
  
  // Computed
  pendingPedidos = computed(() => 
    this.pedidos().filter(p => p.estado === 'pendiente')
  );
  
  // Actions
  async loadPedidos() {
    this.loading.set(true);
    try {
      const data = await this.pedidosService.getAll();
      this.pedidos.set(data);
    } finally {
      this.loading.set(false);
    }
  }
  
  selectPedido(pedido: Pedido) {
    this.selectedPedido.set(pedido);
  }
}
```

### Mutaciones de Estado
```typescript
// ✅ Correcto - update/set
this.pedidos.update(current => [...current, newPedido]);
this.pedidos.set([...pedidos, newPedido]);

// ❌ Incorrecto - mutate
this.pedidos.mutate(pedidos => pedidos.push(newPedido));
```

## Arquitectura Container/Presentational

### Separación Estricta

**Container (lógica + estado):**
```typescript
@Component({
  selector: 'app-pedidos-list-container',
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
  // Solo lógica y estado aquí
}
```

**Component (presentational):**
```typescript
@Component({
  selector: 'app-pedidos-table',
  template: `<!-- Solo UI -->`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosTableComponent {
  // Solo input/output
  pedidos = input.required<Pedido[]>();
  loading = input<boolean>(false);
  
  onEdit = output<string>();
  onDelete = output<string>();
  
  // Métodos solo para UI
  editPedido(id: string) {
    this.onEdit.emit(id);
  }
}
```

## Naming Conventions

### Archivos y Componentes
```
// Containers
pedidos-list.container.ts
pedido-detail.container.ts

// Components  
pedidos-table.component.ts
pedido-form.component.ts
pedido-status.component.ts

// Services
pedidos.service.ts
stock.service.ts

// Models
pedido.interface.ts
stock.interface.ts
```

### Clases y Interfaces
```typescript
// Interfaces - PascalCase
interface PedidoStatus { }
interface StockItem { }

// Components - PascalCase + sufijo
class PedidosListContainer { }
class PedidoFormComponent { }

// Services - PascalCase + sufijo  
class PedidosService { }
class AuthService { }
```

## Validaciones y Error Handling

### Reactive Forms
```typescript
// ✅ Validation con Reactive Forms
createPedidoForm() {
  return this.fb.group({
    clienteId: ['', [Validators.required]],
    productos: this.fb.array([], [Validators.minLength(1)])
  });
}
```

### Error Handling
```typescript
// ✅ Manejo consistente de errores
async savePedido(pedido: Pedido) {
  try {
    this.loading.set(true);
    await this.pedidosService.create(pedido);
    this.showSuccess('Pedido creado correctamente');
  } catch (error) {
    this.showError('Error al crear pedido');
    console.error('Save pedido error:', error);
  } finally {
    this.loading.set(false);
  }
}
```

## Performance

### OnPush Strategy
- Obligatorio en todos los components
- Maximiza performance con signals
- Reduce re-renderizados innecesarios

### Lazy Loading
```typescript
const routes: Routes = [
  {
    path: 'pedidos',
    loadChildren: () => import('./features/pedidos/pedidos.routes')
  }
];
```

### TrackBy Functions
```typescript
// ✅ TrackBy para listas grandes
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```