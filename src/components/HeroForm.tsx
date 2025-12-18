"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendTelegram } from "@/app/actions/sendTelegram";

export default function HeroForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await sendTelegram({
        name: formData.name,
        phone: formData.phone,
        comment: formData.message,
        sourceUrl: typeof window !== "undefined" ? window.location.href : "/",
        formName: "Быстрая заявка (Hero)",
      });

      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
        <h3 className="font-[var(--font-oswald)] text-xl md:text-2xl font-bold uppercase mb-4 text-white">
          Быстрая заявка
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Ваше имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12"
          />
          <Input
            type="tel"
            placeholder="Телефон"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12"
          />
          <Textarea
            placeholder="Описание задачи"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={3}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold h-12 text-base"
          >
            {isSubmitting ? "Отправка..." : "Заказать персонал"}
          </Button>
          {submitStatus === "success" && (
            <p className="text-green-400 text-sm text-center">
              ✓ Заявка отправлена!
            </p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-400 text-sm text-center">
              Ошибка отправки
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
}

