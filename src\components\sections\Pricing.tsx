"use client";

import { useState } from "react";
import { PLANS } from "@/lib/constants";
import RegistrationModal from "./RegistrationModal";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  return (
    <>
      <section id="pricing" className="w-full bg-dark px-4 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold tracking-[0.3em] text-neon uppercase">
              Membership
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">
              PRICING <span className="text-neon">PLANS</span>
            </h2>
            <p className="mt-3 text-zinc-500">
              Prix en Tunisie — Choose your plan, start today
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`group relative rounded-2xl border p-8 transition-all duration-500 ${
                  plan.popular
                    ? "border-neon/60 bg-dark-card/60 shadow-[0_0_30px_rgba(57,255,20,0.15)] backdrop-blur-xl scale-105 md:scale-110 hover:border-neon hover:shadow-[0_0_50px_rgba(57,255,20,0.25)]"
                    : "border-zinc-800/60 bg-dark-card/40 backdrop-blur-md hover:border-neon/40 hover:shadow-[0_0_40px_rgba(57,255,20,0.12)]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neon px-4 py-1 text-xs font-bold tracking-widest text-black uppercase">
                    Most Popular
                  </span>
                )}

                <h3 className="text-xl font-bold text-white">{plan.label}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-lg font-semibold text-neon">{plan.currency}</span>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                  <li className="flex items-center gap-2">
                    <span className="text-neon">✓</span> Full gym access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neon">✓</span> Equipment included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neon">✓</span> Locker & shower
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-neon">✓</span> Coach guidance
                  </li>
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`mt-8 flex w-full items-center justify-center rounded-full py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                    plan.popular
                      ? "bg-neon text-black hover:brightness-110 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]"
                      : "border border-neon text-neon hover:bg-neon hover:text-black"
                  }`}
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedPlan && (
        <RegistrationModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </>
  );
}
