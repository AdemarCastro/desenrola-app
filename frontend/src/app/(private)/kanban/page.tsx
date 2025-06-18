'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import { Projeto } from '@/types/projeto'

export default function KanbanPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const projetoIdParam = searchParams.get('projetoId')
  const selectedProjectId = projetoIdParam ? Number(projetoIdParam) : undefined

  const [projects, setProjects] = useState<Projeto[]>([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((body) => setProjects(body.data ?? body))
      .catch(() => {})
  }, [])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    router.push(id ? `/kanban?projetoId=${id}` : '/kanban')
  }

  return (
    <main className="p-6 bg-supportwhite-grey h-full">
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="projectFilter" className="font-medium">Projeto:</label>
        <select
          id="projectFilter"
          value={selectedProjectId ?? ''}
          onChange={handleFilterChange}
          className="border rounded px-2 py-1"
        >
          <option value="">Selecione um projeto</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>
      <KanbanBoard projetoId={selectedProjectId} projects={projects} />
    </main>
  )
}