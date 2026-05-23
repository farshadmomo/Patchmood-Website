# CLAUDE.md — Project Context & AI Instructions

This file provides context for AI coding assistants (Claude, Cursor, Copilot, etc.) working on this project.

---

## Project Overview

A **Next.js product showcase website** with a cinematic scroll-driven video hero, browseable product catalog, and a full admin dashboard for managing products. **No shopping cart, no payments** — browse-only.

### Design language

Brutalist collector's-loft direction: warm near-black concrete, Ferrari-red accent, heavy condensed uppercase display type (Anton) paired with Archivo body. The scroll-video hero is the centerpiece; everything overlays it. Design tokens are CSS custom properties (`--pm-*`) in `src/app/globals.css`. Always reference tokens, never raw hex.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS v3 |
| Animations | GSAP + ScrollTrigger |
| Database + Auth | Supabase (Postgres + GoTrue auth) |
| Image Storage | Supabase Storage (`media` bucket) |
| Language | TypeScript |
| Middleware | `src/proxy.ts` (NOT middleware.ts) |

---

## Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx        ← Supabase signInWithPassword
│   │   ├── (main)/page.tsx              ← Hero + product grid
│   │   ├── admin/
│   │   │   ├── layout.tsx               ← Server-side admin gate
│   │   │   ├── page.tsx                 ← Dashboard
│   │   │   └── products/                ← List, new, [id]/edit
│   │   └── api/
│   │       ├── products/route.ts        ← GET all, POST (admin)
│   │       ├── products/[id]/route.ts   ← GET one, PUT, DELETE (admin)
│   │       ├── categories/route.ts      ← GET all, POST (admin)
│   │       ├── categories/[id]/route.ts ← GET, PUT, DELETE (admin)
│   │       └── upload/route.ts          ← Supabase Storage upload (admin)
│   ├── components/
│   │   ├── hero/ScrollVideo.tsx         ← GSAP scroll-driven video
│   │   ├── products/                    ← ProductGrid, ProductCard, ProductPanel
│   │   └── admin/                       ← ProductForm, ProductTable, DeleteButton, Sidebar, Toast
│   ├── data/
│   │   └── products.ts                  ← Static frontend product data (mood + gradient)
│   ├── hooks/
│   │   └── useScrollVideo.ts
│   ├── lib/
│   │   ├── supabase/client.ts           ← Browser Supabase client
│   │   ├── supabase/server.ts           ← Server Supabase client (async cookies)
│   │   └── gsap.ts                      ← GSAP plugin registration
│   ├── proxy.ts                         ← Middleware: validates token, guards /admin/*
│   └── types/index.ts                   ← Product (snake_case), ApiResponse<T>
├── supabase/
│   ├── schema.sql                       ← Run in Supabase SQL Editor (idempotent)
│   └── seed.sql                         ← Run after schema.sql (mock data)
└── scripts/seed.ts                      ← Creates admin user (needs SUPABASE_SERVICE_ROLE_KEY)
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # seed script only
```

---

## Data Models

### Product (Supabase `products` table)

```ts
{
  id: string           // uuid
  name: string
  slug: string         // unique, url-safe
  description: string
  short_description: string
  images: string[]     // Supabase Storage public URLs
  category: string
  tags: string[]
  featured: boolean
  created_at: string
  updated_at: string
}
```

### Category (Supabase `categories` table)

```ts
{
  id: string
  name: string
  slug: string
  image_url: string | null
  created_at: string
}
```

---

## Auth & Role Guard

- Supabase GoTrue auth — `signInWithPassword` on the login page
- Admin role stored in `app_metadata.role = "admin"` (NOT user_metadata — that's user-editable)
- `src/proxy.ts` validates the Supabase token and checks `app_metadata.role` for `/admin/*` routes
- To grant admin: run in Supabase SQL Editor:
  ```sql
  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
  where email = 'your@email.com';
  ```

---

## Key Implementation Details

### 1. Scroll-Driven Video (ScrollVideo.tsx)

- GSAP `ScrollTrigger` maps `scrollY` → `video.currentTime`
- Video is `position: sticky; top: 0` inside a tall scroll container
- **Never** use `video.play()` — drive time directly via `scrub`

### 2. Image Uploads (`/api/upload`)

- Uses Supabase Storage (`media` bucket, `products/` and `categories/` folders)
- Accepts multipart form data with `file` and optional `type` (`"products"` | `"categories"`)
- Validates: JPEG/PNG/WebP/AVIF only, max 5 MB
- Returns `{ success: true, data: { url: string } }` with the public URL

### 3. API Routes

- All mutation routes check `user.app_metadata.role === "admin"` server-side
- Standard response shape: `{ success: boolean, data?: T, error?: string }`

---

## Coding Conventions

- **TypeScript** everywhere — no `any`
- **Server Components** by default; `'use client'` only for GSAP, useState, etc.
- **Tailwind** for all styling — no CSS modules
- **Named exports** for components, **default export** for pages
- Always use `--pm-*` CSS tokens, never raw hex/oklch values directly

---

## Out of Scope

- ❌ Shopping cart / checkout / payments
- ❌ User profile editing
- ❌ Product reviews / ratings
- ❌ Order management

---

## Commands

```bash
npm run dev    # dev server
npm run build  # production build
npm run seed   # create admin user (needs SUPABASE_SERVICE_ROLE_KEY)
```
