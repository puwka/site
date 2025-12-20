import AdminSidebar from "@/components/AdminSidebar";
import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Получаем путь из headers для определения, нужно ли показывать sidebar
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === "/admin/login";

  // Для страницы логина не показываем sidebar и не проверяем авторизацию
  // (она имеет свой layout, который переопределяет этот)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Для остальных страниц проверяем авторизацию и показываем sidebar
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-[280px]">
        {children}
      </main>
    </div>
  );
}

