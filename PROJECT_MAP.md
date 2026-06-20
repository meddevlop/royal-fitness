# PROJECT_MAP — Mohamed Boujrra | Royal Fitness

## [TECH_STACK]

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Framework | Next.js (App Router) | 16.2.9 | ✅ Installed |
| Language | TypeScript | ^5 | ✅ Installed |
| Styling | Tailwind CSS v4 | ^4 | ✅ Installed |

---

## [SYSTEM_FLOW]

### Routes
```
/ (Landing Page)                → Static  → Hero → AchievementBar → Pricing
/register?plan={1|6|12}         → Dynamic → Full-screen multi-step form
/admin/dashboard                → Static  → Admin panel (5 tabs)
/api/upload                     → Dynamic → File upload to public/about my/
```

### User Flow
```
Landing Page
  ├── Hero Section
  │   ├── Autoplay video background (training-promo.mp4)
  │   ├── "STRONGER EVERY DAY" headline (neon #39FF14)
  │   ├── CTA "Join Now" → #pricing
  │   └── CTA "My Story" → #achievement
  ├── Achievement Bar (full-width neon green strip)
  │   ├── "COACH MOHAMED BOUJRRA — RANKED 14TH IN AFRICA"
  │   ├── Animated counter: 14th (Africa Rank)
  │   ├── Animated counter: 850+ (Members)
  │   └── Animated counter: 12,000+ (Training Hours)
  └── Pricing Section
      ├── 1 Month — 70 DT → /register?plan=1
      ├── 6 Months — 350 DT → /register?plan=6  ⭐ Most Popular
      └── 12 Months — 770 DT → /register?plan=12

/register?plan=X
  ├── Full-screen centered form
  ├── Step 1: First Name / Last Name / Age
  ├── Step 2: Weight (kg) / Height (cm)
  ├── Step 3: Goal dropdown (Fat Loss / Build Muscle / General Fitness)
  └── Submit → localStorage → redirect to /

/admin/dashboard
  ├── Dashboard tab → Stats cards (total members, per-plan breakdown)
  ├── Members tab → Member cards (name, age, mini bars for weight/height, goal, plan, delete)
  ├── Inbox tab → Messages list (name, email, text, date, delete)
  ├── Media tab → Upload image to /about my/ or upload video
  └── Social tab → Edit Instagram / WhatsApp / Facebook URLs
```

---

## [ARCHITECTURE]

```
gym-of-boujarie/
├── public/about my/
│   ├── coach-profile.jpg               # Updated on upload
│   ├── training-promo.mp4              # Updated on upload
│   └── [extra media files]
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root: Geist, bg-dark (#0B0B0B)
│   │   ├── page.tsx                    # Hero + AchievementBar + Pricing
│   │   ├── globals.css                 # Tailwind v4 theme (#39FF14 accent)
│   │   ├── register/page.tsx           # Full-screen registration form
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Dark sidebar with neon icons
│   │   │   └── dashboard/page.tsx      # 5 tabs: Dashboard/Members/Inbox/Media/Social
│   │   └── api/upload/route.ts         # File upload handler
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx                # Video bg + "STRONGER EVERY DAY"
│   │   │   ├── AchievementBar.tsx      # Neon strip + animated counters
│   │   │   └── Pricing.tsx             # 3 TND cards with hover effects
│   │   └── forms/
│   │       └── RegistrationForm.tsx    # 3-step full-screen form
│   ├── lib/
│   │   ├── utils.ts                    # cn()
│   │   ├── constants.ts                # Plans, default config
│   │   └── store.ts                    # localStorage CRUD (members, messages, config)
│   └── types/
│       └── index.ts                    # Member, Message, SiteConfig, Plan
├── postcss.config.mjs
├── next.config.ts
├── package.json
└── PROJECT_MAP.md
```

### Design Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `bg-dark` | `#0B0B0B` | Page background |
| `bg-dark-card` | `#111111` | Card/section backgrounds |
| `neon` | `#39FF14` | Primary accent, CTAs, highlights |
| Default text | `#f4f4f5` | Body copy |
| Muted text | `#71717a` | Secondary info |

---

## [ORPHANS & PENDING]

| Item | Status | Action Required |
|------|--------|----------------|
| Navbar (sticky + hamburger) | PENDING | Build navigation for landing page |
| Why Choose Us section | PENDING | Build with booking modal |
| Services grid (6 cards) | PENDING | Build service cards |
| Reviews carousel | PENDING | Build testimonial slider |
| Footer (social icons + copyright) | PENDING | Link admin social config to footer |
| MongoDB / PostgreSQL | PENDING | Replace localStorage with DB |
| Admin auth (NextAuth) | PENDING | Secure admin routes with login |
| Stripe payment integration | PENDING | Connect pricing to live payments |
| Zod validation on form | PENDING | Add runtime schema validation |
| Deploy to Vercel | PENDING | Production deployment |
