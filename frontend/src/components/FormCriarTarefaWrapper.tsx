"use client";

import { useSearchParams } from "next/navigation";
import { FormCriarTarefa } from "./FormCriarTarefa";
import type { Projeto } from "@/types/projeto";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Props {
  projetos: Projeto[];
  statuses?: { id: string; label: string }[];
  action: (formData: FormData) => Promise<void>;
}

export function FormCriarTarefaWrapper({ projetos, statuses = [], action }: Props) {
  const searchParams = useSearchParams();
  const sucesso = searchParams.get("sucesso") === "1";

  return (
    <div className="space-y-6">
      {sucesso && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Tarefa criada com sucesso!</span>
            </div>
          </CardContent>
        </Card>
      )}
      <FormCriarTarefa projetos={projetos} statuses={statuses} action={action} />
    </div>
  );
}
