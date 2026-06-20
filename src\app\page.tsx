import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import AchievementBar from "@/components/sections/AchievementBar";
import WorkingProcess from "@/components/sections/WorkingProcess";
import Pricing from "@/components/sections/Pricing";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";

export const dynamic = "force-dynamic";

async function getConfig() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://royal-fitness-maav.vercel.app"}/api/config?get=1`, { cache: "no-store" });
    const data = await res.json();
    return data?.config?.backgroundImage || "";
  } catch { return ""; }
}

export default async function Home() {
  const bgImage = await getConfig();
  return (
    <main>
      <Navbar />
      <Hero backgroundImage={bgImage} />
      <AchievementBar />
      <WorkingProcess />
      <Pricing />
      <ContactSection />
      <Footer />
    </main>
  );
}
