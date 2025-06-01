"use client";

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rotasProtegidas = ["/", "/usuarios", "/projetos", "/dashboard"];
    if (!token && rotasProtegidas.includes(pathname)) {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <html lang="pt">
      <body className="flex h-screen">
        {!isLoginPage && <Sidebar />}
        <div className="flex flex-col flex-1">
          {!isLoginPage && <Header />}
          <main className={isLoginPage ? "w-full" : "p-6 overflow-auto"}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
