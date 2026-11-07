import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Universal Next.js Starter",
  description: "Calm Fintech Slate & Precision Terminal Starter Template (--preset b2dJCEImFF)",
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={cn("font-sans", inter.variable)}>
      <body className="font-sans antialiased bg-[#F6F8FB] text-[#172B4D] min-h-screen">
        {children}
      </body>
    </html>
  );
}

