"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { User } from "@/types/user";
import type { Customer } from "@/types/customer";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  const base = "px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10";
  const activeCls = active ? "font-medium underline" : "";
  return (
    <Link href={href} className={`${base} ${activeCls}`} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const pathname = usePathname();

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
      setCustomer(null);
      // Forzar recarga para que el layout y el proxy reflejen el estado
      window.location.assign("/");
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (data?.ok && data.user) {
            setUser(data.user);
            setCustomer(data.customer ?? null);
            return;
          }
        }
        setUser(null);
        setCustomer(null);
      } catch {
        // En caso de error de red, asumimos no autenticado sin romper la UI
        if (!mounted) return;
        setUser(null);
        setCustomer(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-black/10 dark:border-white/15">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
        <Image src="/assets/logo.jpg" alt="Networking Misiones" width={28} height={28} priority />
          <span className="text-lg font-semibold tracking-tight text-brand">Networking Misiones</span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="flex gap-2 text-sm">
            <NavLink href="/">Inicio</NavLink>
            {user && (
              <>
                <NavLink href="/profile">Perfil</NavLink>
                <NavLink href="/dashboard">Dashboard</NavLink>
              </>
            )}
            {!user && <NavLink href="/login">Iniciar sesión</NavLink>}
          </nav>
          {user && (
            <div className="flex items-center gap-2 text-sm">
              <div className="size-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs font-medium">
                {(customer?.firstName?.[0] ?? user.email[0]).toUpperCase()}
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-muted">
                  {customer ? `${customer.firstName} ${customer.lastName}` : user.email}
                </span>
                <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                  {user.role}
                </span>
                <button onClick={logout} className="px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10">
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-brand/0 via-brand/60 to-brand/0" />
    </header>
  );
}