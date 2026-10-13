# Registro de cambios técnico

## 2026-10-13 — `2026-10-13-ayudas-contextuales-cuestionario`

- Añadidos `FieldHelp` y `FieldHelpContent`; `Field` puede renderizar un disparador `?` junto a la etiqueta sin alterar el control ni su contrato de datos.
- El diálogo contextual incluye etiquetado ARIA, cierre exterior, `Escape`, restauración del foco y contenido específico para los seis campos narrativos del onboarding.
- Los textos sensibles aplican minimización de datos y desaconsejan diagnósticos, historiales e informes completos.
- Incorporadas pruebas de apertura, contenido, cierre y retorno del foco.

## 2026-10-13 — `2026-10-13-controles-cuestionario-interno`

- Añadido `numeric-values.ts` para sanear enteros y decimales sin signo y convertir `,` o `.` a un `number` canónico antes del `upsert` de onboarding.
- Endurecido `onboardingSchema`: rechaza signos, exponentes, texto, edades decimales y separadores repetidos, conservando los rangos físicos y las columnas PostgreSQL `numeric(5,2)` existentes.
- Añadido `InternalSelect`, combobox/listbox accesible con foco, teclado, cierre exterior y valor oculto compatible con `FormData`; aplicado a `sex`.
- Recompuesto `OnboardingForm` en pares responsivos de textareas con alturas equivalentes y ajustada la cabecera móvil de `DashboardShell` a menú izquierdo y marca derecha.
- Incorporadas pruebas de saneamiento, normalización, rechazo del esquema y accesibilidad básica del selector. La primera ejecución reveló esperas de foco y ausencia de nombre accesible en el combobox; ambos puntos se corrigieron y la suite final pasó. La previsualización privada local quedó bloqueada por ausencia de variables públicas de Supabase en el checkout temporal; después se verificaron en producción el layout móvil, el listbox y los filtros numéricos sin enviar el formulario.

## 2026-10-13 — `2026-10-13-bloqueo-navegacion-cuestionario`

- `DashboardShell` recibe `onboardingComplete`, intercepta los enlaces de cliente distintos del cuestionario y muestra un diálogo accesible y cerrable en escritorio y móvil.
- Añadido `requireCompletedClient()` y aplicado a Inicio, Entrenamiento, Nutrición y Seguimiento para impedir que una URL directa omita el onboarding.
- Añadidas pruebas del bloqueo previo y de la navegación desbloqueada después de completar el cuestionario.
- La primera ejecución aislada falló al cargar la Server Action y otra conservó DOM entre casos; se simularon `logoutAction` y la limpieza explícita. `pnpm check` final superó lint, tipos, 13 pruebas y build.

## 2026-10-13 — `2026-10-13-mejoras-acceso-correo`

- `DashboardShell` fija el lateral de escritorio a `100dvh` mediante posición `sticky`, manteniendo accesibles el usuario y el formulario de `logoutAction`.
- Extraído `PasswordInput` como componente reutilizable; el login lo usa con `current-password` y dispone de una prueba de alternancia visible/oculta.
- Versionados el asunto y el HTML de **Confirm sign up**; la plantilla usa estilos inline, un PNG ligero específico para correo y conserva `{{ .ConfirmationURL }}` como CTA y fallback.

## 2026-10-13 — `2026-10-13-cerrar-toast-registro`

- Ampliado `ActionState` con `messageId`; `registerAction` genera un UUID nuevo en cada error para que el mismo toast pueda reaparecer tras descartarlo.
- `FormErrorToast` conserva localmente el identificador cerrado y expone un botón accesible `Cerrar aviso` con el icono `X`.

## 2026-10-13 — `2026-10-13-mejorar-password-registro`

- Añadido `items-start` a la cuadrícula responsive de `RegisterForm` para impedir que el texto de ayuda de la contraseña estire y desplace el campo de confirmación.
- `RegisterForm` usa `noValidate`, un toast de error persistente y `aria-invalid`; `globals.css` mantiene rojo el borde inválido incluso durante el foco.
- Los dos campos emplean un control de visibilidad independiente con `Eye`/`EyeOff`, y los mensajes de ayuda y error quedan asociados mediante `aria-describedby`.
- El primer `pnpm check` señaló `react-hooks/set-state-in-effect` en el cierre temporizado del toast; se retiró ese efecto y la ejecución final superó lint, tipos, 8 pruebas y build.

