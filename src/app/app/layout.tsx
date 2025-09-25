
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const res = await fetch("http://localhost:8080/api/auth/me", {
    headers: { cookie: cookies().toString() },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-secondary to-accent/20">
      <header className="sticky top-0 z-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-3">
          <Navbar />
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6">
        {children}
      </main>
    </div>
  );
}
