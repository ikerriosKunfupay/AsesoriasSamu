# Arquitectura técnica

## Superficie pública

La capa pública comparte una composición editorial definida en `globals.css` mediante `public-page`, `public-dark`, `public-action`, `public-kicker`, `hero-mark` y `public-form`. La aplican la landing, captación, autenticación, privacidad y 404. Estas clases no sustituyen las primitivas de `src/components/ui/` ni cambian los dashboards: el lenguaje lineal y diagonal queda acotado a rutas públicas, mientras que las superficies operativas pueden seguir usando `Card`.

El formulario de captación y los formularios Auth conservan `Field`, `Input`, `Textarea` y `SubmitButton`; el contenedor `public-form` altera únicamente su presentación pública. Así se mantienen contratos, accesibilidad y Server Actions sin duplicar lógica.

## Render y sesiones

La aplicación usa App Router. `src/proxy.ts` refresca cookies de Supabase y no toma decisiones definitivas de autorización. `src/lib/auth/current-user.ts` es la capa de acceso autenticada: obtiene `auth.getUser()`, lee el perfil y retorna un DTO mínimo cacheado por petición.

Los layouts `/admin` y `/app` llaman respectivamente a `requireAdmin()` y `requireClient()` y están marcados como dinámicos. Las Server Actions vuelven a verificar el rol; no confían en la navegación.

`DashboardShell` mantiene el lateral de escritorio fijado a la altura visible para que `logoutAction` y el usuario no queden fuera del viewport en páginas largas. En móvil, la misma acción permanece en la navegación desplegable. El campo de contraseña del login usa el componente cliente reutilizable `PasswordInput`, con alternancia accesible entre contenido oculto y visible y `autocomplete="current-password"`.

La cabecera móvil de `DashboardShell` coloca el disparador de navegación a la izquierda y `BrandLogo` compacto a la derecha. El menú se ancla al borde izquierdo del disparador; el lateral de escritorio no cambia.

El layout de `/app` entrega `onboardingComplete` a `DashboardShell`. Mientras sea `false`, el shell intercepta en escritorio y móvil todos los enlaces del cliente salvo `/app/cuestionario` y muestra un diálogo accesible que explica el requisito. La protección no depende solo de la interfaz: `requireCompletedClient()` bloquea también el acceso directo a Inicio, Entrenamiento, Nutrición y Seguimiento, redirigiendo al cuestionario. `revalidatePath("/app", "layout")` actualiza el estado del layout después de `complete_onboarding()` y desbloquea la navegación.

`/registro` usa `registerAction` y `supabase.auth.signUp()` con confirmación por correo. Solo envía `full_name` como metadato y el trigger `handle_new_user()` fuerza siempre `role = client`; el callback conduce al cuestionario inicial. Cuando la acción devuelve éxito sin sesión, `RegistrationSuccessDialog` presenta una confirmación modal y ejecuta `router.replace("/login")` tras 2,5 segundos o al pulsar su CTA. Si el proyecto desactiva la confirmación de correo, una sesión creada durante el registro se redirige directamente al cuestionario y omite el modal.

## Clientes Supabase

- `client.ts`: navegador, clave pública.
- `server.ts`: SSR con cookies, clave pública.
- `admin.ts`: service role, solo servidor.
- `proxy.ts`: sincronización de sesión.

Las acciones públicas de leads usan service role porque `anon` no tiene acceso a `leads`. Antes de insertar aplican Zod, honeypot y un umbral temporal. El control de abuso distribuido queda pendiente para una fase posterior.

El formulario de leads compone `phone` en el cliente a partir del prefijo internacional y el número visible antes de enviarlo a la Server Action. El prefijo usa un listbox propio con cierre exterior y navegación por teclado, sin depender del desplegable nativo. `contactPreference` muestra únicamente WhatsApp y llamada mediante radios visibles integrados en una franja lineal. El esquema conserva `email` para poder interpretar registros históricos, pero la interfaz ya no lo envía; el contrato persistido y la tabla `leads` no cambian.

## Mutaciones

Todas las mutaciones reciben `FormData`, validan con Zod y devuelven `ActionState`. Las acciones administrativas llaman a `requireAdmin()` antes de crear el cliente service role. La finalización del onboarding usa la función SQL `complete_onboarding()` para impedir que un cliente actualice columnas de rol o estado de otro modo.

En el onboarding, `numeric-values.ts` comparte el saneamiento de escritura y la conversión autoritativa del servidor. `age` solo acepta dígitos y se convierte a entero; `weightKg` y `heightCm` admiten un único separador `,` o `.`, convierten la coma a punto y entregan números JavaScript al cliente de Supabase. PostgreSQL los conserva en sus columnas `numeric(5,2)`, por lo que no persiste dos representaciones textuales distintas. Zod mantiene los rangos 16–90, 35–300 kg y 120–230 cm y rechaza signos, exponentes, texto o varios separadores aunque se eluda la interfaz.

El sexo usa la primitiva cliente `InternalSelect`: un combobox/listbox con campo oculto para conservar el contrato `FormData`, selección por teclado, foco restaurado y cierre exterior. El resto del cuestionario agrupa las áreas narrativas en pares responsivos de igual altura; en móvil vuelve a una sola columna.

`Field` acepta opcionalmente un contrato `FieldHelpContent` y delega su interacción en `FieldHelp`. Esta primitiva cliente abre un diálogo modal etiquetado, cerrable mediante botón, fondo o Escape, y restaura el foco al disparador. `OnboardingForm` aporta contenido específico para rutina, entrenamiento, comidas, objetivos, limitaciones y alergias. La ayuda es puramente informativa: no modifica el `FormData`, la validación ni el esquema persistido, y en campos sanitarios refuerza la minimización de datos.

`SocialNetworksField` sustituye el texto libre de redes sociales por un bloque desplegable. Cada fila combina un `InternalSelect` controlado con icono, el prefijo canónico de la plataforma y un input limitado al nombre de usuario; admite añadir, eliminar y un máximo de ocho perfiles. `social-networks.ts` centraliza plataformas, saneamiento, serialización, validación y construcción de URLs. El valor se persiste como JSON mínimo `{ platform, username }[]` en la columna `social_networks text` ya existente, sin migración, y el administrador reconstruye enlaces únicamente desde la lista de plataformas permitidas.

## Planes

`workout_assignments` y `nutrition_assignments` comparten contrato: cliente, título, contenido, estado, versión, fecha de inicio y autor. El cliente solo puede leer filas propias con estado `published`. En el MVP se crea una fila nueva por revisión, preservando histórico.

## Build

La compilación usa `next build --webpack`. Turbopack necesita abrir procesos/puertos auxiliares en algunos entornos restringidos; Webpack produce el mismo artefacto Next.js y permite una validación reproducible. Las rutas privadas requieren variables únicamente en tiempo de ejecución y se marcan `force-dynamic`.

`src/app/layout.tsx` registra Archivo y DM Sans mediante `next/font/google` y expone `--font-team-display` y `--font-team-body`. Next descarga y autoaloja los archivos durante el build; `globals.css` consume esas variables con fallbacks de sistema para todas las rutas públicas y privadas.
