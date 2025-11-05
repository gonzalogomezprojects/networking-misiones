import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const normEmail = String(email).toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normEmail } });
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(String(password), user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const token = signToken({ sub: user.id, role: user.role });
    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
    const host = (req as any).headers.get("host") || "";
    const isLocal = /localhost|127\.0\.0\.1/.test(host);
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: !isLocal && process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Error en el inicio de sesión" },
      { status: 500 }
    );
  }
}