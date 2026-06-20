"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { getSessionNotes } from "@/lib/store";
import type { SessionNote } from "@/types";

export default function SessionsPage() {
  const [notes, setNotes] = useState<SessionNote[]>([]);

  useEffect(() => {
    getSupabase().auth.getUser().then((res: any) => {
      if (res.data?.user) getSessionNotes(res.data.user.id).then(setNotes);
    });
  }, []);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white"><span className="text-neon">/</span> Session Notes</h2>

      {notes.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-dark-card p-12 text-center">
          <p className="text-zinc-500">No sessions logged yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(n => (
            <div key={n.id} className="rounded-xl border border-zinc-800 bg-dark-card p-5 transition-all hover:border-neon/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{new Date(n.sessionDate).toLocaleDateString()}</p>
                  <div className="mt-1 flex gap-1">
                    {[1,2,3,4,5].map(i => <span key={i} className={`text-xs ${i <= n.rating ? 'text-neon' : 'text-zinc-700'}`}>★</span>)}
                  </div>
                </div>
              </div>
              {n.userNote && <p className="mt-3 text-sm text-zinc-400">{n.userNote}</p>}
              {n.adminNote && (
                <div className="mt-3 border-t border-zinc-800 pt-3">
                  <p className="text-xs font-medium text-neon">Coach's Note:</p>
                  <p className="mt-1 text-sm text-zinc-300">{n.adminNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
