"use client";

import { useSearchParams } from "next/navigation";
import { FormCriarProjeto } from "./FormCriarProjeto";

interface Props {
  action: (formData: FormData) => Promise<void>;
}

export function FormCriarProjetoWrapper({ action }: Props) {
  const searchParams = useSearchParams();
  const sucesso = searchParams?.get("sucesso") === "1";

  return (
    <>
      {sucesso && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          ✅ Projeto criado com sucesso!
        </div>
      )}
      <FormCriarProjeto action={action} />
    </>
  );
}
