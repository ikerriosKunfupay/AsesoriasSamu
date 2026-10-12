# Team Ortega

Portal privado de asesoramiento personal para que Samuel Ortega gestione interesados, clientes, cuestionarios, entrenamientos, nutrición, seguimientos y control manual de cuotas desde una sola aplicación.

## Stack

- Next.js 16 + React 19 + TypeScript
- Supabase (PostgreSQL y Auth)
- Despliegue compatible con Next.js; Vercel requiere un plan apto para uso comercial
- Proveedor SMTP propio (Brevo es la opción prevista) para los correos de autenticación
- Tailwind CSS 4 y sistema de diseño propio

## Desarrollo local

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

La aplicación puede compilarse sin credenciales, pero las operaciones de autenticación y persistencia requieren un proyecto Supabase configurado.

La migración inicial está en `supabase/migrations/202610120001_initial_schema.sql`. No apliques esta migración en un proyecto compartido: Team Ortega debe usar una organización y un proyecto exclusivos.

## Validación

```bash
pnpm check
```

## Documentación

- [Visión de producto](./docs/00-vision.md)
- [Arquitectura](./docs/02-arquitectura-vercel.md)
- [Documentación humana](./docs/humanos/README.md)
- [Documentación para IA](./docs/ia/README.md)
- [Sistema de diseño](./docs/12-design-system.md)

> Vercel Hobby es gratuito, pero sus condiciones lo limitan a uso personal no comercial. Consulta la decisión documentada en [Arquitectura](./docs/02-arquitectura-vercel.md) antes de publicar este portal profesional.
