# 🤖 Instrucciones para Claude Code

## 📋 Estándares del proyecto (OBLIGATORIO)

### Angular Modern Standards
- **SIEMPRE usar Angular CLI** para generar componentes: `ng generate component path/name`
- **ChangeDetectionStrategy.OnPush** obligatorio en todos los components
- **input()/output()** functions en lugar de decorators 
- **inject()** function en lugar de constructor injection
- **Standalone components** únicamente (no NgModules)
- **Signals first** - Usar signals en lugar de RxJS cuando sea posible

### Material Design First
- **USAR Material components al máximo** - Evitar crear componentes custom
- **NO personalizar con CSS** salvo casos excepcionales
- **Usar color-scheme** para themes en lugar de CSS custom
- **Aprovechar Material tokens** para consistencia visual

### Container/Presentational Pattern (ESTRICTO)
```typescript
// ✅ Container - Lógica + Estado + Services
export class PedidosListContainer {
  private service = inject(PedidosService);
  pedidos = signal<Pedido[]>([]);
}

// ✅ Component - Solo UI + input/output
export class PedidosTableComponent {
  pedidos = input.required<Pedido[]>();
  onEdit = output<string>();
}
```

## 🔧 Comandos del proyecto

### Desarrollo
```bash
ng serve                    # Servidor desarrollo
npm run lint               # Linting con ESLint
npm run build              # Build de producción
npm test                   # Tests unitarios
```

### Generación (Angular CLI OBLIGATORIO)
```bash
ng generate component features/modulo/components/nombre
ng generate service core/services/nombre
ng generate guard core/guards/nombre
```

## 📝 Workflow estándar

### 1. Leer requirements
- ✅ Consultar Issue de GitHub para entender el scope
- ✅ Revisar `docs/development-standards.md` para detalles técnicos
- ✅ Verificar que está en la branch correcta

### 2. Implementación
- ✅ Usar Angular CLI para generar componentes nuevos
- ✅ Seguir Container/Presentational pattern estrictamente
- ✅ Material components first, CSS solo si es necesario
- ✅ input()/output() + signals + inject()

### 3. Verificación
- ✅ Correr `npm run lint` antes de commit
- ✅ Verificar que build pasa: `npm run build`
- ✅ Probar funcionalidad básica

### 4. Git workflow
- ✅ Commits descriptivos con formato: `type: description`
- ✅ Push a branch feature
- ✅ Crear PR con descripción detallada

## 🎯 Estructura de commits

```
feat: add user authentication system
fix: resolve theme toggle functionality  
refactor: improve container/presentational separation
docs: update development standards
style: fix linting issues
```

## ⚠️ Errores comunes a evitar

### ❌ NO hacer:
- Crear componentes manualmente (sin Angular CLI)
- Usar constructor injection en lugar de inject()
- Crear CSS personalizado cuando existe Material equivalent
- Mezclar lógica y UI en un mismo component
- Usar RxJS cuando signals es suficiente
- Olvidar ChangeDetectionStrategy.OnPush

### ✅ SÍ hacer:
- Leer esta documentación al inicio de cada sesión
- Consultar docs/development-standards.md para detalles
- Usar TodoWrite tool para trackear progreso en tareas complejas
- Preguntar sobre scope antes de implementar features extra

## 📚 Referencias rápidas

- **Estándares detallados:** `docs/development-standards.md`
- **Arquitectura:** Ver README.md sección "Arquitectura"
- **Issues:** GitHub Issues para requirements específicos
- **Material Components:** https://material.angular.io/components

## 🔄 Al inicio de cada sesión

1. **Leer este archivo completo**
2. **Revisar el issue/task asignado**
3. **Confirmar branch correcta**
4. **Consultar docs/development-standards.md** si hay dudas técnicas
5. **Usar TodoWrite** para tareas multi-step

---
*Este archivo mantiene el contexto para que Claude Code siga los estándares del proyecto automáticamente.*