"use server";

import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface GlobalSettings {
  phoneNumber: string;
  telegramLink: string;
  whatsappLink: string;
  email: string;
}

export async function updateGlobalSettings(settings: GlobalSettings) {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  // TODO: Save to JSON file or database
  // For now, just return success
  // In production, you would write to a file or database here
  
  return { success: true };
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  // TODO: Read from JSON file or database
  // For now, return default values
  return {
    phoneNumber: "+7 (495) 123-45-67",
    telegramLink: "https://t.me/your_telegram",
    whatsappLink: "https://wa.me/79951234567",
    email: "info@heavyprofile.ru",
  };
}

