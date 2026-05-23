"use client";

import { useEffect } from "react";

export type ToastData = {
  type: "success" | "error";
  message: string;
};

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        animation: "toast-in 0.25s ease-out",
      }}
    >
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.875rem 1.25rem",
          background: "oklch(0.18 0.012 265)",
          border: `1px solid ${toast.type === "success" ? "oklch(0.55 0.18 145 / 0.5)" : "oklch(0.55 0.20 25 / 0.5)"}`,
          borderRadius: "0.5rem",
          maxWidth: "22rem",
          boxShadow: "0 8px 32px oklch(0.04 0.008 270 / 0.6)",
        }}
      >
        {toast.type === "success" ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7" stroke="oklch(0.65 0.18 145)" strokeWidth="1.5" />
            <path d="M5 8l2 2 4-4" stroke="oklch(0.65 0.18 145)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7" stroke="oklch(0.62 0.20 25)" strokeWidth="1.5" />
            <path d="M8 5v4M8 11v.5" stroke="oklch(0.62 0.20 25)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
        <span style={{ fontSize: "0.8125rem", color: "oklch(0.88 0.005 70)", lineHeight: 1.4 }}>
          {toast.message}
        </span>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            marginLeft: "0.5rem",
            color: "oklch(0.45 0.008 70)",
            cursor: "pointer",
            flexShrink: 0,
            background: "none",
            border: "none",
            padding: "2px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
