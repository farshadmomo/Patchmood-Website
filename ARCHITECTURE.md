# ARCHITECTURE.md — Technical Architecture

> Deep-dive reference for developers. See `CLAUDE.md` for quick context and `ROADMAP.md` for task planning.

---

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
│                                                         │
│  ┌──────────────┐   ┌──────────────┐  ┌─────────────┐  │
│  │  Hero Section │   │ Product Grid  │  │ Admin Panel │  │
│  │  (GSAP/Video) │   │ (Server RSC) │  │ (Protected) │  │
│  └──────┬───────┘   └──────┬───────┘  └──────┬──────┘  │
└─────────┼──────────────────┼─────────────────┼──────────┘
          │                  │                 │
          ▼                  ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│                   Next.js App Router                     │
│                                                         │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  middleware │  │  API Routes  │  │  Server Actions │  │
│  │  (auth guard)│  │  /api/*     │  │  (form submits) │  │
│  └────────────┘  └──────┬───────┘  └────────┬────────┘  │
└──────────────────────────┼──────────────────┼────────────┘
                           │                  │
          ┌────────────────┼──────────────────┤
          ▼                ▼                  ▼
   ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
   │  NextAuth   │  │  MongoDB    │  │  Cloudinary  │
   │  (Sessions) │  │  (Data)     │  │  (Media)     │
   └─────────────┘  └─────────────┘  └──────────────┘
```

---

## Routing Architecture

### App Router Layout

```
app/
│
├── middleware.ts                    ← Runs on every request
│
├── (auth)/                          ← Auth route group (no shared layout chrome)
│   ├── layout.tsx                   ← Minimal centered layout
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (main)/                          ← Public route group
│   ├── layout.tsx                   ← Navbar + Footer
│   ├── page.tsx                     ← Home: hero video + product grid
│   └── products/
│       └── [slug]/page.tsx          ← Product detail
│
└── admin/                           ← Protected (role: admin)
    ├── layout.tsx                   ← Admin shell (sidebar + topbar)
    ├── page.tsx                     ← Dashboard stats
    └── products/
        ├── page.tsx                 ← Product list table
        ├── new/page.tsx             ← Upload form
        └── [id]/
            └── edit/page.tsx        ← Edit form
```

### Route Protection Flow

```
Request → middleware.ts
    │
    ├─ /admin/*
    │       ├─ No session?          → redirect /login
    │       └─ role !== 'admin'?    → redirect /
    │
    ├─ /login, /register
    │       └─ Has session?         → redirect /
    │
    └─ Everything else              → pass through
```

---

## Authentication Flow

### Login Sequence

```
User submits login form
        │
        ▼
POST /api/auth/callback/credentials
        │
        ▼
NextAuth CredentialsProvider
    - Find user by email in MongoDB
    - Compare password with bcrypt
    - Return user object { id, name, email, role }
        │
        ▼
JWT Callback
    - Add user.role to token
        │
        ▼
Session Callback
    - Add token.role to session.user
        │
        ▼
Client receives session: { user: { id, name, email, role } }
```

### NextAuth Configuration (`lib/auth.ts`)

```ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};
```

---

## Scroll Video Architecture

### Component Structure

```
app/(main)/page.tsx
└── <ScrollVideoSection>              ← 'use client'
        ├── containerRef  (div, height: 500vh)
        └── <video>
                ref: videoRef
                muted, playsInline, preload="auto"
                style: position sticky, top: 0, height: 100vh
```

### GSAP Scrubbing Logic

```ts
// hooks/useScrollVideo.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollVideo(
  containerRef: RefObject<HTMLDivElement>,
  videoRef: RefObject<HTMLVideoElement>,
) {
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Wait until video metadata is loaded to know duration
    const init = () => {
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // 1 second lag for smoothness
        onUpdate: (self) => {
          // Directly set currentTime — no play() calls
          video.currentTime = self.progress * video.duration;
        },
      });

      return () => trigger.kill();
    };

    if (video.readyState >= 1) {
      return init();
    } else {
      video.addEventListener("loadedmetadata", init, { once: true });
      return () => video.removeEventListener("loadedmetadata", init);
    }
  }, [containerRef, videoRef]);
}
```

### Mobile Considerations

- On mobile, large video files may not preload reliably
- Fallback strategy: detect if `video.duration` is `NaN` after 3s → switch to poster image + CSS parallax
- Consider serving a smaller, compressed mobile video via `<source media="(max-width: 768px)">`

---

## Database Layer

### Connection Singleton (`lib/mongodb.ts`)

```ts
import mongoose from "mongoose";

let cached = global.mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

> **Why singleton?** Next.js API routes are serverless functions — without caching, each request opens a new connection and exhausts the pool.

### Product Model (`models/Product.ts`)

```ts
const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 160 },
    images: [{ type: String }], // Cloudinary URLs
    category: { type: String, required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Auto-generate slug from name before save
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
```

---

## API Design

### Endpoint Reference

| Method | Path                       | Auth Required | Description        |
| ------ | -------------------------- | ------------- | ------------------ |
| GET    | `/api/products`            | No            | List all products  |
| GET    | `/api/products?category=x` | No            | Filter by category |
| GET    | `/api/products/[id]`       | No            | Get single product |
| POST   | `/api/products`            | Admin         | Create product     |
| PUT    | `/api/products/[id]`       | Admin         | Update product     |
| DELETE | `/api/products/[id]`       | Admin         | Delete product     |

### Standard Response Shape

```ts
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }
```

### Server-Side Auth Check (API Routes)

```ts
// Always check this in mutation routes
const session = await getServerSession(authOptions);
if (!session || session.user.role !== "admin") {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 403 },
  );
}
```

---

## Media Upload Flow (Cloudinary)

```
Admin selects image file
        │
        ▼
Client: POST to /api/upload (multipart/form-data)
        │
        ▼
Server: verify session.role === 'admin'
        │
        ▼
Server: upload to Cloudinary via SDK
    cloudinary.uploader.upload(file, {
      folder: 'products',
      transformation: [{ width: 1200, quality: 'auto', fetch_format: 'auto' }]
    })
        │
        ▼
Server: return { url, public_id }
        │
        ▼
Client: store URL in product form state
        │
        ▼
On product save: URL array stored in MongoDB
```

---

## GSAP Integration Notes

### Plugin Registration

Always register plugins once, globally:

```ts
// lib/gsap.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

### SSR Safety

GSAP only runs client-side. Always wrap in:

- `useEffect` (React)
- `'use client'` directive on the component
- `typeof window !== 'undefined'` guard for plugin registration

### Cleanup Pattern

```ts
useEffect(() => {
  const ctx = gsap.context(() => {
    // All animations here
  }, containerRef);

  return () => ctx.revert(); // Cleanup all GSAP instances
}, []);
```

---

## Security Checklist

- [ ] Passwords hashed with `bcryptjs` (salt rounds: 12)
- [ ] `NEXTAUTH_SECRET` is a long random string (32+ chars)
- [ ] All mutation API routes check `session.user.role === 'admin'`
- [ ] File upload endpoint validates MIME type (only `image/*`)
- [ ] File upload has size limit (e.g., 10MB max)
- [ ] MongoDB connection string never exposed to client
- [ ] Environment variables never committed to git (`.env.local` in `.gitignore`)
- [ ] Admin route protection in both `middleware.ts` AND server-side in layouts

---

## Performance Targets

| Metric                         | Target                        |
| ------------------------------ | ----------------------------- |
| LCP (Largest Contentful Paint) | < 2.5s                        |
| FID / INP                      | < 100ms                       |
| CLS                            | < 0.1                         |
| Video file size                | < 30MB (compress with ffmpeg) |
| Lighthouse Performance         | > 90                          |

### Video Compression Command

```bash
ffmpeg -i original.mp4 \
  -vcodec libx264 \
  -crf 23 \
  -preset slow \
  -vf scale=1920:-2 \
  -acodec aac \
  -b:a 128k \
  hero.mp4
```
