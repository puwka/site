"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, Mail, Save } from "lucide-react";
import { updateGlobalSettings } from "@/app/actions/adminSettings";
import { useRouter } from "next/navigation";

export default function GlobalSettingsEditor() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    phoneNumber: "+7 (495) 123-45-67",
    telegramLink: "https://t.me/your_telegram",
    whatsappLink: "https://wa.me/79951234567",
    email: "info@heavyprofile.ru",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus("idle");

    try {
      const result = await updateGlobalSettings(settings);
      if (result.success) {
        setStatus("success");
        setTimeout(() => {
          router.refresh();
        }, 1500);
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
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <CardTitle className="font-[var(--font-oswald)] text-2xl uppercase">
          Глобальные настройки
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Phone className="w-4 h-4 text-[oklch(0.75_0.18_50)]" />
              Телефон
            </label>
            <Input
              type="tel"
              value={settings.phoneNumber}
              onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
              className="bg-zinc-950 border-zinc-800"
              placeholder="+7 (495) 123-45-67"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MessageCircle className="w-4 h-4 text-[#0088cc]" />
              Telegram
            </label>
            <Input
              type="url"
              value={settings.telegramLink}
              onChange={(e) => setSettings({ ...settings, telegramLink: e.target.value })}
              className="bg-zinc-950 border-zinc-800"
              placeholder="https://t.me/your_telegram"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              WhatsApp
            </label>
            <Input
              type="url"
              value={settings.whatsappLink}
              onChange={(e) => setSettings({ ...settings, whatsappLink: e.target.value })}
              className="bg-zinc-950 border-zinc-800"
              placeholder="https://wa.me/79951234567"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Mail className="w-4 h-4 text-[oklch(0.75_0.18_50)]" />
              Email
            </label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="bg-zinc-950 border-zinc-800"
              placeholder="info@heavyprofile.ru"
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold uppercase font-[var(--font-oswald)]"
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
              className="p-4 rounded-xl bg-green-500/20 border border-green-500/30"
            >
              <p className="text-green-400 text-sm">✓ Настройки успешно сохранены</p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/20 border border-red-500/30"
            >
              <p className="text-red-400 text-sm">Ошибка сохранения</p>
            </motion.div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

