import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import LogoAdminPanel from "@/components/LogoAdminPanel";

export default async function LogoAdminPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase mb-8">
          Управление логотипом
        </h1>
        <LogoAdminPanel />
      </div>
    </div>
  );
}

