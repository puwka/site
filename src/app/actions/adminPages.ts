"use server";

import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";

const adminFilePath = path.join(process.cwd(), "src/data/admin.json");

interface AdminData {
  pageTexts: Record<string, string>;
}

async function readAdminFile(): Promise<AdminData> {
  try {
    const file = await fs.readFile(adminFilePath, "utf8");
    const data = JSON.parse(file);
    return {
      pageTexts: data.pageTexts || {},
    };
  } catch {
    return { pageTexts: {} };
  }
}

async function writeAdminFile(data: AdminData) {
  const toWrite = JSON.stringify(data, null, 2);
  await fs.writeFile(adminFilePath, toWrite, "utf8");
}

export async function updatePageText(key: string, text: string) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const data = await readAdminFile();
  data.pageTexts[key] = text;
  await writeAdminFile(data);

  return { success: true };
}

export async function getPageText(key: string): Promise<string> {
  const data = await readAdminFile();
  return data.pageTexts[key] ?? "";
}

