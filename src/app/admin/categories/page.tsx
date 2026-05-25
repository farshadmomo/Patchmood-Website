import { createClient } from '@/lib/pocketbase/server'
import { toCategory } from '@/lib/pocketbase/transform'
import CategoriesClient from './CategoriesClient'

export default async function CategoriesPage() {
  const pb = await createClient()
  const records = await pb.collection('categories').getFullList({ sort: 'name' })
  return <CategoriesClient initialCategories={records.map(toCategory)} />
}
