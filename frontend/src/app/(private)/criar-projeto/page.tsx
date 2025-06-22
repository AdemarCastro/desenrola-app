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
    }),
  });

  redirect("/criar-projeto?sucesso=1");
}

export default function CriarProjetoPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Projeto</h1>
      <FormCriarProjetoWrapper action={criarProjeto} />
    </div>
  );
}
