export async function POST(req: Request) {
  try {
    const { nombre, email, mensaje } = await req.json();

    if (!nombre || !email || !mensaje) {
      return Response.json(
        { ok: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Validación simple de email
    if (!/.+@.+\..+/.test(email)) {
      return Response.json(
        { ok: false, error: "Email inválido" },
        { status: 400 }
      );
    }

    // Aquí podrías enviar un correo, guardar en BD, o enviar a una cola.
    // Por ahora, simulamos éxito.

    return Response.json({ ok: true }, { status: 200 });
  } catch (e) {
    return Response.json(
      { ok: false, error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}