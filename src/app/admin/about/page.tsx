import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import AboutAdminPanel from "@/components/AboutAdminPanel";
import { getPageText } from "@/app/actions/adminPages";

export default async function AdminAboutPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const missionText = await getPageText("about_mission_text");
  const aboutConfig = await getPageText("about_config");

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase">
          О нас — администрирование
        </h1>
        <p className="text-muted-foreground">
          Здесь вы можете отредактировать основной текст раздела «О компании», который
          отображается на странице About и на главной.
        </p>

        <AboutAdminPanel initialMissionText={missionText} initialConfig={aboutConfig} />
      </div>
    </div>
  );
}

