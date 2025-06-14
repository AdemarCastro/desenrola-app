"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";
import { logout } from "@/lib/logout";

import {
  LayoutDashboard,
  CalendarDays,
  Kanban,
  ClipboardList,
  PlusSquare,
  FolderKanban,
  Users,
  BarChart2,
  UserCircle,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";

const menu = [
  { name: "Projetos", path: "/projetos", icon: <LayoutDashboard size={18} /> },
  { name: "Cronograma", path: "/cronograma", icon: <CalendarDays size={18} /> },
  { name: "Quadro Kanban", path: "/kanban", icon: <Kanban size={18} /> },
  { name: "Dashboard", path: "/dashboard", icon: <ClipboardList size={18} /> },
  {
    name: "Criar Tarefa",
    path: "/criar-tarefa",
    icon: <PlusSquare size={18} />,
  },
  {
    name: "Criar Projeto",
    path: "/criar-projeto",
    icon: <FolderKanban size={18} />,
  },
  { name: "Gerenciar Usuários", path: "/usuarios", icon: <Users size={18} /> },
  {
    name: "Relatórios de Desempenho",
    path: "/relatorios",
    icon: <BarChart2 size={18} />,
  },
  { name: "Account", path: "/account", icon: <UserCircle size={18} /> },
  {
    name: "Configurações",
    path: "/configuracoes",
    icon: <Settings size={18} />,
  },
  { name: "Termos de uso", path: "/termos", icon: <FileText size={18} /> },
  { name: "Sair", action: logout, icon: <LogOut size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const usuario = useUsuarioLogado();

  return (
    <aside className="w-64 bg-white text-black p-6 space-y-4 hidden lg:block shadow-md">
      {/* Saudação */}
      <div className="bg-black text-white rounded-lg px-4 py-2 flex items-center gap-3 mb-6 mt-2 shadow">
        <Image
          src={usuario?.avatar_url || "/icone-usuario.png"}
          alt="Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
        <span className="text-sm font-medium">
          {usuario ? `Olá, ${usuario.primeiro_nome}!` : "Carregando..."}
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex flex-col gap-2">
        {menu.map((item) =>
          item.action ? (
            <button
              key={item.name}
              onClick={item.action}
              className={cn(
                "flex items-center gap-2 text-left w-full hover:bg-black/10 rounded px-3 py-2 transition"
              )}
            >
              {item.icon}
              {item.name}
            </button>
          ) : (
            <Link
              key={item.path}
              href={item.path!}
              className={cn(
                "flex items-center gap-2 hover:bg-black/10 rounded px-3 py-2 transition",
                pathname === item.path ? "bg-black/10 font-semibold" : ""
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}
