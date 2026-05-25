'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/admin/Sidebar'

interface AdminShellProps {
  children: React.ReactNode
  userName?: string | null
  userEmail?: string | null
  isMaster?: boolean
}

export default function AdminShell({ children, userName, userEmail, isMaster }: AdminShellProps) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setSidebarOpen(false)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const mobile = mounted && isMobile

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--pm-bg)' }}>
      <Sidebar
        userName={userName}
        userEmail={userEmail}
        isMobile={mobile}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMaster={isMaster}
      />

      {/* Mobile drawer overlay */}
      {mobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 39,
            background: 'oklch(0.04 0.005 40 / 0.65)',
            backdropFilter: 'blur(2px)',
          }}
          aria-hidden="true"
        />
      )}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: mobile ? 0 : '14rem',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Mobile sticky top bar */}
        {mobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0 1rem',
              height: '3.25rem',
              background: 'var(--pm-surface)',
              borderBottom: '1px solid var(--pm-border)',
              position: 'sticky',
              top: 0,
              zIndex: 38,
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              className="pm-burger"
              data-open={sidebarOpen}
              aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <span className="pm-burger-box" aria-hidden="true">
                <span className="pm-burger-bar pm-burger-bar-1" />
                <span className="pm-burger-bar pm-burger-bar-2" />
                <span className="pm-burger-bar pm-burger-bar-3" />
              </span>
            </button>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-display)',
                textTransform: 'uppercase',
                fontSize: '1.125rem',
                color: 'var(--pm-fg)',
                letterSpacing: '0.02em',
                textDecoration: 'none',
              }}
            >
              Patch<span style={{ color: 'var(--pm-accent)' }}>mood</span>
            </Link>
          </div>
        )}

        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
