"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Mail, Lock, ArrowLeft, MailCheck } from "lucide-react";

type Step = "auth" | "sent";

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );
  const [step, setStep] = useState<Step>("auth");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT");

  function reset(next?: Partial<{ msg: string; err: string }>) {
    setMsg(next?.msg ?? null);
    setErr(next?.err ?? null);
  }

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    reset();

    if (!configured) {
      setErr("Add your Supabase keys to .env.local to enable real accounts.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setErr("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        setErr("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      setLoading(false);
      if (error) {
        console.error("signUp error", error);
        const retryable = error.name === "AuthRetryableFetchError";
        return setErr(
          retryable
            ? "Sign up failed sending the confirmation email. In Supabase → Authentication → Providers → Email, turn OFF “Confirm email” (or fix your SMTP), then try again."
            : error.message?.trim() || "Sign up failed. Please try again."
        );
      }
      // Email confirmation disabled → session is returned, go straight in.
      if (data.session) {
        window.location.href = "/";
        return;
      }
      // Otherwise confirmation is required — show the check-your-email screen.
      setStep("sent");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setErr(error.message);
      window.location.href = "/";
    }
  }

  async function resendLink() {
    reset();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setErr(error.message);
    else setMsg("A new confirmation link is on its way.");
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <div className="app-bg" />
      <div className="glass w-full max-w-sm rounded-3xl p-8 shadow-soft">
        {step === "auth" ? (
          <Link
            href="/welcome"
            className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
        ) : (
          <button
            onClick={() => {
              setStep("auth");
              reset();
            }}
            className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}

        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-bg shadow-glow">
            {step === "sent" ? (
              <MailCheck className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </span>
          <div>
            <h1 className="font-brush text-2xl lowercase text-fg">
              {step === "sent" ? "check your email" : "we can"}
            </h1>
            <p className="text-xs text-muted">
              {step === "sent"
                ? "Confirm your account to continue"
                : "Your personal operating system"}
            </p>
          </div>
        </div>

        {step === "auth" ? (
          <form onSubmit={submitAuth} className="space-y-3">
            <label className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2.5">
              <Mail className="h-4 w-4 text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2.5">
              <Lock className="h-4 w-4 text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
              />
            </label>

            {mode === "signup" && (
              <label className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2.5">
                <Lock className="h-4 w-4 text-muted" />
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
                />
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-sm text-fg">
              We sent a confirmation link to{" "}
              <span className="font-semibold text-accent">{email}</span>.
            </p>
            <p className="text-xs text-muted">
              Click the link in that email to activate your account, then come
              back and sign in.
            </p>
            <button
              onClick={() => {
                setMode("signin");
                setStep("auth");
                reset();
              }}
              className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            >
              Go to sign in
            </button>
            <button
              type="button"
              onClick={resendLink}
              disabled={loading}
              className="w-full text-center text-xs text-muted hover:text-fg"
            >
              Didn&apos;t get it? Resend link
            </button>
          </div>
        )}

        {msg && <p className="mt-3 text-center text-xs text-accent">{msg}</p>}
        {err && <p className="mt-3 text-center text-xs text-red-500">{err}</p>}

        {step === "auth" && (
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              reset();
              setConfirm("");
            }}
            className="mt-4 w-full text-center text-xs text-muted hover:text-fg"
          >
            {mode === "signin"
              ? "No account? Create one"
              : "Already have an account? Sign in"}
          </button>
        )}

        {!configured && (
          <p className="mt-4 rounded-xl bg-surface/60 p-3 text-center text-[11px] text-muted">
            Demo mode — connect Supabase in <code>.env.local</code> to enable login.
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <LoginForm />
    </Suspense>
  );
}
