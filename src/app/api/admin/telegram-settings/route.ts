import { NextResponse } from "next/server";
import { getTelegramSettings } from "@/app/actions/telegramSettings";

export async function GET() {
  const settings = await getTelegramSettings();
  return NextResponse.json(settings);
}


