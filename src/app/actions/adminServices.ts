"use server";

import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";

type ServiceOverride = {
  id: string;
  slug?: string;
  title?: string;
  description?: string;
  price?: string;
  categoryId?: string;
  fullDescription?: string;
  seoText?: string;
  pricingTable?: Array<{
    name: string;
    price: string;
    unit?: string;
  }>;
  images?: string[];
  showOrderForm?: boolean;
  deleted?: boolean;
};

type OverridesMap = Record<string, ServiceOverride>;

const overridesFilePath = path.join(
  process.cwd(),
  "src/data/services-overrides.json"
);

async function readOverrides(): Promise<OverridesMap> {
  try {
    const file = await fs.readFile(overridesFilePath, "utf8");
    return JSON.parse(file);
  } catch {
    return {};
  }
}

async function writeOverrides(data: OverridesMap) {
  await fs.writeFile(overridesFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function updateService(
  serviceId: string,
  data: Partial<ServiceOverride>
) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const overrides = await readOverrides();

  const current: ServiceOverride = overrides[serviceId] || { id: serviceId };

  const next: ServiceOverride = {
    ...current,
    ...data,
    id: serviceId,
    deleted: false,
  };

  overrides[serviceId] = next;

  await writeOverrides(overrides);

  return { success: true };
}

export async function deleteService(serviceId: string) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const overrides = await readOverrides();

  const current: ServiceOverride | undefined = overrides[serviceId];

  if (current && !current.slug && !current.title && !current.description) {
    // Чисто служебная запись без полей — просто удаляем
    delete overrides[serviceId];
  } else {
    overrides[serviceId] = {
      ...(current || { id: serviceId }),
      deleted: true,
    };
  }

  await writeOverrides(overrides);

  return { success: true };
}

export async function getServiceOverrides() {
  const overrides = await readOverrides();
  return overrides;
}

