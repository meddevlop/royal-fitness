const STEPS = [
  {
    num: "01",
    title: "Metric Assessment",
    desc: "We measure your baseline — strength, endurance, mobility — to build your starting profile.",
  },
  {
    num: "02",
    title: "Custom Programming",
    desc: "A tailored training plan designed around your goals, schedule, and current fitness level.",
  },
  {
    num: "03",
    title: "High-Intensity Coaching",
    desc: "Train one-on-one with Coach Boujarra using proven CrossFit methodologies.",
  },
  {
    num: "04",
    title: "Weekly Evolution",
    desc: "Track progress every week. Adjust the plan. Watch yourself transform.",
  },
];

export default function WorkingProcess() {
  return (
    <section id="process" className="w-full bg-dark px-4 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-neon uppercase">
            How It Works
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">
            YOUR <span className="text-neon">TRANSFORMATION</span> STARTS HERE
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-500">
            Four proven steps to take you from where you are to where you want to be.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.num} className="group relative">
              <div className="relative z-10 rounded-2xl border border-zinc-800 bg-dark-card p-6 transition-all duration-500 group-hover:border-neon/40 group-hover:shadow-[0_0_30px_rgba(57,255,20,0.1)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neon/10 text-lg font-black text-neon">
                  {s.num}
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.desc}</p>
              </div>

              {i < STEPS.length - 1 && (
                <div className="absolute -right-4 top-1/3 hidden text-zinc-700 md:block">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
