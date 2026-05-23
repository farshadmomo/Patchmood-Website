# DESIGN.md — PatchMood

The visual system for the "underground mood archive" direction. All tokens live in `src/app/globals.css` as `--pm-*` custom properties. Reference tokens, never raw hex, in components.

## Color

Strategy: **Committed.** Warm near-black concrete base; Ferrari-red is the brand accent and carries voice. The colored gradient swatches of the products supply the only other saturation, like lit objects in a dark room.

OKLCH throughout. Never `#000` / `#fff`; neutrals are tinted warm (hue ~40).

| Token | Value | Role |
|-------|-------|------|
| `--pm-bg` | `oklch(0.13 0.006 40)` | Page base, warm charcoal |
| `--pm-bg-deep` | `oklch(0.10 0.005 40)` | Deeper pockets, scrims |
| `--pm-surface` | `oklch(0.16 0.006 40)` | Card / panel surface |
| `--pm-surface-raised` | `oklch(0.20 0.007 40)` | Raised surface |
| `--pm-border` | `oklch(0.30 0.008 40)` | Hairline outlines (the card style) |
| `--pm-border-strong` | `oklch(0.42 0.010 40)` | Emphasized borders |
| `--pm-fg` | `oklch(0.97 0.004 60)` | Primary text |
| `--pm-fg-muted` | `oklch(0.68 0.006 50)` | Secondary text |
| `--pm-fg-subtle` | `oklch(0.50 0.006 50)` | Labels, metadata |
| `--pm-accent` | `oklch(0.58 0.225 27)` | Ferrari red, primary accent + CTAs |
| `--pm-accent-bright` | `oklch(0.66 0.235 35)` | Hover, neon glow |
| `--pm-accent-dim` | `oklch(0.42 0.16 27)` | Pressed, dim red |
| `--pm-neon` | `oklch(0.84 0.20 145)` | Sparse green-neon accent, use rarely |

Product gradient swatches and per-product `accentColor` stay as defined in `src/data/products.ts`. They are product identity, not chrome.

## Typography

Display: **Anton** (heavy condensed, uppercase only). Poster-scale headlines. Single weight; size and tracking do the work.
Body / UI: **Archivo** (grotesque, weights 300–700).
Mono: **Geist Mono** (loaded via next/font) for index numbers, counts, technical labels.

Tokens: `--font-display`, `--font-body`, `--font-mono`.

Rules:
- Headlines: Anton, uppercase, tracking `-0.01em` to `0.02em`, fluid `clamp()`, line-height ~0.92.
- A two-tone headline (one word in `--pm-accent`) is the signature move. Use once per section, not everywhere.
- Body: Archivo 400, line-height 1.65 on dark, max 70ch.
- Labels / kickers: Archivo 500 or Geist Mono, uppercase, tracking 0.2em–0.3em, `--pm-fg-subtle`.
- Index numbers on cards: Geist Mono, e.g. `01 / 06`.

## Layout

- Outlined-card style: 1px `--pm-border`, `--pm-surface` background (often semi-transparent over the hero), no shadow by default. On hover, border goes `--pm-accent` and a faint red glow appears.
- Cards carry a label + name + a mono index/count, echoing the screenshot inventory cards.
- Asymmetric, left-weighted compositions over centered stacks. The hero text sits lower-left, not dead-center.
- Spacing rhythm via `clamp()`; tight groupings inside cards, generous gaps between sections.

## Motion

- Keep the GSAP scroll-driven video and the staggered hero text reveal.
- Ease-out exponential curves only. No bounce.
- Hover: 150–250ms border/color transitions; never animate layout properties.
- Respect `prefers-reduced-motion` (already handled in globals.css).

## Signature elements

- Oversized condensed caps with a single red word.
- Hairline-outlined floating cards with mono index numbers.
- Concrete-warm dark base, red neon glow on interactive focus.
- Mono kickers and inventory-style labels.

## Bans (this project)

Side-stripe borders, gradient text, decorative glassmorphism, hero-metric blocks, identical card grids, em dashes in copy, editorial serif headlines.
