# ENV.md — Environment Variables Setup Guide

This file documents every environment variable used in the project and how to obtain each value. **Never commit `.env.local` to version control.**

---

## Quick Setup

Copy this block into your `.env.local` file and fill in the values:

```env
# ─── MongoDB ─────────────────────────────────────────────
MONGODB_URI=

# ─── NextAuth ────────────────────────────────────────────
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# ─── Cloudinary ──────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## Variable Reference

### `MONGODB_URI`

Your full MongoDB Atlas connection string.

**How to get it:**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Create a database user (Database Access → Add New Database User)
4. Whitelist your IP (Network Access → Add IP Address → Allow Access From Anywhere for dev)
5. Click Connect → Drivers → Copy the connection string
6. Replace `<password>` with your database user password

```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/mydb?retryWrites=true&w=majority
```

---

### `NEXTAUTH_SECRET`

A random secret string used to sign JWTs and cookies.

**How to generate:**

```bash
# In your terminal:
openssl rand -base64 32
```

Paste the output directly as the value. It should look like:

```
NEXTAUTH_SECRET=K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
```

---

### `NEXTAUTH_URL`

The canonical URL of your application.

```env
# Development
NEXTAUTH_URL=http://localhost:3000

# Production (replace with your actual domain)
NEXTAUTH_URL=https://yourdomain.com
```

> On Vercel, `NEXTAUTH_URL` is often set automatically but should still be explicitly defined.

---

### `CLOUDINARY_CLOUD_NAME`

Your Cloudinary account's cloud name (visible in the Cloudinary dashboard).

**How to get it:**

1. Sign up at [Cloudinary](https://cloudinary.com) (free tier is sufficient)
2. Go to Dashboard → your Cloud Name is shown at the top

```
CLOUDINARY_CLOUD_NAME=my-cloud-name
```

---

### `CLOUDINARY_API_KEY` & `CLOUDINARY_API_SECRET`

Your Cloudinary API credentials for server-side uploads.

**How to get them:**

1. Cloudinary Dashboard → Settings → API Keys
2. Copy API Key and API Secret

```
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

> ⚠️ `CLOUDINARY_API_SECRET` is sensitive — never prefix it with `NEXT_PUBLIC_`.

---

### `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

Same as `CLOUDINARY_CLOUD_NAME` but exposed to the browser (needed for client-side upload widgets).

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=my-cloud-name
```

---

### `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

An unsigned upload preset for client-side uploads (avoids exposing API secret to the browser).

**How to create one:**

1. Cloudinary Dashboard → Settings → Upload
2. Scroll to Upload Presets → Add upload preset
3. Set Signing Mode to **Unsigned**
4. Set folder to `products`
5. Save and copy the preset name

```
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=products_unsigned
```

---

## Production (Vercel)

When deploying to Vercel, add all variables via:

- Vercel Dashboard → Project → Settings → Environment Variables
- Or via Vercel CLI: `vercel env add VARIABLE_NAME`

**Change `NEXTAUTH_URL` to your production domain:**

```
NEXTAUTH_URL=https://your-site.vercel.app
```

**MongoDB Atlas — allow Vercel IPs:**

- Option A: Allow access from anywhere (`0.0.0.0/0`) — simple but less secure
- Option B: Add Vercel's static IPs — requires Vercel Pro plan

---

## `.gitignore` Reminder

Ensure your `.gitignore` includes:

```
.env
.env.local
.env.production.local
.env.development.local
```

`create-next-app` adds these by default, but always double-check before your first commit.
