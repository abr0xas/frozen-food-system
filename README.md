# Frozen Food System

Sistema de gestión integral para negocio de alimentos congelados con fabricación, inventario, pedidos y distribución.

## Stack Tecnológico

- **Frontend:** Angular 18 + Angular Material
- **Backend:** Supabase (PostgreSQL + Auth + API)
- **Arquitectura:** Presentational/Container Components
- **Deploy:** Vercel + Supabase

## Problema de Negocio

Negocio familiar de alimentos congelados que maneja:
- 1-5 pedidos semanales vía WhatsApp
- 1 producto en 2 formatos (S, L)
- 3 trabajadores especializados
- Control de stock, producción y finanzas

## Módulos del Sistema

- **🔐 Auth** - Autenticación y control de usuarios
- **📦 Pedidos** - Gestión de órdenes de clientes
- **📊 Stock** - Control de inventario (ingredientes + productos)
- **🏭 Producción** - Planificación de fabricación
- **🚚 Entregas** - Gestión de reparto y cobranza
- **💰 Finanzas** - Control de gastos, ingresos y caja

## Arquitectura

### Presentational/Container Pattern
```
features/module/
├── containers/           # Lógica + estado + datos
├── components/          # UI pura (input/output)
├── services/           # Comunicación Supabase
└── models/            # Interfaces TypeScript
```

### Estructura del Proyecto
```
src/
├── core/               # Servicios globales, guards
├── shared/            # Componentes reutilizables
├── features/          # Módulos por funcionalidad
└── layouts/           # Shell de la aplicación
```

## Desarrollo

### Pre-requisitos
- Node.js 18+
- Angular CLI 18+
- Cuenta Supabase configurada

### Setup Inicial
```bash
npm install
ng serve
```

### Workflow
1. **Issues** → **Branch** → **Development** → **PR** → **Merge**
2. Una rama por feature
3. Claude Code para implementación
4. Cursor para refinamientos

### Branching Strategy
```
main           # Producción
├── develop    # Integración
    ├── feature/auth
    ├── feature/pedidos
    └── feature/stock
```

## Documentación

- [Especificaciones Técnicas](./docs/architecture.md)
- [Estándares de Desarrollo](./docs/development-standards.md)
- [Requisitos de Negocio](./docs/project-requirements.md)

## Estado del Proyecto

- [ ] Foundation (Setup + Auth + Layout)
- [ ] Core Features (Pedidos + Stock)
- [ ] Business Logic (Producción + Finanzas)
- [ ] Operations (Entregas + Reportes)

Ver [GitHub Projects](../../projects) para estado detallado.