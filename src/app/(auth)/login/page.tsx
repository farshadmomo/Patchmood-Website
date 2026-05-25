"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/pocketbase/client";
import { useRouteTransition } from "@/components/transition/TransitionProvider";
import { useLocale } from "@/i18n/LocaleProvider";

export default function LoginPage() {
  const router = useRouter();
  const { wipeTo } = useRouteTransition();
  const { t } = useLocale();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const pb = createClient();

    try {
      // Try master (superuser) first, then regular admin collection
      try {
        await pb.collection("_superusers").authWithPassword(
          data.get("email") as string,
          data.get("password") as string,
        );
      } catch {
        await pb.collection("admins").authWithPassword(
          data.get("email") as string,
          data.get("password") as string,
        );
      }
    } catch {
      setLoading(false);
      setError(t.login.error);
      return;
    }

    wipeTo(t.login.wipe, () => {
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div
      className="w-full max-w-sm px-8 py-9"
      style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)" }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.625rem",
          textTransform: "uppercase",
          letterSpacing: "0.28em",
          color: "var(--pm-accent)",
          marginBottom: "0.5rem",
        }}
      >
        <span style={{ color: "var(--pm-accent)" }}>&#9632;</span>&nbsp;&nbsp;{t.login.eyebrow}
      </p>
      <h1
        className="pm-display text-white mb-8"
        style={{ fontSize: "2.25rem" }}
      >
        {t.login.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-[0.6875rem] mb-1.5 uppercase tracking-[0.18em]" style={{ color: "var(--pm-fg-subtle)" }}>
            {t.login.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full px-4 py-2.5 text-sm transition-colors"
            style={{ background: "oklch(0.13 0.006 40)", border: "1px solid var(--pm-border)", color: "var(--pm-fg)", outline: "none" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--pm-accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--pm-border)")}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-[0.6875rem] mb-1.5 uppercase tracking-[0.18em]" style={{ color: "var(--pm-fg-subtle)" }}>
            {t.login.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-2.5 text-sm transition-colors"
            style={{ background: "oklch(0.13 0.006 40)", border: "1px solid var(--pm-border)", color: "var(--pm-fg)", outline: "none" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--pm-accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--pm-border)")}
          />
        </div>

        {error && (
          <p className="text-xs" style={{ color: "var(--pm-accent-bright)" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-xs uppercase tracking-[0.22em] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: "var(--pm-accent)", color: "oklch(0.97 0.004 60)" }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--pm-accent-bright)"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--pm-accent)"; }}
        >
          {loading && (
            <span
              className="animate-spin"
              style={{
                display: "inline-block",
                width: "13px",
                height: "13px",
                border: "1.5px solid oklch(0.97 0.004 60)",
                borderTopColor: "transparent",
                borderRadius: "50%",
              }}
              aria-hidden="true"
            />
          )}
          {loading ? t.login.signingIn : t.login.submit}
        </button>
      </form>
    </div>
  );
}
