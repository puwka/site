import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import ServicesManager from "@/components/ServicesManager";
import ServicesPagesEditor from "@/components/ServicesPagesEditor";
import ServicesAdminTabs from "@/components/ServicesAdminTabs";

export default async function AdminServicesPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase mb-8">
          Каталог
        </h1>
        <ServicesAdminTabs />
      </div>
    </div>
  );
}

