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
| `assignment_templates` | plantillas reutilizables de entrenamiento y nutrición | ninguno |
| `workout_logs` | futuro registro de sesiones | lectura/inserción propia |
| `check_ins` | revisiones periódicas | lectura/inserción propia |
| `manual_fee_records` | control interno sin cobro | ninguno |
| `pricing_plans` | catálogo interno de tarifas, modalidad, días, duración y precio habitual | ninguno |
| `client_commercial_terms` | modalidad, tarifa y precio acordado por cliente | ninguno |
| `admin_dashboard_settings` | objetivos privados de ingresos y clientes del administrador | ninguno |
| `audit_events` | trazabilidad administrativa | ninguno |

## Roles

`handle_new_user()` crea siempre un perfil `client` e ignora cualquier rol recibido en metadatos, tanto en registros públicos como en invitaciones. La única excepción de bootstrap está en la Server Action de login: después de que Supabase autentique correctamente a la cuenta inicial designada, el cliente administrativo actualiza su fila concreta a `admin/active` solo si aún no tiene ese rol. Una cuenta ya provisionada como administradora no provoca otra escritura. La contraseña nunca interviene en esa consulta ni sale de Supabase. El formulario de registro solo recoge nombre, correo y contraseña; los datos de salud permanecen en el onboarding autenticado.

## RLS

La migración activa RLS en todas las tablas. `is_admin()` es `security definer`, usa `search_path = ''` y solo devuelve verdadero para perfil `admin` activo. Las políticas de cliente siempre comparan con `auth.uid()`.

`anon` no recibe permisos de tabla. Los leads se insertan mediante una Server Action con service role. El service role se reserva para administración validada y nunca se construye en un Client Component. Un usuario autenticado solo tiene `UPDATE` de columna sobre `full_name`, `phone` y `avatar_path` en su propia fila; no puede editar `role`, `status` ni `onboarding_complete` aunque actúe directamente contra la API. `updateAdminProfileAction` exige además `requireAdmin()` y deriva el UUID de la sesión.

Tarifas, condiciones comerciales y plantillas de planes solo admiten operaciones de administradores activos. Cada plantilla conserva `created_by = auth.uid()` en sus políticas, por lo que tampoco se comparte entre posibles administradores. Las acciones de edición y borrado repiten esa comprobación de propietario antes de mutar con service role. Los objetivos del resumen aplican el mismo aislamiento. Los importes son datos operativos internos: no incluyen tarjeta, cuenta bancaria ni credenciales de pago. Las auditorías de planes, plantillas y cuotas registran identificadores y tipo de cambio, pero nunca copian el contenido del plan ni la nota interna.

## Avatares

`profile-avatars` es un bucket privado con límite de 2 MB y MIME restringido a JPG, PNG o WebP. Cada objeto vive bajo el UUID de su propietario. Las políticas de `storage.objects` limitan inserción, sustitución y borrado al propietario autenticado, sea cliente o administrador; la lectura se permite al propietario y a cualquier administrador activo. La web no persiste URLs públicas: firma cada lectura durante una hora y conserva únicamente `profiles.avatar_path`. El distintivo visual **Cuenta verificada** no se persiste ni se puede editar: representa que la sesión ya superó `requireAdmin()` y tiene rol administrativo activo.

## Cambios sensibles de cuenta

Correo y contraseña no se modifican desde el formulario ordinario del perfil. El acceso al buzón actual se demuestra mediante un callback PKCE acompañado de una prueba HMAC con UUID, propósito, nonce y caducidad. La autorización temporal solo se conserva en una cookie `HttpOnly`; no se persiste en tablas ni se expone al JavaScript del navegador. El secreto usa `ACCOUNT_CHANGE_SECRET` si existe y, en su defecto, la `SUPABASE_SERVICE_ROLE_KEY`, siempre en servidor.

Después de verificar el correo anterior, el cambio de dirección usa `auth.admin.updateUserById()` para dejarla confirmada inmediatamente, tal como exige el flujo de producto. La acción vuelve a validar sesión, UUID, propósito y firma antes de usar la service role. El cambio de contraseña utiliza la sesión de recuperación emitida por Supabase y consume igualmente su autorización temporal.

## Datos de salud

Lesiones y alergias se almacenan únicamente en `onboarding_submissions`, detrás de autenticación y consentimiento explícito. No deben duplicarse en auditoría, telemetría ni mensajes de error. Analíticas y fotografías médicas no forman parte del MVP; la única imagen admitida es el avatar privado del perfil.

## Comprobaciones recomendadas

1. Cliente A no puede consultar perfil, planes, onboarding o check-ins de B.
2. Un cliente no puede insertar un plan ni leer cuotas.
3. Un usuario suspendido no llega al área privada.
4. Un registro o una invitación nunca puede crear un administrador.
5. El bundle del navegador no contiene la service role.
6. Un usuario no puede sustituir el avatar de otra cuenta; el administrador puede visualizar avatares mediante URL firmada y solo modificar el propio.
