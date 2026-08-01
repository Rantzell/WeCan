"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const quotes = [
  "Consistency beats perfection every single time.",
  "Every step forward is a step closer to your dreams.",
  "Small progress each day leads to remarkable results.",
  "Your future is created by what you do today.",
  "Dream big, work hard, and stay humble.",
  "Success begins with the courage to take the first step.",
];

const nav = ["HOME"];

export default function Welcome() {
  const [q, setQ] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setQ((i) => (i + 1) % quotes.length);
        setShow(true);
      }, 400);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-dvh overflow-hidden px-6 py-6 sm:px-10">
      <div className="app-bg" />

      {/* NAV */}
      <nav className="flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap items-center gap-5 text-sm font-semibold tracking-wider text-fg/80">
          {nav.map((n, i) => (
            <li key={n}>
              <a
                href="#"
                className={
                  i === 0
                    ? "rounded-md bg-card/80 px-3 py-1.5 text-fg"
                    : "transition-opacity hover:opacity-70"
                }
              >
                {n}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-card/60"
          >
            Sign in
          </Link>
          <Link
            href="/login?mode=signup"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="flex min-h-[70vh] flex-col justify-center">
        <h1 className="font-brush text-[clamp(4rem,15vw,10rem)] leading-[0.85] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]">
          <span className="block">you</span>
          <span className="block pl-6">can</span>
        </h1>

        <p
          className={`mt-8 max-w-[34ch] text-[clamp(1.3rem,2.6vw,1.9rem)] italic text-white/90 drop-shadow transition-all duration-500 ${
            show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {quotes[q]}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/login?mode=signup"
            className="rounded-2xl bg-accent px-6 py-3 text-base font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Get started — it&apos;s free
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-white/40 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Register here
          </Link>
        </div>

        <p className="mt-6 text-sm text-fg/70">
          One AI-powered operating system for your school, fitness, budget, habits &amp; goals.
        </p>
      </div>
    </div>
  );
}
