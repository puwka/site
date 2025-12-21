"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/services";
import { Save } from "lucide-react";
import { updatePageText } from "@/app/actions/adminPages";

interface CategoryData {
  id: string;
  name: string;
  description: string;
}

export default function ServicesPagesEditor() {
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [linkTexts, setLinkTexts] = useState({
    allServices: "Все услуги",
    showAllServices: "Показать все услуги",
    details: "Подробнее",
    backToCatalog: "Вернуться к каталогу",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем данные категорий
        const categoriesRes = await fetch("/api/admin/page-texts?key=services_categories", {
          cache: "no-store",
        });
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          if (categoriesData.text) {
            try {
              const parsed = JSON.parse(categoriesData.text);
              setCategoriesData(parsed);
            } catch {
              // Если не JSON, используем базовые категории
              setCategoriesData(
                categories.map((cat) => ({
                  id: cat.id,
                  name: cat.name,
                  description: cat.description,
                }))
              );
            }
          } else {
            setCategoriesData(
              categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                description: cat.description,
              }))
            );
          }
        } else {
          setCategoriesData(
            categories.map((cat) => ({
              id: cat.id,
              name: cat.name,
              description: cat.description,
            }))
          );
        }

        // Загружаем тексты ссылок
        const linkTextsRes = await fetch("/api/admin/page-texts?key=services_link_texts", {
          cache: "no-store",
        });
        if (linkTextsRes.ok) {
          const linkTextsData = await linkTextsRes.json();
          if (linkTextsData.text) {
            try {
              const parsed = JSON.parse(linkTextsData.text);
              setLinkTexts({ ...linkTexts, ...parsed });
            } catch {
              // Используем значения по умолчанию
            }
          }
        }
      } catch {
        // Используем значения по умолчанию
        setCategoriesData(
          categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      // Сохраняем категории
      await updatePageText("services_categories", JSON.stringify(categoriesData));

      // Сохраняем тексты ссылок
      await updatePageText("services_link_texts", JSON.stringify(linkTexts));

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        window.location.reload();
      }, 1500);
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase">
          Редактирование страниц услуг
        </h2>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black"
        >
          <Save className="w-4 h-4 mr-2" />
          Сохранить все изменения
        </Button>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30">
          <p className="text-green-400 text-sm">Изменения сохранены успешно!</p>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30">
          <p className="text-red-400 text-sm">Ошибка при сохранении. Попробуйте снова.</p>
        </div>
      )}

      {/* Категории */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h3 className="font-[var(--font-oswald)] text-lg font-bold uppercase mb-4">
            Категории услуг
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Редактируйте названия и описания категорий услуг
          </p>
          <div className="space-y-4">
            {categoriesData.map((category, index) => (
              <div
                key={category.id}
                className="border border-border rounded-lg p-4 bg-background/50 space-y-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    ID: {category.id}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Название категории</label>
                  <Input
                    value={category.name}
                    onChange={(e) => {
                      const next = [...categoriesData];
                      next[index] = { ...next[index], name: e.target.value };
                      setCategoriesData(next);
                    }}
                    className="bg-background border-border"
                    placeholder="Название категории"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Описание категории</label>
                  <Textarea
                    value={category.description}
                    onChange={(e) => {
                      const next = [...categoriesData];
                      next[index] = { ...next[index], description: e.target.value };
                      setCategoriesData(next);
                    }}
                    className="bg-background border-border"
                    rows={2}
                    placeholder="Описание категории"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Тексты ссылок */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h3 className="font-[var(--font-oswald)] text-lg font-bold uppercase mb-4">
            Тексты ссылок и кнопок
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Редактируйте тексты ссылок, которые отображаются на страницах услуг
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Текст ссылки "Все услуги"
              </label>
              <Input
                value={linkTexts.allServices}
                onChange={(e) =>
                  setLinkTexts({ ...linkTexts, allServices: e.target.value })
                }
                className="bg-background border-border"
                placeholder="Все услуги"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Отображается рядом с названием категории на странице каталога
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Текст ссылки "Показать все услуги"
              </label>
              <Input
                value={linkTexts.showAllServices}
                onChange={(e) =>
                  setLinkTexts({ ...linkTexts, showAllServices: e.target.value })
                }
                className="bg-background border-border"
                placeholder="Показать все услуги"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Отображается на мобильных устройствах, когда услуг больше 6
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Текст ссылки "Подробнее"
              </label>
              <Input
                value={linkTexts.details}
                onChange={(e) => setLinkTexts({ ...linkTexts, details: e.target.value })}
                className="bg-background border-border"
                placeholder="Подробнее"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Отображается на карточках услуг
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Текст ссылки "Вернуться к каталогу"
              </label>
              <Input
                value={linkTexts.backToCatalog}
                onChange={(e) =>
                  setLinkTexts({ ...linkTexts, backToCatalog: e.target.value })
                }
                className="bg-background border-border"
                placeholder="Вернуться к каталогу"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Отображается на странице категории
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

