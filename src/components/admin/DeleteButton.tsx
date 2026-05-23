"use client";

import { useState } from "react";
import type { ToastData } from "./Toast";

interface DeleteButtonProps {
  productId: string;
  productName: string;
  onDeleted: (id: string) => void;
  onToast: (toast: ToastData) => void;
}

export default function DeleteButton({ productId, productName, onDeleted, onToast }: DeleteButtonProps) {
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

  if (confirming) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            fontSize: "0.75rem",
            color: "oklch(0.62 0.20 25)",
            background: "oklch(0.62 0.20 25 / 0.08)",
            border: "1px solid oklch(0.62 0.20 25 / 0.3)",
            borderRadius: "0.25rem",
            padding: "0.25rem 0.625rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            transition: "background 150ms",
          }}
        >
          {loading ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          style={{
            fontSize: "0.75rem",
            color: "var(--pm-fg-subtle)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem 0.25rem",
          }}
        >
          Cancel
        </button>
      </span>
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
