"use client";

import { useSearchParams } from "next/navigation";

export function CriarProjetoFeedback() {
  const searchParams = useSearchParams();
  const sucesso = searchParams?.get("sucesso") === "1";

  if (!sucesso) return null;

  return (
    <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
      ✅ Projeto criado com sucesso!
    </div>
  );
}
