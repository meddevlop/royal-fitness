import type { Plan, SiteConfig } from "@/types";

export const PLANS: Plan[] = [
  { id: 1, label: "1 Month", price: 70, currency: "DT" },
  { id: 6, label: "6 Months", price: 350, currency: "DT", popular: true },
  { id: 12, label: "12 Months", price: 770, currency: "DT" },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  media: {
    coachProfile: "/about%20my/coach-profile.jpg",
    trainingPromo: "/about%20my/training-promo.mp4",
    gymImages: [],
  },
  social: {
    instagram: "",
    whatsapp: "",
    facebook: "",
    gmail: "",
  },
  backgroundImage: "",
  backgroundVideo: "",
  heroBackground: "default",
};

export const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
