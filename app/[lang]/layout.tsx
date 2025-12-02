import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Workers - Find Visa Sponsorship Jobs in Western Europe",
  description: "The leading job platform for skilled workers seeking visa sponsorship in the UK, Ireland, France, Germany, and Netherlands.",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-50 dark:bg-black flex flex-col`}
        suppressHydrationWarning={true}
      >
        <Navbar lang={lang} />
        <main className="flex-grow">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
