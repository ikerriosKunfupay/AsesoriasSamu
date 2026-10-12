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
- Los teléfonos usan un control compuesto con prefijo integrado y campo `tel`; el prefijo se abre en un menú propio negro y rojo, nunca en el selector gris nativo del sistema. Las elecciones cortas y excluyentes se presentan como radios visibles.
- `Badge`: estados compactos sin depender solo del color.
- `EmptyState`: vacíos accionables y consistentes.
- `DashboardShell`: navegación diferenciada para entrenador y cliente.
- `public-action`, `public-kicker`, `hero-mark` y `public-form`: lenguaje editorial compartido por landing, captación, acceso y páginas legales.

## Reglas de uso

- No introducir colores, radios o sombras arbitrarios dentro de features.
- En páginas públicas, evitar encerrar cada bloque en una tarjeta o contenedor redondeado; priorizar ritmo tipográfico, líneas, contraste y composición a sangre.
- Los CTA públicos usan remate diagonal y las acciones secundarias se presentan como enlaces subrayados. Los controles públicos son lineales; el panel mantiene las primitivas operativas estándar.
- Conservar una jerarquía de un `h1` por vista y encabezados secuenciales.
- Inputs de 16 px en móvil y objetivos táctiles de al menos 44 px.
- Foco siempre visible, contraste legible y reducción de movimiento respetada.
- Evitar tablas en móvil cuando sea posible; las tablas operativas existentes permiten desplazamiento horizontal.
- El rojo indica acción o marca, no texto largo.

## Contenido

El tono es directo, cercano y sin promesas clínicas o resultados inventados. No se publican testimonios, métricas o precios que no haya proporcionado el responsable.
