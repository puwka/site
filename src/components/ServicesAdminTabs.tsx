"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ServicesManager from "@/components/ServicesManager";
import ServicesPagesEditor from "@/components/ServicesPagesEditor";
import { Package, FileText } from "lucide-react";

type TabId = "services" | "pages";

export default function ServicesAdminTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("services");

  return (
    <div className="space-y-6">
      {/* Навигация по вкладкам */}
      <Card className="border-border bg-card/70">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                activeTab === "services"
                  ? "border-[oklch(0.75_0.18_50)] bg-[oklch(0.75_0.18_50)]/10 text-foreground"
                  : "border-border bg-card/40 text-muted-foreground hover:border-zinc-700 hover:text-foreground"
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">Услуги</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pages")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                activeTab === "pages"
                  ? "border-[oklch(0.75_0.18_50)] bg-[oklch(0.75_0.18_50)]/10 text-foreground"
                  : "border-border bg-card/40 text-muted-foreground hover:border-zinc-700 hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Страницы</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Контент вкладок */}
      <div>
        {activeTab === "services" && <ServicesManager />}
        {activeTab === "pages" && <ServicesPagesEditor />}
      </div>
    </div>
  );
}


