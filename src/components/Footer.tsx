"use client";

import { motion } from "framer-motion";
import { Send, MessageCircle, Phone, ArrowUp } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

type ContactsConfig = {
  phoneNumber: string;
  telegramLink: string;
  whatsappLink: string;
  email: string;
  showAddress?: boolean;
  addressLine?: string;
};

const defaultContactsConfig: ContactsConfig = {
  phoneNumber: "+7 (495) 123-45-67",
  telegramLink: "https://t.me/your_telegram",
  whatsappLink: "https://wa.me/79951234567",
  email: "info@heavyprofile.ru",
  showAddress: true,
  addressLine: "",
};

const footerLinks = {
  navigation: [
    { label: "Главная", href: "/" },
    { label: "Услуги", href: "/services" },
    { label: "О нас", href: "/#about" },
    { label: "Контакты", href: "/#contacts" },
  ],
  legal: [
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "Договор оферты", href: "/offer" },
  ],
};

export default function Footer() {
  const { theme } = useTheme();
  const [contactsConfig, setContactsConfig] = useState<ContactsConfig | null>(null);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await fetch("/api/admin/page-texts?key=contacts_config", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.text === "string" && data.text.trim().length > 0) {
            try {
              const parsed = JSON.parse(data.text);
              setContactsConfig({ ...defaultContactsConfig, ...parsed });
            } catch {
              setContactsConfig(defaultContactsConfig);
            }
          } else {
            setContactsConfig(defaultContactsConfig);
          }
        } else {
          setContactsConfig(defaultContactsConfig);
        }
      } catch {
        setContactsConfig(defaultContactsConfig);
      }
    };
    loadContacts();
  }, []);

  // Format phone for tel: link
  const effectiveContacts = contactsConfig || defaultContactsConfig;
  const phoneLink = effectiveContacts.phoneNumber.replace(/[^+\d]/g, "");

  const socialLinks = [
    {
      name: "Telegram",
      icon: Send,
      href: effectiveContacts.telegramLink,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href:
        effectiveContacts.whatsappLink && effectiveContacts.whatsappLink.trim().length > 0
          ? effectiveContacts.whatsappLink
          : `https://wa.me/${phoneLink.replace("+", "")}`,
    },
    {
      name: "Телефон",
      icon: Phone,
      href: `tel:${phoneLink}`,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card border-t border-border">
      {/* Main footer content */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[oklch(0.75_0.18_50)] rounded-lg flex items-center justify-center">
                <span className="font-[var(--font-oswald)] text-xl font-bold text-black">
                  ТП
                </span>
              </div>
              <span className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wider">
                Тяжёлый
                <span className="text-[oklch(0.75_0.18_50)]"> Профиль</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-3 max-w-md leading-relaxed">
              Профессиональный подбор рабочего персонала для строительных объектов, складов, монтажных и промышленных работ. Более 1000 сотрудников в резерве.
            </p>
            {effectiveContacts.showAddress !== false &&
              (effectiveContacts.addressLine || (contactsConfig as any)?.mapAddress) && (
                <p className="text-xs text-muted-foreground mb-6 max-w-md">
                  {effectiveContacts.addressLine || (contactsConfig as any).mapAddress}
                </p>
              )}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-[oklch(0.75_0.18_50)] hover:text-black transition-colors duration-300"
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Навигация</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Документы</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Тяжёлый Профиль. Все права защищены.
            </p>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[oklch(0.75_0.18_50)] transition-colors duration-300"
            >
              Наверх
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}

