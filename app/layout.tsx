import type { Metadata, Viewport } from "next";
import "./globals.css";
import { FinanceProvider } from "@/context/FinanceContext";
import { SecurityProvider } from "@/context/SecurityContext";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "HOME MONI - Quản Lý Tài Chính Gia Đình",
  description: "Tổ ấm hạnh phúc - Tài chính minh bạch - Vun vén tương lai cho 2 vợ chồng",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HOME MONI",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={cn("font-sans", inter.variable)}>
      <body className="font-sans antialiased">
        <SecurityProvider>
          <FinanceProvider>{children}</FinanceProvider>
        </SecurityProvider>
      </body>
    </html>
  );
}
