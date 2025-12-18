import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Oswald } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Тяжёлый Профиль — Аутсорсинг рабочего персонала",
  description: "Профессиональный подбор рабочего персонала для строительных объектов, складов, монтажных и промышленных работ. Более 1000 сотрудников в резерве.",
  keywords: "аутсорсинг персонала, строители, грузчики, монтажники, рабочий персонал, подбор персонала",
  authors: [{ name: "Тяжёлый Профиль" }],
  openGraph: {
    title: "Тяжёлый Профиль — Аутсорсинг рабочего персонала",
    description: "Профессиональный подбор рабочего персонала для строительных объектов, складов, монтажных и промышленных работ.",
    type: "website",
    locale: "ru_RU",
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

