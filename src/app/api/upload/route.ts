import { NextRequest, NextResponse } from "next/server";

// В продакшене загрузка файлов через этот эндпоинт отключена.
// Локально можно позже переписать на Supabase Storage.

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Загрузка файлов через /api/upload отключена в текущей версии. Используйте URL‑картинок или локальную админку.",
    },
    { status: 405 }
  );
}

