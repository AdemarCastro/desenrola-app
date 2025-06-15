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
  { name: "Criar Projeto", path: "/criar-projeto", icon: FolderOpen },
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
    <aside className="w-64 bg-black text-white p-6 space-y-4 hidden lg:block">
      <div className="flex items-center gap-2 mb-6">
        <Image
          src="/desenrola-white.png"
          alt="Logo Desenrola"
          width={50}
          height={50}
        />
        <span className="text-2xl font-bold">Desenrola</span>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <Image
          src={usuario?.avatar_url || "/icone-usuario.png"}
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          {loading
            ? "Carregando..."
            : usuario
            ? `Olá, ${usuario.primeiro_nome}!`
            : "Não logado"}
        </div>
      </div>
      <nav className="flex flex-col gap-4">
        {menu.map((item) =>
          item.action ? (
            <button
              key={item.name}
              onClick={item.action}
              className={cn(
                "text-left w-full hover:bg-white/10 rounded px-3 py-2 transition"
              )}
            >
              {item.name}
            </button>
          ) : (
            <Link
              key={item.path}
              href={item.path!}
              className={cn(
                "hover:bg-white/10 rounded px-3 py-2 transition",
                pathname === item.path ? "bg-white/10" : ""
              )}
            >
              {item.name}
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}