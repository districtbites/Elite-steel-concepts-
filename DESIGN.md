# Design Context

## Color Strategy: Committed
The brand utilizes a bold, committed color palette. The primary safety orange acts as a stark, high-visibility contrast against industrial darks and crisp whites.

### Design Tokens (Tailwind v4)
- **Primary:** `#F7931E` (Safety Orange) - Used for primary actions, critical stats, and brand accents.
- **Secondary:** `#000000` (Pitch Black) - High-contrast text and dark mode elements.
- **Surface Dark:** `#0a0a0a` - The standard background for dark panels (e.g., Admin Dashboard, Hero Sections).
- **Border Dark:** `#1a1a1a` - Used to divide `Surface Dark` panels without using artificial shadows.

## Typography
- **Primary Font:** Montserrat (`--font-montserrat`).
- **Hierarchy:** We rely heavily on uppercase tracking (`tracking-widest`, `tracking-[0.2em]`) for overline labels and deep, black font weights (`font-black`) for aggressive, industrial headings.

## Structural Rhythm & Layout
- **Containers & Borders:** We prefer hard structural borders (`border-gray-100` or `border-border-dark`) over soft glassmorphism or floating shadows. 
- **Spacing:** Elements should have generous breathing room. Asymmetric, cascading layouts are preferred over rigid, monotonous N-column grids (especially for feature lists).
- **Cards:** Use cards sparingly. Not every metric or text block needs to be wrapped in a white box.

## Interactive States
- **Focus:** `3px solid #F7931E !important` - Un-overrideable, hyper-visible focus rings.
- **Hover:** GPU-accelerated `transition-colors` or `transition-transform`. Elements lift sharply (`hover-lift`) rather than dissolving slowly.
- **Mobile Targets:** All interactive elements maintain a strict 44x44px minimum hit area (`min-height: 44px; min-width: 44px;`).
