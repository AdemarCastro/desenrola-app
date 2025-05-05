import { Usuario } from '../types/usuario';

async function fetchUsuarios(): Promise<Usuario[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${base}/usuarios`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Falha ao buscar usuários');
  }
  const data: Usuario[] = await res.json();
  return data;
}

export default async function Page() {
  const usuarios = await fetchUsuarios();
  return (
    <ul>
      {usuarios.map((u) => (
        <li key={u.id}>
          <strong>{u.primeiro_nome} {u.sobrenome}</strong>
        </li>
      ))}
    </ul>
  );
}