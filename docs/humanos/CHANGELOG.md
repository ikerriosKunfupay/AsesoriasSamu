# Registro de cambios humano

## 2026-10-14 — `2026-10-14-limpieza-datos-demo-produccion`

- Producción vuelve a estar limpia para empezar con clientes reales: se han eliminado las seis cuentas cliente y toda su información asociada.
- También se han retirado los interesados, avisos y registros administrativos generados durante las demostraciones.
- Se conserva únicamente la cuenta administradora, junto con la biblioteca de ejercicios, tarifas, plantillas y configuración general de la aplicación.
- La comprobación final confirmó 1 administrador, 0 clientes y 0 registros en planes, nutrición, cuotas, avisos y auditorías de aplicación.
- La validación del repositorio completó análisis de código, tipos, 149 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-catalogo-ejercicios-excel`

- La biblioteca de Entrenamientos incorpora los 339 ejercicios y 17 grupos musculares de la hoja de trabajo, con sus enlaces y claves de ejecución.
- El creador permite buscar el músculo y después el ejercicio dentro de ese grupo; al seleccionarlo rellena automáticamente sus claves, que siguen siendo editables para adaptar el plan al cliente.
- **Biblioteca de ejercicios** permite buscar, filtrar, crear, editar y eliminar fichas. Los planes ya guardados conservan sus datos aunque la ficha general cambie o se elimine.
- El enlace técnico aparece tanto en la vista previa administrativa como en el entrenamiento del cliente cuando está disponible.
- El catálogo y sus políticas de acceso se han aplicado en el Supabase productivo de Team Ortega; el historial remoto quedó sincronizado hasta `202610140005`.
- La web se publicó desde `main` y Vercel completó correctamente el despliegue; la portada, el acceso y la protección de la nueva biblioteca respondieron como estaba previsto.
- La validación final completó análisis de código, tipos, 149 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-entrenamientos-centralizados-y-demo`

- El creador completo de entrenamientos se ha trasladado de la ficha individual a **Entrenamientos**, donde ahora se elige el cliente y se prepara el bloque por semanas, sesiones y ejercicios sin abandonar el histórico.
- La ficha del cliente muestra únicamente sus entrenamientos recientes y enlaza a la sección central para crear o modificar planes.
- **Ver** abre una vista estructurada del plan con resumen, pestañas semanales, sesiones y datos de cada ejercicio; **Editar** recupera la estructura completa en el mismo editor.
- Los cinco clientes de demostración de producción disponen de entrenamientos estructurados completos para enseñar el flujo con datos ficticios.
- La validación final completó análisis de código, tipos, 144 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-entrenamientos-estructurados`

- El entrenador puede preparar cada plan como un bloque de hasta 16 semanas, con sesiones, ejercicios, series, repeticiones, RIR, descansos y observaciones, manteniendo el flujo de la hoja de cálculo de referencia.
- Una semana se puede duplicar para acelerar la progresión y el plan admite borrador o publicación sin eliminar el histórico anterior.
- El cliente dispone de resumen del bloque, distribución por grupo muscular y una pestaña por semana; en cada sesión puede guardar carga, repeticiones y RIR reales por serie.
- Los entrenamientos antiguos de texto siguen mostrándose con normalidad.
- La interfaz se verificó sin desbordamiento en 375×667, 390×844, tablet y escritorio; la versión integrada completó análisis de código, tipos, 143 pruebas y build Webpack.
- La migración `202610140004_structured_workouts.sql` se aplicó al Supabase productivo de Team Ortega y el historial remoto quedó sincronizado antes de publicar la aplicación desde `main`. Vercel completó correctamente el despliegue de `93f530b`, y la portada y el acceso respondieron `200` en `https://team-ortega.vercel.app`.

## 2026-10-14 — `2026-10-14-centro-notificaciones`

- La cabecera administrativa incorpora una campana con contador de avisos sin leer y un panel adaptado a móvil y escritorio.
- La bandeja avisa de nuevas solicitudes de información, cuentas de cliente, cuestionarios, seguimientos y entrenamientos registrados, con fecha y enlace directo al registro relacionado.
- Los avisos pueden marcarse individualmente al abrirlos o todos a la vez, y el estado de lectura se conserva entre dispositivos.
- La bandeja se actualiza en segundo plano sin retrasar la carga del resumen ni del resto de páginas.
- La validación final completó análisis de código, tipos, 139 pruebas, compilación de producción y comprobación de diferencias.

## 2026-10-14 — `2026-10-14-biblioteca-plantillas-y-rendimiento`

