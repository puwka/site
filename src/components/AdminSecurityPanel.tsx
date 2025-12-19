"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Save } from "lucide-react";
import { changePasswordAction } from "@/app/actions/adminAuth";

export default function AdminSecurityPanel() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Новый пароль и подтверждение не совпадают");
      return;
    }

    setIsSaving(true);
    try {
      const res = await changePasswordAction(currentPassword, newPassword);
      if (res.success) {
        setStatus("success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Не удалось изменить пароль");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Не удалось изменить пароль");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-border bg-card/60 max-w-xl">
      <CardHeader>
        <CardTitle className="font-[var(--font-oswald)] text-xl uppercase flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Безопасность / Смена пароля
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Текущий пароль
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-background border-border"
              disabled={isSaving}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Новый пароль
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-background border-border"
              disabled={isSaving}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Подтверждение нового пароля
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-background border-border"
              disabled={isSaving}
              required
              minLength={6}
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
                Изменить пароль
              </span>
            )}
          </Button>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-sm text-green-400"
            >
              Пароль успешно изменен.
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-sm text-red-400"
            >
              {errorMessage || "Ошибка изменения пароля."}
            </motion.div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}


