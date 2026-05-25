import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "New Product — PatchMood Admin",
};

export default function NewProductPage() {
  return (
    <div className="px-4 pt-6 pb-12 md:px-10 md:pt-12 md:pb-16" style={{ maxWidth: "64rem" }}>
      {/* Page header */}
      <header style={{ marginBottom: "2.5rem" }}>
        <nav style={{ marginBottom: "0.75rem" }}>
          <Link
            href="/admin/products"
            style={{
              fontSize: "0.75rem",
              color: "var(--pm-fg-subtle)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Products
          </Link>
        </nav>
        <p
          style={{
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "var(--pm-fg-subtle)",
            marginBottom: "0.375rem",
          }}
        >
          Admin / Products / New
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            textTransform: "uppercase",
            fontWeight: 400,
            fontSize: "2.5rem",
            color: "var(--pm-fg)",
            lineHeight: 1.1,
          }}
        >
          New product
        </h1>
      </header>

      <ProductForm mode="create" />
    </div>
  );
}
