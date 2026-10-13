# Manual del MVP

## Experiencia pública

La portada, el formulario de información, el acceso, la recuperación de contraseña y la privacidad comparten una identidad deportiva editorial basada en negro, rojo y marfil. El contenido se organiza con tipografía, diagonales y separadores, sin una sucesión de tarjetas redondeadas. El panel privado mantiene una presentación más funcional para facilitar el trabajo diario.

## Acceso del entrenador

La cuenta administradora entra por `/login` y se redirige a `/admin`. Desde el menú puede consultar:

- **Resumen:** cinco indicadores compactos y un panel filtrable con ingresos, previsión, objetivos y composición de la cartera.
- **Interesados:** datos de contacto y objetivo enviados desde la landing.
- **Asesorías:** agrupa Clientes, Entrenamientos, Nutrición y Seguimientos. Incluye cuentas registradas o invitadas, alta o baja, condiciones, notas, cuestionarios, planes y revisiones.
- **Pagos:** agrupa Tarifas y Cuotas para separar los precios habituales del registro manual de pendiente, pagada o exenta.

El nombre de la cuenta y la opción **Cerrar sesión** permanecen visibles al pie del menú lateral aunque la página sea larga. La identidad de **Samuel Ortega** incluye el distintivo de cuenta verificada y funciona como acceso a **Perfil de administrador**, donde puede cambiar el nombre, el teléfono y su foto. La misma entrada está disponible dentro del menú móvil. En escritorio, una barra compacta sobre el contenido mantiene siempre en el mismo lugar la acción **Ocultar menú** o **Mostrar menú**, sin tapar el logo ni mezclarse con los enlaces; la elección se recuerda en ese navegador. **Asesorías** y **Pagos** ordenan visualmente sus enlaces sin añadir pasos ni ocultarlos en submenús. La sección actual queda remarcada tanto en el lateral como en el desplegable móvil y conserva ese contexto dentro de sus fichas o páginas internas. El menú lateral cambia también con el selector de tema: claro presenta fondo blanco y texto oscuro, mientras que oscuro recupera el fondo negro y el texto claro. En móvil, el cierre de sesión está dentro del menú superior y se mantiene la misma navegación agrupada.

La misma barra permite alternar entre **Modo claro** y **Modo oscuro**. La elección afecta a todo el panel privado, incluidas tablas, formularios, avisos y gráficas, se conserva en ese navegador y parte de la preferencia del sistema la primera vez. Las páginas públicas mantienen la identidad marfil y negra propia de Team Ortega.

El panel se ejecuta en la misma región europea que la base de datos para evitar esperas innecesarias. Durante una navegación interna, la estructura de la siguiente vista aparece inmediatamente y muestra un estado de carga hasta que llegan los datos. El resumen diferencia **Clientes registrados**, **Interesados nuevos**, **Cuestionarios recibidos**, **Seguimientos** y **Cuotas pendientes** en una sola fila compacta de escritorio. Al pulsar un indicador se abre un resumen con sus diez registros más recientes; cada fila lleva al registro concreto y, cuando existen más de diez, **Ver más** abre la sección completa. No se muestran respuestas de salud dentro de estos resúmenes.

Debajo aparece el bloque **Valor de las asesorías**. Muestra lo cobrado y pendiente, el valor recurrente de la cartera, el ticket medio, los clientes activos y una previsión del periodo siguiente. Los seis indicadores se pueden pulsar: abren un detalle que conserva los filtros, enseña hasta diez clientes, cuotas o periodos que explican la cifra y permite saltar a la ficha o cuota correspondiente; si existen más registros aparece **Ver más**. **Cobrado** lista quién ha pagado. **Pendiente**, en la vista mensual, reúne las cuotas pendientes y señala como **Sin registrar** a cada cliente activo que todavía no tenga una cuota creada ese mes, sin sumar un importe inexistente al total.

