"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/pocketbase/client";
import ProgressLink from "@/components/transition/ProgressLink";
import CometTrail from "@/components/ui/CometTrail";

interface SidebarProps {
  userName: string | null | undefined;
  userEmail: string | null | undefined;
  isMobile?: boolean;
  open?: boolean;
  onClose?: () => void;
  isMaster?: boolean;
}

const NAV = [
  {
    href: "/admin",
    label: "Overview",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
        <rect x="8.5" y="1" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
        <rect x="1" y="8.5" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M2 4.5h11M2 7.5h11M2 10.5h11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <rect x="0.75" y="0.75" width="13.5" height="13.5" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    ),
    exact: false,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M1.5 4a1 1 0 011-1h3.086a1 1 0 01.707.293l.914.914a1 1 0 00.707.293H12.5a1 1 0 011 1v6a1 1 0 01-1 1h-11a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      </svg>
    ),
    exact: false,
  },
];

const MASTER_NAV = {
  href: "/admin/admins",
  label: "Admins",
  icon: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.25" />
      <path d="M1 12.5C1 10.29 2.79 8.5 5 8.5S9 10.29 9 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="11" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M9.5 12.5c0-1.38.9-2.6 2-3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  exact: false,
};

export default function Sidebar({ userName, userEmail, isMobile, open, onClose, isMaster }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const nav = isMaster ? [...NAV, MASTER_NAV] : NAV;

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  async function handleSignOut() {
    setSigningOut(true);
    const pb = createClient();
    pb.authStore.clear();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      style={{
        position: "fixed",
        insetBlock: 0,
        left: 0,
        width: "14rem",
        display: "flex",
        flexDirection: "column",
        background: "var(--pm-surface)",
        borderRight: "1px solid var(--pm-border)",
        zIndex: 40,
        transform: isMobile ? (open ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
        transition: "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Brand */}
      <div style={{ padding: "1.75rem 1.25rem 1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p
            style={{
              fontSize: "0.625rem",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "var(--pm-fg-subtle)",
              marginBottom: "0.25rem",
            }}
          >
            Admin
          </p>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "var(--pm-fg)",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Patch<span style={{ color: "var(--pm-accent)" }}>mood</span>
          </Link>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--pm-fg-subtle)",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              marginTop: "0.25rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div style={{ height: "1px", background: "var(--pm-border)", margin: "0 1.25rem" }} />

      {/* Nav */}
      <nav style={{ padding: "1rem 0.75rem", flex: 1 }} aria-label="Admin navigation">
        {nav.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <ProgressLink
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.5625rem 0.75rem",
                borderRadius: "0.375rem",
                fontSize: "0.8125rem",
                fontWeight: active ? 500 : 400,
                color: active ? "var(--pm-accent)" : "var(--pm-fg-muted)",
                background: active ? "oklch(0.72 0.14 355 / 0.08)" : "transparent",
                textDecoration: "none",
                transition: "background 150ms, color 150ms",
                marginBottom: "0.125rem",
              }}
            >
              <span style={{ color: active ? "var(--pm-accent)" : "var(--pm-fg-subtle)", flexShrink: 0 }}>
                {item.icon}
              </span>
              {item.label}
            </ProgressLink>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div
        style={{
          padding: "1rem 1.25rem 1.25rem",
          borderTop: "1px solid var(--pm-border)",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "var(--pm-fg)",
            marginBottom: "0.125rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {userName ?? "Admin"}
        </p>
        <p
          style={{
            fontSize: "0.6875rem",
            color: "var(--pm-fg-subtle)",
            marginBottom: "0.875rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {userEmail ?? ""}
        </p>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
            color: signingOut ? "var(--pm-fg)" : "var(--pm-fg-subtle)",
            background: "none",
            border: "none",
            cursor: signingOut ? "wait" : "pointer",
            padding: "0.4rem 0.6rem",
            marginLeft: "-0.6rem",
            transition: "color 150ms",
          }}
          onMouseEnter={(e) => { if (!signingOut) e.currentTarget.style.color = "var(--pm-fg)"; }}
          onMouseLeave={(e) => { if (!signingOut) e.currentTarget.style.color = "var(--pm-fg-subtle)"; }}
        >
          {signingOut && <CometTrail />}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M8.5 4.5V2H1.5v9h7V8.5M10.5 6.5H5M8.5 4.5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
