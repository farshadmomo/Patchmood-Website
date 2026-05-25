'use client'

import { useState } from 'react'

interface AdminUser {
  id: string
  email: string
  name: string
  created: string
}

interface AdminsClientProps {
  initialAdmins: AdminUser[]
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  background: 'oklch(0.13 0.006 40)',
  border: '1px solid var(--pm-border)',
  color: 'var(--pm-fg)',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '0.625rem',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: 'var(--pm-fg-subtle)',
  marginBottom: '0.375rem',
}

const ACTION_BTN: React.CSSProperties = {
  fontSize: '0.6875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
}

export default function AdminsClient({ initialAdmins }: AdminsClientProps) {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', name: '', password: '', passwordConfirm: '' })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null)

  function showToast(message: string, ok: boolean) {
    setToast({ message, ok })
    setTimeout(() => setToast(null), 4000)
  }

  function resetForm() {
    setForm({ email: '', name: '', password: '', passwordConfirm: '' })
    setFormError('')
    setShowForm(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.passwordConfirm) {
      setFormError('Passwords do not match')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create admin')
      setAdmins((prev) => [...prev, json.data])
      resetForm()
      showToast('Admin created', true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create admin')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admins/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to delete admin')
      setAdmins((prev) => prev.filter((a) => a.id !== id))
      showToast('Admin removed', true)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete admin', false)
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            padding: '0.75rem 1.25rem',
            background: 'oklch(0.18 0.012 265)',
            border: `1px solid ${toast.ok ? 'var(--pm-border)' : 'var(--pm-accent)'}`,
            fontSize: '0.8125rem',
            color: 'var(--pm-fg)',
            zIndex: 100,
            borderRadius: '0.25rem',
            boxShadow: '0 4px 20px oklch(0.04 0.005 40 / 0.5)',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Create form */}
      <div style={{ marginBottom: '2rem' }}>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5625rem 1rem',
              background: 'var(--pm-accent)',
              border: 'none',
              color: 'oklch(0.97 0.004 60)',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              minHeight: '2.25rem',
              touchAction: 'manipulation',
            }}
          >
            + Add Admin
          </button>
        ) : (
          <div
            style={{
              padding: '1.5rem',
              background: 'var(--pm-surface)',
              border: '1px solid var(--pm-border)',
              maxWidth: '480px',
            }}
          >
            <p
              style={{
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--pm-fg-subtle)',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              New admin
            </p>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={LABEL_STYLE}>Name (optional)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pm-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pm-border)')}
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pm-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pm-border)')}
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pm-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pm-border)')}
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>Confirm password *</label>
                <input
                  type="password"
                  required
                  value={form.passwordConfirm}
                  onChange={(e) => setForm((p) => ({ ...p, passwordConfirm: e.target.value }))}
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pm-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pm-border)')}
                />
              </div>
              {formError && (
                <p style={{ fontSize: '0.75rem', color: 'var(--pm-accent-bright)' }}>{formError}</p>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'none',
                    border: '1px solid var(--pm-border)',
                    color: 'var(--pm-fg-muted)',
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    touchAction: 'manipulation',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.5rem 1.25rem',
                    background: 'var(--pm-accent)',
                    border: 'none',
                    color: 'oklch(0.97 0.004 60)',
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    cursor: saving ? 'wait' : 'pointer',
                    fontFamily: 'var(--font-mono)',
                    opacity: saving ? 0.7 : 1,
                    touchAction: 'manipulation',
                  }}
                >
                  {saving ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Admin list */}
      {admins.length === 0 ? (
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            border: '1px dashed var(--pm-border)',
            color: 'var(--pm-fg-subtle)',
            fontSize: '0.875rem',
          }}
        >
          No admin users yet. Add one above.
        </div>
      ) : (
        <div style={{ border: '1px solid var(--pm-border)' }}>
          {/* Desktop table */}
          <div className="hidden md:block" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pm-border)' }}>
                  {['Name', 'Email', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        fontSize: '0.625rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.22em',
                        color: 'var(--pm-fg-subtle)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, i) => (
                  <tr
                    key={admin.id}
                    style={{ borderBottom: i < admins.length - 1 ? '1px solid var(--pm-border)' : 'none' }}
                  >
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--pm-fg)', fontWeight: 500 }}>
                      {admin.name || '—'}
                    </td>
                    <td
                      style={{
                        padding: '0.875rem 1rem',
                        color: 'var(--pm-fg-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {admin.email}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      {confirmDelete === admin.id ? (
                        <span style={{ display: 'inline-flex', gap: '0.75rem' }}>
                          <button
                            onClick={() => handleDelete(admin.id)}
                            disabled={deletingId === admin.id}
                            style={{ ...ACTION_BTN, color: 'var(--pm-accent)', cursor: deletingId === admin.id ? 'wait' : 'pointer' }}
                          >
                            {deletingId === admin.id ? 'Removing…' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            style={{ ...ACTION_BTN, color: 'var(--pm-fg-subtle)' }}
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(admin.id)}
                          style={{ ...ACTION_BTN, color: 'var(--pm-fg-subtle)', transition: 'color 150ms' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pm-accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pm-fg-subtle)')}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden">
            {admins.map((admin, i) => (
              <div
                key={admin.id}
                style={{
                  padding: '1rem',
                  borderBottom: i < admins.length - 1 ? '1px solid var(--pm-border)' : 'none',
                }}
              >
                <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--pm-fg)', marginBottom: '0.125rem' }}>
                  {admin.name || admin.email}
                </p>
                {admin.name && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--pm-fg-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.125rem' }}>
                    {admin.email}
                  </p>
                )}
                {admin.created && (
                  <p style={{ fontSize: '0.6875rem', color: 'var(--pm-fg-subtle)', marginBottom: '0.875rem' }}>
                    Added {fmtDate(admin.created)}
                  </p>
                )}
                {confirmDelete === admin.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      disabled={deletingId === admin.id}
                      style={{
                        flex: 1,
                        minHeight: '2.75rem',
                        background: 'var(--pm-accent)',
                        border: 'none',
                        color: 'oklch(0.97 0.004 60)',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        cursor: deletingId === admin.id ? 'wait' : 'pointer',
                        fontFamily: 'var(--font-mono)',
                        touchAction: 'manipulation',
                      }}
                    >
                      {deletingId === admin.id ? 'Removing…' : 'Confirm remove'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      style={{
                        flex: 1,
                        minHeight: '2.75rem',
                        background: 'none',
                        border: '1px solid var(--pm-border)',
                        color: 'var(--pm-fg-muted)',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        touchAction: 'manipulation',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(admin.id)}
                    style={{
                      minHeight: '2.75rem',
                      padding: '0 1rem',
                      background: 'none',
                      border: '1px solid var(--pm-border)',
                      color: 'var(--pm-fg-subtle)',
                      fontSize: '0.6875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      touchAction: 'manipulation',
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
