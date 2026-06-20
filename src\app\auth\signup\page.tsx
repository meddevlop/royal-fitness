"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { upsertProfile } from "@/lib/store";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { data, error: err } = await getSupabase().auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (err) { setError(err.message); return; }
    if (data.user) {
      await upsertProfile({ id: data.user.id, email, fullName, role: "user" });
      const { error: signInErr } = await getSupabase().auth.signInWithPassword({ email, password });
      if (signInErr) { router.push("/auth/login"); return; }
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-dark-card p-8">
        <h1 className="text-2xl font-black text-white">Create Account</h1>
        <p className="mb-6 mt-1 text-sm text-zinc-500">Join Royal Fitness today</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Full Name</label>
            <input required value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Password</label>
            <input required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-neon py-3 text-sm font-bold tracking-widest text-black uppercase hover:brightness-110">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-zinc-600">
          Already registered? <Link href="/auth/login" className="text-neon hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
