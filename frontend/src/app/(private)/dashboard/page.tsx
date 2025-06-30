import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/components/DashboardClient';
import type { Projeto } from '@/types/projeto';

async function getProjetos(token: string): Promise<Projeto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (res.status === 401) {
    redirect('/login');
  }
  if (!res.ok) {
    console.error("Falha ao buscar projetos para o dashboard");
    return [];
  }
  const body = await res.json();
  return body.data || [];
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    redirect('/login');
  }

  const projetos = await getProjetos(token);

  const projectIdParam = searchParams?.projectId;
  
  const selectedProjectId = projectIdParam && typeof projectIdParam === 'string'
    ? parseInt(projectIdParam, 10) 
    : projetos[0]?.id || null;

  return (
    <div className="p-6 md:p-8 h-full">
      <DashboardClient projetos={projetos} initialProjectId={selectedProjectId} />
    </div>
  );
}