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
- Tailwind CSS 4 se procesa mediante `@tailwindcss/postcss`; `postcss.config.mjs` es obligatorio también cuando el build de producción usa Webpack.
- Supabase Auth sin registro público. Solo un administrador autenticado invita clientes.
- `SUPABASE_SERVICE_ROLE_KEY` se usa únicamente en el servidor y solo después de verificar el rol administrador.
- PostgreSQL aplica RLS; las redirecciones de la interfaz no se consideran autorización.
- Los planes se almacenan como texto con versión, estado y fecha de inicio.
- Las cuotas son apuntes manuales; no existe flujo de pago.

## Despliegue actual y restricción de Vercel Hobby

El proyecto está desplegado desde la rama `main` del repositorio `ikerriosKunfupay/AsesoriasSamu` en el proyecto Vercel `team-ortega`:

- URL pública: `https://team-ortega.vercel.app`.
- Plan: Hobby de la cuenta personal.
- Framework detectado: Next.js.
- Variables: las cuatro variables de Supabase están configuradas como sensibles para Production y Preview.

Vercel limita Hobby a uso personal no comercial. Team Ortega apoya una actividad profesional y la landing presenta un servicio, aunque la aplicación no cobre. El propietario decidió realizar este primer despliegue gratuito conociendo esa restricción; no debe interpretarse como validación de cumplimiento comercial. Antes de explotar el portal comercialmente hay que migrar a Vercel Pro, obtener autorización expresa de Vercel o elegir otro alojamiento compatible. Referencias: [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) y [Hobby Plan](https://vercel.com/docs/plans/hobby).

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
