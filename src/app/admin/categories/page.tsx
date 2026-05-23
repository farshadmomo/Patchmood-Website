import { createClient } from '@/lib/supabase/server'
import CategoriesClient from './CategoriesClient'
import type { Category } from '@/types'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return <CategoriesClient initialCategories={(data ?? []) as Category[]} />
}
