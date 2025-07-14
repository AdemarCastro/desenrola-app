import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Projeto, UsuarioProjeto, UsuarioComNivel } from "@/types/projeto";
import { Tarefa } from "@/types/tarefa";
import { ProjetosClientUI } from "@/components/ProjetosClientUI";

async function fetchProjetosComProgresso(
  token: string | undefined
): Promise<Projeto[] | { error: string }> {
  if (!token) redirect("/login");

  try {
    const resProjetos = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projetos`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (resProjetos.status === 401) redirect("/login");
    if (!resProjetos.ok) throw new Error("Erro ao buscar projetos");

    const projetos: Projeto[] = (await resProjetos.json()).data;

    const projetosComTarefasEUsuarios = await Promise.all(
      projetos.map(async (projeto) => {
        const [resTarefas, resUsuarios] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projetos/${projeto.id}/tarefas`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projetos/${projeto.id}/usuarios`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            }
          ),
        ]);

        const tarefasJson = await resTarefas.json();
        const tarefas: Tarefa[] = Array.isArray(tarefasJson)
          ? tarefasJson
          : tarefasJson.data || [];

        const usuariosRaw: UsuarioComNivel[] = await resUsuarios.json();

        const progresso =
          tarefas.length === 0
            ? 0
            : Math.round(
                (tarefas.reduce((acc, tarefa) => {
                  if (tarefa.status_id === 3) return acc + 1; // concluído = 100%
                  if (tarefa.status_id === 2) return acc + 0.5; // em andamento = 50%
                  return acc; // planejado = 0%
                }, 0) /
                  tarefas.length) *
                  100
              );

        console.log({
          projeto: projeto.nome,
          tarefasTotal: tarefas.length,
          concluidas: tarefas.filter((t) => t.status_id === 3).length,
          progresso,
        });

        const usuariosOrdenados = usuariosRaw
          .filter((u) => u.nivel_acesso_id === 2 || u.nivel_acesso_id === 3)
          .map((u) => ({
            id: u.usuario.id,
            primeiro_nome: u.usuario.primeiro_nome,
            sobrenome: u.usuario.sobrenome,
            avatar_url: u.usuario.avatar_url || "/usuario-dark-icon.png",
            nivel_acesso_id: u.nivel_acesso_id,
          }))
          .sort(
            (a: UsuarioProjeto, b: UsuarioProjeto) =>
              a.nivel_acesso_id - b.nivel_acesso_id
          );

        return {
          ...projeto,
          progresso,
          usuariosOrdenados,
        };
      })
    );

    return projetosComTarefasEUsuarios;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    console.error(message);
    return { error: message };
  }
}

export default async function ProjetosPage() {
  const token = (await cookies()).get("token")?.value;
  const projetosOuErro = await fetchProjetosComProgresso(token);

  return (
    <div className="p-4 min-h-screen bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Projetos</h1>

      {"error" in projetosOuErro ? (
        <p className="text-red-500 text-sm">Erro: {projetosOuErro.error}</p>
      ) : (
        <ProjetosClientUI projetosIniciais={projetosOuErro} />
      )}
    </div>
  );
}
