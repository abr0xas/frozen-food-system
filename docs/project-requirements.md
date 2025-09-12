# Requisitos del Proyecto

## Contexto de Negocio

### Empresa
Negocio familiar de fabricación y distribución de alimentos congelados.

### Situación Actual
- **Volumen:** 1-5 pedidos por semana
- **Productos:** 1 tipo en 2 formatos (S y L)
- **Personal:** 3 trabajadores especializados
  - 1 persona: compras
  - 2 personas: fabricación
  - 1 persona: reparto
- **Proceso actual:** Manual vía WhatsApp Business

### Problema a Resolver
Necesidad de digitalizar y controlar:
- Gestión de pedidos (desde WhatsApp)
- Control de stock (ingredientes + productos)
- Planificación de producción
- Gestión de entregas y cobranza
- Control financiero (gastos, ingresos, caja)

## Requisitos Funcionales

### 1. Gestión de Pedidos
- **Registro manual** desde conversaciones WhatsApp
- **Estados:** pendiente → preparando → listo → entregado
- **Información requerida:**
  - Datos del cliente
  - Productos solicitados (cantidad, formato)
  - Fecha de entrega preferida
  - Observaciones especiales

### 2. Control de Stock
- **Ingredientes:** Inventario de materias primas
- **Productos terminados:** Stock de productos S y L
- **Alertas automáticas** cuando stock < mínimo configurado
- **Historial de movimientos** (entradas/salidas)

### 3. Planificación de Producción
- **Recetas:** Relación ingredientes → producto final
- **Cálculo automático:** Cuándo fabricar según:
  - Stock actual de productos
  - Pedidos pendientes
  - Stock disponible de ingredientes
- **Programación:** Cuándo comprar ingredientes

### 4. Gestión de Entregas
- **Lista de pedidos** listos para reparto
- **Control de entrega** y cobranza
- **Estado de pago:** pendiente/cobrado
- **Rutas básicas** (opcional para futuro)

### 5. Control Financiero
- **Ingresos:** Por pedido entregado y cobrado
- **Gastos:** 
  - Compra de ingredientes
  - Otros gastos operativos
- **Caja:** Balance actual disponible
- **Devoluciones:** Gestión de productos devueltos
- **Reportes básicos:** Ganancias por periodo

## Requisitos No Funcionales

### Usuarios
- **3 usuarios concurrentes** máximo
- **Roles diferenciados:**
  - Administrador (acceso total)
  - Operador (pedidos, stock, producción)
  - Repartidor (entregas y cobranza)

### Performance
- **Tiempo de respuesta:** < 2 segundos
- **Disponibilidad:** 99% uptime
- **Volumen de datos:** Bajo (máximo 500 pedidos/año)

### Seguridad
- **Autenticación:** Login/logout seguro
- **Autorización:** Acceso por roles
- **Datos financieros** protegidos

### Usabilidad
- **Interface intuitiva** para usuarios no técnicos
- **Mobile responsive** (uso en tablet/móvil)
- **Flujo simple** para tareas diarias

### Escalabilidad
- **Arquitectura preparada** para crecimiento futuro
- **Base de datos** escalable (PostgreSQL)
- **Módulos independientes** fáciles de extender

## Casos de Uso Principales

### 1. Registrar Pedido (Diario)
1. Usuario recibe pedido por WhatsApp
2. Ingresa datos en el sistema
3. Sistema valida disponibilidad de stock
4. Pedido queda en estado "pendiente"

### 2. Planificar Producción (2-3 veces/semana)
1. Usuario revisa pedidos pendientes
2. Sistema calcula necesidades de producción
3. Verifica stock de ingredientes
4. Genera lista de compras si es necesario
5. Programa fabricación

### 3. Gestionar Entrega (Diario)
1. Repartidor ve lista de pedidos listos
2. Marca pedidos como "en reparto"
3. Al entregar: confirma entrega y pago
4. Sistema actualiza caja e inventario

### 4. Control de Caja (Diario)
1. Registrar gastos del día
2. Ver balance actual
3. Conciliar ingresos vs gastos

## Restricciones Técnicas

### Integración WhatsApp
- **Inicial:** Manual (copiar/pegar desde WhatsApp)
- **Futuro:** Evaluar WhatsApp Business API si es costo-efectivo

### Presupuesto
- **Solución económica** para PYME
- **Tier gratuito** de Supabase suficiente inicialmente

### Tiempo de Implementación
- **MVP:** 6-8 semanas
- **Iteraciones:** Features adicionales por módulo

## Criterios de Aceptación

### MVP Exitoso
- [ ] Los 3 usuarios pueden usar el sistema diariamente
- [ ] Reduce tiempo de gestión manual en 50%
- [ ] Cero pérdida de pedidos por olvido
- [ ] Control preciso de stock e ingredientes
- [ ] Balance financiero actualizado diariamente

### Medidas de Éxito
- **Adopción:** 100% de pedidos registrados en sistema
- **Eficiencia:** Tiempo de procesamiento < 50% del actual
- **Precisión:** 0 errores en inventario por mes
- **Satisfacción:** Usuarios reportan mayor control del negocio