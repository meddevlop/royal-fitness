"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Schedule", icon: "📅" },
  { href: "/dashboard/sessions", label: "Sessions", icon: "📝" },
  { href: "/dashboard/progress", label: "Progress", icon: "📈" },
  { href: "/dashboard/chat", label: "Chat", icon: "💬" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getSupabase().auth.getUser().then(async (res: any) => {
      if (!res.data?.user) { router.push("/auth/login"); return; }
      setUser(res.data.user);
      const { data: p } = await getSupabase().from("profiles").select("*").eq("id", res.data.user.id).maybeSingle();
      setProfile(p);
      setLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  if (loading) return <div className="flex h-screen items-center justify-center bg-dark text-zinc-500">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-dark">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-dark">
        <div className="flex h-16 items-center border-b border-zinc-800 px-6">
          <h1 className="text-lg font-bold tracking-tight text-white">
            <span className="text-neon">MY</span> DASHBOARD
          </h1>
        </div>
        <nav className="mt-6 flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                pathname === item.href
                  ? "bg-neon/10 text-neon shadow-[inset_3px_0_0_#39FF14]"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-800 px-6 py-4 space-y-2">
          <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          {profile?.phone && <p className="text-xs text-zinc-600 truncate">📞 {profile.phone}</p>}
          {profile?.role === "admin" && <Link href="/admin/dashboard" className="block text-xs text-neon hover:brightness-110">Admin Panel</Link>}
          <Link href="/" className="block text-xs text-zinc-500 hover:text-zinc-300">← Back to site</Link>
          <button onClick={handleLogout} className="block text-xs text-zinc-600 hover:text-red-400">Sign Out</button>
        </div>
      </aside>
      <div className="ml-64 flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
