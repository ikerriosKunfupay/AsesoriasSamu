# Registro de cambios técnico

## 2026-10-14 — `2026-10-14-catalogo-ejercicios-excel`

- `202610140005_exercise_catalog.sql` crea `exercise_catalog`, su índice, trigger, RLS administrativa y una carga idempotente de 339 registros extraídos de `EXERCISE DATA BASE`; los nombres duplicados se conservan como filas independientes por su origen y claves distintas.
- `WorkoutPlanBuilder` recibe el catálogo ordenado, encadena dos `SearchableSelect` accesibles y copia `catalogExerciseId`, grupo, nombre, enlace y claves al documento. Los valores por defecto mantienen compatibles los planes históricos.
- `/admin/entrenamientos/ejercicios`, `ExerciseCatalogManager` y las Server Actions autorizadas implementan búsqueda, filtro y CRUD; la auditoría omite las claves y los planes almacenan una instantánea sin clave foránea.
- La vista previa y el área cliente enlazan la demostración técnica cuando existe. Las pruebas cubren búsqueda sin tildes, teclado, filtro muscular y autocompletado.
- El ensayo remoto propuso únicamente `202610140005_exercise_catalog.sql`; se aplicó en el proyecto enlazado y `supabase migration list --linked` confirmó paridad local/remota hasta `202610140005`.
- `impeccable detect`, `pnpm lint`, `pnpm typecheck`, 149 pruebas, `pnpm build` y `git diff --check` finalizaron correctamente.

## 2026-10-14 — `2026-10-14-entrenamientos-centralizados-y-demo`

- `/admin/entrenamientos` carga y valida `plan_data`, limita el selector a clientes activos y entrega un documento inicial a `AssignmentsManager`; la ficha `/admin/clientes/[id]` retira el constructor y conserva el histórico reciente con enlace al editor central.
- `AssignmentsManager` usa `WorkoutPlanBuilder` a ancho completo para crear entrenamientos estructurados, `WorkoutPlanPreview` para inspeccionarlos y el mismo constructor para editarlos. Las asignaciones históricas sin `plan_data` mantienen el editor de texto compatible.
- `structuredWorkoutUpdateSchema` y `updateWorkoutPlanAction` validan cliente, asignación y documento completo, revalidan las rutas afectadas y auditan solo identificadores y conteos.
- No hay migración nueva. Se verificó en producción que los cinco perfiles ficticios cuentan con planes estructurados poblados, sin inventar cuestionarios ni datos sanitarios.
- `impeccable detect --scope layout`, `pnpm lint`, `pnpm typecheck`, 144 pruebas, `pnpm build` y `git diff --check` finalizaron correctamente.

## 2026-10-14 — `2026-10-14-entrenamientos-estructurados`

- `workout_assignments.plan_data` almacena un documento JSON versionado y validado con Zod; `content` conserva un resumen para compatibilidad con planes históricos.
- `WorkoutPlanBuilder` modela bloque, 16 semanas, 8 sesiones por semana, 20 ejercicios por sesión y hasta 5 series, con duplicado seguro que regenera UUID de semana, sesión y ejercicio.
- `WorkoutPlanView` ofrece resumen y registro responsive por serie; `workoutPlanStats` calcula conteos, RIR objetivo medio y distribución muscular sin replicar las fórmulas rotas del Excel.
- `202610140004_structured_workouts.sql` crea `workout_set_logs`, restricciones, índice, trigger, privilegios y RLS explícita; la escritura cliente exige una asignación propia publicada.
- `saveWorkoutPlanAction` autoriza al administrador y verifica el perfil cliente; `saveWorkoutSetLogsAction` autoriza al cliente, vuelve a leer el plan publicado y valida pertenencia y límites antes de cada escritura. La auditoría omite contenido libre.
- Se conserva `PlanView` para filas antiguas sin `plan_data`; `DashboardShell` contiene el ancho del contenido denso en tablet.
- `impeccable detect` no devolvió hallazgos. Tras integrar los 14 commits remotos, `pnpm lint`, `pnpm typecheck`, 143 pruebas, `pnpm build` y `git diff --check` finalizaron correctamente; la revisión visual previa cubrió 375×667, 390×844, 768×1024 y escritorio sin overflow y con controles táctiles de al menos 44 px.
- El ensayo de `supabase db push --linked --dry-run` propuso únicamente `202610140004_structured_workouts.sql`; la ejecución posterior la aplicó al proyecto `grlntqiviyehnpibaijk` y `supabase migration list --linked` confirmó paridad local/remota hasta `202610140004` antes del despliegue desde `main`.
- GitHub y Vercel marcaron `93f530b` como desplegado correctamente; las comprobaciones HTTP posteriores devolvieron `200` para `/` y `/login` en `https://team-ortega.vercel.app`.

## 2026-10-14 — `2026-10-14-centro-notificaciones`

- `202610140003_admin_notifications.sql` crea una bandeja por administrador, claves de evento únicas, índices de actividad reciente/no leída y triggers para leads, perfiles cliente, onboarding, check-ins y registros de entrenamiento.
- RLS limita la lectura y `UPDATE(read_at)` al administrador destinatario; los triggers solo proyectan nombre, tipo, destino y fecha y no copian respuestas sanitarias ni texto libre.
- `/api/admin/notifications` ofrece una lectura acotada a treinta avisos y marcado individual o global; `NotificationCenter` carga después de pintar, sondea cada minuto solo con la pestaña visible y actualiza el contador de forma optimista.
- `DashboardShell` renderiza una sola instancia responsiva de la campana para evitar peticiones duplicadas. La migración se validó en seco y se aplicó correctamente al proyecto remoto de Supabase.
- `pnpm lint`, `pnpm typecheck`, 139 pruebas, `pnpm build` y `git diff --check` terminaron correctamente.

## 2026-10-14 — `2026-10-14-biblioteca-plantillas-y-rendimiento`

- `AssignmentTemplatesManager` añade un diálogo por tipo con listado, editor y confirmación de borrado. Los nuevos esquemas y Server Actions restringen UUID, `kind` y `created_by`, revalidan la ruta correspondiente y auditan únicamente identificador y tipo.
- `AssignmentFiltersPanel` cambia su cuadrícula a `auto-fit`; el `colgroup` de la tabla reserva un 20 % a acciones y el badge de estado queda contenido dentro de su celda.
- `DashboardAnalytics` retira el selector de granularidad y usa `inferAnalyticsGranularity()` para derivarla del preset o de la duración personalizada, conservando un solo control temporal visible.
- `/admin/clientes` ejecuta perfiles, notas, condiciones y tarifas en una única tanda paralela con columnas mínimas. El resumen reutiliza los perfiles ya leídos para resolver nombres y Seguimientos consulta registros y perfiles en paralelo.
- `pnpm lint`, `pnpm typecheck`, 138 pruebas, `pnpm build` y `git diff --check` terminaron correctamente.

