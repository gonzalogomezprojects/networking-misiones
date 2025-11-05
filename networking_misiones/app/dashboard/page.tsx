"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@/types/user";
import type { Customer } from "@/types/customer";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          setError("No se pudo cargar el usuario");
          setLoading(false);
          return;
        }
        setUser(data.user);
        setCustomer(data.customer ?? null);
      } catch (e) {
        setError("Error de red");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="px-6 py-16">Cargando…</div>;
  if (error) return <div className="px-6 py-16 text-red-600">{error}</div>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-muted">
            Hola {(customer ? `${customer.firstName} ${customer.lastName}` : user?.email)}
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted">{user?.role}</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/profile" className="rounded-xl border border-border bg-card p-6 hover:bg-black/5 dark:hover:bg-white/10">
          <h3 className="font-medium">Perfil</h3>
          <p className="mt-1 text-sm text-muted">Gestioná tus datos y sesión.</p>
        </Link>
        <Link href="/" className="rounded-xl border border-border bg-card p-6 hover:bg-black/5 dark:hover:bg-white/10">
          <h3 className="font-medium">Inicio</h3>
          <p className="mt-1 text-sm text-muted">Volver a la página principal.</p>
        </Link>
      </div>
    </div>
  );
}