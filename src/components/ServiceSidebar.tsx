"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { categories, getServicesByCategory, type Service } from "@/data/services";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type ServiceOverride = Partial<Service> & { id: string; deleted?: boolean };

export default function ServiceSidebar() {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map((cat) => cat.id)
  );
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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <aside className="hidden lg:block fixed left-0 top-24 h-[calc(100vh-6rem)] w-[280px] overflow-y-auto z-30 custom-scrollbar dark:bg-zinc-950 dark:border-r dark:border-zinc-800 light:bg-white light:border-r light:border-zinc-200 shadow-sm">
      <div className="p-6">
        <h2 className="font-[var(--font-oswald)] text-lg font-bold uppercase dark:text-white light:text-zinc-900 mb-6">
          Категории услуг
        </h2>
        <nav className="space-y-2">
          {categories.map((category) => {
            const categoryServices = getMergedServicesByCategory(category.id);
            if (categoryServices.length === 0) return null;
            const isExpanded = expandedCategories.includes(category.id);
            const isCategoryActive = pathname.startsWith(`/services/${category.slug}`);
            
            return (
              <div key={category.id} className="mb-4">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    isCategoryActive
                      ? "bg-[oklch(0.75_0.18_50)]/15 text-[oklch(0.75_0.18_50)] border-l-2 border-[oklch(0.75_0.18_50)]"
                      : "dark:text-muted-foreground dark:hover:text-white dark:hover:bg-zinc-900 light:text-zinc-600 light:hover:text-zinc-900 light:hover:bg-zinc-100"
                  }`}
                >
                  <span className="font-[var(--font-oswald)] text-sm font-semibold uppercase">
                    {category.name}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: isExpanded ? "auto" : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ overflow: "hidden" }}
                  className="ml-4"
                >
                  <div className="mt-2 space-y-1">
                    {categoryServices.map((service, index) => {
                      const isServiceActive =
                        pathname === `/services/${category.slug}/${service.slug}`;
                      
                      return (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{
                            opacity: isExpanded ? 1 : 0,
                            x: isExpanded ? 0 : -10,
                          }}
                          transition={{
                            duration: 0.2,
                            delay: index * 0.03,
                            ease: "easeOut",
                          }}
                        >
                          <Link
                            href={`/services/${category.slug}/${service.slug}`}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              isServiceActive
                                ? "text-[oklch(0.75_0.18_50)] bg-[oklch(0.75_0.18_50)]/10 border-l-2 border-[oklch(0.75_0.18_50)] font-medium"
                                : "dark:text-muted-foreground dark:hover:text-white dark:hover:bg-zinc-900 light:text-zinc-600 light:hover:text-zinc-900 light:hover:bg-zinc-100"
                            }`}
                          >
                            {service.title}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