## 2026-10-14 — `2026-10-14-gestion-operativa-y-vistas`

- `ContextHelp` añade tooltips accesibles por hover, foco o pulsación a objetivos y gráficas. `DashboardAnalytics` separa rango y granularidad, resuelve presets y fechas personalizadas con un máximo móvil de 365 días y aplica el mismo conjunto de periodos a KPI, desgloses y series.
- `DashboardShell` convierte Asesorías y Pagos en acordeones persistidos mediante `team-ortega:sidebar-groups`, compartidos entre escritorio y móvil y conscientes de la ruta activa.
- `AssignmentsManager` incorpora filtros independientes, orden estable `asc/desc/null`, paginación, lectura de contenido, edición, eliminación y las vistas persistentes tabla/lista/galería; `AssignmentForm` usa `InternalDatePicker` y puede aplicar o guardar plantillas.
- `202610140002_assignment_templates.sql` crea `assignment_templates` con RLS administrativa y actualiza el índice de variantes de tarifa para aceptar `days_per_week IS NULL`; los tipos y Server Actions cubren CRUD y auditoría sin contenido libre.
- `supabase db push --linked` aplicó `202610140002` y una segunda lectura de `migration list --linked` confirmó paridad de las ocho migraciones.
- `FeesManager` separa cliente y nota, ordena todas las columnas, usa las tres vistas y expone `FeeNoteInput` con autoguardado; `saveFeeNoteAction` no incorpora la nota a auditoría. La cabecera de Cuotas deja de mostrar la descripción retirada.
- `DataViewToggle` unifica Tabla/Lista/Galería y persiste una clave por Clientes, Interesados, Entrenamientos, Nutrición y Cuotas; Tarifas conserva su selector equivalente existente.
- `ProfileSettingsForm` elimina el `BadgeCheck` duplicado de su variante administrativa; el estado verificado continúa representándose en `PageHeading` y `DashboardShell`.
- `DashboardKpis` reserva las cinco columnas para `2xl`, usa tres en `xl` y fuerza `min-width: 0`, recorte y corte de palabra en cada tarjeta para soportar zoom y viewports intermedios.
- La consulta analítica continúa siendo una única lectura acotada a doce meses, sobre el índice de `manual_fee_records.period` y con solo las columnas representadas; cambiar filtros no genera nuevas peticiones.
- `pnpm lint`, `pnpm typecheck`, 135 pruebas, `pnpm build` y `git diff --check` terminaron correctamente.

## 2026-10-14 — `2026-10-14-perfil-admin-y-ajustes-resumen`

- Añadida `/admin/perfil` detrás de `requireAdmin()`, con `ProfileSettingsForm` en variante administrativa y `updateAdminProfileAction` compartiendo la actualización propia sin aceptar UUID externos.
- `AdminLayout` firma durante una hora el avatar privado y `DashboardShell` enlaza la identidad administrativa en escritorio y móvil, muestra `BadgeCheck`, evita controles interactivos anidados y marca el perfil activo con `aria-current`.
- El distintivo verificado se deriva del rol administrativo autorizado; no se añade ningún campo mutable ni migración. Las políticas existentes limitan avatar y columnas básicas a la cuenta propietaria.
- `DashboardGoalsForm` reutiliza los saneadores numéricos para texto decimal y entero; `dashboardGoalsSchema` mantiene la validación autoritativa y rechaza signos o símbolos si se elude el navegador.
- Eliminado el párrafo auxiliar al pie de `DashboardAnalytics` sin modificar sus datos ni cálculos.
- `pnpm lint`, `pnpm typecheck`, 117 pruebas, `pnpm build` y `git diff --check` terminaron correctamente.

## 2026-10-14 — `2026-10-14-sidebar-y-creacion-de-planes`

- `DashboardShell` sustituye la lista plana del administrador por grupos compartidos entre navegación de escritorio y móvil, conservando el cálculo activo y las guardas existentes.
- `AssignmentsManager` unifica Entrenamientos y Nutrición con switch de creación, formulario lateral, tabla responsiva y paginación de diez filas; `SectionFormSwitch` se extrae y también se reutiliza en Cuotas.
- `AssignmentForm` admite cliente fijo o seleccionable, usa `InternalSelect` para cliente/estado y mantiene el mismo contrato `FormData`; `saveAssignmentAction` revalida además la sección administrativa correspondiente.
- Las páginas consultan planes y perfiles en paralelo, conservan los nombres de clientes archivados en el histórico y excluyen esas cuentas del selector de nuevas asignaciones.
- No hay migraciones ni cambios de permisos. `pnpm lint`, `pnpm typecheck`, 113 pruebas, `pnpm build` y `git diff --check` terminaron correctamente.

## 2026-10-14 — `2026-10-14-cuotas-filtrables-y-editables`

- `FeesManager` incorpora switch de formulario, filtros plegables, paginación cliente de diez elementos y modales accesibles de edición y borrado.
- `fees.ts` define el DTO y el filtrado normalizado; `.fees-table` elimina el ancho mínimo y cambia a tarjetas móviles sin `overflow-x`.
- `FeeForm` comparte creación/edición, usa desplegables internos, admite variante compacta y elimina el texto auxiliar repetido.
- `feeUpdateSchema`, `feeDeleteSchema`, `updateFeeAction` y `deleteFeeAction` validan y mutan por UUID; las acciones exigen administrador, revalidan `/admin` y `/admin/cuotas` y auditan sin contenido libre ni importes.
- No hay migración: `manual_fee_records` ya tiene RLS administrativa y `service_role` dispone de `update` y `delete`.
- `pnpm lint`, `pnpm typecheck`, 110 pruebas, `pnpm build` y `git diff --check` terminaron correctamente.

## 2026-10-14 — `2026-10-14-notas-sin-aviso-administrativo`

- `ClientAdminNotesForm` elimina el párrafo auxiliar de privacidad en su variante completa y simplifica `aria-describedby` para apuntar solo a la región viva de autoguardado.
- La persistencia, el debounce y el estado textual de guardado permanecen sin cambios; una prueba cubre la ausencia del aviso y la asociación accesible restante.
- La primera ejecución dirigida falló al fijar un `useId()` concreto; la prueba se corrigió para comparar el `aria-describedby` con el ID generado por la región de estado.
- `pnpm lint`, `pnpm typecheck`, 104 pruebas, `pnpm build` y `git diff --check` terminaron correctamente.

## 2026-10-14 — `2026-10-14-migracion-detalles-tarifas`

