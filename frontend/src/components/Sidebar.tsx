"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: FolderOpen, label: "Projetos", href: "/projetos" },
    { icon: Calendar, label: "Cronograma", href: "/cronograma" },
    { icon: LayoutGrid, label: "Quadro Kanban", href: "/kanban" },
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Plus, label: "Criar Tarefa", href: "/criar-tarefa" },
    { icon: FolderOpen, label: "Criar projeto", href: "/criar-projeto" },
    { icon: Users, label: "Gerenciar Usuários", href: "/usuarios" },
    { icon: FileText, label: "Relatórios de Desempenho", href: "/relatorios" },
    { icon: User, label: "Conta", href: "/account" },
    { icon: Settings, label: "Configurações", href: "/configuracoes" },
    { icon: FileCheck, label: "Termos de uso", href: "/termos" },
    { icon: LogOut, label: "Sair", href: "/sair" },
  ]

  return (
    <aside className="w-80 bg-black border-r border-gray-800 h-screen flex flex-col sticky top-0">
      {/* User Profile Section */}
      <div className="p-4">
        <div className="bg-black-800 text-white rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full overflow-hidden">
            <Image src="/images/placeholder-user.png" alt="Ana" className="w-full h-full object-cover" />
          </div>
          <span className="font-medium">Olá, Colaborador!</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} className={`sidebar-item ${isActive ? "active" : ""}`}>
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
