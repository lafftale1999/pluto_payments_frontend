"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

type Tx = {
  transactionId: number;
  deviceCompanyName: string;
  transactionDate: string; 
  transactionCost: number; 
};

type CardResponse = {
  active: boolean;
  cardNum: string;
  expiryDate: string; 
  transactions: Tx[];
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(
    new Date(iso)
  );

const fmtMoney = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(
    n
  );


const maskCard = (num: string) => {
  const parts = num.split(" ");
  if (parts.length < 4) return num;
  return `${parts[0]} ${parts[1]} •• ••`;
};

function SkeletonCard() {
  return <div className="h-48 animate-pulse rounded-2xl bg-accent/60" />;
}

export default function CardPage() {
  const { data, isLoading, isSuccess } = useQuery<CardResponse>({
    queryKey: ["card"],
    queryFn: () => api.getCard(),
  });

  return (
    <div className="flex flex-col gap-8">

      
      <section className="rounded-2xl border border-primary/10 bg-secondary/70 p-6 shadow-md backdrop-blur">
        {isLoading ? (
          <SkeletonCard />
        ) : isSuccess ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative rounded-2xl bg-gradient-to-tr from-accent to-secondary p-5 shadow-inner">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary/80">Pluto • Credit</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      data.active
                        ? "bg-green-500/15 text-green-600"
                        : "bg-red-500/15 text-red-600"
                    }`}
                  >
                    {data.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mb-4 font-mono text-2xl tracking-widest text-primary">
                  {maskCard(data.cardNum)}
                </p>

                <div className="flex items-center justify-between text-primary/80">
                  <div>
                    <p className="text-xs uppercase tracking-wider">Expires</p>
                    <p className="text-sm font-semibold">
                      {fmtDate(data.expiryDate)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/10 bg-accent/40 px-3 py-1.5 text-xs font-semibold text-primary">
                    Virtual • Secure
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-primary/10 bg-accent/40 p-4">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary">Card details</h3>
                <div className="text-sm text-primary/80">
                  <p className="mb-1">Card number</p>
                  <p className="font-mono text-primary">{data.cardNum}</p>
                </div>
                <div className="text-sm text-primary/80">
                  <p className="mb-1">Status</p>
                  <p className="font-semibold text-primary">{data.active ? "Active" : "Inactive"}</p>
                </div>
                <div className="text-sm text-primary/80">
                  <p className="mb-1">Expiry</p>
                  <p className="font-semibold text-primary">{fmtDate(data.expiryDate)}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="w-full rounded-xl border border-primary/10 bg-accent/50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-accent">
                  Freeze card
                </button>
                <button className="w-full rounded-xl border border-primary/10 bg-accent/50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-accent">
                  Replace card
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-primary/10 bg-accent/50 p-6 shadow-md backdrop-blur">
        <h2 className="mb-4 text-center text-2xl font-extrabold text-primary">Recent transactions</h2>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-12 animate-pulse rounded-xl bg-secondary/60" />
            <div className="h-12 animate-pulse rounded-xl bg-secondary/60" />
            <div className="h-12 animate-pulse rounded-xl bg-secondary/60" />
          </div>
        ) : isSuccess && data.transactions?.length ? (
          <div className="overflow-hidden rounded-xl border border-primary/10">
            <table className="min-w-full divide-y divide-primary/10">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary/70">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary/70">
                    Merchant
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-primary/70">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10 bg-secondary/40">
                {data.transactions.map((t) => (
                  <tr key={t.transactionId} className="hover:bg-secondary/60">
                    <td className="px-4 py-3 text-sm text-primary">{fmtDate(t.transactionDate)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-primary">{t.deviceCompanyName}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-primary">{fmtMoney(t.transactionCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-primary/70">No transactions found.</p>
        )}
      </section>
    </div>
  );
}
