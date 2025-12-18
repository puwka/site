"use server";

import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function updatePageText(key: string, text: string) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const { error } = await supabaseAdmin.from("page_texts").upsert(
    {
      key,
      text,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("Supabase updatePageText error:", error.message);
    return { success: false };
  }

  return { success: true };
}

export async function getPageText(key: string): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("page_texts")
    .select("text")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error("Supabase getPageText error:", error.message);
    return "";
  }

  return data?.text ?? "";
}

