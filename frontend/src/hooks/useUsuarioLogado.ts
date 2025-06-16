import { useEffect, useState } from "react";

interface Usuario {
  id: number;
  primeiro_nome: string;
  sobrenome: string;
  email: string;
  avatar_url?: string;
}

export function useUsuarioLogado() {
  const [usuario, setUsuario] = useState<Usuario | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        setUsuario(data);
      })
      .catch((error) => {
        console.error("Falha ao buscar dados do usuário:", error);
        setUsuario(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { usuario, loading };
}