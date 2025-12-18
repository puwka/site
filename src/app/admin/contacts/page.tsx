import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import ContactsAdminPanel from "@/components/ContactsAdminPanel";
import { getPageText } from "@/app/actions/adminPages";

export default async function AdminContactsPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const contactsConfig = await getPageText("contacts_config");

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase mb-8">
          Контакты — администрирование
        </h1>
        <ContactsAdminPanel initialConfig={contactsConfig} />
      </div>
    </div>
  );
}

