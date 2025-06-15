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
      <body className="h-screen flex flex-col">
        {!isLoginPage && <Header />}

        <div className="flex flex-1 overflow-hidden">
          {!isLoginPage && <Sidebar />}
          <main className={isLoginPage ? "w-full" : "flex-1 p-6 overflow-auto"}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
