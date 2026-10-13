# Runbook de Supabase

## Entorno desplegado

- Organización: `Team Ortega`.
- Proyecto: `team-ortega` (`grlntqiviyehnpibaijk`).
- Región: `eu-west-1` (Irlanda).
- Aplicación: `https://team-ortega.vercel.app`.
- Migración inicial aplicada y 11 tablas verificadas.
- Site URL: `https://team-ortega.vercel.app`.
- Redirect URLs: producción y desarrollo local configuradas según la sección siguiente.

No documentar aquí ni en Git las claves publishable, secret o service role.

## Crear y migrar

1. Usa una organización y un proyecto nuevos que no compartan recursos con otros productos.
2. Elige una región de la UE.
3. Ejecuta `supabase/migrations/202610120001_initial_schema.sql` en el SQL Editor.
4. Comprueba que todas las tablas muestran RLS activado.

## Administrador inicial

1. Crea un usuario desde Authentication > Users con el correo real del entrenador.
2. Copia su UUID después de verificar visualmente correo y usuario.
3. Ejecuta con el UUID literal:

```sql
update public.profiles
set role = 'admin', status = 'active', full_name = 'Samuel Ortega'
where id = '<UUID_VERIFICADO>';
```

4. Comprueba una única fila antes de cerrar el editor:

```sql
select id, full_name, role, status
from public.profiles
where id = '<UUID_VERIFICADO>';
```

## Auth y URLs

- Site URL: URL canónica del despliegue.
- Redirect URLs: añade `/auth/callback` para producción y `http://localhost:3000/auth/callback` en desarrollo.
- Mantén habilitado el registro por correo para que funcione `/registro`.
- Mantén correo + contraseña activo.

En el entorno desplegado, correo + contraseña está activo y la confirmación de correo está habilitada. El registro público debe permanecer activo; la aplicación fuerza el rol `client` mediante el trigger de base de datos.

## SMTP

Configura el SMTP propio en Authentication > Emails > SMTP Settings. Verifica dominio/remitente y desactiva el seguimiento de enlaces del proveedor para no modificar los enlaces de Auth. Prueba invitación y recuperación con una cuenta de prueba antes de usar correos de clientes.

El entorno desplegado usa Brevo Free mediante una clave SMTP exclusiva llamada `Team Ortega - Supabase`. Supabase guarda cifrada la credencial; no está en Git ni en Vercel. El remitente configurado ya estaba verificado en Brevo y el nombre visible es `Team Ortega`.

La plantilla **Confirm sign up** está personalizada en Supabase Auth. El asunto y el HTML reproducibles viven en `supabase/email-templates/confirm-sign-up.subject.txt` y `supabase/email-templates/confirm-sign-up.html`; el CTA y el enlace alternativo deben conservar `{{ .ConfirmationURL }}`. El emblema usa la variante ligera y compatible con correo `https://team-ortega.vercel.app/brand/team-ortega-email.png`, por lo que esa ruta pública no debe eliminarse sin actualizar antes la plantilla.

La clave está aislada de las credenciales de otros proyectos, pero el plan, el límite diario y la reputación de envío pertenecen a la cuenta compartida de Brevo. No edites ni reutilices los demás remitentes o claves de esa cuenta.

## Secretos

Solo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son públicas. `SUPABASE_SERVICE_ROLE_KEY` debe existir únicamente como variable cifrada del alojamiento y en `.env.local` ignorado durante desarrollo. La contraseña SMTP solo debe existir cifrada en Supabase y gestionarse desde Brevo; nunca debe copiarse al repositorio.
