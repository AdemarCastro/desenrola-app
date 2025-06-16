import type { Projeto } from "@/types/projeto";

interface Props {
  projetos: Projeto[];
  action: (formData: FormData) => Promise<void>;
}

export function FormCriarTarefa({ projetos, action }: Props) {
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="projetoId" className="block mb-1">
          Projeto
        </label>
        <select
          id="projetoId"
          name="projetoId"
          required
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="">Selecione um projeto</option>
          {projetos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
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
