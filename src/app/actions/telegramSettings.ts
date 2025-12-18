"use server";

import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type TelegramSettings = {
  botToken: string;
  chatId: string;
};

async function readTelegramFile(): Promise<TelegramSettings | null> {
  const { data, error } = await supabaseAdmin
    .from("telegram_settings")
    .select("bot_token, chat_id")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Supabase readTelegramFile error:", error.message);
    return null;
  }

  if (!data) return null;

  return {
    botToken: data.bot_token,
    chatId: data.chat_id,
  };
}

async function writeTelegramFile(settings: TelegramSettings) {
  const { error } = await supabaseAdmin.from("telegram_settings").upsert(
    {
      id: 1,
      bot_token: settings.botToken,
      chat_id: settings.chatId,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("Supabase writeTelegramFile error:", error.message);
  }
}

export async function getTelegramSettings(): Promise<TelegramSettings | null> {
  // читать может и публичный код, поэтому без проверки авторизации
  return readTelegramFile();
}

export async function updateTelegramSettings(settings: TelegramSettings) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  await writeTelegramFile(settings);
  return { success: true };
}


