import type { Product, Category } from '@/types'
import { createClient } from '@/lib/pocketbase/server'
import { toProduct, toCategory } from '@/lib/pocketbase/transform'

/** Read catalog data from the live PocketBase server. */
export const pbAdapter = {
  async getProducts(): Promise<Product[]> {
    const pb = await createClient()
    const records = await pb.collection('products').getFullList({ sort: '-created' })
    return records.map(toProduct)
  },
  async getCategories(): Promise<Category[]> {
    const pb = await createClient()
    const records = await pb.collection('categories').getFullList({ sort: 'name' })
    return records.map(toCategory)
  },
  async getProductBySlug(slug: string): Promise<Product | null> {
    const pb = await createClient()
    const record = await pb
      .collection('products')
      .getFirstListItem(pb.filter('slug = {:slug}', { slug }))
      .catch(() => null)
    return record ? toProduct(record) : null
  },
  async getRelatedProducts(category: string, excludeId: string, limit: number): Promise<Product[]> {
    const pb = await createClient()
    const res = await pb.collection('products').getList(1, limit, {
      filter: pb.filter('category = {:category} && id != {:id}', { category, id: excludeId }),
    })
    return res.items.map(toProduct)
  },
  async getProductOrderIds(): Promise<string[]> {
    const pb = await createClient()
    const rows = await pb.collection('products').getFullList({ sort: 'created', fields: 'id' })
    return rows.map((r) => r.id)
  },
}
