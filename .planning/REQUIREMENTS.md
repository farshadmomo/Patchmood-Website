# Requirements: PatchMood

**Defined:** 2026-05-19
**Core Value:** A visually stunning, scroll-driven browsing experience that makes products feel worth owning before the user even clicks.

## v1 Requirements

### Hero & Animations

- [ ] **HERO-01**: User sees a full-viewport video playing as they scroll down the page
- [ ] **HERO-02**: Video scrubs forward on scroll-down and reverses on scroll-up (GSAP ScrollTrigger)
- [ ] **HERO-03**: Hero text fades in on page load with staggered animation
- [ ] **HERO-04**: Hero text fades out as user scrolls into the video section
- [ ] **HERO-05**: Product cards animate into view with staggered GSAP scroll reveal

### Products

- [ ] **PROD-01**: User can browse all products in a responsive grid (1→2→3 columns)
- [ ] **PROD-02**: Each product card shows image, name, short description, and category tag
- [ ] **PROD-03**: User can view full product detail (name, description, image gallery)
- [ ] **PROD-04**: Products can be filtered by category

### Authentication

- [ ] **AUTH-01**: Admin can log in with email and password
- [ ] **AUTH-02**: Login session persists across browser refresh (JWT)
- [ ] **AUTH-03**: Admin can log out from any page
- [ ] **AUTH-04**: Non-admin users are redirected away from /admin/* routes

### Admin Dashboard

- [ ] **ADMIN-01**: Admin can create a new product (name, description, category, tags, images, featured toggle)
- [ ] **ADMIN-02**: Admin can upload images for products via Cloudinary
- [ ] **ADMIN-03**: Admin can edit an existing product
- [ ] **ADMIN-04**: Admin can delete a product (with confirmation)
- [ ] **ADMIN-05**: Admin sees all products in a table with thumbnail, name, category, actions
- [ ] **ADMIN-06**: Admin dashboard shows total product and user counts

### Navigation

- [ ] **NAV-01**: Site has a navbar with the PatchMood brand name
- [ ] **NAV-02**: Navbar shows login/logout state and Admin link when logged in as admin

## v2 Requirements

### Social & Engagement

- **NOTF-01**: User receives email notifications for new products
- **SRCH-01**: User can search products by name or tag (full-text search)
- **FLTR-01**: User can filter by tags and price range

### Moderation

- **MODR-01**: Admin can report/flag content
- **MODR-02**: Admin can ban users

## Out of Scope

| Feature | Reason |
|---------|--------|
| Shopping cart | No purchasing in v1 — browse only |
| Checkout / Stripe | No payments in v1 |
| Order management | No orders in v1 |
| User profile editing | Not needed for browse-only |
| Product reviews/ratings | Deferred to v2 |
| Email notifications | Deferred to v2 |
| i18n / multi-language | Deferred |
| Dark/light mode toggle | Deferred |
| Real-time chat | High complexity, not core |
| Mobile app | Web-first |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| HERO-05 | Phase 4 | Pending |
| PROD-01 | Phase 4 | Pending |
| PROD-02 | Phase 4 | Pending |
| PROD-03 | Phase 4 | Pending |
| PROD-04 | Phase 4 | Pending |
| AUTH-01 | Phase 3 | Pending |
| AUTH-02 | Phase 3 | Pending |
| AUTH-03 | Phase 3 | Pending |
| AUTH-04 | Phase 3 | Pending |
| ADMIN-01 | Phase 5 | Pending |
| ADMIN-02 | Phase 5 | Pending |
| ADMIN-03 | Phase 5 | Pending |
| ADMIN-04 | Phase 5 | Pending |
| ADMIN-05 | Phase 5 | Pending |
| ADMIN-06 | Phase 5 | Pending |
| NAV-01 | Phase 1 | Pending |
| NAV-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-19*
*Last updated: 2026-05-19 after initial definition*
