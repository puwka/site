import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import MobileStickyButton from "@/components/MobileStickyButton";
import {
  getServiceBySlug,
  getCategoryBySlug,
  services,
  categories,
  type Service,
} from "@/data/services";
import ServicePageClient from "./ServicePageClient";
import { getServiceOverrides } from "@/app/actions/adminServices";

type Params = { category: string; slug: string };
type StaticParam = { category: string; slug: string };

export async function generateStaticParams() {
  const overrides = await getServiceOverrides();

  const baseParams: StaticParam[] = services
    .map((service) => {
      const category = categories.find((cat) => cat.id === service.categoryId);
      if (!category) return null;
      return {
        category: category.slug,
        slug: service.slug,
      };
    })
    .filter((item): item is StaticParam => item !== null);

  const overrideParams: StaticParam[] = Object.values(overrides)
    .filter(
      (ov) =>
        !ov.deleted &&
        ov.slug &&
        ov.categoryId &&
        ov.title && // убеждаемся, что есть хотя бы название
        !services.find((s) => s.id === ov.id)
    )
    .map((ov) => {
      const category = categories.find((cat) => cat.id === ov.categoryId);
      if (!category || !ov.slug) return null;
      return {
        category: category.slug,
        slug: ov.slug,
      };
    })
    .filter((item): item is StaticParam => item !== null);

  return [...baseParams, ...overrideParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: categorySlug, slug } = await params;
  const overrides = await getServiceOverrides();

  const baseService = getServiceBySlug(slug);
  const overrideFromBase = baseService ? overrides[baseService.id] : undefined;

  const overrideOnly =
    baseService == null
      ? Object.values(overrides).find(
          (ov) => !ov.deleted && ov.slug === slug && ov.categoryId
        )
      : undefined;

  const service: Service | null =
    baseService || overrideFromBase || overrideOnly
      ? {
          ...(baseService || {
            id: overrideOnly!.id || `service-${slug}`,
            slug: overrideOnly!.slug || slug,
            title: overrideOnly!.title || "Новая услуга",
            description: overrideOnly!.description || "",
            price: overrideOnly!.price,
            categoryId: overrideOnly!.categoryId || "",
            fullDescription: overrideOnly!.fullDescription,
            seoText: overrideOnly!.seoText,
            pricingTable: overrideOnly!.pricingTable,
            images: overrideOnly!.images,
            showOrderForm: overrideOnly!.showOrderForm,
          }),
          ...(overrideFromBase || overrideOnly || {}),
        }
      : null;

  const category = getCategoryBySlug(categorySlug);

  if (!service || !category) {
    return {
      title: "Услуга не найдена",
    };
  }

  return {
    title: `${service.title} — Тяжёлый Профиль`,
    description: service.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: categorySlug, slug } = await params;
  const overrides = await getServiceOverrides();

  const baseService = getServiceBySlug(slug);
  const overrideFromBase = baseService ? overrides[baseService.id] : undefined;

  // Ищем услугу только в overrides (если её нет в базовых)
  const overrideOnly =
    baseService == null
      ? Object.values(overrides).find(
          (ov) => !ov.deleted && ov.slug === slug && ov.categoryId
        )
      : undefined;

  // Собираем финальный объект услуги
  const service: Service | null =
    baseService || overrideFromBase || overrideOnly
      ? {
          ...(baseService || {
            id: overrideOnly!.id || `service-${slug}`,
            slug: overrideOnly!.slug || slug,
            title: overrideOnly!.title || "Новая услуга",
            description: overrideOnly!.description || "",
            price: overrideOnly!.price,
            categoryId: overrideOnly!.categoryId || "",
            fullDescription: overrideOnly!.fullDescription,
            seoText: overrideOnly!.seoText,
            pricingTable: overrideOnly!.pricingTable,
            images: overrideOnly!.images,
            showOrderForm: overrideOnly!.showOrderForm,
          }),
          ...(overrideFromBase || overrideOnly || {}),
        }
      : null;

  const category = getCategoryBySlug(categorySlug);

  // Проверяем, что услуга существует и не удалена
  const serviceId = service?.id;
  const isDeleted = serviceId ? overrides[serviceId]?.deleted : false;

  if (
    !service ||
    !category ||
    !service.categoryId ||
    service.categoryId !== category.id ||
    isDeleted
  ) {
    notFound();
  }

  return (
    <>
      <ServicePageClient service={service} category={category} />
      <Footer />
      <MobileStickyButton />
    </>
  );
}

