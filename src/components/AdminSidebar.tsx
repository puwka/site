"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/adminAuth";
import { Settings, Package, FileText, LogOut, Home, PhoneCall, FileSignature, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Главная", icon: Home },
  { href: "/admin/services", label: "Услуги", icon: Package },
  { href: "/admin/about", label: "О нас", icon: FileText },
  { href: "/admin/contacts", label: "Контакты", icon: PhoneCall },
  { href: "/admin/docs", label: "Документы", icon: FileSignature },
  { href: "/admin/notifications", label: "Уведомления", icon: Bell },
  { href: "/admin/security", label: "Безопасность", icon: Shield },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-[280px] bg-zinc-900 border-r border-zinc-800 z-40">
      <div className="p-6 h-full flex flex-col">
        <div className="mb-8">
          <h2 className="font-[var(--font-oswald)] text-xl font-bold uppercase text-white mb-2">
            Панель управления
          </h2>
          <p className="text-xs text-muted-foreground">
            Тяжёлый Профиль
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const baseHref = item.href.split("?")[0];
            const isActive =
              pathname === baseHref ||
              (baseHref !== "/admin" && pathname.startsWith(baseHref));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[oklch(0.75_0.18_50)]/20 text-[oklch(0.75_0.18_50)] border-l-2 border-[oklch(0.75_0.18_50)]"
                    : "text-muted-foreground hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-white hover:bg-zinc-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Выйти
          </Button>
        </form>
      </div>
    </aside>
  );
}

