"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, Loader2, AlertCircle } from "lucide-react";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Login failed (${res.status})`);
      }
      // Hard nav so the middleware re-evaluates with the new cookie set.
      window.location.href = from || "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-md bg-bg-panel border border-border flex items-center justify-center">
            <span className="text-accent font-bold text-xl">aws</span>
          </div>
          <div>
            <div className="text-base font-semibold">SAA Learning App</div>
            <div className="text-[11px] text-text-muted">
              Solutions Architect Associate
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-border bg-bg-panel/80 p-6 space-y-4 shadow-2xl"
        >
          <h1 className="text-lg font-semibold text-text-primary">Sign in</h1>
          <p className="text-[12px] text-text-muted -mt-1">
            Your progress is tracked per user, across devices.
          </p>

          <label className="block">
            <span className="text-[11px] uppercase tracking-wide text-text-muted">
              Username
            </span>
            <div className="relative mt-1">
              <User
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                spellCheck={false}
                required
                className="w-full pl-9 pr-3 py-2 rounded-md bg-bg-base border border-border focus:border-accent focus:outline-none text-sm"
                placeholder="username"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-wide text-text-muted">
              Password
            </span>
            <div className="relative mt-1">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full pl-9 pr-3 py-2 rounded-md bg-bg-base border border-border focus:border-accent focus:outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[12px] text-danger"
            >
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent text-bg-base font-semibold py-2 text-sm hover:bg-accent-hover transition-colors disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>

          <div className="text-[11px] text-text-muted text-center pt-1">
            Need access? Ask an admin to seed your account.
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-text-muted">
          Loading…
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
