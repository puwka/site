"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Shield,
  DollarSign,
  Users,
  Building2,
  Phone,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

type DocSection = {
  title: string;
  content: string[];
};

type DocumentsConfig = {
  privacy: DocSection[];
  offer: DocSection[];
  showContactCta?: boolean;
};

const defaultOfferSections: DocSection[] = [
  {
    title: "Общие положения",
    content: [
      "Настоящий документ является публичной офертой и определяет порядок и условия оказания услуг по предоставлению рабочего персонала.",
      "Начало использования услуг означает полное и безоговорочное согласие Заказчика с условиями настоящей оферты.",
    ],
  },
  {
    title: "Предмет договора",
    content: [
      "Исполнитель предоставляет Заказчику услуги по подбору и предоставлению рабочего персонала для выполнения работ на объектах Заказчика.",
      "Конкретный перечень работ, количество персонала и сроки согласуются сторонами дополнительно в заявках и переписке.",
    ],
  },
  {
    title: "Порядок оказания услуг",
    content: [
      "Заказчик направляет заявку с указанием требуемого количества сотрудников, графика и места выполнения работ.",
      "Исполнитель подтверждает возможность выполнения заявки и согласовывает с Заказчиком все существенные условия.",
    ],
  },
  {
    title: "Стоимость и оплата",
    content: [
      "Стоимость услуг определяется в соответствии с актуальными тарифами Исполнителя и согласовывается с Заказчиком до начала работ.",
      "Оплата услуг производится в порядке и сроки, согласованные сторонами, на основании выставленных счетов.",
    ],
  },
  {
    title: "Гарантии и ответственность",
    content: [
      "Исполнитель несёт ответственность за качество оказания услуг в пределах фактически уплаченной Заказчиком стоимости.",
      "Заказчик несёт ответственность за соблюдение требований охраны труда и техники безопасности на своих объектах.",
    ],
  },
  {
    title: "Реквизиты и контакты",
    content: [
      "Актуальные реквизиты и контактная информация Исполнителя указаны на странице «Контакты» сайта и могут обновляться без дополнительного уведомления.",
    ],
  },
];

const iconMap: Record<string, typeof FileText> = {
  "Общие положения": FileText,
  "Предмет договора": Users,
  "Порядок оказания услуг": CheckCircle,
  "Стоимость и оплата": DollarSign,
  "Гарантии и ответственность": Shield,
  "Реквизиты и контакты": Building2,
};

export default function OfferPage() {
  const [sections, setSections] = useState<DocSection[]>(defaultOfferSections);
  const [showContactCta, setShowContactCta] = useState<boolean>(true);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const res = await fetch("/api/admin/page-texts?key=docs_config", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (typeof data.text === "string" && data.text.trim().length > 0) {
          try {
            const parsed: DocumentsConfig = JSON.parse(data.text);
            if (parsed.offer && Array.isArray(parsed.offer)) {
              setSections(parsed.offer);
            }
            if (typeof parsed.showContactCta === "boolean") {
              setShowContactCta(parsed.showContactCta);
            }
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      }
    };
    loadDocs();
  }, []);

  const updatedAt = new Date().toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.75_0.18_50)/5] via-transparent to-transparent" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-[oklch(0.75_0.18_50)] transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                На главную
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[oklch(0.75_0.18_50)] flex items-center justify-center">
                  <FileText className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-2">
                    Договор публичной оферты
                  </h1>
                  <p className="text-muted-foreground">
                    Дата последнего обновления: {updatedAt}
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 mb-8">
                <p className="text-muted-foreground leading-relaxed">
                  Настоящий документ определяет условия оказания услуг по аутсорсингу рабочего
                  персонала. Пожалуйста, внимательно ознакомьтесь с условиями перед использованием
                  наших услуг.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {sections.map((section, index) => {
                const Icon = iconMap[section.title] || FileText;
                return (
                  <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-card border border-border rounded-3xl p-8 md:p-10 hover:border-[oklch(0.75_0.18_50)/30] transition-all duration-300"
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-[var(--font-oswald)] text-2xl md:text-3xl font-bold uppercase mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <div className="space-y-4">
                        {section.content.map((paragraph, pIndex) => (
                          <p
                            key={pIndex}
                            className="text-muted-foreground leading-relaxed text-base md:text-lg"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {showContactCta && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-12 text-center"
              >
                <h2 className="font-[var(--font-oswald)] text-2xl md:text-3xl font-bold uppercase mb-4">
                  Готовы начать сотрудничество?
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Свяжитесь с нами для обсуждения деталей и получения персонального предложения.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold px-8 py-6"
                  >
                    <Link href="/#contacts">
                      <Phone className="w-5 h-5 mr-2" />
                      Связаться с нами
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="px-8 py-6">
                    <Link href="/">Вернуться на главную</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}


