"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";
import { logout } from "@/lib/logout";

import {
  FolderOpen,
  Calendar,
  LayoutGrid,
  BarChart3,
  Plus,
  Users,
  FileText,
  User,
  Settings,
  FileCheck,
  LogOut,
} from "lucide-react";

const menu = [
  { name: "Projetos", path: "/projetos", icon: FolderOpen },
  { name: "Cronograma", path: "/cronograma", icon: Calendar },
  { name: "Quadro Kanban", path: "/kanban", icon: LayoutGrid },
  { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { name: "Criar Tarefa", path: "/criar-tarefa", icon: Plus },
  { name: "Criar Projeto", path: "/criar-projeto", icon: FileText},
  { name: "Gerenciar Usuários", path: "/usuarios", icon: Users },
  { name: "Relatórios de Desempenho", path: "/relatorios", icon: FileText },
  { name: "Account", path: "/account", icon: User },
  { name: "Configurações", path: "/configuracoes", icon: Settings },
  { name: "Termos de uso", path: "/termos", icon: FileCheck },
  { name: "Sair", action: logout, icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();
  const { usuario, loading } = useUsuarioLogado();

  return (
    <aside className="w-64 bg-white text-black p-6 space-y-4 hidden lg:block">
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
          {loading
            ? "Carregando..."
            : usuario
            ? `Olá, ${usuario.primeiro_nome}!`
            : "Não logado"}
        </span>
      </div>
      <nav className="flex flex-col gap-2">
        {menu.map((item) =>
          item.action ? (
            <button
              key={item.name}
              onClick={item.action}
              className="flex items-center gap-2 text-left w-full px-3 py-2 hover:bg-black/10 rounded transition"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ) : (
            <Link
              key={item.path}
              href={item.path!}
              className={cn(
                "flex items-center gap-2 px-3 py-2 hover:bg-black/10 rounded transition",
                pathname === item.path ? "bg-black/10 font-semibold" : ""
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}