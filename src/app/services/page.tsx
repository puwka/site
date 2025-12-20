"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyButton from "@/components/MobileStickyButton";
import { categories, getServicesByCategory, type Service } from "@/data/services";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ServiceOverride = Partial<Service> & { id: string; deleted?: boolean };

export default function ServicesPage() {
  const [overrides, setOverrides] = useState<Record<string, ServiceOverride>>({});
  const [pageTitle, setPageTitle] = useState("Каталог услуг:");
  const [pageSubtitle, setPageSubtitle] = useState(
    "Аутсорсинг рабочего персонала для складских и производственных объектов любого масштаба."
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/services-overrides", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as Record<string, ServiceOverride>;
        setOverrides(data || {});
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadPageTexts = async () => {
      try {
        const titleRes = await fetch("/api/admin/page-texts?key=services_page_title", {
          cache: "no-store",
        });
        if (titleRes.ok) {
          const titleData = await titleRes.json();
          if (titleData.text && titleData.text.trim()) {
            setPageTitle(titleData.text);
          }
        }

        const subtitleRes = await fetch("/api/admin/page-texts?key=services_page_subtitle", {
          cache: "no-store",
        });
        if (subtitleRes.ok) {
          const subtitleData = await subtitleRes.json();
          if (subtitleData.text && subtitleData.text.trim()) {
            setPageSubtitle(subtitleData.text);
          }
        }
      } catch {
        // ignore
      }
    };
    loadPageTexts();
  }, []);

  const getMergedServicesByCategory = (categoryId: string): Service[] => {
    const base = getServicesByCategory(categoryId).map((service) => ({
      ...service,
      ...(overrides[service.id] || {}),
    })).filter((service) => !(overrides[service.id]?.deleted));

    // новые услуги только в overrides
    Object.entries(overrides).forEach(([id, override]) => {
      if (override.deleted) return;
      if (override.categoryId !== categoryId) return;
      if (!base.find((s) => s.id === id)) {
        base.push({
          id,
          slug: override.slug || "",
          title: override.title || "Новая услуга",
          description: override.description || "",
          price: override.price,
          categoryId,
          fullDescription: override.fullDescription,
          seoText: override.seoText,
          pricingTable: override.pricingTable,
          images: override.images,
        });
      }
    });

    return base;
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-[var(--font-oswald)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
              {pageTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-16">
            {categories.map((category, categoryIndex) => {
              const categoryServices = getMergedServicesByCategory(category.id);
              if (categoryServices.length === 0) return null;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold uppercase mb-2">
                        {category.name}
                      </h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                    <Link
                      href={`/services/${category.slug}`}
                      className="hidden md:flex items-center gap-2 text-[oklch(0.75_0.18_50)] font-semibold hover:underline"
                    >
                      Все услуги
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.slice(0, 6).map((service, serviceIndex) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: serviceIndex * 0.05 }}
                      >
                        <Link href={`/services/${category.slug}/${service.slug}`}>
                          <Card className="h-full hover:border-[oklch(0.75_0.18_50)]/30 transition-all duration-300 cursor-pointer group">
                            <CardContent className="p-6">
                              <h3 className="font-semibold text-lg mb-2 group-hover:text-[oklch(0.75_0.18_50)] transition-colors">
                                {service.title}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                {service.description}
                              </p>
                              {service.price && (
                                <p className="text-[oklch(0.75_0.18_50)] font-semibold mb-4">
                                  {service.price}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-[oklch(0.75_0.18_50)] font-semibold text-sm">
                                Подробнее
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {categoryServices.length > 6 && (
                    <div className="mt-6 text-center md:hidden">
                      <Link href={`/services/${category.slug}`}>
                        <span className="text-[oklch(0.75_0.18_50)] font-semibold hover:underline">
                          Показать все услуги ({categoryServices.length})
                        </span>
                      </Link>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <MobileStickyButton />
    </>
  );
}
