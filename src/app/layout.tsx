import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gardenChinese = localFont({
  src: [
    { path: "../../public/sites/gardens/fonts/NotoSerifSC-Regular-subset.ttf", weight: "400", style: "normal" },
    { path: "../../public/sites/gardens/fonts/NotoSerifSC-Medium-subset.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-garden-cn",
  display: "swap",
  adjustFontFallback: false,
});

const gardenEnglish = localFont({
  src: [
    { path: "../../public/sites/gardens/fonts/CormorantGaramond-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-garden-en",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "从网师园到 Stourhead：园林观看中的跨文化理解——一园两境",
  description: "以苏州网师园与英国 Stourhead 为案例的中英双语数字展览。从窗景、园路与水面出发，观察两座园林的观看方式，探索跨文化理解。",
  openGraph: {
    title: "从网师园到 Stourhead：园林观看中的跨文化理解——一园两境",
    description: "From the Master-of-Nets Garden to Stourhead: two gardens, different ways of seeing, and shared questions about nature. A bilingual exhibition exploring intercultural understanding.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "从网师园到 Stourhead：园林观看中的跨文化理解——一园两境",
    description: "从网师园与 Stourhead 的窗景、园路与水面，探索两种观看方式与跨文化理解。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gardenChinese.variable} ${gardenEnglish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
