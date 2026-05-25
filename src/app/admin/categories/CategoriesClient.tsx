'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Category } from '@/types'
import Toast, { type ToastData } from '@/components/admin/Toast'

const INPUT: React.CSSProperties = {
  background: 'oklch(0.14 0.010 265)',
  border: '1px solid var(--pm-border)',
  borderRadius: '0.375rem',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  color: 'var(--pm-fg)',
  outline: 'none',
  transition: 'border-color 150ms',
  fontFamily: 'var(--font-body)',
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [name, setName] = useState('')
  const [newFile, setNewFile] = useState<File | null>(null)
  const [newPreview, setNewPreview] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastData | null>(null)

  const newFileRef = useRef<HTMLInputElement>(null)
  const rowFileRef = useRef<HTMLInputElement>(null)
  const editingIdRef = useRef<string | null>(null)

  function sortCats(list: Category[]) {
    return [...list].sort((a, b) => a.name.localeCompare(b.name))
  }

  function handleNewFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (newFileRef.current) newFileRef.current.value = ''
    if (!file) return
    if (newPreview) URL.revokeObjectURL(newPreview)
    setNewFile(file)
    setNewPreview(URL.createObjectURL(file))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setAdding(true)
    try {
      const fd = new FormData()
      fd.set('name', trimmed)
      if (newFile) fd.set('image', newFile)
      const res = await fetch('/api/categories', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.success) {
        setCategories((prev) => sortCats([...prev, json.data]))
        setName('')
        setNewFile(null)
        if (newPreview) URL.revokeObjectURL(newPreview)
        setNewPreview(null)
        setToast({ type: 'success', message: `"${trimmed}" added` })
        router.refresh()
      } else {
        setToast({ type: 'error', message: res.status === 409 ? 'Category already exists' : (json.error ?? 'Failed') })
      }
    } catch {
      setToast({ type: 'error', message: 'Network error' })
    } finally {
      setAdding(false)
    }
  }

  function triggerRowUpload(id: string) {
    editingIdRef.current = id
    rowFileRef.current?.click()
  }

  async function handleRowFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const id = editingIdRef.current
    if (rowFileRef.current) rowFileRef.current.value = ''
    if (!file || !id) return
    const fd = new FormData()
    fd.set('image', file)
    await patchImage(id, fd, 'Image updated')
  }

  function removeRowImage(id: string) {
    const fd = new FormData()
    fd.set('removeImage', 'true')
    patchImage(id, fd, 'Image removed')
  }

  async function patchImage(id: string, fd: FormData, successMessage: string) {
    setBusyId(id)
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'PATCH', body: fd })
      const json = await res.json()
      if (json.success) {
        setCategories((prev) => prev.map((c) => (c.id === id ? json.data : c)))
        setToast({ type: 'success', message: successMessage })
        router.refresh()
      } else {
        setToast({ type: 'error', message: json.error ?? 'Failed' })
      }
    } catch {
      setToast({ type: 'error', message: 'Network error' })
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(cat: Category) {
    setDeletingId(cat.id)
    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id))
        setToast({ type: 'success', message: `"${cat.name}" deleted` })
        router.refresh()
      } else {
        setToast({ type: 'error', message: json.error ?? 'Failed' })
      }
    } catch {
      setToast({ type: 'error', message: 'Network error' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="px-4 pt-6 pb-12 md:px-10 md:pt-12 md:pb-16" style={{ maxWidth: '46rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--pm-fg-subtle)', marginBottom: '0.375rem' }}>
          Admin / Categories
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontWeight: 400, fontSize: '2.5rem', color: 'var(--pm-fg)', lineHeight: 1.1 }}>
          Categories
        </h1>
      </header>

      {/* Hidden inputs */}
      <input ref={newFileRef} type="file" accept="image/*" hidden onChange={handleNewFile} />
      <input ref={rowFileRef} type="file" accept="image/*" hidden onChange={handleRowFile} />

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col sm:flex-row sm:items-end gap-3"
        style={{
          background: 'var(--pm-surface)',
          border: '1px solid var(--pm-border)',
          borderRadius: '0.5rem',
          padding: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Image picker */}
        <button
          type="button"
          onClick={() => newFileRef.current?.click()}
          aria-label="Add category image"
          style={{
            position: 'relative',
            flexShrink: 0,
            width: 72,
            height: 72,
            borderRadius: '0.375rem',
            overflow: 'hidden',
            border: '1px dashed var(--pm-border-strong)',
            background: 'oklch(0.14 0.010 265)',
            cursor: 'pointer',
            color: 'var(--pm-fg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {newPreview ? (
            <Image src={newPreview} alt="" fill sizes="72px" unoptimized style={{ objectFit: 'cover' }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--pm-fg-subtle)', marginBottom: '0.4rem' }}>
            New category
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Euphoria"
            style={{ ...INPUT, width: '100%' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pm-accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pm-border)')}
          />
        </div>

        <button
          type="submit"
          disabled={adding || !name.trim()}
          style={{
            padding: '0.625rem 1.25rem',
            height: '2.6rem',
            background: adding || !name.trim() ? 'var(--pm-accent-dim)' : 'var(--pm-accent)',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'oklch(0.97 0.004 60)',
            cursor: adding || !name.trim() ? 'not-allowed' : 'pointer',
            transition: 'background 150ms',
            whiteSpace: 'nowrap',
          }}
        >
          {adding ? 'Adding…' : 'Add'}
        </button>
      </form>

      {/* List */}
      {categories.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed oklch(0.22 0.010 265)', borderRadius: '0.5rem' }}>
          <p style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '1.25rem', color: 'var(--pm-fg-subtle)' }}>
            No categories yet
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--pm-border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              style={{
                padding: '0.875rem 1rem',
                borderBottom: i < categories.length - 1 ? '1px solid oklch(0.14 0.010 265)' : 'none',
              }}
            >
              <div className="flex items-center gap-3 min-w-0 sm:flex-1">
              {/* Thumbnail */}
              <div
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: 56,
                  height: 56,
                  borderRadius: '0.375rem',
                  overflow: 'hidden',
                  border: '1px solid var(--pm-border)',
                  background: 'var(--pm-bg-deep)',
                }}
              >
                {cat.image_url ? (
                  <Image src={cat.image_url} alt={cat.name} fill sizes="56px" unoptimized style={{ objectFit: 'cover' }} />
                ) : (
                  <span
                    className="pm-display"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: 'var(--pm-fg-subtle)',
                    }}
                  >
                    {cat.name[0]?.toUpperCase()}
                  </span>
                )}
                {busyId === cat.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'oklch(0.08 0.005 40 / 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner />
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--pm-fg)' }}>{cat.name}</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--pm-fg-subtle)', fontFamily: 'var(--font-mono)', marginTop: '0.1rem' }}>
                  {cat.slug}
                </p>
              </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3.5 justify-end">
                <button
                  onClick={() => triggerRowUpload(cat.id)}
                  disabled={busyId === cat.id}
                  className={ACTION_CLS}
                  style={actionBtn(busyId === cat.id, 'var(--pm-fg-muted)')}
                  onMouseEnter={(e) => { if (busyId !== cat.id) e.currentTarget.style.color = 'var(--pm-fg)' }}
                  onMouseLeave={(e) => { if (busyId !== cat.id) e.currentTarget.style.color = 'var(--pm-fg-muted)' }}
                >
                  {cat.image_url ? 'Change' : 'Add image'}
                </button>
                {cat.image_url && (
                  <button
                    onClick={() => removeRowImage(cat.id)}
                    disabled={busyId === cat.id}
                    className={ACTION_CLS}
                    style={actionBtn(busyId === cat.id, 'var(--pm-fg-subtle)')}
                    onMouseEnter={(e) => { if (busyId !== cat.id) e.currentTarget.style.color = 'var(--pm-fg)' }}
                    onMouseLeave={(e) => { if (busyId !== cat.id) e.currentTarget.style.color = 'var(--pm-fg-subtle)' }}
                  >
                    Remove
                  </button>
                )}
                <button
                  onClick={() => handleDelete(cat)}
                  disabled={deletingId === cat.id}
                  aria-label={`Delete ${cat.name}`}
                  className={ACTION_CLS}
                  style={{
                    gap: '0.375rem',
                    fontSize: '0.75rem',
                    color: deletingId === cat.id ? 'var(--pm-fg-subtle)' : 'oklch(0.62 0.20 25)',
                    cursor: deletingId === cat.id ? 'not-allowed' : 'pointer',
                    transition: 'color 150ms',
                    touchAction: 'manipulation',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M1.5 3h10M4.5 3V2h4v1M5.5 5.5v4M7.5 5.5v4M2.5 3l.75 8h5.5l.75-8" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {deletingId === cat.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

// Touch-sized button on mobile (44px, bordered), reverts to compact text link on sm+.
const ACTION_CLS =
  'flex items-center justify-center min-h-[2.75rem] px-3 rounded-md border border-[var(--pm-border)] bg-[oklch(0.18_0.012_265)] transition-colors sm:min-h-0 sm:px-0 sm:border-0 sm:bg-transparent sm:rounded-none'

function actionBtn(disabled: boolean, color: string): React.CSSProperties {
  return {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'color 150ms',
    fontFamily: 'var(--font-mono)',
    touchAction: 'manipulation',
  }
}

function Spinner() {
  return (
    <span
      className="animate-spin"
      style={{
        display: 'inline-block',
        width: 14,
        height: 14,
        border: '1.5px solid var(--pm-fg-subtle)',
        borderTopColor: 'transparent',
        borderRadius: '50%',
      }}
      aria-hidden="true"
    />
  )
}
