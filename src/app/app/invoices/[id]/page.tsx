
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/axios";

const fmtSEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(n);

const fmtDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "-"
    : new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "long", day: "2-digit" }).format(d);
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const idParam = params?.id as string | string[] | undefined;
  const invoiceId = Array.isArray(idParam) ? idParam[0] : idParam; 

  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => api.getInvoiceById(invoiceId!), 
    enabled: !!invoiceId,
  });

  const inv: any = data && (data as any).data ? (data as any).data : data;

  const transactions: any[] = Array.isArray(inv?.transactions) ? inv.transactions : [];

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-primary">
          {isLoading ? "Laddar faktura..." : `Faktura #${invoiceId ?? "-"}`}
        </h1>
        <Link
          href="/app/invoices"
          className="rounded-xl border border-primary/10 bg-accent/50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-accent"
        >
          Tillbaka
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-primary/10 bg-secondary/70 p-4">
          <p className="text-sm text-primary/60">Fakturadatum</p>
          <p className="text-2xl font-bold text-primary">
            {isLoading ? "…" : fmtDate(inv?.invoiceDate)}
          </p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-secondary/70 p-4">
          <p className="text-sm text-primary/60">Status</p>
          <p className="text-2xl font-bold text-primary">
            {isLoading ? "…" : String(inv?.status ?? "-")}
          </p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-secondary/70 p-4">
          <p className="text-sm text-primary/60">Belopp</p>
          <p className="text-2xl font-bold text-primary">
            {isLoading ? "…" : typeof inv?.sum === "number" ? fmtSEK(inv.sum) : "-"}
          </p>
        </div>
      </div>

      {isError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Kunde inte ladda faktura.
        </div>
      )}
      {!isLoading && !isError && !inv && (
        <div className="mb-4 rounded-xl border border-primary/10 bg-accent/40 p-4 text-primary/70">
          Ingen faktura hittades.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-secondary/70">
        <div className="grid grid-cols-12 border-b border-primary/10 bg-accent/40 px-4 py-3 text-sm font-semibold text-primary">
          <div className="col-span-3">Transaktions-ID</div>
          <div className="col-span-5">Företag</div>
          <div className="col-span-2">Datum</div>
          <div className="col-span-2 text-right">Belopp</div>
        </div>

        {isLoading ? (
          <div className="h-40 animate-pulse bg-accent/50" />
        ) : transactions.length === 0 ? (
          <div className="p-4 text-primary/60">Inga transaktioner på denna faktura.</div>
        ) : (
          <ul className="divide-y divide-primary/10">
            {transactions.map((t: any, i: number) => (
              <li key={t?.transactionId ?? `t-${i}`} className="grid grid-cols-12 px-4 py-3 text-primary/90">
                <div className="col-span-3 font-mono">{t?.transactionId ?? "-"}</div>
                <div className="col-span-5">{t?.deviceCompanyName ?? "-"}</div>
                <div className="col-span-2">{fmtDate(t?.transactionDate)}</div>
                <div className="col-span-2 text-right font-semibold">
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
