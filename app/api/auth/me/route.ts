import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const cookie = (req as any).headers.get("cookie") || "";
    const tokenMatch = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    const token = tokenMatch?.[1];
    if (!token) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: String(decoded.sub) },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    if (!user) return NextResponse.json({ ok: false }, { status: 401 });

    const customer = await prisma.customer.findUnique({
      where: { userId: user.id },
      select: { firstName: true, lastName: true }
    });

    return NextResponse.json({ ok: true, user, customer });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Error" }, { status: 500 });
  }
}