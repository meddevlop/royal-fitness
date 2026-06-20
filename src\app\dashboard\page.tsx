"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { getSchedules } from "@/lib/store";
import type { WorkoutSchedule } from "@/types";
import { DAY_NAMES } from "@/lib/constants";

export default function DashboardHome() {
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    getSupabase().auth.getUser().then((res: any) => {
      if (res.data?.user) {
        setUserId(res.data.user.id);
        getSchedules(res.data.user.id).then(setSchedules);
      }
    });
  }, []);

  const grouped: Record<number, WorkoutSchedule[]> = {};
  DAY_NAMES.forEach((_, i) => grouped[i] = []);
  schedules.forEach(s => { if (grouped[s.dayOfWeek]) grouped[s.dayOfWeek].push(s); });

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white"><span className="text-neon">/</span> My Schedule</h2>
      {schedules.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-dark-card p-12 text-center">
          <p className="text-zinc-500">No schedule assigned yet. Contact Coach Boujarra.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DAY_NAMES.map((day, i) => (
            <div key={i} className={`rounded-xl border p-5 ${grouped[i].length > 0 ? 'border-neon/30 bg-dark-card' : 'border-zinc-800 bg-dark-card/50'}`}>
              <h3 className="mb-3 font-bold text-white">{day}</h3>
              {grouped[i].length === 0 ? (
                <p className="text-xs text-zinc-600">Rest day</p>
              ) : (
                grouped[i].map(s => (
                  <div key={s.id} className="mb-2 last:mb-0 rounded-lg border border-zinc-800 bg-black/30 p-3">
                    <p className="text-sm font-medium text-white">{s.title}</p>
                    <p className="text-xs text-neon">{s.startTime.slice(0, 5)} - {s.endTime.slice(0, 5)}</p>
                    {s.description && <p className="mt-1 text-xs text-zinc-500">{s.description}</p>}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
