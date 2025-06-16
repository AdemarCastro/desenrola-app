import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Projeto } from "@/types/projeto";
import { FormCriarTarefa } from "@/components/FormCriarTarefa";

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

  if (!titulo || !projetoId || !prioridadeId) {
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
      status_id: 1,
      prioridade_id: Number(prioridadeId),
      id_projeto: Number(projetoId),
    }),
  });

  redirect("/criar-tarefa?sucesso=1");
}

export default async function CriarTarefaPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let projetos: Projeto[] = [];
  try {
    projetos = await fetchProjetos(token);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return <p className="text-red-600">Erro: {msg}</p>;
  }

  const sucesso = searchParams?.sucesso === "1";

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Criar Nova Tarefa</h1>

      {sucesso && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          ✅ Tarefa criada com sucesso!
        </div>
      )}

      <FormCriarTarefa projetos={projetos} action={criarTarefa} />
    </div>
  );
}
