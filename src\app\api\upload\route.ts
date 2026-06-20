import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const target = formData.get("target") as string | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowed = ["jpg", "jpeg", "png", "webp", "mp4", "webm", "mov"];
    if (!allowed.includes(ext)) return NextResponse.json({ error: `Invalid type: .${ext}` }, { status: 400 });
    if (!target) return NextResponse.json({ error: "No target" }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.supabase_service_role_key || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl) return NextResponse.json({ error: "Missing SUPABASE_URL" }, { status: 500 });
    if (!supabaseKey) return NextResponse.json({ error: "Missing SUPABASE_KEY" }, { status: 500 });

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const ts = Date.now();
    const prefix = target === "background" ? "bg" : target === "gallery" ? "gallery" : target === "image" ? "coach" : target === "bgvideo" ? "bgvid" : "promo";
    const fileName = `${prefix}-${ts}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("uploads").upload(fileName, file, {
      contentType: file.type,
      upsert: true,
    });

    if (uploadError) {
      if (uploadError.message?.includes("bucket") || uploadError.message?.includes("not found")) {
        return NextResponse.json({
          error: "Storage bucket 'uploads' not found. Create it in Supabase Dashboard > Storage > New Bucket (name: uploads, public: ON)",
        }, { status: 500 });
      }
      return NextResponse.json({ error: `Upload error: ${uploadError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(fileName);

    return NextResponse.json({ success: true, path: publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: `Server error: ${err?.message || "Unknown"}` }, { status: 500 });
  }
}
