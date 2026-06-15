---
name: Andean Vibes
description: Sistema de diseño interactivo para el portal cultural y de e-commerce Mi Perú
colors:
  primary: "#26a699"
  secondary: "#68bb6c"
  accent: "#e18e96"
  neutral-bg: "#ffffff"
  neutral-ink: "#1b2222"
  muted: "#edf2f1"
  border: "#d7e0dd"
typography:
  display:
    fontFamily: "var(--font-sans)"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: "1"
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "var(--font-sans)"
    fontSize: "clamp(1.75rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: "1.1"
  title:
    fontFamily: "var(--font-sans)"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: "1.2"
  body:
    fontFamily: "var(--font-sans)"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.6"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "#1c7d73"
---

# Design System: Andean Vibes

## 1. Overview

**Creative North Star: "Portal Andino Inmersivo (The Immersive Andean Portal)"**

Este sistema de diseño está concebido para transportar a los usuarios a través del paisaje y la cultura peruana de manera inmersiva, limpia y sofisticada. La interacción con el portal debe evocar la riqueza de las tradiciones mediante el uso intencional de colores naturales y transiciones suaves que guíen al usuario a través del descubrimiento de festividades, geografía y artesanías. Rechazamos activamente las plantillas SaaS planas e impersonales; cada pantalla debe sentirse como un portal viviente a la riqueza de los Andes.

**Key Characteristics:**
- **Profundidad Visual Mística**: Colores vibrantes de la naturaleza andina combinados con interacciones dinámicas de alto valor estético.
- **Rendimiento Dinámico**: Transiciones fluidas en hover y aperturas de modales que guían la atención del explorador.
- **Legibilidad sin Compromiso**: Contraste estricto y tipografía clara para que la narrativa cultural brille.

---

## 2. Colors

La paleta cromática se inspira en el paisaje natural andino y en la riqueza cromática del folclore y los telares peruanos.

