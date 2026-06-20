import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

let _supabase: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (_supabase) return _supabase;
  _supabase = createBrowserClient(supabaseUrl, supabaseKey);
  return _supabase;
}
