"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Projeto {
  id: number;
  nome: string;
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
  const [progressoProjetos, setProgressoProjetos] = useState<
    Record<number, number>
  >({});

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

        response.data.forEach((projeto: Projeto) => {
          calcularProgressoPorProjeto(projeto.id, token!);
        });
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao carregar");
      }
    }

    fetchProjetos();
  }, [router]);

  async function calcularProgressoPorProjeto(projetoId: number, token: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projetos/${projetoId}/tarefas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok)
        throw new Error(`Erro ao buscar tarefas do projeto ${projetoId}`);

      const tarefas = await res.json();
      const total = tarefas.length;
      const concluidas = tarefas.filter((t: any) => t.status_id === 2).length;

      const progresso =
        total === 0 ? 0 : Math.round((concluidas / total) * 100);
      setProgressoProjetos((prev) => ({ ...prev, [projetoId]: progresso }));
    } catch (error) {
      console.error(
        `Erro ao calcular progresso do projeto ${projetoId}:`,
        error
      );
    }
  }

  const getBarColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-400";
    if (progress > 0) return "bg-red-400";
    return "bg-gray-400";
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Projetos</h1>

      {erro ? (
        <p className="text-red-500 text-sm">Erro: {erro}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetos.map((projeto) => {
            const progresso = progressoProjetos[projeto.id] ?? 0;
            const status =
              progresso >= 100
                ? "Finalizado"
                : progresso > 0
                ? "Em andamento"
                : "Planejado";

            return (
              <div
                key={projeto.id}
                className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
                onClick={() => setModalProjeto(projeto)}
              >
                <p className="text-sm text-gray-500 mb-1">{status}</p>

                <h2 className="font-bold text-xl text-black mb-3">
                  {projeto.nome}
                </h2>

                <div className="w-full h-3 bg-gray-200 rounded-full mb-2 overflow-hidden">
                  <div
                    className={`${getBarColor(progresso)} h-3 rounded-full`}
                    style={{ width: `${progresso}%` }}
                  />
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {progresso} % Completo
                </p>

                <hr className="border-t border-gray-200 mb-3" />

                <div className="text-sm text-gray-700 flex flex-col gap-1">
                  <p>
                    <strong>Criado em:</strong>{" "}
                    {new Date(projeto.criado_em).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {projeto.data_entrega && (
                    <p>
                      <strong>Entrega:</strong>{" "}
                      {new Date(projeto.data_entrega).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalProjeto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative text-black">
            <button
              className="absolute top-2 right-3 text-black/60 hover:text-black text-xl"
              onClick={() => setModalProjeto(null)}
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4">Editar Projeto</h2>

            {/* Nome do projeto */}
            <label className="text-sm font-medium text-gray-600">Nome</label>
            <input
              type="text"
              className="w-full mb-3 p-2 border rounded text-black"
              placeholder="Nome do projeto"
              value={modalProjeto.nome}
              onChange={(e) =>
                setModalProjeto({ ...modalProjeto, nome: e.target.value })
              }
            />

            {/* Descrição */}
            <label className="text-sm font-medium text-gray-600">
              Descrição
            </label>
            <textarea
              className="w-full mb-3 p-2 border rounded text-black"
              placeholder="Descrição"
              rows={3}
              value={modalProjeto.descricao || ""}
              onChange={(e) =>
                setModalProjeto({ ...modalProjeto, descricao: e.target.value })
              }
            />

            {/* Data de entrega */}
            <label className="text-sm font-medium text-gray-600">
              Data de Entrega
            </label>
            <input
              type="date"
              className="w-full mb-4 p-2 border rounded text-black"
              placeholder="Selecione a data"
              value={
                modalProjeto.data_entrega
                  ? modalProjeto.data_entrega.slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                setModalProjeto({
                  ...modalProjeto,
                  data_entrega: e.target.value,
                })
              }
            />

            {/* Botão salvar */}
            <button
              className="bg-black hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded"
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) return alert("Token ausente");

                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/projetos/${modalProjeto.id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      nome: modalProjeto.nome,
                      descricao: modalProjeto.descricao,
                      data_entrega: modalProjeto.data_entrega,
                    }),
                  }
                );

                if (res.ok) {
                  const atualizado = await res.json();

                  // Atualiza a lista local com o projeto modificado
                  setProjetos((prev) =>
                    prev.map((p) =>
                      p.id === atualizado.id ? { ...p, ...atualizado } : p
                    )
                  );
                  setModalProjeto(null);
                } else {
                  const erro = await res.json();
                  alert(erro.message || "Erro ao salvar alterações");
                }
              }}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
