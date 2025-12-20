"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { categories, getServicesByCategory, type Service } from "@/data/services";
import { ChevronDown, Warehouse, Factory, Building2, Sparkles, Shovel, ArrowRight } from "lucide-react";

const categoryIcons = {
  warehouse: Warehouse,
  production: Factory,
  construction: Building2,
  cleaning: Sparkles,
  earthworks: Shovel,
};

type ServiceOverride = Partial<Service> & { id: string; deleted?: boolean };

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
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

  const getMergedServicesByCategory = (categoryId: string): Service[] => {
    const base = getServicesByCategory(categoryId).map((service) => ({
      ...service,
      ...(overrides[service.id] || {}),
    })).filter((service) => !(overrides[service.id]?.deleted));

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
        } as Service);
      }
    });

    return base;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/services"
        className="text-base font-semibold dark:text-white light:text-zinc-900 hover:text-[oklch(0.75_0.18_50)] transition-colors relative group flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[oklch(0.75_0.18_50)]/10"
      >
        Услуги
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[900px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl z-50 overflow-hidden dark:bg-zinc-950 dark:border-2 dark:border-zinc-800 light:bg-white light:border light:border-zinc-200"
          >
            <div className="p-6">
              <div className="grid grid-cols-5 gap-6">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Building2;
                  const categoryServices = getMergedServicesByCategory(category.id);
                  if (categoryServices.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="flex flex-col">
                      {/* Category Header */}
                      <Link
                        href={`/services/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 mb-4 p-2 rounded-lg transition-colors group dark:hover:bg-zinc-900/50 light:hover:bg-zinc-100"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.75_0.18_50)]/20 to-[oklch(0.75_0.18_50)]/10 flex items-center justify-center group-hover:from-[oklch(0.75_0.18_50)]/30 group-hover:to-[oklch(0.75_0.18_50)]/20 transition-all">
                          <Icon className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                        </div>
                        <span className="font-[var(--font-oswald)] text-sm font-bold uppercase dark:text-white light:text-zinc-900 group-hover:text-[oklch(0.75_0.18_50)] transition-colors">
                          {category.name}
                        </span>
                      </Link>
                      
                      {/* Services List */}
                      <ul className="space-y-1">
                        {categoryServices.slice(0, 5).map((service) => (
                          <li key={service.id}>
                            <Link
                              href={`/services/${category.slug}/${service.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="block px-2 py-1.5 rounded text-sm dark:text-zinc-300 light:text-zinc-700 hover:text-[oklch(0.75_0.18_50)] dark:hover:bg-zinc-900/30 light:hover:bg-zinc-100 transition-all group"
                            >
                              <div className="flex items-center justify-between">
                                <span>{service.title}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </Link>
                          </li>
                        ))}
                        {categoryServices.length > 5 && (
                          <li>
                            <Link
                              href={`/services/${category.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="block px-2 py-1.5 rounded text-sm text-[oklch(0.75_0.18_50)] hover:bg-zinc-900/30 transition-all font-medium"
                            >
                              Все услуги →
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
