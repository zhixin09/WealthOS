import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ClientProvider } from "@/components/shared/client-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/shared/sidebar";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WealthOS - Wealth Wellness Hub",
  description:
    "Unified wealth management dashboard with AI-powered financial wellness analytics, portfolio tracking, and personalized insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          <ClientProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </ClientProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