- Entrenamientos y Nutrición incorporan **Gestionar plantillas**, una biblioteca propia desde la que se puede editar nombre, título y contenido o eliminar plantillas reutilizables sin afectar a los planes ya asignados.
- Los filtros de planes se reparten automáticamente en varias filas cuando falta ancho y el estado ya no invade los botones de ver, editar o eliminar al abrir el formulario lateral.
- El resumen elimina el selector temporal duplicado: el periodo visible decide automáticamente si las cifras y gráficas se agrupan por día, semana o mes.
- Clientes, Seguimientos y Resumen reducen esperas al cargar en paralelo los datos independientes y evitar una segunda consulta de nombres que ya estaban disponibles.
- La validación final completó análisis de código, tipos, 138 pruebas, compilación de producción y comprobación de diferencias.

## 2026-10-14 — `2026-10-14-gestion-operativa-y-vistas`

- El resumen añade ayudas `?` accesibles a objetivos, progresos y gráficas. El periodo admite Hoy, Ayer, Esta semana, Semana pasada, Este mes, rangos de 14 días, 12 semanas, 3/6/12 meses y fechas personalizadas; la agrupación por día, semana o mes se aplica a todas las cifras y gráficas.
- **Asesorías** y **Pagos** se pueden recoger y desplegar desde sus encabezados; la elección se conserva en el navegador y se comparte entre el menú lateral y el menú móvil.
- Entrenamientos y Nutrición incorporan filtros por cada campo, ordenación de tres estados, lectura completa, edición, eliminación, calendario interno y plantillas reutilizables. Se eliminan la versión visible y los textos auxiliares indicados.
- Clientes, Interesados, Entrenamientos, Nutrición, Tarifas y Cuotas permiten alternar entre tabla, lista y galería conservando sus acciones.
- Cuotas separa los filtros de cliente y nota, permite ordenar todas sus columnas y editar la nota interna directamente desde cualquier vista; se retira la explicación bajo el título.
- El bloque de fotografía del perfil administrativo deja de repetir el distintivo «Cuenta verificada»; la identificación verificada se conserva en los accesos generales del panel.
- Los indicadores superiores del resumen reducen progresivamente sus columnas en anchos intermedios y parten textos largos dentro de cada tarjeta, sin invadir la siguiente ni provocar desplazamiento lateral.
- Los días semanales de una tarifa pasan a ser opcionales. La nueva estructura de plantillas conserva el aislamiento administrativo en la base de datos.
- La migración de plantillas y días opcionales se aplicó en Supabase y se verificó que las ocho migraciones locales y remotas coinciden.
- La validación final completó análisis de código, tipos, 135 pruebas, compilación de producción y comprobación de diferencias.

## 2026-10-14 — `2026-10-14-perfil-admin-y-ajustes-resumen`

- La identidad de Samuel Ortega en el menú muestra el distintivo de cuenta verificada y abre su perfil tanto en escritorio como en móvil.
- El perfil permite actualizar nombre, teléfono y foto; la imagen continúa siendo privada, admite JPG, PNG o WebP hasta 2 MB y puede eliminarse para recuperar las iniciales.
- Los objetivos de ingresos y clientes eliminan signos, letras y símbolos durante la escritura y vuelven a validarse al guardar para impedir cantidades inválidas.
- Retirado el texto explicativo situado bajo las tres gráficas finales del resumen.
- La validación final completó análisis de código, tipos, 117 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-sidebar-y-creacion-de-planes`

- El menú administrativo separa ahora **Asesorías** —Clientes, Entrenamientos, Nutrición y Seguimientos— y **Pagos** —Tarifas y Cuotas—, tanto en escritorio como en móvil.
- Entrenamientos y Nutrición permiten crear nuevos planes desde su propia sección mediante un interruptor que muestra u oculta el formulario y reajusta el histórico.
- El formulario permite elegir el cliente y mantiene los selectores dentro del diseño de Team Ortega; la creación desde la ficha sigue disponible como acceso rápido.
- Ambos históricos muestran como máximo diez registros por página y se adaptan a tarjetas móviles sin desplazamiento horizontal.
- La validación final completó análisis de código, tipos, 113 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-cuotas-filtrables-y-editables`

- La página de **Cuotas** abre como tabla completa y un interruptor permite mostrar u ocultar el formulario de registro cuando se necesita.
- Añadidos filtros por cliente o nota, periodo, estado e intervalo de importe, además de paginación automática cada diez cuotas.
- Las cuotas existentes ya se pueden editar y eliminar con confirmación; periodo, importe y estado quedan alineados sin solaparse.
- En móvil, cada cuota se presenta como tarjeta dentro del mismo padding lateral que el resto del panel, sin desplazamiento horizontal.
- Eliminado del formulario el texto repetido «Este registro es solo de control interno. La aplicación no procesa cobros.».
- La validación final completó análisis de código, tipos, 110 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-notas-sin-aviso-administrativo`

- Retirado de la ficha del cliente el texto explicativo situado bajo **Notas internas** que indicaba que solo podía verlo la administración.
- La nota continúa guardándose automáticamente y mantiene visible el estado de guardado.
- La primera prueba fijaba por error un identificador interno de React; se corrigió para comprobar la asociación accesible generada realmente.
- La validación final completó análisis de código, tipos, 104 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-migracion-detalles-tarifas`

