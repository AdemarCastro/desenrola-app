import { User } from '../types/user';

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('http://localhost:4000/api/users', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao buscar usuários');
  return res.json();
}

export default async function Page() {
  const users = await fetchUsers();
  return (
    <main className="p-8">
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
    </main>
  );
}