import { Metadata } from "next";
import ContactsPageClient from "./ContactsPageClient";

export const metadata: Metadata = {
  title: "Контакты | Тяжёлый Профиль",
  description: "Свяжитесь с нами для заказа рабочего персонала. Телефон, Telegram, WhatsApp. Работаем 24/7.",
  keywords: "контакты, телефон, telegram, whatsapp, связаться",
  openGraph: {
    title: "Контакты | Тяжёлый Профиль",
    description: "Свяжитесь с нами для заказа рабочего персонала. Работаем 24/7.",
    type: "website",
  },
};

export default function ContactsPage() {
  return <ContactsPageClient />;
}

