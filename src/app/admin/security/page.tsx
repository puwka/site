import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import AdminSecurityPanel from "@/components/AdminSecurityPanel";

export default async function AdminSecurityPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase">
          Безопасность администратора
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Здесь можно изменить пароль доступа к админ-панели. Запомните новый пароль и
          храните его в безопасном месте.
        </p>
        <AdminSecurityPanel />
      </div>
    </div>
  );
}


