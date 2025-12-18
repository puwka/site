import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
const ENV_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function readStoredPassword(): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("admin_auth")
    .select("password")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Supabase readStoredPassword error:", error.message);
    return null;
  }

  return data?.password ?? null;
}

async function writeStoredPassword(password: string) {
  const { error } = await supabaseAdmin.from("admin_auth").upsert(
    {
      id: 1,
      password,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("Supabase writeStoredPassword error:", error.message);
  }
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

