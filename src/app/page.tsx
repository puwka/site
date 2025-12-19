"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyButton from "@/components/MobileStickyButton";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import { categories } from "@/data/services";
import Link from "next/link";
import {
  Building2,
  Warehouse,
  Factory,
  Sparkles,
  Shovel,
  Users,
  Shield,
  FileCheck,
  Clock,
  CheckCircle2,
  Phone,
  ArrowRight,
  Send,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { sendTelegram } from "@/app/actions/sendTelegram";

type ContactsConfig = {
  phoneNumber: string;
  telegramLink: string;
  whatsappLink: string;
  email: string;
  showAddress?: boolean;
  addressLine?: string;
};

const defaultContactsConfig: ContactsConfig = {
  phoneNumber: "+7 (495) 123-45-67",
  telegramLink: "https://t.me/your_telegram",
  whatsappLink: "https://wa.me/79951234567",
  email: "info@heavyprofile.ru",
  showAddress: true,
  addressLine: "",
};

const serviceIcons = {
  construction: Building2,
  warehouse: Warehouse,
  production: Factory,
  cleaning: Sparkles,
  earthworks: Shovel,
};

type HomeBlocks = {
  hero: boolean;
  heroForm: boolean;
  services: boolean;
  about: boolean;
  howItWorks: boolean;
  contacts: boolean;
};

type HomeTexts = {
  heroSubtitle: string;
  servicesTitle: string;
  servicesSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  howTitle: string;
  contactsCta: string;
};

type HomeImages = {
  heroBg?: string;
  aboutBg?: string;
};

type HomeServiceItem = {
  id: string;
  title: string;
  description: string;
  link?: string;
};

interface HomeAdminConfig {
  blocks: HomeBlocks;
  texts: HomeTexts;
  images?: HomeImages;
  services?: HomeServiceItem[];
}

export default function Home() {
  const [contactsConfig, setContactsConfig] = useState<ContactsConfig | null>(null);
  const phoneLink = (contactsConfig?.phoneNumber || defaultContactsConfig.phoneNumber).replace(
    /[^+\d]/g,
    ""
  );
  const [heroFormData, setHeroFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const [homeConfig, setHomeConfig] = useState<HomeAdminConfig | null>(null);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [aboutImageLoaded, setAboutImageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/home-admin", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as HomeAdminConfig;
        if (isMounted) setHomeConfig(data);
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await fetch("/api/admin/page-texts?key=contacts_config", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.text === "string" && data.text.trim().length > 0) {
            try {
              const parsed = JSON.parse(data.text);
              setContactsConfig({ ...defaultContactsConfig, ...parsed });
            } catch {
              setContactsConfig(defaultContactsConfig);
            }
          } else {
            setContactsConfig(defaultContactsConfig);
          }
        } else {
          setContactsConfig(defaultContactsConfig);
        }
      } catch {
        setContactsConfig(defaultContactsConfig);
      }
    };
    loadContacts();
  }, []);

  // Не используем дефолтные значения, пока данные не загрузились
  // Это предотвращает мигание формы при загрузке
  const blocks: HomeBlocks = homeConfig?.blocks || {
    hero: true,
    heroForm: false, // По умолчанию скрываем, пока не загрузится реальное значение
    services: true,
    about: true,
    howItWorks: true,
    contacts: true,
  };
  
  // Показываем форму только если данные загружены и heroForm === true
  const shouldShowHeroForm = homeConfig !== null && blocks.heroForm;

  const texts: HomeTexts =
    homeConfig?.texts || {
      heroSubtitle:
        "Профессиональный подбор рабочего персонала для строительных объектов, складов, монтажных и промышленных работ",
      servicesTitle: "Наши услуги",
      servicesSubtitle:
        "Полный спектр услуг по подбору рабочего персонала",
      aboutTitle: "Почему выбирают Тяжёлый Профиль",
      aboutText:
        "Мы подбираем не случайных людей, а рабочий персонал, который умеет работать в темпе, соблюдает технику безопасности и выполняет задачи без лишних вопросов.\n\nВсе сотрудники проходят инструктаж и выходят на смены полностью подготовленными — без срывов, опозданий и простоев.\n\nМы работаем так, будто каждый объект — наш собственный: дисциплина, ответственность и контроль качества.",
      howTitle: "Процесс работы",
      contactsCta: "Оставьте заявку или свяжитесь с нами любым удобным способом",
    };

  const images: HomeImages = homeConfig?.images || {};

  const homeServices: HomeServiceItem[] =
    homeConfig?.services && homeConfig.services.length > 0
      ? homeConfig.services
      : categories.map((category) => ({
          id: category.id,
          title: category.name,
          description: category.description,
          link: `/services/${category.slug}`,
        }));

  const heroBg = images.heroBg || "";

  const aboutBg = images.aboutBg || "";

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await sendTelegram({
        name: heroFormData.name,
        phone: heroFormData.phone,
        comment: heroFormData.message,
        sourceUrl: typeof window !== "undefined" ? window.location.href : "/",
        formName: "Форма на главной (Hero)",
      });

      if (result.success) {
        setSubmitStatus("success");
        setHeroFormData({ name: "", phone: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="noise-overlay min-h-screen">
      {/* 1. Header (Global) */}
      <Header />

      {/* 2. Hero Section + Lead Form */}
      {blocks.hero && (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          {heroBg && (
            <Image
              src={heroBg}
              alt="Фон главного экрана"
              fill
              priority
              className={`object-cover transition-opacity duration-700 ${
                heroImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoadingComplete={() => setHeroImageLoaded(true)}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="font-[var(--font-oswald)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 leading-tight text-white"
                >
                  Аутсорсинг рабочего персонала
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl text-white/90 mb-8"
                >
                  {texts.heroSubtitle}
                </motion.p>
              </div>

              {/* Right: Order Form */}
              {shouldShowHeroForm && (
              <motion.div
                  initial={{ opacity: 0, y: 30, backdropFilter: "blur(0px)" }}
                  animate={{ opacity: 1, y: 0, backdropFilter: "blur(24px)" }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="w-full"
                >
                  <div className="relative p-8 md:p-10 rounded-3xl shadow-2xl border
                                  dark:border-white/20 dark:bg-gradient-to-br dark:from-black/40 dark:via-black/60 dark:to-black/40
                                  light:bg-white light:border-zinc-200 light:shadow-xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[oklch(0.75_0.18_50)]/10 rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[oklch(0.75_0.18_50)]/5 rounded-full blur-2xl -z-10" />
                    
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/15 flex items-center justify-center backdrop-blur-sm border border-[oklch(0.75_0.18_50)]/30">
                          <span className="text-2xl">📋</span>
                        </div>
                        <div>
                          <h3 className="font-[var(--font-oswald)] text-2xl md:text-3xl font-bold uppercase dark:text-white light:text-zinc-900 leading-tight">
                            Оставить заявку
                          </h3>
                          <p className="dark:text-white/70 light:text-zinc-600 text-sm mt-1">
                            Ответим в течение 30 минут
                          </p>
                        </div>
                      </div>
                      
                      <form onSubmit={handleHeroSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium dark:text-white/90 light:text-zinc-900">
                            Ваше имя
                          </label>
                          <Input
                            type="text"
                            placeholder="Иван Иванов"
                            value={heroFormData.name}
                            onChange={(e) => setHeroFormData({ ...heroFormData, name: e.target.value })}
                            required
                            className="h-14 text-base transition-all
                                       dark:bg-white/10 dark:border-white/30 dark:text-white dark:placeholder:text-white/50 dark:focus:bg-white/15 dark:focus:border-[oklch(0.75_0.18_50)]/50
                                       light:bg-white light:border-zinc-300 light:text-zinc-900 light:placeholder:text-zinc-400 light:focus:border-[oklch(0.75_0.18_50)]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium dark:text-white/90 light:text-zinc-900">
                            Телефон
                          </label>
                          <Input
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                            value={heroFormData.phone}
                            onChange={(e) => setHeroFormData({ ...heroFormData, phone: e.target.value })}
                            required
                            className="h-14 text-base transition-all
                                       dark:bg-white/10 dark:border-white/30 dark:text-white dark:placeholder:text-white/50 dark:focus:bg-white/15 dark:focus:border-[oklch(0.75_0.18_50)]/50
                                       light:bg-white light:border-zinc-300 light:text-zinc-900 light:placeholder:text-zinc-400 light:focus:border-[oklch(0.75_0.18_50)]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium dark:text-white/90 light:text-zinc-900">
                            Описание задачи
                          </label>
                          <Textarea
                            placeholder="Опишите вашу задачу..."
                            value={heroFormData.message}
                            onChange={(e) => setHeroFormData({ ...heroFormData, message: e.target.value })}
                            rows={4}
                            className="resize-none text-base transition-all
                                       dark:bg-white/10 dark:border-white/30 dark:text-white dark:placeholder:text-white/50 dark:focus:bg-white/15 dark:focus:border-[oklch(0.75_0.18_50)]/50
                                       light:bg-white light:border-zinc-300 light:text-zinc-900 light:placeholder:text-zinc-400 light:focus:border-[oklch(0.75_0.18_50)]"
                          />
                        </div>
                        
                        <ConsentCheckbox />

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] active:bg-[oklch(0.65_0.18_50)] text-black font-bold h-14 text-lg shadow-lg shadow-[oklch(0.75_0.18_50)]/20 hover:shadow-xl hover:shadow-[oklch(0.75_0.18_50)]/30 transition-all duration-300"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              Отправка...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Заказать персонал
                              <ArrowRight className="w-5 h-5" />
                            </span>
                          )}
                        </Button>
                        
                        {submitStatus === "success" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 backdrop-blur-sm"
                          >
                            <p className="text-green-400 text-sm text-center flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-5 h-5" />
                              Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                            </p>
                          </motion.div>
                        )}
                        {submitStatus === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 backdrop-blur-sm"
                          >
                            <p className="text-red-400 text-sm text-center">
                              Ошибка отправки. Попробуйте позже или позвоните нам.
                            </p>
                          </motion.div>
                        )}
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 3. Services Catalog */}
      {blocks.services && (
      <section id="services" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Услуги
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
            >
              {texts.servicesTitle || (
                <>
                  Наши <span className="gradient-text">услуги</span>
                </>
              )}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              {texts.servicesSubtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {homeServices.map((item, index) => {
              const Icon =
                serviceIcons[item.id as keyof typeof serviceIcons] || Building2;
              const href = item.link || "#";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="h-full"
                >
                  <Link href={href}>
                    <Card className="h-full hover:border-[oklch(0.75_0.18_50)]/50 transition-all duration-300 cursor-pointer group relative overflow-hidden bg-card border-2 hover:shadow-2xl hover:shadow-[oklch(0.75_0.18_50)]/10">
                      {/* Hover gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.75_0.18_50)]/0 via-[oklch(0.75_0.18_50)]/0 to-[oklch(0.75_0.18_50)]/0 group-hover:from-[oklch(0.75_0.18_50)]/5 group-hover:via-[oklch(0.75_0.18_50)]/10 group-hover:to-[oklch(0.75_0.18_50)]/5 transition-all duration-500" />
                      
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[oklch(0.75_0.18_50)]/0 group-hover:bg-[oklch(0.75_0.18_50)]/10 rounded-bl-full transition-all duration-500" />
                      
                      <CardContent className="p-8 md:p-10 text-center relative z-10 flex flex-col h-full">
                        <div className="relative mb-6 flex-shrink-0">
                          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.18_50)]/15 to-[oklch(0.75_0.18_50)]/5 flex items-center justify-center mx-auto group-hover:from-[oklch(0.75_0.18_50)]/25 group-hover:to-[oklch(0.75_0.18_50)]/15 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xl group-hover:shadow-[oklch(0.75_0.18_50)]/30 border border-[oklch(0.75_0.18_50)]/20 group-hover:border-[oklch(0.75_0.18_50)]/40">
                            <Icon className="w-12 h-12 md:w-14 md:h-14 text-[oklch(0.75_0.18_50)] group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-[var(--font-oswald)] text-xl md:text-2xl font-bold uppercase mb-3 group-hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                              {item.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-center gap-2 text-[oklch(0.75_0.18_50)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-sm md:text-base mt-auto">
                            <span>Подробнее</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* 4. Advantages / Guarantees */}
      <section className="py-24 md:py-32 relative bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Преимущества
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
            >
              Наши <span className="gradient-text">гарантии</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                icon: Users,
                title: "Резерв 1000+",
                description: "Большая база проверенных сотрудников",
              },
              {
                icon: Clock,
                title: "Быстро",
                description: "Выводим людей в день обращения",
              },
              {
                icon: Shield,
                title: "Надежно",
                description: "Строгий контроль и ответственность",
              },
              {
                icon: FileCheck,
                title: "По договору",
                description: "Юридическая прозрачность",
              },
              {
                icon: CheckCircle2,
                title: "Гарантия",
                description: "Полная ответственность за результат",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-10 h-10 text-[oklch(0.75_0.18_50)]" />
                </div>
                <h3 className="font-[var(--font-oswald)] text-lg font-bold uppercase mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. About Us (SEO Text) */}
      {blocks.about && (
      <section id="about" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4">
                О компании
              </span>
              <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6">
                {texts.aboutTitle}
              </h2>
              <div className="prose prose-invert max-w-none space-y-4">
                {texts.aboutText
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-lg text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
            >
              {aboutBg && (
                <Image
                  src={aboutBg}
                  alt="О компании"
                  fill
                  className={`object-cover transition-opacity duration-700 ${
                    aboutImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoadingComplete={() => setAboutImageLoaded(true)}
                />
              )}
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* 6. Cases / Portfolio (Hidden) */}
      <section className="py-24 md:py-32 relative bg-card" style={{ display: "none" }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h2 className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6">
              Наши <span className="gradient-text">кейсы</span>
            </h2>
            <p className="text-muted-foreground">Портфолио скрыто по требованию</p>
          </div>
        </div>
      </section>

      {/* 7. How it Works (Scheme) */}
      {blocks.howItWorks && (
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Как начать работать?
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-12"
            >
              {texts.howTitle}
            </motion.h2>
          </div>

          {/* Desktop: Horizontal Timeline */}
          <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 relative">
            {[
              { step: "01", title: "ЗАЯВКА", description: "Оставьте заявку через форму или позвоните нам" },
              { step: "02", title: "ПОДБОР", description: "Мы подбираем подходящих специалистов" },
              { step: "03", title: "ВЫХОД", description: "Рабочие прибывают на объект" },
              { step: "04", title: "ОПЛАТА", description: "Расчет после выполнения работ" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center"
              >
                <div className="flex flex-col items-center text-center max-w-[200px]">
                  <div className="w-20 h-20 rounded-full bg-[oklch(0.6_0.15_50)] flex items-center justify-center mb-4 relative z-10">
                    <span className="text-2xl font-bold text-[oklch(0.75_0.18_50)]">{item.step}</span>
                  </div>
                  <h3 className="font-[var(--font-oswald)] text-lg font-bold uppercase mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="w-16 lg:w-24 h-0.5 bg-[oklch(0.75_0.18_50)]/50 mx-2 lg:mx-4" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden space-y-8">
            {[
              { step: "01", title: "ЗАЯВКА", description: "Оставьте заявку через форму или позвоните нам" },
              { step: "02", title: "ПОДБОР", description: "Мы подбираем подходящих специалистов" },
              { step: "03", title: "ВЫХОД", description: "Рабочие прибывают на объект" },
              { step: "04", title: "ОПЛАТА", description: "Расчет после выполнения работ" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-16 rounded-full bg-[oklch(0.6_0.15_50)] flex items-center justify-center relative z-10">
                    <span className="text-xl font-bold text-[oklch(0.75_0.18_50)]">{item.step}</span>
                  </div>
                  {index < 3 && (
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-[oklch(0.75_0.18_50)]/50" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-[var(--font-oswald)] text-lg font-bold uppercase mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 8. Contacts & Footer */}
      {blocks.contacts && (
      <section id="contacts" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block text-[oklch(0.75_0.18_50)] text-sm font-semibold uppercase tracking-widest mb-4"
              >
                Контакты
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-[var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6"
              >
                Свяжитесь <span className="gradient-text">с нами</span>
              </motion.h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {texts.contactsCta}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Phone */}
              <a
                href={`tel:${phoneLink}`}
                className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border hover:border-[oklch(0.75_0.18_50)]/30 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center group-hover:bg-[oklch(0.75_0.18_50)]/20 transition-colors">
                  <Phone className="w-8 h-8 text-[oklch(0.75_0.18_50)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Телефон</p>
                  <p className="font-bold text-lg group-hover:text-[oklch(0.75_0.18_50)] transition-colors">
                    {contactsConfig?.phoneNumber || defaultContactsConfig.phoneNumber}
                  </p>
                </div>
              </a>

              {/* Telegram */}
              <a
                href={contactsConfig?.telegramLink || defaultContactsConfig.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border hover:border-[oklch(0.75_0.18_50)]/30 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center group-hover:bg-[oklch(0.75_0.18_50)]/20 transition-colors">
                  <Send className="w-8 h-8 text-[oklch(0.75_0.18_50)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Telegram</p>
                  <p className="font-bold text-lg group-hover:text-[oklch(0.75_0.18_50)] transition-colors">
                    Написать
                  </p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={
                  contactsConfig?.whatsappLink && contactsConfig.whatsappLink.trim().length > 0
                    ? contactsConfig.whatsappLink
                    : `https://wa.me/${phoneLink.replace("+", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border hover:border-[oklch(0.75_0.18_50)]/30 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center group-hover:bg-[oklch(0.75_0.18_50)]/20 transition-colors">
                  <MessageCircle className="w-8 h-8 text-[oklch(0.75_0.18_50)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">WhatsApp</p>
                  <p className="font-bold text-lg group-hover:text-[oklch(0.75_0.18_50)] transition-colors">
                    Написать
                  </p>
                </div>
              </a>
            </div>

            {contactsConfig?.showAddress !== false &&
              (contactsConfig?.addressLine || (contactsConfig as any)?.mapAddress) && (
                <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                  {contactsConfig?.addressLine || (contactsConfig as any)?.mapAddress}
                </p>
              )}
          </div>
        </div>
      </section>
      )}

      <Footer />
      <MobileStickyButton />
    </main>
  );
}
