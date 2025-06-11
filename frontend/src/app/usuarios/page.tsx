"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Usuario } from "@/types/Usuario";

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [modalUsuario, setModalUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
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
  }, [router]);

  const getStatusBadgeColor = (statusId: number) =>
    statusId === 1 ? "bg-green-600" : "bg-red-600";
  const getUserStatus = (statusId: number) =>
    statusId === 1 ? "Ativo" : "Inativo";

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuário</h1>

      {erro ? (
        <p className="text-red-500 text-sm">Erro: {erro}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="bg-white p-6 rounded-xl border shadow hover:shadow-lg transform hover:scale-[1.02] transition cursor-pointer"
              onClick={() => setModalUsuario(usuario)}
            >
              <p
                className={`text-sm text-white px-3 py-1 rounded ${getStatusBadgeColor(
                  usuario.status_id
                )}`}
              >
                {getUserStatus(usuario.status_id)}
              </p>
              <h2 className="font-semibold text-lg text-black mt-2">
                {usuario.primeiro_nome} {usuario.sobrenome}
              </h2>
              <p className="text-sm text-black/80 mt-1 mb-1">{usuario.email}</p>
              <p className="text-sm text-black/80">
                Nascimento:{" "}
                {new Date(usuario.data_nascimento).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      )}

      {modalUsuario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
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
            <p className="text-sm text-black/60 mb-4">{modalUsuario.email}</p>
            <p className="mb-2">
              <strong>Data de Nascimento:</strong>{" "}
              {new Date(modalUsuario.data_nascimento).toLocaleDateString("pt-BR")}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {getUserStatus(modalUsuario.status_id)}
            </p>
            {modalUsuario.projeto && (
              <p className="mb-2">
                <strong>Projeto:</strong> {modalUsuario.projeto}
              </p>
            )}
            {modalUsuario.tarefas !== undefined && (
              <p className="mb-2">
                <strong>Tarefas:</strong> {modalUsuario.tarefas}
              </p>
            )}
            {modalUsuario.cargo && (
              <p className="mb-2">
                <strong>Cargo:</strong> {modalUsuario.cargo}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
