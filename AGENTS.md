# Instrucciones para agentes — Team Ortega

## Alcance protegido

Este repositorio es el único alcance autorizado para Team Ortega. No modifiques otros repositorios, proyectos de Vercel, organizaciones de Supabase ni recursos externos ajenos a `AsesoriasSamu`.

## Documentación obligatoria

La skill [`.claude/skills/documenta-proyecto/SKILL.md`](./.claude/skills/documenta-proyecto/SKILL.md) es automática. Antes de cualquier tarea potencialmente modificadora, captura el estado inicial. Si se cambia algún archivo, actualiza la documentación humana de `docs/humanos/`, la documentación técnica de `docs/ia/` y ambos registros con el mismo identificador.

## Seguridad y privacidad

- Los datos de salud, analíticas y fotografías son sensibles: minimiza campos, no los escribas en logs y no los expongas en URLs o DTOs.
- Toda tabla accesible desde Supabase debe tener RLS habilitado y políticas explícitas.
- La navegación o una redirección nunca sustituyen la autorización en la base de datos y en cada Server Action.
- `SUPABASE_SERVICE_ROLE_KEY` es exclusivamente server-side. Nunca uses el prefijo `NEXT_PUBLIC_` para secretos.
- El rol `admin` no puede asignarse desde formularios o metadatos controlados por clientes.
- Los archivos sensibles deben vivir en buckets privados y servirse mediante URLs firmadas breves.
- La aplicación no procesa pagos ni almacena tarjetas o datos bancarios.

## Sistema de diseño

- La fuente visual está en `src/app/globals.css`, `src/components/ui/` y `docs/12-design-system.md`.
- No introduzcas colores hexadecimales, radios, sombras o espaciados arbitrarios en features.
- Reutiliza los componentes existentes antes de crear variantes nuevas.
- Diseña móvil primero, con objetivos táctiles de al menos 44 px e inputs de 16 px en móvil.
- Valida 375×667, 390×844, tablet y escritorio; incluye foco, teclado y `prefers-reduced-motion`.

## Next.js 16

Antes de modificar convenciones del framework, lee la guía correspondiente en `node_modules/next/dist/docs/`. En Next.js 16 `middleware.ts` se llama `proxy.ts`; Proxy solo refresca sesión y hace comprobaciones optimistas, nunca autorización completa.

## Comandos de cierre

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

No declares una tarea completa si alguno falla sin documentarlo en ambos registros.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
