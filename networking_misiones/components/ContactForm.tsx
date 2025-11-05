"use client";

import { useState } from "react";

export default function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validarEmail = (val: string) => /.+@.+\..+/.test(val);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!nombre.trim()) {
      setErrorMsg("Por favor, ingresá tu nombre.");
      return;
    }
    if (!validarEmail(email)) {
      setErrorMsg("Ingresá un email válido.");
      return;
    }
    if (mensaje.trim().length < 10) {
      setErrorMsg("El mensaje debe tener al menos 10 caracteres.");
      return;
    }

    try {
      setEstado("enviando");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error("Error enviando formulario");
      setEstado("ok");
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch (err) {
      setEstado("error");
      setErrorMsg("No pudimos enviar tu mensaje. Intentá más tarde.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="nombre">
          Nombre
        </label>
        <input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1 w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black px-3 py-2"
          placeholder="Tu nombre"
          required
        />
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
        <label className="block text-sm font-medium" htmlFor="mensaje">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="mt-1 w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black px-3 py-2 min-h-32"
          placeholder="Contanos sobre tu idea o cómo te gustaría participar"
          required
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}
      {estado === "ok" && (
        <p className="text-sm text-green-600">¡Gracias! Te contactaremos pronto.</p>
      )}

      <button
        disabled={estado === "enviando"}
        className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
        type="submit"
      >
        {estado === "enviando" ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}