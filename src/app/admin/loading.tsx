'use client'

import { SkeletonShell, Sk } from '@/components/ui/Skeleton'

export default function AdminLoading() {
  return (
    <SkeletonShell
      blocks={
        <div style={{ padding: '3rem 2.5rem 4rem', maxWidth: '56rem' }}>
          {/* Page header */}
          <div style={{ marginBottom: '3rem' }}>
            <Sk w="3.5rem" h="0.6rem" style={{ marginBottom: '0.6rem' }} />
            <Sk w="9rem" h="2.5rem" />
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              borderTop: '1px solid var(--pm-border)',
              borderBottom: '1px solid var(--pm-border)',
              marginBottom: '3rem',
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: '1.25rem 1.5rem',
                  borderRight: i < 2 ? '1px solid var(--pm-border)' : 'none',
                }}
              >
                <Sk w="4rem" h="0.6rem" style={{ marginBottom: '0.6rem' }} />
                <Sk w="2.5rem" h="1.75rem" />
              </div>
            ))}
          </div>

          {/* Section heading row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <Sk w="8rem" h="0.75rem" />
            <Sk w="4rem" h="0.75rem" />
          </div>

          {/* Recent rows */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.875rem 0',
                borderBottom: '1px solid oklch(0.14 0.010 265)',
              }}
            >
              <div>
                <Sk w="11rem" h="0.875rem" style={{ marginBottom: '0.4rem' }} />
                <Sk w="5.5rem" h="0.7rem" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                <Sk w="4.5rem" h="0.7rem" />
                <Sk w="2rem" h="0.7rem" />
              </div>
            </div>
          ))}

          {/* CTA button */}
          <Sk w="7.5rem" h="2.25rem" r={6} style={{ marginTop: '3rem' }} />
        </div>
      }
    />
  )
}
