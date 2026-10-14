# Runbook de Supabase

## Entorno desplegado

- Organización: `Team Ortega`.
- Proyecto: `team-ortega` (`grlntqiviyehnpibaijk`).
- Región: `eu-west-1` (Irlanda).
- Aplicación: `https://team-ortega.vercel.app`.
- Versión funcional de entrenamientos estructurados desplegada desde `main` en `93f530b`; Vercel informó `success` y las comprobaciones de `/` y `/login` devolvieron `200` el 14 de octubre de 2026.
- Migraciones `202610120001`–`202610140004` aplicadas y sincronizadas con el historial remoto; las tablas iniciales, `pricing_plans`, `client_commercial_terms`, `admin_dashboard_settings`, `assignment_templates`, `admin_notifications`, `workout_set_logs` y el bucket privado `profile-avatars` están verificados por su historial reproducible.
- `202610140001_pricing_plan_service_details.sql` añade modalidad y días a las plantillas; `202610140002_assignment_templates.sql` incorpora la biblioteca de planes; `202610140003_admin_notifications.sql` crea la bandeja administrativa; y `202610140004_structured_workouts.sql` añade `workout_assignments.plan_data` y el registro por serie. El 14 de octubre de 2026 se aplicaron en orden al proyecto enlazado y el historial local/remoto quedó sincronizado hasta `202610140004`.
- Site URL: `https://team-ortega.vercel.app`.
- Redirect URLs: producción y desarrollo local configuradas según la sección siguiente.

No documentar aquí ni en Git las claves publishable, secret o service role.

## Crear y migrar

1. Usa una organización y un proyecto nuevos que no compartan recursos con otros productos.
2. Elige una región de la UE.
3. Ejecuta `supabase/migrations/202610120001_initial_schema.sql` en el SQL Editor.
4. Ejecuta después, en orden, el resto de archivos de `supabase/migrations/` que todavía no estén aplicados. `202610130002_profile_settings.sql` añade la ruta de avatar, la edición limitada del perfil y el bucket privado `profile-avatars`.
5. Comprueba que todas las tablas muestran RLS activado y que el bucket de avatares permanece privado.

## Administrador inicial

La cuenta inicial designada está provisionada como `admin/active`. `loginAction` consulta primero el perfil y, si ya es administrador, no realiza ninguna actualización; el bootstrap con `service role` queda como recuperación para una identidad autenticada que todavía figure como cliente. Para una instalación distinta, cambia esa identidad en el código servidor antes del primer despliegue; no añadas el rol a metadatos del registro ni expongas una selección de rol en la interfaz.

Si fuera necesario recuperar manualmente el acceso, verifica primero la identidad y copia su UUID desde Authentication > Users. Después ejecuta con ese UUID literal:

```sql
update public.profiles
set role = 'admin', status = 'active', full_name = 'Samuel Ortega'
where id = '<UUID_VERIFICADO>';
```

Comprueba una única fila antes de cerrar el editor:

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

Si una persona no recibe la confirmación, debe usar `/reenviar-confirmacion` desde el acceso y esperar al menos 60 segundos entre solicitudes. No debe repetir el alta para forzar el envío: Supabase protege contra la enumeración de cuentas y un `signUp()` repetido puede aparentar éxito sin crear otra identidad ni reenviar el mensaje. Si tampoco llega el reenvío, revisa primero spam/promociones y después los registros SMTP de Brevo y Auth de Supabase.

Para separar una identidad existente de un fallo real del correo, revisa los eventos de Vercel: `auth.signup_existing_identity` significa que Supabase no creó usuario ni intentó un alta nueva; `auth.signup_created` confirma una identidad nueva y señala si se solicitó confirmación; `auth.signup_failed` conserva solo código y estado. Nunca se registra la dirección introducida.

## SMTP

Configura el SMTP propio en Authentication > Emails > SMTP Settings. Verifica dominio/remitente y desactiva el seguimiento de enlaces del proveedor para no modificar los enlaces de Auth. Prueba invitación y recuperación con una cuenta de prueba antes de usar correos de clientes.

El entorno desplegado usa Brevo Free mediante una clave SMTP exclusiva llamada `Team Ortega - Supabase`. Supabase guarda cifrada la credencial; no está en Git ni en Vercel. El remitente configurado ya estaba verificado en Brevo y el nombre visible es `Team Ortega`.

Las plantillas **Confirm sign up**, **Magic link or OTP** y **Reset password** están personalizadas en Supabase Auth. Sus asuntos y HTML reproducibles viven en `supabase/email-templates/` con los nombres `confirm-sign-up`, `magic-link` y `reset-password`; el CTA y el enlace alternativo deben conservar `{{ .ConfirmationURL }}`. El emblema usa la variante ligera y compatible con correo `https://team-ortega.vercel.app/brand/team-ortega-email.png`, por lo que esa ruta pública no debe eliminarse sin actualizar antes las tres plantillas.

La clave está aislada de las credenciales de otros proyectos, pero el plan, el límite diario y la reputación de envío pertenecen a la cuenta compartida de Brevo. No edites ni reutilices los demás remitentes o claves de esa cuenta.

## Secretos

Solo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son públicas. `SUPABASE_SERVICE_ROLE_KEY` debe existir únicamente como variable cifrada del alojamiento y en `.env.local` ignorado durante desarrollo. La contraseña SMTP solo debe existir cifrada en Supabase y gestionarse desde Brevo; nunca debe copiarse al repositorio.
