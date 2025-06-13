// src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import ClientLayout from "./components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

export { metadata };