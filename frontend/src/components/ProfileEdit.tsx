"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Usuario } from "@/types/Usuario";

interface ProfileEditProps {
  user: Usuario;
  onSave(updated: Usuario): void;
  onCancel(): void;
}

export default function ProfileEdit({ user, onSave, onCancel }: ProfileEditProps) {
  // Inicializa formData preenchendo campos obrigatórios com default se ausentes
  const [formData, setFormData] = useState<Usuario>({
    ...user,
    nivel_acesso_id: user.nivel_acesso_id ?? 1,
    status_id: user.status_id ?? 1,
  });
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // 1) validar campos obrigatórios
    if (!formData.nivel_acesso_id || !formData.status_id) {
      setError('nivel_acesso_id e status_id são obrigatórios');
      return;
    }
    try {
      const res = await fetch(
        `/api/usuarios/${formData.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error('Erro ao atualizar usuário');
      const updated: Usuario = await res.json();
      onSave(updated);
    } catch (err: any) {
      console.error('Erro na atualização:', err);
      setError(err.message);
    }
  }

  return (
    <div className="relative w-[390px] h-auto bg-gray-50 rounded-[32px] overflow-hidden border border-gray-300 p-6">
      <h2 className="text-center text-xl font-semibold mb-4">Editar informações</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos de texto e data */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium">Primeiro Nome</label>
          <input
            type="text"
            value={formData.primeiro_nome || ''}
            onChange={(e) => setFormData({ ...formData, primeiro_nome: e.target.value })}
            className="w-full border rounded-lg p-2 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium">Sobrenome</label>
          <input
            type="text"
            value={formData.sobrenome || ''}
            onChange={(e) => setFormData({ ...formData, sobrenome: e.target.value })}
            className="w-full border rounded-lg p-2 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border rounded-lg p-2 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium">Data de Nascimento</label>
          <input
            type="date"
            value={(formData.data_nascimento?.split('T')[0]) || ''}
            onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
            className="w-full border rounded-lg p-2 bg-white"
          />
        </div>
        {/* Selects obrigatórios */}
        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label className="block text-sm font-medium">Nível de Acesso</label>
            <select
              value={formData.nivel_acesso_id}
              onChange={(e) => setFormData({ ...formData, nivel_acesso_id: Number(e.target.value) })}
              className="w-full border rounded-lg p-2 bg-white"
            >
              <option value={1}>Admin</option>
              <option value={2}>Gerente</option>
              <option value={3}>Usuário</option>
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="block text-sm font-medium">Status</label>
            <select
              value={formData.status_id}
              onChange={(e) => setFormData({ ...formData, status_id: Number(e.target.value) })}
              className="w-full border rounded-lg p-2 bg-white"
            >
              <option value={1}>Ativo</option>
              <option value={2}>Inativo</option>
            </select>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border bg-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
