import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Увеличиваем лимит размера тела запроса до 10MB
export const runtime = "nodejs";
export const maxDuration = 30;

// В Next.js App Router лимит body по умолчанию 4.5MB, но для больших файлов
// лучше использовать streaming или увеличить через конфигурацию
export const dynamic = "force-dynamic";

const HOME_ID = 1;

export async function POST(req: NextRequest) {
  // Проверяем переменные окружения
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase env vars missing");
    return NextResponse.json(
      { 
        success: false,
        message: "Конфигурация Supabase не настроена. Проверьте переменные окружения на Vercel." 
      },
      { status: 500 }
    );
  }

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

    // Логируем размер файла для отладки
    console.log(`Received file: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)} MB (${file.size} bytes)`);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Недопустимый тип файла" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "Файл слишком большой. Максимальный размер — 10МБ." },
        { status: 400 }
      );
    }

    const safeField = field === "heroBg" || field === "aboutBg" ? field : "image";
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${safeField}-${Date.now()}.${ext}`;
    const filepath = `home-images/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Uploading to Supabase Storage:", { filepath, size: buffer.length, type: file.type });

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
          message: `Ошибка загрузки файла в хранилище: ${uploadError.message || JSON.stringify(uploadError)}. Убедитесь, что bucket "uploads" создан и публичный.` 
        },
        { status: 500 }
      );
    }

    console.log("File uploaded successfully:", uploadData);

    // Получаем публичный URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("uploads").getPublicUrl(filepath);

    console.log("Public URL:", publicUrl);

    // Обновляем images в таблице home_admin
    console.log("Updating home_admin images...");
    const { data: currentData, error: selectError } = await supabaseAdmin
      .from("home_admin")
      .select("blocks, texts, images")
      .eq("id", HOME_ID)
      .maybeSingle();

    if (selectError) {
      console.error("Supabase select error:", selectError);
      // Если записи нет, создаём с дефолтными значениями
      const defaultBlocks = {
        hero: true,
        heroForm: true,
        services: true,
        about: true,
        howItWorks: true,
        contacts: true,
      };
      const defaultTexts = {
        heroSubtitle: "",
        servicesTitle: "",
        servicesSubtitle: "",
        aboutTitle: "",
        aboutText: "",
        howTitle: "",
        contactsCta: "",
      };
      const { error: createError } = await supabaseAdmin
        .from("home_admin")
        .insert({
          id: HOME_ID,
          blocks: defaultBlocks,
          texts: defaultTexts,
          images: { [safeField]: publicUrl },
        });
      
      if (createError) {
        console.error("Supabase create error:", createError);
        return NextResponse.json(
          { 
            success: false, 
            message: `Ошибка создания записи: ${createError.message || JSON.stringify(createError)}` 
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ success: true, url: publicUrl });
    }

    const currentImages = currentData?.images || {};
    const updatedImages = {
      ...currentImages,
      [safeField]: publicUrl,
    };

    console.log("Updated images object:", updatedImages);

    // Важно: передаём все обязательные поля (blocks, texts, images)
    const { error: updateError } = await supabaseAdmin
      .from("home_admin")
      .upsert(
        {
          id: HOME_ID,
          blocks: currentData?.blocks || {
            hero: true,
            heroForm: true,
            services: true,
            about: true,
            howItWorks: true,
            contacts: true,
          },
          texts: currentData?.texts || {
            heroSubtitle: "",
            servicesTitle: "",
            servicesSubtitle: "",
            aboutTitle: "",
            aboutText: "",
            howTitle: "",
            contactsCta: "",
          },
          images: updatedImages,
        },
        { onConflict: "id" }
      );

    if (updateError) {
      console.error("Supabase update images error:", updateError);
      return NextResponse.json(
        { 
          success: false, 
          message: `Ошибка обновления данных: ${updateError.message || JSON.stringify(updateError)}` 
        },
        { status: 500 }
      );
    }

    console.log("Successfully updated home_admin images");

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


