import type { Member, Message, SiteConfig, Profile, WorkoutSchedule, ChatMessage, SessionNote, ProgressRecord } from "@/types";
import { DEFAULT_SITE_CONFIG } from "./constants";
import { getSupabase } from "./supabase";

// ─── Members ───
export async function getMembers(): Promise<Member[]> {
  const client = getSupabase();
  const { data } = await client.from("members").select("*").order("created_at", { ascending: false });
  return (data || []).map((m: any) => ({
    id: m.id, firstName: m.first_name, lastName: m.last_name, age: m.age,
    weight: m.weight, height: m.height, goal: m.goal, plan: m.plan,
    phone: m.phone || "", createdAt: m.created_at, message: m.message,
  }));
}

export async function addMember(m: Member): Promise<{ error: string | null }> {
  const client = getSupabase();
  const { error } = await client.from("members").insert({
    id: m.id, first_name: m.firstName, last_name: m.lastName, age: m.age,
    weight: m.weight, height: m.height, goal: m.goal, plan: m.plan,
    phone: m.phone || null, message: m.message || null, created_at: m.createdAt,
  });
  return { error: error?.message || null };
}

export async function deleteMember(id: string): Promise<void> {
  const client = getSupabase();
  await client.from("members").delete().eq("id", id);
}

// ─── Messages ───
export async function getMessages(): Promise<Message[]> {
  const client = getSupabase();
  const { data } = await client.from("messages").select("*").order("created_at", { ascending: false });
  return (data || []).map((m: any) => ({
    id: m.id, name: m.name, email: m.email, text: m.text, createdAt: m.created_at,
  }));
}

export async function addMessage(m: Message): Promise<void> {
  const client = getSupabase();
  await client.from("messages").insert({
    id: m.id, name: m.name, email: m.email, text: m.text, created_at: m.createdAt,
  });
}

export async function deleteMessage(id: string): Promise<void> {
  const client = getSupabase();
  await client.from("messages").delete().eq("id", id);
}

export async function deleteProfile(id: string): Promise<void> {
  const client = getSupabase();
  await client.from("profiles").delete().eq("id", id);
}

export async function deleteChatMessage(id: string): Promise<void> {
  const client = getSupabase();
  await client.from("chat_messages").delete().eq("id", id);
}

export async function deleteSessionNote(id: string): Promise<void> {
  const client = getSupabase();
  await client.from("session_notes").delete().eq("id", id);
}

export async function deleteProgressRecord(id: string): Promise<void> {
  const client = getSupabase();
  await client.from("progress_records").delete().eq("id", id);
}

// ─── Site Config ───
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch("/api/config?get=1");
    const data = await res.json();
    if (data?.config) return data.config;
  } catch {}
  return DEFAULT_SITE_CONFIG;
}

export async function saveSiteConfig(config: SiteConfig): Promise<string | null> {
  try {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coach_profile: config.media.coachProfile,
        training_promo: config.media.trainingPromo,
        gym_images: config.media.gymImages,
        instagram: config.social.instagram,
        whatsapp: config.social.whatsapp,
        facebook: config.social.facebook,
        gmail: config.social.gmail,
        background_image: config.backgroundImage,
        background_video: config.backgroundVideo,
        hero_background: config.heroBackground,
      }),
    });
    const data = await res.json();
    return data?.error || null;
  } catch (e: any) {
    return e?.message || "Save failed";
  }
}

// ─── Profiles (Auth) ───
export async function getProfile(userId: string): Promise<Profile | null> {
  const client = getSupabase();
  const { data } = await client.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (!data) return null;
  return {
    id: data.id, email: data.email, fullName: data.full_name, phone: data.phone || "",
    role: data.role, avatarUrl: data.avatar_url || "", createdAt: data.created_at,
  };
}

export async function getAllProfiles(): Promise<Profile[]> {
  const client = getSupabase();
  const { data } = await client.from("profiles").select("*").order("created_at", { ascending: false });
  return (data || []).map((p: any) => ({
    id: p.id, email: p.email, fullName: p.full_name, phone: p.phone || "",
    role: p.role, avatarUrl: p.avatar_url || "", createdAt: p.created_at,
  }));
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }): Promise<void> {
  const client = getSupabase();
  await client.from("profiles").upsert({
    id: profile.id, email: profile.email, full_name: profile.fullName,
    phone: profile.phone, role: profile.role || "user", avatar_url: profile.avatarUrl,
  });
}

// ─── Workout Schedules ───
export async function getSchedules(userId: string): Promise<WorkoutSchedule[]> {
  const client = getSupabase();
  const { data } = await client.from("workout_schedules").select("*").eq("user_id", userId).order("day_of_week").order("start_time");
  return (data || []).map((s: any) => ({
    id: s.id, userId: s.user_id, dayOfWeek: s.day_of_week,
    startTime: s.start_time, endTime: s.end_time, title: s.title, description: s.description || "",
  }));
}

export async function getAllSchedules(): Promise<WorkoutSchedule[]> {
  const client = getSupabase();
  const { data } = await client.from("workout_schedules").select("*").order("day_of_week").order("start_time");
  return (data || []).map((s: any) => ({
    id: s.id, userId: s.user_id, dayOfWeek: s.day_of_week,
    startTime: s.start_time, endTime: s.end_time, title: s.title, description: s.description || "",
  }));
}

