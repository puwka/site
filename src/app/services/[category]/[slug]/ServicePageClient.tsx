"use client";

import { motion } from "framer-motion";
import OrderForm from "@/components/OrderForm";
import { getRelatedServices, services as baseServices } from "@/data/services";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Service, Category } from "@/data/services";
import { useEffect, useState } from "react";
import ImageCarousel from "@/components/ImageCarousel";

interface ServicePageClientProps {
  service: Service;
  category: Category;
}

// Фотографии для разных категорий - рабочие ссылки Unsplash
const getCategoryImages = (categoryId: string): string[] => {
  const imageMap: Record<string, string[]> = {
    warehouse: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1200&q=80",
    ],
    production: [
      "https://images.unsplash.com/photo-1581092160565-5d3f3c2e4b3a?w=1200&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80",
      "https://images.unsplash.com/photo-1581092160565-5d3f3c2e4b3a?w=1200&q=80",
    ],
    construction: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
    ],
    cleaning: [
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    earthworks: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
      "https://images.unsplash.com/photo-1581092160565-5d3f3c2e4b3a?w=1200&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
    ],
  };

  return imageMap[categoryId] || imageMap.construction;
};

export default function ServicePageClient({ service, category }: ServicePageClientProps) {
  const [localService, setLocalService] = useState<Service>(service);

  useEffect(() => {
    let isMounted = true;
    const loadOverrides = async () => {
      try {
        const res = await fetch("/api/admin/services-overrides", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        const override = data?.[service.id];
        if (override && override.deleted) {
          // если услуга помечена как удалённая, ничего не переопределяем
          return;
        }
        if (override && isMounted) {
          setLocalService((prev) => ({ ...prev, ...override }));
        } else if (isMounted) {
          // Если это новая услуга, полностью описанная в overrides.json
          const base = baseServices.find((s) => s.id === service.id);
          if (!base && override) {
            setLocalService({
              id: service.id,
              slug: override.slug || service.slug,
              title: override.title || service.title,
              description: override.description || service.description,
              price: override.price,
              categoryId: override.categoryId || service.categoryId,
              fullDescription: override.fullDescription,
              seoText: override.seoText,
              pricingTable: override.pricingTable,
              images: override.images,
            });
          }
        }
      } catch {
        // ignore
      }
    };
    loadOverrides();
    return () => {
      isMounted = false;
    };
  }, [service.id]);

  const relatedServices = getRelatedServices(service.categoryId, service.id);
  const galleryImages =
    localService.images && localService.images.length > 0
      ? localService.images
      : getCategoryImages(category.id);

  const showOrderForm = localService.showOrderForm !== false;

  return (
    <>
      {/* Hero with Image */}
      <section className="relative pt-24 pb-16 md:pb-24">
        {/* Hero Background Image */}
        <div className="relative h-[400px] md:h-[500px] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${galleryImages[0]}')`,
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
          
          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-end">
            <div className="container mx-auto px-4 lg:px-8 pb-8">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm text-white/80 mb-6 flex-wrap">
                <Link href="/" className="hover:text-white transition-colors">
                  Главная
                </Link>
                <span>/</span>
                <Link href="/services" className="hover:text-white transition-colors">
                  Услуги
                </Link>
                <span>/</span>
                <Link
                  href={`/services/${category.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
                <span>/</span>
                <span className="text-white">{localService.title}</span>
              </nav>

              <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                <div className="flex-1">
                  <h1 className="font-[var(--font-oswald)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4 text-white">
                    {localService.title}
                  </h1>
                  <p className="text-lg text-white/90 max-w-2xl">
                    {localService.description}
                  </p>
                </div>

                {/* Floating "Calculate Cost" Button */}
                {showOrderForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <button
                      onClick={() => {
                        const formElement = document.getElementById("order-form");
                        if (formElement) {
                          formElement.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] active-bg-[oklch(0.65_0.18_50)] text-black font-bold px-8 py-4 rounded-xl shadow-2xl shadow-[oklch(0.75_0.18_50)]/30 hover:shadow-[oklch(0.75_0.18_50)]/40 transition-all duration-300 text-base md:text-lg uppercase font-[var(--font-oswald)]"
                    >
                      Рассчитать стоимость
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            className={`grid grid-cols-1 ${
              showOrderForm ? "lg:grid-cols-3" : "lg:grid-cols-2"
            } gap-8 lg:gap-12`}
          >
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Service Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold uppercase mb-6">
                  Описание услуги
                </h2>
                <div className="prose prose-invert max-w-none space-y-4">
                  {localService.fullDescription ? (
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {localService.fullDescription}
                    </p>
                  ) : (
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {localService.description}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Photo Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold uppercase mb-6">
                  Фотогалерея
                </h2>
                <ImageCarousel images={galleryImages} alt={localService.title} />
              </motion.div>

              {/* Pricing Table */}
              {localService.pricingTable && localService.pricingTable.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold uppercase mb-6">
                    Тарифы
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-4 px-6 font-[var(--font-oswald)] text-lg uppercase text-white">
                            Услуга
                          </th>
                          <th className="text-right py-4 px-6 font-[var(--font-oswald)] text-lg uppercase text-white">
                            Стоимость
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {localService.pricingTable.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
                          >
                            <td className="py-4 px-6 text-muted-foreground">
                              {item.name}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <span className="text-[oklch(0.75_0.18_50)] font-bold text-lg">
                                {item.price}
                              </span>
                              {item.unit && (
                                <span className="text-muted-foreground text-sm ml-2">
                                  {item.unit}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* SEO Text */}
              {localService.seoText && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="prose prose-invert max-w-none"
                >
                  <div className="bg-card border border-zinc-800 rounded-2xl p-8">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {localService.seoText}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Advantages */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold uppercase mb-6">
                  Преимущества
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Быстрое предоставление персонала",
                    "Опытные и проверенные сотрудники",
                    "Гибкий график работы",
                    "Полная ответственность за результат",
                    "Работа по договору",
                    "Контроль качества выполнения работ",
                  ].map((advantage, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-card border border-zinc-800"
                    >
                      <CheckCircle2 className="w-6 h-6 text-[oklch(0.75_0.18_50)] flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{advantage}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Cases / Portfolio */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold uppercase mb-6">
                  Наши кейсы
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Крупный складской комплекс",
                      description: "Обеспечили персоналом склад площадью 5000 м². Работали 15 грузчиков и 8 комплектовщиков ежедневно.",
                      result: "Снижение простоев на 40%, повышение производительности",
                    },
                    {
                      title: "Строительство жилого комплекса",
                      description: "Предоставили 50 разнорабочих и 20 монтажников для строительства жилого комплекса.",
                      result: "Соблюдение сроков, высокое качество работ",
                    },
                    {
                      title: "Производственное предприятие",
                      description: "Комплектование производственной линии персоналом: упаковщики, маркировщики, фасовщики.",
                      result: "Увеличение выпуска продукции на 25%",
                    },
                    {
                      title: "Уборка территории после стройки",
                      description: "Выполнили полную уборку строительной площадки площадью 3000 м², включая вывоз мусора.",
                      result: "Территория готова к сдаче в срок",
                    },
                  ].map((caseItem, index) => (
                    <Card key={index} className="h-full border-zinc-800 hover:border-[oklch(0.75_0.18_50)]/30 transition-all">
                      <CardContent className="p-6">
                        <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase mb-3 text-[oklch(0.75_0.18_50)]">
                          {caseItem.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {caseItem.description}
                        </p>
                        <div className="flex items-center gap-2 pt-4 border-t border-zinc-800">
                          <CheckCircle2 className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                          <span className="text-sm font-medium">{caseItem.result}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Form (Desktop) */}
            {showOrderForm && (
              <div className="lg:col-span-1">
                <div className="sticky top-24" id="order-form">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <OrderForm serviceName={localService.title} />
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold uppercase mb-8">
                Похожие услуги
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedServices.slice(0, 3).map((relatedService) => (
                  <Link
                    key={relatedService.id}
                    href={`/services/${category.slug}/${relatedService.slug}`}
                  >
                    <Card className="h-full hover:border-[oklch(0.75_0.18_50)]/50 transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase mb-2 group-hover:text-[oklch(0.75_0.18_50)] transition-colors">
                          {relatedService.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {relatedService.description}
                        </p>
                        <div className="flex items-center gap-2 text-[oklch(0.75_0.18_50)] font-semibold text-sm">
                          <span>Подробнее</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
