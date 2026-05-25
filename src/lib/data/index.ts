import type { Product, Category } from '@/types'
import { getDataSource } from './source'
import { jsonAdapter } from './json'
import { pbAdapter } from './pocketbase'

interface CatalogAdapter {
  getProducts(): Promise<Product[]>
  getCategories(): Promise<Category[]>
  getProductBySlug(slug: string): Promise<Product | null>
  getRelatedProducts(category: string, excludeId: string, limit: number): Promise<Product[]>
  getProductOrderIds(): Promise<string[]>
}

const adapter: CatalogAdapter = getDataSource() === 'json' ? jsonAdapter : pbAdapter

export const getProducts = () => adapter.getProducts()
export const getCategories = () => adapter.getCategories()
export const getProductBySlug = (slug: string) => adapter.getProductBySlug(slug)
export const getRelatedProducts = (category: string, excludeId: string, limit: number) =>
  adapter.getRelatedProducts(category, excludeId, limit)
export const getProductOrderIds = () => adapter.getProductOrderIds()
