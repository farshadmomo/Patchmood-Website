import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024;
const BUCKET = "media";
const FOLDERS = ["products", "categories"] as const;
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const typeField = (formData.get("type") as string) ?? "products";
    const folder = (FOLDERS as readonly string[]).includes(typeField) ? typeField : "products";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Only JPEG, PNG, WebP, or AVIF images are allowed" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "File must be under 5 MB" }, { status: 400 });
    }

    const ext = EXT[file.type] ?? "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ success: true, data: { url: publicUrl } });
  } catch {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
