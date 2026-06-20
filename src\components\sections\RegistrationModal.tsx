"use client";
import { useState } from "react";
import { addMember } from "@/lib/store";

const GOALS = [
  { value: "fat-loss", label: "Fat Loss" },
  { value: "build-muscle", label: "Build Muscle" },
  { value: "general-fitness", label: "General Fitness" },
];

interface Props {
  plan: number;
  onClose: () => void;
}

export default function RegistrationModal({ plan, onClose }: Props) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", age: "", weight: "", height: "",
    goal: "general-fitness", phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error: err } = await addMember({
      id: crypto.randomUUID(),
      firstName: form.firstName,
      lastName: form.lastName,
      age: parseInt(form.age),
      weight: parseInt(form.weight),
      height: parseInt(form.height),
      goal: form.goal as "fat-loss" | "build-muscle" | "general-fitness",
      plan: plan as 1 | 6 | 12,
      phone: form.phone,
      createdAt: new Date().toISOString(),
    });
    if (err) { setError(err); return; }
    setSubmitted(true);
    setTimeout(onClose, 2000);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-dark-card p-8 shadow-2xl">
        <button onClick={onClose}
          className="absolute right-4 top-4 text-xl text-zinc-600 transition-colors hover:text-white">✕</button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon/20 text-3xl text-neon">✓</div>
            <p className="text-xl font-bold text-neon">Registration Complete!</p>
            <p className="mt-2 text-sm text-zinc-500">Coach Boujarra will contact you soon.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white">Join Royal Fitness</h2>
            <p className="mt-1 text-sm text-zinc-500">{plan} month{plan > 1 ? "s" : ""} plan</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">First Name</label>
                  <input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Last Name</label>
                  <input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Phone</label>
                <input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+216 XX XXX XXX"
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Age</label>
                  <input required type="number" min={12} max={120} value={form.age} onChange={(e) => update("age", e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Weight (kg)</label>
                  <input required type="number" min={20} max={300} value={form.weight} onChange={(e) => update("weight", e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Height (cm)</label>
                  <input required type="number" min={100} max={250} value={form.height} onChange={(e) => update("height", e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-400">Goal</label>
                <div className="flex gap-3">
                  {GOALS.map((g) => (
                    <button key={g.value} type="button" onClick={() => update("goal", g.value)}
                      className={`flex-1 rounded-xl border px-3 py-3 text-xs font-medium transition-all ${form.goal === g.value ? "border-neon bg-neon/10 text-neon" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit"
                className="mt-4 w-full rounded-full bg-neon py-3.5 text-sm font-bold tracking-widest text-black uppercase hover:brightness-110 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">
                Complete Registration
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
