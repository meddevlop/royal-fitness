export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  weight: number;
  height: number;
  goal: "fat-loss" | "build-muscle" | "general-fitness";
  plan: 1 | 6 | 12;
  phone?: string;
  createdAt: string;
  message?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  text: string;
  createdAt: string;
}

export interface SiteConfig {
  media: {
    coachProfile: string;
    trainingPromo: string;
    gymImages: string[];
  };
  social: {
    instagram: string;
    whatsapp: string;
    facebook: string;
    gmail: string;
  };
  backgroundImage: string;
  backgroundVideo: string;
  heroBackground: "video" | "image" | "default";
}

export interface Plan {
  id: 1 | 6 | 12;
  label: string;
  price: number;
  currency: string;
  popular?: boolean;
}

// NEW TYPES
export interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "user" | "admin";
  avatarUrl: string;
  createdAt: string;
}

export interface WorkoutSchedule {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface SessionNote {
  id: string;
  userId: string;
  adminId: string | null;
  sessionDate: string;
  userNote: string;
  adminNote: string;
  rating: number;
  createdAt: string;
}

export interface ProgressRecord {
  id: string;
  userId: string;
  recordedAt: string;
  weight: number;
  bodyFat: number;
  chest: number;
  waist: number;
  arms: number;
  notes: string;
}

export interface WeekDay {
  value: number;
  label: string;
  short: string;
}

export const WEEK_DAYS: WeekDay[] = [
  { value: 0, label: "Sunday", short: "Sun" },
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
];
