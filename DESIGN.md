# Union Design System

## Color Palette

A 3-color brand palette based on Huemint. Clean and modern feel with a bold accent that draws attention.

> Reference: https://huemint.com/brand-2/#palette=edf2fa-262725-e83a33

### Core Colors

| Role | Name | Hex | HSL | Usage |
|------|------|-----|-----|-------|
| **Background** | Ice | `#EDF2FA` | `216° 52% 95%` | Page background, card background, light areas |
| **Dark** | Charcoal | `#262725` | `80° 3% 15%` | Text, headers, dark section backgrounds, icons |
| **Accent** | Union Red | `#E83A33` | `3° 79% 55%` | CTA buttons, highlights, link hover, badges |

### Extended Palette (derived from Core)

```
Ice Scale (Background family)
  --ice-50:   #F7F9FD    Lightest background
  --ice-100:  #EDF2FA    <- Base Background
  --ice-200:  #DCE4F2    Dividers, inactive areas
  --ice-300:  #C5D1E8    Placeholder, disabled

Charcoal Scale (Dark family)
  --charcoal-900: #262725  <- Base Dark (body text)
  --charcoal-800: #363836  Headings, emphasized text
  --charcoal-700: #4A4C4A  Subtext
  --charcoal-600: #6B6D6B  Captions, hint text
  --charcoal-500: #8E908E  Inactive icons
  --charcoal-400: #B0B2B0  Borders, dividers

Red Scale (Accent family)
  --red-600:  #C42E29    Button hover/pressed
  --red-500:  #E83A33    <- Base Accent (CTA, highlights)
  --red-400:  #EF6560    Soft accent, tags
  --red-300:  #F4908C    Notification badge background
  --red-200:  #FACCCB    Light accent background
  --red-100:  #FDE8E7    Error background, subtle highlight
```

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#EDF2FA` | Default page background |
| `--color-bg-secondary` | `#FFFFFF` | Cards, modals |
| `--color-bg-dark` | `#262725` | Dark sections (footer, hero) |
| `--color-bg-accent` | `#FDE8E7` | Accent highlight background |
| `--color-text-primary` | `#262725` | Body text |
| `--color-text-secondary` | `#6B6D6B` | Secondary text, captions |
| `--color-text-on-dark` | `#EDF2FA` | Text on dark backgrounds |
| `--color-text-accent` | `#E83A33` | Highlighted text, links |
| `--color-border` | `#DCE4F2` | Default border |
| `--color-border-strong` | `#B0B2B0` | Emphasized border |
| `--color-interactive` | `#E83A33` | CTA buttons, primary interactions |
| `--color-interactive-hover` | `#C42E29` | Hover state |
| `--color-destructive` | `#E83A33` | Delete, error (same as accent) |
| `--color-success` | `#2D8A4E` | Success state (separate green) |
| `--color-warning` | `#D4860A` | Warning state (separate yellow) |

### Chart Palette (Data Visualization)

For Recharts. 5 categorical colors derived from the core palette, color-blind friendly.

| Token | Hex | Usage |
|-------|-----|-------|
| `--chart-1` | `#E83A33` | Primary metric (Union Red) |
| `--chart-2` | `#262725` | Secondary metric (Charcoal) |
| `--chart-3` | `#2D8A4E` | Positive metric (Success green) |
| `--chart-4` | `#D4860A` | Caution metric (Warning) |
| `--chart-5` | `#8E908E` | Neutral/baseline (Charcoal-500) |

---

## Typography

### Font Stack

