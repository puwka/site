import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import PageTextsEditor from "@/components/PageTextsEditor";

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase mb-8">
          Тексты страниц
        </h1>
        <PageTextsEditor initialTab={searchParams.tab} />
      </div>
    </div>
  );
}

