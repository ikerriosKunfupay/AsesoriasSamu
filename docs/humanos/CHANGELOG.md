# Registro de cambios humano

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
