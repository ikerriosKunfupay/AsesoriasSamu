# Registro de cambios técnico

## 2026-10-13 — `2026-10-13-visibilidad-cuestionarios-admin`

- Los logs de producción mostraron un `POST /app/cuestionario` y ningún `POST /solicitar-informacion`: el envío actual era onboarding, mientras el resumen solo consultaba `leads`.
- `AdminDashboardPage` separa conteos y listados de `profiles`, `onboarding_submissions` y `leads`; los cuestionarios recientes solo muestran nombre, fecha y estado, sin duplicar respuestas sanitarias en el resumen.
- `parseHeightCentimeters()` normaliza alturas en metros o centímetros a la columna canónica `height_cm`, manteniendo el rango persistido 120–230.
- `saveOnboardingAction` comprueba y diferencia fallos de formulario, consentimiento y activación, emite observabilidad sin PII y revalida `/app`, `/admin` y `/admin/clientes` tras el éxito.
- `pnpm check` superó lint, tipos, 65 pruebas y build Webpack.

## 2026-10-13 — `2026-10-13-recuperacion-login-despliegue`

- Los logs de Vercel localizaron un `POST /login` con estado `409` y `Failed to find Server Action`, originado por un cliente de un despliegue anterior; no fue un rechazo de Supabase ni un error del perfil.
- `next.config.ts` configura `deploymentId` a partir de `VERCEL_DEPLOYMENT_ID`, elimina el prefijo reservado, sanea caracteres y limita el valor a 32 posiciones para activar la identificación de versión en Next.js 16.
- Añadido `src/app/login/error.tsx` como límite de error específico y recuperación mediante recarga completa. No se persisten credenciales ni se cambia el contrato de autenticación.
- `pnpm check` superó lint, tipos, 61 pruebas y build Webpack; un segundo build con un `VERCEL_DEPLOYMENT_ID` sintético verificó el valor saneado en `.next/routes-manifest.json` y `data-dpl-id`/`?dpl=` en los artefactos.

## 2026-10-13 — `2026-10-13-diagnostico-registro-existente`

- `registerAction` detecta la identidad ofuscada de Supabase mediante `user.identities?.length === 0` y deja de devolver éxito para correos existentes.
- Añadidos mensajes diferenciados para límite `429` y fallo real del alta, además de observabilidad sin PII mediante eventos estructurados de creación, duplicado y error.
- Los registros de Vercel mostraron tres `POST /registro` con estado 200 mientras la consulta administrativa seguía sin perfiles cliente; esto es coherente con intentos sobre una identidad Auth ya existente.
- Añadidas pruebas de regresión para una identidad ofuscada y un alta nueva con confirmación solicitada.
- `pnpm check` superó lint, tipos, 61 pruebas y build Webpack.

## 2026-10-13 — `2026-10-13-reenvio-confirmacion-registro`

- Añadidos `/reenviar-confirmacion`, `ResendConfirmationForm` y `resendConfirmationAction` sobre `auth.resend({ type: "signup" })`, reutilizando el callback del registro.
- La acción mantiene una respuesta genérica para impedir enumeración de cuentas y presenta un mensaje específico para el límite `429`/`over_email_send_rate_limit`.
- Incorporadas pruebas para el reenvío correcto, el intervalo mínimo, los fallos del proveedor y la validación previa del correo.
- `pnpm check` superó lint, tipos, 59 pruebas y build Webpack.

## 2026-10-13 — `2026-10-13-rendimiento-panel`

- Añadido `vercel.json` con `regions: ["dub1"]` para alinear el runtime de Next.js con Supabase `eu-west-1`; la medición previa mostró `x-vercel-id: cdg1::iad1`.
- Sustituidos los dos `auth.getUser()` del proxy y la DAL por `auth.getClaims()`. El proyecto firma con ES256, por lo que la verificación puede usar JWKS cacheadas sin la petición Auth que `getUser()` siempre realiza.
- Reducido el matcher del proxy a Auth y áreas privadas; la landing, privacidad y captación ya no refrescan sesiones innecesariamente.
- Añadido `src/app/admin/loading.tsx` y restringida la consulta de Interesados a sus columnas visibles y 100 filas recientes.
- `pnpm check` superó lint, tipos, 55 pruebas y build Webpack.

## 2026-10-13 — `2026-10-13-trazabilidad-solicitudes`

- `createLeadAction` usa `insert().select("id").single()` y no devuelve éxito sin la representación de la fila creada.
- Añadidas invalidaciones de `/admin` y `/admin/interesados`, render dinámico explícito de la lista y una referencia compartida derivada del UUID.
- La tabla administrativa muestra la referencia junto a cada solicitud y una prueba unitaria cubre su formato estable.
- `pnpm check` superó lint, tipos, 55 pruebas y build.

## 2026-10-13 — `2026-10-13-orden-interesados-clientes`

- Reordenado `adminItems` en `DashboardShell` para situar `/admin/interesados` antes de `/admin/clientes` tanto en escritorio como en móvil.
- Documentada la separación entre `leads` y los perfiles con rol `client`; no se altera el modelo de datos ni se requiere migración.
- La consulta de solo lectura en producción devolvió vacías ambas vistas, por lo que el registro anterior de Iker no puede recuperarse desde la base actual.
- `pnpm check` superó lint, tipos, 54 pruebas y build.

## 2026-10-13 — `2026-10-13-alta-admin-inicial`

