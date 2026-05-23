'use client'

import Link, { useLinkStatus } from 'next/link'
import type { ComponentProps } from 'react'
import { useEffect } from 'react'
import { useRouteTransition } from './TransitionProvider'

function PendingReporter() {
  const { pending } = useLinkStatus()
  const { reportPending } = useRouteTransition()

  useEffect(() => {
    reportPending(pending)
  }, [pending, reportPending])

  return null
}

export default function ProgressLink({ children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      <PendingReporter />
      {children}
    </Link>
  )
}
