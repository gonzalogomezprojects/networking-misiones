import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: object, expiresIn: string = "7d") {
  const secret = env.AUTH_SECRET || "dev-secret";
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string) {
  const secret = env.AUTH_SECRET || "dev-secret";
  return jwt.verify(token, secret);
}