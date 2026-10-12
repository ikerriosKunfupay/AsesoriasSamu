# Contexto para agentes

## Resumen

Team Ortega es un portal de entrenamiento personal con dos roles: `admin` y `client`. El alta es exclusivamente por invitación. El público solo puede ver la landing y enviar un lead sin datos sanitarios.

## Mapa rápido

- `src/app/actions/`: mutaciones server-side.
- `src/app/admin/`: panel del entrenador.
- `src/app/app/`: área del cliente.
- `src/lib/auth/`: DAL y guardas de autorización.
- `src/lib/forms/`: esquemas Zod y contrato de estados.
- `src/lib/supabase/`: clientes SSR, service role y tipos.
- `src/components/ui/`: primitivas del sistema de diseño.
- `supabase/migrations/`: esquema y RLS reproducibles.
- `docs/12-design-system.md`: reglas visuales.

## Lectura obligatoria antes de cambiar

1. `AGENTS.md`.
2. `.claude/skills/documenta-proyecto/SKILL.md`.
3. Este índice y el documento técnico relacionado con la tarea.
4. La documentación incluida en `node_modules/next/dist/docs/` cuando se cambien convenciones Next.js.

## Invariantes

- Nunca aceptar `role=admin` desde metadatos o formularios del cliente.
- Verificar autenticación y rol dentro de cada Server Action privilegiada.
- Mantener RLS incluso si la ruta ya tiene guarda.
- No exponer `SUPABASE_SERVICE_ROLE_KEY` al navegador.
- No introducir pagos ni datos bancarios.
- No almacenar datos de salud en leads, logs, URLs o auditorías.