## 2026-10-13 — `2026-10-13-registro-publico-clientes`

- Añadidos `/registro`, `RegisterForm`, `registerSchema` y `registerAction` sobre `supabase.auth.signUp()`.
- El registro envía únicamente `full_name` como metadato, usa el callback a `/app/cuestionario` y conserva la asignación forzada de `client` en `handle_new_user()`.
- Añadidas pruebas de validación para registros correctos y contraseñas no coincidentes; no se requiere migración de base de datos.

## 2026-10-13 — `2026-10-13-carrusel-pasos-movil`

- Añadido `StepsCarousel`, componente cliente accesible con scroll snap, navegación táctil, flechas, contador y paginación sincronizada mediante `onScroll`.
- La landing renderiza el carrusel bajo `md` y conserva el listado estático desde `md`.
- El `h2` de la sección usa `2.625rem` por defecto y recupera `text-6xl` desde `sm` para evitar clipping a 390 px.

## 2026-10-13 — `2026-10-13-modal-registro-login`

- Sustituido el mensaje de éxito insertado en `RegisterForm` por `RegistrationSuccessDialog`, un diálogo modal accesible.
- El componente navega con `router.replace("/login")` tras 2,5 segundos o al activar el CTA y cuenta con pruebas del botón y del temporizador.

## 2026-10-13 — `2026-10-13-registro-sin-scroll`

- Añadido a `AuthShell` el modo opcional `fitViewport`, basado en `h-dvh`, contención de overflow y espaciado compacto; solo `/registro` lo activa.
- `RegisterForm` acepta el modo `compact` para reducir gaps sin cambiar controles, validación ni contratos de la Server Action.
- Bajo 640 px de ancho y 721 px de alto, el layout reduce espaciados y saca los mensajes `.field-error` del flujo visual sin retirarlos del árbol accesible; el toast y `aria-invalid` siguen visibles.

## 2026-10-13 — `2026-10-13-volver-inicio-formulario-izquierda`

- El contenedor del enlace de retorno en `/solicitar-informacion` cambia de `justify-end` a `justify-start`.

## 2026-10-13 — `2026-10-13-eliminar-scroll-metodo`

- La cuadrícula de `#metodo` pasa de `lg` a `xl`, usa pistas `minmax(0, …)`, aplica `min-w-0` a ambos hijos y contiene cualquier desbordamiento horizontal residual.
- `pnpm check` superó lint, tipos, 5 pruebas y build al repetirse con red; el primer build falló exclusivamente por `ENOTFOUND fonts.googleapis.com` en el sandbox.

## 2026-10-13 — `2026-10-13-retirar-acceso-hero`

- Eliminado del hero el `ButtonLink` dirigido a `/login`; se conserva el enlace secundario a `/solicitar-informacion` y el acceso principal del `MarketingHeader`.

## 2026-10-13 — `2026-10-13-padding-lateral-publico`

- Actualizado el gutter global de `.page-shell` a `1.5rem` por defecto y `3rem` desde `768px`, manteniendo `max-width: 1200px`.

## 2026-10-13 — `2026-10-13-intercambio-cta-portada`

- `MarketingHeader` y el hero intercambian destinos y etiquetas: `/login` usa el CTA primario «Acceder» y `/solicitar-informacion` la acción secundaria «Quiero información».
- La navegación móvil expone «Acceder» como única acción principal.

## 2026-10-13 — `2026-10-13-inicio-login-izquierda`

- `AuthShell` alinea el enlace de retorno con `lg:justify-start`; el encabezado móvil mantiene la marca y el acceso separados con `justify-between`.
- La sección de autenticación usa `flex` con alineación superior en móvil y recupera el centrado mediante `lg:grid lg:place-items-center` en escritorio.

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
