import Link from "next/link";
import { redirect } from "next/navigation";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const planId = parseInt(plan || "", 10) as 1 | 6 | 12;

  if (![1, 6, 12].includes(planId)) redirect("/");

  return (
    <main className="min-h-screen bg-dark">
      <div className="fixed left-6 top-6 z-50">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-[#39FF14]"
        >
          ← Back
        </Link>
      </div>
      <div className="fixed right-6 top-6 z-50 text-right">
        <p className="text-xs font-bold tracking-widest text-zinc-700 uppercase">
          Royal Fitness
        </p>
      </div>
      <RegistrationForm plan={planId} />
    </main>
  );
}
