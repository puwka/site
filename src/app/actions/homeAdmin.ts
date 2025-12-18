"use server";

import { promises as fs } from "fs";
import path from "path";

const homeFilePath = path.join(process.cwd(), "src/data/home-admin.json");

export interface HomeBlocks {
  hero: boolean;
  heroForm: boolean;
  services: boolean;
  about: boolean;
  howItWorks: boolean;
  contacts: boolean;
}

export interface HomeTexts {
  heroSubtitle: string;
  servicesTitle: string;
  servicesSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  howTitle: string;
  contactsCta: string;
}

export interface HomeImages {
  heroBg?: string;
  aboutBg?: string;
}

export interface HomeServiceItem {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface HomeAdminData {
  blocks: HomeBlocks;
  texts: HomeTexts;
  images?: HomeImages;
  services?: HomeServiceItem[];
}

const defaultHomeData: HomeAdminData = {
  blocks: {
    hero: true,
    heroForm: true,
    services: true,
    about: true,
    howItWorks: true,
    contacts: true,
  },
  texts: {
    heroSubtitle:
      "Профессиональный подбор рабочего персонала для строительных объектов, складов, монтажных и промышленных работ",
    servicesTitle: "Наши услуги",
    servicesSubtitle:
      "Подберем рабочий персонал под вашу задачу: от разнорабочих до узкопрофильных специалистов",
    aboutTitle: "О компании",
    aboutText:
      "Мы предоставляем рабочий персонал, который умеет работать в темпе, соблюдает технику безопасности и выполняет задачи без лишних вопросов.",
    howTitle: "Как мы работаем",
    contactsCta: "Оставьте заявку, и мы свяжемся с вами в ближайшее время",
  },
  images: {
    heroBg:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2070&q=80",
    aboutBg:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2070&q=80",
  },
  services: [
    {
      id: "warehouse",
      title: "Складские работы",
      description:
        "Персонал для складских операций: грузчики, комплектовщики, фасовщики и другие сотрудники.",
      link: "/services/warehouse",
    },
    {
      id: "production",
      title: "Производство",
      description:
        "Рабочий персонал для производственных линий и цехов.",
      link: "/services/production",
    },
    {
      id: "construction",
      title: "Строительные работы",
      description:
        "Персонал для строительных объектов: от разнорабочих до узких специалистов.",
      link: "/services/construction",
    },
    {
      id: "cleaning",
      title: "Клининг и уборка",
      description:
        "Уборка территорий, нежилых помещений, снега и строительного мусора.",
      link: "/services/cleaning",
    },
    {
      id: "earthworks",
      title: "Земляные работы",
      description:
        "Бригады для земляных работ, траншей, котлованов и подготовки территории.",
      link: "/services/earthworks",
    },
  ],
};

async function readHomeFile(): Promise<HomeAdminData> {
  try {
    const file = await fs.readFile(homeFilePath, "utf8");
    const data = JSON.parse(file) as Partial<HomeAdminData>;
    return {
      blocks: { ...defaultHomeData.blocks, ...(data.blocks || {}) },
      texts: { ...defaultHomeData.texts, ...(data.texts || {}) },
      images: { ...defaultHomeData.images, ...(data.images || {}) },
      services: data.services ?? defaultHomeData.services,
    };
  } catch {
    return defaultHomeData;
  }
}

async function writeHomeFile(data: HomeAdminData) {
  const toWrite = JSON.stringify(data, null, 2);
  await fs.writeFile(homeFilePath, toWrite, "utf8");
}

export async function getHomeAdmin(): Promise<HomeAdminData> {
  return readHomeFile();
}

export async function updateHomeBlocks(blocks: HomeBlocks) {
  const data = await readHomeFile();
  const next: HomeAdminData = {
    ...data,
    blocks,
  };
  await writeHomeFile(next);
  return { success: true };
}

export async function updateHomeTexts(texts: Partial<HomeTexts>) {
  const data = await readHomeFile();
  const next: HomeAdminData = {
    ...data,
    texts: {
      ...data.texts,
      ...texts,
    },
  };
  await writeHomeFile(next);
  return { success: true };
}

export async function updateHomeImages(images: Partial<HomeImages>) {
  const data = await readHomeFile();
  const next: HomeAdminData = {
    ...data,
    images: {
      ...data.images,
      ...images,
    },
  };
  await writeHomeFile(next);
  return { success: true };
}

export async function updateHomeServices(services: HomeServiceItem[]) {
  const data = await readHomeFile();
  const next: HomeAdminData = {
    ...data,
    services,
  };
  await writeHomeFile(next);
  return { success: true };
}


