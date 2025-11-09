"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";
import type { Customer } from "@/types/customer";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [saving, setSaving] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          setError("No se pudo cargar el perfil");
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

  useEffect(() => {
    if (customer) {
      setCompany(customer.company ?? "");
      setWebsite(customer.website ?? "");
    }
  }, [customer]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    setSaveError(null);
    try {
      const res = await fetch("/api/customer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, website }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setSaving("error");
        setSaveError(data?.error ?? "Error guardando cambios");
        return;
      }
      setCustomer(data.customer);
      setSaving("ok");
    } catch (e) {
      setSaving("error");
      setSaveError("Error de red");
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
    }
  }

  if (loading) return <div className="px-6 py-16">Cargando…</div>;
  if (error) return <div className="px-6 py-16 text-red-600">{error}</div>;
  if (!user) return <div className="px-6 py-16">No hay datos.</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Perfil</h1>
      <p className="mt-2 text-muted">Gestioná tus datos y sesión.</p>
      <div className="mt-6 grid gap-4">
        <div className="rounded-xl border border-border bg-card text-card-foreground p-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-sm font-medium">
              {(customer?.firstName?.[0] ?? user.email[0]).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium">{customer ? `${customer.firstName} ${customer.lastName}` : user.email}</p>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span className="text-muted">{user.email}</span>
                <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={onSave} className="rounded-xl border border-border bg-card text-card-foreground p-6 space-y-4">
          <h2 className="text-lg font-medium">Datos del cliente</h2>
          <div>
            <label htmlFor="company" className="block text-sm font-medium">Empresa</label>
            <input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-white dark:bg-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="Tu empresa (opcional)"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium">Sitio web</label>
            <input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-white dark:bg-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="https://tu-sitio.com (opcional)"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving === "saving"}
              className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {saving === "saving" ? "Guardando…" : "Guardar cambios"}
            </button>
            {saving === "ok" && <span className="text-sm text-green-600">Guardado</span>}
            {saving === "error" && <span className="text-sm text-red-600">{saveError}</span>}
          </div>
        </form>
        <div className="flex">
          <button
            onClick={logout}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 w-fit"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}