/**
 * PocketBase setup + seed.
 *
 * Creates the `categories` and `products` collections (if missing) and seeds
 * mock data. The superuser itself is created separately via the PocketBase CLI:
 *   pocketbase.exe superuser create admin@patchmood.com Admin1234!
 *
 * Usage (reads NEXT_PUBLIC_POCKETBASE_URL / PB_SUPERUSER_* from .env.local):
 *   npm run seed
 */

import PocketBase from "pocketbase";

const url = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const email = process.env.PB_SUPERUSER_EMAIL;
const password = process.env.PB_SUPERUSER_PASSWORD;

if (!url || !email || !password) {
  console.error("Missing NEXT_PUBLIC_POCKETBASE_URL / PB_SUPERUSER_EMAIL / PB_SUPERUSER_PASSWORD in .env.local");
  process.exit(1);
}

const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE = 5 * 1024 * 1024;

const pb = new PocketBase(url);

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORIES = [
  "Accessories",
  "Action figures",
  "Clothes",
  "Lamps",
  "Lighters",
  "Posters",
  "Props",
];

const PRODUCTS = [
  { name: "Static Bloom", description: "A four-colour riso print bled to the edge — magenta detonating into cyan with no apology. Pull it from the tube, pin it raw, let the misregistration do the talking. 50x70cm on uncoated stock.", short_description: "Noise you can frame.", category: "Posters", tags: ["riso", "loud", "print"], featured: true },
  { name: "Exit Music", description: "Black ink, single hit, a lot of paper left empty. The poster equivalent of the last song before the lights come up. Quiet, deliberate, hangs heavy.", short_description: "The last song, on paper.", category: "Posters", tags: ["minimal", "monochrome", "quiet"], featured: false },
  { name: "Low Sodium", description: "A sodium-vapour desk lamp that throws the exact amber of an empty motorway at 4am. Cast metal base, dimmable, warms a room into a memory you are not sure you have.", short_description: "Motorway amber for one room.", category: "Lamps", tags: ["amber", "nocturnal", "glow"], featured: false },
  { name: "Dead Man's Click", description: "Brushed-steel flip lighter, weighted to land in the palm like a decision already made. Strikes clean, snaps shut louder than it should. Refillable. Engraved blank, on purpose.", short_description: "Heavier than it looks.", category: "Lighters", tags: ["steel", "weighted", "flip"], featured: false },
  { name: "Second Skin", description: "A 280gsm boxy tee that has already lived three lives before it reaches you — garment-dyed to the grey of wet concrete, seams built to outlast the mood. Wear it until it is yours.", short_description: "Concrete grey, built to outlast you.", category: "Clothes", tags: ["heavyweight", "boxy", "garment-dyed"], featured: false },
  { name: "Patron Saint of Doubt", description: "A 1/6 articulated figure mid-shrug — twenty points of articulation devoted entirely to ambivalence. Comes posed in the act of almost deciding. Stand included; certainty not.", short_description: "Posed mid-shrug, forever.", category: "Action figures", tags: ["articulated", "collectible", "1/6"], featured: false },
  { name: "Evidence, Bagged", description: "A resin prop cast from something that was never explained — sealed, tagged, lit from one side. Looks like the third act of a film you walked out of. Display only. Asks more than it answers.", short_description: "The reason you stayed for the credits.", category: "Props", tags: ["resin", "cinematic", "display"], featured: false },
  { name: "Worry Chain", description: "A short loop of stainless links with a single weighted tag, sized for the pocket and the nervous hand. Runs cold, then warm, then cold again. Holds keys it does not care about.", short_description: "For the nervous hand.", category: "Accessories", tags: ["steel", "pocket", "fidget"], featured: false },
];

async function ensureCollections() {
  const existing = await pb.collections.getFullList();
  const names = new Set(existing.map((c) => c.name));

  if (!names.has("admins")) {
    console.log("Creating `admins` auth collection…");
    await pb.collections.create({
      name: "admins",
      type: "auth",
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: "name", type: "text" },
      ],
    });
  } else {
    console.log("`admins` already exists — skipping.");
  }

  if (!names.has("categories")) {
    console.log("Creating `categories` collection…");
    await pb.collections.create({
      name: "categories",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: "name", type: "text", required: true },
        { name: "slug", type: "text", required: true },
        { name: "image", type: "file", maxSelect: 1, maxSize: MAX_IMAGE, mimeTypes: IMAGE_MIMES },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
      indexes: [
        "CREATE UNIQUE INDEX `idx_categories_name` ON `categories` (`name`)",
        "CREATE UNIQUE INDEX `idx_categories_slug` ON `categories` (`slug`)",
      ],
    });
  } else {
    console.log("`categories` already exists — skipping.");
  }

  if (!names.has("products")) {
    console.log("Creating `products` collection…");
    await pb.collections.create({
      name: "products",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: "name", type: "text", required: true },
        { name: "slug", type: "text", required: true },
        { name: "description", type: "text", required: true },
        { name: "short_description", type: "text" },
        { name: "images", type: "file", maxSelect: 10, maxSize: MAX_IMAGE, mimeTypes: IMAGE_MIMES },
        { name: "category", type: "text", required: true },
        { name: "tags", type: "json", maxSize: 2000000 },
        { name: "featured", type: "bool" },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
      indexes: ["CREATE UNIQUE INDEX `idx_products_slug` ON `products` (`slug`)"],
    });
  } else {
    console.log("`products` already exists — skipping.");
  }
}

async function existingSlugs(collection: string) {
  const records = await pb.collection(collection).getFullList({ fields: "slug" });
  return new Set(records.map((r) => r.slug as string));
}

async function seedData() {
  const catSlugs = await existingSlugs("categories");
  for (const name of CATEGORIES) {
    const slug = toSlug(name);
    if (catSlugs.has(slug)) continue;
    await pb.collection("categories").create({ name, slug });
    console.log(`  + category ${name}`);
  }

  const prodSlugs = await existingSlugs("products");
  for (const p of PRODUCTS) {
    const slug = toSlug(p.name);
    if (prodSlugs.has(slug)) continue;
    await pb.collection("products").create({
      name: p.name,
      slug,
      description: p.description,
      short_description: p.short_description,
      category: p.category,
      tags: p.tags,
      featured: p.featured,
    });
    console.log(`  + product ${p.name}`);
  }
}

async function seed() {
  console.log("Authenticating as superuser…");
  await pb.collection("_superusers").authWithPassword(email!, password!);

  await ensureCollections();
  console.log("Seeding data…");
  await seedData();

  console.log("\nDone. Admin login:");
  console.log("  Email:   ", email);
  console.log("  Password:", password);
  console.log("\nChange these in production!");
}

seed().catch((e) => {
  console.error(e?.response ?? e);
  process.exit(1);
});
