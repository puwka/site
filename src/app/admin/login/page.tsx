"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loginAction } from "@/app/actions/adminAuth";
import { Lock, CheckCircle2, XCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    try {
      const result = await loginAction(password);
      
      if (result.success) {
        setStatus("success");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1000);
      } else {
        setStatus("error");
        setPassword("");
      }
    } catch {
      setStatus("error");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[oklch(0.75_0.18_50)]" />
              </div>
              <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase mb-2 text-foreground">
                Access Terminal
              </h1>
              <p className="text-muted-foreground text-sm">
                Введите пароль для доступа к панели управления
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background border-border h-12 text-foreground"
                  disabled={isLoading || status === "success"}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || status === "success"}
                className="w-full bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black font-bold h-12 uppercase font-[var(--font-oswald)]"
              >
                {isLoading ? "Проверка..." : "Войти"}
              </Button>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm">
                    Доступ разрешен. Перенаправление...
                  </p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3"
                >
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">
                    Неверный пароль. Попробуйте снова.
                  </p>
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

