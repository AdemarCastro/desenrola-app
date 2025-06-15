"use client";

import { useState } from "react";
import { Projeto } from "@/types/projeto";

const getBarColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-yellow-400";
  if (progress > 0) return "bg-red-400";
  return "bg-gray-400";
};

const getStatus = (progress: number) => {
  if (progress >= 100) return "Finalizado";
  if (progress > 0) return "Em andamento";
  return "Planejado";
};

export function ProjetosClientUI({ projetosIniciais }: { projetosIniciais: Projeto[] }) {
  const [projetos, setProjetos] = useState(projetosIniciais);
  const [modalProjeto, setModalProjeto] = useState<Projeto | null>(null);

  const handleSaveChanges = async () => {
    if (!modalProjeto) return;

    const res = await fetch(`/api/projetos/${modalProjeto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: modalProjeto.nome,
          descricao: modalProjeto.descricao,
          data_entrega: modalProjeto.data_entrega,
        }),
    });

    if (res.ok) {
        const projetoAtualizado = await res.json();
        setProjetos(prev =>
          prev.map(p => (p.id === projetoAtualizado.id ? projetoAtualizado : p))
        );
        setModalProjeto(null);
    } else {
        const erro = await res.json();
        alert(erro.details?.message || "Erro ao salvar alterações");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetos.map((projeto) => {
          const progresso = projeto.progresso ?? 0;
          return (
            <div
              key={projeto.id}
              className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
              onClick={() => setModalProjeto(projeto)}
            >
              <p className="text-sm text-gray-500 mb-1">{getStatus(progresso)}</p>
              <h2 className="font-bold text-xl text-black mb-3">{projeto.nome}</h2>
              <div className="w-full h-3 bg-gray-200 rounded-full mb-2 overflow-hidden">
                <div
                  className={`${getBarColor(progresso)} h-3 rounded-full`}
                  style={{ width: `${progresso}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">{progresso}% Completo</p>
              <hr className="border-t border-gray-200 mb-3" />
              <div className="text-sm text-gray-700 flex flex-col gap-1">
                <p>
                  <strong>Criado em:</strong>{" "}
                  {new Date(projeto.criado_em).toLocaleDateString("pt-BR", { 
                    day: "2-digit", 
                    month: "short", 
                    year: "numeric",
                    timeZone: 'UTC'
                  })}
                </p>
                {projeto.data_entrega && (
                  <p>
                    <strong>Entrega:</strong>{" "}
                    {new Date(projeto.data_entrega).toLocaleDateString("pt-BR", { 
                      day: "2-digit", 
                      month: "short", 
                      year: "numeric",
                      timeZone: 'UTC'
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalProjeto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative text-black">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
              onClick={() => setModalProjeto(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Editar Projeto</h2>
            
            <label className="text-sm font-medium text-gray-600">Nome do projeto</label>
            <input
              type="text"
              className="w-full mb-3 p-2 border rounded text-black bg-gray-50"
              value={modalProjeto.nome}
              onChange={(e) => setModalProjeto({ ...modalProjeto, nome: e.target.value })}
            />

            <label className="text-sm font-medium text-gray-600">Descrição</label>
            <textarea
              className="w-full mb-3 p-2 border rounded text-black bg-gray-50"
              rows={3}
              value={modalProjeto.descricao || ""}
              onChange={(e) => setModalProjeto({ ...modalProjeto, descricao: e.target.value })}
            />

            <label className="text-sm font-medium text-gray-600">Data de Entrega</label>
            <input
              type="date"
              className="w-full mb-4 p-2 border rounded text-black bg-gray-50"
              value={modalProjeto.data_entrega ? new Date(modalProjeto.data_entrega).toISOString().slice(0, 10) : ""}
              onChange={(e) => setModalProjeto({ ...modalProjeto, data_entrega: e.target.value })}
            />

            <button
              className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded transition-colors"
              onClick={handleSaveChanges}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}
    </>
  );
}