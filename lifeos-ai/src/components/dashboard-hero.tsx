"use client";

import { Sun, AtSign, Twitter, Plus } from "lucide-react";

const nav = ["HOME", "ABOUT", "WORK", "STORE", "CONTACT"];

export function DashboardHero() {
  return (
    <div className="dash-hero relative overflow-hidden rounded-3xl">
      {/* top nav row */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <ul className="flex flex-wrap items-center gap-4 text-xs font-semibold tracking-widest text-white/90">
          {nav.map((n, i) => (
            <li key={n}>
              <a
                href="#"
                className={
                  i === 0
                    ? "rounded-md bg-white/90 px-3 py-1.5 text-fg"
                    : "transition-opacity hover:opacity-70"
                }
              >
                {n}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 text-white/90">
          <Sun className="h-4 w-4" />
          <span className="text-sm font-semibold">g+</span>
          <Twitter className="h-4 w-4" />
          <AtSign className="h-4 w-4" />
        </div>
      </div>

      {/* headline */}
      <div className="relative z-10 px-8 pb-14 pt-8 sm:pt-14">
        <h1 className="font-brush text-[clamp(3.5rem,10vw,7rem)] leading-[0.8] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]">
          <span className="block">stand</span>
          <span className="block pl-6">out</span>
        </h1>
        <p className="mt-6 max-w-md text-lg italic text-white/90 drop-shadow">
          in a sea of ordinary, make sure your life is set apart from the
          competition.
        </p>
      </div>
    </div>
  );
}
