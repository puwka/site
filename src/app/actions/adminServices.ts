"use server";

import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

async function readOverrides(): Promise<OverridesMap> {
  const { data, error } = await supabaseAdmin
    .from("service_overrides")
    .select(
      "id, slug, title, description, price, category_id, full_description, seo_text, pricing_table, images, show_order_form, deleted"
    );

  if (error) {
    console.error("Supabase readOverrides error:", error.message);
    return {};
  }

  const map: OverridesMap = {};
  for (const row of data) {
    map[row.id] = {
      id: row.id,
      slug: row.slug ?? undefined,
      title: row.title ?? undefined,
      description: row.description ?? undefined,
      price: row.price ?? undefined,
      categoryId: row.category_id ?? undefined,
      fullDescription: row.full_description ?? undefined,
      seoText: row.seo_text ?? undefined,
      pricingTable: (row.pricing_table as any) ?? undefined,
      images: (row.images as any) ?? undefined,
      showOrderForm: row.show_order_form ?? undefined,
      deleted: row.deleted ?? undefined,
    };
  }

  return map;
}

async function writeOverrides(data: OverridesMap) {
  const rows = Object.values(data).map((item) => ({
    id: item.id,
    slug: item.slug ?? null,
    title: item.title ?? null,
    description: item.description ?? null,
    price: item.price ?? null,
    category_id: item.categoryId ?? null,
    full_description: item.fullDescription ?? null,
    seo_text: item.seoText ?? null,
    pricing_table: item.pricingTable ?? null,
    images: item.images ?? null,
    show_order_form: item.showOrderForm ?? null,
    deleted: item.deleted ?? null,
  }));

  const { error } = await supabaseAdmin.from("service_overrides").upsert(rows, {
    onConflict: "id",
  });

  if (error) {
    console.error("Supabase writeOverrides error:", error.message);
  }
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

