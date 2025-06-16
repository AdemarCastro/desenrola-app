"use client";
import { useState } from "react";
import UserModal from "@/components/UserModal";
import { Usuario } from "@/types/Usuario";

interface UserTableProps {
  usuarios: Usuario[];
}

export default function UserTable({ usuarios }: UserTableProps) {
  // Estado local para refletir atualizações sem recarregar a página
  const [userList, setUserList] = useState<Usuario[]>(usuarios);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Formata data ISO ou DD/MM/YYYY para locale pt-BR
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  };
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-100 text-black">
            <tr>
              <th className="p-3 text-left font-semibold">Nome</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Data de Nascimento</th>
              <th className="p-3 text-left font-semibold">Projeto</th>
              <th className="p-3 text-left font-semibold">Tarefas</th>
              <th className="p-3 text-left font-semibold">Cargo</th>
              <th className="p-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((usuario, index) => (
              <tr
                key={usuario.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-blue-50"
                } cursor-pointer hover:bg-blue-100`}
                onClick={() => setSelectedUser(usuario)}
              >
                <td className="p-3 text-black">
                  {usuario.primeiro_nome} {usuario.sobrenome}
                </td>
                <td className="p-3 text-black/90">{usuario.email}</td>
                <td className="p-3 text-black/80">
                  {formatDate(usuario.data_nascimento)}
                </td>
                <td className="p-3 text-black/80">{usuario.projeto ?? "-"}</td>
                <td className="p-3 text-black/80">{usuario.tarefas ?? 0}</td>
                <td className="p-3 text-black/80">{usuario.cargo ?? "-"}</td>
                <td className="p-3">
                  <span
                    className={`${
                      usuario.status_id === 1 ? "bg-green-600" : "bg-red-600"
                    } text-white px-3 py-1 rounded shadow`}
                  >
                    {usuario.status_id === 1 ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal de visualização/edição */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={(updated) => {
            setUserList((list) =>
              list.map((u) => (u.id === updated.id ? updated : u))
            );
            setSelectedUser(updated);
          }}
        />
      )}
    </>
  );
}
