import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}