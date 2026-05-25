import type { Product, Category } from '@/types'
import catalog from '@/data/catalog.json'

const PRODUCTS = catalog.products as Product[]
const CATEGORIES = catalog.categories as Category[]

const byCreatedDesc = (a: Product, b: Product) => b.created_at.localeCompare(a.created_at)
const byCreatedAsc = (a: Product, b: Product) => a.created_at.localeCompare(b.created_at)
const byName = (a: Category, b: Category) => a.name.localeCompare(b.name)

/** Read catalog data from the bundled static snapshot (src/data/catalog.json). */
export const jsonAdapter = {
  async getProducts(): Promise<Product[]> {
    return [...PRODUCTS].sort(byCreatedDesc)
  },
  async getCategories(): Promise<Category[]> {
    return [...CATEGORIES].sort(byName)
  },
  async getProductBySlug(slug: string): Promise<Product | null> {
    return PRODUCTS.find((p) => p.slug === slug) ?? null
  },
  async getRelatedProducts(category: string, excludeId: string, limit: number): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.category === category && p.id !== excludeId).slice(0, limit)
  },
  async getProductOrderIds(): Promise<string[]> {
    return [...PRODUCTS].sort(byCreatedAsc).map((p) => p.id)
  },
}
