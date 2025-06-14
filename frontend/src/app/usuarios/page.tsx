"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Usuario } from "@/types/Usuario";
import UserTable from "../../components/UserTable";

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [modalUsuario, setModalUsuario] = useState<Usuario | null>(null); // estado para modal de usuário
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Usuario | null>(null);

  useEffect(() => {
    if (modalUsuario) {
      setIsEditing(false);
      setEditData(modalUsuario);
    }
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchUsuarios() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        setUsuarios(data);
      } catch (e: unknown) {
        setErro(e instanceof Error ? e.message : "Erro desconhecido");
      }
    }

    fetchUsuarios();
  }, [router, modalUsuario]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${editData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Erro ao editar usuário");
      const updated = await res.json();
      setUsuarios(prev => prev.map(u => u.id === updated.id ? updated : u));
      setModalUsuario(updated);
      setIsEditing(false);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido");
    }
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuário</h1>
      {erro ? (
        <p className="text-red-500 text-sm">Erro: {erro}</p>
      ) : (
        <UserTable usuarios={usuarios} onSelect={setModalUsuario} />
      )}
      {modalUsuario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          {isEditing && editData ? (
            <div className="bg-white rounded-xl border border-gray-300 w-[390px] h-[664px] flex flex-col items-center p-4">
              <h2 className="text-xl font-medium mt-4 mb-3">Editar informações</h2>
              <form onSubmit={handleEditSubmit} className="w-full flex flex-col gap-4 px-2">
                <input
                  name="primeiro_nome"
                  value={editData.primeiro_nome}
                  onChange={handleEditChange}
                  className="bg-white border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Nome completo"
                />
                <input
                  name="sobrenome"
                  value={editData.sobrenome}
                  onChange={handleEditChange}
                  className="bg-white border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Sobrenome"
                />
                <input
                  name="email"
                  type="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="bg-white border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Email"
                />
                <input
                  name="cargo"
                  value={editData.cargo ?? ''}
                  onChange={handleEditChange}
                  className="bg-white border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Função"
                />
                <input
                  name="projeto"
                  value={editData.projeto ?? ''}
                  onChange={handleEditChange}
                  className="bg-white border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Projeto"
                />
                {/* adicione outros campos como status, data de nascimento ou atividade */}
                <button
                  type="submit"
                  className="mt-2 py-3 w-full bg-black text-white rounded hover:bg-gray-800"
                >
                  SALVAR ALTERAÇÕES
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative text-black">
              <button
                className="absolute top-2 right-3 text-black/60 hover:text-black text-xl"
                onClick={() => setModalUsuario(null)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-2">
                {modalUsuario.primeiro_nome} {modalUsuario.sobrenome}
              </h2>
              <p className="text-sm text-black/60 mb-4">
                {modalUsuario.email}
              </p>
              <p className="mb-2">
                <strong>Data de Nascimento:</strong>{' '}
                {new Date(modalUsuario.data_nascimento).toLocaleDateString('pt-BR')}
              </p>
              <p className="mb-2">
                <strong>Projeto:</strong> {modalUsuario.projeto ?? '-'}
              </p>
              <p className="mb-2">
                <strong>Tarefas:</strong> {modalUsuario.tarefas ?? 0}
              </p>
              <p className="mb-2">
                <strong>Cargo:</strong> {modalUsuario.cargo ?? '-'}
              </p>
              <p className="mb-4">
                <strong>Status:</strong>{' '}
                <span className={`px-3 py-1 rounded text-white ${modalUsuario.status_id === 1 ? 'bg-green-600' : 'bg-red-600'}`}>
                  {modalUsuario.status_id === 1 ? 'Ativo' : 'Inativo'}
                </span>
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  onClick={() => setModalUsuario(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
