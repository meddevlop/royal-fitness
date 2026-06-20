"use client";
import { useEffect, useState } from "react";
import { getSiteConfig } from "@/lib/store";
import type { SiteConfig } from "@/types";

export default function Footer() {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => { getSiteConfig().then(setConfig); }, []);

  return (
    <footer className="border-t border-zinc-800 bg-dark-card/50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <h3 className="text-xl font-black tracking-tight">
              <span className="text-white">ROYAL</span> <span className="text-neon">FITNESS</span>
            </h3>
            <p className="mt-2 text-sm text-zinc-500">CrossFit Tunisie — Stronger every day.</p>
          </div>

          <div className="flex items-center gap-6">
            {config?.social.instagram && (
              <a href={config.social.instagram} target="_blank" rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-neon">
                Instagram
              </a>
            )}
            {config?.social.whatsapp && (
              <a href={config.social.whatsapp} target="_blank" rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-neon">
                WhatsApp
              </a>
            )}
            {config?.social.facebook && (
              <a href={config.social.facebook} target="_blank" rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-neon">
                Facebook
              </a>
            )}
            {config?.social.gmail && (
              <a href={`mailto:${config.social.gmail}`}
                className="text-sm text-zinc-500 transition-colors hover:text-neon">
                {config.social.gmail}
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-8 text-center">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Royal Fitness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