- Aplicada en la base de datos de Team Ortega la estructura que distingue las tarifas por modalidad y días semanales.
- Verificado que las siete migraciones del proyecto coinciden entre el repositorio y Supabase antes de publicar la aplicación.

## 2026-10-14 — `2026-10-14-invitacion-centrada`

- La cabecera y el formulario de **Nueva invitación** se muestran como un único bloque centrado en el espacio disponible.
- El ancho queda limitado para facilitar la lectura, mientras que en móvil continúa ocupando todo el espacio útil.
- La validación final completó análisis de código, tipos, 103 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-periodos-y-control-cuotas`

- El resumen permite agrupar toda la información económica por día, semana o mes; cambian conjuntamente los KPI, la gráfica, las altas, la cartera, el objetivo y la previsión.
- La vista diaria enseña los últimos 14 días, la semanal las últimas 12 semanas y la mensual los últimos 12 meses.
- **Cobrado** indica que se puede pulsar para ver quién ha pagado; **Pendiente** abre los pendientes y, en la vista mensual, también identifica como **Sin registrar** a cada cliente activo que todavía no tenga una cuota creada ese mes.
- La primera prueba del listado mensual encontró dos textos coincidentes para **Sin cuota registrada**; se hizo la comprobación más precisa y las siete pruebas específicas terminaron correctamente junto con la validación de tipos.
- La validación final completó análisis de código, tipos, 103 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-resumen-sin-descripcion-asesorias`

- Eliminado el texto explicativo situado bajo **Valor de las asesorías** para dejar una cabecera más limpia y compacta.
- Se mantienen sin cambios el título, los filtros, los indicadores interactivos y las gráficas.
- El análisis de código, los tipos y las tres pruebas específicas del panel finalizaron correctamente.

## 2026-10-14 — `2026-10-14-cuestionario-estructurado`

