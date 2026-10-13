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

## Componentes

- `Button` y `ButtonLink`: variantes `primary`, `secondary`, `outline`, `ghost` y `danger`; tamaño táctil mínimo de 40–48 px.
- `Card`: contenedor estándar para contenido y formularios.
- `Field`, `Input`, `Textarea`: composición accesible de etiqueta, ayuda y error.
- `InternalSelect`: selector visual propio con semántica combobox/listbox, navegación por teclado y valor compatible con `FormData`; evita los menús nativos cuando el producto necesita una presentación interna consistente.
- Los teléfonos usan un control compuesto con prefijo integrado y campo `tel`; el prefijo se abre en un menú propio negro y rojo, nunca en el selector gris nativo del sistema. Las elecciones cortas y excluyentes se presentan como radios visibles.
- `Badge`: estados compactos sin depender solo del color.
- `EmptyState`: vacíos accionables y consistentes.
- `DashboardShell`: navegación diferenciada para entrenador y cliente.
- `public-action`, `public-kicker`, `hero-mark` y `public-form`: lenguaje editorial compartido por landing, captación, acceso y páginas legales.

## Reglas de uso

- No introducir colores, radios o sombras arbitrarios dentro de features.
- En páginas públicas, evitar encerrar cada bloque en una tarjeta o contenedor redondeado; priorizar ritmo tipográfico, líneas, contraste y composición a sangre.
- Todo el contenido público usa `page-shell` con un margen interior lateral constante: `1.5rem` en móvil y `3rem` desde tableta, aunque los fondos de sección continúen a sangre.
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
- El control para mostrar u ocultar la contraseña se reutiliza también en el login y conserva el propósito de autocompletado propio de cada formulario.
- En escritorio, el menú privado ocupa la altura visible y mantiene el usuario y **Cerrar sesión** accesibles al pie, independientemente de la longitud del contenido.
- En la cabecera privada móvil, el menú se sitúa a la izquierda y el emblema compacto a la derecha.
- El cuestionario del cliente usa una cuadrícula responsiva: cuatro datos físicos en escritorio amplio, dos columnas para respuestas narrativas y una sola columna en móvil. Las áreas de texto de una misma fila conservan la misma altura y las ayudas equivalentes reservan el mismo espacio.
- Los campos físicos no dependen de `type="number"`: edad filtra a enteros sin signo; peso y altura usan teclado decimal, aceptan coma o punto y delegan la normalización definitiva al esquema del servidor.
- El éxito del registro usa un diálogo modal marfil con acento rojo, mensaje de confirmación, CTA inmediato y redirección automática al login; no permanece como un aviso insertado dentro del formulario.
- Los enlaces de regreso de las páginas de acceso y captación se alinean siempre con el borde izquierdo de su contenido principal.
- Conservar una jerarquía de un `h1` por vista y encabezados secuenciales.
- Inputs de 16 px en móvil y objetivos táctiles de al menos 44 px.
- Foco siempre visible, contraste legible y reducción de movimiento respetada.
- Evitar tablas en móvil cuando sea posible; las tablas operativas existentes permiten desplazamiento horizontal.
- El rojo indica acción o marca, no texto largo.

## Contenido

El tono es directo, cercano y sin promesas clínicas o resultados inventados. No se publican testimonios, métricas o precios que no haya proporcionado el responsable.
