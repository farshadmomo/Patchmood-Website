# PatchMood

## What This Is

A modern product showcase website for an online shop called PatchMood. Visitors can browse the product catalog with a cinematic scroll-driven video hero and GSAP-powered animations. There is no cart or payment system — this is a browse-only experience with a protected admin dashboard for content management.

## Core Value

A visually stunning, scroll-driven browsing experience that makes products feel worth owning before the user even clicks.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Scroll-driven video hero with GSAP ScrollTrigger
- [ ] GSAP scroll animations for hero text and product grid
- [ ] Product catalog fetched from MongoDB
- [ ] Product detail pages with image galleries
- [ ] User authentication (login/logout) with NextAuth.js
- [ ] Admin dashboard: add, edit, delete products with Cloudinary image uploads
- [ ] Route protection: admin routes require role=admin
- [ ] Responsive design across desktop and mobile

### Out of Scope

- Shopping cart — out of scope for v1, tracked in backlog
- Checkout / payments (Stripe) — no purchasing in v1
- Order management — no orders in v1
- User profile editing — not needed for browse-only
- Product reviews/ratings — backlog
- Email notifications — backlog
- i18n / multi-language — backlog

## Context

- Next.js 16.2.6 with React 19 and App Router
- Tailwind CSS v4 (uses `@import "tailwindcss"` syntax, not v3 config)
- GSAP 3.15.0 already installed
- Background video at `bgVideo/1.1-invideo-seedance_2_0.mp4` (~2MB)
- Database: MongoDB Atlas with Mongoose
- Auth: NextAuth.js v5 with Credentials provider + bcryptjs
- Media: Cloudinary for image uploads (local public/ for dev)
- Language: TypeScript (strict)
- AGENTS.md warns: Next.js 16 has breaking changes — `params` is now a Promise

## Constraints

- **Tech stack**: Next.js 16 / React 19 / Tailwind v4 / GSAP — no deviations
- **Browse-only**: No cart, checkout, or payment flows
- **TypeScript strict**: No `any`, proper interfaces throughout
- **GSAP SSR**: Always `'use client'` + `useEffect` + `typeof window` guard
- **Security**: Admin routes protected at both middleware and layout level

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| JavaScript → TypeScript | Matches CLAUDE.md architecture, type safety for long project | — Pending |
| Tailwind v4 (not v3) | create-next-app scaffolded v4; no config file needed | — Pending |
| Video in public/ | Browser requires public-accessible URL for `<video src>` | — Pending |
| GSAP scrub (not play) | Scroll-driven: `currentTime` directly, never `video.play()` | — Pending |

---
*Last updated: 2026-05-19 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