- `supabase db push --linked` aplicó `202610140001_pricing_plan_service_details.sql` al proyecto enlazado de Team Ortega.
- La comprobación posterior con `supabase migration list --linked` devolvió `202610120001`–`202610140001` sincronizadas en local y remoto.

## 2026-10-14 — `2026-10-14-invitacion-centrada`

- `/admin/clientes/nuevo` envuelve `PageHeading` y `Card` en `mx-auto w-full max-w-3xl`, sin modificar `InviteClientForm` ni su Server Action.
- Una prueba de página fija el centrado conjunto y la presencia del formulario.
- `pnpm check` superó lint, tipos, 103 pruebas y el build Webpack; `git diff --check` no detectó errores.

## 2026-10-14 — `2026-10-14-periodos-y-control-cuotas`

- `AnalyticsFilters` sustituye el número de meses por `granularity: day | week | month`; `buildDashboardAnalytics()` genera 14 días, 12 semanas ISO o 12 meses y prorratea cartera y objetivo mensual mediante equivalencia anual.
- `AnalyticsFee` incorpora `updatedAt`: el mes conserva `period` como fuente contable, mientras que día y semana agrupan la última actualización manual en la zona `Europe/Madrid`.
- `DashboardAnalytics` adapta etiquetas, desgloses, previsión, series, progreso y distribución por tarifa a la granularidad; la consulta administrativa entrega `updated_at` y una fecha de referencia local.
- El modal mensual de pendientes combina cuotas `pending` con clientes activos sin registro, sin sumar estos últimos al importe mientras no exista una cuota persistida.
- La primera ejecución dirigida falló por una coincidencia de texto deliberadamente repetida entre descripción y fila; se restringió la expectativa y las siete pruebas específicas más `pnpm typecheck` finalizaron correctamente.
- `pnpm check` superó lint, tipos, 103 pruebas y el build Webpack; `git diff --check` no detectó errores.

## 2026-10-14 — `2026-10-14-resumen-sin-descripcion-asesorias`

- `DashboardAnalytics` retira el párrafo auxiliar de la cabecera de negocio sin modificar el `aria-labelledby`, el estado de los filtros ni los cálculos.
- `pnpm lint`, `pnpm typecheck`, las tres pruebas de `dashboard-analytics.test.tsx` y `git diff --check` terminaron correctamente.

## 2026-10-14 — `2026-10-14-cuestionario-estructurado`

- `OnboardingForm` incorpora secciones semánticas etiquetadas mediante `aria-labelledby`, con encabezado, descripción y numeración visual compartidos.
- El bloque físico usa `sm:grid-cols-2`; la ayuda de altura se extrae de la celda individual, conserva `heightCm-help` y se combina con el error mediante `aria-describedby` cuando corresponde.
- Rutina, alimentación, salud, redes y consentimiento mantienen sus contratos `FormData`, validación y persistencia, pero quedan agrupados por propósito sin cambios de base de datos.
- La primera prueba dirigida falló al incluir el asterisco con `aria-hidden` en el nombre accesible esperado; se ajustó la consulta a la semántica real del control.
- `pnpm check` superó lint, tipos, 100 pruebas y el build Webpack; `git diff --check` no detectó errores.

## 2026-10-14 — `2026-10-14-solicitud-sin-scroll-escritorio`

- `/solicitar-informacion` usa `h-dvh`, `min-h-0` y `overflow-hidden` únicamente desde `lg`; la columna del formulario centra verticalmente el contenido y reduce separaciones sin afectar al contrato de `LeadForm`.
- `lead-page__form` compacta el `gap` y limita el alto del `textarea` en escritorio; por debajo de `lg` se mantiene el flujo vertical desplazable.
- La prueba de página fija la regresión responsiva y la medición del navegador devolvió `documentScrollHeight = innerHeight = 724` a `1470 px` de ancho.
- `pnpm check` superó lint, tipos, 100 pruebas y el build Webpack; `git diff --check` no detectó errores.

## 2026-10-14 — `2026-10-14-variantes-y-vistas-tarifas`

- `202610140001_pricing_plan_service_details.sql` añade `service_modality` y `days_per_week` a `pricing_plans` y sustituye la unicidad por nombre por una variante compuesta.
- `PricingPlanForm` exige modalidad y entre uno y siete días, usa `InternalSelect` para las opciones y sanea los importes en la escritura; las Server Actions persisten esos campos y heredan la modalidad al asignar una plantilla.
- `PricingPlansCatalog` ofrece tabla, lista y galería persistidas en `localStorage`, con un editor modal compartido para evitar duplicar formularios.
- La primera prueba dirigida del catálogo falló por buscar como nodo aislado un texto compuesto; se ajustó a contenido accesible y `pnpm check` terminó con lint, tipos, 98 pruebas y build Webpack correctos.
- El servidor local arrancó tras autorizar el puerto, pero `/admin/tarifas` devolvió `500` por ausencia explícita de variables públicas y privadas de Supabase en el checkout temporal; no se simuló una sesión. La migración remota se aplicó después y queda registrada en `2026-10-14-migracion-detalles-tarifas`.

## 2026-10-14 — `2026-10-14-navegacion-activa-panel`

- `DashboardShell` deriva el enlace activo desde `usePathname()`, exige coincidencia exacta para `/admin` y admite descendientes para el resto de secciones.
- La navegación de escritorio y móvil comparte el mismo criterio, expone `aria-current="page"` y aplica tokens de superficie propios de cada contexto.
- `pnpm check` superó lint, tipos, 95 pruebas y build Webpack; `git diff --check` no detectó errores.

## 2026-10-14 — `2026-10-14-clientes-movil-y-menus-flotantes`

- `InternalSelect` admite `menuPortal`, calcula posición fija respecto al disparador y se actualiza con scroll o resize sin perder cierre exterior ni navegación de opciones.
- `QuickCommercialSelect` usa el portal, anchuras responsivas y padding derecho explícito; `ClientRowActions` sustituye `details` por un menú accesible flotante con cierre exterior y por `Escape`.
- `.clients-table` convierte las celdas existentes en tarjetas móviles mediante CSS, sin duplicar formularios, acciones ni IDs; `ClientAdminNotesForm` oculta el estado compacto y conserva el autosave mediante región viva.
- `lib/forms/phone.ts` extrae las utilidades telefónicas del componente cliente; `formatStoredPhoneValue()` permite que la ficha servidor muestre prefijo y aplique `+34` a datos nacionales heredados.
- `ClientCommercialTermsForm` y `PricingPlanForm` reemplazan sus selects nativos por `InternalSelect` controlados o compatibles con `FormData`; una prueba impide reintroducir controles externos.
- La primera ejecución de `pnpm check` falló porque `admin-forms.test.tsx` aún exigía el texto visual retirado; la expectativa se actualizó y la validación final pasó.

