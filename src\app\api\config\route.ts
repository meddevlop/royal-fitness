import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DEFAULT = {
  media: { coachProfile: "", trainingPromo: "", gymImages: [] },
  social: { instagram: "", whatsapp: "", facebook: "", gmail: "" },
  backgroundImage: "", backgroundVideo: "", heroBackground: "default",
};

function mapRow(row: any) {
  return {
    media: {
      coachProfile: row.coach_profile || "",
      trainingPromo: row.training_promo || "",
      gymImages: row.gym_images || [],
    },
    social: {
      instagram: row.instagram || "",
      whatsapp: row.whatsapp || "",
      facebook: row.facebook || "",
      gmail: row.gmail || "",
    },
    backgroundImage: row.background_image || "",
    backgroundVideo: row.background_video || "",
    heroBackground: row.hero_background || "default",
  };
}

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.supabase_service_role_key || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } }
    );
    const { data: rows } = await supabase.from("site_config").select("*").limit(1);
    const row = rows?.[0] || null;
    if (!row) return NextResponse.json({ config: DEFAULT });
    return NextResponse.json({ config: mapRow(row) });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.supabase_service_role_key || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } }
    );
    const { data: rows } = await supabase.from("site_config").select("id").limit(2);
    const existing = rows?.[0] || null;
    let error;
    if (existing) {
      error = (await supabase.from("site_config").update(body).eq("id", existing.id)).error;
      if (!error && rows && rows.length > 1) {
        const ids = rows.slice(1).map(r => r.id);
        await supabase.from("site_config").delete().in("id", ids);
      }
    } else {
      error = (await supabase.from("site_config").insert(body)).error;
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error" }, { status: 500 });
  }
}
