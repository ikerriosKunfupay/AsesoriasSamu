# Sistema de diseño

## Identidad

Team Ortega utiliza una estética deportiva sobria: negro como base, rojo para acción, blanco para contraste y grises fríos para superficies. El emblema del casco es la marca principal y también genera los iconos de aplicación.

## Fuente de verdad

- Tokens: `src/app/globals.css`.
- Primitivas: `src/components/ui/`.
- Composición de navegación: `src/components/layout/`.
- Marca: `src/components/brand/logo.tsx` y `public/brand/team-ortega-mark.png`.

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
- Los teléfonos usan un control compuesto con prefijo integrado y campo `tel`; las elecciones cortas y excluyentes se presentan como radios visibles, no como desplegables nativos.
- `Badge`: estados compactos sin depender solo del color.
- `EmptyState`: vacíos accionables y consistentes.
- `DashboardShell`: navegación diferenciada para entrenador y cliente.

## Reglas de uso

- No introducir colores, radios o sombras arbitrarios dentro de features.
- Conservar una jerarquía de un `h1` por vista y encabezados secuenciales.
- Inputs de 16 px en móvil y objetivos táctiles de al menos 44 px.
- Foco siempre visible, contraste legible y reducción de movimiento respetada.
- Evitar tablas en móvil cuando sea posible; las tablas operativas existentes permiten desplazamiento horizontal.
- El rojo indica acción o marca, no texto largo.

## Contenido

El tono es directo, cercano y sin promesas clínicas o resultados inventados. No se publican testimonios, métricas o precios que no haya proporcionado el responsable.
