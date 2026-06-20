import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mohamed Boujarra — CrossFit Coach | 14th in Africa | Royal Fitness",
  description:
    "Elite CrossFit coaching by Mohamed Boujarra, ranked 14th in Africa. Stronger every day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-dark text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}
