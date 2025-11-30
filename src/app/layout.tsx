import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./clientLayout";
import VLibrasClient from "@/components/shared/libras/Vlibras";
import { AccessibilityProvider } from "@/components/shared/accessibility/AccessibilityContext";
import AccessibilitySidebar from "@/components/shared/accessibility/AccessibilitySidebar";

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
    <html>
      <body>
        <AccessibilityProvider>
          <AccessibilitySidebar />
          <VLibrasClient />
          <ClientLayout>{children}</ClientLayout>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
