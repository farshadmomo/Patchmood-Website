import type { RecordModel } from 'pocketbase'
import type { Product, Category } from '@/types'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!

/** Build the public file URL PocketBase serves a record's file at. */
export function fileUrl(collectionId: string, recordId: string, filename: string) {
  return `${PB_URL}/api/files/${collectionId}/${recordId}/${filename}`
}

/** Extract the bare PocketBase filename from a file URL produced by fileUrl(). */
export function fileNameFromUrl(url: string) {
  return url.split('/').pop() ?? url
}

/** Map a PocketBase products record into the app's Product view-model. */
export function toProduct(r: RecordModel): Product {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    short_description: r.short_description ?? '',
    images: ((r.images as string[]) ?? []).map((f) => fileUrl(r.collectionId, r.id, f)),
    category: r.category,
    tags: (r.tags as string[]) ?? [],
    featured: !!r.featured,
    created_at: r.created,
    updated_at: r.updated,
  }
}

/** Map a PocketBase categories record into the app's Category view-model. */
export function toCategory(r: RecordModel): Category {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    image_url: r.image ? fileUrl(r.collectionId, r.id, r.image as string) : null,
    created_at: r.created,
  }
}
