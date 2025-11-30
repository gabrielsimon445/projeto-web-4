import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./clientLayout";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";

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
          <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
