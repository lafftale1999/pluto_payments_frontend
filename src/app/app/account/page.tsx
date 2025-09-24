// app/account/page.tsx
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import api from "@/lib/axios";
import Link from "next/link";

type AccountInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNum: string;
};

function Card({
  title,
  children,
  footer,
}: {
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-primary/10 bg-secondary/70 p-5 shadow-md backdrop-blur">
      <h2 className="mb-3 text-center text-xl font-bold text-primary">{title}</h2>
      <div className="flex-1 text-primary/90">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </section>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-primary/80">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function AccountPage() {

  const { data, isLoading, isError } = useQuery<AccountInfo>({
    queryKey: ["accountInfo"],
    queryFn: () => api.getMain(),
  });

  const [email, setEmail] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data?.email) setEmail(data.email);
  }, [data?.email]);

  const mutation = useMutation({
    mutationFn: () => api.changePassword({ email, oldPassword, newPassword }),
    onMutate: () => {
      setFormError(null);
      setFormSuccess(null);
    },
    onSuccess: (res) => {
      setFormSuccess(typeof res === "string" ? res : "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data ??
        err?.message ??
        "Something went wrong while changing password.";
      setFormError(String(msg));
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !oldPassword || !newPassword) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (newPassword === oldPassword) {
      setFormError("New password must be different from old password.");
      return;
    }
    mutation.mutate();
  };

  const welcomeName = isLoading
    ? "Welcome ..."
    : data
    ? `Welcome, ${data.firstName}!`
    : "Welcome";

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 w-full">
        <h1 className="text-2xl font-bold text-primary">{welcomeName}</h1>
      </div>

      <div className="grid w-full gap-6 md:grid-cols-2">
        <Card
          title="Personal information"
          footer={
            <div className="flex justify-center">
              <Link
                href="/app"
                className="rounded-xl border border-primary/10 bg-accent/50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-accent"
              >
                Back to dashboard
              </Link>
            </div>
          }
        >
          {isLoading ? (
            <div className="h-24 animate-pulse rounded-xl bg-accent/60" />
          ) : isError || !data ? (
            <p className="text-red-600">Could not load account info.</p>
          ) : (
            <ul className="space-y-2">
              <li>
                <span className="font-semibold">Name:</span> {data.firstName} {data.lastName}
              </li>
              <li>
                <span className="font-semibold">Email:</span> {data.email}
              </li>
              <li>
                <span className="font-semibold">Phone:</span> {data.phoneNum}
              </li>
            </ul>
          )}
        </Card>

        <Card title="Change password">
          <form onSubmit={onSubmit}>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                className="w-full rounded-xl border border-primary/20 bg-secondary/70 px-3 py-2 text-primary outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Old password">
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.currentTarget.value)}
                className="w-full rounded-xl border border-primary/20 bg-secondary/70 px-3 py-2 text-primary outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="••••••••"
              />
            </Field>

            <Field label="New password">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
                className="w-full rounded-xl border border-primary/20 bg-secondary/70 px-3 py-2 text-primary outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="••••••••"
              />
            </Field>

            {formError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {formSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl border border-primary/10 bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "Changing..." : "Change password"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
