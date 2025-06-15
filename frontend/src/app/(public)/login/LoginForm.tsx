"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErro(errorData.error || "Erro ao fazer login");
        return;
      }

      const callbackUrl = searchParams.get('callbackUrl') || '/projetos';
      router.push(callbackUrl);
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0.05)_1px,_transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      <div className="z-10 max-w-md w-full px-6 py-10 bg-white shadow-xl rounded-xl">
        <div className="text-center mb-8">
          <Image
            src="/desenrola-icon1.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-black">Bem Vindo de Volta!</h1>
          <p className="text-sm text-black">Seus projetos estão te esperando</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-black focus:border-black text-black placeholder-black/50"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black flex justify-between">
              <span>Password</span>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                forgot password
              </a>
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-black focus:border-black text-black placeholder-black/50"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded" />
            <label htmlFor="remember" className="text-sm text-black">
              Remember for 30 days
            </label>
          </div>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-3">
          <button className="w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">
            <Image src="/google.png" alt="Google" width={30} height={30} />
            <span className="text-black">Sign in with Google</span>
          </button>
          <button className="w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">
            <Image src="/apple.png" alt="Apple" width={30} height={30} />
            <span className="text-black">Sign in with Apple</span>
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-black">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
