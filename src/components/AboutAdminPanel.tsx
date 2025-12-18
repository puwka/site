"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { updatePageText } from "@/app/actions/adminPages";

interface AboutAdminPanelProps {
  initialMissionText: string;
  initialConfig?: string | null;
}

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

export default function AboutAdminPanel({ initialMissionText, initialConfig }: AboutAdminPanelProps) {
  const [text, setText] = useState<string>(
    initialMissionText ||
      "Мы предоставляем рабочий персонал, который умеет работать в темпе, соблюдает технику безопасности и выполняет задачи без лишних вопросов.\n\nВсе сотрудники проходят инструктаж и выходят на смены полностью подготовленными — без срывов, опозданий и простоев.\n\nМы работаем так, будто каждый объект — наш собственный: дисциплина, ответственность и контроль качества."
  );
  const [config, setConfig] = useState<AboutConfig>(() => {
    if (initialConfig) {
      try {
        const parsed = JSON.parse(initialConfig);
        return { ...defaultConfig, ...parsed };
      } catch {
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveMission = async () => {
    setIsSaving(true);
    setStatus("idle");
    try {
      const res = await updatePageText("about_mission_text", text);
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

  const handleSaveConfig = async () => {
    setIsSaving(true);
    setStatus("idle");
    try {
      const res = await updatePageText("about_config", JSON.stringify(config));
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

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus("idle");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        setStatus("error");
        alert(data.error || "Ошибка загрузки файла");
        return;
      }

      setConfig((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, data.url as string],
      }));
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Блоки и форма */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="font-[var(--font-oswald)] text-xl uppercase">
            Блоки страницы «О компании»
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: "showMission", label: "Основной блок: текст + фотогалерея" },
            { key: "showStats", label: "Блок с цифрами (1000+, 24/7 и т.д.)" },
            { key: "showAdvantages", label: "Блок «Почему нам доверяют сложные объекты»" },
            { key: "showQuote", label: "Цитата / философия компании" },
            { key: "showCta", label: "Блок «Готовы начать?»" },
            { key: "showForm", label: "Форма заявки в блоке «Готовы начать?»" },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 px-3 py-2 text-sm"
            >
              <span className="text-foreground">{item.label}</span>
              <button
                type="button"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof AboutConfig],
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config[item.key as keyof AboutConfig]
                    ? "bg-[oklch(0.75_0.18_50)]"
                    : "bg-zinc-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                    config[item.key as keyof AboutConfig] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          ))}

          <Button
            type="button"
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="mt-2 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Сохранение..." : "Сохранить блоки"}
          </Button>
        </CardContent>
      </Card>

      {/* Галерея фото */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="font-[var(--font-oswald)] text-xl uppercase">
            Фотографии для блока «Мы подбираем не случайных людей»
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Эти фотографии используются в карусели справа. Если список пустой,
            будут отображаться стандартные изображения.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadImage}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="border-zinc-700 text-xs"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Загрузка...
                  </span>
                ) : (
                  "Загрузить с устройства"
                )}
              </Button>
              <span className="text-[10px] text-muted-foreground">
                JPG / PNG / WebP до 5МБ
              </span>
            </div>

            {config.galleryImages.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                <Textarea
                  value={url}
                  onChange={(e) =>
                    setConfig((prev) => {
                      const next = [...prev.galleryImages];
                      next[index] = e.target.value;
                      return { ...prev, galleryImages: next };
                    })
                  }
                  className="bg-zinc-950 border-zinc-800 text-xs flex-1"
                  rows={2}
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300"
                  onClick={() =>
                    setConfig((prev) => {
                      const next = [...prev.galleryImages];
                      next.splice(index, 1);
                      return { ...prev, galleryImages: next };
                    })
                  }
                >
                  <span className="sr-only">Удалить</span>
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  galleryImages: [...prev.galleryImages, ""],
                }))
              }
              className="w-full justify-center border-zinc-700 text-xs"
            >
              Добавить фото (URL)
            </Button>
          </div>

          <Button
            type="button"
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="mt-2 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Сохранение..." : "Сохранить фото"}
          </Button>
        </CardContent>
      </Card>

      {/* Текст о компании */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="font-[var(--font-oswald)] text-xl uppercase">
            Основной текст о компании
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Этот текст отображается в блоке «Мы подбираем не случайных людей» на
            странице «О компании» и используется как основной SEO‑текст о компании.
            Разбивайте абзацы пустыми строками — они будут отображаться как отдельные
            параграфы.
          </p>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-zinc-950 border-zinc-800 min-height-[260px]"
            rows={10}
          />
          <Button
            type="button"
            onClick={handleSaveMission}
            disabled={isSaving}
            className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Сохранение..." : "Сохранить текст"}
          </Button>
        </CardContent>
      </Card>

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-500/20 border border-green-500/30"
        >
          <p className="text-green-400 text-sm">
            ✓ Текст страницы «О компании» сохранён. Обновите публичную страницу, чтобы
            увидеть изменения.
          </p>
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