- El cuestionario inicial se divide en cinco bloques numerados: datos físicos, rutina, alimentación y objetivos, salud e información adicional.
- Edad, sexo, peso y altura se presentan en una cuadrícula de dos columnas en pantallas medianas y grandes, en lugar de quedar comprimidos en una única fila.
- La explicación de la altura pasa debajo de todo el bloque físico para mantener los cuatro controles alineados y continúa asociada al campo para lectores de pantalla.
- La primera prueba dirigida buscó por error el asterisco visual dentro del nombre accesible de los campos; se corrigió la expectativa para respetar que dicho símbolo está oculto a tecnologías de asistencia.
- La validación final completó análisis de código, tipos, 100 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-solicitud-sin-scroll-escritorio`

- La página **Solicitar información** compacta sus espacios y el área de objetivo en escritorio para mostrar el formulario completo sin scroll vertical.
- En móvil conserva el desplazamiento normal para no recortar campos ni controles cuando la pantalla o el teclado reducen el espacio disponible.
- La comprobación visual en un viewport de `1470 × 724` confirmó una altura de contenido exacta de `724 px`, sin desbordamiento.
- La validación final completó análisis de código, tipos, 100 pruebas y compilación de producción.

## 2026-10-14 — `2026-10-14-variantes-y-vistas-tarifas`

- Cada plantilla de tarifa incluye modalidad y días por semana, por lo que un plan mensual presencial puede diferenciarse de uno virtual.
- Las tarifas creadas pueden consultarse como tabla, lista o galería; la vista elegida se recuerda en el navegador y la edición se abre desde cualquiera de ellas.
- Los importes de las tarifas ya no admiten signos negativos ni caracteres ajenos a un precio y el servidor mantiene la validación como segunda protección.
- La primera prueba de las vistas usó una coincidencia de texto demasiado estricta y se corrigió; la validación final completó análisis de código, tipos, 98 pruebas y compilación de producción.
- La previsualización local del panel no pudo cargar datos porque este checkout temporal no contiene las credenciales de Supabase; la migración se aplicó posteriormente y queda registrada en la entrada `2026-10-14-migracion-detalles-tarifas`.

## 2026-10-14 — `2026-10-14-navegacion-activa-panel`

- El menú lateral y su versión móvil remarcan siempre la sección que se está consultando.
- Las páginas internas, como la ficha de un cliente, mantienen activa su sección principal en lugar de perder el contexto.
- El análisis de código, los tipos, las 95 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-14 — `2026-10-14-clientes-movil-y-menus-flotantes`

- En móvil, cada cliente se muestra como una tarjeta ordenada y completa, sin empezar la vista en mitad de una tabla horizontal.
- Los desplegables de modalidad y tarifa y el menú de tres puntos aparecen completos sobre la tabla, sin bordes ni opciones recortados.
- La nota sigue guardándose sola, pero se elimina el texto permanente **Guardado automático** para mantener la cuadrícula alineada.
- La ficha muestra el teléfono con su prefijo internacional; los números históricos sin prefijo aparecen con `+34`.
- Modalidad, tarifa y periodicidad abren desplegables internos también en la ficha y en la gestión de tarifas, con espacio suficiente a la derecha de la flecha.
- La primera validación detectó que una prueba todavía esperaba el texto auxiliar eliminado; se corrigió esa comprobación y la ejecución final quedó completa.

## 2026-10-14 — `2026-10-14-selectores-internos-resumen`

- Los filtros de periodo, modalidad y tarifa del resumen abren ahora desplegables propios de Team Ortega en lugar del menú exterior del sistema.
- El texto, la flecha y el borde derecho de todos los selectores internos mantienen una separación más cómoda.
- El filtro de periodo conserva ancho suficiente para mostrar completa la opción seleccionada.
- El análisis de código, los tipos, las 91 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-14 — `2026-10-14-tabla-clientes-compacta`

- Las notas de cliente quedan alineadas en una sola línea y se guardan automáticamente, sin botón adicional.
- Modalidad y tarifa se cambian directamente desde selectores internos de su propia columna.
- Un menú de tres puntos reúne el ajuste de precio, la creación y gestión de tarifas y el acceso a la ficha.
- Los filtros por cada columna permanecen plegados bajo un único botón y muestran el número de criterios activos.
- El contenido conserva un padding lateral más amplio y coherente aunque se oculte el menú.

## 2026-10-14 — `2026-10-14-tema-filtros-y-kpis`

- El modo claro cambia ahora también el menú lateral a fondo blanco, texto oscuro y estados de interacción claros.
- El modo oscuro conserva el sidebar negro con texto claro y el mismo acento rojo de la marca.
- Logo, enlaces, separadores, avatar, usuario y cierre de sesión responden conjuntamente al selector de tema.
- Los filtros de periodo, modalidad y tarifa del resumen permanecen en una única fila en escritorio.
- Los seis indicadores económicos son ahora accesibles y abren un modal con el desglose filtrado, enlaces directos y hasta diez resultados antes de ofrecer **Ver más**.
- El interruptor de alta/baja mantiene el selector dentro de su pista y ya no tapa el texto **Activo/Inactivo**.

## 2026-10-14 — `2026-10-14-despliegue-tarifas-tema`

- Aplicadas en la base de datos de producción las nuevas estructuras de tarifas, condiciones comerciales y objetivos del panel.
- Verificado que el historial de las seis migraciones coincide entre el proyecto y Supabase y que las tres tablas nuevas están disponibles.
- Publicados conjuntamente el panel de análisis de asesorías, la gestión comercial, los modos claro y oscuro y el nuevo control del menú lateral.
- La caché local utilizada para enlazar Supabase queda fuera del repositorio y no contiene cambios funcionales del proyecto.

## 2026-10-13 — `2026-10-13-tema-y-control-sidebar`

- Añadidos modos claro y oscuro para todo el panel privado, con elección persistente y adaptación de tablas, formularios, avisos y gráficas.
- El control para esconder el menú sale del sidebar y permanece en una barra superior compacta del contenido, sin tapar el logo.
- La web pública conserva su combinación marfil y negra para no alterar la identidad visual de acceso y captación.
- El análisis de código, los tipos, las 81 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-13 — `2026-10-13-tarifas-analitica-asesorias`

- Añadidas tarifas reutilizables Mensual, Semestral, Anual o personalizadas, con precio habitual y duración; el entrenador puede crearlas, modificarlas o retirarlas desde su propia sección.
- Cada cliente puede marcarse como Presencial o Virtual, asignarle una tarifa y conservar un precio acordado distinto; la tabla muestra estos campos y permite buscarlos y ordenarlos.
- El Resumen incorpora métricas de cobros, cartera mensual, previsión, pendientes, ticket medio y clientes activos, además de gráficas filtrables por periodo, modalidad y tarifa.
- El entrenador puede definir objetivos propios de ingresos mensuales y clientes activos y consultar su progreso.
- Se distingue expresamente ingreso bruto de beneficio neto y no se incorporan pagos, bancos ni datos de tarjeta.
- El análisis de código, los tipos, las 80 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-13 — `2026-10-13-navegacion-notas-estado-clientes`

- El botón de vuelta de una ficha lleva ahora al lugar real desde el que se abrió: Resumen, Clientes, Entrenamientos, Nutrición o Seguimientos.
- Añadidas notas privadas del entrenador, editables tanto en la tabla de Clientes como dentro de cada ficha.
- Incorporado un interruptor de alta o baja en ambos lugares; una baja conserva la información pero impide el acceso del cliente hasta reactivarlo.
- La tabla permite buscar en todo su contenido y ordenar cada columna en ascendente, descendente u orden original.
- El análisis de código, los tipos, las 75 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-13 — `2026-10-13-volver-ficha-cliente`

- Añadido un botón visible para volver desde la ficha individual a la lista de clientes.
- El destino es estable y funciona también cuando la ficha se abre desde un enlace directo.

## 2026-10-13 — `2026-10-13-kpis-interactivos-sidebar-plegable`

- Reorganizados los cinco indicadores del resumen del entrenador en una única fila compacta de escritorio.
- Cada indicador abre ahora sus diez movimientos más recientes y permite entrar directamente en el registro seleccionado; si hay más resultados, aparece **Ver más**.
- Añadida la posibilidad de ocultar y recuperar el menú lateral en escritorio, recordando la preferencia en el navegador.
- El análisis de código, los tipos, las 68 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-13 — `2026-10-13-permisos-solicitudes`

- Identificado el rechazo real del formulario público: la base de datos devolvía un error de permisos al intentar guardar y leer interesados.
- Añadida una migración que habilita las operaciones privadas del backend sin abrir la tabla a visitantes anónimos.
- Los fallos de guardado dejan ahora un código técnico sin nombres, correos, teléfonos ni contenido del formulario.
- El análisis de código, los tipos, las 65 pruebas y la compilación de producción finalizaron correctamente.
- Los permisos se aplicaron en la base de datos de producción y el panel volvió a mostrar correctamente el cliente y su cuestionario; el próximo envío público servirá como comprobación final de escritura.

## 2026-10-13 — `2026-10-13-visibilidad-cuestionarios-admin`

- El resumen del entrenador distingue ahora los cuestionarios enviados por clientes de las solicitudes de información de la landing.
- Añadidos el total de clientes registrados, el total de cuestionarios y una lista de los últimos formularios con acceso directo a cada ficha.
- La altura del cuestionario acepta tanto `1,69` metros como `169` centímetros y siempre se almacena en centímetros.
- El formulario ya no puede confirmar el envío si falla el consentimiento o la activación final del perfil; en ese caso explica que hay que reintentarlo.
- El análisis de código, los tipos, las 65 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-13 — `2026-10-13-recuperacion-login-despliegue`

- Corregida la causa de la pantalla «This page couldn’t load» que podía aparecer al iniciar sesión desde una pestaña abierta antes de una publicación nueva.
- Cada versión de la web queda ahora identificada para evitar que el formulario antiguo termine en el servidor nuevo.
- Si una pestaña demasiado antigua no pudiera recuperarse automáticamente, el acceso muestra una explicación propia y un botón para recargar; la cuenta no queda bloqueada.
- El análisis de código, los tipos, las 61 pruebas y la compilación finalizaron correctamente; una compilación adicional confirmó que el identificador se incorpora a la versión generada.

## 2026-10-13 — `2026-10-13-diagnostico-registro-existente`

- Corregido el falso «Cuenta creada» que podía aparecer al intentar registrarse con un correo ya utilizado.
- La pantalla explica ahora que no se ha generado otra cuenta y dirige al acceso, recuperación o reenvío según corresponda.
- La investigación de producción encontró tres envíos correctos del formulario pero ningún perfil de cliente nuevo, descartando que esos intentos fueran altas pendientes de recibir correo.
- El análisis de código, los tipos, las 61 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-13 — `2026-10-13-reenvio-confirmacion-registro`

- Añadida en el acceso la opción «No he recibido el correo de confirmación» para solicitar un enlace nuevo sin volver a registrarse.
- El formulario recuerda revisar spam y promociones y explica cuándo hay que esperar un minuto antes de repetir el envío.
- La confirmación de alta avisa de esta alternativa antes de llevar al login.
- El análisis de código, los tipos, las 59 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-13 — `2026-10-13-rendimiento-panel`

- Acercado el servidor del panel a la base de datos europea para eliminar varias esperas transatlánticas en cada pantalla.
- Reducido el trabajo de sesión repetido y retirado de las páginas públicas que no lo necesitan.
- Añadido un estado de carga inmediato en la administración y acotada la primera lista de Interesados a las 100 solicitudes más recientes.
- Antes del cambio, las mediciones repetidas dieron alrededor de 1 s para Resumen y entre 1,1 y 8,1 s para Interesados; la respuesta confirmó que el servidor se estaba ejecutando en Washington.
- El análisis de código, los tipos, las 55 pruebas y la compilación de producción finalizaron correctamente.

## 2026-10-13 — `2026-10-13-trazabilidad-solicitudes`

- El formulario de información solo confirma el envío cuando la solicitud ha quedado guardada en la base de datos.
- La confirmación incluye una referencia breve que también aparece en Interesados, permitiendo comprobar que ambas vistas hablan de la misma solicitud.
- Las vistas de Resumen e Interesados se actualizan después de cada alta y la página de Interesados fuerza datos actuales.
- El análisis de código, los tipos, las 55 pruebas y la compilación finalizaron correctamente.

## 2026-10-13 — `2026-10-13-orden-interesados-clientes`

- «Interesados» aparece ahora antes que «Clientes» en la navegación del entrenador.
- Aclarado que una solicitud pública se muestra en Interesados y solo figura en Clientes cuando existe una cuenta registrada o invitada.
- La comprobación de producción confirmó que la solicitud anterior de Iker no está guardada en ninguna de las dos listas actuales; no se creó ni modificó información para simularla.
- El análisis de código, los tipos, las 54 pruebas y la compilación finalizaron correctamente.

## 2026-10-13 — `2026-10-13-alta-admin-inicial`

- Creada y confirmada la cuenta inicial del entrenador, con acceso administrativo activo.
- El inicio de sesión reconoce directamente una cuenta ya administradora y evita repetir su preparación en cada acceso.
- Añadida una comprobación automática para conservar el acceso de clientes ordinarios sin cambios; las 54 pruebas, el análisis de código, los tipos y la compilación finalizaron correctamente.

## 2026-10-13 — `2026-10-13-minimo-contrasena-ocho`

- El registro, la recuperación y el cambio de contraseña aceptan ahora claves desde 8 caracteres.
- Los textos de ayuda y los controles muestran el mismo mínimo en todos los formularios.
- Añadidas pruebas para aceptar exactamente 8 caracteres y rechazar 7; las 52 pruebas, el análisis de código, los tipos y la compilación finalizaron correctamente.

## 2026-10-13 — `2026-10-13-ajustes-prefijo-avisos`

- El teléfono de Ajustes incorpora un selector de prefijo integrado en el propio campo, sin recurrir al menú externo del navegador.
- Los avisos de perfil y seguridad pueden cerrarse con una X; los mensajes de éxito desaparecen también de forma automática a los cinco segundos.
- La validación añadió pruebas para el selector, la normalización del teléfono y el cierre automático o manual de los avisos; lint, tipos, 50 pruebas y compilación finalizaron correctamente.

## 2026-10-13 — `2026-10-13-plantillas-correos-seguridad`

- Los correos para verificar un cambio de dirección y restablecer la contraseña usan ahora la misma identidad visual que la confirmación de cuenta.
- Ambos incluyen el emblema de Team Ortega, textos específicos, un botón de acción y el enlace completo como alternativa.
- Las dos plantillas quedaron publicadas en Supabase y versionadas en el proyecto.

## 2026-10-13 — `2026-10-13-seguridad-cuenta-y-admin`

- La foto de perfil puede ampliarse al pulsarla y eliminarse para recuperar las iniciales por defecto.
- Cambiar el correo exige abrir primero un enlace enviado a la dirección actual; después aparece un formulario emergente y Ajustes refleja automáticamente la nueva dirección.
- Añadida la opción de cambiar la contraseña mediante un enlace seguro y un formulario emergente con controles para mostrar u ocultar ambos campos.
- Preparado el acceso de la cuenta inicial designada al panel de administración después de autenticarla correctamente, sin guardar su contraseña en el proyecto.
- Lint, tipos, 46 pruebas y compilación de producción finalizaron correctamente.

## 2026-10-13 — `2026-10-13-ajustes-perfil-cliente`

- Añadido un apartado de Ajustes para que cada cliente pueda cambiar foto, nombre, teléfono y correo.
- La foto se mantiene privada y el cambio de correo requiere confirmar la nueva dirección.
- La ficha administrativa muestra ahora la foto y todos los datos básicos de contacto del cliente.
- Las comprobaciones de interacción, datos, código, tipos y compilación finalizaron correctamente con 43 pruebas; el almacenamiento privado también quedó activado y verificado.

## 2026-10-13 — `2026-10-13-consentimiento-cuestionario-toast`

- Sustituido el aviso nativo al omitir el consentimiento del cuestionario por un toast cerrable y un marcado rojo de la casilla.
- Añadida una `X` al recordatorio sobre datos de salud para poder ocultarlo sin afectar al consentimiento obligatorio.
- Verificados los nuevos controles y el resto de la aplicación con 39 pruebas, análisis de código, tipos y compilación.

## 2026-10-13 — `2026-10-13-refinado-redes-sociales`

- Eliminado el texto explicativo redundante del interior del desplegable de redes sociales.
- Redondeados los bordes del bloque tanto cerrado como abierto.

## 2026-10-13 — `2026-10-13-selector-redes-sociales`

- Sustituido el campo libre de redes sociales por un apartado desplegable que no ocupa espacio mientras está cerrado.
- Incluidas Instagram, X, Snapchat, TikTok, YouTube, Facebook, LinkedIn y Twitch con iconos y URL predefinida; solo hay que escribir el usuario.
- Se pueden añadir y eliminar perfiles, y el entrenador dispone de enlaces directos desde la ficha del cliente.

## 2026-10-13 — `2026-10-13-ayudas-contextuales-cuestionario`

- Añadido un botón `?` junto a cada campo de respuesta desarrollada del cuestionario.
- Cada ayuda explica para qué sirve el campo, propone ejemplos y aclara que cuanto más concreta sea la respuesta, mejor podrá adaptarse el plan.
- Las ayudas de lesiones y alergias recuerdan que no se deben compartir diagnósticos ni informes médicos completos.
- El diálogo puede cerrarse con la `X`, pulsando fuera o mediante Escape.

## 2026-10-13 — `2026-10-13-controles-cuestionario-interno`

- La edad solo admite números enteros positivos; peso y altura admiten decimales con coma o punto y se guardan como un único valor numérico normalizado.
- Sustituido el selector gris del navegador para el sexo por un desplegable propio de Team Ortega, compatible con teclado.
- Reordenado todo el cuestionario en una cuadrícula regular, con campos emparejados del mismo tamaño.
- En móvil, el menú privado aparece a la izquierda y el logo a la derecha.
- Las comprobaciones finales terminaron correctamente. Las primeras pruebas del selector detectaron dos detalles de foco y etiquetado accesible, corregidos antes de la entrega; la vista privada local no pudo abrirse sin las variables de Supabase del entorno temporal, pero la versión conectada se verificó después en producción sin enviar el formulario.

## 2026-10-13 — `2026-10-13-bloqueo-navegacion-cuestionario`

- Mientras el cuestionario inicial esté pendiente, los accesos a Inicio, Entrenamiento, Nutrición y Seguimiento muestran un aviso explicativo y no abandonan el cuestionario.
- Al guardar correctamente el cuestionario, toda la navegación del cliente queda disponible.
- El acceso directo mediante una URL también queda protegido y devuelve al cuestionario.
- La primera prueba aislada necesitó ajustar su preparación; la validación completa finalizó correctamente con 13 pruebas, análisis de código, tipos y compilación.

## 2026-10-13 — `2026-10-13-mejoras-acceso-correo`

- El cierre de sesión permanece visible al pie del menú privado en páginas largas y sigue disponible en el menú móvil.
- Añadida al login la opción de mostrar u ocultar la contraseña.
- Personalizado el correo de confirmación de cuenta con la identidad visual y una versión ligera del emblema de Team Ortega compatible con correo.

## 2026-10-13 — `2026-10-13-cerrar-toast-registro`

- Añadida una `X` al aviso de error del registro para poder cerrarlo sin perder los campos marcados.
- Si se vuelve a enviar el formulario con el mismo error, el aviso aparece de nuevo.

## 2026-10-13 — `2026-10-13-mejorar-password-registro`

- Alineados los dos campos de contraseña del registro para que sus etiquetas y líneas tengan el mismo tamaño y comiencen a la misma altura.
- Sustituido el aviso nativo por un toast con el error y el marcado rojo de los campos incorrectos.
- Añadida la opción de mostrar u ocultar cada contraseña.
- La primera comprobación detectó un problema interno en el cierre automático del aviso; se simplificó para mantenerlo visible y la validación final terminó correctamente.

## 2026-10-13 — `2026-10-13-registro-publico-clientes`

- Añadida una opción visible para registrarse desde la pantalla de acceso cuando la persona todavía no tiene cuenta.
- El nuevo formulario solicita nombre, correo y contraseña, enlaza la política de privacidad y pide confirmar el correo antes de comenzar el cuestionario.
- Las cuentas creadas desde este formulario son siempre cuentas de cliente.

## 2026-10-13 — `2026-10-13-carrusel-pasos-movil`

- Convertidos los pasos de «Cómo funciona» en un carrusel móvil con tarjetas deslizables, contador, puntos y flechas.
- En pantallas mayores se conserva la lista completa para poder consultar los tres pasos de un vistazo.
- Ajustado el tamaño del titular móvil para que no se recorte en pantallas estrechas.

## 2026-10-13 — `2026-10-13-volver-inicio-formulario-izquierda`

- Movido «Volver al inicio» al lado izquierdo del formulario para mantener la navegación alineada con el contenido.

## 2026-10-13 — `2026-10-13-eliminar-scroll-metodo`

- Eliminado el desplazamiento lateral de la sección «Cómo funciona»; en pantallas sin anchura suficiente, el contenido se muestra apilado.
- La validación final terminó correctamente; un primer intento de compilación no pudo descargar las fuentes por una restricción temporal de red local.

## 2026-10-13 — `2026-10-13-retirar-acceso-hero`

- Retirado el botón «Acceder» del bloque principal de la portada; el acceso continúa disponible en la cabecera.

## 2026-10-13 — `2026-10-13-modal-registro-login`

- Al crear una cuenta aparece una confirmación emergente con el aviso de revisar el correo.
- La pantalla lleva automáticamente al login y también permite acceder de inmediato mediante un botón.

## 2026-10-13 — `2026-10-13-registro-sin-scroll`

- Ajustada la pantalla de creación de cuenta para mostrar todo su contenido dentro de la altura disponible, sin desplazamiento vertical.
- Se mantienen el tamaño cómodo de los campos y la adaptación específica para móvil y escritorio.

## 2026-10-13 — `2026-10-13-padding-lateral-publico`

- Añadido más espacio lateral uniforme en toda la portada, su cabecera, sus secciones y el pie, también en móvil.

## 2026-10-13 — `2026-10-13-intercambio-cta-portada`

- Intercambiadas las acciones de la portada: «Acceder» pasa a ser el botón rojo principal y «Quiero información» queda como opción secundaria.

## 2026-10-13 — `2026-10-13-inicio-login-izquierda`

- Movido el acceso «Inicio» al lado izquierdo del formulario en las pantallas privadas de escritorio.
- En móvil, Team Ortega aparece arriba y el formulario comienza justo debajo, sin el gran espacio vacío anterior.

## 2026-10-13 — `2026-10-13-logo-hero-movil`

- Recuperado el emblema de Team Ortega en la portada móvil con un tamaño compacto que no vuelve a recargar la entrada.

## 2026-10-13 — `2026-10-13-hero-mas-compacto`

- Reducidos el titular, el casco y la altura de la primera sección de la portada.
- Al entrar se ven antes la explicación y los accesos principales, con una presentación menos abrumadora.

## 2026-10-13 — `2026-10-13-tipografia-archivo-dm-sans`

- Renovada la tipografía de toda la web con titulares Archivo y textos DM Sans.
- La nueva combinación mantiene el carácter deportivo, mejora la lectura y elimina el aspecto excesivamente estrecho anterior.
- Ajustado el logotipo textual para mantenerse en una sola línea en móvil.
- Reequilibrado el titular del formulario para evitar cortes con las nuevas proporciones.
- La primera comprobación de compilación no pudo descargar las fuentes por la red restringida del entorno; se repitió con acceso permitido y finalizó correctamente.

## 2026-10-13 — `2026-10-13-contacto-sin-correo`

- Retirada la opción de correo del formulario de información.
- Las nuevas solicitudes permiten elegir únicamente WhatsApp o llamada.

## 2026-10-13 — `2026-10-13-selector-prefijo-interno`

- Sustituido el menú gris del navegador por un selector de prefijo diseñado dentro del formulario de Team Ortega.
- El nuevo menú mantiene el teléfono directo y funciona también con teclado y en móvil.

## 2026-10-13 — `2026-10-13-identidad-editorial-publica`

- Rediseñada toda la experiencia pública de Team Ortega con una identidad deportiva editorial coherente en portada, formulario, acceso, privacidad y página no encontrada.
- Sustituidas las tarjetas y cajas redondeadas repetidas por diagonales, bloques a sangre, líneas divisorias, numeración y una jerarquía tipográfica más marcada.
- Integrados el selector de prefijo, el teléfono directo y la preferencia de contacto en el mismo lenguaje visual, también en móvil.
- El panel interno del entrenador y de los clientes no cambia.

## 2026-10-13 — `2026-10-13-contacto-telefono`

- Sustituido el desplegable nativo de contacto por opciones visibles de WhatsApp, llamada y correo.
- Añadido un campo de teléfono con prefijo internacional integrado para escribir el número directamente.

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
