import { createClient } from '@/lib/supabase/server'
import type { Product, Category } from '@/types'
import ProductCatalog from './ProductCatalog'

export default async function ProductGrid() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name'),
  ])

  return (
    <ProductCatalog
      products={(products ?? []) as Product[]}
      categories={(categories ?? []) as Category[]}
    />
  )
}
