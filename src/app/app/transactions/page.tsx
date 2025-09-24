
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import React from "react";

const fmtSEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(n);

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "-"
    : new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
};

export default function TransactionsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transactions"],
    queryFn: api.getMain, 
  });

  const payload = (data && (data as any).data) ? (data as any).data : data;

  const txs: any[] = Array.isArray((payload as any)?.transactions)
    ? (payload as any).transactions
    : [];

  const sorted = txs.slice().sort((a, b) => {
    const ta = new Date(a?.transactionDate ?? 0).getTime();
    const tb = new Date(b?.transactionDate ?? 0).getTime();
    return tb - ta;
  });

  const total = sorted.reduce((sum, t) => sum + (Number(t?.transactionCost) || 0), 0);

  return (
    <div className="w-full">
      <h1 className="mb-6 text-3xl font-extrabold text-primary">Transactions</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-primary/10 bg-secondary/70 p-4">
          <p className="text-sm text-primary/60">Total transactions</p>
          <p className="text-2xl font-bold text-primary">{isLoading ? "…" : sorted.length}</p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-secondary/70 p-4">
          <p className="text-sm text-primary/60">Total spent</p>
          <p className="text-2xl font-bold text-primary">{isLoading ? "…" : fmtSEK(total)}</p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-secondary/70 p-4">
          <p className="text-sm text-primary/60">Latest</p>
          <p className="text-2xl font-bold text-primary">
            {isLoading || sorted.length === 0 ? "—" : fmtDate(sorted[0]?.transactionDate)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-secondary/70">
        <div className="grid grid-cols-12 border-b border-primary/10 bg-accent/40 px-4 py-3 text-sm font-semibold text-primary">
          <div className="col-span-2">Transaction ID</div>
          <div className="col-span-4">Company</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-3 text-right">Amount</div>
        </div>

        {isLoading ? (
          <div className="h-40 animate-pulse bg-accent/50" />
        ) : isError ? (
          <div className="p-4 text-red-600">Could not load transactions.</div>
        ) : sorted.length === 0 ? (
          <div className="p-4 text-primary/60">No transactions found.</div>
        ) : (
          <ul className="divide-y divide-primary/10">
            {sorted.map((t, i) => (
              <li
                key={t?.transactionId ?? `tx-${i}`}
                className="grid grid-cols-12 px-4 py-3 text-primary/90"
              >
                <div className="col-span-2 font-mono">{t?.transactionId ?? "-"}</div>
                <div className="col-span-4">{t?.deviceCompanyName ?? "-"}</div>
                <div className="col-span-3">{fmtDate(t?.transactionDate ?? "")}</div>
                <div className="col-span-3 text-right font-semibold">
                  {typeof t?.transactionCost === "number" ? fmtSEK(t.transactionCost) : "-"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
