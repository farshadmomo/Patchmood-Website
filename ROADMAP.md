# ROADMAP.md — Development Roadmap

> **Stack:** Next.js 14 · Tailwind CSS · GSAP · MongoDB · NextAuth.js  
> **Goal:** Scroll-driven product showcase with admin content management

---

## Phase Overview

```
Phase 1 → Foundation & Setup          (Days 1–2)
Phase 2 → Scroll Video Hero           (Days 3–4)
Phase 3 → Auth & Database             (Days 5–6)
Phase 4 → Product Catalog             (Days 7–8)
Phase 5 → Admin Dashboard             (Days 9–11)
Phase 6 → Polish & Deploy             (Days 12–14)
```

---

## Phase 1 — Foundation & Setup

**Goal:** Clean, working dev environment with all dependencies wired up.

### Tasks

- [ ] Scaffold Next.js project with TypeScript
  ```bash
  npx create-next-app@latest . --typescript --tailwind --app --eslint
  ```
- [ ] Install core dependencies
  ```bash
  npm install gsap mongoose next-auth bcryptjs cloudinary
  npm install -D @types/bcryptjs
  ```
- [ ] Configure `tailwind.config.ts` — custom colors, fonts, animation tokens
- [ ] Set up folder structure (see `CLAUDE.md`)
- [ ] Create `.env.local` with all required environment variables
- [ ] Set up MongoDB Atlas cluster and get connection string
- [ ] Create `lib/mongodb.ts` — Mongoose singleton connection
- [ ] Set up Cloudinary account and configure unsigned upload preset
- [ ] Create `middleware.ts` — protect `/admin/*` routes
- [ ] Configure `next.config.ts` — image domains, video handling

**Exit Criteria:** `npm run dev` runs, Tailwind works, MongoDB connects, env vars load.

---

## Phase 2 — Scroll-Driven Video Hero

**Goal:** The hero video scrubs forward/backward based on scroll position.

### Tasks

- [ ] Place generated hero video at `/public/video/hero.mp4`
- [ ] Create `components/hero/ScrollVideo.tsx`
  - `<video>` element: `muted`, `playsInline`, `preload="auto"`, no controls
  - Sticky positioning inside a tall scroll container (`height: 500vh`)
  - GSAP `ScrollTrigger` maps scroll progress → `video.currentTime`
  - Cleanup on unmount (`trigger.kill()`)
- [ ] Create `components/hero/HeroText.tsx`
  - Overlay text that fades/slides with GSAP as user scrolls
  - Staggered reveal animation on initial load
- [ ] Register GSAP plugins in a shared `lib/gsap.ts` init file
- [ ] Test scroll behavior on desktop and mobile
- [ ] Add loading state — show poster frame while video loads (`onLoadedMetadata`)
- [ ] Performance check — ensure video doesn't block LCP

**Exit Criteria:** Scrolling down advances the video; scrolling up reverses it. Smooth, no jank.

---

## Phase 3 — Authentication & Database

**Goal:** Users can register and log in; admins have elevated access.

### Tasks

- [ ] Create `models/User.ts` Mongoose schema
  - Fields: `name`, `email`, `password` (hashed), `role: 'user' | 'admin'`
- [ ] Configure NextAuth in `lib/auth.ts`
  - Credentials provider
  - JWT strategy
  - Include `role` in session and token via callbacks
- [ ] Create `app/api/auth/[...nextauth]/route.ts`
- [ ] Build `app/(auth)/login/page.tsx`
  - Clean login form (email + password)
  - Error states (wrong credentials, server error)
  - Redirect to `/` on success, `/admin` if admin
- [ ] Build `app/(auth)/register/page.tsx` (optional — or admin-invite only)
- [ ] Update `middleware.ts`
  - `/admin/*` → requires `role === 'admin'`, else redirect to `/login`
  - `/login` → redirect to `/` if already logged in
- [ ] Create `npm run seed` script (`scripts/seed.ts`)
  - Creates default admin user with hashed password
- [ ] Add user menu to Navbar (login/logout, show name, show Admin link if admin)

**Exit Criteria:** Login/logout works. Admin routes are protected. Session persists across refreshes.

---

## Phase 4 — Product Catalog

**Goal:** Products are stored in MongoDB and displayed on the frontend.

### Tasks

- [ ] Create `models/Product.ts` Mongoose schema
  - Fields: `name`, `slug`, `description`, `shortDescription`, `images[]`, `category`, `tags[]`, `featured`
- [ ] Create API routes:
  - `GET /api/products` — list all products (with optional `?category=` filter)
  - `GET /api/products/[id]` — single product
- [ ] Build `components/products/ProductGrid.tsx`
  - Responsive grid (1 → 2 → 3 columns)
  - GSAP scroll-triggered stagger reveal for cards
- [ ] Build `components/products/ProductCard.tsx`
  - Image, name, short description, category tag
  - Hover animation (scale, shadow lift)
