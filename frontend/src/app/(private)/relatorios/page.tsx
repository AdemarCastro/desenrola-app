import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RelatoriosPDFExport } from "@/components/RelatoriosPDFExport";
import { ProjectChartFilter } from "@/components/ProjectChartFilter";
import { Projeto } from "@/types/projeto";
import { Tarefa } from "@/types/tarefa";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || ""
).replace(/^"|"$/g, "") || "http://backend:4000/api";

async function fetchProjetos(token: string): Promise<Projeto[]> {
  const res = await fetch(`${API_BASE}/projetos`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error("Falha ao buscar projetos");
  const body = await res.json();
  return body.data || [];
}

async function fetchTarefas(token: string): Promise<Tarefa[]> {
  const res = await fetch(`${API_BASE}/tarefas`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error("Falha ao buscar tarefas");
  const body = await res.json();
  // o backend retorna array direto ou { data: [...] }
  return (body.data ?? body) as Tarefa[];
}

export default async function RelatoriosPage() {
  // 1) Aguardar cookies() para termos cookieStore.get()
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  // 2) Buscar dados em paralelo
  let projetos: Projeto[];
  let tarefas: Tarefa[];
  try {
    [projetos, tarefas] = await Promise.all([
      fetchProjetos(token),
      fetchTarefas(token),
    ]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro inesperado";
    return (
      <div className="p-8 text-center text-red-600">
        <p>Erro ao carregar relatórios: {msg}</p>
      </div>
    );
  }

  // 3) Helpers de status
  const getProjectStatus = (id: number) => {
    const ts = tarefas.filter((t) => t.id_projeto === id);
    if (!ts.length) return "To Do";
    const done = ts.filter((t) => t.status_id === 3).length;
    if (done === ts.length) return "Completed";
    return done > 0 ? "In progress" : "To Do";
  };
  const getStatusColor = (status: string) =>
    status === "Completed"
      ? "bg-green-100 text-green-800"
      : status === "In progress"
      ? "bg-blue-100 text-blue-800"
      : "bg-yellow-100 text-yellow-800";

  // 4) Estatísticas
  const stats = [
    {
      label: "Projetos em andamento",
      value: projetos.filter((p) => getProjectStatus(p.id) === "In progress")
        .length,
    },
    {
      label: "Projetos não iniciados",
      value: projetos.filter((p) => getProjectStatus(p.id) === "To Do")
        .length,
    },
    {
      label: "Tarefas finalizadas",
      value: tarefas.filter((t) => t.status_id === 3).length,
    },
  ];


  const chartConfig = {
    created: { label: "Criadas", color: "hsl(var(--primary))" },
    completed: { label: "Concluídas", color: "hsl(var(--secondary-foreground))" },
  };

  // 5) Render
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <RelatoriosPDFExport>
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Relatório de desempenho
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
              >
                <p className="text-sm text-gray-500 mb-2">{s.label}</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {projetos.length > 0 && (
            <section className="bg-white rounded-lg border border-gray-200 mb-8 shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Projeto", "Entrega", "Tarefas", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projetos.map((p) => {
                    const ts = tarefas.filter((t) => t.id_projeto === p.id);
                    const status = getProjectStatus(p.id);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {p.nome}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {p.data_entrega
                            ? new Date(p.data_entrega).toLocaleDateString("pt-BR")
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {/* total de tarefas associadas ao projeto */}
                          {ts.length}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}

          {/* === Gráfico de Tarefas Criadas vs. Concluídas por Mês === */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tarefas Criadas vs. Concluídas por Mês
            </h2>
            <ProjectChartFilter
              projetos={projetos}
              tarefas={tarefas}
              config={chartConfig}
            />
          </div>
          {/* ================================================ */}
        </RelatoriosPDFExport>
      </div>
    </div>
  );
}