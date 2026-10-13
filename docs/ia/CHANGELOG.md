# Registro de cambios técnico

## 2026-10-13 — `2026-10-13-logo-hero-movil`

- Añadida una variante móvil absoluta y de carga prioritaria de `team-ortega-mark.png` en el hero, decorativa para lectores de pantalla y oculta desde `lg`.

## 2026-10-13 — `2026-10-13-hero-mas-compacto`

- Reducido el `clamp()` tipográfico del `h1`, la altura mínima y los espaciados verticales del hero de la landing.
- Reducido el ancho máximo del recurso de marca y reajustada la proporción de columnas sin alterar el contenido ni los CTA.

## 2026-10-13 — `2026-10-13-tipografia-archivo-dm-sans`

- Integradas Archivo variable y DM Sans variable mediante `next/font/google` en el layout raíz.
- Expuestas como variables CSS del sistema de diseño y aplicadas globalmente a texto, controles y titulares, con autoalojamiento en el artefacto de Next.js.
- Ajustada la firma compacta de marca para conservar `Team Ortega` en una sola línea en cabeceras móviles con las nuevas métricas.
- Reducido el breakpoint de escritorio del `h1` de captación para evitar clipping en su columna lateral.
- La primera compilación local no pudo resolver Google Fonts por la red restringida del entorno; repetida con acceso permitido, terminó correctamente.

## 2026-10-13 — `2026-10-13-contacto-sin-correo`

- Eliminada la opción `email` del grupo de radios visible en `LeadForm` y ajustada su composición a dos columnas.
- Conservado el valor en el esquema de validación para compatibilidad con registros históricos; no se modifica la base de datos.

## 2026-10-13 — `2026-10-13-selector-prefijo-interno`

- Reemplazado el `select` nativo del prefijo por un listbox controlado en `LeadForm`, con estados ARIA, selección, foco, cierre exterior y navegación por flechas, inicio, fin y Escape.
- Conservada la composición final del campo `phone` y el contrato de la Server Action sin cambios de base de datos.

## 2026-10-13 — `2026-10-13-identidad-editorial-publica`

- Añadidas en `globals.css` utilidades públicas acotadas para composición editorial, CTA diagonales, recursos de marca y formularios lineales.
- Recompuestas la landing, `MarketingHeader`, `MarketingFooter`, `AuthShell`, captación, privacidad y 404 sin modificar las primitivas ni los layouts del dashboard.
- Conservados los contratos de formularios y Server Actions; el cambio del teléfono y de `contactPreference` sigue siendo exclusivamente de presentación y composición del `FormData` existente.
- Verificadas las superficies públicas en escritorio y móvil mediante vista previa local.

## 2026-10-13 — `2026-10-13-contacto-telefono`

- Reemplazado `contactPreference` por un grupo de radios accesible que mantiene los valores `whatsapp`, `phone` y `email`.
- Añadido al formulario de leads un teléfono compuesto que envía a la Server Action el prefijo y el número como el campo `phone` existente, sin migración de base de datos.
- Actualizadas las reglas del sistema de diseño para controles telefónicos y elecciones cortas.

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
