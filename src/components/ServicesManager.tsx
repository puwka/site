"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { services, categories } from "@/data/services";
import { Edit, Save, X, Plus, Upload, Trash2 } from "lucide-react";
import { updateService, deleteService } from "@/app/actions/adminServices";

interface PricingRow {
  name: string;
  price: string;
  unit?: string;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  price?: string;
  categoryId: string;
  fullDescription?: string;
  seoText?: string;
  pricingTable?: PricingRow[];
  images?: string[];
  showOrderForm?: boolean;
}

type ServiceOverride = Partial<Service> & { deleted?: boolean };

export default function ServicesManager() {
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editedService, setEditedService] = useState<Partial<Service>>({});
  const [isSaving, setIsSaving] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, ServiceOverride>>(
    {}
  );

  useEffect(() => {
    const loadOverrides = async () => {
      try {
        const res = await fetch("/api/admin/services-overrides", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as Record<string, ServiceOverride>;
        setOverrides(data || {});
      } catch {
        // ignore
      }
    };
    loadOverrides();
  }, []);

  const mergedServices: Service[] = services.map((service) => ({
    ...service,
    ...(overrides[service.id] || {}),
  })).filter((service) => !(overrides[service.id]?.deleted));

  // Добавляем услуги, созданные только в overrides (новые)
  Object.entries(overrides).forEach(([id, override]) => {
    if (override.deleted) return;
    if (!mergedServices.find((s) => s.id === id)) {
      mergedServices.push({
        id,
        slug: override.slug || "",
        title: override.title || "Новая услуга",
        description: override.description || "",
        price: override.price,
        categoryId: override.categoryId || categories[0]?.id || "warehouse",
        fullDescription: override.fullDescription,
        seoText: override.seoText,
        pricingTable: override.pricingTable,
        images: override.images,
      });
    }
  });

  const handleEdit = (service: Service) => {
    setEditingService(service.id);
    setEditedService(service);
  };

  const handleCancel = () => {
    setEditingService(null);
    setEditedService({});
  };

  const handleSave = async (serviceId: string) => {
    setIsSaving(true);
    try {
      await updateService(serviceId, editedService);
      setEditingService(null);
      setEditedService({});
      // Refresh the page to show updated data
      window.location.reload();
    } catch {
      alert("Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем размер файла на клиенте
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert(`Файл слишком большой (${(file.size / 1024 / 1024).toFixed(2)} МБ). Максимальный размер — 5МБ.`);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = "";
      }
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = `Ошибка ${res.status}: ${res.statusText}`;
        if (res.status === 413) {
          errorMessage = "Файл слишком большой. Максимальный размер — 5МБ.";
        } else {
          try {
            const errorData = await res.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            const text = await res.text();
            if (text) errorMessage = text.substring(0, 200);
          }
        }
        console.error("Upload error:", errorMessage);
        alert(errorMessage);
        return;
      }

      const data = await res.json();
      if (!data.url) {
        const errorMsg = data.error || data.message || "Ошибка загрузки файла";
        console.error("Upload error:", errorMsg, data);
        alert(errorMsg);
        return;
      }

      const nextImages = [...(editedService.images || []), data.url as string];
      setEditedService({
        ...editedService,
        images: nextImages,
      });
    } catch (error) {
      console.error("Upload error", error);
      alert("Ошибка загрузки файла");
    } finally {
      setIsUploadingImage(false);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = "";
      }
    }
  };

  const handleCreate = () => {
    const newId = `service-${Date.now()}`;
    const base: Service = {
      id: newId,
      slug: "",
      title: "Новая услуга",
      description: "",
      price: "",
      categoryId: categories[0]?.id || "warehouse",
      fullDescription: "",
      seoText: "",
      pricingTable: [],
      images: [],
      showOrderForm: true,
    };
    setEditingService(newId);
    setEditedService(base);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Удалить эту услугу?")) return;
    setIsSaving(true);
    try {
      await deleteService(serviceId);
      setEditingService(null);
      setEditedService({});
      window.location.reload();
    } catch {
      alert("Ошибка удаления услуги");
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || categoryId;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[var(--font-oswald)] text-lg uppercase text-muted-foreground">
          Список услуг
        </h2>
        <Button
          type="button"
          size="sm"
          onClick={handleCreate}
          className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Добавить услугу
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-4 px-4 font-[var(--font-oswald)] text-sm uppercase text-muted-foreground">
                Категория
              </th>
              <th className="text-left py-4 px-4 font-[var(--font-oswald)] text-sm uppercase text-muted-foreground">
                Название
              </th>
              <th className="text-left py-4 px-4 font-[var(--font-oswald)] text-sm uppercase text-muted-foreground">
                Цена
              </th>
              <th className="text-right py-4 px-4 font-[var(--font-oswald)] text-sm uppercase text-muted-foreground">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
          {mergedServices.map((service) => {
              const isEditing = editingService === service.id;
              
              return (
                <tr
                  key={service.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {getCategoryName(service.categoryId)}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      <Input
                        value={editedService.title || service.title}
                        onChange={(e) =>
                          setEditedService({ ...editedService, title: e.target.value })
                        }
                        className="bg-zinc-950 border-zinc-800 w-full"
                      />
                    ) : (
                      <span className="font-medium">{service.title}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {isEditing ? (
                      <Input
                        value={editedService.price || service.price || ""}
                        onChange={(e) =>
                          setEditedService({ ...editedService, price: e.target.value })
                        }
                        className="bg-zinc-950 border-zinc-800 w-32"
                        placeholder="от 1500 руб"
                      />
                    ) : (
                      <span className="text-[oklch(0.75_0.18_50)]">
                        {service.price || "—"}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(service.id)}
                          disabled={isSaving}
                          className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal for Full Service Details */}
      {editingService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <h3 className="font-[var(--font-oswald)] text-2xl font-bold uppercase mb-6">
              Редактирование услуги
            </h3>

            <div className="space-y-4">
              {/* Базовые настройки */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-zinc-800 rounded-lg p-4 bg-zinc-950/50">
                <div>
                  <label className="text-sm font-medium mb-2 block">Название услуги</label>
                  <Input
                    value={editedService.title || ""}
                    onChange={(e) =>
                      setEditedService({ ...editedService, title: e.target.value })
                    }
                    className="bg-zinc-950 border-zinc-800"
                    placeholder="Персонал на склад"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Slug (URL)</label>
                  <Input
                    value={editedService.slug || ""}
                    onChange={(e) =>
                      setEditedService({ ...editedService, slug: e.target.value })
                    }
                    className="bg-zinc-950 border-zinc-800"
                    placeholder="personnel-na-sklad"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Используется в адресе страницы услуги:
                    <span className="ml-1 text-xs text-foreground">
                      /services/категория/{editedService.slug || "slug"}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Категория</label>
                  <select
                    value={editedService.categoryId || ""}
                    onChange={(e) =>
                      setEditedService({
                        ...editedService,
                        categoryId: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 rounded-md bg-zinc-950 border border-zinc-800 text-sm"
                  >
                    <option value="" disabled>
                      Выберите категорию
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Краткая цена</label>
                  <Input
                    value={editedService.price || ""}
                    onChange={(e) =>
                      setEditedService({ ...editedService, price: e.target.value })
                    }
                    className="bg-zinc-950 border-zinc-800"
                    placeholder="от 1500 руб/смена"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Отображается на карточке услуги и в списках.
                  </p>
                </div>

                <div className="md:col-span-2 flex items-center justify-between mt-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Форма заявки на странице услуги
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      При отключении форма справа и кнопка «Рассчитать стоимость» будут скрыты.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditedService((prev) => ({
                        ...prev,
                        showOrderForm: !(prev.showOrderForm ?? true),
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editedService.showOrderForm ?? true
                        ? "bg-[oklch(0.75_0.18_50)]"
                        : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                        editedService.showOrderForm ?? true
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Описание</label>
                <Textarea
                  value={editedService.description || ""}
                  onChange={(e) =>
                    setEditedService({ ...editedService, description: e.target.value })
                  }
                  className="bg-zinc-950 border-zinc-800"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Полное описание</label>
                <Textarea
                  value={editedService.fullDescription || ""}
                  onChange={(e) =>
                    setEditedService({ ...editedService, fullDescription: e.target.value })
                  }
                  className="bg-zinc-950 border-zinc-800"
                  rows={5}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">SEO текст</label>
                <Textarea
                  value={editedService.seoText || ""}
                  onChange={(e) =>
                    setEditedService({ ...editedService, seoText: e.target.value })
                  }
                  className="bg-zinc-950 border-zinc-800"
                  rows={4}
                />
              </div>

              {/* Галерея фотографий услуги */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Фотографии услуги
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Загрузите изображения с устройства или вставьте ссылки на
                  картинки. Эти фото будут использоваться в галерее на странице
                  услуги, а <span className="font-semibold">первая картинка</span>
                  &nbsp;— в качестве фона в верхнем блоке страницы услуги.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => imageFileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="border-zinc-700 text-xs"
                    >
                      {isUploadingImage ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Загрузка...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Загрузить с устройства
                        </span>
                      )}
                    </Button>
                    <span className="text-[10px] text-muted-foreground">
                      JPG / PNG / WebP до 5МБ
                    </span>
                  </div>

                  {(editedService.images || []).map((url, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center gap-2"
                    >
                      <Input
                        value={url}
                        onChange={(e) => {
                          const next = [...(editedService.images || [])];
                          next[index] = e.target.value;
                          setEditedService({
                            ...editedService,
                            images: next,
                          });
                        }}
                        placeholder="https://..."
                        className="bg-zinc-950 border-zinc-800 text-sm flex-1"
                      />
                      <div className="flex items-center gap-1">
                        {index !== 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="border-zinc-700 text-[10px] px-2"
                            title="Сделать главным фото"
                            onClick={() => {
                              const current = editedService.images || [];
                              const next = [...current];
                              const [chosen] = next.splice(index, 1);
                              next.unshift(chosen);
                              setEditedService({
                                ...editedService,
                                images: next,
                              });
                            }}
                          >
                            1
                          </Button>
                        )}
                        {index === 0 && (
                          <span className="text-[10px] text-[oklch(0.75_0.18_50)] px-2 py-1 border border-[oklch(0.75_0.18_50)]/40 rounded">
                            Главное фото
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => {
                            const next = [...(editedService.images || [])];
                            next.splice(index, 1);
                            setEditedService({
                              ...editedService,
                              images: next,
                            });
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const next = [...(editedService.images || [])];
                      next.push("");
                      setEditedService({
                        ...editedService,
                        images: next,
                      });
                    }}
                    className="w-full justify-center border-zinc-700 text-xs"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить фото
                  </Button>
                </div>
              </div>

              {/* Таблица тарифов */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Тарифы (для блока «Тарифы» на странице услуги)
                </label>
                <div className="space-y-2">
                  {(editedService.pricingTable || []).map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[2fr,1.2fr,auto] gap-2 items-center"
                    >
                      <Input
                        value={row.name}
                        onChange={(e) => {
                          const next = [...(editedService.pricingTable || [])];
                          next[index] = { ...next[index], name: e.target.value };
                          setEditedService({
                            ...editedService,
                            pricingTable: next,
                          });
                        }}
                        placeholder="Название позиции (например, Грузчик 8 часов)"
                        className="bg-zinc-950 border-zinc-800 text-sm"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={row.price}
                          onChange={(e) => {
                            const next = [...(editedService.pricingTable || [])];
                            next[index] = { ...next[index], price: e.target.value };
                            setEditedService({
                              ...editedService,
                              pricingTable: next,
                            });
                          }}
                          placeholder="от 2000"
                          className="bg-zinc-950 border-zinc-800 text-sm"
                        />
                        <Input
                          value={row.unit || ""}
                          onChange={(e) => {
                            const next = [...(editedService.pricingTable || [])];
                            next[index] = { ...next[index], unit: e.target.value };
                            setEditedService({
                              ...editedService,
                              pricingTable: next,
                            });
                          }}
                          placeholder="руб/смена"
                          className="bg-zinc-950 border-zinc-800 text-xs w-28"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => {
                          const next = [...(editedService.pricingTable || [])];
                          next.splice(index, 1);
                          setEditedService({
                            ...editedService,
                            pricingTable: next,
                          });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const next = [...(editedService.pricingTable || [])];
                      next.push({
                        name: "",
                        price: "",
                        unit: "",
                      });
                      setEditedService({
                        ...editedService,
                        pricingTable: next,
                      });
                    }}
                    className="w-full justify-center border-zinc-700 text-xs"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить строку тарифа
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => editingService && handleDelete(editingService)}
                  disabled={isSaving}
                  className="text-red-400 border-red-500/40 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить услугу
                </Button>
                <Button
                  onClick={() => handleSave(editingService)}
                  disabled={isSaving}
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.7_0.18_50)] text-black"
                >
                  Сохранить
                </Button>
                <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
                  Отмена
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