## 2026-10-14 — `2026-10-14-selectores-internos-resumen`

- `DashboardAnalytics` sustituye sus tres `<select>` nativos por `InternalSelect` controlados, manteniendo el cálculo reactivo de periodo, modalidad y tarifa.
- `InternalSelect` incorpora `gap-3` y padding derecho explícito en el disparador; las pruebas cubren ausencia de selects nativos, selección controlada y espaciado de la flecha.
- La columna de periodo usa `11.5rem` en `xl` para absorber el icono interno sin truncar la opción activa.
- `pnpm check` superó lint, tipos, 91 pruebas y build Webpack; `git diff --check` no detectó errores.

## 2026-10-14 — `2026-10-14-tabla-clientes-compacta`

- `ClientAdminNotesForm` usa input compacto en tabla y autosave con debounce de 700 ms o `blur`; elimina el submit visible y conserva estados accesibles.
- Añadidos `clientCommercialQuickUpdateSchema` y `saveClientCommercialQuickUpdateAction` para actualizar modalidad o tarifa desde la fila, completar los campos `NOT NULL`, aplicar el precio habitual y auditar sin valores sensibles.
- `ClientsTable` incorpora selectores `InternalSelect` por fila, menú de acciones de tres puntos y filtros plegables independientes para todas sus columnas.
- `client-table.ts` sustituye la búsqueda global por `ClientTableFilters`, incluido rango decimal de precio, y mantiene la ordenación triestado.
- `InternalSelect` admite deshabilitado, clases compactas y apertura superior; `DashboardShell` unifica padding lateral responsivo en barra y contenido.
- Añadidas pruebas de esquema, filtros, controles de fila, nota automática, menú compacto y padding del shell.

## 2026-10-14 — `2026-10-14-tema-filtros-y-kpis`

- `globals.css` incorpora tokens semánticos `sidebar-*` diferenciados para los temas claro y oscuro y los expone a Tailwind mediante `@theme`.
- `DashboardShell` elimina colores `zinc` y blancos fijados del lateral; navegación, pie, perfil y `logoutAction` consumen ahora los nuevos tokens.
- Añadida una prueba que impide recuperar el fondo inverso fijo y exige las clases temáticas del sidebar.
- `DashboardAnalytics` cambia el contenedor flexible de filtros por una cuadrícula de tres columnas, con controles `w-full min-w-0` y anchos de escritorio estables.
- `DashboardAnalytics` convierte sus seis métricas comerciales en disparadores de diálogo, deriva desgloses coherentes con los filtros y enlaza clientes mediante `returnTo=/admin` y cuotas mediante fragmentos `cuota-*`.
- Los diálogos limitan la vista a diez registros, ofrecen **Ver más** cuando procede, bloquean el scroll, cierran con fondo o `Escape` y restauran el foco.
- `ClientStatusSwitch` ancla el thumb con `left-1`, usa un desplazamiento contenido y evita que pista, thumb y etiqueta se solapen; se añadieron pruebas de ambos comportamientos.

## 2026-10-14 — `2026-10-14-despliegue-tarifas-tema`

- Verificada en `team-ortega` la presencia real de las migraciones históricas `202610120001`–`202610130004`; se reconcilió su historial remoto antes de continuar.
- `supabase db push` aplicó `202610130005_commercial_terms.sql` y `202610130006_admin_dashboard_settings.sql`; una consulta posterior confirmó `pricing_plans`, `client_commercial_terms` y `admin_dashboard_settings`.
- `supabase migration list --linked` quedó sincronizado con las seis versiones locales y remotas.
- `/supabase/.temp/` se ignora por ser caché local del enlace con Supabase; no se versionan referencias ni metadatos generados por la CLI.
- Se publica el conjunto validado en `main`: tarifas y condiciones por cliente, analítica Recharts, objetivos persistentes, tema claro/oscuro y control superior del sidebar.

## 2026-10-13 — `2026-10-13-tema-y-control-sidebar`

- `ThemeToggle` aplica `light`/`dark` mediante `data-theme`, persiste `team-ortega:theme` y expone etiquetas accesibles; el bootstrap previo a hidratación respeta primero almacenamiento y después el sistema.
- `globals.css` incorpora tokens oscuros completos y acota los tokens claros de `.public-page`; las series, rejillas, ejes y tooltips de Recharts consumen colores compatibles con ambos temas.
- `DashboardShell` mueve el control del lateral a una barra superior estable del contenido, reutilizada tanto al mostrar como al ocultar el menú.
- Añadida prueba de alternancia/persistencia del tema; `pnpm lint`, `pnpm typecheck`, 81 pruebas y `pnpm build` terminaron correctamente.

## 2026-10-13 — `2026-10-13-tarifas-analitica-asesorias`

- `202610130005_commercial_terms.sql` crea `pricing_plans` y `client_commercial_terms`, conserva acuerdos mediante snapshot del importe, retira tarifas con borrado lógico y aplica RLS administrativa.
- `202610130006_admin_dashboard_settings.sql` persiste objetivos por administrador con RLS ligada a `auth.uid()`; ambas migraciones se aplicaron y verificaron en orden en `team-ortega` el 14 de octubre de 2026.
- `ClientCommercialTermsForm` se reutiliza en tabla y ficha; `/admin/tarifas` administra el catálogo y `ClientsTable` amplía búsqueda y orden trivalente a modalidad, tarifa y precio.
- Incorporado Recharts para el panel `DashboardAnalytics`; `dashboard-analytics.ts` prorratea por meses, agrega cuotas pagadas/pendientes y calcula la previsión combinando tendencia reciente y cartera activa.
- Los filtros de 3, 6 o 12 meses, modalidad y tarifa recalculan todas las métricas y gráficas sin nuevas lecturas; no se entregan respuestas sanitarias al componente.
- `pnpm lint`, `pnpm typecheck`, 80 pruebas y `pnpm build` terminaron correctamente.

## 2026-10-13 — `2026-10-13-navegacion-notas-estado-clientes`

- Centralizada la construcción de fichas y la resolución de `returnTo` en `client-navigation.ts`, mediante una lista cerrada de destinos y alternativa segura a `/admin/clientes`.
- La migración `202610130004_client_admin_notes.sql` separa las notas administrativas del perfil legible por el cliente y aplica RLS administrativa, límite de 5000 caracteres y privilegios servidor explícitos.
- La migración se aplicó correctamente en el proyecto productivo `team-ortega`; la consulta terminó sin errores y sin modificar perfiles existentes.
- `saveClientAdminNoteAction` comparte persistencia entre tabla y ficha; `setClientStatusAction` limita el cambio a `active`/`archived`, actúa solo sobre perfiles cliente y no registra contenido libre.
- `ClientsTable` y `client-table.ts` implementan búsqueda normalizada y ordenación trivalente estable sobre todas las columnas de datos visibles.
- Añadidas validaciones de navegación, notas, estado, búsqueda y orden; `pnpm lint`, `pnpm typecheck`, 75 pruebas y `pnpm build` terminaron correctamente.

