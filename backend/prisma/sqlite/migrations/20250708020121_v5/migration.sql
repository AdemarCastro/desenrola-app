/*
  Warnings:

  - You are about to drop the `niveis_acesso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `idade` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "niveis_acesso_nome_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "niveis_acesso";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Cargo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NivelAcesso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TarefaUsuario" (
    "tarefa_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("tarefa_id", "usuario_id"),
    CONSTRAINT "TarefaUsuario_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "Tarefa" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TarefaUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Anexo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "tipo_arquivo" TEXT NOT NULL,
    "id_tarefa" INTEGER NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Anexo_id_tarefa_fkey" FOREIGN KEY ("id_tarefa") REFERENCES "Tarefa" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TagToTarefa" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TagToTarefa_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TagToTarefa_B_fkey" FOREIGN KEY ("B") REFERENCES "Tarefa" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comentario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conteudo" TEXT NOT NULL,
    "id_tarefa" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,
    CONSTRAINT "Comentario_id_tarefa_fkey" FOREIGN KEY ("id_tarefa") REFERENCES "Tarefa" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comentario" ("apagado_em", "atualizado_em", "conteudo", "criado_em", "id", "id_tarefa", "id_usuario") SELECT "apagado_em", "atualizado_em", "conteudo", "criado_em", "id", "id_tarefa", "id_usuario" FROM "Comentario";
DROP TABLE "Comentario";
ALTER TABLE "new_Comentario" RENAME TO "Comentario";
CREATE INDEX "Comentario_id_tarefa_idx" ON "Comentario"("id_tarefa");
CREATE INDEX "Comentario_id_usuario_idx" ON "Comentario"("id_usuario");
CREATE TABLE "new_ProjetoUsuario" (
    "usuario_id" INTEGER NOT NULL,
    "projeto_id" INTEGER NOT NULL,
    "nivel_acesso_id" INTEGER NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,

    PRIMARY KEY ("usuario_id", "projeto_id"),
    CONSTRAINT "ProjetoUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjetoUsuario_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "Projeto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjetoUsuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "NivelAcesso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjetoUsuario" ("apagado_em", "atualizado_em", "criado_em", "nivel_acesso_id", "projeto_id", "usuario_id") SELECT "apagado_em", "atualizado_em", "criado_em", "nivel_acesso_id", "projeto_id", "usuario_id" FROM "ProjetoUsuario";
DROP TABLE "ProjetoUsuario";
ALTER TABLE "new_ProjetoUsuario" RENAME TO "ProjetoUsuario";
CREATE INDEX "ProjetoUsuario_projeto_id_idx" ON "ProjetoUsuario"("projeto_id");
CREATE INDEX "ProjetoUsuario_usuario_id_idx" ON "ProjetoUsuario"("usuario_id");
CREATE TABLE "new_Tarefa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "status_id" INTEGER NOT NULL,
    "prioridade_id" INTEGER NOT NULL,
    "id_projeto" INTEGER NOT NULL,
    "data_inicio" DATETIME,
    "data_fim" DATETIME,
    "concluido_em" DATETIME,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,
    CONSTRAINT "Tarefa_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projeto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tarefa_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "StatusTarefa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarefa_prioridade_id_fkey" FOREIGN KEY ("prioridade_id") REFERENCES "PrioridadeTarefa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tarefa" ("apagado_em", "atualizado_em", "concluido_em", "criado_em", "data_fim", "data_inicio", "descricao", "id", "id_projeto", "prioridade_id", "status_id") SELECT "apagado_em", "atualizado_em", "concluido_em", "criado_em", "data_fim", "data_inicio", "descricao", "id", "id_projeto", "prioridade_id", "status_id" FROM "Tarefa";
DROP TABLE "Tarefa";
ALTER TABLE "new_Tarefa" RENAME TO "Tarefa";
CREATE INDEX "Tarefa_id_projeto_idx" ON "Tarefa"("id_projeto");
CREATE INDEX "Tarefa_status_id_idx" ON "Tarefa"("status_id");
CREATE INDEX "Tarefa_prioridade_id_idx" ON "Tarefa"("prioridade_id");
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "primeiro_nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "avatar_url" TEXT DEFAULT 'https://desenrola.com/default-avatar.png',
    "status_id" INTEGER NOT NULL,
    "nivel_acesso_id" INTEGER NOT NULL,
    "cargoId" INTEGER,
    "logout_em" DATETIME,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,
    CONSTRAINT "Usuario_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "StatusUsuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Usuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "NivelAcesso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Usuario_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Usuario" ("apagado_em", "atualizado_em", "avatar_url", "criado_em", "data_nascimento", "email", "id", "logout_em", "nivel_acesso_id", "primeiro_nome", "senha", "sobrenome", "status_id") SELECT "apagado_em", "atualizado_em", "avatar_url", "criado_em", "data_nascimento", "email", "id", "logout_em", "nivel_acesso_id", "primeiro_nome", "senha", "sobrenome", "status_id" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE INDEX "Usuario_status_id_idx" ON "Usuario"("status_id");
CREATE INDEX "Usuario_nivel_acesso_id_idx" ON "Usuario"("nivel_acesso_id");
CREATE INDEX "Usuario_cargoId_idx" ON "Usuario"("cargoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Cargo_nome_key" ON "Cargo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "NivelAcesso_nome_key" ON "NivelAcesso"("nome");

-- CreateIndex
CREATE INDEX "TarefaUsuario_usuario_id_idx" ON "TarefaUsuario"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_nome_key" ON "Tag"("nome");

-- CreateIndex
CREATE INDEX "Anexo_id_tarefa_idx" ON "Anexo"("id_tarefa");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTarefa_AB_unique" ON "_TagToTarefa"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTarefa_B_index" ON "_TagToTarefa"("B");
