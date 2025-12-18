export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  price?: string;
  categoryId: string;
  fullDescription?: string;
  seoText?: string;
  images?: string[];
  /** Управление отображением формы заявки на странице услуги. По умолчанию true. */
  showOrderForm?: boolean;
  pricingTable?: Array<{
    name: string;
    price: string;
    unit?: string;
  }>;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "warehouse",
    slug: "warehouse",
    name: "Склад",
    description: "Персонал для складских операций",
  },
  {
    id: "production",
    slug: "production",
    name: "Производство",
    description: "Персонал для производственных линий",
  },
  {
    id: "construction",
    slug: "construction",
    name: "Стройка",
    description: "Строительный персонал",
  },
  {
    id: "cleaning",
    slug: "cleaning",
    name: "Уборка",
    description: "Услуги по уборке территорий и помещений",
  },
  {
    id: "earthworks",
    slug: "earthworks",
    name: "Земляные работы",
    description: "Специалисты по земляным работам",
  },
];

export const services: Service[] = [
  // Склад
  {
    id: "warehouse-staff",
    slug: "personnel-na-sklad",
    title: "Персонал на склад",
    description: "Профессиональный складской персонал для различных операций",
    categoryId: "warehouse",
    fullDescription: "Предоставляем квалифицированный персонал для работы на складе. Наши сотрудники имеют опыт работы с различными типами грузов и складского оборудования.",
    seoText: "Аренда персонала для склада в Москве. Квалифицированные складские работники с опытом работы. Быстрое предоставление персонала для складских операций.",
    pricingTable: [
      { name: "Грузчик", price: "от 1500", unit: "руб/смена" },
      { name: "Комплектовщик", price: "от 1800", unit: "руб/смена" },
      { name: "Кладовщик", price: "от 2000", unit: "руб/смена" },
    ],
  },
  {
    id: "packers",
    slug: "fasovshchiki",
    title: "Фасовщики",
    description: "Специалисты по фасовке товаров",
    categoryId: "warehouse",
    fullDescription: "Опытные фасовщики для упаковки и фасовки различных товаров. Работаем с продуктами питания, строительными материалами, товарами народного потребления.",
    seoText: "Услуги фасовщиков в Москве. Профессиональная фасовка товаров любой сложности. Быстрое предоставление персонала.",
  },
  {
    id: "labelers",
    slug: "markirovshchiki",
    title: "Маркировщики",
    description: "Специалисты по маркировке товаров",
    categoryId: "warehouse",
    fullDescription: "Квалифицированные маркировщики для нанесения этикеток, штрих-кодов и другой маркировки на товары.",
    seoText: "Маркировщики товаров в Москве. Профессиональная маркировка с соблюдением всех стандартов.",
  },
  {
    id: "stickers",
    slug: "stikerovshchiki",
    title: "Стикеровщики",
    description: "Специалисты по наклейке стикеров и этикеток",
    categoryId: "warehouse",
    fullDescription: "Опытные стикеровщики для наклейки этикеток, стикеров и другой маркировки на упаковку и товары.",
    seoText: "Услуги стикеровщиков в Москве. Быстрая и качественная наклейка этикеток.",
  },
  {
    id: "packaging",
    slug: "upakovshchiki",
    title: "Упаковщики",
    description: "Специалисты по упаковке товаров",
    categoryId: "warehouse",
    fullDescription: "Профессиональные упаковщики для упаковки товаров различных категорий. Работаем с хрупкими, крупногабаритными и стандартными товарами.",
    seoText: "Услуги упаковщиков в Москве. Качественная упаковка товаров любой сложности.",
  },
  {
    id: "loaders",
    slug: "gruzchiki",
    title: "Грузчики",
    description: "Грузчики для складских работ",
    categoryId: "warehouse",
    fullDescription: "Физически подготовленные грузчики для погрузочно-разгрузочных работ на складе. Работаем с различными типами грузов.",
    seoText: "Грузчики на склад в Москве. Профессиональная погрузка и разгрузка товаров.",
    pricingTable: [
      { name: "Грузчик (8 часов)", price: "от 1500", unit: "руб/смена" },
      { name: "Грузчик (12 часов)", price: "от 2200", unit: "руб/смена" },
    ],
  },
  {
    id: "pickers",
    slug: "komplektovshchiki",
    title: "Комплектовщики",
    description: "Специалисты по комплектации заказов",
    categoryId: "warehouse",
    fullDescription: "Опытные комплектовщики для сборки заказов по накладным. Работаем с системами WMS, сканерами и другим складским оборудованием.",
    seoText: "Комплектовщики заказов в Москве. Быстрая и точная комплектация товаров.",
  },
  // Производство
  {
    id: "production-staff",
    slug: "personnel-na-proizvodstvo",
    title: "Персонал на производство",
    description: "Рабочий персонал для производства",
    categoryId: "production",
    fullDescription: "Квалифицированный персонал для работы на производственных линиях. Опыт работы с различными типами оборудования и технологий.",
    seoText: "Персонал для производства в Москве. Квалифицированные рабочие для производственных линий.",
  },
  {
    id: "production-packaging",
    slug: "upakovshchiki-proizvodstvo",
    title: "Упаковщики",
    description: "Упаковщики для производственных линий",
    categoryId: "production",
    fullDescription: "Специалисты по упаковке готовой продукции на производственных линиях.",
    seoText: "Упаковщики на производство в Москве.",
  },
  {
    id: "production-labelers",
    slug: "markirovshchiki-proizvodstvo",
    title: "Маркировщики",
    description: "Маркировщики для производственных линий",
    categoryId: "production",
    fullDescription: "Специалисты по маркировке готовой продукции на производстве.",
    seoText: "Маркировщики на производство в Москве.",
  },
  {
    id: "production-pickers",
    slug: "komplektovshchiki-proizvodstvo",
    title: "Комплектовщики",
    description: "Комплектовщики для производства",
    categoryId: "production",
    fullDescription: "Опытные комплектовщики для сборки и комплектации продукции на производстве.",
    seoText: "Комплектовщики на производство в Москве.",
  },
  {
    id: "production-packers",
    slug: "fasovshchiki-proizvodstvo",
    title: "Фасовщики",
    description: "Фасовщики для производственных линий",
    categoryId: "production",
    fullDescription: "Специалисты по фасовке продукции на производственных линиях.",
    seoText: "Фасовщики на производство в Москве.",
  },
  {
    id: "production-loading",
    slug: "rabochie-na-pogruzku",
    title: "Рабочие на погрузку",
    description: "Рабочие для погрузки готовой продукции",
    categoryId: "production",
    fullDescription: "Физически подготовленные рабочие для погрузки готовой продукции на транспорт.",
    seoText: "Рабочие на погрузку продукции в Москве.",
  },
  // Стройка
  {
    id: "construction-staff",
    slug: "personnel-na-stroyku",
    title: "Персонал на стройку",
    description: "Строительный персонал",
    categoryId: "construction",
    fullDescription: "Квалифицированный строительный персонал для различных видов работ на объектах.",
    seoText: "Строительный персонал в Москве. Квалифицированные рабочие для строительных объектов.",
  },
  {
    id: "handymen",
    slug: "raznorabochie",
    title: "Разнорабочие",
    description: "Разнорабочие для строительных объектов",
    categoryId: "construction",
    fullDescription: "Опытные разнорабочие для выполнения различных строительных задач. Помощь специалистам, подготовка материалов, уборка территории.",
    seoText: "Разнорабочие на стройку в Москве. Универсальные рабочие для строительных объектов.",
    pricingTable: [
      { name: "Разнорабочий (8 часов)", price: "от 2000", unit: "руб/смена" },
      { name: "Разнорабочий (12 часов)", price: "от 2800", unit: "руб/смена" },
    ],
  },
  {
    id: "monolith-workers",
    slug: "monolitchiki",
    title: "Монолитчики",
    description: "Специалисты по монолитным работам",
    categoryId: "construction",
    fullDescription: "Опытные монолитчики для заливки бетона, установки опалубки и других монолитных работ.",
    seoText: "Монолитчики в Москве. Профессиональные работы по монолитному строительству.",
  },
  {
    id: "installers",
    slug: "montazhniki",
    title: "Монтaжники",
    description: "Монтажники для строительных работ",
    categoryId: "construction",
    fullDescription: "Квалифицированные монтажники для установки различных конструкций, оборудования и систем.",
    seoText: "Монтажники в Москве. Профессиональный монтаж конструкций и оборудования.",
  },
  {
    id: "finishers",
    slug: "otdelochniki",
    title: "Отделочники",
    description: "Специалисты по отделочным работам",
    categoryId: "construction",
    fullDescription: "Опытные отделочники для выполнения внутренних и наружных отделочных работ.",
    seoText: "Отделочники в Москве. Качественная отделка помещений и фасадов.",
  },
  {
    id: "construction-loaders",
    slug: "gruzchiki-stroyka",
    title: "Грузчики",
    description: "Грузчики для строительных объектов",
    categoryId: "construction",
    fullDescription: "Физически подготовленные грузчики для погрузочно-разгрузочных работ на строительных объектах.",
    seoText: "Грузчики на стройку в Москве.",
  },
  {
    id: "concrete-workers",
    slug: "betonshchiki",
    title: "Бетонщики",
    description: "Специалисты по бетонным работам",
    categoryId: "construction",
    fullDescription: "Опытные бетонщики для заливки бетона, укладки арматуры и других бетонных работ.",
    seoText: "Бетонщики в Москве. Профессиональные бетонные работы.",
  },
  {
    id: "reinforcement-workers",
    slug: "armaturshchiki",
    title: "Арматурщики",
    description: "Специалисты по арматурным работам",
    categoryId: "construction",
    fullDescription: "Квалифицированные арматурщики для вязки и установки арматуры.",
    seoText: "Арматурщики в Москве. Профессиональная работа с арматурой.",
  },
  {
    id: "drywall-workers",
    slug: "gipsokartonshchiki",
    title: "Гипсокартонщики",
    description: "Специалисты по работе с гипсокартоном",
    categoryId: "construction",
    fullDescription: "Опытные гипсокартонщики для монтажа перегородок, потолков и других конструкций из гипсокартона.",
    seoText: "Гипсокартонщики в Москве. Профессиональный монтаж гипсокартона.",
  },
  {
    id: "plasterers",
    slug: "shtukatury",
    title: "Штукатуры",
    description: "Специалисты по штукатурным работам",
    categoryId: "construction",
    fullDescription: "Квалифицированные штукатуры для оштукатуривания стен и потолков.",
    seoText: "Штукатуры в Москве. Качественная штукатурка поверхностей.",
  },
  {
    id: "putty-workers",
    slug: "shpaklevshchiki",
    title: "Шпаклёвщики",
    description: "Специалисты по шпаклёвочным работам",
    categoryId: "construction",
    fullDescription: "Опытные шпаклёвщики для выравнивания поверхностей перед финишной отделкой.",
    seoText: "Шпаклёвщики в Москве. Профессиональная шпаклёвка поверхностей.",
  },
  // Уборка
  {
    id: "territory-cleaning",
    slug: "uborka-territoriy",
    title: "Уборка территорий",
    description: "Уборка прилегающих территорий",
    categoryId: "cleaning",
    fullDescription: "Комплексная уборка прилегающих территорий, парковок, дворов и других открытых пространств.",
    seoText: "Уборка территорий в Москве. Профессиональная уборка прилегающих территорий.",
  },
  {
    id: "leaves-cleaning",
    slug: "uborka-listvy",
    title: "Уборка листвы",
    description: "Сезонная уборка листвы",
    categoryId: "cleaning",
    fullDescription: "Уборка опавшей листвы с территорий в осенний период. Используем специализированное оборудование.",
    seoText: "Уборка листвы в Москве. Сезонная уборка опавшей листвы.",
  },
  {
    id: "non-residential-cleaning",
    slug: "uborka-nezhilyh-pomeshcheniy",
    title: "Уборка нежилых помещений",
    description: "Уборка офисов, складов, производственных помещений",
    categoryId: "cleaning",
    fullDescription: "Профессиональная уборка нежилых помещений: офисов, складов, производственных цехов, торговых залов.",
    seoText: "Уборка нежилых помещений в Москве. Профессиональная клининговая служба.",
  },
  {
    id: "snow-cleaning",
    slug: "uborka-snega",
    title: "Уборка снега",
    description: "Уборка снега с территорий",
    categoryId: "cleaning",
    fullDescription: "Уборка снега с территорий, парковок, тротуаров.",
    seoText: "Уборка снега в Москве. Уборка снега с территорий.",
    pricingTable: [
      { name: "Уборка снега (территория)", price: "от 500", unit: "руб/м²" },
      { name: "Срочная уборка", price: "от 800", unit: "руб/м²" },
    ],
  },
  {
    id: "snow-roof-cleaning",
    slug: "uborka-snega-s-krysh",
    title: "Уборка снега с крыш",
    description: "Уборка снега с крыш зданий",
    categoryId: "cleaning",
    fullDescription: "Уборка снега с крыш зданий с соблюдением всех мер безопасности.",
    seoText: "Уборка снега с крыш в Москве. Безопасная уборка снега с крыш зданий.",
    pricingTable: [
      { name: "Уборка снега с крыш", price: "от 1500", unit: "руб/м²" },
    ],
  },
  {
    id: "construction-waste-cleaning",
    slug: "uborka-stroitelnogo-musora",
    title: "Уборка строительного мусора",
    description: "Вывоз и уборка строительного мусора",
    categoryId: "cleaning",
    fullDescription: "Уборка и вывоз строительного мусора с объектов. Работаем с различными типами отходов строительства.",
    seoText: "Уборка строительного мусора в Москве. Вывоз и утилизация строительных отходов.",
  },
  // Земляные работы
  {
    id: "earthworks-staff",
    slug: "personnel-dlya-zemlyanyh-rabot",
    title: "Персонал для земляных работ",
    description: "Специалисты по земляным работам",
    categoryId: "earthworks",
    fullDescription: "Квалифицированный персонал для выполнения различных земляных работ.",
    seoText: "Персонал для земляных работ в Москве.",
  },
  {
    id: "excavators",
    slug: "zemlekopy",
    title: "Землекопы",
    description: "Специалисты по копке и земляным работам",
    categoryId: "earthworks",
    fullDescription: "Опытные землекопы для выполнения различных земляных работ: копка котлованов, траншей, планировка участков.",
    seoText: "Землекопы в Москве. Профессиональные земляные работы любой сложности.",
    pricingTable: [
      { name: "Землекоп (8 часов)", price: "от 2500", unit: "руб/смена" },
      { name: "Землекоп (12 часов)", price: "от 3500", unit: "руб/смена" },
      { name: "Копка траншеи", price: "от 800", unit: "руб/м³" },
    ],
  },
  {
    id: "foundation-excavation",
    slug: "kopka-fundamenta",
    title: "Копка фундамента",
    description: "Копка котлованов под фундамент",
    categoryId: "earthworks",
    fullDescription: "Профессиональная копка котлованов под фундамент с соблюдением всех требований и норм.",
    seoText: "Копка фундамента в Москве. Профессиональная копка котлованов под фундамент.",
  },
  {
    id: "trench-excavation",
    slug: "kopka-transhey",
    title: "Копка траншей",
    description: "Копка траншей для коммуникаций",
    categoryId: "earthworks",
    fullDescription: "Копка траншей для прокладки коммуникаций: водопровод, канализация, электрические кабели, газопровод.",
    seoText: "Копка траншей в Москве. Профессиональная копка траншей для коммуникаций.",
  },
];

// Helper functions
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServicesByCategory(categoryId: string): Service[] {
  return services.filter((service) => service.categoryId === categoryId);
}

export function getRelatedServices(
  categoryId: string,
  currentServiceId: string
): Service[] {
  return services.filter(
    (service) =>
      service.categoryId === categoryId && service.id !== currentServiceId
  );
}

export function getAllServices(): Service[] {
  return services;
}

