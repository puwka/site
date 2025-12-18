"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyButton from "@/components/MobileStickyButton";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { sendTelegram } from "@/app/actions/sendTelegram";
import { useEffect, useState } from "react";
import ConsentCheckbox from "@/components/ConsentCheckbox";

type ContactsConfig = {
  heroSubtitle: string;
  phoneNumber: string;
  telegramLink: string;
  whatsappLink: string;
  email: string;
  scheduleMain: string;
  scheduleNote: string;
  inn: string;
  ogrn: string;
  companyName: string;
  mapTitle: string;
  mapIframeSrc: string;
  showHero: boolean;
  showInfo: boolean;
  showForm: boolean;
  showMap: boolean;
   showAddress?: boolean;
   addressLine?: string;
};

const defaultContactsConfig: ContactsConfig = {
  heroSubtitle: "Свяжитесь с нами любым удобным способом",
  phoneNumber: "+7 (495) 123-45-67",
  telegramLink: "https://t.me/your_telegram",
  whatsappLink: "",
  email: "info@heavyprofile.ru",
  scheduleMain: "Прием заявок круглосуточно",
  scheduleNote: "Работаем 24/7",
  inn: "123456789012",
  ogrn: "1234567890123",
  companyName: "ООО \"Тяжёлый Профиль\"",
  mapTitle: "Как нас найти",
  mapIframeSrc:
    "https://yandex.ru/map-widget/v1/?um=constructor%3A1a2b3c4d5e6f7g8h9i0j&source=constructor",
  showHero: true,
  showInfo: true,
  showForm: true,
  showMap: true,
  showAddress: true,
  addressLine: "",
};