Las gráficas comparan ingresos, cartera y objetivo, distribuyen el valor por tarifa, separan presencial y virtual y enseñan las altas. El entrenador puede agrupar simultáneamente todo el bloque por día —últimos 14 días—, semana —últimas 12 semanas— o mes —últimos 12 meses— y combinarlo con modalidad y tarifa; los tres controles usan desplegables internos de Team Ortega y en escritorio permanecen alineados en una única fila. Mes usa el periodo contable de la cuota; día y semana usan la fecha de su última actualización manual. La cartera, el ticket y el objetivo mensual se prorratean a la escala escogida. También puede modificar sus propios objetivos de ingresos y clientes: ambos admiten únicamente cantidades positivas o cero, el objetivo económico acepta coma o punto decimal y no se permiten signos, letras ni símbolos. “Cobrado” depende de las cuotas marcadas manualmente como pagadas y la previsión combina esa cartera con la tendencia reciente. Se habla de ingresos y no de beneficio neto porque la aplicación no registra gastos.

La lista de **Interesados** carga primero las 100 solicitudes más recientes; una futura paginación permitirá consultar el histórico cuando se supere ese volumen.

La cuenta inicial designada para el entrenador está provisionada como administradora activa. El acceso comprueba primero el rol persistido y entra directamente al panel; el mecanismo de preparación inicial solo actúa si esa identidad todavía figura como cliente. El resto de registros continúa entrando siempre como cliente y la contraseña del administrador no se guarda en el código ni en las tablas de la aplicación.

## Registro y alta de un cliente

Una persona que todavía no tenga cuenta puede pulsar **Regístrate** desde `/login` y completar nombre, correo y una contraseña de al menos 8 caracteres. Cuando la cuenta se crea, aparece una confirmación y la web vuelve automáticamente al acceso; también permite ir al login de inmediato. Recibirá un correo de confirmación y, al abrirlo, accederá al cuestionario inicial. Si el mensaje no llega, desde el acceso puede abrir **No he recibido el correo de confirmación** y solicitar un nuevo enlace sin repetir el registro. Debe esperar al menos un minuto entre intentos y revisar también spam y promociones. El registro no solicita datos de salud; esos datos se recogen después, dentro de la cuenta y con consentimiento específico.

Un correo que ya pertenece a una cuenta —incluida la cuenta administradora— no puede registrarse de nuevo como cliente. En ese caso la web ya no muestra «Cuenta creada»: indica que no se ha generado una identidad nueva y ofrece iniciar sesión, recuperar la contraseña o reenviar la confirmación si todavía estuviera pendiente.

El entrenador también puede iniciar el alta desde el panel:

1. En **Clientes**, pulsa **Invitar cliente**.
2. Indica nombre y correo.
3. El cliente recibe un enlace para crear su contraseña.
4. Al entrar, completa el cuestionario inicial.
5. El entrenador publica entrenamiento y nutrición desde sus secciones propias o, como acceso rápido, desde la ficha del cliente.

La lista y la ficha permiten dar de alta o de baja a cada cliente mediante un interruptor. Su selector permanece dentro de la pista y separado de la etiqueta **Activo/Inactivo**. Un cliente dado de baja conserva su información, pero no puede acceder al área privada hasta que el entrenador vuelva a activarlo. El entrenador también puede guardar una nota interna desde la propia fila de la tabla o desde la ficha; se guarda automáticamente mientras escribe, sin añadir una línea de estado permanente a la fila, ambas zonas muestran el mismo apunte y nunca aparece en la cuenta del cliente.

Cada cliente admite condiciones comerciales privadas: modalidad **Presencial** o **Virtual**, una tarifa y el precio realmente acordado. Cada plantilla de tarifa define también su modalidad y de uno a siete días por semana, de forma que, por ejemplo, **Mensual · Presencial · 3 días** y **Mensual · Virtual · 5 días** sean opciones distintas. Los precios no admiten valores negativos. Las tarifas creadas pueden verse como tabla, lista o galería y la elección se recuerda en ese navegador; **Editar** abre el mismo formulario desde cualquiera de las tres vistas. Modalidad, tarifa y periodicidad usan siempre desplegables internos de Team Ortega, tanto en la tabla y la ficha como al crear o editar una tarifa; al cambiar la tarifa se propone su precio habitual y su modalidad. Los desplegables y el menú de tres puntos flotan sobre la tabla para no quedar recortados; este último agrupa el ajuste de precio, la creación de nuevas tarifas, la gestión del catálogo y el acceso a la ficha, evitando botones permanentes en cada fila. En móvil, cada cliente se presenta como una tarjeta completa en lugar de obligar a desplazar una tabla horizontal. Las tarifas Mensual, Semestral y Anual se prorratean en el resumen; una tarifa personalizada indica además cuántos meses cubre. El botón **Filtros** despliega criterios independientes para cliente, alta/baja, cuestionario, modalidad, tarifa, rango de precio y notas; cerrado no ocupa altura adicional y muestra cuántos criterios están activos. Cada cabecera mantiene el ciclo de orden ascendente, descendente y original.

