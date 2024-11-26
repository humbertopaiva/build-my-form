// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ToastProvider } from "@/components/providers/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Form Builder",
  description: "Construtor de formulários dinâmicos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://unpkg.com/htmx.org@1.9.10"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
