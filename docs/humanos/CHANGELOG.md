# Registro de cambios humano

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
