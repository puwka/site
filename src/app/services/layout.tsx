import ServiceSidebar from "@/components/ServiceSidebar";
import Header from "@/components/Header";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen noise-overlay">
      <Header />
      {/* Sidebar - Desktop Only */}
      <ServiceSidebar />
      
      {/* Main Content Area */}
      <div className="lg:ml-[280px]">
        {children}
      </div>
    </div>
  );
}

