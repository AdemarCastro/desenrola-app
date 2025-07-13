"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";

import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const schema = z.object({
  nome: z.string().min(1, "Nome do projeto é obrigatório"),
  descricao: z.string().optional(),
  data_entrega: z
    .date()
    .refine((d) => !!d, { message: "A data é obrigatória" }),
  proprietario_id: z.string().min(1, "Selecione um proprietário"),
  membros_ids: z.array(z.string()).min(1, "Selecione pelo menos um membro"),
});

type FormSchema = z.infer<typeof schema>;

interface Usuario {
  id: number;
  primeiro_nome: string;
  sobrenome: string;
}

interface Props {
  action: (formData: FormData) => void;
  proprietarios: Usuario[];
  membros: Usuario[];
}

export function FormCriarProjeto({ action, proprietarios, membros }: Props) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      descricao: "",
      data_entrega: undefined,
      proprietario_id: "",
      membros_ids: [],
    },
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [membroOpen, setMembroOpen] = useState(false);
  const [proprietarioOpen, setProprietarioOpen] = useState(false);

  const selectedMembros = form.watch("membros_ids");

  const onSubmit = (data: FormSchema) => {
    const formData = new FormData();
    formData.append("nome", data.nome);
    if (data.descricao) formData.append("descricao", data.descricao);
    formData.append(
      "data_entrega",
      data.data_entrega.toISOString().split("T")[0]
    );
    formData.append("proprietario_id", data.proprietario_id);
    data.membros_ids.forEach((id) => formData.append("membros_ids", id));
    action(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Projeto</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Novo Sistema" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes do projeto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data de Entrega */}
        <FormField
          control={form.control}
          name="data_entrega"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Entrega</FormLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        : "Selecionar data"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    onSelectDate={(date: Date) => {
                      field.onChange(date);
                      setCalendarOpen(false);
                    }}
                    initialDate={field.value}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Proprietário */}
        <FormField
          control={form.control}
          name="proprietario_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proprietário do Projeto</FormLabel>
              <Popover
                open={proprietarioOpen}
                onOpenChange={setProprietarioOpen}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {field.value
                        ? `${
                            proprietarios.find(
                              (p) => String(p.id) === field.value
                            )?.primeiro_nome || ""
                          } ${
                            proprietarios.find(
                              (p) => String(p.id) === field.value
                            )?.sobrenome || ""
                          }`
                        : "Selecionar proprietário"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 bg-white z-50">
                  <Command>
                    <CommandInput placeholder="Buscar proprietário..." />
                    <CommandGroup>
                      {proprietarios.map((p) => {
                        const idStr = String(p.id);
                        return (
                          <CommandItem
                            key={idStr}
                            onSelect={() => {
                              field.onChange(idStr);
                              setProprietarioOpen(false);
                            }}
                            className={cn(
                              "cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors rounded-md px-2 py-1",
                              field.value === idStr &&
                                "bg-gray-100 dark:bg-zinc-800"
                            )}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === idStr
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {p.primeiro_nome} {p.sobrenome}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Membros do Projeto */}
        <FormField
          control={form.control}
          name="membros_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membros do Projeto</FormLabel>
              <Popover open={membroOpen} onOpenChange={setMembroOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedMembros.length > 0
                        ? `${selectedMembros.length} selecionado(s)`
                        : "Selecionar membros"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="z-50 w-[300px] p-0 bg-white border shadow-md">
                  <Command>
                    <CommandInput placeholder="Buscar membro..." />
                    <CommandGroup>
                      {membros.map((m) => (
                        <CommandItem
                          key={m.id}
                          onSelect={() => {
                            const id = String(m.id);
                            const newList = selectedMembros.includes(id)
                              ? selectedMembros.filter((v) => v !== id)
                              : [...selectedMembros, id];
                            form.setValue("membros_ids", newList);
                          }}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors rounded-md px-2 py-1"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedMembros.includes(String(m.id))
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {m.primeiro_nome} {m.sobrenome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Criar Projeto
        </Button>
      </form>
    </Form>
  );
}
