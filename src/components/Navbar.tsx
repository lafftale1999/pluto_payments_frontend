
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "./Logout";

const nav = [
  { href: "/app/invoices", label: "Invoices" },
  { href: "/app/transactions", label: "Transactions" },
  { href: "/app/card", label: "Card" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full rounded-2xl border border-primary/10 bg-accent/60 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <Link href="/app" className="flex items-center gap-2">
          <Image
            src="/image.png"
            alt="Logo"
            width={160}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "text-base font-semibold transition",
                    active
                      ? "text-primary underline underline-offset-8"
                      : "text-primary/80 hover:text-primary",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/app/account"
            className="rounded-xl border border-primary/10 px-3 py-1.5 text-sm font-medium text-primary/90 hover:bg-secondary hover:text-primary transition"
          >
            Your account
          </Link>
          <Logout></Logout>
        </div>

        {/* Simple mobile label (keep minimal) */}
        <div className="md:hidden">
          <Link
            href="/app/account"
            className="text-sm font-semibold text-primary/90"
          >
            Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
