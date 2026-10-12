# Registro de cambios técnico

## 2026-10-13 — `2026-10-13-smtp-brevo`

- Generada en Brevo la clave SMTP exclusiva `Team Ortega - Supabase`, sin reutilizar ni modificar credenciales existentes.
- Activado Custom SMTP en Supabase Auth con Brevo, puerto 587, remitente verificado y nombre visible `Team Ortega`.
- Confirmado el guardado de la configuración; el secreto permanece cifrado en Supabase y fuera de Git/Vercel.
- Documentado que la clave es independiente, mientras que cuota, plan y reputación siguen compartidos por la cuenta Brevo.

## 2026-10-13 — `2026-10-13-css-produccion`

- Añadido `@tailwindcss/postcss` y el `postcss.config.mjs` oficial requerido por Tailwind CSS 4 con el build Webpack de Next.js.
- Verificada la generación de utilidades Tailwind en el CSS de producción y ejecutado `pnpm check` completo con resultado correcto.

## 2026-10-13 — `2026-10-13-despliegue-inicial`

- Creada la organización `Team Ortega` y el proyecto Supabase `team-ortega` en `eu-west-1`; aplicada y verificada la migración de 11 tablas.
- Creado el proyecto Vercel `team-ortega` en Hobby desde `ikerriosKunfupay/AsesoriasSamu`, rama `main` y commit `9ca113f`.
- Cargadas como sensibles las cuatro variables de entorno necesarias para Production y Preview, sin incorporar secretos a Git.
- Verificado el despliegue `Ready` en `https://team-ortega.vercel.app` y la carga de la landing Next.js.
- Configurados en Supabase Auth el Site URL de producción y los callbacks de producción y desarrollo local.
- Documentados como pendientes el alta/promoción del primer administrador, la desactivación del registro público, el SMTP propio y las pruebas Auth extremo a extremo.

## 2026-10-12 — `2026-10-12-mvp-inicial`

- Inicializado Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest y Supabase SSR.
- Implementadas landing, formulario de lead protegido, Auth por invitación, reset de contraseña y callback PKCE.
- Añadidos DAL de usuario, guardas por rol y layouts dinámicos para `/admin` y `/app`.
- Implementadas Server Actions Zod para invitaciones, onboarding, planes, check-ins y cuotas manuales.
- Añadida migración PostgreSQL con 11 tablas, índices, triggers, `is_admin()`, `complete_onboarding()` y políticas RLS.
- Incorporados tokens CSS, primitivas UI, navegación responsive, iconos de marca y metadatos `noindex`.
- Añadidas pruebas unitarias de formularios y componentes; validaciones `lint`, `typecheck`, `test:run` y build Webpack.
- Documentados despliegue, modelo de datos, seguridad, operación de Supabase y restricción de Vercel Hobby.
