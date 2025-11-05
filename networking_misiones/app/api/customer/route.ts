import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const cookie = (req as any).headers.get("cookie") || "";
    const tokenMatch = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    const token = tokenMatch?.[1];
    if (!token) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ ok: false, error: "Token inválido" }, { status: 401 });
    }

    const body = await req.json();
    const companyInput = body?.company;
    const websiteInput = body?.website;

    if (companyInput === undefined && websiteInput === undefined) {
      return NextResponse.json(
        { ok: false, error: "Nada para actualizar" },
        { status: 400 }
      );
    }

    const userId = String(decoded.sub);

    const company = companyInput === undefined ? undefined : String(companyInput).trim() || null;
    let website = websiteInput === undefined ? undefined : String(websiteInput).trim() || null;
    if (website) {
      if (!/^https?:\/\//i.test(website)) {
        website = `https://${website}`;
      }
    }

    const existing = await prisma.customer.findUnique({ where: { userId } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Perfil de cliente no encontrado" },
        { status: 404 }
      );
    }

    const updated = await prisma.customer.update({
      where: { userId },
      data: { company, website },
      select: { firstName: true, lastName: true, company: true, website: true, userId: true, id: true }
    });

    return NextResponse.json({ ok: true, customer: updated });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Error actualizando perfil" },
      { status: 500 }
    );
  }
}