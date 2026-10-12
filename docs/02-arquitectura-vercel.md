# Arquitectura y despliegue

## Componentes

```text
Navegador
   │
   ▼
Next.js 16 en Vercel
   ├── Server Components: lectura de datos
   ├── Server Actions: mutaciones validadas con Zod
   └── Proxy: refresco de la sesión, nunca autorización final
   │
   ▼
Supabase (proyecto exclusivo)
   ├── Auth: correo y contraseña, invitaciones y recuperación
   └── PostgreSQL: datos y políticas RLS

Proveedor SMTP → correos de Auth de Supabase
```

## Decisiones

- Next.js App Router y TypeScript para compartir tipos y validaciones.
- Supabase Auth sin registro público. Solo un administrador autenticado invita clientes.
- `SUPABASE_SERVICE_ROLE_KEY` se usa únicamente en el servidor y solo después de verificar el rol administrador.
- PostgreSQL aplica RLS; las redirecciones de la interfaz no se consideran autorización.
- Los planes se almacenan como texto con versión, estado y fecha de inicio.
- Las cuotas son apuntes manuales; no existe flujo de pago.

## Restricción de Vercel Hobby

El código está preparado para Vercel, pero el nivel Hobby está limitado por Vercel a uso personal no comercial. Team Ortega apoya una actividad profesional y la landing presenta un servicio, aunque la aplicación no cobre. Por ello, un despliegue de producción conforme requiere Vercel Pro o una autorización expresa de Vercel. No debe publicarse este proyecto comercial en Hobby. Referencias: [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) y [Hobby Plan](https://vercel.com/docs/plans/hobby).

Si el requisito absoluto es coste cero, hay que aprobar otro alojamiento que admita uso comercial gratuito antes de publicar. Este cambio no afecta a Supabase ni a la arquitectura de datos.

## Correo

El SMTP incluido por Supabase es solo para pruebas, restringe destinatarios y tiene un límite muy bajo. Antes de invitar clientes se debe conectar un SMTP propio con nivel gratuito (por ejemplo, Brevo) y verificar el remitente. No se guardan credenciales SMTP en el repositorio.

## Variables

| Variable | Exposición | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | pública | URL canónica y redirecciones de Auth |
| `NEXT_PUBLIC_SUPABASE_URL` | pública | endpoint del proyecto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pública | cliente Supabase protegido por RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | secreta | acciones administrativas del servidor |
| `EMAIL_FROM` | servidor | reserva para correo transaccional propio |

## Regiones y datos

Para usuarios en España, crea el proyecto Supabase en una región europea. Antes de producción, completa la información legal, el contrato de encargado y la política de conservación aplicable a datos de salud.
