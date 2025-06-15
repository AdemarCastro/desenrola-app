"use client";

import { useState } from "react";
import { Usuario } from "@/types/Usuario";
import ProfileEdit from "@/components/ProfileEdit";

interface UserModalProps {
  user: Usuario;
  onClose(): void;
  onSave(updated: Usuario): void;
}

export default function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<Usuario>(user);

  function handleSave(updated: Usuario) {
    setCurrentUser(updated);
    setIsEditMode(false);
  }

  // Função para formatar datas no formato DD/MM/YYYY em timezone de São Paulo
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-black/60 hover:text-black"
        >
          ×
        </button>

        {!isEditMode ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              {currentUser.primeiro_nome} {currentUser.sobrenome}
            </h2>
            <p className="mb-2"><strong>Email:</strong> {currentUser.email}</p>
            <p className="mb-2">
              <strong>Data Nasc.:</strong> {" "}
              {formatDate(currentUser.data_nascimento)}
            </p>
            <p className="mb-4">
              <strong>Status:</strong> {currentUser.status_id === 1 ? "Ativo" : "Inativo"}
            </p>
            <button
              onClick={() => setIsEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Editar
            </button>
          </>
        ) : (
          <ProfileEdit
            user={currentUser}
            onSave={(updated) => {
              handleSave(updated);
              onSave(updated);
            }}
            onCancel={() => setIsEditMode(false)}
          />
        )}
      </div>
    </div>
  );
}