## 2026-10-13 — `2026-10-13-volver-ficha-cliente`

- `/admin/clientes/[id]` incorpora un `ButtonLink` con `ArrowLeft` dirigido a `/admin/clientes`, sin depender del historial del navegador.
- El cambio queda cubierto por lint, tipos, las 68 pruebas existentes y el build Webpack del proyecto.

## 2026-10-13 — `2026-10-13-kpis-interactivos-sidebar-plegable`

- `AdminDashboardPage` combina conteos exactos con consultas limitadas a diez filas y entrega a `DashboardKpis` DTO mínimos sin respuestas sensibles.
- `DashboardKpis` implementa disparadores accesibles, modal cerrable por botón, fondo o Escape, restauración de foco, enlaces profundos y **Ver más** condicionado por el total.
- Añadidos fragmentos de destino a interesados, cuestionario, seguimientos y cuotas, con resaltado `:target`; `DashboardShell` persiste el estado del lateral en `localStorage` sin cambiar la navegación móvil.
- Añadidas pruebas de modal, límite, enlaces y alternancia del lateral; `npm run lint`, `npm run typecheck`, 68 pruebas y `npm run build` terminaron correctamente.

## 2026-10-13 — `2026-10-13-permisos-solicitudes`

- Los logs de Supabase confirmaron `POST /rest/v1/leads` y lecturas administrativas con estado `403`, `PostgREST 42501`, usando la clave privada `sb_secret`; la tabla permanecía vacía.
- `202610130003_service_role_permissions.sql` declara DML explícito para `service_role` sobre las tablas operativas y privilegios por defecto para tablas y secuencias futuras; no concede acceso a `anon` ni elimina RLS.
- `createLeadAction` emite `lead.create_failed` con el código técnico o `lead.created` sin PII.
- `pnpm check` superó lint, tipos, 65 pruebas y build Webpack.
- La migración se aplicó al proyecto productivo con resultado correcto; la recarga del panel confirmó de nuevo 1 cliente activo y la tabla de Clientes mostró a Iker con el cuestionario completado. Queda pendiente observar el primer `POST` real posterior al cambio.

## 2026-10-13 — `2026-10-13-visibilidad-cuestionarios-admin`

- Los logs de producción mostraron un `POST /app/cuestionario` y ningún `POST /solicitar-informacion`: el envío actual era onboarding, mientras el resumen solo consultaba `leads`.
- `AdminDashboardPage` separa conteos y listados de `profiles`, `onboarding_submissions` y `leads`; los cuestionarios recientes solo muestran nombre, fecha y estado, sin duplicar respuestas sanitarias en el resumen.
- `parseHeightCentimeters()` normaliza alturas en metros o centímetros a la columna canónica `height_cm`, manteniendo el rango persistido 120–230.
- `saveOnboardingAction` comprueba y diferencia fallos de formulario, consentimiento y activación, emite observabilidad sin PII y revalida `/app`, `/admin` y `/admin/clientes` tras el éxito.
- `pnpm check` superó lint, tipos, 65 pruebas y build Webpack.

## 2026-10-13 — `2026-10-13-recuperacion-login-despliegue`

- Los logs de Vercel localizaron un `POST /login` con estado `409` y `Failed to find Server Action`, originado por un cliente de un despliegue anterior; no fue un rechazo de Supabase ni un error del perfil.
- `next.config.ts` configura `deploymentId` a partir de `VERCEL_DEPLOYMENT_ID`, elimina el prefijo reservado, sanea caracteres y limita el valor a 32 posiciones para activar la identificación de versión en Next.js 16.
- Añadido `src/app/login/error.tsx` como límite de error específico y recuperación mediante recarga completa. No se persisten credenciales ni se cambia el contrato de autenticación.
- `pnpm check` superó lint, tipos, 61 pruebas y build Webpack; un segundo build con un `VERCEL_DEPLOYMENT_ID` sintético verificó el valor saneado en `.next/routes-manifest.json` y `data-dpl-id`/`?dpl=` en los artefactos.

## 2026-10-13 — `2026-10-13-diagnostico-registro-existente`

- `registerAction` detecta la identidad ofuscada de Supabase mediante `user.identities?.length === 0` y deja de devolver éxito para correos existentes.
- Añadidos mensajes diferenciados para límite `429` y fallo real del alta, además de observabilidad sin PII mediante eventos estructurados de creación, duplicado y error.
- Los registros de Vercel mostraron tres `POST /registro` con estado 200 mientras la consulta administrativa seguía sin perfiles cliente; esto es coherente con intentos sobre una identidad Auth ya existente.
- Añadidas pruebas de regresión para una identidad ofuscada y un alta nueva con confirmación solicitada.
- `pnpm check` superó lint, tipos, 61 pruebas y build Webpack.

## 2026-10-13 — `2026-10-13-reenvio-confirmacion-registro`

- Añadidos `/reenviar-confirmacion`, `ResendConfirmationForm` y `resendConfirmationAction` sobre `auth.resend({ type: "signup" })`, reutilizando el callback del registro.
- La acción mantiene una respuesta genérica para impedir enumeración de cuentas y presenta un mensaje específico para el límite `429`/`over_email_send_rate_limit`.
- Incorporadas pruebas para el reenvío correcto, el intervalo mínimo, los fallos del proveedor y la validación previa del correo.
- `pnpm check` superó lint, tipos, 59 pruebas y build Webpack.

## 2026-10-13 — `2026-10-13-rendimiento-panel`

- Añadido `vercel.json` con `regions: ["dub1"]` para alinear el runtime de Next.js con Supabase `eu-west-1`; la medición previa mostró `x-vercel-id: cdg1::iad1`.
- Sustituidos los dos `auth.getUser()` del proxy y la DAL por `auth.getClaims()`. El proyecto firma con ES256, por lo que la verificación puede usar JWKS cacheadas sin la petición Auth que `getUser()` siempre realiza.
- Reducido el matcher del proxy a Auth y áreas privadas; la landing, privacidad y captación ya no refrescan sesiones innecesariamente.
- Añadido `src/app/admin/loading.tsx` y restringida la consulta de Interesados a sus columnas visibles y 100 filas recientes.
- `pnpm check` superó lint, tipos, 55 pruebas y build Webpack.

## 2026-10-13 — `2026-10-13-trazabilidad-solicitudes`

