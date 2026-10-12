# Manual del MVP

## Acceso del entrenador

La cuenta administradora entra por `/login` y se redirige a `/admin`. Desde el menú puede consultar:

- **Resumen:** cifras y últimas solicitudes.
- **Clientes:** estado, cuestionario y ficha completa.
- **Interesados:** datos de contacto y objetivo enviados desde la landing.
- **Entrenamientos y nutrición:** histórico de planes.
- **Seguimientos:** revisiones enviadas por clientes.
- **Cuotas:** registro manual de pendiente, pagada o exenta.

## Alta de un cliente

1. En **Clientes**, pulsa **Invitar cliente**.
2. Indica nombre y correo.
3. El cliente recibe un enlace para crear su contraseña.
4. Al entrar, completa el cuestionario inicial.
5. Desde su ficha, el entrenador publica entrenamiento y nutrición.

No existe registro abierto: todas las cuentas de cliente parten de una invitación.

## Experiencia del cliente

El cliente ve únicamente sus datos. Puede:

- completar o actualizar su cuestionario;
- consultar el último entrenamiento publicado;
- consultar la última pauta nutricional publicada;
- enviar una revisión con peso opcional, energía, adherencia y comentarios;
- recuperar o cambiar su contraseña mediante correo.

## Interesados

`/solicitar-informacion` es una URL no indexable con un formulario breve. El teléfono se escribe directamente junto a un selector de prefijo internacional y la vía de contacto se elige mediante opciones visibles de WhatsApp, llamada o correo. No pide lesiones, alergias ni otra información de salud. La solicitud aparece en **Interesados**.

## Cuotas

La sección de cuotas solo registra información interna. No cobra, no conecta con bancos y no almacena tarjetas. El responsable actualiza el estado manualmente.

## Datos sensibles

No se deben pegar analíticas completas ni fotografías en campos de texto. La primera versión omite esos archivos. Antes de abrir el servicio, hay que completar la política de privacidad e identificar al responsable del tratamiento.
