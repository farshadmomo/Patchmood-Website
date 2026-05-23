export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: 'var(--pm-bg-deep)' }}
    >
      {children}
    </div>
  )
}
