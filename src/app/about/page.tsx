import { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "О компании | Тяжёлый Профиль",
  description: "Профессиональный подбор рабочего персонала с 2010 года. Более 1000 сотрудников в резерве. Дисциплина, ответственность и контроль качества.",
  keywords: "о компании, аутсорсинг персонала, подбор персонала, рабочий персонал",
  openGraph: {
    title: "О компании | Тяжёлый Профиль",
    description: "Профессиональный подбор рабочего персонала с 2010 года.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
