# Sistema de diseño

## Identidad

Team Ortega utiliza una estética deportiva editorial: negro como base, rojo para acción, blanco y marfil para contraste y grises fríos en las superficies operativas. El emblema del casco es la marca principal y también genera los iconos de aplicación.

La experiencia pública evita composiciones basadas en una sucesión de tarjetas. La identidad se construye con bloques a sangre, diagonales, separadores lineales, numeración grande y titulares condensados. Las tarjetas se reservan para el producto interno cuando ayudan a agrupar datos o acciones.

## Fuente de verdad

- Tokens: `src/app/globals.css`.
- Primitivas: `src/components/ui/`.
- Composición de navegación: `src/components/layout/`.
- Marca: `src/components/brand/logo.tsx` y `public/brand/team-ortega-mark.png`.

## Tipografía

- **Archivo:** titulares, cifras y elementos de marca. Se usa en pesos altos para dar contundencia sin recurrir a una fuente extremadamente estrecha.
- **DM Sans:** texto, navegación, formularios y superficies operativas. Prioriza lectura clara tanto en móvil como en escritorio.
- Ambas se cargan con `next/font`, quedan alojadas por la propia aplicación y no generan peticiones del navegador a proveedores externos.

## Tokens principales

| Uso | Token | Valor inicial |
| --- | --- | --- |
| Acción | `--primary` | `#e52d2d` |
| Fondo | `--background` | `#f5f6f8` |
| Superficie | `--surface` | `#ffffff` |
| Texto | `--foreground` | `#121316` |
| Fondo inverso | `--surface-inverse` | `#111214` |
| Borde | `--border` | `#dfe2e7` |
| Texto secundario | `--muted` | `#626873` |

Los estados semánticos tienen tokens propios: `success`, `warning` y `danger`, cada uno con una superficie suave asociada.

El producto privado dispone de temas claro y oscuro mediante `data-theme` en `<html>`. Ambos reutilizan los mismos tokens semánticos; no se deben introducir variantes `dark:` aisladas en cada feature. La preferencia se guarda como `team-ortega:theme`, se aplica antes de hidratar para evitar parpadeos y, si todavía no existe, respeta la preferencia del sistema. La identidad editorial pública conserva su paleta marfil y negra independientemente de la elección del panel.

El sidebar forma parte del tema del panel: usa los tokens `sidebar-background`, `sidebar-foreground`, `sidebar-muted`, `sidebar-hover` y `sidebar-border`. En claro es una superficie blanca con texto oscuro; en oscuro recupera el fondo negro y el contraste claro de la identidad. No se deben fijar clases `zinc` o `text-white` directamente en su composición.

## Componentes

- `Button` y `ButtonLink`: variantes `primary`, `secondary`, `outline`, `ghost` y `danger`; tamaño táctil mínimo de 40–48 px.
- Los KPI accionables se presentan como botones completos, con foco visible, indicación direccional y `aria-haspopup="dialog"`. Su modal conserva el contexto del filtro, muestra como máximo diez filas, permite cerrar con `Escape` o pulsando el fondo y devuelve el foco a la tarjeta de origen.
- Los KPI económicos adaptan sus sustantivos y explicaciones a la granularidad elegida: día, semana o mes. **Cobrado** y **Pendiente** deben explicar de forma explícita que se pulsan para identificar personas y cuotas; la ausencia de una cuota mensual se distingue como **Sin registrar**, no como importe pendiente inventado.
- La gestión de cuotas no depende de una tabla ancha desplazable: en escritorio distribuye columnas dentro del ancho útil y en móvil convierte cada fila en tarjeta. El formulario opcional se apila dentro de su columna y la paginación limita la tabla a diez registros por vista.
- `Card`: contenedor estándar para contenido y formularios.
- `Field`, `Input`, `Textarea`: composición accesible de etiqueta, ayuda y error.
- `FieldHelp`: botón `?` opcional junto a la etiqueta que abre una ayuda contextual en diálogo; usa textos específicos por campo, admite teclado y devuelve el foco al disparador al cerrarse.
- `InternalSelect`: selector visual propio con semántica combobox/listbox, navegación por teclado y valor compatible con `FormData`; evita los menús nativos cuando el producto necesita una presentación interna consistente. Admite apertura superior, renderizado flotante en `document.body` para escapar de contenedores con scroll y una altura compacta mediante clases del consumidor. El disparador conserva separación entre texto y flecha y padding derecho suficiente para que el icono nunca toque el borde.
- `SocialNetworksField`: bloque desplegable, compacto y redondeado que compone `InternalSelect` con icono, prefijo de URL, usuario y acciones de añadir o eliminar. Los perfiles opcionales no deben ocupar altura cuando no se editan ni repetir instrucciones dentro del panel.
- `ProfileAvatar`: avatar circular con borde de marca, imagen privada mediante URL firmada e iniciales como estado de respaldo.
- Los teléfonos usan un control compuesto con prefijo integrado y campo `tel`; el prefijo se abre en un menú propio negro y rojo, nunca en el selector gris nativo del sistema. Las elecciones cortas y excluyentes se presentan como radios visibles.
- `Badge`: estados compactos sin depender solo del color.
- `EmptyState`: vacíos accionables y consistentes.
- `DashboardShell`: navegación diferenciada para entrenador y cliente, sección actual remarcada en escritorio y móvil mediante `aria-current`, control lateral estable en la barra superior y selector de tema.
- `PricingPlansCatalog`: selector segmentado de tabla, lista y galería; todas las vistas resumen la misma plantilla y abren un único editor modal para mantener coherencia funcional.
- `public-action`, `public-kicker`, `hero-mark` y `public-form`: lenguaje editorial compartido por landing, captación, acceso y páginas legales.