La ficha adapta su botón **Volver** al lugar desde el que se abrió: regresa a Resumen cuando se accedió desde un indicador, a Clientes desde la tabla y a Entrenamientos, Nutrición o Seguimientos desde esas secciones. El teléfono se presenta siempre con su prefijo internacional; los números antiguos sin prefijo explícito se interpretan como españoles (`+34`). Si se abre un enlace directo sin origen reconocido, vuelve a Clientes como destino seguro.

**Entrenamientos** y **Nutrición** abren con su histórico ocupando todo el ancho útil. Un interruptor permite mostrar el formulario de creación sin abandonar la sección, elegir un cliente activo, redactar el contenido y decidir si se publica o queda como borrador. Al mostrarlo, el listado se reajusta a su lado en escritorio; al ocultarlo recupera todo el ancho. Ambos historiales se paginan cada diez registros y siguen enlazando a la ficha del cliente. Los formularios de la ficha se mantienen como atajo opcional.

En ambos casos la cuenta se crea siempre con rol de cliente. El formulario público no permite solicitar ni escoger el rol de administrador.

## Experiencia del cliente

El cliente ve únicamente sus datos. Antes de consultar el resto del área personal debe completar el cuestionario inicial. Mientras esté pendiente, cualquier acceso a Inicio, Entrenamiento, Nutrición o Seguimiento muestra un aviso y mantiene al cliente en el cuestionario. Al guardarlo correctamente, toda la navegación queda desbloqueada.

El cuestionario se divide en cinco pasos visuales: **Datos físicos**, **Rutina y disponibilidad**, **Alimentación y objetivos**, **Salud y necesidades específicas** e **Información adicional y consentimiento**. Los cuatro datos físicos forman una cuadrícula de dos columnas desde tableta, mientras que en móvil se apilan; la explicación de la altura queda bajo el grupo completo para no desalinear un único control. Las áreas de texto emparejadas conservan la misma altura. La edad solo permite números enteros positivos y mantiene el rango de 16 a 90 años. Peso y altura aceptan decimales escritos con coma o punto. La altura puede indicarse como `1,69` metros o `169` centímetros, pero siempre se guarda normalizada en centímetros. El sexo se elige mediante un desplegable propio de Team Ortega, no mediante el menú visual del navegador.

Los campos que requieren una respuesta desarrollada muestran un `?` junto a su título. Al pulsarlo aparece una explicación específica, ejemplos de información útil y el recordatorio de que una respuesta más concreta permite adaptar mejor el plan. Las ayudas de lesiones y alergias solicitan solo información práctica y recuerdan que no se deben copiar diagnósticos, historiales ni informes médicos completos.

El aviso general sobre datos de salud puede ocultarse con su `X`. El consentimiento final continúa siendo obligatorio: si se intenta guardar sin marcarlo, la web evita el aviso genérico del navegador, muestra un toast cerrable con la explicación y resalta en rojo la casilla hasta corregirla.

Las redes sociales son opcionales y permanecen dentro de un bloque desplegable de bordes redondeados para no alargar el cuestionario. El cliente puede elegir Instagram, X, Snapchat, TikTok, YouTube, Facebook, LinkedIn o Twitch, escribir únicamente su usuario y dejar que la web complete la URL. Puede añadir varios perfiles o eliminar cualquiera antes de guardar. En la ficha del cliente, el entrenador los ve como enlaces directos.

En móvil, el botón de navegación queda a la izquierda de la cabecera privada y el emblema de Team Ortega a la derecha.

