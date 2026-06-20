"use client";
import { useEffect, useState, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import { getProfile, sendChatMessage, getChatMessages } from "@/lib/store";
import type { ChatMessage, Profile } from "@/types";

export default function ChatPage() {
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [adminProfile, setAdminProfile] = useState<Profile | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSupabase().auth.getUser().then(async (res: any) => {
      if (!res.data?.user) return;
      setUserId(res.data.user.id);
      const { data: profiles } = await getSupabase().from("profiles").select("*").eq("role", "admin");
      if (profiles && profiles.length > 0) {
        const admin: Profile = { id: profiles[0].id, email: profiles[0].email, fullName: profiles[0].full_name, phone: profiles[0].phone||"", role:"admin", avatarUrl:"", createdAt: profiles[0].created_at };
        setAdminProfile(admin);
        loadChat(res.data.user.id, profiles[0].id);
      }
    });
  }, []);

  async function loadChat(uid: string, aid: string) {
    setMsgs(await getChatMessages(uid, aid));
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !adminProfile) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(), senderId: userId, receiverId: adminProfile.id,
      text: text.trim(), read: false, createdAt: new Date().toISOString(),
    };
    await sendChatMessage(msg);
    setMsgs(prev => [...prev, msg]);
    setText("");
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white"><span className="text-neon">/</span> Chat with Coach</h2>
      <div className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-dark-card">
        <div className="h-[60vh] space-y-4 overflow-y-auto p-6">
          {msgs.length === 0 ? (
            <p className="text-center text-zinc-500">Start a conversation with Coach Boujarra</p>
          ) : (
            msgs.map(m => (
              <div key={m.id} className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  m.senderId === userId ? "bg-neon/20 text-white" : "bg-zinc-800 text-zinc-300"
                }`}>
                  <p>{m.text}</p>
                  <p className="mt-1 text-[10px] opacity-50">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-zinc-800 p-4">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..."
            className="flex-1 rounded-xl border border-zinc-700 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-neon" />
          <button type="submit" className="rounded-full bg-neon px-6 py-3 text-sm font-bold text-black hover:brightness-110">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
