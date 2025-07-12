import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Projeto } from "@/types/projeto";
import { FormCriarTarefaWrapper } from "@/components/FormCriarTarefaWrapper";

// Status baseados no seed do backend
const statusTarefa = [
  { id: "1", label: "Pendente" },
  { id: "2", label: "Em Progresso" },
  { id: "3", label: "Concluída" },
];

async function fetchProjetos(token: string): Promise<Projeto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error("Erro ao buscar projetos");

  const body = await res.json();
  return body.data;
}

async function criarTarefa(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const titulo = formData.get("titulo")?.toString();
  const descricao = formData.get("descricao")?.toString();
  const projetoId = formData.get("projetoId")?.toString();
  const prioridadeId = formData.get("prioridadeId")?.toString();
  const statusId = formData.get("statusId")?.toString();

  if (!titulo || !projetoId || !prioridadeId || !statusId) {
    throw new Error("Dados obrigatórios ausentes");
  }

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tarefas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      descricao: `${titulo} - ${descricao || ""}`,
      status_id: Number(statusId),
      prioridade_id: Number(prioridadeId),
      id_projeto: Number(projetoId),
    }),
  });

  redirect("/criar-tarefa?sucesso=1");
}

export default async function CriarTarefaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let projetos: Projeto[] = [];
  try {
    projetos = await fetchProjetos(token);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          Erro: {msg}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Criar Nova Tarefa</h1>
        <p className="text-muted-foreground">
          Preencha as informações abaixo para criar uma nova tarefa.
        </p>
      </div>
      <FormCriarTarefaWrapper
        projetos={projetos}
        statuses={statusTarefa}
        action={criarTarefa}
      />
    </div>
  );
}
