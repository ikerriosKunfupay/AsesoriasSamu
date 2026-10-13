# Manual del MVP

## Experiencia pública

La portada, el formulario de información, el acceso, la recuperación de contraseña y la privacidad comparten una identidad deportiva editorial basada en negro, rojo y marfil. El contenido se organiza con tipografía, diagonales y separadores, sin una sucesión de tarjetas redondeadas. El panel privado mantiene una presentación más funcional para facilitar el trabajo diario.

## Acceso del entrenador

La cuenta administradora entra por `/login` y se redirige a `/admin`. Desde el menú puede consultar:

- **Resumen:** cinco indicadores compactos y un panel filtrable con ingresos, previsión, objetivos y composición de la cartera.
- **Interesados:** datos de contacto y objetivo enviados desde la landing.
- **Clientes:** cuentas registradas o invitadas, alta o baja, modalidad, tarifa, precio, notas internas, cuestionario y ficha completa.
- **Entrenamientos y nutrición:** histórico de planes.
- **Seguimientos:** revisiones enviadas por clientes.
- **Tarifas:** precios habituales reutilizables para asignar las condiciones de cada asesoría.
- **Cuotas:** registro manual de pendiente, pagada o exenta.

El nombre de la cuenta y la opción **Cerrar sesión** permanecen visibles al pie del menú lateral aunque la página sea larga. En escritorio, el botón de la cabecera del propio lateral permite ocultarlo para ampliar el espacio de trabajo; mientras está cerrado aparece **Mostrar menú** y la elección se recuerda en ese navegador. En móvil, el cierre de sesión está dentro del menú superior y se mantiene la navegación desplegable.

El panel se ejecuta en la misma región europea que la base de datos para evitar esperas innecesarias. Durante una navegación interna, la estructura de la siguiente vista aparece inmediatamente y muestra un estado de carga hasta que llegan los datos. El resumen diferencia **Clientes registrados**, **Interesados nuevos**, **Cuestionarios recibidos**, **Seguimientos** y **Cuotas pendientes** en una sola fila compacta de escritorio. Al pulsar un indicador se abre un resumen con sus diez registros más recientes; cada fila lleva al registro concreto y, cuando existen más de diez, **Ver más** abre la sección completa. No se muestran respuestas de salud dentro de estos resúmenes.

Debajo aparece el bloque **Valor de las asesorías**. Muestra lo cobrado y pendiente del mes, el valor recurrente mensual de la cartera, el ticket medio, los clientes activos y una previsión del mes siguiente. Las gráficas comparan ingresos, cartera y objetivo, distribuyen el valor por tarifa, separan presencial y virtual y enseñan las altas por mes. El entrenador puede filtrar simultáneamente todo el bloque por 3, 6 o 12 meses, modalidad y tarifa, y modificar sus propios objetivos de ingresos y clientes. “Cobrado” depende de las cuotas marcadas manualmente como pagadas; “cartera” prorratea el precio entre los meses de la tarifa; la previsión combina esa cartera con la tendencia reciente. Se habla de ingresos y no de beneficio neto porque la aplicación no registra gastos.

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
5. Desde su ficha, el entrenador publica entrenamiento y nutrición.

La lista y la ficha permiten dar de alta o de baja a cada cliente mediante un interruptor. Un cliente dado de baja conserva su información, pero no puede acceder al área privada hasta que el entrenador vuelva a activarlo. El entrenador también puede guardar una nota interna desde la propia fila de la tabla o desde la ficha; ambas zonas muestran y editan la misma nota, que nunca aparece en la cuenta del cliente.

Cada cliente admite condiciones comerciales privadas: modalidad **Presencial** o **Virtual**, una tarifa y el precio realmente acordado. Al elegir una tarifa se propone su precio habitual, pero puede cambiarse solo para esa persona. Las tarifas Mensual, Semestral y Anual se prorratean en el resumen; una tarifa personalizada indica además cuántos meses cubre. El menú **Tarifas** permite crear, modificar o retirar opciones del selector sin borrar la asignación histórica de clientes que ya la utilizaban. La tabla de Clientes muestra modalidad, tarifa y precio y puede buscar y ordenar por cualquiera de estos datos, además de cliente, estado, cuestionario y nota. Cada cabecera recorre orden ascendente, descendente y orden original al pulsarla sucesivamente.

