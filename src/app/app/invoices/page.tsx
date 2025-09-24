
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import React from "react";

const fmtSEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "-"
    : new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "long", day: "2-digit" }).format(d);
};

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-secondary/70 p-4">
      <p className="text-sm text-primary/60">{label}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

export default function InvoicesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoices"],
    queryFn: api.getMain,
  });

  const payload: any = data && (data as any).data ? (data as any).data : data;

  const invoices: any[] = Array.isArray(payload?.invoiceDTOs) ? payload.invoiceDTOs : [];

  const sorted = invoices
    .slice()
    .sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());

  const latest = sorted[0];
  const totalSum = sorted.reduce((sum, inv) => sum + (Number(inv?.sum) || 0), 0);

  return (
    <div className="w-full">
      <h1 className="mb-2 text-3xl font-extrabold text-primary">Invoices</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Antal fakturor" value={isLoading ? "…" : sorted.length} />
        <StatCard label="Totalsumma" value={isLoading ? "…" : fmtSEK(totalSum)} />
        <StatCard label="Senaste faktura" value={isLoading || !latest ? "—" : fmtDate(latest.invoiceDate)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-secondary/70">
        <div className="grid grid-cols-12 border-b border-primary/10 bg-accent/40 px-4 py-3 text-sm font-semibold text-primary">
          <div className="col-span-4">Fakturadatum</div>
          <div className="col-span-4">Status</div>
          <div className="col-span-4 text-right">Belopp</div>
        </div>

        {isLoading ? (
          <div className="h-40 animate-pulse bg-accent/50" />
        ) : isError ? (
          <div className="p-4 text-red-600">Kunde inte ladda fakturor.</div>
        ) : sorted.length === 0 ? (
          <div className="p-4 text-primary/60">Inga fakturor hittades.</div>
        ) : (
          <ul className="divide-y divide-primary/10">
            {sorted.map((inv, i) => (
              <li key={`${inv?.invoiceDate ?? "inv"}-${inv?.status ?? "st"}-${i}`} className="grid grid-cols-12 px-4 py-3 text-primary/90">
                <div className="col-span-4">{fmtDate(inv?.invoiceDate)}</div>
                <div className="col-span-4">
                  <span className="inline-block rounded-xl border border-primary/20 bg-accent/50 px-2 py-1 text-xs font-semibold">
                    {String(inv?.status ?? "-")}
                  </span>
                </div>
                <div className="col-span-4 text-right font-semibold">
                  {typeof inv?.sum === "number" ? fmtSEK(inv.sum) : "-"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
