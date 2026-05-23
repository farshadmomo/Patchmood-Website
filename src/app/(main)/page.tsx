import { Suspense } from 'react'
import HeroSection from '@/components/hero/ScrollVideo'
import ProductGrid from '@/components/products/ProductGrid'
import CollectionSkeleton from '@/components/products/CollectionSkeleton'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<CollectionSkeleton />}>
        <ProductGrid />
      </Suspense>
    </main>
  )
}
