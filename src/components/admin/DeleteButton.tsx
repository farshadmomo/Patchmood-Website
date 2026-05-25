"use client";

import { useState } from "react";
import type { ToastData } from "./Toast";

interface DeleteButtonProps {
  productId: string;
  productName: string;
  onDeleted: (id: string) => void;
  onToast: (toast: ToastData) => void;
  /** "inline" = compact text link (desktop table); "block" = full-width 44px touch button (mobile card) */
  variant?: "inline" | "block";
}

export default function DeleteButton({ productId, productName, onDeleted, onToast, variant = "inline" }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        onDeleted(productId);
        onToast({ type: "success", message: `"${productName}" deleted` });
      } else {
        onToast({ type: "error", message: json.error ?? "Delete failed" });
      }
    } catch {
      onToast({ type: "error", message: "Network error" });
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  const block = variant === "block";

  if (confirming) {
    return (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          width: block ? "100%" : "auto",
        }}
      >
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            fontSize: block ? "0.8125rem" : "0.75rem",
            fontWeight: block ? 600 : 400,
            color: "oklch(0.72 0.20 25)",
            background: "oklch(0.62 0.20 25 / 0.1)",
            border: "1px solid oklch(0.62 0.20 25 / 0.35)",
            borderRadius: "0.375rem",
            padding: block ? "0 1rem" : "0.25rem 0.625rem",
            minHeight: block ? "2.75rem" : undefined,
            flex: block ? 1 : undefined,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            transition: "background 150ms",
            touchAction: "manipulation",
          }}
        >
          {loading ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          style={{
            fontSize: block ? "0.8125rem" : "0.75rem",
            color: "var(--pm-fg-subtle)",
            background: block ? "oklch(0.18 0.012 265)" : "none",
            border: block ? "1px solid var(--pm-border)" : "none",
            borderRadius: block ? "0.375rem" : undefined,
            padding: block ? "0 1rem" : "0.25rem 0.25rem",
            minHeight: block ? "2.75rem" : undefined,
            flex: block ? 1 : undefined,
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          Cancel
        </button>
      </span>
    );
  }

  if (block) {
    return (
      <button
        onClick={() => setConfirming(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.375rem",
          width: "100%",
          minHeight: "2.75rem",
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: "oklch(0.7 0.18 25)",
          background: "oklch(0.62 0.20 25 / 0.06)",
          border: "1px solid oklch(0.62 0.20 25 / 0.25)",
          borderRadius: "0.375rem",
          cursor: "pointer",
          transition: "background 150ms",
          touchAction: "manipulation",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path d="M1.5 3h10M4.5 3V2h4v1M5.5 5.5v4M7.5 5.5v4M2.5 3l.75 8h5.5l.75-8" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Delete
      </button>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        fontSize: "0.75rem",
        color: "oklch(0.52 0.16 25)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0.25rem 0",
        transition: "color 150ms",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.65 0.20 25)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.52 0.16 25)")}
    >
      Delete
    </button>
  );
}