export async function addSchedule(s: WorkoutSchedule): Promise<void> {
  const client = getSupabase();
  await client.from("workout_schedules").insert({
    id: s.id, user_id: s.userId, day_of_week: s.dayOfWeek,
    start_time: s.startTime, end_time: s.endTime, title: s.title, description: s.description,
  });
}

export async function deleteSchedule(id: string): Promise<void> {
  const client = getSupabase();
  await client.from("workout_schedules").delete().eq("id", id);
}

// ─── Chat Messages ───
export async function getChatMessages(userId: string, otherId: string): Promise<ChatMessage[]> {
  const client = getSupabase();
  const { data } = await client
    .from("chat_messages")
    .select("*")
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`)
    .order("created_at", { ascending: true });
  return (data || []).map((m: any) => ({
    id: m.id, senderId: m.sender_id, receiverId: m.receiver_id,
    text: m.text, read: m.read, createdAt: m.created_at,
  }));
}

export async function getAllUserChats(): Promise<ChatMessage[]> {
  const client = getSupabase();
  const { data } = await client.from("chat_messages").select("*").order("created_at", { ascending: false });
  return (data || []).map((m: any) => ({
    id: m.id, senderId: m.sender_id, receiverId: m.receiver_id,
    text: m.text, read: m.read, createdAt: m.created_at,
  }));
}

export async function sendChatMessage(msg: ChatMessage): Promise<void> {
  const client = getSupabase();
  await client.from("chat_messages").insert({
    id: msg.id, sender_id: msg.senderId, receiver_id: msg.receiverId,
    text: msg.text, read: false, created_at: msg.createdAt,
  });
}

export async function markChatRead(msgId: string): Promise<void> {
  const client = getSupabase();
  await client.from("chat_messages").update({ read: true }).eq("id", msgId);
}

// ─── Session Notes ───
export async function getSessionNotes(userId: string): Promise<SessionNote[]> {
  const client = getSupabase();
  const { data } = await client.from("session_notes").select("*").eq("user_id", userId).order("session_date", { ascending: false });
  return (data || []).map((n: any) => ({
    id: n.id, userId: n.user_id, adminId: n.admin_id,
    sessionDate: n.session_date, userNote: n.user_note || "",
    adminNote: n.admin_note || "", rating: n.rating || 0, createdAt: n.created_at,
  }));
}

export async function getAllSessionNotes(): Promise<SessionNote[]> {
  const client = getSupabase();
  const { data } = await client.from("session_notes").select("*").order("session_date", { ascending: false });
  return (data || []).map((n: any) => ({
    id: n.id, userId: n.user_id, adminId: n.admin_id,
    sessionDate: n.session_date, userNote: n.user_note || "",
    adminNote: n.admin_note || "", rating: n.rating || 0, createdAt: n.created_at,
  }));
}

export async function addSessionNote(note: SessionNote): Promise<void> {
  const client = getSupabase();
  await client.from("session_notes").insert({
    id: note.id, user_id: note.userId, admin_id: note.adminId,
    session_date: note.sessionDate, user_note: note.userNote,
    admin_note: note.adminNote, rating: note.rating,
  });
}

export async function updateSessionNote(id: string, updates: Partial<SessionNote>): Promise<void> {
  const client = getSupabase();
  const payload: any = {};
  if (updates.adminNote !== undefined) payload.admin_note = updates.adminNote;
  if (updates.rating !== undefined) payload.rating = updates.rating;
  if (updates.userNote !== undefined) payload.user_note = updates.userNote;
  await client.from("session_notes").update(payload).eq("id", id);
}

// ─── Progress Records ───
export async function getProgressRecords(userId: string): Promise<ProgressRecord[]> {
  const client = getSupabase();
  const { data } = await client.from("progress_records").select("*").eq("user_id", userId).order("recorded_at", { ascending: false });
  return (data || []).map((r: any) => ({
    id: r.id, userId: r.user_id, recordedAt: r.recorded_at,
    weight: r.weight, bodyFat: r.body_fat, chest: r.chest,
    waist: r.waist, arms: r.arms, notes: r.notes || "",
  }));
}

export async function getAllProgressRecords(): Promise<ProgressRecord[]> {
  const client = getSupabase();
  const { data } = await client.from("progress_records").select("*").order("recorded_at", { ascending: false });
  return (data || []).map((r: any) => ({
    id: r.id, userId: r.user_id, recordedAt: r.recorded_at,
    weight: r.weight, bodyFat: r.body_fat, chest: r.chest,
    waist: r.waist, arms: r.arms, notes: r.notes || "",
  }));
}

export async function addProgressRecord(record: ProgressRecord): Promise<void> {
  const client = getSupabase();
  await client.from("progress_records").insert({
    id: record.id, user_id: record.userId, recorded_at: record.recordedAt,
    weight: record.weight, body_fat: record.bodyFat, chest: record.chest,
    waist: record.waist, arms: record.arms, notes: record.notes,
  });
}