### Primary
- **Teal Andino** (#26a699 / oklch(65% 0.16 174)): Color base de la marca. Evoca el color místico de las lagunas andinas. Se utiliza para elementos clave de acción, botones principales e indicadores de navegación activa.

### Secondary
- **Verde Campo** (#68bb6c / oklch(71% 0.17 123)): Representa la fertilidad de los valles interandinos. Utilizado para elementos de éxito, estado positivo y acentos secundarios de navegación.

### Tertiary
- **Carmesí Suave** (#e18e96 / oklch(72% 0.14 354)): Inspirado en la textilería y las flores nativas. Se utiliza para acentos de llamadas de atención suaves, favoritos (wishlist) y elementos interactivos alternativos.

### Neutral
- **Blanco Puro** (#ffffff / oklch(100% 0 0)): Fondo base limpio que permite resaltar los elementos interactivos en 3D y las fotografías.
- **Negro Profundo** (#1b2222 / oklch(20% 0.01 180)): Color del texto principal (ink) y elementos estructurales oscuros, asegurando máxima legibilidad.
- **Gris Muted** (#edf2f1 / oklch(96% 0.01 165)): Fondo para contenedores secundarios, bordes sutiles y áreas de contraste ligero.
- **Borde Suave** (#d7e0dd / oklch(91% 0.01 165)): Color por defecto para divisores y bordes de inputs.

**The Teal Rarity Rule.** El Teal Andino (#26a699) debe cubrir como máximo el 10% de cualquier pantalla para mantener su estatus de acento y guiar visualmente las acciones principales de los usuarios.

---

## 3. Typography

**Display Font:** Inter / Geist-sans (var(--font-sans))
**Body Font:** Inter / Geist-sans (var(--font-sans))

La tipografía utiliza una sola familia geométrica premium en diferentes pesos para ofrecer un contraste moderno, estructurado e interactivo.

### Hierarchy
- **Display** (Extra-Bold (800), clamp(2.5rem, 6vw, 4.5rem), 1.0): Títulos principales de héroes y secciones principales del portal. Letter-spacing mínimo (-0.04em) para una apariencia compacta y contundente.
- **Headline** (Bold (700), clamp(1.75rem, 4vw, 3rem), 1.1): Títulos de secciones secundarias y tarjetas grandes.
- **Title** (Bold (700), 1.75rem, 1.2): Encabezados de tarjetas de festividades o productos.
- **Body** (Regular (400), 1rem, 1.6): Texto principal de lectura y descripciones culturales. Longitud de línea limitada a 75ch.
- **Label** (Medium (500), 0.875rem, 0.05em spacing): Micro-etiquetas, eyebrows de categorías y botones.

---

## 4. Elevation

El portal utiliza una filosofía de **Planitud con Profundidad Tonal**. Rechazamos las sombras pesadas genéricas de la web comercial. La jerarquía se define mediante colores de fondo contrastantes (`--muted` y `--background`) y bordes limpios de 1px.

### Shadow Vocabulary
- **Ambient Float** (`box-shadow: 0 10px 30px -10px rgba(27, 34, 34, 0.08)`): Utilizado únicamente para modales emergentes y dropdowns flotantes para separarlos visualmente del lienzo principal.

**The Rest-Flat Rule.** Las tarjetas y elementos interactivos deben estar completamente planos sobre el lienzo en reposo. Las sombras solo aparecen de forma dinámica durante las transiciones de interacción (hover) o estado activo.

---

## 5. Components

### Buttons
- **Shape:** Bordes redondeados limpios (10px / var(--radius))
- **Primary:** Fondo Teal Andino (`#26a699`), texto Blanco Puro (`#ffffff`), padding vertical de 12px y horizontal de 24px.
- **Hover / Focus:** Transición de color de fondo a `#1c7d73` y escala suave (`scale-102` en 150ms). Focus ring visible de 2px con color primary.

### Cards / Containers
- **Corner Style:** Radio de esquina moderno (10px / var(--radius)).
- **Background:** Blanco Puro (`#ffffff`) o Gris Muted (`#edf2f1`).
- **Shadow Strategy:** Planas en reposo. Al hacer hover, se puede aplicar una elevación sutil mediante un borde sutil o un leve escalado en 200ms.
- **Border:** Borde sutil de 1px (`#d7e0dd`).

### Inputs / Fields
- **Style:** Borde sutil de 1px (`#d7e0dd`), radio de 8px y fondo Blanco Puro (`#ffffff`).
- **Focus:** Borde cambia a Teal Andino (`#26a699`) con anillo de foco exterior suave.

### Navigation
- **Style:** Enlaces limpios con tipografía Label. El enlace activo tiene color Teal Andino y un indicador inferior de 2px de alto. Hover genera un cambio de color suave a Teal Andino en 150ms.

---

## 6. Do's and Don'ts

### Do:
- **Do** Asegurar que el texto sobre fondos fotográficos o de color tenga una relación de contraste mínima de 4.5:1.
- **Do** Utilizar transiciones fluidas de 150-200ms con curvas estándar para interactividad.
- **Do** Respetar la directiva `@media (prefers-reduced-motion: reduce)` simplificando las animaciones de escala por desvanecimientos instantáneos.
- **Do** Seguir la regla de usar acentos de color en menos del 10% del lienzo.

### Don't:
- **Don't** Usar sombras pesadas de más de 12px de blur en reposo para tarjetas o botones comunes.
- **Don't** Usar bordes redondeados exagerados (32px o más) en tarjetas o bloques principales de información.
- **Don't** Añadir bordes decorativos gruesos a la izquierda o derecha (`border-left` mayor a 1px) como acento de color en tarjetas o llamadas de atención.
- **Don't** Usar texto degradado con `background-clip: text` sobre imágenes o fondos de lectura principales.
- **Don't** Añadir ilustraciones a mano tipo sketch que resten valor y sensación de portal cultural premium inmersivo.
