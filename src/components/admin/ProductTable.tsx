"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import DeleteButton from "./DeleteButton";
import Toast, { type ToastData } from "./Toast";

interface ProductTableProps {
  initialProducts: Product[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [toast, setToast] = useState<ToastData | null>(null);

  function handleDeleted(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            textTransform: "uppercase",
            fontSize: "2rem",
            color: "var(--pm-fg-subtle)",
            marginBottom: "0.75rem",
          }}
        >
          No products yet
        </p>
        <p style={{ fontSize: "0.8125rem", color: "oklch(0.38 0.008 70)", marginBottom: "1.5rem" }}>
          The collection is empty.
        </p>
        <Link
          href="/admin/products/new"
          style={{
            fontSize: "0.8125rem",
            color: "var(--pm-accent)",
            border: "1px solid oklch(0.72 0.14 355 / 0.35)",
            borderRadius: "0.375rem",
            padding: "0.5rem 1.25rem",
            textDecoration: "none",
            transition: "background 150ms",
          }}
        >
          Add first product
        </Link>
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </div>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards (data tables don't work with horizontal scroll on phones) */}
      <div className="md:hidden">
        {products.map((product, i) => (
          <div
            key={product.id}
            style={{
              padding: "1rem",
              borderBottom: i < products.length - 1 ? "1px solid oklch(0.16 0.010 265)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--pm-fg)", marginBottom: "0.15rem" }}>
                  {product.name}
                </p>
                <p style={{ fontSize: "0.6875rem", color: "var(--pm-fg-subtle)", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
                  /{product.slug}
                </p>
              </div>
              {product.featured && (
                <span
                  style={{
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--pm-accent)",
                    border: "1px solid oklch(0.72 0.14 355 / 0.35)",
                    borderRadius: "2rem",
                    padding: "0.15rem 0.5rem",
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--pm-accent)" }} />
                  Featured
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.625rem 0", fontSize: "0.75rem", color: "var(--pm-fg-muted)" }}>
              <span>{product.category}</span>
              <span style={{ color: "var(--pm-border-strong, oklch(0.3 0.01 265))" }}>·</span>
              <span style={{ color: "var(--pm-fg-subtle)", fontFamily: "var(--font-mono)" }}>{formatDate(product.created_at)}</span>
            </div>

            {product.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.875rem" }}>
                {product.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.625rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "oklch(0.48 0.008 70)",
                      background: "oklch(0.18 0.012 265)",
                      border: "1px solid var(--pm-border)",
                      borderRadius: "2rem",
                      padding: "0.125rem 0.5rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {product.tags.length > 4 && (
                  <span style={{ fontSize: "0.625rem", color: "oklch(0.38 0.008 70)", alignSelf: "center" }}>
                    +{product.tags.length - 4}
                  </span>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link
                href={`/admin/products/${product.id}/edit`}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                  minHeight: "2.75rem",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--pm-fg)",
                  background: "oklch(0.18 0.012 265)",
                  border: "1px solid var(--pm-border)",
                  borderRadius: "0.375rem",
                  textDecoration: "none",
                  touchAction: "manipulation",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M9 1.5l2.5 2.5M1.5 11.5l.5-2.5 7-7 2.5 2.5-7 7-2.5.5z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Edit
              </Link>
              <div style={{ flex: 1, display: "flex" }}>
                <DeleteButton
                  productId={product.id}
                  productName={product.name}
                  onDeleted={handleDeleted}
                  onToast={setToast}
                  variant="block"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--pm-border)",
              }}
            >
              {["Name", "Category", "Tags", "Featured", "Added", ""].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "0.625rem 1rem",
                    textAlign: "left",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--pm-fg-subtle)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr
                key={product.id}
                style={{
                  borderBottom: i < products.length - 1 ? "1px solid oklch(0.16 0.010 265)" : "none",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "oklch(0.14 0.010 265)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
              >
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--pm-fg)", marginBottom: "0.125rem" }}>
                      {product.name}
                    </p>
                    <p style={{ fontSize: "0.6875rem", color: "var(--pm-fg-subtle)", fontFamily: "var(--font-mono)" }}>
                      /{product.slug}
                    </p>
                  </div>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--pm-fg-muted)" }}>{product.category}</span>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                    {product.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.625rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "oklch(0.48 0.008 70)",
                          background: "oklch(0.18 0.012 265)",
                          border: "1px solid var(--pm-border)",
                          borderRadius: "2rem",
                          padding: "0.125rem 0.5rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span style={{ fontSize: "0.625rem", color: "oklch(0.38 0.008 70)" }}>
                        +{product.tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  {product.featured ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.6875rem",
                        color: "var(--pm-accent)",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--pm-accent)",
                          flexShrink: 0,
                        }}
                      />
                      Yes
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.6875rem", color: "oklch(0.32 0.008 70)" }}>—</span>
                  )}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--pm-fg-muted)", whiteSpace: "nowrap" }}>
                    {formatDate(product.created_at)}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.875rem" }}>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--pm-fg-muted)",
                        textDecoration: "none",
                        transition: "color 150ms",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pm-fg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pm-fg-muted)")}
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      productId={product.id}
                      productName={product.name}
                      onDeleted={handleDeleted}
                      onToast={setToast}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
