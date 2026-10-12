# Registro de cambios técnico

## 2026-10-12 — `2026-10-12-mvp-inicial`

- Inicializado Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest y Supabase SSR.
- Implementadas landing, formulario de lead protegido, Auth por invitación, reset de contraseña y callback PKCE.
- Añadidos DAL de usuario, guardas por rol y layouts dinámicos para `/admin` y `/app`.
- Implementadas Server Actions Zod para invitaciones, onboarding, planes, check-ins y cuotas manuales.
- Añadida migración PostgreSQL con 11 tablas, índices, triggers, `is_admin()`, `complete_onboarding()` y políticas RLS.
- Incorporados tokens CSS, primitivas UI, navegación responsive, iconos de marca y metadatos `noindex`.
- Añadidas pruebas unitarias de formularios y componentes; validaciones `lint`, `typecheck`, `test:run` y build Webpack.
- Documentados despliegue, modelo de datos, seguridad, operación de Supabase y restricción de Vercel Hobby.
