# Registro de cambios humano

## 2026-10-13 — `2026-10-13-smtp-brevo`

- Activado Brevo Free como proveedor de los correos de invitación y recuperación de Team Ortega.
- Creada una credencial separada para este proyecto sin modificar las configuraciones existentes de otros proyectos.
- Registrado que el plan gratuito comparte el límite de 300 correos diarios con los demás usos de la misma cuenta de Brevo.

## 2026-10-13 — `2026-10-13-css-produccion`

- Corregida la carga del sistema de diseño en Vercel para que la landing, el acceso y los paneles conserven sus colores, tamaños, espaciados y adaptación móvil.
- Repetidas las comprobaciones de calidad y compilación antes de volver a publicar.

## 2026-10-13 — `2026-10-13-despliegue-inicial`

- Creada la organización y la base de datos independientes de Team Ortega en Supabase Free, en región europea.
- Aplicada y comprobada la estructura inicial de datos con sus 11 tablas.
- Publicado el MVP desde el repositorio correcto en `https://team-ortega.vercel.app` mediante Vercel Hobby.
- Conectadas de forma protegida las variables de Supabase y configuradas las rutas de acceso y recuperación.
- Registrados los pendientes para poder invitar clientes reales: administrador inicial, cierre del registro público, SMTP y textos legales.

## 2026-10-12 — `2026-10-12-mvp-inicial`

- Creada la landing de Team Ortega y el formulario privado para interesados.
- Añadidos acceso por invitación, recuperación de contraseña y rutas separadas para entrenador y clientes.
- Creado el panel del entrenador para gestionar clientes, planes, seguimientos y cuotas manuales.
- Creada el área personal del cliente con cuestionario, entrenamiento, nutrición y revisiones.
- Incorporados el logo, los iconos de aplicación y un sistema de diseño reutilizable.
- Preparada la base de datos Supabase con permisos que aíslan los datos de cada cliente.
- Añadidas guías de puesta en marcha, privacidad y la restricción comercial de Vercel Hobby.
