# Arquitectura técnica

## Render y sesiones

La aplicación usa App Router. `src/proxy.ts` refresca cookies de Supabase y no toma decisiones definitivas de autorización. `src/lib/auth/current-user.ts` es la capa de acceso autenticada: obtiene `auth.getUser()`, lee el perfil y retorna un DTO mínimo cacheado por petición.

Los layouts `/admin` y `/app` llaman respectivamente a `requireAdmin()` y `requireClient()` y están marcados como dinámicos. Las Server Actions vuelven a verificar el rol; no confían en la navegación.

## Clientes Supabase

- `client.ts`: navegador, clave pública.
- `server.ts`: SSR con cookies, clave pública.
- `admin.ts`: service role, solo servidor.
- `proxy.ts`: sincronización de sesión.

Las acciones públicas de leads usan service role porque `anon` no tiene acceso a `leads`. Antes de insertar aplican Zod, honeypot y un umbral temporal. El control de abuso distribuido queda pendiente para una fase posterior.

## Mutaciones

Todas las mutaciones reciben `FormData`, validan con Zod y devuelven `ActionState`. Las acciones administrativas llaman a `requireAdmin()` antes de crear el cliente service role. La finalización del onboarding usa la función SQL `complete_onboarding()` para impedir que un cliente actualice columnas de rol o estado de otro modo.

## Planes

`workout_assignments` y `nutrition_assignments` comparten contrato: cliente, título, contenido, estado, versión, fecha de inicio y autor. El cliente solo puede leer filas propias con estado `published`. En el MVP se crea una fila nueva por revisión, preservando histórico.

## Build

La compilación usa `next build --webpack`. Turbopack necesita abrir procesos/puertos auxiliares en algunos entornos restringidos; Webpack produce el mismo artefacto Next.js y permite una validación reproducible. Las rutas privadas requieren variables únicamente en tiempo de ejecución y se marcan `force-dynamic`.
