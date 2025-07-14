// frontend/src/components/ProjetoModal.tsx
"use client";

import { Projeto } from "@/types/projeto";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ProjetoModal({
  projeto,
  onClose,
  onSave,
}: {
  projeto: Projeto;
  onClose: () => void;
  onSave: (projetoAtualizado: Projeto) => void;
}) {
  const [nome, setNome] = useState(projeto.nome);
  const [descricao, setDescricao] = useState(projeto.descricao || "");
  const [dataEntrega, setDataEntrega] = useState(
    projeto.data_entrega
      ? new Date(projeto.data_entrega).toISOString().slice(0, 10)
      : ""
  );
  const [salvando, setSalvando] = useState(false);

  const handleSave = async () => {
    setSalvando(true);
    const res = await fetch(`/api/projetos/${projeto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, descricao, data_entrega: dataEntrega }),
    });

    if (res.ok) {
      const atualizado = await res.json();
      onSave({
        ...projeto, // mantém progresso e usuários
        ...atualizado, // aplica dados atualizados da API
        nome: atualizado.nome,
        descricao: atualizado.descricao,
        data_entrega: atualizado.data_entrega,
      });
    } else {
      const erro = await res.json();
      alert(erro.details?.message || "Erro ao salvar projeto");
    }
    setSalvando(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Data de Entrega</label>
            <Input
              type="date"
              value={dataEntrega}
              onChange={(e) => setDataEntrega(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
