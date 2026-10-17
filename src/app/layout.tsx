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
  title: "一园两境 — Gardens Across Cultures",
  description: "《跨文化交际与国际智慧》课程网页作品",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${gardenChinese.variable} ${gardenEnglish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
