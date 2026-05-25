import { getProducts, getCategories } from '@/lib/data'
import ProductCatalog from './ProductCatalog'

export default async function ProductGrid() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return <ProductCatalog products={products} categories={categories} />
}
