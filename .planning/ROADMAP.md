# Roadmap: PatchMood

**6 phases** | **21 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation & Setup | Working dev environment, TypeScript, folder structure, Navbar | NAV-01 | 3 |
| 2 | Scroll Video Hero | Cinematic scroll-driven video + GSAP hero text animations | HERO-01–04 | 4 |
| 3 | Auth & Database | Login/logout, session, admin role protection | AUTH-01–04, NAV-02 | 4 |
| 4 | Product Catalog | Products in MongoDB displayed in animated grid | PROD-01–04, HERO-05 | 4 |
| 5 | Admin Dashboard | Protected CRUD UI for managing products + Cloudinary uploads | ADMIN-01–06 | 5 |
| 6 | Polish & Deploy | Performance, UX polish, security hardening, Vercel deploy | — | 4 |

---

## Phase 1 — Foundation & Setup

**Goal:** Clean TypeScript dev environment with all dependencies wired up and correct folder structure.

**Requirements:** NAV-01

**Success criteria:**
1. `npm run dev` starts without errors
2. TypeScript compiles with no errors (`npm run build`)
3. Tailwind v4 utility classes render correctly in the browser
4. Navbar component renders with PatchMood brand name

**Tasks:**
- Install TypeScript + @types/react + @types/react-dom + @types/node
- Create tsconfig.json with strict mode + path aliases (`@/*` → `./src/*`)
- Rename layout.js → layout.tsx, page.js → (main)/page.tsx
- Establish folder structure: app/(main)/, app/(auth)/, components/, lib/, hooks/, types/
- Create types/index.ts with base interfaces
- Create minimal Navbar component
- Update layout.tsx metadata (PatchMood title/description)

**Status:** ◆ In Progress

---

## Phase 2 — Scroll-Driven Video Hero

**Goal:** The hero video scrubs forward/backward based on scroll position with animated overlay text.

**Requirements:** HERO-01, HERO-02, HERO-03, HERO-04

**Success criteria:**
1. Scrolling down advances the video frame-by-frame
2. Scrolling back up reverses it with no jank (scrub: 1)
3. Hero text ("PatchMood" + tagline) fades in on load with stagger
4. Hero text fades out as user scrolls past the first 20% of the video section

**Tasks:**
- Copy bgVideo/1.1-invideo-seedance_2_0.mp4 → public/video/hero.mp4
- Create lib/gsap.ts (SSR-safe plugin registration)
- Create hooks/useScrollVideo.ts (ScrollTrigger scrub logic)
- Create components/hero/ScrollVideo.tsx (sticky video + 500vh container)
- Create components/hero/HeroText.tsx (overlay text with GSAP animations)
- Update app/(main)/page.tsx to compose hero section

**Status:** ○ Pending

---

## Phase 3 — Authentication & Database

**Goal:** Users can log in; admins have elevated access; routes are protected.

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, NAV-02

**Success criteria:**
1. Admin can log in with email/password and session persists across refresh
2. Logging out clears the session
3. /admin/* routes redirect to /login for non-admins
4. Navbar shows user name + Admin link when logged in as admin

**Tasks:**
- Install: mongoose next-auth bcryptjs cloudinary + @types/bcryptjs
- Create lib/mongodb.ts (Mongoose connection singleton)
- Create lib/auth.ts (NextAuth config with Credentials provider + JWT callbacks)
- Create models/User.ts schema
- Create app/api/auth/[...nextauth]/route.ts
- Create app/(auth)/login/page.tsx
- Create app/(auth)/layout.tsx
- Create middleware.ts (route protection)
- Create scripts/seed.ts (default admin user)
- Update Navbar with user menu + login/logout

**Status:** ○ Pending

---

## Phase 4 — Product Catalog

**Goal:** Products are stored in MongoDB and displayed in an animated grid.

**Requirements:** PROD-01, PROD-02, PROD-03, PROD-04, HERO-05

**Success criteria:**
1. Products from MongoDB appear in a responsive 1→2→3 column grid
2. Cards animate in with GSAP stagger reveal on scroll
3. Product detail page shows full description + image gallery
4. Category filter bar filters the grid without page reload

**Tasks:**
- Create models/Product.ts schema (with slug auto-generation)
- Create API routes: GET /api/products, GET /api/products/[id]
- Create components/products/ProductGrid.tsx (GSAP stagger)
- Create components/products/ProductCard.tsx (hover animation)
- Create app/(main)/products/[slug]/page.tsx (detail view)
- Wire server component data fetch in app/(main)/page.tsx

**Status:** ○ Pending

---

## Phase 5 — Admin Dashboard

**Goal:** Admins can upload, edit, and delete products through a protected UI.

**Requirements:** ADMIN-01–06

**Success criteria:**
1. Admin can add a product with images and it appears on the public site
2. Admin can edit and delete products
3. Non-admin users are blocked at layout level (server-side role check)
4. Image uploads go to Cloudinary and URL is stored in MongoDB
5. Success/error toasts appear after all admin actions

**Tasks:**
- Create app/admin/layout.tsx (server-side role check + sidebar)
- Create app/admin/page.tsx (stats dashboard)
- Create app/admin/products/page.tsx (product table)
- Create app/admin/products/new/page.tsx (upload form)
- Create app/admin/products/[id]/edit/page.tsx (edit form)
- Create components/admin/ProductForm.tsx
- Create components/admin/ProductTable.tsx
- Create components/admin/DeleteButton.tsx (with confirmation)
- Secure POST/PUT/DELETE API routes

**Status:** ○ Pending

---

## Phase 6 — Polish & Deploy

**Goal:** Production-ready, performant, visually polished, live on Vercel.

**Success criteria:**
1. Lighthouse Performance > 90
2. Site is live on Vercel with custom domain configured
3. MongoDB Atlas connected and backed up
4. All admin actions work in production

**Tasks:**
- Performance: loading skeletons, Suspense boundaries, image optimization
- UX: smooth scroll (Lenis), page transitions, mobile video fallback, 404 page
- Security: rate-limit login, sanitize inputs, validate upload MIME types
- Deploy: GitHub → Vercel, env vars, MongoDB Atlas IP whitelist

**Status:** ○ Pending

---

## Backlog (Future Phases)

| Feature | Notes |
|---------|-------|
| Shopping cart | When ready to enable purchasing |
| Stripe checkout | Payment integration |
| Product search | MongoDB Atlas Search full-text |
| Product reviews | Star ratings + text |
| Email notifications | Welcome email, new product alert |
| Analytics dashboard | Views per product |
| Dark/light mode | Persist in localStorage |
| Blog/news section | CMS-backed editorial content |
