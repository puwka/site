"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendTelegram } from "@/app/actions/sendTelegram";
import { usePathname } from "next/navigation";
import ConsentCheckbox from "@/components/ConsentCheckbox";

interface OrderFormProps {
  serviceName?: string;
  className?: string;
  onSuccess?: () => void;
}

export default function OrderForm({ serviceName, className, onSuccess }: OrderFormProps) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    workType: "",
    comment: "",
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
        workType: formData.workType,
        comment: formData.comment,
        sourceUrl: typeof window !== "undefined" ? window.location.href : pathname,
        formName: "Форма заказа услуги",
        serviceName: serviceName || undefined,
      });

      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", workType: "", comment: "" });
        if (onSuccess) {
          onSuccess();
        }
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
    <form
      onSubmit={handleSubmit}
      className={`p-6 md:p-8 rounded-2xl bg-card border border-border ${className || ""}`}
    >
      <h3 className="font-[var(--font-oswald)] text-xl md:text-2xl font-bold uppercase mb-2">
        Заказать услугу
      </h3>
      {serviceName && (
        <p className="text-sm text-muted-foreground mb-4">
          {serviceName}
        </p>
      )}
      <p className="text-muted-foreground text-sm mb-6">
        Заполните форму и мы свяжемся с вами в ближайшее время
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2"
          >
            Ваше имя *
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Иван Иванов"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            className="bg-background border-border focus:border-[oklch(0.75_0.18_50)] h-11"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium mb-2"
          >
            Телефон *
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            className="bg-background border-border focus:border-[oklch(0.75_0.18_50)] h-11"
          />
        </div>

        <div>
          <label
            htmlFor="workType"
            className="block text-sm font-medium mb-2"
          >
            Тип работ
          </label>
          <Input
            id="workType"
            type="text"
            placeholder="Опишите тип работ"
            value={formData.workType}
            onChange={(e) =>
              setFormData({ ...formData, workType: e.target.value })
            }
            className="bg-background border-border focus:border-[oklch(0.75_0.18_50)] h-11"
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium mb-2"
          >
            Комментарий
          </label>
          <Textarea
            id="comment"
            placeholder="Дополнительная информация..."
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            rows={4}
            className="bg-background border-border focus:border-[oklch(0.75_0.18_50)] resize-none"
          />
        </div>

        <ConsentCheckbox />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold h-12 text-base"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              />
              Отправка...
            </span>
          ) : (
            "Отправить заявку"
          )}
        </Button>

        {/* Status messages */}
        {submitStatus === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-500 text-center text-sm"
          >
            ✓ Заявка успешно отправлена! Мы скоро свяжемся с вами.
          </motion.p>
        )}
        {submitStatus === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-center text-sm"
          >
            Ошибка отправки. Попробуйте позже или свяжитесь по телефону.
          </motion.p>
        )}
      </div>
    </form>
  );
}
