'use client'

import { SkeletonShell, Sk } from '@/components/ui/Skeleton'

export default function CollectionSkeleton() {
  return (
    <section style={{ background: 'var(--pm-bg)' }}>
      <SkeletonShell
        blocks={
          <div>
            {/* Section header */}
            <div className="px-5 md:px-10 pt-24 pb-12 max-w-[88rem] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <Sk w="9rem" h="0.7rem" style={{ marginBottom: '1rem' }} />
                <Sk w="22rem" h="4.5rem" style={{ maxWidth: '70vw' }} />
              </div>
              <Sk w="16rem" h="2.5rem" style={{ maxWidth: '60vw' }} />
            </div>

            {/* Category plates rail */}
            <div className="px-5 md:px-10 max-w-[88rem] mx-auto mb-14">
              <div className="flex gap-4 overflow-hidden">
                {[0, 1, 2, 3].map((i) => (
                  <Sk
                    key={i}
                    h="clamp(240px, 30vw, 320px)"
                    r={2}
                    style={{ flex: '0 0 auto', width: i === 0 ? 'clamp(150px,19vw,200px)' : 'clamp(180px,24vw,280px)' }}
                  />
                ))}
              </div>
            </div>

            {/* Featured block */}
            <div className="px-5 md:px-10 max-w-[88rem] mx-auto mb-3">
              <Sk w="100%" h="440px" r={2} />
            </div>

            {/* Grid */}
            <div className="px-5 md:px-10 max-w-[88rem] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Sk key={i} w="100%" h="348px" r={2} />
                ))}
              </div>
            </div>
            <div className="h-24" />
          </div>
        }
      />
    </section>
  )
}
