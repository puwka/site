"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { Category, Service } from "@/data/services";
import { useEffect, useState } from "react";

type ServiceOverride = Partial<Service> & { id: string; deleted?: boolean };

interface CategoryPageClientProps {
  category: Category;
  services: Service[];
}

export default function CategoryPageClient({ category, services }: CategoryPageClientProps) {
  const [overrides, setOverrides] = useState<Record<string, ServiceOverride>>({});

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

  const mergedServices: Service[] = services
    .map((service) => ({
      ...service,
      ...(overrides[service.id] || {}),
    }))
    .filter((service) => !(overrides[service.id]?.deleted));

  Object.entries(overrides).forEach(([id, override]) => {
    if (override.deleted) return;
    if (override.categoryId !== category.id) return;
    if (!mergedServices.find((s) => s.id === id)) {
      mergedServices.push({
        id,
        slug: override.slug || "",
        title: override.title || "Новая услуга",
        description: override.description || "",
        price: override.price,
        categoryId: category.id,
        fullDescription: override.fullDescription,
        seoText: override.seoText,
        pricingTable: override.pricingTable,
        images: override.images,
      } as Service);
    }
  });

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
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">
                Главная
              </Link>
              <span>/</span>
              <Link href="/services" className="hover:text-foreground transition-colors">
                Услуги
              </Link>
              <span>/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>

            <h1 className="font-[var(--font-oswald)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mergedServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/services/${category.slug}/${service.slug}`}>
                  <Card className="h-full hover:border-[oklch(0.75_0.18_50)]/30 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-[oklch(0.75_0.18_50)] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
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

          <div className="mt-12">
            <Link href="/services">
              <motion.div
                whileHover={{ x: -5 }}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Вернуться к каталогу
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

