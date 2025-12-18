"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

const HOME_ID = 1;

async function readHome(): Promise<HomeAdminData> {
  const { data: row, error } = await supabaseAdmin
    .from("home_admin")
    .select("blocks, texts, images")
    .eq("id", HOME_ID)
    .maybeSingle();

  if (error) {
    console.error("Supabase readHome error:", error.message);
  }

  const blocks = { ...defaultHomeData.blocks, ...(row?.blocks || {}) };
  const texts = { ...defaultHomeData.texts, ...(row?.texts || {}) };
  const images = { ...defaultHomeData.images, ...(row?.images || {}) };

  const { data: servicesRows, error: servicesError } = await supabaseAdmin
    .from("home_services")
    .select("id, title, description, link");

  if (servicesError) {
    console.error("Supabase read home services error:", servicesError.message);
  }

  let services: HomeServiceItem[] = defaultHomeData.services;

  if (servicesRows && servicesRows.length > 0) {
    services = servicesRows.map(
      (row: any): HomeServiceItem => ({
        id: row.id as string,
        title: row.title as string,
        description: row.description as string,
        link: row.link ?? undefined,
      })
    );
  }

  return { blocks, texts, images, services };
}

async function writeHome(partial: Partial<HomeAdminData>) {
  const current = await readHome();
  const next: HomeAdminData = {
    ...current,
    ...partial,
  };

  const { error } = await supabaseAdmin.from("home_admin").upsert(
    {
      id: HOME_ID,
      blocks: next.blocks,
      texts: next.texts,
      images: next.images,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("Supabase writeHome error:", error.message);
  }
}

export async function getHomeAdmin(): Promise<HomeAdminData> {
  return readHome();
}

export async function updateHomeBlocks(blocks: HomeBlocks) {
  await writeHome({ blocks });
  return { success: true };
}

export async function updateHomeTexts(texts: Partial<HomeTexts>) {
  const data = await readHome();
  await writeHome({
    texts: {
      ...data.texts,
      ...texts,
    },
  });
  return { success: true };
}

export async function updateHomeImages(images: Partial<HomeImages>) {
  const data = await readHome();
  await writeHome({
    images: {
      ...data.images,
      ...images,
    },
  });
  return { success: true };
}

export async function updateHomeServices(services: HomeServiceItem[]) {
  // persist services list in separate table
  const rows = services.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    link: service.link ?? null,
  }));

  const { error } = await supabaseAdmin.from("home_services").upsert(rows, {
    onConflict: "id",
  });

  if (error) {
    console.error("Supabase updateHomeServices error:", error.message);
  }

  return { success: true };
}


