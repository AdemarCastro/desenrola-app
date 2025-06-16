"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErro(errorData.error || "Erro ao fazer login. Verifique suas credenciais.");
        return;
      }

      const callbackUrl = searchParams.get('callbackUrl') || '/projetos';
      router.push(callbackUrl);
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center mb-8">
          <Image
            src="/logo_vertical.png"
            alt="Logo Desenrola"
            width={120}
            height={120}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-black">Bem-vindo de volta!</h1>
          <p className="text-sm text-zinc-600">Seus projetos estão esperando por você.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">
              Endereço de email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-black focus:border-black text-black placeholder:text-zinc-500 bg-white/60 backdrop-blur-sm"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-black">
                Senha
              </label>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-black focus:border-black text-black placeholder:text-zinc-500 bg-white/60 backdrop-blur-sm"
              placeholder="Sua senha"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded border-gray-300 text-black focus:ring-black" />
            <label htmlFor="remember" className="text-sm text-black">
              Lembrar por 30 dias
            </label>
          </div>

          {erro && <p className="text-red-500 text-sm font-medium text-center">{erro}</p>}
          
          <Button type="submit" size="lg" className="w-full font-semibold">
            Entrar
          </Button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500">Ou continue com</span>
            </div>
        </div>

        <div className="space-y-3">
          <Button variant="white" className="w-full">
            <Image src="/google.png" alt="Google" width={20} height={20} className="mr-2"/>
            Entrar com Google
          </Button>
          <Button variant="white" className="w-full">
            <Image src="/apple.png" alt="Apple" width={20} height={20} className="mr-2"/>
            Entrar com Apple
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Não tem uma conta?{" "}
          <Link href="/inscreva-se" className="font-semibold text-blue-600 hover:underline">
            Inscreva-se
          </Link>
        </p>
      </div>
    </div>
  );
}