## Reglas de uso

- No introducir colores, radios o sombras arbitrarios dentro de features.
- En páginas públicas, evitar encerrar cada bloque en una tarjeta o contenedor redondeado; priorizar ritmo tipográfico, líneas, contraste y composición a sangre.
- Todo el contenido público usa `page-shell` con un margen interior lateral constante: `1.5rem` en móvil y `3rem` desde tableta, aunque los fondos de sección continúen a sangre.
- El formulario público de captación debe encajar en un viewport de escritorio sin scroll de página; el ajuste de altura y espaciado se limita a `lg` para no cortar contenido en móvil.
- El hero de entrada debe dejar visibles la propuesta, la explicación y las acciones principales sin ocupar de forma agobiante toda la primera pantalla; reservar los tamaños extremos para acentos puntuales.
- El emblema de marca debe seguir visible en el hero móvil como un recurso compacto y secundario, sin desplazar el contenido principal ni competir con los CTA.
- Los CTA públicos usan remate diagonal y las acciones secundarias se presentan como enlaces subrayados. Los controles públicos son lineales; el panel mantiene las primitivas operativas estándar.
- En la portada, «Acceder» se reserva para la cabecera; el hero muestra únicamente «Quiero información» para evitar duplicar el acceso en la misma pantalla.
- La sección «Cómo funciona» se apila hasta `xl`; sus columnas usan `minmax(0, …)` y nunca deben generar desplazamiento horizontal.
- En móvil, los pasos de «Cómo funciona» usan un carrusel con vista parcial de la siguiente tarjeta, contador, paginación y flechas; desde `md` se muestra la lista completa.
- En las vistas de autenticación, la cabecera móvil comienza cerca del borde superior y presenta la marca antes del formulario; en escritorio, el regreso a Inicio se alinea con el borde izquierdo del formulario.
- El registro se ajusta al alto visible del dispositivo sin desplazamiento de página; para conseguirlo compacta únicamente sus separaciones, conserva controles táctiles de al menos 44 px y no altera el resto de vistas de autenticación. En móviles de poca altura, los errores de campo permanecen disponibles para tecnologías de asistencia pero salen del flujo visual, porque el toast y el borde rojo ya comunican el fallo sin recortar las acciones.
- Los campos que comparten fila se alinean desde arriba; una ayuda o un error bajo un campo no debe desplazar verticalmente el control contiguo.
- La validación del registro evita los avisos nativos del navegador: muestra el error en un toast cerrable mediante una `X` etiquetada y marca en rojo cada control afectado. Los campos de contraseña incluyen una acción accesible para mostrar u ocultar su contenido.
- El consentimiento sanitario del cuestionario sigue la misma validación propia: el error aparece en `FormErrorToast`, la casilla y su contenedor se marcan en rojo y el mensaje queda asociado mediante `aria-describedby`. Los avisos informativos independientes pueden usar `DismissibleNotice`, cuya `X` no sustituye ni modifica consentimientos obligatorios.
- El control para mostrar u ocultar la contraseña se reutiliza también en el login y conserva el propósito de autocompletado propio de cada formulario.
- En escritorio, el menú privado ocupa la altura visible y mantiene el usuario y **Cerrar sesión** accesibles al pie, independientemente de la longitud del contenido.
- Los formularios administrativos de una sola tarea, como **Nueva invitación**, centran cabecera y superficie en un único contenedor de ancho legible; no se centra el texto de etiquetas ni campos.
- En la cabecera privada móvil, el menú se sitúa a la izquierda y el emblema compacto a la derecha.
- El cuestionario del cliente se estructura en bloques numerados con título y descripción. Los cuatro datos físicos usan una cuadrícula de dos columnas desde `sm`, las respuestas narrativas forman pares desde `lg` y todo vuelve a una sola columna en móvil. Las ayudas que afectan solo a un campo pero rompen la alineación de la fila deben colocarse bajo el grupo y conservar su asociación ARIA.
- Los campos narrativos del cuestionario muestran ayuda contextual mediante `FieldHelp`. La explicación siempre relaciona el nivel de detalle con una mejor adaptación del plan; en salud debe pedir solo información práctica y prohibir informes completos.
- Las redes sociales del cuestionario se recogen como perfiles estructurados, nunca como un textarea libre. En móvil cada perfil apila selector, usuario y acción; en escritorio mantiene una sola fila.
- Los campos físicos no dependen de `type="number"`: edad filtra a enteros sin signo; peso y altura usan teclado decimal, aceptan coma o punto y delegan la normalización definitiva al esquema del servidor.
- El éxito del registro usa un diálogo modal marfil con acento rojo, mensaje de confirmación, CTA inmediato y redirección automática al login; no permanece como un aviso insertado dentro del formulario.
- Los enlaces de regreso de las páginas de acceso y captación se alinean siempre con el borde izquierdo de su contenido principal.
- Conservar una jerarquía de un `h1` por vista y encabezados secuenciales.
- Inputs de 16 px en móvil y objetivos táctiles de al menos 44 px.
- Foco siempre visible, contraste legible y reducción de movimiento respetada.
- Evitar tablas en móvil cuando sea posible. La gestión de clientes transforma cada fila en una tarjeta vertical; las demás tablas operativas existentes pueden mantener desplazamiento horizontal.
- El rojo indica acción o marca, no texto largo.

## Contenido

El tono es directo, cercano y sin promesas clínicas o resultados inventados. No se publican testimonios, métricas o precios que no haya proporcionado el responsable.
