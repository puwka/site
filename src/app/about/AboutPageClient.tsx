"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyButton from "@/components/MobileStickyButton";
import { Users, Shield, Clock, Award, ArrowRight } from "lucide-react";
import OrderForm from "@/components/OrderForm";
import ImageCarousel from "@/components/ImageCarousel";
import { useEffect, useState } from "react";

type AboutConfig = {
  showMission: boolean;
  showStats: boolean;
  showAdvantages: boolean;
  showQuote: boolean;
  showCta: boolean;
  showForm: boolean;
  galleryImages: string[];
};

const defaultConfig: AboutConfig = {
  showMission: true,
  showStats: true,
  showAdvantages: true,
  showQuote: true,
  showCta: true,
  showForm: true,
  galleryImages: [
    "https://images.unsplash.com/photo-1581092160565-5d3f3c2e4b3a?w=1200&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80",
  ],
};

export default function AboutPageClient() {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [missionText, setMissionText] = useState<string | null>(null);
  const [config, setConfig] = useState<AboutConfig | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [missionRes, configRes] = await Promise.all([
          fetch("/api/admin/page-texts?key=about_mission_text", {
            cache: "no-store",
          }),
          fetch("/api/admin/page-texts?key=about_config", { cache: "no-store" }),
        ]);

        if (missionRes.ok) {
          const data = await missionRes.json();
          if (typeof data.text === "string") {
            setMissionText(data.text);
          }
        }

        if (configRes.ok) {
          const cfgData = await configRes.json();
          if (typeof cfgData.text === "string" && cfgData.text.trim().length > 0) {
            try {
              const parsed = JSON.parse(cfgData.text);
              setConfig({ ...defaultConfig, ...parsed });
            } catch {
              setConfig(defaultConfig);
            }
          } else {
            setConfig(defaultConfig);
          }
        } else {
          setConfig(defaultConfig);
        }
      } catch {
        setConfig(defaultConfig);
      }
    };
    load();
  }, []);

  const missionParagraphs =
    missionText && missionText.trim().length > 0
      ? missionText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
      : [
          "Мы предоставляем рабочий персонал, который умеет работать в темпе, соблюдает технику безопасности и выполняет задачи без лишних вопросов.",
          "Все сотрудники проходят инструктаж и выходят на смены полностью подготовленными — без срывов, опозданий и простоев.",
          "Мы работаем так, будто каждый объект — наш собственный: дисциплина, ответственность и контроль качества.",
        ];

  const effectiveConfig = config || defaultConfig;

  return (
    <main className="noise-overlay min-h-screen">
      <Header />
      {/* Hero Section */}
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
              <span className="text-foreground">О компании</span>
            </nav>

            <h1 className="font-[var(--font-oswald)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
              О <span className="gradient-text">компании</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Профессиональный подбор рабочего персонала с 2010 года
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Mission Block */}
      {effectiveConfig.showMission && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6">
                  Мы подбираем не случайных людей
                </h2>
                <div className="prose prose-invert max-w-none space-y-4">
                  {missionParagraphs.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-lg text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>

              {/* Right: Image Carousel */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ImageCarousel
                  images={effectiveConfig.galleryImages}
                  alt="Рабочий персонал"
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Key Statistics */}
      {effectiveConfig.showStats && (
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "1000+",
                label: "Сотрудников в резерве",
                icon: Users,
              },
              {
                number: "100%",
                label: "Материальная ответственность",
                icon: Shield,
              },
              {
                number: "24/7",
                label: "Прием заявок",
                icon: Clock,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="border-zinc-800 hover:border-[oklch(0.75_0.18_50)]/30 transition-all">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-full bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-[oklch(0.75_0.18_50)]" />
                    </div>
                    <div className="font-[var(--font-oswald)] text-5xl md:text-6xl font-bold text-[oklch(0.75_0.18_50)] mb-3">
                      {stat.number}
                    </div>
                    <p className="text-muted-foreground text-lg">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Our Approach */}
      {effectiveConfig.showAdvantages && (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-4">
              Почему нам доверяют
              <br />
              <span className="gradient-text">сложные объекты</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Дисциплина",
                description: "Никакого алкоголя, опозданий или нарушений. Строгий контроль и ответственность.",
              },
              {
                icon: Award,
                title: "Безопасность",
                description: "Строгое соблюдение техники безопасности. Все сотрудники проходят инструктаж.",
              },
              {
                icon: Clock,
                title: "Скорость",
                description: "Срочная замена персонала при необходимости. Резерв из 1000+ сотрудников.",
              },
              {
                icon: Users,
                title: "Специализация",
                description: "Точно знаем, кто нужен для стройки, склада или производства. Правильный подбор под задачу.",
              },
            ].map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-zinc-800 hover:border-[oklch(0.75_0.18_50)]/30 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center mb-4">
                      <advantage.icon className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
                    </div>
                    <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase mb-3">
                      {advantage.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Philosophy Quote Block */}
      {effectiveConfig.showQuote && (
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-8 md:p-12 rounded-2xl border-2 border-[oklch(0.75_0.18_50)]/30 bg-gradient-to-br from-[oklch(0.75_0.18_50)]/5 to-transparent">
              <div className="absolute top-4 left-4 text-6xl text-[oklch(0.75_0.18_50)]/20 font-serif">
                "
              </div>
              <p className="font-[var(--font-oswald)] text-2xl md:text-3xl lg:text-4xl font-bold italic text-center leading-relaxed relative z-10">
                Тяжёлый профиль — когда нужен рабочий персонал, на который действительно можно положиться.
              </p>
              <div className="absolute bottom-4 right-4 text-6xl text-[oklch(0.75_0.18_50)]/20 font-serif">
                "
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* CTA / Contact Block */}
      {effectiveConfig.showCta && effectiveConfig.showForm && (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6">
              Готовы начать?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Оставьте заявку, и мы свяжемся с вами в ближайшее время для обсуждения вашей задачи
            </p>
            <Button
              onClick={() => setShowOrderForm(true)}
              className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold px-8 py-6 text-lg uppercase font-[var(--font-oswald)]"
            >
              Заказать персонал
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
      )}

      <Footer />
      <MobileStickyButton />

      {/* Order Form Modal */}
      {effectiveConfig.showCta && effectiveConfig.showForm && (
        <Sheet open={showOrderForm} onOpenChange={setShowOrderForm}>
          <SheetContent className="w-full sm:max-w-md dark:bg-zinc-950 dark:border-zinc-800 light:bg-white light:border-zinc-200">
            <SheetHeader>
              <SheetTitle className="font-[var(--font-oswald)] text-2xl font-bold uppercase">
                Заказать персонал
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <OrderForm onSuccess={() => setShowOrderForm(false)} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </main>
  );
}

