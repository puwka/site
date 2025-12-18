import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import AdminTelegramSettings from "@/components/AdminTelegramSettings";

export default async function AdminNotificationsPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase">
          Уведомления
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Настройте параметры отправки заявок в Telegram. После изменения токена или ID чата
          новые заявки будут приходить по обновлённым данным.
        </p>
        <AdminTelegramSettings />
      </div>
    </div>
  );
}


