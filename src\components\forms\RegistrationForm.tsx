"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addMember } from "@/lib/store";
import type { Member } from "@/types";
import { PLANS } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4;
type Goal = "fat-loss" | "build-muscle" | "general-fitness";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  age: string;
  weight: string;
  height: string;
  goal: Goal;
}

const GOAL_LABELS: Record<Goal, string> = {
  "fat-loss": "Fat Loss / تخسيس",
  "build-muscle": "Build Muscle / بناء عضلات",
  "general-fitness": "General Fitness / لياقة بدنية",
};

export default function RegistrationForm({ plan }: { plan: 1 | 6 | 12 }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormData>({
    firstName: "", lastName: "", phone: "", age: "", weight: "", height: "", goal: "general-fitness",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [error, setError] = useState("");

  function validateStep(s: Step): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!data.firstName.trim()) e.firstName = "Required";
      if (!data.lastName.trim()) e.lastName = "Required";
      if (!data.phone.trim()) e.phone = "Required";
    }
    if (s === 2) {
      if (!data.age || +data.age < 10 || +data.age > 120) e.age = "Enter a valid age (10-120)";
    }
    if (s === 3) {
      if (!data.weight || +data.weight < 20 || +data.weight > 400) e.weight = "Enter valid weight (20-400 kg)";
      if (!data.height || +data.height < 80 || +data.height > 280) e.height = "Enter valid height (80-280 cm)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((step + 1) as Step);
  }

  function prev() {
    setStep((step - 1) as Step);
  }

  async function submit() {
    if (!validateStep(step)) return;
    setError("");
    const { error: err } = await addMember({
      id: crypto.randomUUID(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone.trim(),
      age: +data.age,
      weight: +data.weight,
      height: +data.height,
      goal: data.goal,
      plan,
      createdAt: new Date().toISOString(),
    });
    if (err) { setError(err); return; }
    router.push("/");
  }

  const planLabel = PLANS.find((p) => p.id === plan);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-dark px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-neon uppercase">Step {step} of 4</p>
          <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
            {step === 1 && "Personal Info"}
            {step === 2 && "Age"}
            {step === 3 && "Fitness Metrics"}
            {step === 4 && "Your Goal"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">{planLabel?.label} — {planLabel?.price} {planLabel?.currency}</p>
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${s <= step ? "bg-neon shadow-[0_0_8px_rgba(57,255,20,0.5)]" : "bg-zinc-800"}`} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-dark-card p-8">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">First Name / الاسم</label>
                <input value={data.firstName} onChange={(e) => setData({ ...data, firstName: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3.5 text-white outline-none focus:border-neon" />
                {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Last Name / اللقب</label>
                <input value={data.lastName} onChange={(e) => setData({ ...data, lastName: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3.5 text-white outline-none focus:border-neon" />
                {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Phone / الهاتف</label>
                <input type="tel" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+216 XX XXX XXX"
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3.5 text-white outline-none focus:border-neon" />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Age / العمر</label>
                <input type="number" min={10} max={120} value={data.age} onChange={(e) => setData({ ...data, age: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3.5 text-white outline-none focus:border-neon" />
                {errors.age && <p className="mt-1 text-xs text-red-400">{errors.age}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Weight (KG) / الوزن</label>
                <input type="number" min={20} max={400} value={data.weight} onChange={(e) => setData({ ...data, weight: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3.5 text-white outline-none focus:border-neon" />
                {errors.weight && <p className="mt-1 text-xs text-red-400">{errors.weight}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Height (CM) / الطول</label>
                <input type="number" min={80} max={280} value={data.height} onChange={(e) => setData({ ...data, height: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3.5 text-white outline-none focus:border-neon" />
                {errors.height && <p className="mt-1 text-xs text-red-400">{errors.height}</p>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Fitness Goal / الهدف</label>
              <select value={data.goal} onChange={(e) => setData({ ...data, goal: e.target.value as Goal })}
                className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3.5 text-white outline-none focus:border-neon">
                {Object.entries(GOAL_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button onClick={prev}
                className="rounded-full border border-zinc-700 px-8 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-500">← Back</button>
            ) : <div />}
            {step < 4 ? (
              <button onClick={next}
                className="rounded-full bg-neon px-10 py-3 text-sm font-bold text-black hover:brightness-110 hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]">Next →</button>
            ) : (
              <button onClick={submit}
                className="rounded-full bg-neon px-10 py-3 text-sm font-bold text-black hover:brightness-110 hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]">Confirm & Register</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
