"use server";

import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";

const telegramFilePath = path.join(process.cwd(), "src/data/telegram-settings.json");

export type TelegramSettings = {
  botToken: string;
  chatId: string;
};

async function readTelegramFile(): Promise<TelegramSettings | null> {
  try {
    const file = await fs.readFile(telegramFilePath, "utf8");
    const data = JSON.parse(file);
    if (data && typeof data.botToken === "string" && typeof data.chatId === "string") {
      return { botToken: data.botToken, chatId: data.chatId };
    }
    return null;
  } catch {
    return null;
  }
}

async function writeTelegramFile(settings: TelegramSettings) {
  const toWrite = JSON.stringify(settings, null, 2);
  await fs.writeFile(telegramFilePath, toWrite, "utf8");
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


