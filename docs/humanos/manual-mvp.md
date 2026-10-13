# Manual del MVP

## Experiencia pública

La portada, el formulario de información, el acceso, la recuperación de contraseña y la privacidad comparten una identidad deportiva editorial basada en negro, rojo y marfil. El contenido se organiza con tipografía, diagonales y separadores, sin una sucesión de tarjetas redondeadas. El panel privado mantiene una presentación más funcional para facilitar el trabajo diario.

## Acceso del entrenador

La cuenta administradora entra por `/login` y se redirige a `/admin`. Desde el menú puede consultar:

- **Resumen:** cifras y últimas solicitudes.
- **Clientes:** estado, cuestionario y ficha completa.
- **Interesados:** datos de contacto y objetivo enviados desde la landing.
- **Entrenamientos y nutrición:** histórico de planes.
- **Seguimientos:** revisiones enviadas por clientes.
- **Cuotas:** registro manual de pendiente, pagada o exenta.

El nombre de la cuenta y la opción **Cerrar sesión** permanecen visibles al pie del menú lateral aunque la página sea larga. En móvil, el cierre de sesión está dentro del menú superior.

## Registro y alta de un cliente

Una persona que todavía no tenga cuenta puede pulsar **Regístrate** desde `/login` y completar nombre, correo y contraseña. Cuando la cuenta se crea, aparece una confirmación y la web vuelve automáticamente al acceso; también permite ir al login de inmediato. Recibirá un correo de confirmación y, al abrirlo, accederá al cuestionario inicial. El registro no solicita datos de salud; esos datos se recogen después, dentro de la cuenta y con consentimiento específico.

El entrenador también puede iniciar el alta desde el panel:

1. En **Clientes**, pulsa **Invitar cliente**.
2. Indica nombre y correo.
3. El cliente recibe un enlace para crear su contraseña.
4. Al entrar, completa el cuestionario inicial.
5. Desde su ficha, el entrenador publica entrenamiento y nutrición.

En ambos casos la cuenta se crea siempre con rol de cliente. El formulario público no permite solicitar ni escoger el rol de administrador.

## Experiencia del cliente

El cliente ve únicamente sus datos. Antes de consultar el resto del área personal debe completar el cuestionario inicial. Mientras esté pendiente, cualquier acceso a Inicio, Entrenamiento, Nutrición o Seguimiento muestra un aviso y mantiene al cliente en el cuestionario. Al guardarlo correctamente, toda la navegación queda desbloqueada.

El cuestionario se presenta en una cuadrícula regular: los campos de una misma fila conservan el mismo ancho y las áreas de texto emparejadas tienen la misma altura. La edad solo permite números enteros positivos y mantiene el rango de 16 a 90 años. Peso y altura aceptan decimales escritos con coma o punto, pero se guardan como valores numéricos normalizados. El sexo se elige mediante un desplegable propio de Team Ortega, no mediante el menú visual del navegador.

Los campos que requieren una respuesta desarrollada muestran un `?` junto a su título. Al pulsarlo aparece una explicación específica, ejemplos de información útil y el recordatorio de que una respuesta más concreta permite adaptar mejor el plan. Las ayudas de lesiones y alergias solicitan solo información práctica y recuerdan que no se deben copiar diagnósticos, historiales ni informes médicos completos.

Las redes sociales son opcionales y permanecen dentro de un bloque desplegable de bordes redondeados para no alargar el cuestionario. El cliente puede elegir Instagram, X, Snapchat, TikTok, YouTube, Facebook, LinkedIn o Twitch, escribir únicamente su usuario y dejar que la web complete la URL. Puede añadir varios perfiles o eliminar cualquiera antes de guardar. En la ficha del cliente, el entrenador los ve como enlaces directos.

En móvil, el botón de navegación queda a la izquierda de la cabecera privada y el emblema de Team Ortega a la derecha.

Después puede:

- completar o actualizar su cuestionario;
- consultar el último entrenamiento publicado;
- consultar la última pauta nutricional publicada;
- enviar una revisión con peso opcional, energía, adherencia y comentarios;
- recuperar o cambiar su contraseña mediante correo.

En el acceso se puede mostrar u ocultar la contraseña mediante el icono del propio campo.

## Interesados

`/solicitar-informacion` es una URL no indexable con un formulario breve. El teléfono se escribe directamente junto a un selector interno de prefijo internacional, diseñado como parte de la propia web, y la vía de contacto se elige mediante opciones visibles de WhatsApp o llamada. No pide lesiones, alergias ni otra información de salud. La solicitud aparece en **Interesados**.

## Cuotas

La sección de cuotas solo registra información interna. No cobra, no conecta con bancos y no almacena tarjetas. El responsable actualiza el estado manualmente.

## Datos sensibles

No se deben pegar analíticas completas ni fotografías en campos de texto. La primera versión omite esos archivos. Antes de abrir el servicio, hay que completar la política de privacidad e identificar al responsable del tratamiento.
