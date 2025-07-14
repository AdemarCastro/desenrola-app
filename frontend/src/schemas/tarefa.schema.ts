import { z } from "zod";

// Schema robusto para validação de criação de tarefa
export const criarTarefaSchema = z.object({
  titulo: z
    .string({ message: "Título deve ser um texto" })
    .min(1, "Título é obrigatório")
    .max(100, "Título deve ter no máximo 100 caracteres")
    .trim()
    .refine((val) => val.length > 0, "Título não pode estar vazio"),
  
  descricao: z
    .string({ message: "Descrição deve ser um texto" })
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
  
  projetoId: z
    .string({ message: "Projeto deve ser selecionado" })
    .min(1, "Projeto é obrigatório")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, "Selecione um projeto válido"),
  
  prioridadeId: z
    .string({ message: "Prioridade deve ser selecionada" })
    .min(1, "Prioridade é obrigatória")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0 && ["1", "2", "3"].includes(val);
    }, "Selecione uma prioridade válida"),

  responsavelIds: z.array(z.string()).optional(),

  tagIds: z.array(z.string()).optional(),

  statusId: z
    .string({ message: "Status deve ser selecionado" })
    .min(1, "Status é obrigatório")
    .refine((val) => ["1", "2", "3"].includes(val), "Selecione um status válido"),

  dataInicio: z.date(),

  dataFim: z.date(),
});

// Tipo inferido do schema para TypeScript
export type CriarTarefaFormData = z.infer<typeof criarTarefaSchema>;

// Schema para prioridades disponíveis
export const prioridadeSchema = z.object({
  id: z.string(),
  nome: z.string(),
  cor: z.string().optional(),
});

export type Prioridade = z.infer<typeof prioridadeSchema>;
