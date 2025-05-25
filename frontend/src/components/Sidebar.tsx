"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const menu = [
  { name: "Projetos", path: "/projetos" },
  { name: "Cronograma", path: "/cronograma" },
  { name: "Quadro Kanban", path: "/kanban" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Criar Tarefa", path: "/criar-tarefa" },
  { name: "Criar Projeto", path: "/criar-projeto" },
  { name: "Gerenciar Usuários", path: "/usuarios" },
  { name: "Relatórios de Desempenho", path: "/relatorios" },
  { name: "Account", path: "/account" },
  { name: "Configurações", path: "/configuracoes" },
  { name: "Termos de uso", path: "/termos" },
  { name: "Sair", path: "/logout" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black text-white p-6 space-y-4 hidden lg:block">
      <div className="text-2xl font-bold mb-6">Desenrola</div>
      <div className="flex items-center gap-2 mb-6">
        <img
          src="/avatar.png"
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>Olá, Ana!</div>
      </div>
      <nav className="flex flex-col gap-4">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "hover:bg-white/10 rounded px-3 py-2 transition",
              pathname === item.path ? "bg-white/10" : ""
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
