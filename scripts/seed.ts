/**
 * Admin setup — creates an admin user in Supabase Auth.
 *
 * Usage (requires SUPABASE_SERVICE_ROLE_KEY in .env.local):
 *   npx tsx --env-file=.env.local scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const ADMIN_EMAIL = "admin@patchmood.com";
const ADMIN_PASSWORD = "Admin1234!";

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  console.log("Creating admin user…");

  const { data, error } = await (supabase.auth.admin as any).createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    app_metadata: { role: "admin" },
  });

  if (error) {
    if ((error.message as string).includes("already been registered")) {
      console.log("User already exists — updating role…");
      const { data: users } = await (supabase.auth.admin as any).listUsers();
      const existing = users?.users?.find((u: any) => u.email === ADMIN_EMAIL);
      if (existing) {
        await (supabase.auth.admin as any).updateUserById(existing.id, {
          app_metadata: { role: "admin" },
        });
        console.log("Role set to admin.");
      }
    } else {
      console.error("Error:", error.message);
      process.exit(1);
    }
  } else {
    console.log("Created:", data.user?.email, "| role: admin");
  }

  console.log("\nAdmin credentials:");
  console.log("  Email:   ", ADMIN_EMAIL);
  console.log("  Password:", ADMIN_PASSWORD);
  console.log("\nChange these in production!");
}

seed().catch((e) => { console.error(e); process.exit(1); });
