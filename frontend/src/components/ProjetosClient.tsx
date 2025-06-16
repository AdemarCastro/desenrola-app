"use client";

import { useState } from "react";
import { Projeto } from "@/types/projeto"; 

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

export function ProjetosClientUI({ projetos }: { projetos: Projeto[] }) {
  const [modalProjeto, setModalProjeto] = useState<Projeto | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetos.map((projeto) => (
          <div
            key={projeto.id}
            className="bg-white p-6 rounded-xl border shadow hover:shadow-lg transform hover:scale-[1.02] transition cursor-pointer"
            onClick={() => setModalProjeto(projeto)}
          >
            <p className="text-sm text-black/60 mb-2">
              {getStatus(projeto.progresso)}
            </p>
            <h2 className="font-semibold text-lg text-black">
              {projeto.nome}
            </h2>
            <p className="text-sm mt-2 mb-1 text-black/80">
              {projeto.progresso}% Completo
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
              <div
                className={`${getBarColor(
                  projeto.progresso
                )} h-2 rounded-full`}
                style={{ width: `${projeto.progresso}%` }}
              />
            </div>
            <div className="text-sm text-black/70">
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

      {modalProjeto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative text-black">
            <button
              className="absolute top-2 right-3 text-black/60 hover:text-black text-xl"
              onClick={() => setModalProjeto(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">{modalProjeto.nome}</h2>
            <p className="text-sm text-black/60 mb-4">
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
            <p className="text-sm text-black/50 mt-4">
              Última atualização em{" "}
              {new Date(modalProjeto.atualizado_em).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}