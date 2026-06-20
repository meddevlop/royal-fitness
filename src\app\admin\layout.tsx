"use client";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { getMessages, getAllUserChats } from "@/lib/store";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "◉" },
  { href: "/admin/dashboard?tab=members", label: "Members", icon: "◎" },
  { href: "/admin/dashboard?tab=users", label: "Users", icon: "👤" },
  { href: "/admin/dashboard?tab=inbox", label: "Inbox", icon: "◈" },
  { href: "/admin/dashboard?tab=chat", label: "Chat", icon: "💬" },
  { href: "/admin/dashboard?tab=sessions", label: "Sessions", icon: "📝" },
  { href: "/admin/dashboard?tab=progress", label: "Progress", icon: "📊" },
  { href: "/admin/dashboard?tab=media", label: "Media", icon: "◇" },
  { href: "/admin/dashboard?tab=social", label: "Social", icon: "◎" },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const currentTab = params.get("tab") || "dashboard";
  const [msgCount, setMsgCount] = useState(0);
  const [chatUnread, setChatUnread] = useState(0);

  useEffect(() => {
    getMessages().then((msgs) => setMsgCount(msgs.length));
    getAllUserChats().then((chats) => setChatUnread(chats.filter(c => !c.read).length));
    const interval = setInterval(async () => {
      setMsgCount((await getMessages()).length);
      setChatUnread((await getAllUserChats()).filter(c => !c.read).length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function isActive(item: typeof NAV[0]) {
    const url = new URL(item.href, "http://x");
    const itemTab = url.searchParams.get("tab") || "dashboard";
    return itemTab === currentTab;
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-dark transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-16 items-center border-b border-zinc-800 px-6">
        <h1 className="text-lg font-bold tracking-tight text-white"><span className="text-neon">ROYAL</span> ADMIN</h1>
      </div>
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              isActive(item) ? "bg-neon/10 text-neon shadow-[inset_3px_0_0_#39FF14]" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.label === "Inbox" && msgCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neon px-1.5 text-[10px] font-bold text-black">{msgCount}</span>
            )}
            {item.label === "Chat" && chatUnread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{chatUnread}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="border-t border-zinc-800 px-6 py-4 space-y-2">
        <Link href="/" className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400">← Back to site</Link>
        <button onClick={async () => { await getSupabase().auth.signOut(); window.location.href = "/"; }} className="block text-xs text-zinc-600 hover:text-red-400 w-full text-left">← Sign Out</button>
      </div>
    </aside>
  );
}

function AdminUI({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      const { data: profile } = await getSupabase().from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (!profile || profile.role !== "admin") { router.push("/dashboard"); return; }
      setChecking(false);
    })();
  }, [router]);

  if (checking) return <div className="flex h-screen items-center justify-center bg-dark text-zinc-500">Checking access...</div>;

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1">
        <header className="flex h-16 items-center border-b border-zinc-800 px-6">
          <button onClick={() => setOpen(!open)} className="text-zinc-500 hover:text-white md:hidden">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-dark text-zinc-500">Loading...</div>}>
      <AdminUI>{children}</AdminUI>
    </Suspense>
  );
}