La ficha adapta su botón **Volver** al lugar desde el que se abrió: regresa a Resumen cuando se accedió desde un indicador, a Clientes desde la tabla y a Entrenamientos, Nutrición o Seguimientos desde esas secciones. Si se abre un enlace directo sin origen reconocido, vuelve a Clientes como destino seguro.

En ambos casos la cuenta se crea siempre con rol de cliente. El formulario público no permite solicitar ni escoger el rol de administrador.

## Experiencia del cliente

El cliente ve únicamente sus datos. Antes de consultar el resto del área personal debe completar el cuestionario inicial. Mientras esté pendiente, cualquier acceso a Inicio, Entrenamiento, Nutrición o Seguimiento muestra un aviso y mantiene al cliente en el cuestionario. Al guardarlo correctamente, toda la navegación queda desbloqueada.

El cuestionario se presenta en una cuadrícula regular: los campos de una misma fila conservan el mismo ancho y las áreas de texto emparejadas tienen la misma altura. La edad solo permite números enteros positivos y mantiene el rango de 16 a 90 años. Peso y altura aceptan decimales escritos con coma o punto. La altura puede indicarse como `1,69` metros o `169` centímetros, pero siempre se guarda normalizada en centímetros. El sexo se elige mediante un desplegable propio de Team Ortega, no mediante el menú visual del navegador.

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

La foto de perfil admite JPG, PNG o WebP de hasta 2 MB y se mantiene privada. Puede pulsarse para verla ampliada o eliminarse para volver a mostrar las iniciales.

El correo no se edita directamente. Al solicitar el cambio, Team Ortega envía un enlace al correo actual para comprobar la identidad; al abrirlo aparece un formulario emergente para indicar la nueva dirección. Cuando se guarda, Ajustes muestra automáticamente el correo actualizado. El cambio de contraseña sigue el mismo principio: primero se recibe un enlace seguro en el correo actual y después se elige la nueva contraseña en un formulario emergente. Ambos correos conservan el diseño y el emblema de Team Ortega. El entrenador puede consultar la foto y los datos de contacto actualizados desde la ficha del cliente.

El teléfono de Ajustes separa el prefijo internacional y el número dentro de un único control. El prefijo se elige mediante el desplegable propio de Team Ortega, no mediante el selector nativo del navegador. Los avisos pueden cerrarse con la X y, cuando informan de una operación correcta, desaparecen solos después de cinco segundos.

## Interesados

`/solicitar-informacion` es una URL no indexable con un formulario breve. El teléfono se escribe directamente junto a un selector interno de prefijo internacional, diseñado como parte de la propia web, y la vía de contacto se elige mediante opciones visibles de WhatsApp o llamada. No pide lesiones, alergias ni otra información de salud. La confirmación solo aparece después de que la base de datos devuelva la fila guardada e incluye una referencia breve; esa misma referencia se muestra en **Interesados** para poder comprobar el envío. Esta sección aparece antes que **Clientes** en el menú del entrenador. Una solicitud no pasa a **Clientes** hasta que exista una cuenta registrada o invitada.

La base de datos permite este guardado únicamente mediante el backend privado de Team Ortega. El navegador y los visitantes anónimos no reciben acceso directo a la tabla de interesados.

## Cuotas

La sección de cuotas solo registra información interna. No cobra, no conecta con bancos y no almacena tarjetas. El responsable actualiza el estado manualmente. **Tarifas** describe el precio y la duración habitual del servicio; **Cuotas** deja constancia de lo que se ha cobrado, está pendiente o se ha eximido en un mes concreto. Esta separación permite que el resumen compare cartera prevista con cobros reales.

## Datos sensibles

No se deben pegar analíticas completas ni fotografías en campos de texto. La primera versión omite esos archivos. Antes de abrir el servicio, hay que completar la política de privacidad e identificar al responsable del tratamiento.
