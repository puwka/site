"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Database,
  Lock,
  Eye,
  Mail,
  FileText,
  CheckCircle,
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

const defaultPrivacySections: DocSection[] = [
  {
    title: "Общие положения",
    content: [
      "Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта.",
      "Используя данный сайт, вы подтверждаете своё согласие с условиями настоящей Политики конфиденциальности.",
    ],
  },
  {
    title: "Сбор и использование информации",
    content: [
      "Мы собираем только те данные, которые необходимы для обработки заявок и обратной связи: имя, номер телефона, адрес электронной почты и содержимое сообщения.",
      "Персональные данные используются исключительно для связи с вами и предоставления наших услуг.",
    ],
  },
  {
    title: "Защита персональных данных",
    content: [
      "Мы принимаем необходимые организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования и распространения.",
    ],
  },
  {
    title: "Передача данных третьим лицам",
    content: [
      "Мы не передаём персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации.",
    ],
  },
  {
    title: "Права пользователей",
    content: [
      "Вы имеете право запросить уточнение, блокирование или уничтожение ваших персональных данных, а также отозвать согласие на их обработку, направив нам соответствующее обращение.",
    ],
  },
  {
    title: "Cookies и технологии отслеживания",
    content: [
      "Сайт может использовать файлы cookies и иные технологии для улучшения работы сервиса и анализа статистики. Вы можете отключить использование cookies в настройках браузера.",
    ],
  },
  {
    title: "Контакты и обратная связь",
    content: [
      "По всем вопросам, связанным с обработкой персональных данных, вы можете связаться с нами через форму на сайте или по контактам, указанным в разделе «Контакты».",
    ],
  },
];

const iconMap: Record<string, typeof Shield> = {
  "Общие положения": Shield,
  "Сбор и использование информации": Database,
  "Защита персональных данных": Lock,
  "Передача данных третьим лицам": Eye,
  "Права пользователей": FileText,
  "Cookies и технологии отслеживания": CheckCircle,
  "Контакты и обратная связь": Mail,
};

export default function PrivacyPage() {
  const [sections, setSections] = useState<DocSection[]>(defaultPrivacySections);
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
            if (parsed.privacy && Array.isArray(parsed.privacy)) {
              setSections(parsed.privacy);
            }
            if (typeof parsed.showContactCta === "boolean") {
              setShowContactCta(parsed.showContactCta);
            }
          } catch {
            // ignore, оставляем дефолтный текст
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
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-2">
                    Политика конфиденциальности
                  </h1>
                  <p className="text-muted-foreground">
                    Дата последнего обновления: {updatedAt}
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 mb-8">
                <p className="text-muted-foreground leading-relaxed">
                  Мы серьёзно относимся к защите ваших персональных данных и соблюдаем требования
                  законодательства Российской Федерации в области защиты персональных данных.
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
                const Icon = iconMap[section.title] || Shield;
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

        {/* CTA */}
        {showContactCta && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-12"
              >
                <h2 className="font-[var(--font-oswald)] text-2xl md:text-3xl font-bold uppercase mb-6 text-center">
                  Вопросы по обработке данных
                </h2>
                <p className="text-muted-foreground mb-8 text-center text-lg">
                  Если у вас есть вопросы по обработке ваших персональных данных, свяжитесь с нами
                  через форму на сайте.
                </p>
                <div className="text-center">
                  <Button
                    asChild
                    className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold px-8 py-6"
                  >
                    <Link href="/#contacts">Связаться с нами</Link>
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


