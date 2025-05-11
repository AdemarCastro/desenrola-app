-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "primeiro_nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "idade" INTEGER DEFAULT 0,
    "status_id" INTEGER NOT NULL,
    "nivel_acesso_id" INTEGER NOT NULL DEFAULT 1,
    "logout_em" DATETIME,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,
    CONSTRAINT "Usuario_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "StatusUsuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Usuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "niveis_acesso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "niveis_acesso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
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
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "projeto_id" INTEGER NOT NULL,
    "nivel_acesso_id" INTEGER NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,
    CONSTRAINT "ProjetoUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjetoUsuario_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "Projeto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjetoUsuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "niveis_acesso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StatusTarefa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PrioridadeTarefa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tarefa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "status_id" INTEGER NOT NULL,
    "prioridade_id" INTEGER NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,
    "id_projeto" INTEGER NOT NULL,
    CONSTRAINT "Tarefa_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "StatusTarefa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarefa_prioridade_id_fkey" FOREIGN KEY ("prioridade_id") REFERENCES "PrioridadeTarefa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarefa_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projeto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StatusUsuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
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
CREATE UNIQUE INDEX "niveis_acesso_nome_key" ON "niveis_acesso"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "StatusTarefa_nome_key" ON "StatusTarefa"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "PrioridadeTarefa_nome_key" ON "PrioridadeTarefa"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "StatusUsuario_nome_key" ON "StatusUsuario"("nome");
