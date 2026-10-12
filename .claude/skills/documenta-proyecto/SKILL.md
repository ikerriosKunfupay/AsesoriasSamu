---
name: documenta-proyecto
description: Mantiene sincronizadas la documentación humana y técnica de Team Ortega después de cualquier cambio del repositorio.
---

# Documenta proyecto

Esta skill es automática para cualquier tarea potencialmente modificadora.

## Antes de cambiar

1. Ejecuta `git status --short` y conserva el estado inicial.
2. Identifica qué archivos ya estaban modificados por el usuario; no los atribuyas a la tarea.
3. Lee `docs/humanos/README.md`, `docs/ia/README.md` y los documentos específicos afectados.

## Después de cambiar

1. Revisa el diff de la tarea.
2. Actualiza la guía humana cuando cambie una capacidad, flujo, limitación u operación.
3. Actualiza la guía para IA cuando cambie arquitectura, contratos, datos, seguridad, comandos o convenciones.
4. Añade una entrada a `docs/humanos/CHANGELOG.md` y `docs/ia/CHANGELOG.md` con el mismo identificador estable, con formato `AAAA-MM-DD-descripcion`.
5. Documenta solo el trabajo actual y separa claramente limitaciones o verificaciones pendientes.
6. Ejecuta las validaciones proporcionales al cambio y refleja cualquier fallo real en ambos registros.

## Condición de cierre

Una tarea con archivos modificados no está completa hasta que la documentación humana y técnica reflejan el resultado y ambos changelogs comparten la misma entrada e identificador.
