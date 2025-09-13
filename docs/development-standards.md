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

## Angular CLI - Obligatorio

### Setup y Generación
- **SIEMPRE usar Angular CLI** para crear proyectos y generar archivos
- **NO crear estructura manual** de carpetas ni archivos
- **Comandos obligatorios:**

```bash
# Crear proyecto
ng new project-name --routing --style=scss --standalone

# Generar componentes
ng generate component features/pedidos/components/pedido-form

# Generar services  
ng generate service features/pedidos/services/pedidos

# Generar guards
ng generate guard core/guards/auth
```

### Estructura Automática
- Angular CLI crea la estructura correcta automáticamente
- Mantiene convenciones de naming
- Configura imports y dependencies correctamente

## Angular Material Design System

### Principios de Material First
- **USAR Material components al máximo** - Evitar crear componentes custom cuando existe equivalente en Material
- **NO personalizar con CSS** salvo casos excepcionales - Aprovechar theming automático de Material
- **Usar color-scheme** para themes en lugar de CSS custom
- **Aprovechar Material tokens** - Variables CSS de Material Design para consistencia

```typescript
// ✅ Correcto - Usar Material components directamente
@Component({
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>{{ content }}</mat-card-content>
    </mat-card>
  `
})

// ✅ Correcto - Themes automáticos con color-scheme
body.style.colorScheme = 'dark'; // Material se adapta automáticamente

// ❌ Incorrecto - CSS personalizado innecesario
.custom-card {
  background: #424242;
  color: white;
  border-radius: 8px;
}
```

### Cuándo SÍ personalizar CSS
- **Solo si Material no cubre el caso** - Espaciado específico, layouts únicos
- **Responsive breakpoints** - Material no incluye responsive utilities
- **Animaciones específicas** - Transiciones no disponibles en Material

```scss
// ✅ Permitido - Responsive layout
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
}

// ✅ Permitido - Espaciado específico del negocio
.product-list-item {
  padding: 1.5rem; // Espaciado específico UX
}
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

## Instrucciones para Claude Code

### 📚 Documentos de contexto obligatorios
- **Leer siempre al inicio:** `CLAUDE.md` - Instrucciones específicas y estándares
- **Consultar para detalles:** Este archivo (`development-standards.md`) para especificaciones técnicas
- **Verificar scope:** GitHub Issues para requirements exactos del task

### 🎯 Workflow automático requerido
1. **Inicialización:** Leer `CLAUDE.md` completo antes de empezar cualquier task
2. **Generación:** SIEMPRE usar Angular CLI - `ng generate component path/name`
3. **Estándares:** Container/Presentational pattern + Material First + ChangeDetectionStrategy.OnPush
4. **Verificación:** `npm run claude:lint` antes de commit
5. **Progreso:** Usar TodoWrite tool para tareas multi-step

### 📋 Scripts de ayuda disponibles
```bash
npm run claude:help       # Lista todos los comandos de ayuda
npm run claude:standards  # Muestra estos estándares rápidamente  
npm run claude:lint       # Linting con confirmación para Claude
npm run claude:workflow   # Pasos del workflow resumidos
npm run claude:generate   # Comandos Angular CLI más comunes
```

### ⚠️ Checklist de verificación antes de commit
- [ ] Leído `CLAUDE.md` al inicio de la sesión
- [ ] Usado Angular CLI para generar nuevos componentes
- [ ] Aplicado Container/Presentational pattern estrictamente
- [ ] Material components usados al máximo, CSS solo si es necesario
- [ ] ChangeDetectionStrategy.OnPush en todos los components
- [ ] input()/output() + inject() + signals utilizados
- [ ] `npm run claude:lint` ejecutado y pasando
- [ ] Commits con formato correcto: `type: description`

### 🔄 Referencias cruzadas
- **Contexto principal:** `CLAUDE.md` 
- **Arquitectura:** `README.md` sección "Arquitectura"
- **Issues templates:** `.github/ISSUE_TEMPLATE/claude-task.md`

---
*Estas instrucciones aseguran que Claude Code mantenga consistencia automáticamente sin repetir contexto en cada task*
```