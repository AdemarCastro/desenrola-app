"use client";

import { useSearchParams } from "next/navigation";
import { FormCriarTarefa } from "./FormCriarTarefa";
import type { Projeto } from "@/types/projeto";

interface Props {
  projetos: Projeto[];
  action: (formData: FormData) => Promise<void>;
}

export function FormCriarTarefaWrapper({ projetos, action }: Props) {
  const searchParams = useSearchParams();
  const sucesso = searchParams.get("sucesso") === "1";

  return (
    <>
      {sucesso && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          ✅ Tarefa criada com sucesso!
        </div>
      )}
      <FormCriarTarefa projetos={projetos} action={action} />
    </>
  );
}
