'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import { Projeto } from '@/types/projeto'

export default function KanbanBoardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const projetoIdParam = searchParams.get('projetoId')
  const selectedProjectId = projetoIdParam ? Number(projetoIdParam) : undefined

  const [projects, setProjects] = useState<Projeto[]>([])

  // carrega lista de projetos para o filtro
  useEffect(() => {
    async function loadProjects() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos`, {
        cache: 'no-store'
      })
      if (!res.ok) return
      const body = await res.json()
      setProjects(body.data ?? body)
    }
    loadProjects()
  }, [])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    if (id) {
      router.push(`/kanbanboard?projetoId=${id}`)
    } else {
      router.push('/kanbanboard')
    }
  }

  return (
    <>
      <Header />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 bg-supportwhite-grey p-6 overflow-auto">
          <div className="mb-4 flex items-center gap-3">
            <label htmlFor="projectFilter" className="font-medium text-fgdefault">
              Projeto:
            </label>
            <select
              id="projectFilter"
              value={selectedProjectId ?? ''}
              onChange={handleFilterChange}
              className="border border-supportlight-grey rounded px-2 py-1 bg-bgdefault"
            >
              <option value="">Selecione um projeto</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
          <KanbanBoard projetoId={selectedProjectId} />
        </main>
      </div>
    </>
  )
}