"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import MegaMenu from "@/components/MegaMenu";
import Image from "next/image";

const navLinks = [
  { href: "/services", label: "Услуги" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

type ContactsConfig = {
  phoneNumber: string;
  telegramLink: string;
  whatsappLink: string;
  email: string;
};

const defaultContactsConfig: ContactsConfig = {
  phoneNumber: "+7 (495) 123-45-67",
  telegramLink: "https://t.me/your_telegram",
  whatsappLink: "https://wa.me/79951234567",
  email: "info@heavyprofile.ru",
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const effectiveContacts = contactsConfig || defaultContactsConfig;
  const phoneNumber = effectiveContacts.phoneNumber;
  const phoneLink = phoneNumber.replace(/[^+\d]/g, "");

  // Logo based on theme
  const logoSrc = theme === "dark" ? "/logo_white.png" : "/logo_black.png";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 cursor-pointer bg-transparent border-none p-0"
              onDoubleClick={() => {
                window.location.href = "/admin/login";
              }}
              onClick={() => {
                router.push("/");
              }}
            >
              <div className="relative h-14 md:h-16 w-auto">
                <Image
                  src={logoSrc}
                  alt="Тяжёлый Профиль"
                  width={220}
                  height={64}
                  className="h-full w-auto"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-[var(--font-oswald)] text-base md:text-lg lg:text-xl font-bold uppercase tracking-[0.18em] dark:text-white light:text-zinc-900">
                  ТЯЖЁЛЫЙ{" "}
                  <span className="text-[oklch(0.75_0.18_50)]">
                    ПРОФИЛЬ
                  </span>
                </span>
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <MegaMenu />
              {navLinks.filter((link) => link.label !== "Услуги").map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[oklch(0.75_0.18_50)] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                )}
              </motion.button>

              <a
                href={`tel:${phoneLink}`}
                className="flex items-center gap-2 text-lg font-bold text-[oklch(0.75_0.18_50)] hover:text-[oklch(0.65_0.18_50)] transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{phoneNumber}</span>
              </a>
              <Link href="/#contacts">
                <Button
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold px-6"
                >
                  Связаться
                </Button>
              </Link>
            </div>

            {/* Mobile Right Side */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Theme Toggle - Mobile */}
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-background border-l border-border p-8 pt-24"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-left hover:text-[oklch(0.75_0.18_50)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <hr className="border-border my-4" />
                <a
                  href={`tel:${phoneLink}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{phoneNumber}</span>
                </a>
                <Link href="/#contacts" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold w-full mt-4"
                    size="lg"
                  >
                    Связаться
                  </Button>
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

