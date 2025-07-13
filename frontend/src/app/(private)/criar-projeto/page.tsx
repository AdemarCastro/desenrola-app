import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FormCriarProjetoWrapper } from "@/components/FormCriarProjetoWrapper";

async function criarProjeto(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const nome = formData.get("nome")?.toString();
  const descricao = formData.get("descricao")?.toString();
  const dataEntrega = formData.get("data_entrega")?.toString();
  const proprietarioId = formData.get("proprietario_id")?.toString();
  const membrosIds = formData
    .getAll("membros_ids[]")
    .map((id) => parseInt(id as string));

  if (!nome) {
    throw new Error("O nome do projeto é obrigatório.");
  }

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nome,
      descricao,
      data_entrega: dataEntrega,
      proprietario_id: proprietarioId,
      membros_ids: membrosIds,
    }),
  });

  redirect("/criar-projeto?sucesso=1");
}

export default async function CriarProjetoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const usuarios: any[] = await res.json();

  const gerentes = usuarios.filter((u) => u.nivel_acesso_id === 2);
  const membros = usuarios.filter((u) => u.nivel_acesso_id === 3);

  return (
    <div className="p-6 max-w-2xl mx-auto relative overflow-visible z-0">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Projeto</h1>
      <FormCriarProjetoWrapper
        action={criarProjeto}
        proprietarios={gerentes}
        membros={membros}
      />
    </div>
  );
}
