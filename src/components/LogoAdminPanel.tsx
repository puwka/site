"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePageText, getPageText } from "@/app/actions/adminPages";
import { Save, Upload, Image as ImageIcon } from "lucide-react";

type LogoConfig = {
  enabled: boolean;
  logoUrl?: string;
  logoDarkUrl?: string;
};

const defaultConfig: LogoConfig = {
  enabled: true,
  logoUrl: "/logo_black.png",
  logoDarkUrl: "/logo_white.png",
};

export default function LogoAdminPanel() {
  const [config, setConfig] = useState<LogoConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const logoDarkFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingLogoDark, setIsUploadingLogoDark] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const text = await getPageText("logo_config");
        if (text) {
          const parsed = JSON.parse(text);
          setConfig({ ...defaultConfig, ...parsed });
        }
      } catch {
        // Используем дефолтные значения
      }
    };
    loadConfig();
  }, []);

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>, isDark: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    console.log(`File size: ${fileSizeMB} MB (${file.size} bytes), max: ${maxSize} bytes`);

    if (file.size > maxSize) {
      alert(`Файл слишком большой (${fileSizeMB} МБ). Максимальный размер — 10МБ.`);
      return;
    }

    if (isDark) {
      setIsUploadingLogoDark(true);
    } else {
      setIsUploadingLogo(true);
    }
    setStatus("idle");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = `Ошибка ${res.status}: ${res.statusText}`;
        if (res.status === 413) {
          errorMessage = "Файл слишком большой. Максимальный размер — 10МБ.";
        } else {
          try {
            const errorData = await res.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            const text = await res.text();
            if (text) errorMessage = text.substring(0, 200);
          }
        }
        setStatus("error");
        console.error("Upload error:", errorMessage);
        alert(errorMessage);
        return;
      }

      const data = await res.json();
      if (!data.url) {
        setStatus("error");
        const errorMsg = data.error || data.message || "Ошибка загрузки файла";
        console.error("Upload error:", errorMsg, data);
        alert(errorMsg);
        return;
      }

      if (isDark) {
        setConfig((prev) => ({ ...prev, logoDarkUrl: data.url }));
      } else {
        setConfig((prev) => ({ ...prev, logoUrl: data.url }));
      }
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      setStatus("error");
      console.error("Upload error:", error);
      alert(`Ошибка загрузки: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      if (isDark) {
        setIsUploadingLogoDark(false);
        if (logoDarkFileInputRef.current) {
          logoDarkFileInputRef.current.value = "";
        }
      } else {
        setIsUploadingLogo(false);
        if (logoFileInputRef.current) {
          logoFileInputRef.current.value = "";
        }
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");
    try {
      const result = await updatePageText("logo_config", JSON.stringify(config));
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

  return (
    <div className="space-y-6">
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="font-[var(--font-oswald)] text-xl uppercase flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Управление логотипом
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Переключатель включения/выключения */}
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Отображать логотип
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                При отключении логотип не будет показываться в шапке сайта.
              </p>
            </div>
            <div
              role="switch"
              aria-checked={config.enabled}
              onClick={() => setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                config.enabled
                  ? "bg-[oklch(0.75_0.18_50)]"
                  : "bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                  config.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
          </div>

          {/* Логотип для светлой темы */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Логотип для светлой темы
            </label>
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1.2fr] gap-4 items-center">
              <div className="h-32 rounded-xl border border-zinc-800 overflow-hidden bg-white flex items-center justify-center">
                {config.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt="Логотип светлая тема"
                    className="max-w-full max-h-full object-contain"
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
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadLogo(e, false)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-center border-dashed border-[oklch(0.75_0.18_50)]/40 bg-zinc-950/60 hover:bg-zinc-900 hover:border-[oklch(0.75_0.18_50)] text-xs sm:text-sm"
                    onClick={() => logoFileInputRef.current?.click()}
                    disabled={isUploadingLogo}
                  >
                    {isUploadingLogo ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Загрузка...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Загрузить с устройства
                      </span>
                    )}
                  </Button>
                  <p className="text-[10px] text-muted-foreground">
                    PNG / JPG до 10МБ. Рекомендуемый размер ~ 220×64.
                  </p>
                </div>
                <Input
                  type="text"
                  placeholder="Или вставьте URL картинки"
                  value={config.logoUrl || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, logoUrl: e.target.value }))
                  }
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>
            </div>
          </div>

          {/* Логотип для тёмной темы */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Логотип для тёмной темы
            </label>
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1.2fr] gap-4 items-center">
              <div className="h-32 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center">
                {config.logoDarkUrl ? (
                  <img
                    src={config.logoDarkUrl}
                    alt="Логотип тёмная тема"
                    className="max-w-full max-h-full object-contain"
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
                    ref={logoDarkFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadLogo(e, true)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-center border-dashed border-[oklch(0.75_0.18_50)]/40 bg-zinc-950/60 hover:bg-zinc-900 hover:border-[oklch(0.75_0.18_50)] text-xs sm:text-sm"
                    onClick={() => logoDarkFileInputRef.current?.click()}
                    disabled={isUploadingLogoDark}
                  >
                    {isUploadingLogoDark ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Загрузка...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Загрузить с устройства
                      </span>
                    )}
                  </Button>
                  <p className="text-[10px] text-muted-foreground">
                    PNG / JPG до 10МБ. Рекомендуемый размер ~ 220×64.
                  </p>
                </div>
                <Input
                  type="text"
                  placeholder="Или вставьте URL картинки"
                  value={config.logoDarkUrl || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, logoDarkUrl: e.target.value }))
                  }
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Сохранение...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Сохранить настройки логотипа
              </span>
            )}
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
            ✓ Настройки логотипа сохранены
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

