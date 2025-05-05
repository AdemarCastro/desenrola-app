/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "primeiro_nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "idade" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "logout_em" DATETIME,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME
);

-- CreateTable
CREATE TABLE "Papel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT
);

-- CreateTable
CREATE TABLE "UsuarioPapel" (
    "id_usuario" INTEGER NOT NULL,
    "id_papel" INTEGER NOT NULL,
    "cargo" TEXT NOT NULL,
    "limite_projeto" INTEGER,
    "atribuido_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id_usuario", "id_papel"),
    CONSTRAINT "UsuarioPapel_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsuarioPapel_id_papel_fkey" FOREIGN KEY ("id_papel") REFERENCES "Papel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Permissao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acao" TEXT NOT NULL,
    "descricao" TEXT
);

-- CreateTable
CREATE TABLE "PapelPermissao" (
    "id_papel" INTEGER NOT NULL,
    "id_permissao" INTEGER NOT NULL,

    PRIMARY KEY ("id_papel", "id_permissao"),
    CONSTRAINT "PapelPermissao_id_papel_fkey" FOREIGN KEY ("id_papel") REFERENCES "Papel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PapelPermissao_id_permissao_fkey" FOREIGN KEY ("id_permissao") REFERENCES "Permissao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "data_entrega" DATETIME,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME
);

-- CreateTable
CREATE TABLE "ProjetoUsuario" (
    "id_projeto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_papel" INTEGER NOT NULL,
    "vinculado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id_projeto", "id_usuario", "id_papel"),
    CONSTRAINT "ProjetoUsuario_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projeto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjetoUsuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjetoUsuario_id_papel_fkey" FOREIGN KEY ("id_papel") REFERENCES "Papel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tarefa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "prioridade" TEXT NOT NULL DEFAULT 'MEDIA',
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,
    "id_projeto" INTEGER NOT NULL,
    CONSTRAINT "Tarefa_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projeto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conteudo" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,
    "id_tarefa" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    CONSTRAINT "Comentario_id_tarefa_fkey" FOREIGN KEY ("id_tarefa") REFERENCES "Tarefa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Papel_nome_key" ON "Papel"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Permissao_acao_key" ON "Permissao"("acao");
