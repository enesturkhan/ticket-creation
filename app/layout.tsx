import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeFusion 2025",
  description: "CodeFusion 2025 Etkinlik Bilet Sistemi"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-[#1e293b] to-[#111827]">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
