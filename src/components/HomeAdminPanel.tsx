"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  HomeBlocks,
  HomeTexts,
  HomeAdminData,
  updateHomeBlocks,
  updateHomeTexts,
  HomeServiceItem,
  updateHomeServices,
  updateHomeImages,
} from "@/app/actions/homeAdmin";
import {
  Settings,
  LayoutPanelTop,
  ListChecks,
  Info,
  Workflow,
  PhoneCall,
  Save,
} from "lucide-react";

interface HomeAdminPanelProps {
  initialData: HomeAdminData;
}

type SectionId = "hero" | "services" | "about" | "howItWorks" | "contacts";

const sectionOrder: SectionId[] = ["hero", "services", "about", "howItWorks", "contacts"];

const sectionLabels: Record<SectionId, string> = {
  hero: "Hero / Первый экран",
  services: "Блок «Наши услуги»",
  about: "Блок «О компании»",
  howItWorks: "Блок «Как мы работаем»",
  contacts: "Блок «Контакты»",
};

export default function HomeAdminPanel({ initialData }: HomeAdminPanelProps) {
  const [blocks, setBlocks] = useState<HomeBlocks>(initialData.blocks);
  const [texts, setTexts] = useState<HomeTexts>(initialData.texts);
  const [images, setImages] = useState<{ heroBg?: string; aboutBg?: string }>(
    initialData.images || {}
  );
  const [services, setServices] = useState<HomeServiceItem[]>(
    initialData.services || []
  );
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);
  const aboutFileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [isSavingBlocks, setIsSavingBlocks] = useState(false);
  const [isSavingTexts, setIsSavingTexts] = useState(false);
  const [isSavingServices, setIsSavingServices] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleToggleBlock = (key: keyof HomeBlocks) => {
    setBlocks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveBlocks = async () => {
    setIsSavingBlocks(true);
    setStatus("idle");
    try {
      const result = await updateHomeBlocks(blocks);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSavingBlocks(false);
    }
  };

  const handleSaveTexts = async () => {
    setIsSavingTexts(true);
    setStatus("idle");
    try {
      const partial: Partial<HomeTexts> = {};
      Object.assign(partial, texts);
      const textsResult = await updateHomeTexts(partial);
      // Одновременно сохраняем состояние блоков (в том числе heroForm),
      // чтобы переключатель формы заявки не требовал отдельной кнопки
      const blocksResult = await updateHomeBlocks(blocks);
      const imagesResult = await updateHomeImages(images);
      if (textsResult.success && blocksResult.success && imagesResult.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSavingTexts(false);
    }
  };

  const handleImageUpload = async (field: "heroBg" | "aboutBg", file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);

    try {
      const res = await fetch("/api/admin/home-images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImages((prev) => ({ ...prev, [field]: data.url }));
        setStatus("success");
      } else {
        console.error("Upload failed:", data.message || data.error);
        alert(data.message || data.error || "Ошибка загрузки файла");
        setStatus("error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Ошибка загрузки: ${error instanceof Error ? error.message : String(error)}`);
      setStatus("error");
    }
  };

  const handleAddService = () => {
    const newItem: HomeServiceItem = {
      id: `service-${Date.now()}`,
      title: "Новая услуга",
      description: "",
      link: "",
    };
    setServices((prev) => [...prev, newItem]);
  };

  const handleUpdateService = (
    id: string,
    patch: Partial<HomeServiceItem>
  ) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveServices = async () => {
    setIsSavingServices(true);
    setStatus("idle");
    try {
      const result = await updateHomeServices(services);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSavingServices(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Верхний summary-блок */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/15 flex items-center justify-center">
              <Settings className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
            </div>
            <div>
              <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase">
                Главная страница
              </h2>
              <p className="text-sm text-muted-foreground">
                Включайте/выключайте блоки и редактируйте тексты, как на лендинге.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Две колонки: слева — блоки, справа — содержимое выбранного блока */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левый столбец: список блоков */}
        <Card className="border-zinc-800 bg-zinc-900/70 lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-[var(--font-oswald)] text-lg uppercase flex items-center gap-2">
              <LayoutPanelTop className="w-4 h-4" />
              Блоки страницы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sectionOrder.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                  activeSection === section
                    ? "border-[oklch(0.75_0.18_50)] bg-[oklch(0.75_0.18_50)]/10 text-foreground"
                    : "border-zinc-800 bg-zinc-900/40 text-muted-foreground hover:border-zinc-700 hover:text-foreground"
                }`}
              >
                <span className="text-sm">{sectionLabels[section]}</span>
                {/* Переключатель включения/выключения блока, как в админке лендинга */}
                <div
                  role="switch"
                  aria-checked={blocks[section]}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBlock(section);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    blocks[section]
                      ? "bg-[oklch(0.75_0.18_50)]"
                      : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      blocks[section] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </button>
            ))}

            <Button
              type="button"
              onClick={handleSaveBlocks}
              disabled={isSavingBlocks}
              className="w-full mt-2 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
            >
              {isSavingBlocks ? "Сохранение..." : "Сохранить блоки"}
            </Button>
          </CardContent>
        </Card>

        {/* Правый столбец: редактор выбранного блока */}
        <Card className="border-zinc-800 bg-zinc-900/70 lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-[var(--font-oswald)] text-lg uppercase flex items-center gap-2">
              {activeSection === "hero" && <Info className="w-4 h-4" />}
              {activeSection === "services" && <ListChecks className="w-4 h-4" />}
              {activeSection === "about" && <Info className="w-4 h-4" />}
              {activeSection === "howItWorks" && <Workflow className="w-4 h-4" />}
              {activeSection === "contacts" && <PhoneCall className="w-4 h-4" />}
              {sectionLabels[activeSection]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeSection === "hero" && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Фоновое изображение Hero
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-[2fr,1.2fr] gap-4 items-center">
                    <div className="h-32 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                      {images.heroBg ? (
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${images.heroBg}')` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          Превью появится после загрузки
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {/* Красивая кнопка выбора файла */}
                      <div className="flex flex-col gap-2">
                        <input
                          ref={heroFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload("heroBg", file);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="justify-center border-dashed border-[oklch(0.75_0.18_50)]/40 bg-zinc-950/60 hover:bg-zinc-900 hover:border-[oklch(0.75_0.18_50)] text-xs sm:text-sm"
                          onClick={() => heroFileInputRef.current?.click()}
                        >
                          Загрузить изображение с устройства
                        </Button>
                        <p className="text-[10px] text-muted-foreground">
                          PNG / JPG до 5МБ. Рекомендуемый размер ~ 1920×1080.
                        </p>
                      </div>
                      <Input
                        type="text"
                        placeholder="Или вставьте URL картинки"
                        value={images.heroBg || ""}
                        onChange={(e) =>
                          setImages((prev) => ({ ...prev, heroBg: e.target.value }))
                        }
                        className="bg-zinc-950 border-zinc-800"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Подзаголовок Hero
                  </label>
                  <Textarea
                    value={texts.heroSubtitle}
                    onChange={(e) =>
                      setTexts({ ...texts, heroSubtitle: e.target.value })
                    }
                    className="bg-zinc-950 border-zinc-800 min-h-[140px]"
                  />
                </div>

                {/* Переключатель формы заявки на первом экране */}
                <div className="mt-4 p-4 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Форма заявки на первом экране
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      При отключении будет показан только текст Hero, без формы справа.
                    </p>
                  </div>
                  <div
                    role="switch"
                    aria-checked={blocks.heroForm}
                    onClick={() => handleToggleBlock("heroForm")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      blocks.heroForm
                        ? "bg-[oklch(0.75_0.18_50)]"
                        : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                        blocks.heroForm ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "services" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block">
                      Заголовок блока услуг
                    </label>
                    <Input
                      value={texts.servicesTitle}
                      onChange={(e) =>
                        setTexts({ ...texts, servicesTitle: e.target.value })
                      }
                      className="bg-zinc-950 border-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block">
                      Подзаголовок / описание
                    </label>
                    <Textarea
                      value={texts.servicesSubtitle}
                      onChange={(e) =>
                        setTexts({ ...texts, servicesSubtitle: e.target.value })
                      }
                      className="bg-zinc-950 border-zinc-800 min-h-[120px]"
                    />
                  </div>
                </div>

                {/* Управление карточками услуг на главной */}
                <div className="pt-4 border-t border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Карточки услуг на главной
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Эти услуги показываются в блоке «Наши услуги» на главной
                        странице. Можно добавить, отредактировать или удалить
                        карточки.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddService}
                      className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black text-xs sm:text-sm"
                    >
                      Добавить услугу
                    </Button>
                  </div>

                  {services.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Пока нет ни одной услуги. Нажмите «Добавить услугу», чтобы
                      создать первую карточку.
                    </p>
                  )}

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <Input
                            value={service.title}
                            onChange={(e) =>
                              handleUpdateService(service.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder="Название услуги"
                            className="bg-zinc-950 border-zinc-800 text-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            ×
                          </Button>
                        </div>
                        <Textarea
                          value={service.description}
                          onChange={(e) =>
                            handleUpdateService(service.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Краткое описание услуги"
                          className="bg-zinc-950 border-zinc-800 text-xs min-h-[60px]"
                        />
                        <Input
                          value={service.link || ""}
                          onChange={(e) =>
                            handleUpdateService(service.id, {
                              link: e.target.value,
                            })
                          }
                          placeholder="Ссылка на страницу услуги (например, /services/construction)"
                          className="bg-zinc-950 border-zinc-800 text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleSaveServices}
                      disabled={isSavingServices}
                      className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)] text-xs sm:text-sm"
                    >
                      {isSavingServices ? "Сохранение..." : "Сохранить услуги"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "about" && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Фоновое изображение блока «О компании»
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-[2fr,1.2fr] gap-4 items-center">
                    <div className="h-32 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                      {images.aboutBg ? (
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${images.aboutBg}')` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          Превью появится после загрузки
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2">
                        <input
                          ref={aboutFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload("aboutBg", file);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="justify-center border-dashed border-[oklch(0.75_0.18_50)]/40 bg-zinc-950/60 hover:bg-zinc-900 hover:border-[oklch(0.75_0.18_50)] text-xs sm:text-sm"
                          onClick={() => aboutFileInputRef.current?.click()}
                        >
                          Загрузить изображение с устройства
                        </Button>
                        <p className="text-[10px] text-muted-foreground">
                          PNG / JPG до 5МБ. Рекомендуемый размер ~ 1920×1080.
                        </p>
                      </div>
                      <Input
                        type="text"
                        placeholder="Или вставьте URL картинки"
                        value={images.aboutBg || ""}
                        onChange={(e) =>
                          setImages((prev) => ({ ...prev, aboutBg: e.target.value }))
                        }
                        className="bg-zinc-950 border-zinc-800"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block">
                    Заголовок блока «О компании»
                  </label>
                  <Input
                    value={texts.aboutTitle}
                    onChange={(e) =>
                      setTexts({ ...texts, aboutTitle: e.target.value })
                    }
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block">
                    Основной текст
                  </label>
                  <Textarea
                    value={texts.aboutText}
                    onChange={(e) =>
                      setTexts({ ...texts, aboutText: e.target.value })
                    }
                    className="bg-zinc-950 border-zinc-800 min-h-[180px]"
                  />
                </div>
              </div>
            )}

            {activeSection === "howItWorks" && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground block">
                  Заголовок блока «Как мы работаем»
                </label>
                <Input
                  value={texts.howTitle}
                  onChange={(e) =>
                    setTexts({ ...texts, howTitle: e.target.value })
                  }
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>
            )}

            {activeSection === "contacts" && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground block">
                  Текст призыва к действию в блоке контактов
                </label>
                <Textarea
                  value={texts.contactsCta}
                  onChange={(e) =>
                    setTexts({ ...texts, contactsCta: e.target.value })
                  }
                  className="bg-zinc-950 border-zinc-800 min-h-[140px]"
                />
              </div>
            )}

            <Button
              type="button"
              onClick={handleSaveTexts}
              disabled={isSavingTexts}
              className="mt-2 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
            >
              {isSavingTexts ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Сохранение...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Сохранить тексты
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-500/20 border border-green-500/30"
        >
          <p className="text-green-400 text-sm">
            ✓ Изменения главной страницы сохранены
          </p>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/20 border border-red-500/30"
        >
          <p className="text-red-400 text-sm">
            Ошибка сохранения. Попробуйте позже.
          </p>
        </motion.div>
      )}
    </div>
  );
}


