interface Props {
  action: (formData: FormData) => Promise<void>;
}

export function FormCriarProjeto({ action }: Props) {
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block mb-1">
          Nome do Projeto
        </label>
        <input
          id="nome"
          type="text"
          name="nome"
          required
          placeholder="Ex: Novo Sistema de Pagamento"
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
          placeholder="Descreva os detalhes do projeto"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-neutral-800 transition cursor-pointer"
      >
        Criar Projeto
      </button>
    </form>
  );
}
