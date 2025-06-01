"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Projeto {
  id: number;
  nome: string;
  progresso: number;
  descricao?: string;
  data_entrega?: string;
  criado_em: string;
  atualizado_em: string;
}

export default function ProjetosPage() {
  const router = useRouter();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [modalProjeto, setModalProjeto] = useState<Projeto | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchProjetos() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar projetos");
        const response = await res.json();
        setProjetos(response.data);
      } catch (e) {
        if (e instanceof Error) {
          setErro(e.message);
        } else {
          setErro("Erro ao carregar");
        }
      }      
    }

    fetchProjetos();
  }, [router]);

  const getBarColor = (progress: number) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 50) return "bg-yellow-400";
    return "bg-red-600";
  };

  const getStatus = (progress: number) => {
    if (progress >= 100) return "Finalizado";
    if (progress > 0) return "Em andamento";
    return "Planejado";
  };

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold mb-6">Projetos</h1>

      {erro ? (
        <p className="text-red-500">Erro: {erro}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetos.map((projeto) => (
            <div
              key={projeto.id}
              className="bg-white p-6 rounded-xl border shadow hover:shadow-lg transform hover:scale-[1.02] transition cursor-pointer"
              onClick={() => setModalProjeto(projeto)}
            >
              <p className="text-sm text-gray-500 mb-2">
                {getStatus(projeto.progresso)}
              </p>
              <h2 className="font-semibold text-lg">{projeto.nome}</h2>
              <p className="text-sm mt-2 mb-1">{projeto.progresso}% Completo</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                <div
                  className={`${getBarColor(
                    projeto.progresso
                  )} h-2 rounded-full`}
                  style={{ width: `${projeto.progresso}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Criado em:</strong>{" "}
                  {new Date(projeto.criado_em).toLocaleDateString()}
                </p>
                {projeto.data_entrega && (
                  <p>
                    <strong>Entrega:</strong>{" "}
                    {new Date(projeto.data_entrega).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      {modalProjeto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setModalProjeto(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">{modalProjeto.nome}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {getStatus(modalProjeto.progresso)}
            </p>
            <p className="mb-2">
              <strong>Descrição:</strong>{" "}
              {modalProjeto.descricao || "Sem descrição."}
            </p>
            <p className="mb-2">
              <strong>Progresso:</strong> {modalProjeto.progresso}%
            </p>
            <p className="mb-2">
              <strong>Data de Entrega:</strong>{" "}
              {modalProjeto.data_entrega
                ? new Date(modalProjeto.data_entrega).toLocaleDateString()
                : "Não definida"}
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Última atualização em{" "}
              {new Date(modalProjeto.atualizado_em).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
