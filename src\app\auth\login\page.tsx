"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { data, error: err } = await getSupabase().auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); return; }
    const { data: profile } = await getSupabase().from("profiles").select("role").eq("id", data.user.id).maybeSingle();
    if (!profile) {
      await getSupabase().from("profiles").insert({ id: data.user.id, email: data.user.email, role: "member" });
      router.push("/dashboard"); return;
    }
    if (profile?.role === "admin") router.push("/admin/dashboard");
    else router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-dark-card p-8">
        <h1 className="text-2xl font-black text-white">Sign In</h1>
        <p className="mb-6 mt-1 text-sm text-zinc-500">Welcome back to Royal Fitness</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-neon py-3 text-sm font-bold tracking-widest text-black uppercase hover:brightness-110">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-zinc-600">
          No account? <Link href="/auth/signup" className="text-neon hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
