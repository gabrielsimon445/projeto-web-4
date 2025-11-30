import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./clientLayout";
import VLibrasClient from "@/components/shared/libras/Vlibras";
import { AccessibilityProvider } from "@/components/shared/accessibility/AccessibilityContext";
import AccessibilitySidebar from "@/components/shared/accessibility/AccessibilitySidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bitterSerif = Bitter({
  variable: "--font-bitter-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Gerencie suas tarefas de forma eficiente e organizada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bitterSerif.variable} antialiased`}
      >
        <ClientLayout>
          <AccessibilityProvider>
            <AccessibilitySidebar />
            <VLibrasClient />
            {children}
          </AccessibilityProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
