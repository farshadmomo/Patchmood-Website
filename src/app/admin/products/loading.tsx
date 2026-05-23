'use client'

import { SkeletonShell, Sk } from '@/components/ui/Skeleton'

export default function ProductsLoading() {
  return (
    <SkeletonShell
      blocks={
        <div style={{ padding: '3rem 2.5rem 4rem' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
            }}
          >
            <div>
              <Sk w="7rem" h="0.6rem" style={{ marginBottom: '0.6rem' }} />
              <Sk w="9rem" h="2.5rem" />
            </div>
            <Sk w="7.5rem" h="2.25rem" r={6} />
          </div>

          {/* Table */}
          <div
            style={{
              background: 'var(--pm-surface)',
              border: '1px solid var(--pm-border)',
              borderRadius: '0.5rem',
              overflow: 'hidden',
            }}
          >
            {/* Table head */}
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                padding: '0.75rem 1.5rem',
                borderBottom: '1px solid var(--pm-border)',
              }}
            >
              <Sk w="8rem" h="0.6rem" />
              <Sk w="5rem" h="0.6rem" />
              <Sk w="4rem" h="0.6rem" style={{ marginLeft: 'auto' }} />
            </div>

            {/* Rows */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1.5rem',
                  borderBottom: i < 6 ? '1px solid oklch(0.14 0.010 265)' : 'none',
                }}
              >
                <Sk w="2.75rem" h="2.75rem" r={4} />
                <div style={{ flex: 1 }}>
                  <Sk w="10rem" h="0.875rem" style={{ marginBottom: '0.375rem' }} />
                  <Sk w="5rem" h="0.7rem" />
                </div>
                <Sk w="3.5rem" h="0.75rem" />
                <Sk w="1.25rem" h="1.25rem" r={4} />
              </div>
            ))}
          </div>

          <Sk w="6rem" h="0.75rem" style={{ marginTop: '1rem' }} />
        </div>
      }
    />
  )
}
