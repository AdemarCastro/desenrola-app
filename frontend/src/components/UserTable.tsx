import { Usuario } from "@/types/Usuario";

interface UserTableProps {
  usuarios: Usuario[];
}

export default function UserTable({ usuarios }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Data de Nascimento</th>
            <th className="p-3 text-left">Projeto</th>
            <th className="p-3 text-left">Tarefas</th>
            <th className="p-3 text-left">Cargo</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr
              key={usuario.id}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="p-3">
                {usuario.primeiro_nome} {usuario.sobrenome}
              </td>
              <td className="p-3">{usuario.email}</td>
              <td className="p-3">
                {new Date(usuario.data_nascimento).toLocaleDateString("pt-BR")}
              </td>
              <td className="p-3">{usuario.projeto ?? "-"}</td>
              <td className="p-3">{usuario.tarefas ?? 0}</td>
              <td className="p-3">{usuario.cargo ?? "-"}</td>
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
  );
}
