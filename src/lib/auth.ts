import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";

const ADMIN_AUTH_FILE = path.join(process.cwd(), "src/data/admin-auth.json");
const ENV_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function readStoredPassword(): Promise<string | null> {
  try {
    const raw = await fs.readFile(ADMIN_AUTH_FILE, "utf8");
    const parsed = JSON.parse(raw) as { password?: string };
    return typeof parsed.password === "string" && parsed.password.length > 0
      ? parsed.password
      : null;
  } catch {
    return null;
  }
}

async function writeStoredPassword(password: string) {
  await fs.mkdir(path.dirname(ADMIN_AUTH_FILE), { recursive: true });
  const data = { password };
  await fs.writeFile(ADMIN_AUTH_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function getCurrentPassword(): Promise<string> {
  const stored = await readStoredPassword();
  return stored || ENV_PASSWORD;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const current = await getCurrentPassword();
  return password === current;
}

export async function updatePassword(newPassword: string) {
  await writeStoredPassword(newPassword);
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth");
  return authCookie?.value === "authenticated";
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
}

