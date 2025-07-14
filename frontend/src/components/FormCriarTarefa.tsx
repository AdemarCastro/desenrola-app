"use client";

import { useForm } from "react-hook-form";
import { useTransition, useState, useEffect } from "react";
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
} from "@/components/ui/form"; // Corrigido
import { Input } from "@/components/ui/input"; // Corrigido
import { Textarea } from "@/components/ui/textarea"; // Corrigido
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Corrigido
import { Button } from "@/components/ui/button"; // Corrigido
import { Card, CardContent } from "@/components/ui/card"; // Corrigido
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Corrigido
import { Calendar } from "@/components/ui/calendar"; // Corrigido
import { Loader2, AlertCircle } from "lucide-react";

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
    case "1": return "🔵";
    case "2": return "🔴";
    case "3": return "⚪";
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
  statuses = [],
  action
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [projectUsers, setProjectUsers] = useState<{ id: string; nome: string }[]>([]);
  const [tagOptions, setTagOptions] = useState<{ id: string; nome: string }[]>([]);

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
    mode: "onChange",
  });
  
  const projetoId = form.watch("projetoId");

  useEffect(() => {
    fetch("/api/tags", { cache: "no-store" })
      .then(res => res.json())
      .then(json => setTagOptions(json.data ?? json))
      .catch(() => setTagOptions([]));
  }, []);

  useEffect(() => {
    if (!projetoId) {
      setProjectUsers([]);
      return;
    }
    fetch(`/api/projetos/${projetoId}/usuarios`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Falha ao buscar usuários");
        return res.json();
      })
      .then((list: { id: string; nome: string }[]) => {
        setProjectUsers(list);
      })
      .catch(() => {
        setProjectUsers([]);
      });
  }, [projetoId]);

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
        form.reset();
      } catch (err) {
        if (err instanceof Error && err.message === "NEXT_REDIRECT") return;
        setError(err instanceof Error ? err.message : "Erro inesperado ao criar tarefa");
      }
    });
  };

  return (
    <Card className="shadow-none rounded-md border">
      <CardContent className="pt-6">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Projeto */}
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
                      <SelectContent>
                        {projetos.map(proj => (
                          <SelectItem key={proj.id} value={proj.id.toString()}>
                            {proj.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prioridade */}
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
                      <SelectContent>
                        {prioridades.map((prioridade) => (
                          <SelectItem
                            key={prioridade.id}
                            value={prioridade.id}
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

            {/* Título */}
            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descrição */}
            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[100px]"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Responsáveis */}
            <FormField
              control={form.control}
              name="responsavelIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsáveis</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                      multiple
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione responsáveis" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                      multiple
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione tags" />
                      </SelectTrigger>
                      <SelectContent>
                        {tagOptions.map(tag => (
                          <SelectItem key={tag.id} value={tag.id}>
                            {tag.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <div className="sm:col-span-2">
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
                          <SelectValue placeholder="Selecione status" />
                        </SelectTrigger>
                        <SelectContent>
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
            </div>

            {/* Datas */}
            <FormField
              control={form.control}
              name="dataInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Início *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value.toISOString().split('T')[0]}
                      onChange={e => field.onChange(new Date(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dataFim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Fim *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value.toISOString().split('T')[0]}
                      onChange={e => field.onChange(new Date(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botão */}
            <div className="sm:col-span-2 flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                size="lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando…
                  </>
                ) : (
                  "Criar Tarefa"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}