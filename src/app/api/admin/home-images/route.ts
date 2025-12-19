import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Увеличиваем лимит размера тела запроса до 10MB
export const runtime = "nodejs";
export const maxDuration = 30;

const HOME_ID = 1;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const field = formData.get("field");

    if (!(file instanceof File) || typeof field !== "string") {
      return NextResponse.json(
        { success: false, message: "Некорректные данные" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Недопустимый тип файла" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "Файл слишком большой. Максимальный размер — 5МБ." },
        { status: 400 }
      );
    }

    const safeField = field === "heroBg" || field === "aboutBg" ? field : "image";
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${safeField}-${Date.now()}.${ext}`;
    const filepath = `home-images/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Загружаем в Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("uploads")
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      return NextResponse.json(
        { 
          success: false, 
          message: `Ошибка загрузки файла в хранилище: ${uploadError.message || JSON.stringify(uploadError)}` 
        },
        { status: 500 }
      );
    }

    // Получаем публичный URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("uploads").getPublicUrl(filepath);

    // Обновляем images в таблице home_admin
    const { data: currentData } = await supabaseAdmin
      .from("home_admin")
      .select("images")
      .eq("id", HOME_ID)
      .maybeSingle();

    const currentImages = currentData?.images || {};
    const updatedImages = {
      ...currentImages,
      [safeField]: publicUrl,
    };

    const { error: updateError } = await supabaseAdmin
      .from("home_admin")
      .upsert(
        {
          id: HOME_ID,
          images: updatedImages,
        },
        { onConflict: "id" }
      );

    if (updateError) {
      console.error("Supabase update images error:", updateError);
      return NextResponse.json(
        { success: false, message: "Ошибка обновления данных" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Ошибка загрузки файла: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}


