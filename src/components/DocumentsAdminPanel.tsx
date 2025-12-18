"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Shield, Save, Plus, X } from "lucide-react";
import { updatePageText } from "@/app/actions/adminPages";

type DocSection = {
  title: string;
  content: string[]; // абзацы
};

type DocumentsConfig = {
  privacy: DocSection[];
  offer: DocSection[];
  showContactCta: boolean;
  consentEnabled: boolean;
  consentLabelPrefix: string;
  consentLinkText: string;
  consentLinkHref: string;
};

const defaultDocumentsConfig: DocumentsConfig = {
  privacy: [
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
  ],
  offer: [
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
      ],
    },
  ],
  showContactCta: true,
  consentEnabled: true,
  consentLabelPrefix: "Я соглашаюсь на обработку персональных данных и принимаю",
  consentLinkText: "политику конфиденциальности",
  consentLinkHref: "/privacy",
};

interface DocumentsAdminPanelProps {
  initialConfig?: string | null;
}

type TabId = "privacy" | "offer";

export default function DocumentsAdminPanel({ initialConfig }: DocumentsAdminPanelProps) {
  const [config, setConfig] = useState<DocumentsConfig>(() => {
    if (initialConfig) {
      try {
        const parsed = JSON.parse(initialConfig);
        return {
          privacy: parsed.privacy || defaultDocumentsConfig.privacy,
          offer: parsed.offer || defaultDocumentsConfig.offer,
          showContactCta:
            typeof parsed.showContactCta === "boolean"
              ? parsed.showContactCta
              : defaultDocumentsConfig.showContactCta,
          consentEnabled:
            typeof parsed.consentEnabled === "boolean"
              ? parsed.consentEnabled
              : defaultDocumentsConfig.consentEnabled,
          consentLabelPrefix: parsed.consentLabelPrefix || defaultDocumentsConfig.consentLabelPrefix,
          consentLinkText: parsed.consentLinkText || defaultDocumentsConfig.consentLinkText,
          consentLinkHref: parsed.consentLinkHref || defaultDocumentsConfig.consentLinkHref,
        };
      } catch {
        return defaultDocumentsConfig;
      }
    }
    return defaultDocumentsConfig;
  });

  const [activeTab, setActiveTab] = useState<TabId>("privacy");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const currentSections = activeTab === "privacy" ? config.privacy : config.offer;

  const updateSection = (index: number, updater: (section: DocSection) => DocSection) => {
    setConfig((prev) => {
      const next = { ...prev };
      const list = activeTab === "privacy" ? [...next.privacy] : [...next.offer];
      list[index] = updater(list[index]);
      if (activeTab === "privacy") {
        next.privacy = list;
      } else {
        next.offer = list;
      }
      return next;
    });
  };

  const addSection = () => {
    setConfig((prev) => {
      const next = { ...prev };
      const list = activeTab === "privacy" ? [...next.privacy] : [...next.offer];
      list.push({
        title: "Новый раздел",
        content: [""],
      });
      if (activeTab === "privacy") {
        next.privacy = list;
      } else {
        next.offer = list;
      }
      return next;
    });
  };

  const removeSection = (index: number) => {
    setConfig((prev) => {
      const next = { ...prev };
      const list = activeTab === "privacy" ? [...next.privacy] : [...next.offer];
      list.splice(index, 1);
      if (activeTab === "privacy") {
        next.privacy = list;
      } else {
        next.offer = list;
      }
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");
    try {
      const res = await updatePageText("docs_config", JSON.stringify(config));
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

  return (
    <div className="space-y-8">
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[oklch(0.75_0.18_50)]/15 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[oklch(0.75_0.18_50)]" />
            </div>
            <div>
              <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase">
                Документы сайта
              </h2>
              <p className="text-sm text-muted-foreground">
                Редактируйте тексты политики конфиденциальности и договора оферты.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Навигация по документам */}
        <Card className="border-zinc-800 bg-zinc-900/70 lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-[var(--font-oswald)] text-lg uppercase">
              Тип документа
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={`w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                activeTab === "privacy"
                  ? "border-[oklch(0.75_0.18_50)] bg-[oklch(0.75_0.18_50)]/10 text-foreground"
                  : "border-zinc-800 bg-zinc-900/40 text-muted-foreground hover:border-zinc-700 hover:text-foreground"
              }`}
            >
              <span className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Политика конфиденциальности
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("offer")}
              className={`w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                activeTab === "offer"
                  ? "border-[oklch(0.75_0.18_50)] bg-[oklch(0.75_0.18_50)]/10 text-foreground"
                  : "border-zinc-800 bg-zinc-900/40 text-muted-foreground hover:border-zinc-700 hover:text-foreground"
              }`}
            >
              <span className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Договор оферты
              </span>
            </button>
          </CardContent>
        </Card>

        {/* Редактор разделов */}
        <Card className="border-zinc-800 bg-zinc-900/70 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-[var(--font-oswald)] text-lg uppercase flex items-center gap-2">
              {activeTab === "privacy" ? "Политика конфиденциальности" : "Договор оферты"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xs text-muted-foreground">
              Текст делится на разделы. Каждый абзац внутри раздела отделяйте пустой строкой.
            </p>

            {/* Настройки нижнего блока и чекбокса согласия */}
            <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Блок «Связаться с нами» внизу страницы
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    При отключении нижний CTA-блок с кнопкой связи не будет отображаться на обеих
                    страницах документов.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      showContactCta: !prev.showContactCta,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.showContactCta ? "bg-[oklch(0.75_0.18_50)]" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      config.showContactCta ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Чекбокс согласия с политикой конфиденциальности
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      При включении во всех пользовательских формах появится обязательный чекбокс
                      с согласием на обработку персональных данных и ссылкой на политику.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        consentEnabled: !prev.consentEnabled,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      config.consentEnabled ? "bg-[oklch(0.75_0.18_50)]" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                        config.consentEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground block mb-1">
                      Текст до ссылки
                    </label>
                    <Input
                      value={config.consentLabelPrefix}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, consentLabelPrefix: e.target.value }))
                      }
                      className="bg-zinc-950 border-zinc-800 text-sm"
                      placeholder="Я соглашаюсь на обработку персональных данных и принимаю"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Текст ссылки
                    </label>
                    <Input
                      value={config.consentLinkText}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, consentLinkText: e.target.value }))
                      }
                      className="bg-zinc-950 border-zinc-800 text-sm"
                      placeholder="политику конфиденциальности"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Ссылка на документ
                    </label>
                    <Input
                      value={config.consentLinkHref}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, consentLinkHref: e.target.value }))
                      }
                      className="bg-zinc-950 border-zinc-800 text-sm"
                      placeholder="/privacy"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
              {currentSections.map((section, index) => (
                <div
                  key={`${section.title}-${index}`}
                  className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground block mb-1">
                        Заголовок раздела
                      </label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(index, (s) => ({ ...s, title: e.target.value }))
                        }
                        className="bg-zinc-950 border-zinc-800 text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 flex-shrink-0"
                      onClick={() => removeSection(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Текст раздела (абзацы через пустую строку)
                    </label>
                    <Textarea
                      value={section.content.join("\n\n")}
                      onChange={(e) => {
                        const paragraphs = e.target.value
                          .split(/\n{2,}/)
                          .map((p) => p.trim())
                          .filter(Boolean);
                        updateSection(index, (s) => ({ ...s, content: paragraphs }));
                      }}
                      rows={6}
                      className="bg-zinc-950 border-zinc-800 text-sm resize-y"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSection}
                className="w-full justify-center border-zinc-700 text-xs"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить раздел
              </Button>
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
                Тексты документов сохранены.
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


