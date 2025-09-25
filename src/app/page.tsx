"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const loginUser = useMutation({
    mutationFn: () => api.postLogin({ email, password }),
    onSuccess: () => router.push("/app"),
    onError: (err: any) => {
      console.error(err);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    loginUser.mutate();
  };

  const disabled = loginUser.isPending || !email || !password;
  const serverError =
    (loginUser.error as any)?.response?.data ||
    (loginUser.error as any)?.message ||
    null;

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative hidden items-center justify-center border-r border-primary/10 bg-accent/40 md:flex">
        <Image
          src="/plutocoin.png"
          alt="Spaceman"
          width={800}
          height={900}
          className="drop-shadow-xl"
          priority
        />
      </div>

      <div className="flex items-center justify-center p-6">
        <section className="w-full max-w-md rounded-2xl border border-primary/10 bg-secondary/70 p-6 shadow-md backdrop-blur">
          <div className="mb-6 flex flex-col items-center gap-2">
            <Image
              src="/logo-no-coing.png"
              alt="Pluto"
              width={160}
              height={160}
              className="opacity-90"
              priority
            />
            <h1 className="text-2xl font-bold text-primary">Sign in</h1>
            <p className="text-sm text-primary/60">Welcome back to Pluto</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-primary/80">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-primary/20 bg-secondary/70 px-3 py-2 text-primary outline-none focus:ring-2 focus:ring-primary/40"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary/80">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-primary/20 bg-secondary/70 px-3 py-2 text-primary outline-none focus:ring-2 focus:ring-primary/40"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary/60 hover:text-primary"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {serverError && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
                aria-live="polite"
              >
                {String(serverError)}
              </div>
            )}

            <button
              type="submit"
              disabled={disabled}
              className="w-full rounded-xl border border-primary/10 bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginUser.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
