import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { ok: false, error: "Email, contraseña, nombre y apellido son obligatorios" },
        { status: 400 }
      );
    }

    const normEmail = String(email).toLowerCase().trim();

    const exists = await prisma.user.findUnique({ where: { email: normEmail } });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(String(password));
    const user = await prisma.user.create({
      data: {
        email: normEmail,
        passwordHash,
      },
      select: { id: true, email: true, role: true },
    });

    await prisma.customer.create({
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        user: { connect: { id: user.id } }
      }
    });

    const token = signToken({ sub: user.id, role: user.role });
    const res = NextResponse.json({ ok: true, user });
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
      { ok: false, error: "Error en el registro" },
      { status: 500 }
    );
  }
}