# Тяжёлый Профиль — Многостраничный сайт

Многостраничный сайт на Next.js с фокусом на SEO и детальные страницы услуг. Структура аналогична мосрабочие.рф, дизайн основан на Landing Page.

## Структура проекта

- `app/page.tsx` - Главная страница (Hero, Services Catalog, About, Why Us, Contacts)
- `app/services/page.tsx` - Каталог всех услуг
- `app/services/[category]/page.tsx` - Страница категории услуг
- `app/services/[category]/[slug]/page.tsx` - Динамическая страница услуги (2-колоночный layout)
- `data/services.ts` - Данные всех услуг (CMS-подобный файл)

## Особенности

- **SEO-оптимизация**: Каждая услуга имеет свой уникальный URL
- **Динамическая маршрутизация**: `/services/[category]/[slug]`
- **Адаптивный дизайн**: 
  - Desktop: 2-колоночный layout с формой в сайдбаре
  - Mobile: Sticky кнопка внизу, открывающая Sheet с формой
- **Темная тема**: Black background, White text, Yellow accents (`oklch(0.75 0.18 50)`)
- **Хлебные крошки**: Навигация на всех страницах
- **Связанные услуги**: Показываются на страницах услуг

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env.local`:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
ADMIN_PASSWORD=your_admin_password
```

3. Запустите dev сервер:
```bash
npm run dev
```

## Редактирование контента

Все данные услуг находятся в файле `src/data/services.ts`. Вы можете редактировать:
- Названия категорий и услуг
- Описания
- Тарифы (pricingTable)
- SEO тексты

### Структура данных

```typescript
interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  price?: string;
  categoryId: string;
  fullDescription?: string;
  seoText?: string;
  pricingTable?: Array<{
    name: string;
    price: string;
    unit?: string;
  }>;
}
```

## Компоненты

- `Header` - Навигация с большим телефоном
- `Footer` - Подвал сайта
- `MobileStickyButton` - Кнопка заказа на мобильных (открывает Sheet)
- `OrderForm` - Форма заказа услуги (Name, Phone, Work Type, Comment)
- `Sheet` - Мобильная форма в выдвижной панели
- UI компоненты в `components/ui/` (Button, Input, Textarea, Card, Sheet)

## Форма заказа

Форма включает:
- Имя (обязательно)
- Телефон (обязательно)
- Тип работ (текстовое поле, опционально)
- Комментарий (опционально)

При отправке в Telegram также передается:
- URL страницы (sourceUrl) для отслеживания конверсий

## Стили

Проект использует:
- Dark mode по умолчанию (Industrial vibe)
- Жёлтые акценты (`oklch(0.75 0.18 50)`)
- Шрифт Oswald для заголовков
- Tailwind CSS v4
- Framer Motion для анимаций

## Категории услуг

- **Склад** (7 услуг)
- **Производство** (6 услуг)
- **Стройка** (11 услуг)
- **Уборка** (6 услуг)
- **Земляные работы** (4 услуги)

## Админ-панель

Админ-панель доступна по адресу `/admin` и защищена паролем.

### Доступ

1. Перейдите на `/admin/login`
2. Введите пароль из переменной окружения `ADMIN_PASSWORD` (по умолчанию: "admin123")

### Возможности

- **Общая информация** (`/admin`): Редактирование глобальных настроек (телефон, Telegram, WhatsApp, Email)
- **Каталог услуг** (`/admin/services`): Редактирование услуг (название, цена, описание, SEO текст)
- **Тексты страниц** (`/admin/pages`): Редактирование текстовых блоков на страницах

### Безопасность

- Все роуты `/admin/*` защищены middleware
- Аутентификация через cookies
- Пароль хранится в переменных окружения
