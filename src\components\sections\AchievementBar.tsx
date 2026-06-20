"use client";

import { useEffect, useState, useRef } from "react";

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (!ref.current || counted.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setVal(end);
              clearInterval(timer);
            } else {
              setVal(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export default function AchievementBar() {
  return (
    <section id="achievement" className="w-full bg-[#39FF14] py-0">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-10 md:flex-row md:justify-between md:py-0">
        <div className="py-6 text-center md:py-10 md:text-left">
          <p className="text-xs font-bold tracking-[0.25em] text-black/60 uppercase">
            Elite Achievement
          </p>
          <h2 className="mt-1 text-2xl font-black text-black md:text-3xl lg:text-4xl">
            COACH MOHAMED BOUJARRA — RANKED 14TH IN AFRICA
          </h2>
        </div>

        <div className="flex shrink-0 divide-x divide-black/20">
          <div className="flex flex-col items-center px-8 py-6">
            <span className="text-3xl font-black text-black md:text-4xl">
              <Counter end={14} suffix="th" />
            </span>
            <span className="mt-1 text-xs font-semibold tracking-wider text-black/70 uppercase">
              Africa Rank
            </span>
          </div>
          <div className="flex flex-col items-center px-8 py-6">
            <span className="text-3xl font-black text-black md:text-4xl">
              <Counter end={850} suffix="+" />
            </span>
            <span className="mt-1 text-xs font-semibold tracking-wider text-black/70 uppercase">
              Members
            </span>
          </div>
          <div className="flex flex-col items-center px-8 py-6">
            <span className="text-3xl font-black text-black md:text-4xl">
              <Counter end={12000} suffix="+" />
            </span>
            <span className="mt-1 text-xs font-semibold tracking-wider text-black/70 uppercase">
              Training Hours
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
