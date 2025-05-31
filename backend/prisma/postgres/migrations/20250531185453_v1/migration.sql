-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "primeiro_nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "idade" INTEGER DEFAULT 0,
    "status_id" INTEGER NOT NULL,
    "nivel_acesso_id" INTEGER NOT NULL DEFAULT 1,
    "logout_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "apagado_em" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveis_acesso" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "niveis_acesso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "data_entrega" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "apagado_em" TIMESTAMP(3),

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjetoUsuario" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "projeto_id" INTEGER NOT NULL,
    "nivel_acesso_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "apagado_em" TIMESTAMP(3),

    CONSTRAINT "ProjetoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusTarefa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "StatusTarefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrioridadeTarefa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "PrioridadeTarefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarefa" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "status_id" INTEGER NOT NULL,
    "prioridade_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "apagado_em" TIMESTAMP(3),
    "id_projeto" INTEGER NOT NULL,

    CONSTRAINT "Tarefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusUsuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "StatusUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "conteudo" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "apagado_em" TIMESTAMP(3),
    "id_tarefa" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "StatusUsuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "niveis_acesso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoUsuario" ADD CONSTRAINT "ProjetoUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoUsuario" ADD CONSTRAINT "ProjetoUsuario_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "Projeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoUsuario" ADD CONSTRAINT "ProjetoUsuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "niveis_acesso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarefa" ADD CONSTRAINT "Tarefa_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "StatusTarefa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarefa" ADD CONSTRAINT "Tarefa_prioridade_id_fkey" FOREIGN KEY ("prioridade_id") REFERENCES "PrioridadeTarefa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarefa" ADD CONSTRAINT "Tarefa_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_tarefa_fkey" FOREIGN KEY ("id_tarefa") REFERENCES "Tarefa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
