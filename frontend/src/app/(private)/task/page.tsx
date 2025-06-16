"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { User, Calendar, FolderOpen, Flag } from "lucide-react"

export default function CriarTarefaPage() {
  const [taskName, setTaskName] = useState("")
  const [description, setDescription] = useState(
    "",
  )
  const [assignee, setAssignee] = useState("")
  const [priority, setPriority] = useState("")
  const [project, setProject] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [labels] = useState([
  { id: 1, text: "tag", color: "bg-red-500" },
  { id: 2, text: "tag", color: "bg-blue-500" },
  { id: 3, text: "tag", color: "bg-red-400" },
  { id: 4, text: "tag", color: "bg-green-500" },
  { id: 5, text: "tag", color: "bg-purple-500" },
])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Task created:", {
      taskName,
      description,
      assignee,
      priority,
      project,
      dueDate,
      labels,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Criar Tarefa</h1>

            <div className="task-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Task Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da tarefa</label>
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="form-field"
                    placeholder="Digite o nome da tarefa"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="form-field resize-none"
                    placeholder="Descreva a tarefa"
                  />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Assign Task */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Atribuir task para
                    </label>
                    <select
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="form-field text-gray-500"
                    >
                      <option value="">Selecionar pessoa</option>
                      <option value="ana">Ana Silva</option>
                      <option value="joao">João Santos</option>
                      <option value="maria">Maria Costa</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      Definir prioridade
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="form-field text-gray-500"
                    >
                      <option value="">Selecionar prioridade</option>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>

                  {/* Link Project */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Vincular projeto
                    </label>
                    <select
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="form-field text-gray-500"
                    >
                      <option value="">Selecionar projeto</option>
                      <option value="website">Website Redesign</option>
                      <option value="mobile">Mobile App</option>
                      <option value="api">API Development</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Data de vencimento
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="form-field text-gray-500"
                    />
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Adicionar labels</label>
                  <div className="flex gap-2 flex-wrap">
                    {labels.map((label) => (
                      <span key={label.id} className={`label-tag ${label.color}`}>
                        {label.text}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
               <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Criar
                </button>
              </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
