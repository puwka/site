import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Увеличиваем лимит размера тела запроса до 10MB
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // Проверяем, что переменные окружения установлены
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase env vars missing");
    return NextResponse.json(
      { 
        success: false,
        error: "Конфигурация Supabase не настроена. Проверьте переменные окружения." 
      },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Файл не передан" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Недопустимый тип файла. Разрешены JPEG, PNG, WebP и GIF.",
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Файл слишком большой. Максимальный размер — 5МБ." },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filepath = `uploads/${filename}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Загружаем в Supabase Storage (bucket должен называться "uploads" и быть публичным)
    console.log("Uploading to Supabase Storage:", { filepath, size: buffer.length, type: file.type });
    
    const { data, error } = await supabaseAdmin.storage
      .from("uploads")
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage upload error:", error);
      return NextResponse.json(
        { 
          success: false,
          error: `Ошибка загрузки файла в хранилище: ${error.message || JSON.stringify(error)}. Убедитесь, что bucket "uploads" создан и публичный.` 
        },
        { status: 500 }
      );
    }

    console.log("File uploaded successfully:", data);

    // Получаем публичный URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("uploads").getPublicUrl(filepath);

    console.log("Public URL:", publicUrl);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false,
        error: `Ошибка загрузки файла: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}

