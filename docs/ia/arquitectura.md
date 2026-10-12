# Arquitectura técnica

## Superficie pública

La capa pública comparte una composición editorial definida en `globals.css` mediante `public-page`, `public-dark`, `public-action`, `public-kicker`, `hero-mark` y `public-form`. La aplican la landing, captación, autenticación, privacidad y 404. Estas clases no sustituyen las primitivas de `src/components/ui/` ni cambian los dashboards: el lenguaje lineal y diagonal queda acotado a rutas públicas, mientras que las superficies operativas pueden seguir usando `Card`.

El formulario de captación y los formularios Auth conservan `Field`, `Input`, `Textarea` y `SubmitButton`; el contenedor `public-form` altera únicamente su presentación pública. Así se mantienen contratos, accesibilidad y Server Actions sin duplicar lógica.

## Render y sesiones

La aplicación usa App Router. `src/proxy.ts` refresca cookies de Supabase y no toma decisiones definitivas de autorización. `src/lib/auth/current-user.ts` es la capa de acceso autenticada: obtiene `auth.getUser()`, lee el perfil y retorna un DTO mínimo cacheado por petición.

Los layouts `/admin` y `/app` llaman respectivamente a `requireAdmin()` y `requireClient()` y están marcados como dinámicos. Las Server Actions vuelven a verificar el rol; no confían en la navegación.

## Clientes Supabase

- `client.ts`: navegador, clave pública.
- `server.ts`: SSR con cookies, clave pública.
- `admin.ts`: service role, solo servidor.
- `proxy.ts`: sincronización de sesión.

Las acciones públicas de leads usan service role porque `anon` no tiene acceso a `leads`. Antes de insertar aplican Zod, honeypot y un umbral temporal. El control de abuso distribuido queda pendiente para una fase posterior.

El formulario de leads compone `phone` en el cliente a partir del prefijo internacional y el número visible antes de enviarlo a la Server Action. El prefijo usa un listbox propio con cierre exterior y navegación por teclado, sin depender del desplegable nativo. `contactPreference` usa radios visibles integrados en una franja lineal; el contrato persistido y la tabla `leads` no cambian.

## Mutaciones

Todas las mutaciones reciben `FormData`, validan con Zod y devuelven `ActionState`. Las acciones administrativas llaman a `requireAdmin()` antes de crear el cliente service role. La finalización del onboarding usa la función SQL `complete_onboarding()` para impedir que un cliente actualice columnas de rol o estado de otro modo.

## Planes

`workout_assignments` y `nutrition_assignments` comparten contrato: cliente, título, contenido, estado, versión, fecha de inicio y autor. El cliente solo puede leer filas propias con estado `published`. En el MVP se crea una fila nueva por revisión, preservando histórico.

## Build

La compilación usa `next build --webpack`. Turbopack necesita abrir procesos/puertos auxiliares en algunos entornos restringidos; Webpack produce el mismo artefacto Next.js y permite una validación reproducible. Las rutas privadas requieren variables únicamente en tiempo de ejecución y se marcan `force-dynamic`.