- [ ] Build `components/products/ProductModal.tsx` or route `app/(main)/products/[slug]/page.tsx`
  - Full product detail view
  - Image gallery with thumbnail strip
- [ ] Wire up data fetching in `app/(main)/page.tsx`
  - Server component fetch from MongoDB
  - Pass products to `ProductGrid`
- [ ] Add category filter bar (optional — can be Phase 6 polish)

**Exit Criteria:** Products from MongoDB appear in the grid. Product detail page works. No cart or purchase actions anywhere.

---

## Phase 5 — Admin Dashboard

**Goal:** Admins can upload, edit, and delete products through a protected UI.

### Tasks

- [ ] Build `app/admin/layout.tsx`
  - Server-side role check (redirect non-admins)
  - Admin sidebar navigation
- [ ] Build `app/admin/page.tsx` — dashboard overview
  - Stats: total products, total users
  - Quick links
- [ ] Build `app/admin/products/page.tsx`
  - Table of all products with name, category, image thumbnail, actions
  - Actions: Edit, Delete
- [ ] Build `app/admin/products/new/page.tsx`
  - `ProductForm` component with fields: name, description, shortDescription, category, tags, images, featured toggle
  - Image upload via Cloudinary (drag & drop or file picker)
  - Form validation
  - On submit → `POST /api/products`
- [ ] Build `app/admin/products/[id]/edit/page.tsx`
  - Pre-fill form with existing product data
  - On submit → `PUT /api/products/[id]`
- [ ] Build `components/admin/DeleteButton.tsx`
  - Confirmation modal before deletion
  - On confirm → `DELETE /api/products/[id]`
  - Remove images from Cloudinary on delete
- [ ] Secure all mutation API routes
  - Check `session.user.role === 'admin'` server-side
  - Return `403` for unauthorized attempts
- [ ] Add success/error toast notifications for all admin actions

**Exit Criteria:** Admin can add a product with images, edit it, and delete it. All changes reflect on the public site immediately.

---

## Phase 6 — Polish & Deploy

**Goal:** Production-ready, performant, visually polished.

### Tasks

#### Performance

- [ ] Add `loading.tsx` skeleton states for product grid
- [ ] Implement `next/image` with proper `sizes` and `priority` props
- [ ] Lazy-load non-hero video components
- [ ] Add `Suspense` boundaries around async data fetching
- [ ] Audit Lighthouse scores (target: 90+ Performance)

#### UX & Animation

- [ ] Page transition animations (GSAP `useLayoutEffect` or Framer Motion)
- [ ] Smooth scroll behavior (`scroll-behavior: smooth` or Lenis)
- [ ] Mobile responsive audit — video hero on mobile (consider poster image fallback)
- [ ] 404 page with on-brand design
- [ ] Error boundary for failed data fetches

#### Security

- [ ] Rate-limit login endpoint (prevent brute force)
- [ ] Sanitize all form inputs
- [ ] Validate file types on image upload (images only, no executables)
- [ ] Add CSRF protection (NextAuth handles this by default)
- [ ] Ensure `NEXTAUTH_SECRET` is strong and unique

#### Deployment

- [ ] Push to GitHub repository
- [ ] Deploy to **Vercel**
  - Connect MongoDB Atlas (whitelist Vercel IPs or allow all)
  - Add all environment variables in Vercel dashboard
- [ ] Set up Cloudinary production environment
- [ ] Configure custom domain (if applicable)
- [ ] Test full flow on production (login, admin upload, public view)
- [ ] Set up MongoDB Atlas backups

**Exit Criteria:** Site is live, fast, secure, and fully functional on production.

---

## Backlog (Future Phases)

These are intentionally out of scope for the current build but tracked here for future planning.

| Feature                | Notes                                      |
| ---------------------- | ------------------------------------------ |
| Shopping cart          | When ready to enable purchasing            |
| Stripe checkout        | Payment integration                        |
| Order management       | Admin order tracking                       |
| User profiles          | Edit account, view history                 |
| Product search         | Full-text search with MongoDB Atlas Search |
| Product filters        | Filter by category, tags, price range      |
| Product reviews        | Star ratings + text reviews                |
| Email notifications    | Welcome email, new product alert           |
| Analytics dashboard    | Views per product, visitor stats           |
| Multi-language (i18n)  | `next-intl` or `next-i18next`              |
| Dark/light mode toggle | Persist preference in localStorage         |
| Blog/news section      | CMS-backed editorial content               |

---

## Dependency Reference

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "gsap": "^3.x",
    "mongoose": "^8.x",
    "next-auth": "^5.x (beta)",
    "bcryptjs": "^2.x",
    "cloudinary": "^2.x"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.x",
    "@types/node": "^20.x",
    "eslint": "^8.x",
    "eslint-config-next": "^14.x"
  }
}
```
