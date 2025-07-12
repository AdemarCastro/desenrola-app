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

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const schema = z.object({
  nome: z.string().min(1, "O nome do projeto é obrigatório"),
  descricao: z.string().optional(),
  data_entrega: z
    .date()
    .refine((d) => !!d, { message: "A data de entrega é obrigatória" }),
});

type FormSchema = z.infer<typeof schema>;

interface Props {
  action: (formData: FormData) => void;
}

export function FormCriarProjeto({ action }: Props) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      descricao: "",
      data_entrega: undefined,
    },
  });

  const [calendarOpen, setCalendarOpen] = useState(false);

  const onSubmit = (data: FormSchema) => {
    const formData = new FormData();
    formData.append("nome", data.nome);
    if (data.descricao) formData.append("descricao", data.descricao);
    formData.append(
      "data_entrega",
      data.data_entrega.toISOString().split("T")[0]
    );
    action(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Projeto</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Novo Sistema de Pagamento" {...field} />
              </FormControl>
              <FormMessage />
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
                  placeholder="Descreva os detalhes do projeto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_entrega"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Entrega Estimada</FormLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
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

        <Button type="submit" className="w-full">
          Criar Projeto
        </Button>
      </form>
    </Form>
  );
}
