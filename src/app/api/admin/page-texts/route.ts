import { NextRequest, NextResponse } from "next/server";
import { updatePageText, getPageText } from "@/app/actions/adminPages";

export async function GET(request: NextRequest) {
  // чтение публичное, без строгой авторизации, используется для фронта
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const text = await getPageText(key);
  return NextResponse.json({ key, text });
}

export async function POST(request: NextRequest) {
  // авторизация и проверка прав происходит внутри server action `updatePageText`
  const { key, text } = await request.json();
  if (!key || typeof text !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 }
    );
  }

  const result = await updatePageText(key, text);
  return NextResponse.json(result);
}


