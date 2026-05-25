/**
 * Export the live PocketBase catalog to a static JSON snapshot for the Vercel
 * (server-less) deploy.
 *
 * What it does:
 *   1. Reads every `products` + `categories` record from PocketBase.
 *   2. Downloads each record's image file(s) into `public/catalog/...`.
 *   3. Rewrites image URLs to root-relative paths (`/catalog/...`).
 *   4. Writes `src/data/catalog.json` (the shape the JSON data adapter reads).
 *
 * PocketBase must be running. Usage:
 *   npm run export:json
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import PocketBase, { type RecordModel } from 'pocketbase'

const url = process.env.NEXT_PUBLIC_POCKETBASE_URL
const email = process.env.PB_SUPERUSER_EMAIL
const password = process.env.PB_SUPERUSER_PASSWORD

if (!url) {
  console.error('Missing NEXT_PUBLIC_POCKETBASE_URL in .env.local')
  process.exit(1)
}

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(APP_ROOT, 'public', 'catalog')
const OUT_FILE = path.join(APP_ROOT, 'src', 'data', 'catalog.json')

const pb = new PocketBase(url)
pb.autoCancellation(false)

interface ExportProduct {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  images: string[]
  category: string
  tags: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

interface ExportCategory {
  id: string
  name: string
  slug: string
  image_url: string | null
  created_at: string
}

/** Download one PocketBase file into public/catalog and return its root-relative path. */
async function downloadFile(
  collectionName: string,
  record: RecordModel,
  filename: string,
): Promise<string> {
  const remote = `${url}/api/files/${record.collectionId}/${record.id}/${filename}`
  const res = await fetch(remote)
  if (!res.ok) throw new Error(`Failed to download ${remote} (${res.status})`)
  const buf = Buffer.from(await res.arrayBuffer())

  const destDir = path.join(PUBLIC_DIR, collectionName, record.id)
  await fs.mkdir(destDir, { recursive: true })
  await fs.writeFile(path.join(destDir, filename), buf)

  return `/catalog/${collectionName}/${record.id}/${filename}`
}

async function exportProducts(): Promise<ExportProduct[]> {
  const records = await pb.collection('products').getFullList({ sort: '-created' })
  const out: ExportProduct[] = []
  for (const r of records) {
    const files = (r.images as string[]) ?? []
    const images: string[] = []
    for (const f of files) {
      images.push(await downloadFile('products', r, f))
      console.log(`  ↓ products/${r.slug}/${f}`)
    }
    out.push({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      short_description: r.short_description ?? '',
      images,
      category: r.category,
      tags: (r.tags as string[]) ?? [],
      featured: !!r.featured,
      created_at: r.created,
      updated_at: r.updated,
    })
  }
  return out
}

async function exportCategories(): Promise<ExportCategory[]> {
  const records = await pb.collection('categories').getFullList({ sort: 'name' })
  const out: ExportCategory[] = []
  for (const r of records) {
    let image_url: string | null = null
    if (r.image) {
      image_url = await downloadFile('categories', r, r.image as string)
      console.log(`  ↓ categories/${r.slug}/${r.image}`)
    }
    out.push({
      id: r.id,
      name: r.name,
      slug: r.slug,
      image_url,
      created_at: r.created,
    })
  }
  return out
}

async function main() {
  if (email && password) {
    console.log('Authenticating as superuser…')
    await pb.collection('_superusers').authWithPassword(email, password)
  }

  // Start clean so deleted records' images don't linger.
  await fs.rm(PUBLIC_DIR, { recursive: true, force: true })
  await fs.mkdir(PUBLIC_DIR, { recursive: true })

  console.log('Exporting catalog…')
  const products = await exportProducts()
  const categories = await exportCategories()

  const payload = {
    generatedAt: new Date().toISOString(),
    products,
    categories,
  }
  await fs.writeFile(OUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8')

  console.log(`\nWrote ${products.length} products + ${categories.length} categories`)
  console.log(`  → ${path.relative(APP_ROOT, OUT_FILE)}`)
  console.log(`  → images under public/catalog/`)
}

main().catch((e) => {
  console.error(e?.response ?? e)
  process.exit(1)
})
