"use server";

interface TelegramMessage {
  name: string;
  phone: string;
  workType?: string;
  comment?: string;
  sourceUrl?: string;
  formName?: string;
  serviceName?: string;
}

import { getTelegramSettings } from "@/app/actions/telegramSettings";

export async function sendTelegram(data: TelegramMessage) {
  try {
    const { name, phone, workType, comment, sourceUrl, formName, serviceName } = data;

    // Validate required fields
    if (!name || !phone) {
      return { success: false, error: "Имя и телефон обязательны" };
    }

    // 1. Пытаемся взять настройки из админки (JSON‑файл)
    const fileSettings = await getTelegramSettings();

    // 2. Фоллбэк на переменные окружения, если файл ещё не заполнен
    const botToken = fileSettings?.botToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = fileSettings?.chatId || process.env.TELEGRAM_CHAT_ID;

    // Если вообще нет данных — в проде считаем ошибкой, в dev просто «успех без отправки»
    if (!botToken || !chatId) {
      if (process.env.NODE_ENV === "production") {
        console.error("Telegram credentials not configured");
        return { success: false, error: "Сервис временно недоступен" };
      } else {
        console.warn(
          "Telegram credentials are not configured. Skipping real send in non‑production environment."
        );
        return { success: true };
      }
    }

    // Формируем подробное сообщение для Telegram
    const lines: string[] = [];
    lines.push("🔔 *Новая заявка с сайта*");

    if (formName || serviceName || sourceUrl) {
      const metaParts: string[] = [];
      if (formName) metaParts.push(`Форма: ${escapeMarkdown(formName)}`);
      if (serviceName) metaParts.push(`Услуга: ${escapeMarkdown(serviceName)}`);
      if (sourceUrl) metaParts.push(`Страница: ${escapeMarkdown(sourceUrl)}`);

      if (metaParts.length > 0) {
        lines.push("");
        lines.push(`📌 _${metaParts.join(" | ")}_`);
      }
    }

    lines.push("");
    lines.push(`👤 *Имя:* ${escapeMarkdown(name)}`);
    lines.push(`📞 *Телефон:* ${escapeMarkdown(phone)}`);

    if (workType) {
      lines.push(`🔧 *Тип работ:* ${escapeMarkdown(workType)}`);
    }

    if (comment) {
      lines.push("");
      lines.push("💬 *Сообщение клиента:*");
      lines.push(escapeMarkdown(comment));
    }

    lines.push("");
    lines.push(
      `📅 *Дата:* ${escapeMarkdown(
        new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })
      )}`
    );

    const telegramMessage = lines.join("\n");

    // Send message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error("Telegram API error:", errorData);
      return { success: false, error: "Ошибка отправки сообщения" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error processing request:", error);
    return { success: false, error: "Внутренняя ошибка сервера" };
  }
}

// Escape special characters for Telegram Markdown
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
}
