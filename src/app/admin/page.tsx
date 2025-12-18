import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import HomeAdminPanel from "@/components/HomeAdminPanel";
import { getHomeAdmin } from "@/app/actions/homeAdmin";

export default async function AdminDashboard() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const homeData = await getHomeAdmin();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase mb-8">
          Главная страница — администрирование
        </h1>
        <HomeAdminPanel initialData={homeData} />
      </div>
    </div>
  );
}

