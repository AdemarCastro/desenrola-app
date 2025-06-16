import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
            {children}
        </main>
      </div>
    </div>
  );
}