- `createLeadAction` usa `insert().select("id").single()` y no devuelve éxito sin la representación de la fila creada.
- Añadidas invalidaciones de `/admin` y `/admin/interesados`, render dinámico explícito de la lista y una referencia compartida derivada del UUID.
- La tabla administrativa muestra la referencia junto a cada solicitud y una prueba unitaria cubre su formato estable.
- `pnpm check` superó lint, tipos, 55 pruebas y build.

## 2026-10-13 — `2026-10-13-orden-interesados-clientes`

- Reordenado `adminItems` en `DashboardShell` para situar `/admin/interesados` antes de `/admin/clientes` tanto en escritorio como en móvil.
- Documentada la separación entre `leads` y los perfiles con rol `client`; no se altera el modelo de datos ni se requiere migración.
- La consulta de solo lectura en producción devolvió vacías ambas vistas, por lo que el registro anterior de Iker no puede recuperarse desde la base actual.
- `pnpm check` superó lint, tipos, 54 pruebas y build.

## 2026-10-13 — `2026-10-13-alta-admin-inicial`

- Provisionada en Supabase Auth la identidad inicial y actualizada exactamente una fila de `profiles` a `admin/active`.
- `loginAction` consulta el perfil antes del bootstrap y solo usa la `service role` cuando la identidad designada todavía no tiene rol administrador.
- Añadidas pruebas unitarias para la promoción inicial y para evitar escrituras redundantes en administradores existentes; `pnpm check` superó lint, tipos, 54 pruebas y build.

## 2026-10-13 — `2026-10-13-minimo-contrasena-ocho`

- Centralizado el mínimo de contraseña en `PASSWORD_MIN_LENGTH = 8` y reutilizado en los esquemas Zod, atributos `minLength` y mensajes de interfaz.
- Aplicada la política común al login, registro, alta/recuperación y cambio de contraseña desde Ajustes.
- Ampliadas las pruebas de esquemas con los límites de 8 caracteres aceptados y 7 rechazados; `pnpm check` superó lint, tipos, 52 pruebas y build.

## 2026-10-13 — `2026-10-13-ajustes-prefijo-avisos`

- Extraído `PhonePrefixSelect` de `LeadForm` como listbox reutilizable, con IDs internos únicos, navegación por teclado y helpers para separar y recomponer teléfonos persistidos.
- `ProfileSettingsForm` conserva prefijo y número como estados separados, envía el valor canónico mediante `phone` oculto y reutiliza el control propio dentro del borde redondeado del campo.
- `FormMessage` incorpora cierre manual y temporizador de cinco segundos para éxitos, identificando el objeto de estado descartado para que una respuesta posterior pueda volver a mostrarse.
- Añadidas pruebas de apertura/selección, normalización de teléfono y cierre temporizado/manual; `pnpm check` superó lint, tipos, 50 pruebas y build.

## 2026-10-13 — `2026-10-13-plantillas-correos-seguridad`

- Versionados asunto y HTML de **Magic link or OTP** y **Reset password** en `supabase/email-templates/`.
- Ambas plantillas comparten estructura compatible con clientes de correo, estilos inline, el PNG público de marca y `{{ .ConfirmationURL }}` como CTA y enlace alternativo.
- Publicadas y verificadas las dos plantillas en Supabase Auth; la URL pública del logo respondió `200 image/png`.

## 2026-10-13 — `2026-10-13-seguridad-cuenta-y-admin`

- `ProfileAvatar` incorpora visor modal, cierre por botón/fondo/Escape y restauración del foco; `updateProfileAction` permite anular `avatar_path` y retirar el objeto privado.
- Añadidos `account-security.ts`, dos rutas modales de Ajustes y tokens HMAC de diez minutos ligados a usuario/propósito; el callback PKCE solo emite cookies `HttpOnly` tras validar firma, usuario y destino.
- Separada la edición ordinaria del perfil de correo y contraseña. El correo se confirma de inmediato con `auth.admin.updateUserById()` tras verificar el buzón anterior, y la contraseña usa la sesión de recuperación de Supabase.
- `loginAction` promociona a `admin/active` únicamente la cuenta inicial designada después de una autenticación correcta; el resto del control continúa dependiendo de `profiles.role` y del trigger que crea clientes.
- Añadidas pruebas de manipulación/caducidad del token y del visor de avatar. `pnpm check` superó lint, tipos, 46 pruebas y build; no se requiere migración.

## 2026-10-13 — `2026-10-13-ajustes-perfil-cliente`

- Añadidos `/app/ajustes`, `ProfileSettingsForm`, `updateProfileAction`, la entrada de navegación y la visualización de datos básicos en la ficha administrativa.
- Incorporada la migración `202610130002_profile_settings.sql`: `profiles.avatar_path`, edición propia limitada por columnas y bucket privado `profile-avatars` con políticas por propietario.
- Los avatares se validan a 2 MB y MIME JPG/PNG/WebP, se sirven con URL firmada de una hora y reutilizan `ProfileAvatar` con iniciales de respaldo.
- Ampliadas las pruebas de esquemas y presentación del avatar; 43 pruebas, lint, tipos y build terminaron correctamente.
- Aplicada la migración en `team-ortega` y verificados `avatar_path`, el bucket privado de 2 MB y sus cuatro políticas de objetos.

## 2026-10-13 — `2026-10-13-consentimiento-cuestionario-toast`

- Extraído `FormErrorToast` como componente reutilizable y aplicado al onboarding con `noValidate` y un `messageId` nuevo por error de la Server Action.
- Añadidos `HealthConsentField` con asociación ARIA y estado visual rojo, y `DismissibleNotice` para cerrar localmente el recordatorio sanitario.
- Incorporadas pruebas de cierre y reaparición del toast, estado inválido del consentimiento y cierre del aviso; `pnpm check` superó lint, tipos, 39 pruebas y build.

## 2026-10-13 — `2026-10-13-refinado-redes-sociales`

- Retirado el párrafo descriptivo y su referencia ARIA de `SocialNetworksField`.
- Aplicado `--radius-lg` al contenedor, resumen y panel abierto sin alterar controles ni persistencia.

## 2026-10-13 — `2026-10-13-selector-redes-sociales`

- Añadidos `SocialNetworksField` y `social-networks.ts` para editar, sanear, serializar y reconstruir hasta ocho perfiles permitidos.
- `InternalSelect` admite ahora modo controlado e iconos sin alterar su uso previo con campo oculto.
- El onboarding valida JSON canónico y continúa usando `social_networks text`, sin migración; la ficha administrativa genera los enlaces desde prefijos internos permitidos.
- Incorporadas pruebas de interacción, serialización, saneamiento, URLs y rechazo de valores manipulados.

## 2026-10-13 — `2026-10-13-ayudas-contextuales-cuestionario`

