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
| Database + Auth | PocketBase (SQLite + built-in auth), run as a local binary |
| Image Storage | PocketBase File fields on `products` / `categories` records |
| Language | TypeScript |
| Middleware | `src/proxy.ts` (NOT middleware.ts) |

---

## Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx        ← PocketBase _superusers auth
│   │   ├── (main)/page.tsx              ← Hero + product grid
│   │   ├── admin/
│   │   │   ├── layout.tsx               ← Server-side admin gate (isSuperuser)
│   │   │   ├── page.tsx                 ← Dashboard
│   │   │   └── products/                ← List, new, [id]/edit
│   │   └── api/
│   │       ├── products/route.ts        ← GET all, POST multipart (admin)
│   │       ├── products/[id]/route.ts   ← GET one, PUT multipart, DELETE (admin)
│   │       ├── categories/route.ts      ← GET all, POST multipart (admin)
│   │       └── categories/[id]/route.ts ← PATCH multipart, DELETE (admin)
│   ├── components/
│   │   ├── hero/ScrollVideo.tsx         ← GSAP scroll-driven video
│   │   ├── products/                    ← ProductGrid, ProductCard, ProductPanel
│   │   └── admin/                       ← ProductForm, ProductTable, DeleteButton, Sidebar, Toast
│   ├── data/
│   │   └── products.ts                  ← Static frontend product data (mood + gradient)
│   ├── hooks/
│   │   └── useScrollVideo.ts
│   ├── lib/
│   │   ├── pocketbase/client.ts         ← Browser PocketBase client (cookie-synced authStore)
│   │   ├── pocketbase/server.ts         ← Server PocketBase client (loads auth cookie)
│   │   ├── pocketbase/cookie.ts         ← Shared pb_auth cookie key + options
│   │   ├── pocketbase/transform.ts      ← Record → view-model mappers + file URL helpers
│   │   ├── pocketbase/api.ts            ← isAdmin guard, error mapping, slug helper
│   │   └── gsap.ts                      ← GSAP plugin registration
│   ├── proxy.ts                         ← Middleware: validates pb_auth cookie, guards /admin/*
│   └── types/index.ts                   ← Product (snake_case), ApiResponse<T>
└── scripts/seed.ts                      ← Creates collections + seeds mock data (PocketBase SDK)
```

PocketBase binary + data live outside this repo at `D:\pocketbase_0.38.2_windows_amd64\`
(`pocketbase.exe`, `pb_data/`). The Next app talks to it over HTTP at `NEXT_PUBLIC_POCKETBASE_URL`.

---

## Environment Variables

```env
# PocketBase
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
PB_SUPERUSER_EMAIL=admin@patchmood.com   # seed script only
PB_SUPERUSER_PASSWORD=Admin1234!         # seed script only
```

---

## Data Models

PocketBase records are mapped to these view-models in `src/lib/pocketbase/transform.ts`
(`toProduct` / `toCategory`): file fields → full file URLs, and PocketBase's `created`/
`updated` autodate fields → `created_at`/`updated_at`. The rest of the app only ever sees
the shapes below — it never touches raw PocketBase records.

### Product (PocketBase `products` collection)

```ts
{
  id: string           // 15-char PocketBase id
  name: string
  slug: string         // unique, url-safe
  description: string
  short_description: string
  images: string[]     // full PocketBase file URLs (collection stores filenames)
  category: string     // category name (text field, not a relation)
  tags: string[]       // JSON field
  featured: boolean
  created_at: string   // mapped from record.created
  updated_at: string   // mapped from record.updated
}
```

### Category (PocketBase `categories` collection)

```ts
{
  id: string
  name: string
  slug: string
  image_url: string | null  // full file URL (collection stores a single `image` file)
  created_at: string        // mapped from record.created
}
```

Collection API rules: `listRule`/`viewRule` = `""` (public read), all write rules = `null`
(superuser only). Writes happen through the Next API routes using the logged-in superuser's
session, so guests can read but never mutate.

---

## Auth & Role Guard

- PocketBase auth — `pb.collection('_superusers').authWithPassword(...)` on the login page
- Admin = PocketBase superuser. There is no separate role field; `pb.authStore.isSuperuser`
  is the gate everywhere (middleware, admin layout, API routes via `isAdmin()`)
- Auth session is kept in a JS-readable `pb_auth` cookie (see `src/lib/pocketbase/cookie.ts`).
  The browser client syncs it on `authStore.onChange`; the server client + middleware read it
- `src/proxy.ts` loads the cookie, then redirects to `/login` if invalid or `/` if not a superuser
- To create/reset the admin: `pocketbase.exe superuser upsert admin@patchmood.com <password>`

---

## Key Implementation Details

### 1. Scroll-Driven Video (ScrollVideo.tsx)

- GSAP `ScrollTrigger` maps `scrollY` → `video.currentTime`
- Video is `position: sticky; top: 0` inside a tall scroll container
- **Never** use `video.play()` — drive time directly via `scrub`

### 2. Image Uploads (no standalone upload route)

- Images are PocketBase File fields, sent as part of the record create/update
- ProductForm / CategoriesClient stage `File` objects and submit `multipart/form-data` to the
  product/category API routes, which forward to PocketBase
- On edit, kept existing images are re-sent by filename (PocketBase keeps named files, adds new
  uploads, drops the rest); `fileNameFromUrl()` extracts the filename from a stored URL
- Validation (JPEG/PNG/WebP/AVIF, max 5 MB) is enforced by the collection's file field

### 3. API Routes

- All mutation routes check `isAdmin(pb)` (= `authStore.isValid && isSuperuser`) server-side
- Standard response shape: `{ success: boolean, data?: T, error?: string }`
- PocketBase errors are mapped via `pbErrorResponse()` (uniqueness → 409)

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
# 1. Start PocketBase (separate terminal, keep running):
#    D:\pocketbase_0.38.2_windows_amd64\pocketbase.exe serve --http=127.0.0.1:8090
# 2. One-time superuser (if not created yet):
#    D:\pocketbase_0.38.2_windows_amd64\pocketbase.exe superuser upsert admin@patchmood.com Admin1234!

npm run seed   # create collections + seed mock data (needs PocketBase running)
npm run dev    # dev server
npm run build  # production build
```
