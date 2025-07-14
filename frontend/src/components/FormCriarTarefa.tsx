"use client";

import { useForm } from "react-hook-form";
import { useTransition, useState, useEffect, useCallback } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, AlertCircle } from "lucide-react";

interface Props {
  projetos: Projeto[];
  usuarios?: { id: number; nome: string }[];
  tags?: { id: number; nome: string }[];
  statuses?: { id: string; label: string }[];
  action: (formData: FormData) => Promise<void>;
}

interface ProjectUser {
  id: string;
  nome: string;
}

interface TagOption {
  id: string;
  nome: string;
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
  statuses = [],
  action
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Estados para dados da API
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

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

  // Função para buscar usuários do projeto
  const fetchProjectUsers = useCallback(async (projectId: string) => {
    if (!projectId) {
      setProjectUsers([]);
      return;
    }

    setLoadingUsers(true);
    try {
      const response = await fetch(`/api/projetos/${projectId}/usuarios`, { 
        cache: "no-store" 
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Garantir que sempre temos um array válido
      let users: ProjectUser[] = [];
      
      if (Array.isArray(data)) {
        users = data.map(user => ({
          id: String(user.id || user.usuario?.id || ''),
          nome: user.nome || user.usuario?.primeiro_nome || user.usuario?.nome || 'Usuário sem nome'
        }));
      } else if (data.data && Array.isArray(data.data)) {
        interface ApiUser {
          id?: string | number;
          nome?: string;
          usuario?: {
            id?: string | number;
            primeiro_nome?: string;
            nome?: string;
          };
        }

        interface ApiResponse {
          data: ApiUser[];
        }

        const apiData: ApiResponse = data;
        users = apiData.data.map((user: ApiUser): ProjectUser => ({
          id: String(user.id || user.usuario?.id || ''),
          nome: user.nome || user.usuario?.primeiro_nome || user.usuario?.nome || 'Usuário sem nome'
        }));
      }
      
      // Filtrar usuários inválidos
      users = users.filter(user => user.id && user.id !== '' && user.nome);
      
      setProjectUsers(users);
      
      // Limpar responsáveis selecionados se não existem mais no projeto
      const currentResponsaveis = form.getValues("responsavelIds");
      const validResponsaveis = currentResponsaveis.filter(id => 
        users.some(user => user.id === id)
      );
      
      if (validResponsaveis.length !== currentResponsaveis.length) {
        form.setValue("responsavelIds", validResponsaveis);
      }
      
    } catch (error) {
      console.error("Erro ao buscar usuários do projeto:", error);
      setProjectUsers([]);
      setError(`Erro ao carregar usuários: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoadingUsers(false);
    }
  }, [form]);

  // Buscar tags (uma vez)
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags", { cache: "no-store" });
        if (!response.ok) return;
        
        const data = await response.json();
        const tags = Array.isArray(data) ? data : (data.data || []);
        
        setTagOptions(tags.map((tag: { id: string | number; nome?: string }) => ({
          id: String(tag.id),
          nome: tag.nome || 'Tag sem nome'
        })));
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
        setTagOptions([]);
      }
    };

    fetchTags();
  }, []);

  // Buscar usuários quando projeto muda
  useEffect(() => {
    fetchProjectUsers(projetoId);
  }, [projetoId, fetchProjectUsers]);

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
        if (err instanceof Error && err.message === "NEXT_REDIRECT") {
          return;
        }
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

            {/* Projeto e Prioridade lado a lado */}
            <FormField
              control={form.control}
              name="projetoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projeto *</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div
                          className="
                            w-full border border-gray-200 rounded-md p-2
                            flex items-center justify-between cursor-pointer whitespace-normal break-words
                          "
                        >
                          {field.value
                            ? projetos.find(p => p.id.toString() === field.value)?.nome
                            : "Selecione um projeto"}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="
                          w-[300px] p-0 bg-white border border-gray-200
                          rounded-md z-50 max-h-[200px] overflow-y-auto
                          shadow-none ring-0
                        "
                      >
                        <div className="p-1">
                          {projetos.map(proj => {
                            const isSel = proj.id.toString() === field.value;
                            return (
                              <div
                                key={proj.id}
                                className={`
                                  flex items-center gap-3 px-3 py-2
                                  cursor-pointer rounded-sm transition-colors
                                  ${isSel ? "bg-gray-100" : "hover:bg-gray-50"}
                                `}
                                onClick={() => field.onChange(proj.id.toString())}
                              >
                                <div className="w-4 h-4">{isSel && <span>✓</span>}</div>
                                <span className="text-sm flex-1">{proj.nome}</span>
                              </div>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
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
                      <SelectTrigger className="shadow-none ring-0 focus:ring-0">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-none ring-0 rounded-md z-50 max-h-[200px] overflow-y-auto">
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

            {/* Título em full-width */}
            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full shadow-none ring-0 focus:ring-0" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descrição em full-width */}
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
                        className="min-h-[100px] w-full shadow-none ring-0 focus:ring-0"
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="w-full border border-gray-200 rounded-md p-2 flex flex-wrap gap-2 cursor-pointer whitespace-normal overflow-wrap break-words min-h-[40px]">
                          {loadingUsers ? (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Carregando usuários...</span>
                            </div>
                          ) : !projetoId ? (
                            <span className="text-gray-500">Selecione um projeto primeiro</span>
                          ) : projectUsers.length === 0 ? (
                            <span className="text-gray-500">Nenhum usuário encontrado</span>
                          ) : field.value.length > 0 ? (
                            projectUsers
                              .filter(u => field.value.includes(u.id))
                              .map(u => (
                                <span key={u.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                                  {u.nome}
                                </span>
                              ))
                          ) : (
                            <span className="text-gray-500">Selecione responsáveis</span>
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0 bg-white border border-gray-200 shadow-none ring-0 rounded-md z-50">
                        <div className="max-h-60 overflow-auto p-1">
                          {loadingUsers ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span className="text-sm text-gray-500">Carregando...</span>
                            </div>
                          ) : !projetoId ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              Selecione um projeto primeiro
                            </div>
                          ) : projectUsers.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              Nenhum usuário encontrado neste projeto
                            </div>
                          ) : (
                            projectUsers.map(user => {
                              const isSel = field.value.includes(user.id);
                              return (
                                <div
                                  key={`user-${user.id}`}
                                  className={`
                                    flex items-center gap-3 px-3 py-2
                                    cursor-pointer rounded-sm transition-colors
                                    ${isSel ? "bg-gray-100" : "hover:bg-gray-50"}
                                  `}
                                  onClick={() => {
                                    field.onChange(
                                      isSel
                                        ? field.value.filter(id => id !== user.id)
                                        : [...field.value, user.id]
                                    );
                                  }}
                                >
                                  <div className="w-4 h-4">{isSel && <span>✓</span>}</div>
                                  <span className="text-sm flex-1">{user.nome}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
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
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div
                          className="
                            w-full border border-gray-200 rounded-md p-2
                            flex gap-2 cursor-pointer whitespace-nowrap overflow-x-auto min-h-[40px]
                          "
                        >
                          {field.value.length > 0
                            ? tagOptions
                                .filter(t => field.value.includes(t.id))
                                .map(t => (
                                  <span
                                    key={t.id}
                                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm whitespace-nowrap"
                                  >
                                    {t.nome}
                                  </span>
                                ))
                            : <span className="text-gray-500">Selecione tags</span>}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0 bg-white border border-gray-200 shadow-none ring-0 rounded-md z-50">
                        <div className="max-h-60 overflow-auto p-1">
                          {tagOptions.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              Nenhuma tag disponível
                            </div>
                          ) : (
                            tagOptions.map(tag => {
                              const isSel = field.value.includes(tag.id);
                              return (
                                <div 
                                  key={`tag-${tag.id}`} 
                                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer rounded-sm transition-colors ${isSel ? "bg-gray-100" : "hover:bg-gray-50"}`}
                                  onClick={() => {
                                    field.onChange(isSel
                                      ? field.value.filter(id => id !== tag.id)
                                      : [...field.value, tag.id]);
                                  }}
                                >
                                  <div className="w-4 h-4">{isSel && <span>✓</span>}</div>
                                  <span className="text-sm flex-1">{tag.nome}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status - versão padronizada */}
            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="statusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Inicial *</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className="
                              w-full border border-gray-200 rounded-md p-2
                              flex items-center gap-2 cursor-pointer whitespace-normal min-h-[40px]
                            "
                          >
                            {field.value
                              ? <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                                  {statuses.find(s => s.id === field.value)?.label}
                                </span>
                              : <span className="text-gray-500">Selecione status</span>}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 bg-white border border-gray-200 shadow-none ring-0 rounded-md z-50">
                          <div className="p-1">
                            {statuses.map(s => {
                              const isSel = s.id === field.value;
                              return (
                                <div
                                  key={`status-${s.id}`}
                                  className={`
                                    flex items-center gap-3 px-3 py-2 cursor-pointer rounded-sm transition-colors
                                    ${isSel ? "bg-gray-100" : "hover:bg-gray-50"}
                                  `}
                                  onClick={() => field.onChange(s.id)}
                                >
                                  <div className="w-4 h-4">{isSel && <span>✓</span>}</div>
                                  <span className="text-sm flex-1">{s.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                )}
              />
            </div>

            {/* Datas lado a lado */}
            <FormField
              control={form.control}
              name="dataInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Início *</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start shadow-none ring-0 focus:ring-0" disabled={isPending}>
                          {field.value ? field.value.toLocaleDateString("pt-BR") : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 shadow-none ring-0">
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
            <FormField
              control={form.control}
              name="dataFim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Fim *</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start shadow-none ring-0 focus:ring-0" disabled={isPending}>
                          {field.value ? field.value.toLocaleDateString("pt-BR") : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 shadow-none ring-0">
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

            {/* Botão em full-width, alinhado à direita */}
            <div className="sm:col-span-2 flex justify-end">
              <Button
                type="submit"
                className="h-11 px-6 shadow-none ring-0 focus:ring-0"
                disabled={isPending || loadingUsers}
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
