'use client'

import { SkeletonShell, Sk } from '@/components/ui/Skeleton'

export default function CategoriesLoading() {
  return (
    <SkeletonShell
      blocks={
        <div style={{ padding: '3rem 2.5rem 4rem', maxWidth: '40rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <Sk w="7rem" h="0.6rem" style={{ marginBottom: '0.6rem' }} />
            <Sk w="9rem" h="2.5rem" />
          </div>

          {/* Add form card */}
          <div
            style={{
              background: 'var(--pm-surface)',
              border: '1px solid var(--pm-border)',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <Sk w="4rem" h="0.6rem" style={{ marginBottom: '0.875rem' }} />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Sk h="2.5rem" style={{ flex: 1 }} r={4} />
              <Sk w="5.5rem" h="2.5rem" r={4} />
            </div>
          </div>

          {/* List */}
          <div
            style={{
              border: '1px solid var(--pm-border)',
              borderRadius: '0.5rem',
              overflow: 'hidden',
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem 1rem',
                  borderBottom: i < 3 ? '1px solid oklch(0.14 0.010 265)' : 'none',
                }}
              >
                <div>
                  <Sk w={`${6 + i * 1.2}rem`} h="0.875rem" style={{ marginBottom: '0.3rem' }} />
                  <Sk w={`${3.5 + i * 0.8}rem`} h="0.65rem" />
                </div>
                <Sk w="1.5rem" h="1.5rem" r={4} />
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}
