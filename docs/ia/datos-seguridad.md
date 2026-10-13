# Datos y seguridad

## Tablas

| Tabla | Finalidad | Acceso cliente |
| --- | --- | --- |
| `profiles` | rol, estado y nombre | solo su fila, lectura |
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

`anon` no recibe permisos de tabla. Los leads se insertan mediante una Server Action con service role. El service role se reserva para administración validada y nunca se construye en un Client Component.

## Datos de salud

Lesiones y alergias se almacenan únicamente en `onboarding_submissions`, detrás de autenticación y consentimiento explícito. No deben duplicarse en auditoría, telemetría ni mensajes de error. Analíticas y fotografías no forman parte del MVP.

## Comprobaciones recomendadas

1. Cliente A no puede consultar perfil, planes, onboarding o check-ins de B.
2. Un cliente no puede insertar un plan ni leer cuotas.
3. Un usuario suspendido no llega al área privada.
4. Un registro o una invitación nunca puede crear un administrador.
5. El bundle del navegador no contiene la service role.
