"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  delay?: number;
}

export default function ServiceCard({ icon: Icon, title, description, href, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Link href={href}>
        <Card className="h-full hover:border-[oklch(0.75_0.18_50)] transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.75_0.18_50)]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[oklch(0.75_0.18_50)]/20 transition-colors">
              <Icon className="w-8 h-8 text-[oklch(0.75_0.18_50)]" />
            </div>
            <h3 className="font-[var(--font-oswald)] text-lg font-bold uppercase mb-2 group-hover:text-[oklch(0.75_0.18_50)] transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

