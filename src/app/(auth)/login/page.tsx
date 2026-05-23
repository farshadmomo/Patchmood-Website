"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouteTransition } from "@/components/transition/TransitionProvider";

export default function LoginPage() {
  const router = useRouter();
  const { wipeTo } = useRouteTransition();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.get("email") as string,
      password: data.get("password") as string,
    });

    if (authError) {
      setLoading(false);
      setError("Invalid email or password");
      return;
    }

    wipeTo("entering archive", () => {
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
        <span style={{ color: "var(--pm-accent)" }}>&#9632;</span>&nbsp;&nbsp;Mood archive
      </p>
      <h1
        className="pm-display text-white mb-8"
        style={{ fontSize: "2.25rem" }}
      >
        Sign in
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-[0.6875rem] mb-1.5 uppercase tracking-[0.18em]" style={{ color: "var(--pm-fg-subtle)" }}>
            Email
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
            Password
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
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
