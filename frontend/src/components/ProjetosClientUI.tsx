// frontend/src/components/ProjetosClientUI.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Projeto } from "@/types/projeto";
import { ProjetoCard } from "./ProjetoCard";
import { ProjetoSkeleton } from "./ProjetoSkeleton";
import { ProjetoModal } from "./ProjetoModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export function ProjetosClientUI({
  projetosIniciais,
}: {
  projetosIniciais: Projeto[];
}) {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [busca, setBusca] = useState("");
  const [modalProjeto, setModalProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjetos(projetosIniciais);
    setLoading(false);
  }, [projetosIniciais]);

  const projetosFiltrados = useMemo(() => {
    return projetos.filter((p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [projetos, busca]);

  const atualizarProjeto = (projetoAtualizado: Projeto) => {
    setProjetos((prev) =>
      prev.map((p) => (p.id === projetoAtualizado.id ? projetoAtualizado : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Buscar projetos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="sm:max-w-xs"
        />
        <Link href="/criar-projeto" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <PlusIcon className="w-4 h-4 mr-2" /> Criar Novo Projeto
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjetoSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetosFiltrados.map((projeto) => (
            <ProjetoCard
              key={projeto.id}
              projeto={projeto}
              onClick={() => setModalProjeto(projeto)}
            />
          ))}
        </div>
      )}

      {modalProjeto && (
        <ProjetoModal
          projeto={modalProjeto}
          onClose={() => setModalProjeto(null)}
          onSave={(atualizado) => {
            atualizarProjeto(atualizado);
            setModalProjeto(null);
          }}
        />
      )}
    </div>
  );
}