Después puede:

- completar o actualizar su cuestionario;
- abrir **Ajustes** para cambiar su foto, nombre, teléfono, correo o contraseña;
- consultar el último entrenamiento publicado;
- consultar la última pauta nutricional publicada;
- enviar una revisión con peso opcional, energía, adherencia y comentarios;
- recuperar o cambiar su contraseña mediante correo.

En el acceso se puede mostrar u ocultar la contraseña mediante el icono del propio campo.

Si se publica una versión nueva mientras alguien mantiene abierto el acceso, la web identifica el cambio de versión para evitar enviar el formulario al despliegue equivocado. Si una pestaña muy antigua no pudiera recuperarse automáticamente, muestra una pantalla propia con la opción **Recargar acceso**; la cuenta no queda bloqueada y basta con volver a introducir los datos.

La foto de perfil admite JPG, PNG o WebP de hasta 2 MB y se mantiene privada. Puede pulsarse para verla ampliada o eliminarse para volver a mostrar las iniciales. Estas mismas reglas protegen la foto del perfil del entrenador.

El correo no se edita directamente. Al solicitar el cambio, Team Ortega envía un enlace al correo actual para comprobar la identidad; al abrirlo aparece un formulario emergente para indicar la nueva dirección. Cuando se guarda, Ajustes muestra automáticamente el correo actualizado. El cambio de contraseña sigue el mismo principio: primero se recibe un enlace seguro en el correo actual y después se elige la nueva contraseña en un formulario emergente. Ambos correos conservan el diseño y el emblema de Team Ortega. El entrenador puede consultar la foto y los datos de contacto actualizados desde la ficha del cliente.

El teléfono de Ajustes separa el prefijo internacional y el número dentro de un único control. El prefijo se elige mediante el desplegable propio de Team Ortega, no mediante el selector nativo del navegador. Los avisos pueden cerrarse con la X y, cuando informan de una operación correcta, desaparecen solos después de cinco segundos.

## Interesados

`/solicitar-informacion` es una URL no indexable con un formulario breve. En escritorio, el contenido se compacta para encajar completo en la altura visible sin scroll de página; en móvil conserva el desplazamiento vertical para que ningún campo quede recortado. El teléfono se escribe directamente junto a un selector interno de prefijo internacional, diseñado como parte de la propia web, y la vía de contacto se elige mediante opciones visibles de WhatsApp o llamada. No pide lesiones, alergias ni otra información de salud. La confirmación solo aparece después de que la base de datos devuelva la fila guardada e incluye una referencia breve; esa misma referencia se muestra en **Interesados** para poder comprobar el envío. Esta sección aparece antes que **Clientes** en el menú del entrenador. Una solicitud no pasa a **Clientes** hasta que exista una cuenta registrada o invitada.

La base de datos permite este guardado únicamente mediante el backend privado de Team Ortega. El navegador y los visitantes anónimos no reciben acceso directo a la tabla de interesados.

## Cuotas

La sección de cuotas solo registra información interna. No cobra, no conecta con bancos y no almacena tarjetas. El responsable actualiza el estado manualmente. **Tarifas** describe el precio y la duración habitual del servicio; **Cuotas** deja constancia de lo que se ha cobrado, está pendiente o se ha eximido en un mes concreto. Esta separación permite que el resumen compare cartera prevista con cobros reales.

La pantalla abre con la tabla ocupando todo el ancho útil. El interruptor **Registrar cuota** muestra u oculta el formulario sin abandonar la lista; sus campos se apilan cuando el espacio es estrecho para que periodo, importe y estado no se solapen. **Filtros** permite buscar por cliente o nota y acotar por periodo, estado e importe mínimo o máximo. Cada fila se puede editar o eliminar, con confirmación antes del borrado. Se muestran como máximo diez cuotas por página y, en móvil, cada registro se transforma en una tarjeta dentro del padding habitual, sin desplazamiento horizontal.

## Datos sensibles

No se deben pegar analíticas completas ni fotografías en campos de texto. La primera versión omite esos archivos. Antes de abrir el servicio, hay que completar la política de privacidad e identificar al responsable del tratamiento.
