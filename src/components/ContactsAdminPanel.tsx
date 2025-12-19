"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Phone, Mail, MapPin, Clock, Save } from "lucide-react";
import { updatePageText } from "@/app/actions/adminPages";

interface ContactsAdminPanelProps {
  initialConfig?: string | null;
}

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
  mapAddress?: string;
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
  mapAddress: "",
  showHero: true,
  showInfo: true,
  showForm: true,
  showMap: true,
  showAddress: true,
  addressLine: "",
};

export default function ContactsAdminPanel({ initialConfig }: ContactsAdminPanelProps) {
  const [config, setConfig] = useState<ContactsConfig>(() => {
    if (initialConfig) {
      try {
        const parsed = JSON.parse(initialConfig);
        return { ...defaultContactsConfig, ...parsed };
      } catch {
        return defaultContactsConfig;
      }
    }
    return defaultContactsConfig;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{ displayName: string; lat: string; lon: string }>
  >([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");
    try {
      const res = await updatePageText("contacts_config", JSON.stringify(config));
      if (res.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearchAddress = async (value: string) => {
    setAddressQuery(value);
    setConfig((prev) => ({ ...prev, mapAddress: value }));

    if (value.trim().length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setIsSearchingAddress(true);
    try {
      const res = await fetch(`/api/maps/search?q=${encodeURIComponent(value)}`);
      if (!res.ok) {
        setAddressSuggestions([]);
        return;
      }
      const data = await res.json();
      setAddressSuggestions(data.results || []);
    } catch {
      setAddressSuggestions([]);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-border bg-card/60">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/15 flex items-center justify-center">
              <Settings className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
            </div>
            <div>
              <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase">
                Страница «Контакты»
              </h2>
              <p className="text-sm text-muted-foreground">
                Управляйте блоками, формой и данными для страницы контактов.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка: тумблеры блоков */}
        <Card className="border-border bg-card/70 lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-[var(--font-oswald)] text-lg uppercase flex items-center gap-2">
              Блоки страницы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: "showHero", label: "Hero (заголовок и подзаголовок)" },
              { key: "showInfo", label: "Блок с контактами и реквизитами" },
              { key: "showForm", label: "Форма обратной связи" },
              { key: "showMap", label: "Блок с картой" },
              { key: "showAddress", label: "Показывать адрес компании на всех страницах" },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between gap-4 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span className="text-foreground flex-1 leading-snug">{item.label}</span>
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof ContactsConfig],
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config[item.key as keyof ContactsConfig]
                      ? "bg-[oklch(0.75_0.18_50)]"
                      : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      config[item.key as keyof ContactsConfig] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Правая часть: данные контактов и карты */}
        <Card className="border-border bg-card/70 lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-[var(--font-oswald)] text-lg uppercase flex items-center gap-2">
              Основные данные
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hero subtitle */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Подзаголовок Hero
              </label>
              <Input
                value={config.heroSubtitle}
                onChange={(e) => setConfig((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                className="bg-background border-border"
              />
            </div>

            {/* Контакты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Телефон (отображаемый)
                </label>
                <Input
                  value={config.phoneNumber}
                  onChange={(e) => setConfig((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1">
                  Email
                </label>
                <Input
                  value={config.email}
                  onChange={(e) => setConfig((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1">
                  Ссылка на Telegram
                </label>
                <Input
                  value={config.telegramLink}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, telegramLink: e.target.value }))
                  }
                  placeholder="https://t.me/..."
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1">
                  Ссылка на WhatsApp (опционально)
                </label>
                <Input
                  value={config.whatsappLink}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, whatsappLink: e.target.value }))
                  }
                  placeholder="https://wa.me/..."
                  className="bg-background border-border"
                />
              </div>
            </div>

            {/* Режим работы */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Режим работы
              </label>
              <Input
                value={config.scheduleMain}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, scheduleMain: e.target.value }))
                }
                className="bg-background border-border mb-2"
              />
              <Input
                value={config.scheduleNote}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, scheduleNote: e.target.value }))
                }
                className="bg-background border-border"
              />
            </div>

            {/* Реквизиты */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Реквизиты
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">ИНН</label>
                  <Input
                    value={config.inn}
                    onChange={(e) => setConfig((prev) => ({ ...prev, inn: e.target.value }))}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">ОГРН</label>
                  <Input
                    value={config.ogrn}
                    onChange={(e) => setConfig((prev) => ({ ...prev, ogrn: e.target.value }))}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Название компании
                  </label>
                  <Input
                    value={config.companyName}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, companyName: e.target.value }))
                    }
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Адрес компании (отображается на сайте, если включён переключатель выше)
                </label>
                <Input
                  value={config.addressLine || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, addressLine: e.target.value }))
                  }
                  placeholder="Например: г. Москва, Красная площадь, д. 4"
                  className="bg-background border-border"
                />
              </div>
            </div>

            {/* Карта */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Заголовок блока карты
                </label>
                <Input
                  value={config.mapTitle}
                  onChange={(e) => setConfig((prev) => ({ ...prev, mapTitle: e.target.value }))}
                  className="bg-background border-border mb-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-foreground mb-1 block">
                  Адрес (введите и выберите из списка)
                </label>
                <Input
                  value={config.mapAddress ?? ""}
                  onChange={(e) => handleSearchAddress(e.target.value)}
                  placeholder="Например: Москва, Красная площадь 1"
                  className="bg-background border-border text-sm"
                />
                {isSearchingAddress && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Поиск адреса...
                  </p>
                )}
                {addressSuggestions.length > 0 && (
                  <div className="mt-1 max-h-48 overflow-auto rounded-lg border border-border bg-background text-xs shadow-lg">
                    {addressSuggestions.map((item, index) => (
                      <button
                        key={`${item.lat}-${item.lon}-${index}`}
                        type="button"
                        onClick={() => {
                          // Формируем ссылку только для Яндекс.Карт по координатам
                          const iframe = `https://yandex.ru/map-widget/v1/?ll=${item.lon}%2C${item.lat}&z=16&pt=${item.lon},${item.lat}`;
                          setConfig((prev) => ({
                            ...prev,
                            mapAddress: item.displayName,
                            mapIframeSrc: iframe,
                          }));
                          setAddressSuggestions([]);
                          setAddressQuery(item.displayName);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-zinc-800/70 border-b border-border last:border-b-0"
                      >
                        {item.displayName}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  При выборе адреса карта автоматически обновится (Google Maps).
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Продвинутый режим: своя ссылка iframe (если нужно переопределить)
                </label>
                <Textarea
                  value={config.mapIframeSrc}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, mapIframeSrc: e.target.value }))
                  }
                  className="bg-background border-border min-h-[80px] text-xs"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="mt-2 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Сохранение...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Сохранить изменения
                </span>
              )}
            </Button>

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-sm text-green-400"
              >
                Настройки страницы «Контакты» сохранены.
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-sm text-red-400"
              >
                Ошибка сохранения. Попробуйте позже.
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