- Añadidos `FieldHelp` y `FieldHelpContent`; `Field` puede renderizar un disparador `?` junto a la etiqueta sin alterar el control ni su contrato de datos.
- El diálogo contextual incluye etiquetado ARIA, cierre exterior, `Escape`, restauración del foco y contenido específico para los seis campos narrativos del onboarding.
- Los textos sensibles aplican minimización de datos y desaconsejan diagnósticos, historiales e informes completos.
- Incorporadas pruebas de apertura, contenido, cierre y retorno del foco.

## 2026-10-13 — `2026-10-13-controles-cuestionario-interno`

- Añadido `numeric-values.ts` para sanear enteros y decimales sin signo y convertir `,` o `.` a un `number` canónico antes del `upsert` de onboarding.
- Endurecido `onboardingSchema`: rechaza signos, exponentes, texto, edades decimales y separadores repetidos, conservando los rangos físicos y las columnas PostgreSQL `numeric(5,2)` existentes.
- Añadido `InternalSelect`, combobox/listbox accesible con foco, teclado, cierre exterior y valor oculto compatible con `FormData`; aplicado a `sex`.
- Recompuesto `OnboardingForm` en pares responsivos de textareas con alturas equivalentes y ajustada la cabecera móvil de `DashboardShell` a menú izquierdo y marca derecha.
- Incorporadas pruebas de saneamiento, normalización, rechazo del esquema y accesibilidad básica del selector. La primera ejecución reveló esperas de foco y ausencia de nombre accesible en el combobox; ambos puntos se corrigieron y la suite final pasó. La previsualización privada local quedó bloqueada por ausencia de variables públicas de Supabase en el checkout temporal; después se verificaron en producción el layout móvil, el listbox y los filtros numéricos sin enviar el formulario.

## 2026-10-13 — `2026-10-13-bloqueo-navegacion-cuestionario`

- `DashboardShell` recibe `onboardingComplete`, intercepta los enlaces de cliente distintos del cuestionario y muestra un diálogo accesible y cerrable en escritorio y móvil.
- Añadido `requireCompletedClient()` y aplicado a Inicio, Entrenamiento, Nutrición y Seguimiento para impedir que una URL directa omita el onboarding.
- Añadidas pruebas del bloqueo previo y de la navegación desbloqueada después de completar el cuestionario.
- La primera ejecución aislada falló al cargar la Server Action y otra conservó DOM entre casos; se simularon `logoutAction` y la limpieza explícita. `pnpm check` final superó lint, tipos, 13 pruebas y build.

## 2026-10-13 — `2026-10-13-mejoras-acceso-correo`

- `DashboardShell` fija el lateral de escritorio a `100dvh` mediante posición `sticky`, manteniendo accesibles el usuario y el formulario de `logoutAction`.
- Extraído `PasswordInput` como componente reutilizable; el login lo usa con `current-password` y dispone de una prueba de alternancia visible/oculta.
- Versionados el asunto y el HTML de **Confirm sign up**; la plantilla usa estilos inline, un PNG ligero específico para correo y conserva `{{ .ConfirmationURL }}` como CTA y fallback.

## 2026-10-13 — `2026-10-13-cerrar-toast-registro`

- Ampliado `ActionState` con `messageId`; `registerAction` genera un UUID nuevo en cada error para que el mismo toast pueda reaparecer tras descartarlo.
- `FormErrorToast` conserva localmente el identificador cerrado y expone un botón accesible `Cerrar aviso` con el icono `X`.

## 2026-10-13 — `2026-10-13-mejorar-password-registro`

- Añadido `items-start` a la cuadrícula responsive de `RegisterForm` para impedir que el texto de ayuda de la contraseña estire y desplace el campo de confirmación.
- `RegisterForm` usa `noValidate`, un toast de error persistente y `aria-invalid`; `globals.css` mantiene rojo el borde inválido incluso durante el foco.
- Los dos campos emplean un control de visibilidad independiente con `Eye`/`EyeOff`, y los mensajes de ayuda y error quedan asociados mediante `aria-describedby`.
- El primer `pnpm check` señaló `react-hooks/set-state-in-effect` en el cierre temporizado del toast; se retiró ese efecto y la ejecución final superó lint, tipos, 8 pruebas y build.

## 2026-10-13 — `2026-10-13-registro-publico-clientes`

- Añadidos `/registro`, `RegisterForm`, `registerSchema` y `registerAction` sobre `supabase.auth.signUp()`.
- El registro envía únicamente `full_name` como metadato, usa el callback a `/app/cuestionario` y conserva la asignación forzada de `client` en `handle_new_user()`.
- Añadidas pruebas de validación para registros correctos y contraseñas no coincidentes; no se requiere migración de base de datos.

## 2026-10-13 — `2026-10-13-carrusel-pasos-movil`

- Añadido `StepsCarousel`, componente cliente accesible con scroll snap, navegación táctil, flechas, contador y paginación sincronizada mediante `onScroll`.
- La landing renderiza el carrusel bajo `md` y conserva el listado estático desde `md`.
- El `h2` de la sección usa `2.625rem` por defecto y recupera `text-6xl` desde `sm` para evitar clipping a 390 px.

## 2026-10-13 — `2026-10-13-modal-registro-login`

- Sustituido el mensaje de éxito insertado en `RegisterForm` por `RegistrationSuccessDialog`, un diálogo modal accesible.
- El componente navega con `router.replace("/login")` tras 2,5 segundos o al activar el CTA y cuenta con pruebas del botón y del temporizador.

## 2026-10-13 — `2026-10-13-registro-sin-scroll`

- Añadido a `AuthShell` el modo opcional `fitViewport`, basado en `h-dvh`, contención de overflow y espaciado compacto; solo `/registro` lo activa.
- `RegisterForm` acepta el modo `compact` para reducir gaps sin cambiar controles, validación ni contratos de la Server Action.
- Bajo 640 px de ancho y 721 px de alto, el layout reduce espaciados y saca los mensajes `.field-error` del flujo visual sin retirarlos del árbol accesible; el toast y `aria-invalid` siguen visibles.

## 2026-10-13 — `2026-10-13-volver-inicio-formulario-izquierda`

- El contenedor del enlace de retorno en `/solicitar-informacion` cambia de `justify-end` a `justify-start`.

## 2026-10-13 — `2026-10-13-eliminar-scroll-metodo`

- La cuadrícula de `#metodo` pasa de `lg` a `xl`, usa pistas `minmax(0, …)`, aplica `min-w-0` a ambos hijos y contiene cualquier desbordamiento horizontal residual.
- `pnpm check` superó lint, tipos, 5 pruebas y build al repetirse con red; el primer build falló exclusivamente por `ENOTFOUND fonts.googleapis.com` en el sandbox.

## 2026-10-13 — `2026-10-13-retirar-acceso-hero`