export default function ContactsPageClient() {
  const [config, setConfig] = useState<ContactsConfig | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/admin/page-texts?key=contacts_config", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.text === "string" && data.text.trim().length > 0) {
            try {
              const parsed = JSON.parse(data.text);
              setConfig({ ...defaultContactsConfig, ...parsed });
            } catch {
              setConfig(defaultContactsConfig);
            }
          } else {
            setConfig(defaultContactsConfig);
          }
        } else {
          setConfig(defaultContactsConfig);
        }
      } catch {
        setConfig(defaultContactsConfig);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    loadConfig();
  }, []);

  const effectiveConfig = config || defaultContactsConfig;

  const phoneLink = effectiveConfig.phoneNumber.replace(/[^+\d]/g, "");
  const whatsappLink =
    effectiveConfig.whatsappLink && effectiveConfig.whatsappLink.trim().length > 0
      ? effectiveConfig.whatsappLink
      : `https://wa.me/${phoneLink.replace("+", "")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await sendTelegram({
        name: formData.name,
        phone: formData.phone,
        comment: formData.message,
        sourceUrl: typeof window !== "undefined" ? window.location.href : "/contacts",
        formName: "Форма обратной связи (Контакты)",
      });

      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", message: "" });
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
      <Header />

      {/* Hero Section */}
      {effectiveConfig.showHero && (
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
                <span className="text-foreground">Контакты</span>
              </nav>

              <h1 className="font-[var(--font-oswald)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
                <span className="gradient-text">Контакты</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                {effectiveConfig.heroSubtitle}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      {(effectiveConfig.showInfo || effectiveConfig.showForm) && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`grid grid-cols-1 gap-12 ${effectiveConfig.showInfo && effectiveConfig.showForm ? "lg:grid-cols-2" : ""}`}>
              {/* Left Column: Contact Information */}
              {effectiveConfig.showInfo && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  {/* Phone */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
                      </div>
                      <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase">
                        Телефон
                      </h3>
                    </div>
                    <a
                      href={`tel:${phoneLink}`}
                      className="text-3xl md:text-4xl font-bold text-[oklch(0.75_0.18_50)] hover:text-[oklch(0.7_0.18_50)] transition-colors block"
                    >
                      {effectiveConfig.phoneNumber}
                    </a>
                  </div>

                  {/* Messengers */}
                  <div>
                    <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase mb-4">
                      Мессенджеры
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {effectiveConfig.telegramLink && (
                        <a
                          href={effectiveConfig.telegramLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <Card className="border-zinc-800 hover:border-[oklch(0.75_0.18_50)]/50 transition-all cursor-pointer h-full">
                            <CardContent className="p-6 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-[#0088cc]/20 group-hover:bg-[#0088cc]/30 flex items-center justify-center transition-colors">
                                <MessageCircle className="w-6 h-6 text-[#0088cc]" />
                              </div>
                              <div>
                                <p className="font-semibold mb-1">Telegram</p>
                                <p className="text-sm text-muted-foreground">Написать нам</p>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      )}

                      {whatsappLink && (
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <Card className="border-zinc-800 hover:border-[oklch(0.75_0.18_50)]/50 transition-all cursor-pointer h-full">
                            <CardContent className="p-6 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 group-hover:bg-[#25D366]/30 flex items-center justify-center transition-colors">
                                <MessageCircle className="w-6 h-6 text-[#25D366]" />
                              </div>
                              <div>
                                <p className="font-semibold mb-1">WhatsApp</p>
                                <p className="text-sm text-muted-foreground">Написать нам</p>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
                      </div>
                      <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase">
                        Email
                      </h3>
                    </div>
                    <a
                      href={`mailto:${effectiveConfig.email}`}
                      className="text-lg text-muted-foreground hover:text-[oklch(0.75_0.18_50)] transition-colors"
                    >
                      {effectiveConfig.email}
                    </a>
                  </div>

                  {/* Schedule */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
                      </div>
                      <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase">
                        Режим работы
                      </h3>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      {effectiveConfig.scheduleMain}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {effectiveConfig.scheduleNote}
                    </p>
                  </div>

                  {/* Address */}
                  {effectiveConfig.showAddress !== false &&
                    (effectiveConfig.addressLine || (config as any)?.mapAddress) && (
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
                          </div>
                          <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase">
                            Адрес
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {effectiveConfig.addressLine || (config as any)?.mapAddress}
                        </p>
                      </div>
                    )}

                  {/* Legal Info */}
                  <div className="pt-6 border-t border-zinc-800">
                    <h3 className="font-[var(--font-oswald)] text-lg font-bold uppercase mb-4">
                      Реквизиты
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>ИНН: {effectiveConfig.inn}</p>
                      <p>ОГРН: {effectiveConfig.ogrn}</p>
                      <p className="mt-4 text-xs">
                        {effectiveConfig.companyName}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Right Column: Feedback Form */}
              {effectiveConfig.showForm && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="dark:border-zinc-800 dark:bg-zinc-900/50 light:border-zinc-200 light:bg-white shadow-sm">
                    <CardContent className="p-8">
                      <h2 className="font-[var(--font-oswald)] text-2xl md:text-3xl font-bold uppercase mb-2">
                        Остались вопросы?
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Напишите нам, и мы свяжемся с вами в ближайшее время
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Ваше имя *
                          </label>
                          <Input
                            type="text"
                            placeholder="Иван Иванов"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="dark:bg-zinc-950 dark:border-zinc-800 light:bg-white light:border-zinc-300"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Телефон *
                          </label>
                          <Input
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="dark:bg-zinc-950 dark:border-zinc-800 light:bg-white light:border-zinc-300"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Сообщение
                          </label>
                          <Textarea
                            placeholder="Опишите ваш вопрос или задачу..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={5}
                            className="resize-none dark:bg-zinc-950 dark:border-zinc-800 light:bg-white light:border-zinc-300"
                          />
                        </div>

                    <ConsentCheckbox />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold h-12 text-base uppercase font-[var(--font-oswald)]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Отправка...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Отправить
                          <Send className="w-5 h-5" />
                        </span>
                      )}
                    </Button>

                        {submitStatus === "success" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-green-500/20 border border-green-500/30"
                          >
                            <p className="text-green-400 text-sm text-center">
                              ✓ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.
                            </p>
                          </motion.div>
                        )}

                        {submitStatus === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-red-500/20 border border-red-500/30"
                          >
                            <p className="text-red-400 text-sm text-center">
                              Ошибка отправки. Попробуйте позже или позвоните нам.
                            </p>
                          </motion.div>
                        )}
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Map Section */}
      {effectiveConfig.showMap && effectiveConfig.mapIframeSrc && (
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
                </div>
                <h2 className="font-[var(--font-oswald)] text-2xl md:text-3xl font-bold uppercase">
                  {effectiveConfig.mapTitle}
                </h2>
              </div>

              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-zinc-800">
                <iframe
                  src={effectiveConfig.mapIframeSrc}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="dark-map-filter"
                  style={{
                    filter: "grayscale(100%) invert(90%) contrast(85%)",
                  }}
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
      <MobileStickyButton />
    </main>
  );
}

