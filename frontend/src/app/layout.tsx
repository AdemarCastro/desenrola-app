import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ReactNode } from "react";

export const metadata = {
  title: "Desenrola",
  description: "Sistema de Gerenciamento",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-6 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
