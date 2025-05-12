import { User } from '../types/user';
import { Projeto } from '../types/projeto';
import { Tarefa } from '../types/tarefa';

async function fetchResource<T>(endpoint: string): Promise<T[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('API URL is not defined');
  const res = await fetch(`${base}/${endpoint}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Falha ao buscar ${endpoint}`);
  return res.json();
}

export default async function Page() {
  const [users, projetos, tarefas] = await Promise.all([
    fetchResource<User>('usuarios'),
    fetchResource<Projeto>('projetos'),
    fetchResource<Tarefa>('tarefas'),
  ]);

  return (
    <main className="p-8 space-y-8">
      <section>
        <h1 className="text-2xl mb-4">Usuários</h1>
        <ul className="space-y-4">
          {users.map(u => (
            <li key={u.id} className="border p-4 rounded">
              <p><strong>{u.name}</strong> ({u.email})</p>
              <p>Criado em: {new Date(u.createdAt).toLocaleString()}</p>
              <p>Atualizado em: {new Date(u.updatedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h1 className="text-2xl mb-4">Projetos</h1>
        <ul className="space-y-4">
          {projetos.map(p => (
            <li key={p.id} className="border p-4 rounded">
              <p><strong>{p.nome}</strong></p>
              <p>{p.descricao}</p>
              <p>Criado em: {new Date(p.criado_em).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h1 className="text-2xl mb-4">Tarefas</h1>
        <ul className="space-y-4">
          {tarefas.map(t => (
            <li key={t.id} className="border p-4 rounded">
              <p>{t.descricao}</p>
              <p>Status: {t.status_id} | Prioridade: {t.prioridade_id}</p>
              <p>Criado em: {new Date(t.criado_em).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}