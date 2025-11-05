import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function verifyJWT(token: string) {
  const secret = process.env.AUTH_SECRET || "dev-secret";
  const encoder = new TextEncoder();
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return payload as { sub?: string; role?: "USER" | "ADMIN" };
  } catch {
    return null;
  }
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProfile = pathname.startsWith("/profile");
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  // Permitimos el acceso a /login y /register aunque exista token.

  if (isProfile || isDashboard || isAdmin) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    const payload = await verifyJWT(token);
    if (!payload?.sub) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (isAdmin && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/dashboard", "/admin", "/login", "/register"],
};