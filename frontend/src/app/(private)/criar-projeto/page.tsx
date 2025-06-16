import { cookies } from "next/headers"; //
import { redirect } from "next/navigation"; //
import { FormCriarProjeto } from "@/components/FormCriarProjeto"; // Importa o novo componente de formulário

export default async function CriarProjetoPage() {
  const cookieStore = await cookies(); //
  const token = cookieStore.get("token")?.value; //

  if (!token) {
    redirect("/login"); //
  }

  // Action para criar um novo projeto (Server Action)
  async function criarProjetoAction(formData: FormData) {
    "use server"; //

    const token = (await cookies()).get("token")?.value; //
    if (!token) {
      redirect("/login"); //
    }

    const nome = formData.get("nome")?.toString();
    const descricao = formData.get("descricao")?.toString();
    const dataEntregaStr = formData.get("dataEntrega")?.toString();

    if (!nome) {
      throw new Error("O nome do projeto é obrigatório.");
    }

    const body: { nome: string; descricao?: string; data_entrega?: string } = {
      nome,
    };

    if (descricao) {
      body.descricao = descricao;
    }

    if (dataEntregaStr) {
        body.data_entrega = dataEntregaStr; // Formato YYYY-MM-DD
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, //
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      const errorMessage = errorData.message || errorData.error || "Erro ao criar o projeto.";
      throw new Error(errorMessage);
    }

    redirect("/projetos?sucesso=projetoCriado"); // Redireciona para a página de projetos com um parâmetro de sucesso
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white text-black rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Projeto</h1>
      <FormCriarProjeto action={criarProjetoAction} />
    </div>
  );
}