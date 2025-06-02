import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";
import { logout } from "@/lib/logout";

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
  { name: "Sair", action: logout },
];

export default function Sidebar() {
  const pathname = usePathname();
  const usuario = useUsuarioLogado();

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
          {usuario ? `Olá, ${usuario.primeiro_nome}!` : "Carregando..."}
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
