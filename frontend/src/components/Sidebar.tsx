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

const menuItems = [
  { href: "/projetos", label: "Projetos", icon: FolderOpen },
  { href: "/cronograma", label: "Cronograma", icon: Calendar },
  { href: "/kanban", label: "Quadro Kanban", icon: LayoutGrid },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/criar-tarefa", label: "Criar Tarefa", icon: Plus },
  { href: "/criar-projeto", label: "Criar Projeto", icon: FileText },
  { href: "/usuarios", label: "Gerenciar Usuários", icon: Users },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  // { href: "/account", label: "Conta", icon: User },
  // { href: "/configuracoes", label: "Configurações", icon: Settings },
  { href: "/termos", label: "Termos de uso", icon: FileCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const { usuario, loading } = useUsuarioLogado();

  return (
    <aside className="w-80 bg-black border-r border-gray-800 h-screen flex flex-col sticky top-0">
      {/* Seção do Usuário */}
      <div className="p-4">
        <div className="bg-gray-900 text-white rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full overflow-hidden">
            <Image 
              src={usuario?.avatar_url || "/icone-usuario.png"} 
              alt="Avatar" 
              width={40} 
              height={40} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium">
            {loading ? "Carregando..." : `Olá, ${usuario?.primeiro_nome || "Visitante"}!`}
          </span>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer text-sm font-medium",
                pathname === item.href ? "bg-white text-black" : ""
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          {/* Botão de Sair */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer text-sm font-medium w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}