"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Product, Category } from "@/types";
import { fileNameFromUrl } from "@/lib/pocketbase/transform";
import Toast, { type ToastData } from "./Toast";

interface StagedImage {
  file: File;
  preview: string;
}

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

const INPUT = {
  width: "100%",
  background: "oklch(0.14 0.010 265)",
  border: "1px solid var(--pm-border)",
  borderRadius: "0.375rem",
  padding: "0.625rem 0.875rem",
  fontSize: "0.875rem",
  color: "var(--pm-fg)",
  outline: "none",
  transition: "border-color 150ms",
  fontFamily: "var(--font-body)",
} as React.CSSProperties;

const LABEL = {
  display: "block",
  fontSize: "0.6875rem",
  fontWeight: 500,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "var(--pm-fg-subtle)",
  marginBottom: "0.4rem",
};

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [shortDescription, setShortDescription] = useState(product?.short_description ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [tags, setTags] = useState<string[]>(product?.tags ?? []);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  // Existing images are full PocketBase file URLs; new ones are staged File objects.
  const [existingImages, setExistingImages] = useState<string[]>(product?.images ?? []);
  const [newImages, setNewImages] = useState<StagedImage[]>([]);

  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((j) => { if (j.success) setCategories(j.data) })
      .finally(() => setCategoriesLoading(false))
  }, [])

  // Release object URLs for staged previews when the form unmounts.
  const newImagesRef = useRef(newImages);
  newImagesRef.current = newImages;
  useEffect(() => {
    return () => { newImagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview)) }
  }, [])

  function handleNameChange(value: string) {
    setName(value);
    if (mode === "create") setSlug(toSlug(value));
  }

  function addTag(raw: string) {
    const t = raw.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  function removeTag(t: string) {
    setTags((prev) => prev.filter((x) => x !== t));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const staged = Array.from(files).map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setNewImages((prev) => [...prev, ...staged]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  }

  function removeNewImage(preview: string) {
    setNewImages((prev) => {
      const target = prev.find((img) => img.preview === preview);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.preview !== preview);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.set("name", name);
    fd.set("slug", slug);
    fd.set("description", description);
    fd.set("short_description", shortDescription);
    fd.set("category", category);
    fd.set("featured", String(featured));
    fd.set("tags", JSON.stringify(tags));
    // Re-send kept existing files by filename, then append the new uploads.
    for (const url of existingImages) fd.append("images", fileNameFromUrl(url));
    for (const { file } of newImages) fd.append("images", file);

    const url = mode === "create" ? "/api/products" : `/api/products/${product?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, { method, body: fd });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: mode === "create" ? "Product created" : "Changes saved" });
        if (mode === "create") {
          setTimeout(() => router.push("/admin/products"), 1000);
        }
      } else {
        setToast({ type: "error", message: json.error ?? "Something went wrong" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-8"
          style={{ alignItems: "start" }}
        >
          {/* Left column — main fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Name */}
            <div>
              <label htmlFor="pm-name" style={LABEL}>
                Name <span style={{ color: "oklch(0.62 0.20 25)" }}>*</span>
              </label>
              <input
                id="pm-name"
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Dusk Reverie"
                style={INPUT}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.45 0.08 265)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--pm-border)")}
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="pm-slug" style={LABEL}>
                Slug <span style={{ color: "oklch(0.62 0.20 25)" }}>*</span>
              </label>
              <input
                id="pm-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dusk-reverie"
                style={{ ...INPUT, fontFamily: "var(--font-mono)", fontSize: "0.8125rem" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.45 0.08 265)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--pm-border)")}
              />
              <p style={{ fontSize: "0.6875rem", color: "var(--pm-fg-subtle)", marginTop: "0.3rem" }}>
                Auto-generated from name. Used in the product URL.
              </p>
            </div>

            {/* Short description */}
            <div>
              <label htmlFor="pm-short" style={LABEL}>
                Short description
              </label>
              <input
                id="pm-short"
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="When the day fades and thoughts linger."
                maxLength={120}
                style={INPUT}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.45 0.08 265)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--pm-border)")}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="pm-desc" style={LABEL}>
                Description <span style={{ color: "oklch(0.62 0.20 25)" }}>*</span>
              </label>
              <textarea
                id="pm-desc"
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A muted palette of dusty rose and deep charcoal…"
                style={{
                  ...INPUT,
                  resize: "vertical",
                  minHeight: "120px",
                  lineHeight: 1.65,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.45 0.08 265)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--pm-border)")}
              />
            </div>
          </div>

          {/* Right column — metadata + images */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Category */}
            <div>
              <label htmlFor="pm-cat" style={LABEL}>
                Category <span style={{ color: "oklch(0.62 0.20 25)" }}>*</span>
              </label>
              <select
                id="pm-cat"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={categoriesLoading}
                style={{ ...INPUT, width: "100%", cursor: categoriesLoading ? "not-allowed" : "pointer" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.45 0.08 265)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--pm-border)")}
              >
                <option value="">{categoriesLoading ? "Loading…" : "Select category…"}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label style={LABEL}>Tags</label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="mood, art, bold…"
                  style={{ ...INPUT, flex: 1 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.45 0.08 265)")}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--pm-border)";
                    if (tagInput.trim()) addTag(tagInput);
                  }}
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  style={{
                    padding: "0 0.875rem",
                    background: "oklch(0.18 0.012 265)",
                    border: "1px solid var(--pm-border)",
                    borderRadius: "0.375rem",
                    color: "var(--pm-fg-muted)",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.6875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--pm-fg-muted)",
                        background: "oklch(0.18 0.012 265)",
                        border: "1px solid var(--pm-border)",
                        borderRadius: "2rem",
                        padding: "0.2rem 0.5rem 0.2rem 0.625rem",
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove tag ${tag}`}
                        style={{
                          color: "oklch(0.42 0.008 70)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          lineHeight: 1,
                          display: "flex",
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured */}
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <span
                  onClick={() => setFeatured((v) => !v)}
                  style={{
                    width: "2.25rem",
                    height: "1.25rem",
                    borderRadius: "2rem",
                    background: featured ? "var(--pm-accent)" : "oklch(0.22 0.012 265)",
                    border: "1px solid " + (featured ? "oklch(0.72 0.14 355 / 0.5)" : "var(--pm-border)"),
                    position: "relative",
                    flexShrink: 0,
                    transition: "background 200ms, border-color 200ms",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "0.125rem",
                      left: featured ? "1.0625rem" : "0.125rem",
                      width: "0.875rem",
                      height: "0.875rem",
                      borderRadius: "50%",
                      background: featured ? "oklch(0.09 0.008 270)" : "oklch(0.40 0.012 265)",
                      transition: "left 200ms",
                    }}
                  />
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                  />
                </span>
                <span style={{ fontSize: "0.8125rem", color: "var(--pm-fg-muted)" }}>
                  Featured product
                </span>
              </label>
              <p style={{ fontSize: "0.6875rem", color: "var(--pm-fg-subtle)", marginTop: "0.3rem", paddingLeft: "3rem" }}>
                Shown as the hero card on the collection page.
              </p>
            </div>

            {/* Images */}
            <div>
              <label style={LABEL}>Images</label>

              {(existingImages.length > 0 || newImages.length > 0) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {existingImages.map((url, i) => (
                    <ImageThumb key={url} src={url} alt={`Product image ${i + 1}`} onRemove={() => removeExistingImage(url)} />
                  ))}
                  {newImages.map((img) => (
                    <ImageThumb key={img.preview} src={img.preview} alt="New image" onRemove={() => removeNewImage(img.preview)} />
                  ))}
                </div>
              )}

              {/* Upload file */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="pm-file-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.625rem",
                  background: "transparent",
                  border: "1px dashed oklch(0.28 0.010 265)",
                  borderRadius: "0.375rem",
                  fontSize: "0.8125rem",
                  color: "var(--pm-fg-subtle)",
                  cursor: "pointer",
                  transition: "border-color 150ms, color 150ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.40 0.012 265)";
                  e.currentTarget.style.color = "var(--pm-fg-muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.28 0.010 265)";
                  e.currentTarget.style.color = "var(--pm-fg-subtle)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 9V3M4.5 5.5L7 3l2.5 2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 10v1.5a.5.5 0 00.5.5h9a.5.5 0 00.5-.5V10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
                Upload image
              </button>
              <p style={{ fontSize: "0.6875rem", color: "var(--pm-fg-subtle)", marginTop: "0.4rem" }}>
                JPEG, PNG, WebP or AVIF · up to 5 MB each.{newImages.length > 0 ? " New images upload when you save." : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--pm-border)",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: "2.75rem",
              fontSize: "0.8125rem",
              color: "var(--pm-fg-subtle)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 0.75rem",
              transition: "color 150ms",
              touchAction: "manipulation",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pm-fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pm-fg-subtle)")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "2.75rem",
              padding: "0 1.75rem",
              background: loading ? "oklch(0.52 0.10 355)" : "var(--pm-accent)",
              border: "none",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "oklch(0.09 0.008 270)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 150ms, opacity 150ms",
              touchAction: "manipulation",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "oklch(0.78 0.13 355)"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--pm-accent)"; }}
          >
            {loading ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
          </button>
        </div>
      </form>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}

function ImageThumb({ src, alt, onRemove }: { src: string; alt: string; onRemove: () => void }) {
  return (
    <div style={{ position: "relative", aspectRatio: "1", borderRadius: "0.375rem", overflow: "hidden", background: "oklch(0.14 0.010 265)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        style={{
          position: "absolute",
          top: "0.25rem",
          right: "0.25rem",
          background: "oklch(0.08 0.008 270 / 0.7)",
          border: "none",
          borderRadius: "50%",
          width: "1.25rem",
          height: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "oklch(0.80 0.005 70)",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
