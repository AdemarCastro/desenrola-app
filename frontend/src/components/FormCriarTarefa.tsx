"use client";

import type { Projeto } from "@/types/projeto";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface Props {
  projetos: Projeto[];
  action: (formData: FormData) => Promise<void>;
}

export function FormCriarTarefa({ projetos, action }: Props) {
  const [selectedProjetoId, setSelectedProjetoId] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    // Add the selected project ID to the form data
    formData.set("projetoId", selectedProjetoId);
    await action(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="projetoId" className="block mb-1">
          Projeto
        </label>
        <Select value={selectedProjetoId} onValueChange={setSelectedProjetoId} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um projeto" />
          </SelectTrigger>
          <SelectContent>
            {projetos.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Hidden input to ensure form validation works */}
        <input 
          type="hidden" 
          name="projetoId" 
          value={selectedProjetoId} 
          required 
        />
      </div>

      <div>
        <label htmlFor="titulo" className="block mb-1">
          Título
        </label>
        <input
          id="titulo"
          type="text"
          name="titulo"
          required
          placeholder="Ex: Corrigir bug de login"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="block mb-1">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          placeholder="Descreva os detalhes da tarefa"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="prioridadeId" className="block mb-1">
          Prioridade
        </label>
        <select
          id="prioridadeId"
          name="prioridadeId"
          required
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="1">Normal</option>
          <option value="2">Alta</option>
          <option value="3">Baixa</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-neutral-800 transition cursor-pointer"
      >
        Criar Tarefa
      </button>
    </form>
  );
}
