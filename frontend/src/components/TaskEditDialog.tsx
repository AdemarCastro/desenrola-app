"use client";

import React, { useState, useEffect } from 'react';
import type { Tarefa, Responsavel } from '@/types/tarefa';
import { CustomModal, ModalBody, ModalHeader, ModalTitle, ModalFooter, ModalDescription } from '@/components/ui/CustomModal';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserPlus, Trash2, X, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatDateForDisplay = (date: string | null | undefined): string => {
  if (!date) return "Selecione uma data";
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

interface TaskEditDialogProps {
  tarefa: Tarefa;
  usuariosDoProjeto: Responsavel[];
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (tarefa: Tarefa) => void;
  onTaskDelete: (taskId: number) => void;
}

export const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ tarefa, usuariosDoProjeto, onOpenChange, onTaskUpdate, onTaskDelete }) => {
  const [formData, setFormData] = useState<Partial<Tarefa>>(tarefa);
  const [isSaving, setIsSaving] = useState(false);
  const [openUserSelector, setOpenUserSelector] = useState(false);
  const [isStartDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setEndDatePickerOpen] = useState(false);

  useEffect(() => {
    setFormData(tarefa);
  }, [tarefa]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const originalIds = new Set(tarefa.responsaveis?.map(r => r.id) || []);
      const currentIds = new Set(formData.responsaveis?.map(r => r.id) || []);

      const idsToAdd = [...currentIds].filter(id => !originalIds.has(id));
      const idsToRemove = [...originalIds].filter(id => !currentIds.has(id));

      const requests = [];

      const scalarData = {
        descricao: formData.descricao,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
      };
      console.log('Salvando tarefa com dados:', scalarData);
      requests.push(
        fetch(`/api/tarefas/${tarefa.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scalarData),
        })
      );
      
      if (idsToAdd.length > 0) {
        requests.push(
          fetch(`/api/tarefas/${tarefa.id}/responsaveis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuarioIds: idsToAdd }),
          })
        );
      }

      idsToRemove.forEach(usuarioId => {
        requests.push(
          fetch(`/api/tarefas/${tarefa.id}/responsaveis`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuarioId }),
          })
        );
      });

      const responses = await Promise.all(requests);
      
      for (const res of responses) {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Uma das operações de salvamento falhou.');
        }
      }

      const finalTaskResponse = await fetch(`/api/tarefas/${tarefa.id}`);
      if (!finalTaskResponse.ok) {
        throw new Error('Falha ao buscar os dados atualizados da tarefa.');
      }
      const finalTaskData = await finalTaskResponse.json();
      
      onTaskUpdate(finalTaskData);
      onOpenChange(false);

    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        const res = await fetch(`/api/tarefas/${tarefa.id}`, { method: 'DELETE' });
        if (res.ok) {
          onTaskDelete(tarefa.id);
          onOpenChange(false);
        } else {
          throw new Error('Falha ao excluir a tarefa.');
        }
      } catch (error) {
        console.error(error);
        alert("Falha ao excluir a tarefa.");
      }
    }
  };

  const handleSelectUser = (usuario: Responsavel) => {
    setFormData(prev => {
      const currentResponsaveis = prev.responsaveis || [];
      if (!currentResponsaveis.some(r => r.id === usuario.id)) {
        return { ...prev, responsaveis: [...currentResponsaveis, usuario] };
      }
      return prev;
    });
    setOpenUserSelector(false);
  };

  const handleRemoveUser = (usuarioId: number) => {
    setFormData(prev => ({
      ...prev,
      responsaveis: (prev.responsaveis || []).filter(r => r.id !== usuarioId),
    }));
  };

  const getInitials = (name: string = "") => (name || "").split(' ').map(n => n[0]).join('').toUpperCase();

  const usuariosNaoAtribuidos = usuariosDoProjeto.filter(
    u => !(formData.responsaveis || []).some(r => r.id === u.id)
  );

  return (
    <CustomModal isOpen={true} onClose={() => onOpenChange(false)}>
      <ModalHeader>
        <ModalTitle>Editar Tarefa</ModalTitle>
        <ModalDescription>Altere os detalhes, responsáveis e anexos da tarefa.</ModalDescription>
      </ModalHeader>
      
      <ModalBody>
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea id="descricao" value={formData.descricao || ''} onChange={e => setFormData({...formData, descricao: e.target.value})} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data de Início</Label>
            <Popover open={isStartDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.data_inicio && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateForDisplay(formData.data_inicio)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  onSelectDate={(date) => {
                    setFormData({ ...formData, data_inicio: date.toISOString() });
                    setStartDatePickerOpen(false);
                  }}
                  initialDate={formData.data_inicio ? new Date(formData.data_inicio) : new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Data de Fim</Label>
            <Popover open={isEndDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.data_fim && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateForDisplay(formData.data_fim)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  onSelectDate={(date) => {
                    setFormData({ ...formData, data_fim: date.toISOString() });
                    setEndDatePickerOpen(false);
                  }}
                  initialDate={formData.data_fim ? new Date(formData.data_fim) : new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
            <Label>Responsáveis</Label>
            <div className="flex flex-wrap gap-2 items-center">
              {(formData.responsaveis || []).map((r, index) => (
                <div key={r.id || `resp-new-${index}`} className="flex items-center gap-2 bg-gray-100 rounded-full py-1 pl-2 pr-1 text-sm font-medium">
                  <Avatar className="h-6 w-6"><AvatarImage src={r.avatar_url} alt={r.primeiro_nome} /><AvatarFallback>{getInitials(r.primeiro_nome)}</AvatarFallback></Avatar>
                  <span>{r.primeiro_nome}</span>
                  <button onClick={() => handleRemoveUser(r.id)} className="rounded-full hover:bg-gray-300 p-0.5 transition-colors"><X size={14} /></button>
                </div>
              ))}
              <Popover open={openUserSelector} onOpenChange={setOpenUserSelector}>
                <PopoverTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-dashed"><UserPlus size={16} /></Button></PopoverTrigger>
                <PopoverContent className="p-0 w-[250px] bg-white" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar usuário..." />
                    <CommandList>
                      <CommandEmpty>Nenhum usuário disponível.</CommandEmpty>
                      <CommandGroup>
                        {usuariosNaoAtribuidos.map((u) => (<CommandItem key={`user-${u.id}`} onSelect={() => handleSelectUser(u)}>{u.primeiro_nome} {u.sobrenome}</CommandItem>))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
        </div>
        
        <div className="border-t pt-4 space-y-3">
          <Label>Anexos</Label>
          <div className="p-4 bg-gray-100 rounded-md text-center text-gray-500 text-sm">Funcionalidade de upload e listagem de anexos em desenvolvimento.</div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isSaving}>
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir Tarefa
        </Button>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
        </div>
      </ModalFooter>
    </CustomModal>
  );
};