- Eliminado del hero el `ButtonLink` dirigido a `/login`; se conserva el enlace secundario a `/solicitar-informacion` y el acceso principal del `MarketingHeader`.

## 2026-10-13 — `2026-10-13-padding-lateral-publico`

- Actualizado el gutter global de `.page-shell` a `1.5rem` por defecto y `3rem` desde `768px`, manteniendo `max-width: 1200px`.

## 2026-10-13 — `2026-10-13-intercambio-cta-portada`

- `MarketingHeader` y el hero intercambian destinos y etiquetas: `/login` usa el CTA primario «Acceder» y `/solicitar-informacion` la acción secundaria «Quiero información».
- La navegación móvil expone «Acceder» como única acción principal.

## 2026-10-13 — `2026-10-13-inicio-login-izquierda`

- `AuthShell` alinea el enlace de retorno con `lg:justify-start`; el encabezado móvil mantiene la marca y el acceso separados con `justify-between`.
- La sección de autenticación usa `flex` con alineación superior en móvil y recupera el centrado mediante `lg:grid lg:place-items-center` en escritorio.

## 2026-10-13 — `2026-10-13-logo-hero-movil`

- Añadida una variante móvil absoluta y de carga prioritaria de `team-ortega-mark.png` en el hero, decorativa para lectores de pantalla y oculta desde `lg`.

## 2026-10-13 — `2026-10-13-hero-mas-compacto`

- Reducido el `clamp()` tipográfico del `h1`, la altura mínima y los espaciados verticales del hero de la landing.
- Reducido el ancho máximo del recurso de marca y reajustada la proporción de columnas sin alterar el contenido ni los CTA.

## 2026-10-13 — `2026-10-13-tipografia-archivo-dm-sans`

- Integradas Archivo variable y DM Sans variable mediante `next/font/google` en el layout raíz.
- Expuestas como variables CSS del sistema de diseño y aplicadas globalmente a texto, controles y titulares, con autoalojamiento en el artefacto de Next.js.
- Ajustada la firma compacta de marca para conservar `Team Ortega` en una sola línea en cabeceras móviles con las nuevas métricas.
- Reducido el breakpoint de escritorio del `h1` de captación para evitar clipping en su columna lateral.
- La primera compilación local no pudo resolver Google Fonts por la red restringida del entorno; repetida con acceso permitido, terminó correctamente.

## 2026-10-13 — `2026-10-13-contacto-sin-correo`

- Eliminada la opción `email` del grupo de radios visible en `LeadForm` y ajustada su composición a dos columnas.
- Conservado el valor en el esquema de validación para compatibilidad con registros históricos; no se modifica la base de datos.

## 2026-10-13 — `2026-10-13-selector-prefijo-interno`

- Reemplazado el `select` nativo del prefijo por un listbox controlado en `LeadForm`, con estados ARIA, selección, foco, cierre exterior y navegación por flechas, inicio, fin y Escape.
- Conservada la composición final del campo `phone` y el contrato de la Server Action sin cambios de base de datos.

## 2026-10-13 — `2026-10-13-identidad-editorial-publica`

- Añadidas en `globals.css` utilidades públicas acotadas para composición editorial, CTA diagonales, recursos de marca y formularios lineales.
- Recompuestas la landing, `MarketingHeader`, `MarketingFooter`, `AuthShell`, captación, privacidad y 404 sin modificar las primitivas ni los layouts del dashboard.
- Conservados los contratos de formularios y Server Actions; el cambio del teléfono y de `contactPreference` sigue siendo exclusivamente de presentación y composición del `FormData` existente.
- Verificadas las superficies públicas en escritorio y móvil mediante vista previa local.

## 2026-10-13 — `2026-10-13-contacto-telefono`

- Reemplazado `contactPreference` por un grupo de radios accesible que mantiene los valores `whatsapp`, `phone` y `email`.
- Añadido al formulario de leads un teléfono compuesto que envía a la Server Action el prefijo y el número como el campo `phone` existente, sin migración de base de datos.
- Actualizadas las reglas del sistema de diseño para controles telefónicos y elecciones cortas.

## 2026-10-13 — `2026-10-13-smtp-brevo`

- Generada en Brevo la clave SMTP exclusiva `Team Ortega - Supabase`, sin reutilizar ni modificar credenciales existentes.
- Activado Custom SMTP en Supabase Auth con Brevo, puerto 587, remitente verificado y nombre visible `Team Ortega`.
- Confirmado el guardado de la configuración; el secreto permanece cifrado en Supabase y fuera de Git/Vercel.
- Documentado que la clave es independiente, mientras que cuota, plan y reputación siguen compartidos por la cuenta Brevo.

## 2026-10-13 — `2026-10-13-css-produccion`

- Añadido `@tailwindcss/postcss` y el `postcss.config.mjs` oficial requerido por Tailwind CSS 4 con el build Webpack de Next.js.
- Verificada la generación de utilidades Tailwind en el CSS de producción y ejecutado `pnpm check` completo con resultado correcto.

## 2026-10-13 — `2026-10-13-despliegue-inicial`

- Creada la organización `Team Ortega` y el proyecto Supabase `team-ortega` en `eu-west-1`; aplicada y verificada la migración de 11 tablas.
- Creado el proyecto Vercel `team-ortega` en Hobby desde `ikerriosKunfupay/AsesoriasSamu`, rama `main` y commit `9ca113f`.
- Cargadas como sensibles las cuatro variables de entorno necesarias para Production y Preview, sin incorporar secretos a Git.
- Verificado el despliegue `Ready` en `https://team-ortega.vercel.app` y la carga de la landing Next.js.
- Configurados en Supabase Auth el Site URL de producción y los callbacks de producción y desarrollo local.
- Documentados como pendientes el alta/promoción del primer administrador, la desactivación del registro público, el SMTP propio y las pruebas Auth extremo a extremo.

## 2026-10-12 — `2026-10-12-mvp-inicial`

- Inicializado Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest y Supabase SSR.
- Implementadas landing, formulario de lead protegido, Auth por invitación, reset de contraseña y callback PKCE.
- Añadidos DAL de usuario, guardas por rol y layouts dinámicos para `/admin` y `/app`.
- Implementadas Server Actions Zod para invitaciones, onboarding, planes, check-ins y cuotas manuales.
- Añadida migración PostgreSQL con 11 tablas, índices, triggers, `is_admin()`, `complete_onboarding()` y políticas RLS.
- Incorporados tokens CSS, primitivas UI, navegación responsive, iconos de marca y metadatos `noindex`.
- Añadidas pruebas unitarias de formularios y componentes; validaciones `lint`, `typecheck`, `test:run` y build Webpack.
- Documentados despliegue, modelo de datos, seguridad, operación de Supabase y restricción de Vercel Hobby.
