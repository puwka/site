import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const homeFilePath = path.join(process.cwd(), "src/data/home-admin.json");

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

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeField = field === "heroBg" || field === "aboutBg" ? field : "image";
    const ext = path.extname(file.name) || ".jpg";
    const fileName = `${safeField}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    // Обновляем JSON-конфиг home-admin
    try {
      const jsonRaw = await fs.readFile(homeFilePath, "utf8");
      const data = JSON.parse(jsonRaw);
      data.images = {
        ...(data.images || {}),
        [safeField]: publicUrl,
      };
      await fs.writeFile(homeFilePath, JSON.stringify(data, null, 2), "utf8");
    } catch {
      // если файла ещё нет — создаём минимальный
      const data = {
        blocks: {
          hero: true,
          services: true,
          about: true,
          howItWorks: true,
          contacts: true,
        },
        texts: {},
        images: {
          [safeField]: publicUrl,
        },
      };
      await fs.writeFile(homeFilePath, JSON.stringify(data, null, 2), "utf8");
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка загрузки файла" },
      { status: 500 }
    );
  }
}


