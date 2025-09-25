"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/axios";

type Tx = {
  transactionId: number;
  deviceCompanyName: string;
  transactionDate: string; 
  transactionCost: number;
};

type Card = {
  cardNum: string;
  expiryDate: string; 
  active: boolean;
};

type InvoiceDTO = {
  invoiceDate: string; 
  status: string;
  sum: number;
};

type MainResponse = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNum: string;
  points: number;
  creditLimit: number;
  creditUsed: number;
  balance?: number; 
  card?: Card;
  invoiceDTOs?: InvoiceDTO[];
  transactions?: Tx[];
};

function CardShell({
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
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 w-full rounded-2xl border border-primary/10 bg-accent/50 p-6 shadow-md backdrop-blur">
      <h1 className="mb-4 text-center text-3xl font-extrabold text-primary">{title}</h1>
      {children}
    </section>
  );
}

function SkeletonCard() {
  return <div className="h-48 animate-pulse rounded-2xl bg-accent/60" />;
}

const fmtSEK = (n: number | undefined) =>
  typeof n === "number"
    ? new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n)
    : "-";

const fmtDate = (iso: string | undefined) =>
  iso ? new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "long", day: "2-digit" }).format(new Date(iso)) : "-";

export default function AppPage() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.getMain(), 
  });

  const payload: MainResponse | undefined = (data && (data.data ?? data)) as MainResponse | undefined;

  const firstName = payload?.firstName ?? "";
  const fullName = payload ? `${payload.firstName} ${payload.lastName}`.trim() : "";
  const displayName = isSuccess ? (fullName || payload?.email || "Welcome") : "Welcome";

  const creditUsed = payload?.creditUsed ?? 0;
  const creditLimit = payload?.creditLimit ?? 0;
  const creditAvailable = payload?.balance ?? Math.max(creditLimit - creditUsed, 0);

  const points = payload?.points ?? 0;

  const invoices = payload?.invoiceDTOs ?? [];
  const latestInvoice =
    invoices.length > 0
      ? [...invoices].sort(
          (a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
        )[0]
      : undefined;

  const txs = payload?.transactions ?? [];

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 w-full">
        <h1 className="text-2xl font-bold text-primary">
          {isLoading ? "Welcome ..." : `Welcome, ${firstName || displayName}!`}
        </h1>
      </div>

      <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <CardShell
              title={`${displayName}'s Credit`}
              footer={
                <div className="flex justify-center">
                  <Link
                    href="/app/card"
                    className="rounded-xl border border-primary/10 bg-accent/50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-accent"
                  >
                    Card information
                  </Link>
                </div>
              }
            >
              <div className="space-y-1 text-primary/90">
                <p>
                  Credit available: <span className="font-semibold">{fmtSEK(creditAvailable)}</span>
                </p>
                <p>
                  Credit spent: <span className="font-semibold">{fmtSEK(creditUsed)}</span>
                </p>
                <p>
                  Credit limit: <span className="font-semibold">{fmtSEK(creditLimit)}</span>
                </p>
              </div>
            </CardShell>

            <CardShell
              title={`${displayName}'s Points`}
              footer={
                <div className="flex justify-center">
                  <Link
                    href="/app/rewards"
                    className="rounded-xl border border-primary/10 bg-accent/50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-accent"
                  >
                    Rewards
                  </Link>
                </div>
              }
            >
              <p className="text-primary/90">
                Pluto points: <span className="font-semibold">{new Intl.NumberFormat("sv-SE").format(points)}</span>
              </p>
            </CardShell>

            <CardShell
              title={`${displayName}'s Invoices`}
              footer={
                <div className="flex justify-center">
                  <Link
                    href="/app/invoices"
                    className="rounded-xl border border-primary/10 bg-accent/50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-accent"
                  >
                    All invoices
                  </Link>
                </div>
              }
            >
              {latestInvoice ? (
                <div className="space-y-1 text-primary/90">
                  <p>Latest invoice date: <span className="font-semibold">{fmtDate(latestInvoice.invoiceDate)}</span></p>
                  <p>Status: <span className="font-semibold">{latestInvoice.status}</span></p>
                  <p>Amount: <span className="font-semibold">{fmtSEK(latestInvoice.sum)}</span></p>
                </div>
              ) : (
                <p className="text-primary/60">No invoices found.</p>
              )}
            </CardShell>
          </>
        )}
      </div>

      <Section title="Transactions">
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-xl bg-accent/60" />
        ) : txs.length === 0 ? (
          <p className="text-center text-primary/60">No transactions found.</p>
        ) : (
          <div className="divide-y divide-primary/10 text-primary/90">
            {txs.map((t) => (
              <div key={t.transactionId} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary/60">
                    {t.deviceCompanyName}
                  </p>
                  <p className="font-medium">{fmtDate(t.transactionDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm uppercase tracking-wide text-primary/60">Price</p>
                  <p className="font-semibold">{fmtSEK(t.transactionCost)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
