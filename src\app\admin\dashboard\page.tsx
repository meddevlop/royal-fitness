"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { Member, Message, SiteConfig, Profile, WorkoutSchedule, ChatMessage, SessionNote, ProgressRecord } from "@/types";
import { getMembers, deleteMember, getMessages, deleteMessage, getSiteConfig, saveSiteConfig, getAllProfiles, getAllSchedules, getAllUserChats, sendChatMessage, getSessionNotes, updateSessionNote, getAllSessionNotes, deleteProfile, deleteChatMessage, deleteSessionNote, deleteProgressRecord, deleteSchedule, getAllProgressRecords, addProgressRecord } from "@/lib/store";
import { PLANS, DAY_NAMES } from "@/lib/constants";

const GOAL_LABELS: Record<string, string> = { "fat-loss": "Fat Loss", "build-muscle": "Build Muscle", "general-fitness": "General Fitness" };
const GYM_IMAGES = ["/salle/SaveClip.App_670390595_18092900344922183_2691608132952337260_n.jpg","/salle/SaveClip.App_670445654_18093100567922183_714470861544971100_n.jpg","/salle/SaveClip.App_671830585_18092898328922183_606213573956092884_n.jpg"];

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-12 text-zinc-500">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-neon transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-zinc-400">{value}</span>
    </div>
  );
}

function MemberCard({ m, onDelete }: { m: Member; onDelete: (id: string) => void }) {
  const bmi = m.weight / Math.pow(m.height / 100, 2);
  return (
    <div className="rounded-xl border border-zinc-800 bg-dark-card p-5 transition-all hover:border-neon/30">
      <div className="flex items-start justify-between">
        <div><h4 className="font-bold text-white">{m.firstName} {m.lastName}</h4><p className="text-xs text-zinc-500">{m.age} years{m.phone && ` · ${m.phone}`}</p></div>
        <span className="rounded-full border border-neon/30 px-2.5 py-0.5 text-xs font-medium text-neon">{m.plan}mo</span>
      </div>
      <div className="mt-4 space-y-1.5">
        <MiniBar label="Weight" value={m.weight} max={200} />
        <MiniBar label="Height" value={m.height} max={250} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs font-medium ${bmi<18.5?"text-yellow-400":bmi<25?"text-green-400":bmi<30?"text-orange-400":"text-red-400"}`}>
          BMI: {bmi.toFixed(1)} ({bmi<18.5?"Underweight":bmi<25?"Healthy":bmi<30?"Overweight":"Obese"})
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">{GOAL_LABELS[m.goal]||m.goal}</span>
        <button onClick={() => onDelete(m.id)} className="text-[10px] text-zinc-600 hover:text-red-400">✕</button>
      </div>
      {m.message && <p className="mt-3 border-t border-zinc-800 pt-3 text-xs italic text-zinc-500">&ldquo;{m.message}&rdquo;</p>}
    </div>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState({ total: 0, messages: 0, users: 0, counts: { 1: 0, 6: 0, 12: 0 } });
  const [recent, setRecent] = useState<Member[]>([]);

  useEffect(() => {
    (async () => {
      const [members, msgs, profiles] = await Promise.all([getMembers(), getMessages(), getAllProfiles()]);
      const counts = { 1: 0, 6: 0, 12: 0 };
      members.forEach((m: Member) => counts[m.plan]++);
      setStats({ total: members.length, messages: msgs.length, users: profiles.length, counts });
      setRecent(members.slice(-3).reverse());
    })();
  }, []);

  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-dark-card p-5">
          <p className="text-sm text-zinc-500">Total Members</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-dark-card p-5">
          <p className="text-sm text-zinc-500">Registered Users</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.users}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-dark-card p-5">
          <p className="text-sm text-zinc-500">Messages</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.messages}</p>
        </div>
        {PLANS.map((p) => (
          <div key={p.id} className="rounded-xl border border-zinc-800 bg-dark-card p-5">
            <p className="text-sm text-zinc-500">{p.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.counts[p.id]}</p>
            <p className="text-xs text-zinc-600">{p.price} {p.currency}</p>
          </div>
        ))}
      </div>
      {recent.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-dark-card p-6">
          <h3 className="mb-4 font-bold text-white">Recent Registrations</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((m) => <MemberCard key={m.id} m={m} onDelete={() => deleteMember(m.id)} />)}
          </div>
        </div>
      )}
    </>
  );
}

function MembersTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const load = useCallback(async () => setMembers(await getMembers()), []);
  useEffect(() => { load(); }, [load]);
  async function handleDelete(id: string) { await deleteMember(id); await load(); }
  const filtered = members.filter((m) => `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..."
        className="mb-6 w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-dark-card p-12 text-center">
          <p className="text-zinc-500">{members.length === 0 ? "No registrations yet" : "No matches found"}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((m) => <MemberCard key={m.id} m={m} onDelete={handleDelete} />)}</div>
      )}
    </div>
  );
}

function InboxTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const load = useCallback(async () => setMessages(await getMessages()), []);
  useEffect(() => { load(); }, [load]);
  async function handleDelete(id: string) { await deleteMessage(id); await load(); }
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="font-bold text-white">Message Center</h3>
        {messages.length > 0 && <span className="rounded-full bg-neon px-2.5 py-0.5 text-xs font-bold text-black">{messages.length} new</span>}
      </div>
      {messages.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-dark-card p-12 text-center"><p className="text-zinc-500">No messages yet</p></div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="rounded-xl border border-zinc-800 bg-dark-card p-5 transition-all hover:border-neon/20">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neon/10 text-sm font-bold text-neon">{msg.name.charAt(0).toUpperCase()}</div>
                  <div><h4 className="font-bold text-white">{msg.name}</h4><p className="text-xs text-zinc-500">{msg.email} · {new Date(msg.createdAt).toLocaleDateString()}</p></div>
                </div>
                <button onClick={() => handleDelete(msg.id)} className="text-xs text-zinc-600 hover:text-red-400">✕</button>
              </div>
              <p className="mt-3 pl-12 text-sm text-zinc-400">{msg.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Users Tab (NEW) ───
function UsersTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminId, setAdminId] = useState("");
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ dayOfWeek: 1, startTime: "09:00", endTime: "10:00", title: "", description: "" });

  useEffect(() => {
    getSupabase().auth.getUser().then((res: any) => { if (res.data?.user) setAdminId(res.data.user.id); });
    getAllProfiles().then(setProfiles);
    getAllSchedules().then(setSchedules);
  }, []);

  async function addUserSchedule() {
    if (!selectedUser) return;
    const newSchedule: WorkoutSchedule = {
      id: crypto.randomUUID(), userId: selectedUser, ...scheduleForm,
    };
    const { addSchedule } = await import("@/lib/store");
    await addSchedule(newSchedule);
    setSchedules(prev => [...prev, newSchedule]);
    setScheduleForm({ dayOfWeek: 1, startTime: "09:00", endTime: "10:00", title: "", description: "" });
  }

  const userSchedules = (uid: string) => schedules.filter(s => s.userId === uid);

  async function handleDeleteUser(id: string) {
    if (!confirm("Delete this user and all their data?")) return;
    await deleteProfile(id);
    setProfiles(prev => prev.filter(p => p.id !== id));
    setSchedules(prev => prev.filter(s => s.userId !== id));
  }

  async function handleDeleteSchedule(id: string) {
    await deleteSchedule(id);
    setSchedules(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div>
      <h3 className="mb-6 font-bold text-white">Registered Users</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {profiles.filter(p => p.role === "user").map(p => (
            <div key={p.id} onClick={() => setSelectedUser(p.id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${selectedUser === p.id ? 'border-neon bg-dark-card' : 'border-zinc-800 bg-dark-card/50 hover:border-zinc-600'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon/10 text-sm font-bold text-neon">
                    {p.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">{p.fullName}</p>
                    <p className="text-xs text-zinc-500">{p.email}</p>
                    {p.phone && <p className="text-xs text-zinc-500">📞 {p.phone}</p>}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(p.id); }}
                  className="text-xs text-zinc-600 hover:text-red-400">✕</button>
              </div>
              {selectedUser === p.id && userSchedules(p.id).length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-zinc-800 pt-3">
                  {userSchedules(p.id).map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <p className="text-xs text-zinc-400">{DAY_NAMES[s.dayOfWeek]}: {s.title} ({s.startTime.slice(0,5)}-{s.endTime.slice(0,5)})</p>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteSchedule(s.id); }}
                        className="text-[10px] text-zinc-600 hover:text-red-400">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="rounded-xl border border-zinc-800 bg-dark-card p-6">
            <h4 className="mb-4 font-bold text-white">Assign Schedule</h4>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Day</label>
                <select value={scheduleForm.dayOfWeek} onChange={e => setScheduleForm({...scheduleForm, dayOfWeek: parseInt(e.target.value)})}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon">
                  {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Start</label>
                  <input type="time" value={scheduleForm.startTime} onChange={e => setScheduleForm({...scheduleForm, startTime: e.target.value})}
                    className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">End</label>
                  <input type="time" value={scheduleForm.endTime} onChange={e => setScheduleForm({...scheduleForm, endTime: e.target.value})}
                    className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Title</label>
                <input value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Description</label>
                <input value={scheduleForm.description} onChange={e => setScheduleForm({...scheduleForm, description: e.target.value})}
                  className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
              </div>
              <button onClick={addUserSchedule}
                className="w-full rounded-full bg-neon py-3 text-sm font-bold text-black hover:brightness-110">
                Add to Schedule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Chat Tab (NEW) ───
function ChatTab() {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminId, setAdminId] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    getSupabase().auth.getUser().then((res: any) => { if (res.data?.user) setAdminId(res.data.user.id); });
    getAllUserChats().then(setChats);
    getAllProfiles().then(setProfiles);
    const interval = setInterval(async () => setChats(await getAllUserChats()), 3000);
    return () => clearInterval(interval);
  }, []);

  const userChats = (uid: string) => chats.filter(c => c.senderId === uid || c.receiverId === uid);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || !selectedUser) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(), senderId: adminId, receiverId: selectedUser,
      text: replyText.trim(), read: false, createdAt: new Date().toISOString(),
    };
    await sendChatMessage(msg);
    setChats(prev => [...prev, msg]);
    setReplyText("");
  }

  async function handleDeleteChat(msgId: string) {
    await deleteChatMessage(msgId);
    setChats(prev => prev.filter(m => m.id !== msgId));
  }

  const profileName = (id: string) => {
    const p = profiles.find(pr => pr.id === id);
    return p ? p.fullName : id.slice(0, 8);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-4 font-bold text-white">User Conversations</h3>
        <div className="space-y-3">
          {profiles.filter(p => p.role === "user").map(p => {
            const unread = chats.filter(c => c.senderId === p.id && !c.read).length;
            return (
              <div key={p.id} onClick={() => setSelectedUser(p.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${selectedUser === p.id ? 'border-neon bg-dark-card' : 'border-zinc-800 bg-dark-card/50 hover:border-zinc-600'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon/10 text-sm font-bold text-neon">{p.fullName.charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <p className="font-bold text-white">{p.fullName}</p>
                    <p className="text-xs text-zinc-500">{userChats(p.id).length} messages</p>
                  </div>
                  {unread > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unread}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedUser && (
        <div className="rounded-xl border border-zinc-800 bg-dark-card">
          <div className="border-b border-zinc-800 p-4">
            <h4 className="font-bold text-white">Chat with {profileName(selectedUser)}</h4>
          </div>
          <div className="h-[50vh] space-y-4 overflow-y-auto p-4">
            {userChats(selectedUser).map(m => (
              <div key={m.id} className={`flex ${m.senderId === adminId ? "justify-end" : "justify-start"}`}>
                <div className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm group ${m.senderId === adminId ? "bg-neon/20 text-white" : "bg-zinc-800 text-zinc-300"}`}>
                  <p>{m.text}</p>
                  <p className="mt-1 text-[10px] opacity-50">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <button onClick={() => handleDeleteChat(m.id)}
                    className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white group-hover:flex">✕</button>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleReply} className="flex items-center gap-3 border-t border-zinc-800 p-4">
            <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Reply..."
              className="flex-1 rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
            <button type="submit" className="rounded-full bg-neon px-6 py-3 text-sm font-bold text-black hover:brightness-110">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── Sessions Tab (NEW) ───
function SessionsTab() {
  const [allNotes, setAllNotes] = useState<SessionNote[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminId, setAdminId] = useState("");
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    getSupabase().auth.getUser().then((res: any) => { if (res.data?.user) setAdminId(res.data.user.id); });
    getAllSessionNotes().then(setAllNotes);
    getAllProfiles().then(setProfiles);
  }, []);

  const profileName = (id: string) => { const p = profiles.find(pr => pr.id === id); return p ? p.fullName : id.slice(0, 8); };

  async function saveAdminFeedback(noteId: string) {
    await updateSessionNote(noteId, { adminNote, rating });
    setAllNotes(prev => prev.map(n => n.id === noteId ? { ...n, adminNote, rating } : n));
    setSelectedNote(null);
    setAdminNote("");
  }

  async function handleDeleteNote(id: string) {
    await deleteSessionNote(id);
    setAllNotes(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div>
      <h3 className="mb-6 font-bold text-white">All Session Notes</h3>
      <div className="space-y-3">
        {allNotes.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-dark-card p-12 text-center"><p className="text-zinc-500">No sessions logged yet</p></div>
        ) : allNotes.map(n => (
          <div key={n.id} className="rounded-xl border border-zinc-800 bg-dark-card p-5 transition-all hover:border-neon/20">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neon/10 text-sm font-bold text-neon">{profileName(n.userId).charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="font-bold text-white">{profileName(n.userId)}</p>
                    <p className="text-xs text-zinc-500">{new Date(n.sessionDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4,5].map(i => <span key={i} className={`text-xs ${i <= n.rating ? 'text-neon' : 'text-zinc-700'}`}>★</span>)}
                </div>
                {n.userNote && <p className="mt-2 text-sm text-zinc-400">{n.userNote}</p>}
                {n.adminNote && <div className="mt-2 border-t border-zinc-800 pt-2"><p className="text-xs font-medium text-neon">Coach: {n.adminNote}</p></div>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setSelectedNote(n.id); setAdminNote(n.adminNote || ""); setRating(n.rating || 5); }}
                  className="text-xs text-zinc-600 hover:text-neon">✎</button>
                <button onClick={() => handleDeleteNote(n.id)}
                  className="text-xs text-zinc-600 hover:text-red-400">✕</button>
              </div>
            </div>
            {selectedNote === n.id && (
              <div className="mt-4 border-t border-zinc-800 pt-4">
                <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Coach feedback..."
                  className="mb-3 w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" rows={3} />
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-sm text-zinc-400">Rating:</span>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setRating(n)}
                      className={`h-8 w-8 rounded-full text-sm font-bold ${n <= rating ? 'bg-neon text-black' : 'bg-zinc-800 text-zinc-500'}`}>{n}</button>
                  ))}
                </div>
                <button onClick={() => saveAdminFeedback(n.id)} className="rounded-full bg-neon px-6 py-2 text-sm font-bold text-black hover:brightness-110">Save Feedback</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Media Tab (with preview + delete) ───
function MediaTab() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => { getSiteConfig().then(setConfig); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, target: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const supabase = getSupabase();
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const prefix = target === "background" ? "bg" : target === "gallery" ? "gallery" : target === "image" ? "coach" : target === "bgvideo" ? "bgvid" : "promo";
      const fileName = `${prefix}-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("uploads").upload(fileName, file, {
        contentType: file.type,
        upsert: true,
      });
      if (uploadErr) { setUploadError("Upload: " + uploadErr.message); return; }
      const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(fileName);
      if (!config) return;
      const updated = { ...config };
      if (target === "video") updated.media.trainingPromo = publicUrl;
      else if (target === "image") updated.media.coachProfile = publicUrl;
      else if (target === "background") updated.backgroundImage = publicUrl;
      else if (target === "bgvideo") updated.backgroundVideo = publicUrl;
      else if (target === "gallery") updated.media.gymImages = [...(updated.media.gymImages || []), publicUrl];
      setConfig(updated);
      const saveErr = await saveSiteConfig(updated);
      if (saveErr) { setUploadError("Save: " + saveErr); return; }
      alert("Uploaded successfully!");
    } catch (e: any) { setUploadError("Error: " + (e?.message || e)); }
    finally { setUploading(false); }
  }

  async function handleClear(target: string) {
    if (!config) return;
    const updated = { ...config };
    if (target === "image") updated.media.coachProfile = "";
    else if (target === "video") updated.media.trainingPromo = "";
    else if (target === "background") updated.backgroundImage = "";
    else if (target === "bgvideo") updated.backgroundVideo = "";
    setConfig(updated);
    await saveSiteConfig(updated);
  }

  async function handleDeleteGallery(idx: number) {
    if (!config) return;
    const updated = { ...config, media: { ...config.media, gymImages: config.media.gymImages.filter((_, i) => i !== idx) } };
    setConfig(updated);
    await saveSiteConfig(updated);
  }

  if (!config) return <div className="p-12 text-center text-zinc-500">Loading...</div>;

  const cards = [
    { target: "image", label: "Coach Profile", url: config.media.coachProfile, isImage: true },
    { target: "video", label: "Training Video", url: config.media.trainingPromo, isImage: false },
    { target: "background", label: "Background Image", url: config.backgroundImage, isImage: true },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ target, label, url, isImage }) => (
          <div key={target} className="rounded-xl border border-zinc-800 bg-dark-card p-4">
            <h3 className="mb-2 text-sm font-bold text-white">{label}</h3>
            {url ? (
              <div className="mb-3 overflow-hidden rounded-lg border border-zinc-700 bg-black/50">
                {isImage ? (
                  <img src={url} alt={label} className="h-32 w-full object-cover" />
                ) : (
                  <video src={url} className="h-32 w-full object-cover" muted />
                )}
              </div>
            ) : (
              <div className="mb-3 flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-black/30 text-xs text-zinc-600">
                {isImage ? "No image" : "No video"}
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer rounded-full bg-neon px-3 py-2 text-center text-xs font-bold text-black hover:brightness-110">
                {uploading ? "..." : "Upload"}
                <input type="file" accept={isImage ? "image/*" : "video/*"} className="hidden" onChange={(e) => handleUpload(e, target)} disabled={uploading} />
              </label>
              {url && (
                <button onClick={() => handleClear(target)} className="rounded-full bg-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/30">✕</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {uploadError && <div className="rounded-xl border border-red-800 bg-red-900/20 p-4 text-sm text-red-400">{uploadError}</div>}

      <div className="rounded-xl border border-zinc-800 bg-dark-card p-6">
        <h3 className="mb-4 font-bold text-white">Salle Gallery</h3>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {config.media.gymImages.length === 0 ? (
            <div className="col-span-full flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-black/30 text-xs text-zinc-600">No images</div>
          ) : config.media.gymImages.map((url, i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg border border-zinc-700 bg-black/50">
              <img src={url} alt={`Gallery ${i}`} className="h-32 w-full object-cover" />
              <button onClick={() => handleDeleteGallery(i)}
                className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex">✕</button>
            </div>
          ))}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-bold text-black hover:brightness-110">
          {uploading ? "..." : "Add Image"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "gallery")} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

// ─── Social Tab (updated with gmail) ───
function SocialTab() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { getSiteConfig().then(setConfig); }, []);

  async function save() {
    if (!config) return;
    setError("");
    const err = await saveSiteConfig(config);
    if (err) { setError(err); return; }
    alert("Social links updated");
  }

  if (!config) return <div className="p-12 text-center text-zinc-500">Loading...</div>;

  return (
    <div className="max-w-lg space-y-5 rounded-xl border border-zinc-800 bg-dark-card p-6">
      {(["instagram", "whatsapp", "facebook", "gmail"] as const).map((key) => (
        <div key={key}>
          <label className="mb-1.5 block text-sm font-medium capitalize text-zinc-300">{key === "gmail" ? "Gmail" : key} URL</label>
          <input value={config.social[key]} onChange={(e) => setConfig({ ...config, social: { ...config.social, [key]: e.target.value } })}
            className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
        </div>
      ))}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button onClick={save} className="rounded-full bg-neon px-8 py-2.5 text-sm font-bold text-black hover:brightness-110 hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]">
        Save Changes
      </button>
    </div>
  );
}

function ProgressTab() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [form, setForm] = useState({ weight: "", bodyFat: "", chest: "", waist: "", arms: "", notes: "" });

  useEffect(() => {
    getAllProgressRecords().then(setRecords);
    getAllProfiles().then(setProfiles);
  }, []);

  const profileName = (id: string) => { const p = profiles.find(pr => pr.id === id); return p ? p.fullName : id.slice(0, 8); };

  async function handleAdd() {
    if (!selectedUser || !form.weight) return;
    const rec: ProgressRecord = {
      id: crypto.randomUUID(), userId: selectedUser,
      recordedAt: new Date().toISOString(),
      weight: Number(form.weight), bodyFat: Number(form.bodyFat) || 0,
      chest: Number(form.chest) || 0, waist: Number(form.waist) || 0,
      arms: Number(form.arms) || 0, notes: form.notes,
    };
    await addProgressRecord(rec);
    setRecords(prev => [rec, ...prev]);
    setForm({ weight: "", bodyFat: "", chest: "", waist: "", arms: "", notes: "" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h3 className="font-bold text-white">Progress Records</h3>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-neon">
            <option value="">All users</option>
            {profiles.filter(p => p.role === "user").map(p => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          {(selectedUser ? records.filter(r => r.userId === selectedUser) : records).length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-dark-card p-12 text-center"><p className="text-zinc-500">No records yet</p></div>
          ) : (selectedUser ? records.filter(r => r.userId === selectedUser) : records).map(r => (
            <div key={r.id} className="rounded-xl border border-zinc-800 bg-dark-card p-4">
              <p className="font-bold text-white">{profileName(r.userId)}</p>
              <p className="text-xs text-zinc-500">{new Date(r.recordedAt).toLocaleDateString()}</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-zinc-400">
                <span>⚖ {r.weight}kg</span>
                <span>💪 {r.arms}cm</span>
                <span>🏋️ {r.chest}cm</span>
                <span>📏 {r.waist}cm</span>
                <span>🔬 {r.bodyFat}%</span>
              </div>
              {r.notes && <p className="mt-1 text-xs text-zinc-500">{r.notes}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-dark-card p-6">
        <h4 className="mb-4 font-bold text-white">Add Progress Record</h4>
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}
          className="mb-3 w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon">
          <option value="">Select user</option>
          {profiles.filter(p => p.role === "user").map(p => (
            <option key={p.id} value={p.id}>{p.fullName}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          {(["weight","bodyFat","chest","waist","arms"] as const).map(f => (
            <div key={f}>
              <label className="mb-1 block text-xs text-zinc-400 capitalize">{f === "bodyFat" ? "Body Fat %" : f}</label>
              <input type="number" value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})}
                className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs text-zinc-400">Notes</label>
          <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
            className="w-full rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
        </div>
        <button onClick={handleAdd} className="mt-4 w-full rounded-full bg-neon py-3 text-sm font-bold text-black hover:brightness-110">
          Add Record
        </button>
      </div>
    </div>
  );
}

function AdminDashboardInner() {
  const params = useSearchParams();
  const tab = params.get("tab") || "dashboard";

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">
        <span className="text-neon">/</span>{" "}
        {tab === "dashboard" && "Dashboard"}
        {tab === "members" && "Members"}
        {tab === "users" && "Users"}
        {tab === "inbox" && "Inbox"}
        {tab === "chat" && "Chat"}
        {tab === "sessions" && "Session Feedback"}
        {tab === "progress" && "Progress Tracking"}
        {tab === "media" && "Media Manager"}
        {tab === "social" && "Social Links"}
      </h2>
      {tab === "dashboard" && <DashboardTab />}
      {tab === "members" && <MembersTab />}
      {tab === "users" && <UsersTab />}
      {tab === "inbox" && <InboxTab />}
      {tab === "chat" && <ChatTab />}
      {tab === "sessions" && <SessionsTab />}
      {tab === "progress" && <ProgressTab />}
      {tab === "social" && <SocialTab />}
      {tab === "media" && <MediaTab />}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">Loading...</div>}>
      <AdminDashboardInner />
    </Suspense>
  );
}
