import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FormCriarProjetoWrapper } from "@/components/FormCriarProjetoWrapper";
import { Usuario } from "@/types/Usuario";

async function criarProjeto(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const nome = formData.get("nome")?.toString();
  const descricao = formData.get("descricao")?.toString();
  const dataEntrega = formData.get("data_entrega")?.toString();
  const proprietarioId = formData.get("proprietario_id")?.toString();
  const membrosIds = formData.getAll("membros_ids").map((id) => Number(id));

  if (!nome || !dataEntrega || !proprietarioId) {
    throw new Error("Dados obrigatórios faltando");
  }

  // 1. Cria o projeto
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nome,
      descricao,
      data_entrega: dataEntrega,
    }),
  });

  if (!res.ok) throw new Error("Erro ao criar projeto");

  const projeto = await res.json();
  const projetoId = projeto.id;

  // 2. Cadastra o proprietário como gerente
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projetos/${projetoId}/usuarios`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_usuario: Number(proprietarioId),
        nivel_acesso_id: 2, // gerente
      }),
    }
  );

  // 3. Cadastra os membros comuns
  await Promise.all(
    membrosIds.map((id) =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projetos/${projetoId}/usuarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario: id,
            nivel_acesso_id: 3, // membro
          }),
        }
      )
    )
  );

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

  const usuarios: Usuario[] = await res.json();

  const gerentes = usuarios.filter((u) => u.nivel_acesso_id === 2);
  const membros = usuarios.filter((u) => u.nivel_acesso_id === 3);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Projeto</h1>
      <FormCriarProjetoWrapper
        action={criarProjeto}
        proprietarios={gerentes}
        membros={membros}
      />
    </div>
  );
}
