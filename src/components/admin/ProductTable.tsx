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
      <div style={{ overflowX: "auto" }}>
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
