---
target: inicio del lading page de la plataforma
total_score: 29
p0_count: 0
p1_count: 2
timestamp: 2026-06-15T14-16-43Z
slug: src-app-storefront-page-tsx
---
# Design Critique: inicio del lading page de la plataforma

## Heuristic Usability Scores

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Los cargadores y loaders de planes de suscripción son correctos, pero falta feedback dinámico en los CTAs de checkout. |
| 2 | Match System / Real World | 4 | Nomenclatura excelente y con fuerte arraigo cultural e histórico en el portal. |
| 3 | User Control and Freedom | 3 | Sin opciones de deshacer filtros en algunas partes del catálogo, pero navegación de escape limpia. |
| 4 | Consistency and Standards | 3 | Consistente con el manual, pero se abusa de una sola familia tipográfica (Inter) sin pares editoriales. |
| 5 | Error Prevention | 3 | Formularios con Zod e inputs bien acotados previenen fallos comunes. |
| 6 | Recognition Rather Than Recall | 3 | Descripciones legibles, pero algunos iconos de la cabecera son abstractos y carecen de tooltips de texto. |
| 7 | Flexibility and Efficiency | 2 | Ausencia de aceleradores de teclado o atajos para usuarios expertos en los dashboards. |
| 8 | Aesthetic and Minimalist Design | 3 | Diseño limpio y estructurado tras remover los bordes ultra-redondeados, pero persisten problemas de contraste de color. |
| 9 | Error Recovery | 3 | Mensajes de error claros, con un fallback resiliente recién implementado para caídas de API. |
| 10 | Help and Documentation | 2 | FAQ disponible, pero no hay guías contextuales de exploración o tooltips de ayuda. |
| **Total** | | **29/40** | **Good (Fundación Sólida)** |

## Anti-Patterns Verdict

* **LLM Assessment**: La landing page tiene un aspecto visual sumamente cuidado y característico, alejándose de los patrones planos y corporativos de las SaaS tradicionales.
* **Deterministic Scan**: El escaneo estático de los archivos del proyecto no reporta fallos directos ni anti-patrones estructurales.
* **Visual Overlays**: La inyección dinámica de `detect.js` reporta 20 observaciones en el cliente:
  * Contraste deficiente (3.0:1) en el texto blanco de los botones primarios sobre el fondo Teal Andino (`#26a699`).
  * Contraste deficiente (3.2:1) en los textos grisáceos secundarios (`#8f8f8f`) sobre fondos blancos en la cabecera y pie de página.
  * Uso repetido de kickers en la cuadrícula de tarjetas de precios ("Nivel de apoyo" repetido en cada membresía).
  * Detección de tarjetas anidadas ("Card inside card") debido al doble contenedor (div interno de padding y div externo de borde en los planes de membresía).

## Overall Impression
La landing page cuenta con una identidad cultural y mística sumamente atractiva y premium. Los cambios de bordes de 10-12px y la profundidad tonal con Sage Muted la hacen destacar. Las mayores oportunidades de mejora son la corrección del contraste de color en botones de acción y pies de página, la eliminación del doble contenedor en las tarjetas de membresías y la introducción de una tipografía de display que complemente a Inter.

## Priority Issues

### [P1] Contraste en Botones Primarios
* **Why it matters**: El texto blanco sobre el fondo Teal Andino (`#ffffff` sobre `#26a699`) tiene una relación de contraste de sólo 3.0:1, lo cual dificulta la lectura para personas con visión reducida o pantallas con bajo brillo.
* **Fix**: Cambiar el color del texto a Negro Profundo (`#1b2222`) para lograr un contraste de más de 5.5:1, o bien oscurecer el fondo del botón a `#1b7a70`.
* **Suggested command**: `$impeccable colorize src/app/(storefront)/page.tsx`

### [P1] Contraste en Textos Secundarios (Header y Footer)
* **Why it matters**: Los enlaces del pie de página y metadatos usan un color gris (`#8f8f8f`) sobre fondo blanco (`#ffffff`) que da una relación de contraste de 3.2:1 (insuficiente para WCAG AA).
* **Fix**: Cambiar las clases de color de texto a `text-foreground/80` o un tono gris oscuro equivalente.
* **Suggested command**: `$impeccable polish src/app/(storefront)/page.tsx`

### [P2] Estructura de Tarjetas Anidadas en Membresías
* **Why it matters**: El doble contenedor (div externo con borde y div interno con fondo de color/padding) se detecta como una tarjeta dentro de otra tarjeta, aumentando la complejidad del DOM y creando ruido visual de bordes.
* **Fix**: Unificar el borde, fondo y padding en una sola etiqueta `div` contenedora.
* **Suggested command**: `$impeccable layout src/app/(storefront)/page.tsx`

### [P2] Repetición de Kickers en Membresías
* **Why it matters**: La etiqueta "Nivel de apoyo" se repite en cada una de las 3 tarjetas de membresías, lo cual genera redundancia visual innecesaria.
* **Fix**: Eliminar el kicker individual de cada tarjeta o moverlo como un encabezado de sección único.
* **Suggested command**: `$impeccable quieter src/app/(storefront)/page.tsx`

## Persona Red Flags

* **Jordan (First-Timer)**: El header posee iconos interactivos (como el de carrito o perfil) que carecen de etiquetas de accesibilidad en hover, lo que obliga al usuario novel a adivinar su función por ensayo y error.
* **Sam (Accessibility)**: Las etiquetas de los planes de precios tienen muy bajo contraste de color, lo cual impedirá a Sam discernir los beneficios de cada nivel con facilidad.
* **Casey (Mobile)**: La zona de interactividad del Bento Grid y la cascada en Z de las tarjetas se apilan bien en móvil, pero algunos márgenes superiores resultan incómodos para hacer scroll de página con el pulgar sin pulsar enlaces accidentalmente.

## Minor Observations
* Se utiliza una única familia tipográfica (Inter/Geist-sans) en toda la landing page. Introducir una tipografía serif o decorativa para los encabezados display display H1 aportaría mayor elegancia editorial.