```css
--font-sans: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale

| Token | Size | Weight | Line Height | Responsive | Usage |
|-------|------|--------|-------------|------------|-------|
| `display-xl` | 48px / 3rem | 800 | 1.1 | 36px on mobile | Landing hero title |
| `display` | 36px / 2.25rem | 700 | 1.2 | 28px on mobile | Section title |
| `heading-1` | 28px / 1.75rem | 700 | 1.3 | 24px on mobile | Page title |
| `heading-2` | 22px / 1.375rem | 600 | 1.35 | 20px on mobile | Card/section heading |
| `heading-3` | 18px / 1.125rem | 600 | 1.4 | — | Sub-section heading |
| `body` | 16px / 1rem | 400 | 1.6 | — | Body text |
| `body-sm` | 14px / 0.875rem | 400 | 1.5 | — | Secondary text, captions |
| `caption` | 12px / 0.75rem | 400 | 1.4 | — | Meta info, hints |
| `label` | 14px / 0.875rem | 500 | 1.2 | — | Buttons, labels, nav |

---

## Spacing & Layout

### Spacing Scale (4px base)

```
--space-0:   0px
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
--space-24:  96px
```

### Border Radius

```
--radius-sm:   4px     Small elements (tags, badges)
--radius-md:   8px     Cards, input fields
--radius-lg:   12px    Modals, large cards
--radius-xl:   16px    Hero cards, banners
--radius-full: 9999px  Avatars, circular buttons
```

### Breakpoints

```
--bp-sm:  640px    Mobile
--bp-md:  768px    Tablet
--bp-lg:  1024px   Small desktop
--bp-xl:  1280px   Desktop
--bp-2xl: 1536px   Wide desktop
```

### Z-Index Scale

```
--z-base:      0       Default content
--z-dropdown:  100     Dropdown menus, tooltips
--z-sticky:    200     Sticky headers, sidebar
--z-overlay:   300     Sheet/drawer backdrop
--z-modal:     400     Modal, dialog
--z-toast:     500     Toast notifications
```

---

## Component Patterns

### Buttons

```
Primary (CTA)
  Background: --color-interactive (#E83A33)
  Text: white
  Hover: --color-interactive-hover (#C42E29)
  Radius: --radius-md
  Padding: 12px 24px
  Font: label (14px/500)
  Min touch target: 44x44px (mobile)

Secondary
  Background: transparent
  Border: 1px solid --color-border-strong
  Text: --color-text-primary
  Hover: --color-bg-primary background

Ghost
  Background: transparent
  Text: --color-text-secondary
  Hover: --color-bg-primary background
```

### Cards

```
Default Card
  Background: #FFFFFF
  Border: 1px solid --color-border
  Radius: --radius-lg
  Shadow: --shadow-sm
  Padding: --space-6

Interactive Card (hover)
  Hover shadow: --shadow-lg
  Transition: shadow 0.2s ease, transform 0.2s ease
  Hover transform: translateY(-2px)
```

### Forms & Inputs

```
Default
  Height: 40px (default), 36px (compact)
  Border: 1px solid --color-border
  Radius: --radius-md
  Background: #FFFFFF
  Text: --color-text-primary
  Placeholder: --charcoal-500

Focus
  Border: 1px solid --color-interactive
  Ring: 0 0 0 3px rgba(232,58,51,0.15)

Error
  Border: 1px solid --color-destructive
  Ring: 0 0 0 3px rgba(232,58,51,0.1)
  Helper text: --color-destructive (body-sm)

Disabled
  Opacity: 0.5
  Cursor: not-allowed
  Background: --ice-200
```

### Sidebar / Navigation

```
Background: #FFFFFF or --color-bg-primary
Active item: --red-100 background + --color-text-accent text
Hover item: --ice-200 background
Icon: --charcoal-500 (default) -> --color-text-accent (active)
```

### Status Indicators

```
Active / Success
  Dot: --color-success (#2D8A4E)
  Badge: --color-success bg at 10% opacity + --color-success text

Warning / Pending
  Dot: --color-warning (#D4860A)
  Badge: --color-warning bg at 10% opacity + --color-warning text

Error / Rejected
  Dot: --color-destructive (#E83A33)
  Badge: --red-100 bg + --color-text-accent text

Inactive / Draft
  Dot: --charcoal-500
  Badge: --ice-200 bg + --charcoal-600 text

In Review
  Dot: --color-interactive (#E83A33)
  Badge: --red-100 bg + --color-text-accent text
```

### Metric Cards (Dashboard)

```
Layout: Card with heading-2 value + body-sm label
Value: heading-2 weight 700
Change indicator:
  Positive: --color-success text + up arrow
  Negative: --color-destructive text + down arrow
  Neutral: --charcoal-600 text
Sparkline: --color-interactive stroke
```

### Empty States

```
Layout: Centered, max-width 320px
Icon: 48px, --charcoal-500 at 50% opacity
Heading: heading-3, --color-text-primary
Description: body-sm, --color-text-secondary
CTA: Primary button (optional)
```

### Loading States

```
Skeleton
  Background: --ice-200
  Animation: pulse (opacity 0.5 -> 1 -> 0.5, 1.5s)
  Radius: match target element

Spinner
  Size: 20px (inline), 32px (page)
  Color: --color-interactive
  Animation: rotate 360deg, 0.8s linear infinite
```

---

## Visual Style

### Design Principles

1. **Clean & Minimal**: Minimize unnecessary decoration. Use generous whitespace.
2. **Bold Accent**: Use Red sparingly but boldly for CTAs and key highlights.
3. **Geometric Motif**: Geometric decorative elements inspired by Huemint patterns (circles, quarter-circles, leaf shapes).
4. **Contrast**: Charcoal text on Ice background ensures AAA-level contrast ratio.
5. **Consistency**: Only use the 3 core colors + derived tones. No arbitrary colors.

### Geometric Pattern Guide

Geometric motifs from the Huemint brand image:
- **Quarter Circle**: 1/4 circle inside a square - corner decorations, section dividers
- **Leaf Shape**: Two quarter-circles meeting to form a leaf - brand identity element
- **Circle in Square**: Circle inscribed in a square - icon frames, logo frames
- **Grid Mosaic**: Square grid filled with 3 colors - hero backgrounds, decorative elements

Usage locations:
- Landing hero background patterns
- Section divider decorations
- Empty state illustrations
- Loading skeleton patterns

### Shadow System

```
--shadow-sm:  0 1px 2px rgba(38,39,37,0.05)
--shadow-md:  0 2px 8px rgba(38,39,37,0.08)
--shadow-lg:  0 4px 16px rgba(38,39,37,0.10)
--shadow-xl:  0 8px 32px rgba(38,39,37,0.12)
```

### Transitions

```
--transition-fast:   150ms ease
--transition-normal: 200ms ease
--transition-slow:   300ms ease
```

---

## Animation & Motion

### Entry Animations

```
Fade Up (page enter, card reveal)
  From: opacity 0, translateY(16px)
  To: opacity 1, translateY(0)
  Duration: 500ms ease-out

Fade In (subtle appearance)
  From: opacity 0
  To: opacity 1
  Duration: 400ms ease-out

Scale In (modals, popovers)
  From: opacity 0, scale(0.96)
  To: opacity 1, scale(1)
  Duration: 300ms ease-out

Slide In Left (sidebar items)
  From: opacity 0, translateX(-12px)
  To: opacity 1, translateX(0)
  Duration: 400ms ease-out
```

### Stagger Pattern

For list/grid reveals, apply incremental delay to siblings (50ms per item):

```
Item 1: delay 50ms
Item 2: delay 100ms
Item 3: delay 150ms
...up to 8 items (400ms max)
```

### Interactive Motion

```
Card hover lift
  Transform: translateY(-2px)
  Shadow: --shadow-lg
  Duration: --transition-normal

Accent underline expand
  Width: 0 -> 100%
  Duration: --transition-slow
  Trigger: hover

Float (decorative)
  translateY(0) -> translateY(-6px) -> translateY(0)
  Duration: 3s ease-in-out infinite
```

### Framer Motion Conventions

```
Page/section enter:
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}

Modal/dialog:
  initial={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.96 }}
  transition={{ duration: 0.2 }}

Stagger children:
  transition={{ staggerChildren: 0.05 }}

Spring (interactive):
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
```

---

## Accessibility

- **Contrast**: Charcoal (#262725) on Ice (#EDF2FA) = WCAG AAA (13.8:1)
- **Focus ring**: 0 0 0 3px rgba(232,58,51,0.3) on all interactive elements
- **Min touch target**: 44x44px on mobile viewports (< --bp-md)
- **Color not sole indicator**: Always pair status colors with icon or text label
- **Reduced motion**: Respect `prefers-reduced-motion` - disable all non-essential animations

---

## Dark Mode (future)

| Light Token | Light Value | Dark Value |
|-------------|-------------|------------|
| `--color-bg-primary` | `#EDF2FA` | `#1A1B1A` |
| `--color-bg-secondary` | `#FFFFFF` | `#262725` |
| `--color-text-primary` | `#262725` | `#EDF2FA` |
| `--color-text-secondary` | `#6B6D6B` | `#8E908E` |
| `--color-border` | `#DCE4F2` | `#363836` |
| `--color-interactive` | `#E83A33` | `#EF6560` |

---

## shadcn/ui Token Mapping

Map DESIGN.md tokens to shadcn/ui CSS variable conventions:

```css
:root {
  /* shadcn/ui required tokens -> DESIGN.md values */
  --background: #EDF2FA;           /* Ice */
  --foreground: #262725;           /* Charcoal */
  --card: #FFFFFF;
  --card-foreground: #262725;
  --popover: #FFFFFF;
  --popover-foreground: #262725;
  --primary: #E83A33;              /* Union Red (CTA) */
  --primary-foreground: #FFFFFF;
  --secondary: #DCE4F2;           /* Ice-200 */
  --secondary-foreground: #262725;
  --muted: #DCE4F2;               /* Ice-200 */
  --muted-foreground: #6B6D6B;    /* Charcoal-600 */
  --accent: #FDE8E7;              /* Red-100 */
  --accent-foreground: #262725;
  --destructive: #E83A33;
  --border: #DCE4F2;
  --input: #B0B2B0;               /* Charcoal-400 */
  --ring: #E83A33;                /* Union Red */

  /* Charts */
  --chart-1: #E83A33;
  --chart-2: #262725;
  --chart-3: #2D8A4E;
  --chart-4: #D4860A;
  --chart-5: #8E908E;

  /* Sidebar */
  --sidebar: #262725;             /* Charcoal */
  --sidebar-foreground: #B0B2B0;  /* Charcoal-400 */
  --sidebar-primary: #E83A33;     /* Union Red */
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #363836;      /* Charcoal-800 */
  --sidebar-accent-foreground: #EDF2FA;
  --sidebar-border: #4A4C4A;      /* Charcoal-700 */
  --sidebar-ring: #E83A33;
}
```

---

## CSS Variables (implementation)

```css
:root {
  /* Core */
  --color-ice: #EDF2FA;
  --color-charcoal: #262725;
  --color-red: #E83A33;

  /* Background */
  --color-bg-primary: #EDF2FA;
  --color-bg-secondary: #FFFFFF;
  --color-bg-dark: #262725;
  --color-bg-accent: #FDE8E7;

  /* Text */
  --color-text-primary: #262725;
  --color-text-secondary: #6B6D6B;
  --color-text-on-dark: #EDF2FA;
  --color-text-accent: #E83A33;

  /* Interactive */
  --color-interactive: #E83A33;
  --color-interactive-hover: #C42E29;

  /* Border */
  --color-border: #DCE4F2;
  --color-border-strong: #B0B2B0;

  /* Status */
  --color-success: #2D8A4E;
  --color-warning: #D4860A;
  --color-error: #E83A33;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(38,39,37,0.05);
  --shadow-md: 0 2px 8px rgba(38,39,37,0.08);
  --shadow-lg: 0 4px 16px rgba(38,39,37,0.10);
  --shadow-xl: 0 8px 32px rgba(38,39,37,0.12);

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Transition */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}
```
