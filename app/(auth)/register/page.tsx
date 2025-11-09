"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Error");
      setStatus("ok");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "No se pudo registrar");
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-6 bg-white/60 dark:bg-black/40">
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium" htmlFor="firstName">
              Nombre
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black px-3 py-2"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="lastName">
              Apellido
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black px-3 py-2"
              placeholder="Tu apellido"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black px-3 py-2"
            placeholder="tu@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black px-3 py-2"
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {status === "ok" && (
          <p className="text-sm text-green-600">¡Cuenta creada! Ya podés iniciar sesión.</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60 w-full"
        >
          {status === "loading" ? "Creando…" : "Crear cuenta"}
        </button>
        <p className="mt-4 text-sm text-center">
          ¿Ya tenés cuenta? <Link href="/login" className="underline">Iniciar sesión</Link>
        </p>
      </form>
      </div>
    </div>
  );
}