"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Send } from "lucide-react";
import { updateTelegramSettings, type TelegramSettings } from "@/app/actions/telegramSettings";

export default function AdminTelegramSettings() {
  const [settings, setSettings] = useState<TelegramSettings>({
    botToken: "",
    chatId: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/telegram-settings", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as TelegramSettings | null;
        if (data) {
          setSettings(data);
        }
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus("idle");

    try {
      const trimmed: TelegramSettings = {
        botToken: settings.botToken.trim(),
        chatId: settings.chatId.trim(),
      };
      const result = await updateTelegramSettings(trimmed);
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
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader>
        <CardTitle className="font-[var(--font-oswald)] text-lg uppercase flex items-center gap-2">
          <Send className="w-4 h-4" />
          Уведомления Telegram
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Здесь вы можете изменить токен бота и ID чата, куда приходят заявки с форм сайта.
          </p>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Токен бота Telegram
            </label>
            <Input
              type="text"
              value={settings.botToken}
              onChange={(e) => setSettings((prev) => ({ ...prev, botToken: e.target.value }))}
              className="bg-zinc-950 border-zinc-800 font-mono text-xs"
              placeholder="8574...:AA..."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              ID чата / канала
            </label>
            <Input
              type="text"
              value={settings.chatId}
              onChange={(e) => setSettings((prev) => ({ ...prev, chatId: e.target.value }))}
              className="bg-zinc-950 border-zinc-800 font-mono text-xs"
              placeholder="123456789"
              required
            />
          </div>

          <Button
            type="submit"
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
                Сохранить данные
              </span>
            )}
          </Button>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-sm text-green-400"
            >
              Данные Telegram успешно обновлены. Новые заявки будут приходить в указанный чат.
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-sm text-red-400"
            >
              Ошибка сохранения. Проверьте корректность данных и попробуйте ещё раз.
            </motion.div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}


