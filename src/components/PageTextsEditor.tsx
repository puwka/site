"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { updatePageText } from "@/app/actions/adminPages";

type TabId = "home" | "about" | "contacts" | "services";

const homeTextBlocks = [
  {
    key: "home_hero_subtitle",
    label: "Подзаголовок в Hero на главной",
    defaultValue:
      "Профессиональный подбор рабочего персонала для строительных объектов, складов, монтажных и промышленных работ",
  },
];

const aboutTextBlocks = [
  {
    key: "about_mission_text",
    label: "Текст миссии (О компании)",
    defaultValue:
      "Мы предоставляем рабочий персонал, который умеет работать в темпе, соблюдает технику безопасности и выполняет задачи без лишних вопросов.\n\nВсе сотрудники проходят инструктаж и выходят на смены полностью подготовленными — без срывов, опозданий и простоев.\n\nМы работаем так, будто каждый объект — наш собственный: дисциплина, ответственность и контроль качества.",
  },
];

const servicesTextBlocks = [
  {
    key: "services_page_title",
    label: "Заголовок страницы каталога",
    defaultValue: "Каталог услуг:",
  },
  {
    key: "services_page_subtitle",
    label: "Подзаголовок страницы каталога",
    defaultValue:
      "Аутсорсинг рабочего персонала для складских и производственных объектов любого масштаба.",
  },
];

export default function PageTextsEditor({ initialTab }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<TabId>(
    initialTab === "about" || initialTab === "contacts" || initialTab === "services"
      ? (initialTab as TabId)
      : "home"
  );

  const [homeBlocks, setHomeBlocks] = useState({
    hero: true,
    services: true,
    about: true,
    howItWorks: true,
    contacts: true,
  });

  const [texts, setTexts] = useState<Record<string, string>>({
    ...Object.fromEntries(homeTextBlocks.map((b) => [b.key, b.defaultValue])),
    ...Object.fromEntries(aboutTextBlocks.map((b) => [b.key, b.defaultValue])),
    ...Object.fromEntries(servicesTextBlocks.map((b) => [b.key, b.defaultValue])),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем сохраненные тексты из БД
  useEffect(() => {
    const loadTexts = async () => {
      try {
        const allBlocks = [...homeTextBlocks, ...aboutTextBlocks, ...servicesTextBlocks];
        const loadedTexts: Record<string, string> = {};

        for (const block of allBlocks) {
          try {
            const res = await fetch(`/api/admin/page-texts?key=${block.key}`, {
              cache: "no-store",
            });
            if (res.ok) {
              const data = await res.json();
              if (data.text && data.text.trim()) {
                loadedTexts[block.key] = data.text;
              } else {
                loadedTexts[block.key] = block.defaultValue;
              }
            } else {
              loadedTexts[block.key] = block.defaultValue;
            }
          } catch {
            loadedTexts[block.key] = block.defaultValue;
          }
        }

        setTexts(loadedTexts);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    loadTexts();
  }, []);

  const handleSaveText = async (key: string) => {
    setIsSaving(true);
    setStatus("idle");

    try {
      const result = await updatePageText(key, texts[key]);
      if (result.success) {
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

  const handleSaveBlocks = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      // Сохраняем конфиг блоков как JSON‑строку под отдельным ключом
      const result = await updatePageText("home_blocks", JSON.stringify(homeBlocks));
      if (result.success) {
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

  const currentBlocks =
    activeTab === "home"
      ? homeTextBlocks
      : activeTab === "about"
      ? aboutTextBlocks
      : activeTab === "services"
      ? servicesTextBlocks
      : [];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-4">
        {[
          { id: "home" as TabId, label: "Главная" },
          { id: "about" as TabId, label: "О компании" },
          { id: "services" as TabId, label: "Каталог" },
          { id: "contacts" as TabId, label: "Контакты" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[oklch(0.75_0.18_50)] text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Home tab: blocks + texts */}
      {activeTab === "home" && (
        <>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-[var(--font-oswald)] text-xl uppercase">
                Блоки главной страницы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: "hero" as const, label: "Hero / Первый экран" },
                { key: "services" as const, label: "Наши услуги" },
                { key: "about" as const, label: "О компании" },
                { key: "howItWorks" as const, label: "Как мы работаем" },
                { key: "contacts" as const, label: "Контакты" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="text-foreground">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={homeBlocks[item.key]}
                    onChange={(e) =>
                      setHomeBlocks((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="h-4 w-4 accent-[oklch(0.75_0.18_50)]"
                  />
                </label>
              ))}

              <Button
                type="button"
                onClick={handleSaveBlocks}
                disabled={isSaving}
                className="mt-2 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
              >
                Сохранить блоки
              </Button>
            </CardContent>
          </Card>

          {currentBlocks.map((block) => (
            <Card key={block.key} className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-[var(--font-oswald)] text-xl uppercase">
                  {block.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={texts[block.key]}
                  onChange={(e) =>
                    setTexts({ ...texts, [block.key]: e.target.value })
                  }
                  className="bg-background border-border min-h-[160px]"
                />
                <Button
                  type="button"
                  onClick={() => handleSaveText(block.key)}
                  disabled={isSaving}
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить текст
                </Button>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* About tab */}
      {activeTab === "about" && (
        <>
          {aboutTextBlocks.map((block) => (
            <Card key={block.key} className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-[var(--font-oswald)] text-xl uppercase">
                  {block.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={texts[block.key]}
                  onChange={(e) =>
                    setTexts({ ...texts, [block.key]: e.target.value })
                  }
                  className="bg-background border-border min-h-[200px]"
                />
                <Button
                  type="button"
                  onClick={() => handleSaveText(block.key)}
                  disabled={isSaving}
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить текст
                </Button>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* Services tab */}
      {activeTab === "services" && (
        <>
          {servicesTextBlocks.map((block) => (
            <Card key={block.key} className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-[var(--font-oswald)] text-xl uppercase">
                  {block.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={texts[block.key] || ""}
                  onChange={(e) =>
                    setTexts({ ...texts, [block.key]: e.target.value })
                  }
                  className="bg-background border-border min-h-[120px]"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={() => handleSaveText(block.key)}
                  disabled={isSaving || isLoading}
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить текст
                </Button>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* Contacts tab – пока заглушка */}
      {activeTab === "contacts" && (
        <p className="text-sm text-muted-foreground">
          Управление текстами и блоками страницы контактов будет добавлено позже.
        </p>
      )}

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-500/20 border border-green-500/30"
        >
          <p className="text-green-400 text-sm">✓ Изменения сохранены</p>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/20 border border-red-500/30"
        >
          <p className="text-red-400 text-sm">Ошибка сохранения. Попробуйте позже.</p>
        </motion.div>
      )}
    </div>
  );
}


