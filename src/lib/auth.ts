import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
const ENV_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ENV_USERNAME = process.env.ADMIN_USERNAME || "admin";

interface AdminAuthData {
  username: string;
  password: string;
}

async function readStoredAuth(): Promise<AdminAuthData | null> {
  const { data, error } = await supabaseAdmin
    .from("admin_auth")
    .select("username, password")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Supabase readStoredAuth error:", error.message);
    return null;
  }

  if (!data) return null;

  return {
    username: data.username || ENV_USERNAME,
    password: data.password || ENV_PASSWORD,
  };
}

async function writeStoredAuth(authData: Partial<AdminAuthData>) {
  const current = await readStoredAuth();
  const { error } = await supabaseAdmin.from("admin_auth").upsert(
    {
      id: 1,
      username: authData.username ?? current?.username ?? ENV_USERNAME,
      password: authData.password ?? current?.password ?? ENV_PASSWORD,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("Supabase writeStoredAuth error:", error.message);
  }
}

async function getCurrentAuth(): Promise<AdminAuthData> {
  const stored = await readStoredAuth();
  return stored || { username: ENV_USERNAME, password: ENV_PASSWORD };
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const current = await getCurrentAuth();
  return username === current.username && password === current.password;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const current = await getCurrentAuth();
  return password === current.password;
}

export async function updatePassword(newPassword: string) {
  await writeStoredAuth({ password: newPassword });
}

export async function updateUsername(newUsername: string) {
  await writeStoredAuth({ username: newUsername });
}

export async function getCurrentUsername(): Promise<string> {
  const current = await getCurrentAuth();
  return current.username;
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

