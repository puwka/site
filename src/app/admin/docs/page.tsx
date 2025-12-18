import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import DocumentsAdminPanel from "@/components/DocumentsAdminPanel";
import { getPageText } from "@/app/actions/adminPages";

export default async function AdminDocsPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const docsConfig = await getPageText("docs_config");

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase mb-8">
          Документы — администрирование
        </h1>
        <DocumentsAdminPanel initialConfig={docsConfig} />
      </div>
    </div>
  );
}

