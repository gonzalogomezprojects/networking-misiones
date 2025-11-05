"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Error");
      setStatus("ok");
      router.push("/dashboard");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "No se pudo iniciar sesión");
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-xl border border-black/10 dark:border-white/15 p-6 bg-white/60 dark:bg-black/40">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
          <p className="text-sm text-green-600">Sesión iniciada correctamente.</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60 w-full"
        >
          {status === "loading" ? "Ingresando…" : "Ingresar"}
        </button>
        <p className="mt-4 text-sm text-center">
          ¿No tenés cuenta? <Link href="/register" className="underline">Registrate</Link>
        </p>
      </form>
      </div>
    </div>
  );
}