"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from 'lucide-react';

const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return "Selecione uma data";
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
};

// Função para formatar a data para a API (YYYY-MM-DD)
const formatDateForApi = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function SignUpForm() {
  const router = useRouter();
  const [primeiro_nome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [data_nascimento, setDataNascimento] = useState<Date | null>(null);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Efeito para fechar o calendário ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (!data_nascimento) {
      setErro("Por favor, selecione sua data de nascimento.");
      return;
    }

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          primeiro_nome, 
          sobrenome, 
          email, 
          senha, 
          data_nascimento: formatDateForApi(data_nascimento) 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErro(errorData.error || "Erro ao criar a conta.");
        return;
      }
      router.push('/login?signup=success');
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    }
  }
  
  const handleDateSelect = (date: Date) => {
    setDataNascimento(date);
    setIsCalendarOpen(false);
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5 transform -translate-y-8">
        <div className="text-center">
          <Image src="/logos/logo_vertical.png" alt="Logo Desenrola" width={120} height={120} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-black">Crie sua conta</h1>
          <p className="text-sm text-zinc-600">Comece a organizar seus projetos hoje mesmo.</p>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="sr-only">Nome</label>
              <input type="text" value={primeiro_nome} onChange={(e) => setPrimeiroNome(e.target.value)} className="block w-full rounded-md border border-gray-300 p-2 shadow-sm bg-white/60 placeholder:text-zinc-500" placeholder="Nome" required />
            </div>
            <div className="w-1/2">
              <label className="sr-only">Sobrenome</label>
              <input type="text" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} className="block w-full rounded-md border border-gray-300 p-2 shadow-sm bg-white/60 placeholder:text-zinc-500" placeholder="Sobrenome" required />
            </div>
          </div>
          <div>
            <label className="sr-only">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border border-gray-300 p-2 shadow-sm bg-white/60 placeholder:text-zinc-500" placeholder="Email" required />
          </div>
          <div className="relative" ref={calendarRef}>
            <label htmlFor="data_nascimento_button" className="block text-sm font-medium text-zinc-700 mb-1">Data de Nascimento</label>
            <button
              id="data_nascimento_button"
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="block w-full text-left rounded-md border border-gray-300 p-2 shadow-sm bg-white/60"
            >
              <div className="flex justify-between items-center text-zinc-700">
                <span>{formatDateForDisplay(data_nascimento)}</span>
                <CalendarIcon className="h-4 w-4 text-zinc-500" />
              </div>
            </button>
            {isCalendarOpen && (
              <div className="absolute top-full mt-2 z-10 w-full">
                <Calendar onSelectDate={handleDateSelect} initialDate={data_nascimento || new Date()} />
              </div>
            )}
          </div>
          <div>
            <label className="sr-only">Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="block w-full rounded-md border border-gray-300 p-2 shadow-sm bg-white/60 placeholder:text-zinc-500" placeholder="Crie uma senha" required />
          </div>
          <div>
            <label className="sr-only">Confirmar Senha</label>
            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="block w-full rounded-md border border-gray-300 p-2 shadow-sm bg-white/60 placeholder:text-zinc-500" placeholder="Confirme sua senha" required />
          </div>

          {erro && <p className="text-red-500 text-sm font-medium text-center">{erro}</p>}
          
          <Button type="submit" size="lg" className="w-full font-semibold">
            Criar conta
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-600">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
