"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import OrderForm from "@/components/OrderForm";
import { Phone } from "lucide-react";

const phoneNumber = "+7 (495) 123-45-67";

export default function MobileStickyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneLink = phoneNumber.replace(/[^+\d]/g, "");

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto">
        <div className="flex gap-3">
          <a
            href={`tel:${phoneLink}`}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Позвонить
            </Button>
          </a>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                className="flex-1 h-12 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-bold"
              >
                Оставить заявку
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-[var(--font-oswald)] text-2xl uppercase">
                  Оставить заявку
                </SheetTitle>
                <SheetDescription>
                  Заполните форму и мы свяжемся с вами в ближайшее время
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <OrderForm onSuccess={() => setIsOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
