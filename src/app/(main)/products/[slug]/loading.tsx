'use client'

import { SkeletonShell, Sk } from '@/components/ui/Skeleton'

export default function ProductDetailLoading() {
  return (
    <SkeletonShell
      blocks={
        <div className="max-w-[82rem] mx-auto px-5 md:px-10 pt-24 md:pt-28 pb-20">
          {/* Breadcrumb row */}
          <div className="flex items-center justify-between mb-10 md:mb-14">
            <Sk w="9rem" h="0.75rem" />
            <Sk w="6rem" h="0.7rem" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16">
            {/* Gallery frame */}
            <div style={{ aspectRatio: '4 / 5' }}>
              <Sk w="100%" h="100%" />
            </div>

            {/* Spec content */}
            <div>
              <Sk w="7rem" h="0.7rem" style={{ marginBottom: '1.5rem' }} />
              <Sk w="80%" h="3.5rem" style={{ marginBottom: '1.5rem' }} />
              <Sk w="60%" h="1.1rem" style={{ marginBottom: '2rem' }} />

              <div style={{ height: '1px', background: 'var(--pm-border)', marginBottom: '1.75rem' }} />

              {[0, 1, 2, 3].map((i) => (
                <Sk key={i} w={`${92 - i * 8}%`} h="0.8rem" style={{ marginBottom: '0.7rem' }} />
              ))}

              <div className="flex gap-2" style={{ margin: '2rem 0' }}>
                {[0, 1, 2].map((i) => (
                  <Sk key={i} w="4rem" h="1.6rem" />
                ))}
              </div>

              <Sk w="100%" h="3.25rem" />
            </div>
          </div>
        </div>
      }
    />
  )
}
