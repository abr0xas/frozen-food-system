---
name: "Claude Code Task"
about: "Template para tareas que serán implementadas por Claude Code"
title: "[CLAUDE] "
labels: claude-task, priority-medium
assignees: ''
---

## Descripción de la tarea
<!-- Describe claramente qué debe implementar Claude -->

## Acceptance Criteria
<!-- Define los criterios de aceptación específicos -->
- [ ] 
- [ ] 
- [ ] 

## Checklist técnico para Claude

### 📋 Estándares obligatorios
- [ ] Leer `CLAUDE.md` al inicio de la sesión
- [ ] Consultar `docs/development-standards.md` para detalles técnicos
- [ ] Seguir Container/Presentational pattern estrictamente
- [ ] Usar Angular CLI para generar componentes: `ng generate component path/name`
- [ ] ChangeDetectionStrategy.OnPush en todos los componentes
- [ ] input()/output() functions en lugar de decorators
- [ ] inject() function en lugar de constructor injection

### 🎨 Material Design First
- [ ] Usar Material components al máximo, evitar CSS personalizado
- [ ] Solo crear CSS custom si Material no cubre el caso
- [ ] Usar color-scheme para themes automáticos
- [ ] Aprovechar Material tokens para consistencia

### 🔧 Implementación
- [ ] Crear TodoWrite list para trackear progreso en tareas multi-step
- [ ] Correr `npm run lint` antes de commit
- [ ] Verificar build pasa: `npm run build`
- [ ] Crear commits con formato: `type: description`

### ✅ Finalización
- [ ] Push a branch feature apropiada
- [ ] Crear PR con descripción detallada
- [ ] Incluir test plan en PR description

## Context adicional
<!-- Información extra que pueda ser útil para Claude -->

## Archivos relacionados
<!-- Lista de archivos que Claude debería revisar -->
- 
- 
- 

---
*Este template asegura que Claude siga los estándares del proyecto automáticamente*