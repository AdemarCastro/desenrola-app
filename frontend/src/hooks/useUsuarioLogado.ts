import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: number;
  email: string;
  nivelAcessoId: number;
  iat?: number;
  exp?: number;
}

interface Usuario {
  id: number;
  primeiro_nome: string;
  sobrenome: string;
  email: string;
  avatar_url?: string;
}

export function useUsuarioLogado() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = jwtDecode<JwtPayload>(token);

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${payload.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUsuario(data))
        .catch(() => setUsuario(null));
    } catch {
      setUsuario(null);
    }
  }, []);

  return usuario;
}
