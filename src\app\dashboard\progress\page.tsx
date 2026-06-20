"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { getProgressRecords } from "@/lib/store";
import type { ProgressRecord } from "@/types";

export default function ProgressPage() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);

  useEffect(() => {
    getSupabase().auth.getUser().then((res: any) => {
      if (res.data?.user) getProgressRecords(res.data.user.id).then(setRecords);
    });
  }, []);

  const chartData = [...records].reverse();
  const minW = chartData.length > 0 ? Math.min(...chartData.map(r => r.weight)) - 5 : 0;
  const maxW = chartData.length > 0 ? Math.max(...chartData.map(r => r.weight)) + 5 : 100;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white"><span className="text-neon">/</span> Progress Tracking</h2>

      {chartData.length > 1 && (
        <div className="mb-8 rounded-xl border border-zinc-800 bg-dark-card p-6">
          <h3 className="mb-4 font-bold text-white">Weight Trend</h3>
          <div className="flex items-end gap-2" style={{ height: 160 }}>
            {chartData.map((r, i) => {
              const h = ((r.weight - minW) / (maxW - minW)) * 140;
              return (
                <div key={i} className="group relative flex flex-1 flex-col items-center">
                  <div className="absolute -top-6 hidden text-xs text-neon group-hover:block">{r.weight}kg</div>
                  <div className="w-full rounded-t-md bg-neon/60 transition-all hover:bg-neon" style={{ height: `${Math.max(h, 4)}px` }} />
                  <span className="mt-1 text-[8px] text-zinc-600">{new Date(r.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-dark-card p-12 text-center">
          <p className="text-zinc-500">No measurements logged yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map(r => (
            <div key={r.id} className="rounded-xl border border-zinc-800 bg-dark-card p-5">
              <p className="text-sm font-bold text-white">{new Date(r.recordedAt).toLocaleDateString()}</p>
              <div className="mt-3 space-y-1.5 text-sm text-zinc-400">
                {r.weight > 0 && <p>Weight: <span className="font-medium text-white">{r.weight} kg</span></p>}
                {r.bodyFat > 0 && <p>Body Fat: <span className="font-medium text-white">{r.bodyFat}%</span></p>}
                {r.chest > 0 && <p>Chest: <span className="font-medium text-white">{r.chest} cm</span></p>}
                {r.waist > 0 && <p>Waist: <span className="font-medium text-white">{r.waist} cm</span></p>}
                {r.arms > 0 && <p>Arms: <span className="font-medium text-white">{r.arms} cm</span></p>}
              </div>
              {r.notes && <p className="mt-3 border-t border-zinc-800 pt-3 text-xs text-zinc-500">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
