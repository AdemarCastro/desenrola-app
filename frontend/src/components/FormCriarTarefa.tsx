"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import type { Projeto } from "@/types/projeto";
import { 
  type CriarTarefaFormData,
  type Prioridade 
} from "@/schemas/tarefa.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, AlertCircle, CalendarIcon, Users, Tags } from "lucide-react";

interface Props {
  projetos: Projeto[];
  usuarios?: { id: number; nome: string }[];
  tags?: { id: number; nome: string }[];
  statuses?: { id: string; label: string }[];
  action: (formData: FormData) => Promise<void>;
}

const prioridades: Prioridade[] = [
  { id: "1", nome: "Média", cor: "text-blue-600" },
  { id: "2", nome: "Alta", cor: "text-red-600" },
  { id: "3", nome: "Baixa", cor: "text-gray-600" },
];

const getPrioridadeIcon = (prioridadeId: string) => {
  switch (prioridadeId) {
    case "1": return "🔵"; // Normal
    case "2": return "🔴"; // Alta
    case "3": return "⚪"; // Baixa
    default: return "";
  }
};

type ExtendedFormData = CriarTarefaFormData & {
  responsavelIds: string[];
  tagIds: string[];
  statusId: string;
  dataInicio: Date;
  dataFim: Date;
};

export function FormCriarTarefa({ 
  projetos, 
  usuarios = [], 
  tags = [], 
  statuses = [], 
  action 
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ExtendedFormData>({
    defaultValues: {
      titulo: "",
      descricao: "",
      projetoId: "",
      prioridadeId: "",
      responsavelIds: [],
      tagIds: [],
      statusId: "",
      dataInicio: new Date(),
      dataFim: new Date(),
    },
    mode: "onChange", // Validação em tempo real
  });

  const onSubmit = async (data: ExtendedFormData) => {
    setError(null);
    
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("titulo", data.titulo);
        formData.append("descricao", data.descricao || "");
        formData.append("projetoId", data.projetoId);
        formData.append("prioridadeId", data.prioridadeId);
        formData.append("responsavelIds", JSON.stringify(data.responsavelIds));
        formData.append("tagIds", JSON.stringify(data.tagIds));
        formData.append("statusId", data.statusId);
        formData.append("dataInicio", data.dataInicio.toISOString());
        formData.append("dataFim", data.dataFim.toISOString());
        
        await action(formData);
        
        // Reset do formulário após sucesso
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado ao criar tarefa");
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Criar Nova Tarefa</CardTitle>
        <p className="text-sm text-muted-foreground">
          Preencha as informações abaixo para criar uma nova tarefa no projeto.
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Erro ao criar tarefa</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="projetoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projeto *</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um projeto" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50 max-h-[200px] overflow-y-auto">
                        {projetos.map((projeto) => (
                          <SelectItem 
                            key={projeto.id} 
                            value={projeto.id.toString()}
                            className="
                              cursor-pointer
                              data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900
                              data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
                              focus:bg-gray-100 focus:text-gray-900
                            "
                          >
                            {projeto.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending}/>
                  </FormControl>
                  <FormMessage />  {/* aqui mostra “Título é obrigatório” */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes da tarefa (opcional)"
                      className="min-h-[100px] resize-none"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prioridadeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade *</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50 max-h-[200px] overflow-y-auto">
                        {prioridades.map((prioridade) => (
                          <SelectItem 
                            key={prioridade.id} 
                            value={prioridade.id}
                            className="
                              cursor-pointer
                              data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900
                              data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
                              focus:bg-gray-100 focus:text-gray-900
                            "
                          >
                            <div className="flex items-center gap-2">
                              <span>{getPrioridadeIcon(prioridade.id)}</span>
                              <span className={prioridade.cor}>{prioridade.nome}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Responsáveis */}
            <FormField
              control={form.control}
              name="responsavelIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Responsáveis
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start" disabled={isPending}>
                          {field.value.length
                            ? usuarios
                                .filter(u => field.value.includes(u.id.toString()))
                                .map(u => u.nome)
                                .join(", ")
                            : "Selecione responsáveis"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar usuário..." />
                          <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                          <CommandGroup>
                            {usuarios.map(user => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => {
                                  const exists = field.value.includes(user.id.toString());
                                  field.onChange(
                                    exists
                                      ? field.value.filter(id => id !== user.id.toString())
                                      : [...field.value, user.id.toString()]
                                  );
                                }}
                              >
                                {user.nome}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <Tags className="h-4 w-4" />
                      Tags
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start" disabled={isPending}>
                          {field.value.length
                            ? tags
                                .filter(t => field.value.includes(t.id.toString()))
                                .map(t => t.nome)
                                .join(", ")
                            : "Selecione tags"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar tag..." />
                          <CommandEmpty>Nenhuma tag encontrada.</CommandEmpty>
                          <CommandGroup>
                            {tags.map(tag => (
                              <CommandItem
                                key={tag.id}
                                onSelect={() => {
                                  const exists = field.value.includes(tag.id.toString());
                                  field.onChange(
                                    exists
                                      ? field.value.filter(id => id !== tag.id.toString())
                                      : [...field.value, tag.id.toString()]
                                  );
                                }}
                              >
                                {tag.nome}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Inicial */}
            <FormField
              control={form.control}
              name="statusId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Inicial *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                        {statuses.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data Início */}
            <FormField
              control={form.control}
              name="dataInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Data Início *
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start" disabled={isPending}>
                          {field.value ? field.value.toLocaleDateString("pt-BR") : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          onSelectDate={field.onChange}
                          initialDate={field.value}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data Fim */}
            <FormField
              control={form.control}
              name="dataFim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Data Fim *
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start" disabled={isPending}>
                          {field.value ? field.value.toLocaleDateString("pt-BR") : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          onSelectDate={field.onChange}
                          initialDate={field.value}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isPending}
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando tarefa...
                </>
              ) : (
                "Criar Tarefa"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
