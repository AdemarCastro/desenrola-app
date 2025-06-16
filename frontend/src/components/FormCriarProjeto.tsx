"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon } from 'lucide-react'; //
import { Button } from "@/components/ui/button"; //
import { Calendar } from "@/components/ui/calendar"; //
import { cn } from "@/lib/utils"; //

interface Props {
  action: (formData: FormData) => Promise<void>;
}

const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return "Selecione uma data (Opcional)"; // Texto customizado para projetos
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(date); //
};

const formatDateForApi = (date: Date): string => {
  const year = date.getUTCFullYear(); //
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); //
  const day = date.getUTCDate().toString().padStart(2, '0'); //
  return `${year}-${month}-${day}`; //
};

export function FormCriarProjeto({ action }: Props) {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [dataEntrega, setDataEntrega] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); //
  const calendarRef = useRef<HTMLDivElement>(null); //
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Efeito para fechar o calendário ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false); //
      }
    }
    document.addEventListener("mousedown", handleClickOutside); //
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); //
    };
  }, [calendarRef]); //

  const handleDateSelect = (date: Date) => {
    setDataEntrega(date);
    setIsCalendarOpen(false); //
  };

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(false);

    // Adiciona a data de entrega formatada ao FormData
    if (dataEntrega) {
      formData.append("dataEntrega", formatDateForApi(dataEntrega));
    }

    try {
      await action(formData);
      setSuccess(true);
      formRef.current?.reset(); // Limpa o formulário após o sucesso
      setDataEntrega(null); // Limpa a data selecionada
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro desconhecido ao criar projeto.";
      setError(message);
    }
  };

  useEffect(() => {
    // Verifica se há um parâmetro de sucesso na URL
    if (searchParams.get('sucesso') === 'projetoCriado') {
      setSuccess(true);
      // Limpa o parâmetro de sucesso da URL após exibição
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('sucesso');
      window.history.replaceState({}, document.title, newUrl.toString());
    }
  }, [searchParams]);

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          ✅ Projeto criado com sucesso!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          ❌ {error}
        </div>
      )}

      {/* Nome do Projeto */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do projeto
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          placeholder="Nome do seu projeto"
          required
          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-black focus:border-black text-black bg-white/60 backdrop-blur-sm"
        />
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          placeholder="Descreva brevemente o projeto"
          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-black focus:border-black text-black bg-white/60 backdrop-blur-sm"
        ></textarea>
      </div>

      {/* Data de Vencimento */}
      <div className="relative" ref={calendarRef}>
        <label htmlFor="data_entrega_button" className="block text-sm font-medium text-gray-700 mb-1">
          Data de Vencimento (Opcional)
        </label>
        <button
          id="data_entrega_button"
          type="button"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={cn(
            "block w-full text-left rounded-md border p-2 shadow-sm",
            "bg-white/60 backdrop-blur-sm",
            "focus:ring-black focus:border-black",
            dataEntrega ? "text-black" : "text-zinc-500"
          )}
        >
          <div className="flex justify-between items-center">
            <span>{formatDateForDisplay(dataEntrega)}</span>
            <CalendarIcon className="h-4 w-4 text-zinc-500" />
          </div>
        </button>
        {isCalendarOpen && (
          <div className="absolute top-full mt-2 z-10 w-full">
            <Calendar onSelectDate={handleDateSelect} initialDate={dataEntrega || new Date()} />
          </div>
        )}
      </div>

      {/* Botão Criar */}
      <Button type="submit" size="lg" className="w-full font-semibold">
        Criar Projeto
      </Button>
    </form>
  );
}