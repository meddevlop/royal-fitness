"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", text: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error: err } = await getSupabase().from("messages").insert({
      id: crypto.randomUUID(), name: form.name, email: form.email, text: form.text, created_at: new Date().toISOString(),
    });
    if (err) { setError(err.message); return; }
    setSent(true);
    setForm({ name: "", email: "", text: "" });
  }

  return (
    <section id="contact" className="w-full bg-dark px-4 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-neon uppercase">Contact</p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">
            GET IN <span className="text-neon">TOUCH</span>
          </h2>
          <p className="mt-3 text-zinc-500">Have a question? Send us a message</p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-zinc-800 bg-dark-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon/20 text-3xl text-neon">✓</div>
            <p className="text-xl font-bold text-neon">Message Sent!</p>
            <p className="mt-2 text-sm text-zinc-500">Coach Boujarra will get back to you soon.</p>
            <button onClick={() => setSent(false)} className="mt-4 text-sm text-zinc-500 hover:text-neon">Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-zinc-800 bg-dark-card p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-white outline-none focus:border-neon" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-white outline-none focus:border-neon" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Message</label>
              <textarea required rows={5} value={form.text} onChange={e => setForm({...form, text: e.target.value})}
                className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-white outline-none focus:border-neon" />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit"
              className="w-full rounded-full bg-neon py-3.5 text-sm font-bold tracking-widest text-black uppercase hover:brightness-110 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
