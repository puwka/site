import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import MobileStickyButton from "@/components/MobileStickyButton";
import { getCategoryBySlug, getServicesByCategory } from "@/data/services";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import CategoryPageClient from "./CategoryPageClient";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const categoryServices = getServicesByCategory(category.id);

  return (
    <>
      <CategoryPageClient category={category} services={categoryServices} />
      <Footer />
      <MobileStickyButton />
    </>
  );
}
