"use client";

import { useEffect, useState } from "react";
import { Usuario } from "@/types/Usuario";
import UserTable from "../../components/UserTable";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`);
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        setUsuarios(data);
      } catch (e: unknown) {
        setErro(e instanceof Error ? e.message : "Erro desconhecido");
      }
    }

    fetchUsuarios();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuário</h1>
      {erro ? (
        <p className="text-red-500">Erro: {erro}</p>
      ) : (
        <UserTable usuarios={usuarios} />
      )}
    </>
  );
}