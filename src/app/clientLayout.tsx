"use client";

import "./globals.css";
import { Calendar, CheckSquare, Kanban, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Kanban",
    url: "/kanban",
    icon: Kanban,
  },
];

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html>
      <body>
        {pathname !== "/" && pathname !== "/login" && pathname !== "/signup" ? (
          <div className="flex w-full bg-[#FAFAF9]">
            <div className="border-r border-gray-200 bg-white w-48 block h-screen sticky top-0">
              <div className="border-b border-gray-200 px-6 py-5">
                <Link className="flex items-center gap-2.5" href="/dashboard">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                    <CheckSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-base">
                      TaskFlow
                    </h2>
                  </div>
                </Link>
              </div>

              <div className="px-3 py-4">
                {navigationItems.map((item) => (
                  <div key={item.title}>
                    <div
                      className={`hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-xl mb-1 ${
                        pathname === item.url
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      <Link
                        className="flex items-center gap-3 px-4 py-3"
                        href={`${item.url}`}
                      >
                        <item.icon className="w-5 h-5" strokeWidth={2} />
                        <span>{item.title}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <main className="flex-1 flex flex-col">
              <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
                <div className="flex items-center gap-4">
                  <div className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
                  <h1 className="text-xl font-semibold">TaskFlow</h1>
                </div>
              </header>
              <div className="flex-1 overflow-auto">{children}</div>
            </main>
          </div>
        ) : (
          <div>{children}</div>
        )}
      </body>
    </html>
  );
}
