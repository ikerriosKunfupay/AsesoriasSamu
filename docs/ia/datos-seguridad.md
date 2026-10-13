# Datos y seguridad

## Tablas

| Tabla | Finalidad | Acceso cliente |
| --- | --- | --- |
| `profiles` | rol, estado, nombre, teléfono y ruta del avatar | lectura propia y edición limitada de datos básicos |
| `leads` | solicitudes públicas | ninguno |
| `client_invitations` | trazabilidad de altas | ninguno |
| `onboarding_submissions` | cuestionario inicial | lectura/escritura propia |
| `consent_acceptances` | evidencia de consentimiento | lectura e inserción propia |
| `workout_assignments` | planes de entrenamiento | lectura propia publicada |
| `nutrition_assignments` | pautas nutricionales | lectura propia publicada |
| `workout_logs` | futuro registro de sesiones | lectura/inserción propia |
| `check_ins` | revisiones periódicas | lectura/inserción propia |
| `manual_fee_records` | control interno sin cobro | ninguno |
| `audit_events` | trazabilidad administrativa | ninguno |

## Roles

`handle_new_user()` crea siempre un perfil `client` e ignora cualquier rol recibido en metadatos, tanto en registros públicos como en invitaciones. El primer administrador se promociona manualmente desde el SQL Editor después de comprobar su UUID. El formulario de registro solo recoge nombre, correo y contraseña; los datos de salud permanecen en el onboarding autenticado.

## RLS

La migración activa RLS en todas las tablas. `is_admin()` es `security definer`, usa `search_path = ''` y solo devuelve verdadero para perfil `admin` activo. Las políticas de cliente siempre comparan con `auth.uid()`.

`anon` no recibe permisos de tabla. Los leads se insertan mediante una Server Action con service role. El service role se reserva para administración validada y nunca se construye en un Client Component. El cliente solo tiene `UPDATE` de columna sobre `full_name`, `phone` y `avatar_path`; no puede editar `role`, `status` ni `onboarding_complete` aunque actúe directamente contra la API.

## Avatares

`profile-avatars` es un bucket privado con límite de 2 MB y MIME restringido a JPG, PNG o WebP. Cada objeto vive bajo el UUID de su propietario. Las políticas de `storage.objects` limitan inserción, sustitución y borrado al cliente propietario; la lectura se permite al propietario y al administrador. La web no persiste URLs públicas: firma cada lectura durante una hora y conserva únicamente `profiles.avatar_path`.

## Datos de salud

Lesiones y alergias se almacenan únicamente en `onboarding_submissions`, detrás de autenticación y consentimiento explícito. No deben duplicarse en auditoría, telemetría ni mensajes de error. Analíticas y fotografías médicas no forman parte del MVP; la única imagen admitida es el avatar privado del perfil.

## Comprobaciones recomendadas

1. Cliente A no puede consultar perfil, planes, onboarding o check-ins de B.
2. Un cliente no puede insertar un plan ni leer cuotas.
3. Un usuario suspendido no llega al área privada.
4. Un registro o una invitación nunca puede crear un administrador.
5. El bundle del navegador no contiene la service role.
6. Un cliente no puede leer ni sustituir el avatar de otro cliente; el administrador sí puede visualizarlo mediante URL firmada.
