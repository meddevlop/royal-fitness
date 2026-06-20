"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { getSiteConfig } from "@/lib/store";
import type { SiteConfig } from "@/types";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    getSupabase().auth.getUser().then(async (res: any) => {
      if (res.data?.user) {
        setUser(res.data.user);
        const { data: p } = await getSupabase().from("profiles").select("role").eq("id", res.data.user.id).maybeSingle();
        setIsAdmin(p?.role === "admin");
      }
    });
    getSiteConfig().then(setConfig);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-dark/90 backdrop-blur-lg shadow-[0_1px_0_rgba(57,255,20,0.1)]" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="text-xl font-black tracking-tight">
          <span className="text-white">ROYAL</span> <span className="text-neon">FITNESS</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {config?.social.instagram && (
            <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-neon transition-colors">Instagram</a>
          )}
          {config?.social.whatsapp && (
            <a href={config.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-neon transition-colors">WhatsApp</a>
          )}
          {config?.social.gmail && (
            <a href={`mailto:${config.social.gmail}`} className="text-sm text-zinc-500 hover:text-neon transition-colors">Email</a>
          )}
          <a href="#process" className="text-sm text-zinc-400 transition-colors hover:text-white">How It Works</a>
          <a href="#pricing" className="text-sm text-zinc-400 transition-colors hover:text-white">Pricing</a>
          <a href="#contact" className="text-sm text-zinc-400 transition-colors hover:text-white">Contact</a>
          {user ? (
            <>
              {isAdmin && <a href="/admin/dashboard" className="text-sm text-neon hover:brightness-110 font-medium">Admin</a>}
              <a href="/dashboard" className="rounded-full bg-neon px-6 py-2 text-xs font-bold tracking-widest text-black uppercase transition-all hover:brightness-110 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">Dashboard</a>
            </>
          ) : (
            <a href="/auth/login" className="rounded-full bg-neon px-6 py-2 text-xs font-bold tracking-widest text-black uppercase transition-all hover:brightness-110 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">Join Now</a>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="text-zinc-400 hover:text-white md:hidden">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-zinc-800 bg-dark/95 backdrop-blur-lg md:hidden">
          <div className="space-y-1 px-6 py-4">
            {config?.social.instagram && <a href={config.social.instagram} target="_blank" className="block py-2 text-sm text-zinc-400 hover:text-neon">Instagram</a>}
            {config?.social.whatsapp && <a href={config.social.whatsapp} target="_blank" className="block py-2 text-sm text-zinc-400 hover:text-neon">WhatsApp</a>}
            {config?.social.gmail && <a href={`mailto:${config.social.gmail}`} className="block py-2 text-sm text-zinc-400 hover:text-neon">Email</a>}
            <a href="#process" className="block py-2 text-sm text-zinc-400 hover:text-white">How It Works</a>
            <a href="#pricing" className="block py-2 text-sm text-zinc-400 hover:text-white">Pricing</a>
            <a href="#contact" className="block py-2 text-sm text-zinc-400 hover:text-white">Contact</a>
            {user ? (
              <>
                {isAdmin && <a href="/admin/dashboard" className="block py-2 text-sm text-neon font-medium">Admin</a>}
                <a href="/dashboard" className="mt-2 block rounded-full bg-neon px-6 py-2.5 text-center text-xs font-bold tracking-widest text-black uppercase">Dashboard</a>
              </>
            ) : (
              <a href="/auth/login" className="mt-2 block rounded-full bg-neon px-6 py-2.5 text-center text-xs font-bold tracking-widest text-black uppercase">Join Now</a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