- Provisionada en Supabase Auth la identidad inicial y actualizada exactamente una fila de `profiles` a `admin/active`.
- `loginAction` consulta el perfil antes del bootstrap y solo usa la `service role` cuando la identidad designada todavía no tiene rol administrador.
- Añadidas pruebas unitarias para la promoción inicial y para evitar escrituras redundantes en administradores existentes; `pnpm check` superó lint, tipos, 54 pruebas y build.

## 2026-10-13 — `2026-10-13-minimo-contrasena-ocho`

- Centralizado el mínimo de contraseña en `PASSWORD_MIN_LENGTH = 8` y reutilizado en los esquemas Zod, atributos `minLength` y mensajes de interfaz.
- Aplicada la política común al login, registro, alta/recuperación y cambio de contraseña desde Ajustes.
- Ampliadas las pruebas de esquemas con los límites de 8 caracteres aceptados y 7 rechazados; `pnpm check` superó lint, tipos, 52 pruebas y build.

## 2026-10-13 — `2026-10-13-ajustes-prefijo-avisos`

- Extraído `PhonePrefixSelect` de `LeadForm` como listbox reutilizable, con IDs internos únicos, navegación por teclado y helpers para separar y recomponer teléfonos persistidos.
- `ProfileSettingsForm` conserva prefijo y número como estados separados, envía el valor canónico mediante `phone` oculto y reutiliza el control propio dentro del borde redondeado del campo.
- `FormMessage` incorpora cierre manual y temporizador de cinco segundos para éxitos, identificando el objeto de estado descartado para que una respuesta posterior pueda volver a mostrarse.
- Añadidas pruebas de apertura/selección, normalización de teléfono y cierre temporizado/manual; `pnpm check` superó lint, tipos, 50 pruebas y build.

## 2026-10-13 — `2026-10-13-plantillas-correos-seguridad`

- Versionados asunto y HTML de **Magic link or OTP** y **Reset password** en `supabase/email-templates/`.
- Ambas plantillas comparten estructura compatible con clientes de correo, estilos inline, el PNG público de marca y `{{ .ConfirmationURL }}` como CTA y enlace alternativo.
- Publicadas y verificadas las dos plantillas en Supabase Auth; la URL pública del logo respondió `200 image/png`.

## 2026-10-13 — `2026-10-13-seguridad-cuenta-y-admin`

- `ProfileAvatar` incorpora visor modal, cierre por botón/fondo/Escape y restauración del foco; `updateProfileAction` permite anular `avatar_path` y retirar el objeto privado.
- Añadidos `account-security.ts`, dos rutas modales de Ajustes y tokens HMAC de diez minutos ligados a usuario/propósito; el callback PKCE solo emite cookies `HttpOnly` tras validar firma, usuario y destino.
- Separada la edición ordinaria del perfil de correo y contraseña. El correo se confirma de inmediato con `auth.admin.updateUserById()` tras verificar el buzón anterior, y la contraseña usa la sesión de recuperación de Supabase.
- `loginAction` promociona a `admin/active` únicamente la cuenta inicial designada después de una autenticación correcta; el resto del control continúa dependiendo de `profiles.role` y del trigger que crea clientes.
- Añadidas pruebas de manipulación/caducidad del token y del visor de avatar. `pnpm check` superó lint, tipos, 46 pruebas y build; no se requiere migración.

## 2026-10-13 — `2026-10-13-ajustes-perfil-cliente`

- Añadidos `/app/ajustes`, `ProfileSettingsForm`, `updateProfileAction`, la entrada de navegación y la visualización de datos básicos en la ficha administrativa.
- Incorporada la migración `202610130002_profile_settings.sql`: `profiles.avatar_path`, edición propia limitada por columnas y bucket privado `profile-avatars` con políticas por propietario.
- Los avatares se validan a 2 MB y MIME JPG/PNG/WebP, se sirven con URL firmada de una hora y reutilizan `ProfileAvatar` con iniciales de respaldo.
- Ampliadas las pruebas de esquemas y presentación del avatar; 43 pruebas, lint, tipos y build terminaron correctamente.
- Aplicada la migración en `team-ortega` y verificados `avatar_path`, el bucket privado de 2 MB y sus cuatro políticas de objetos.

## 2026-10-13 — `2026-10-13-consentimiento-cuestionario-toast`

- Extraído `FormErrorToast` como componente reutilizable y aplicado al onboarding con `noValidate` y un `messageId` nuevo por error de la Server Action.
- Añadidos `HealthConsentField` con asociación ARIA y estado visual rojo, y `DismissibleNotice` para cerrar localmente el recordatorio sanitario.
- Incorporadas pruebas de cierre y reaparición del toast, estado inválido del consentimiento y cierre del aviso; `pnpm check` superó lint, tipos, 39 pruebas y build.

## 2026-10-13 — `2026-10-13-refinado-redes-sociales`

- Retirado el párrafo descriptivo y su referencia ARIA de `SocialNetworksField`.
- Aplicado `--radius-lg` al contenedor, resumen y panel abierto sin alterar controles ni persistencia.

## 2026-10-13 — `2026-10-13-selector-redes-sociales`

- Añadidos `SocialNetworksField` y `social-networks.ts` para editar, sanear, serializar y reconstruir hasta ocho perfiles permitidos.
- `InternalSelect` admite ahora modo controlado e iconos sin alterar su uso previo con campo oculto.
- El onboarding valida JSON canónico y continúa usando `social_networks text`, sin migración; la ficha administrativa genera los enlaces desde prefijos internos permitidos.
- Incorporadas pruebas de interacción, serialización, saneamiento, URLs y rechazo de valores manipulados.

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
