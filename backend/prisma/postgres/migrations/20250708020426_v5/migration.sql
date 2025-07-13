/*
  Warnings:

  - You are about to drop the column `idade` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `niveis_acesso` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_id_tarefa_fkey";

-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "ProjetoUsuario" DROP CONSTRAINT "ProjetoUsuario_nivel_acesso_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjetoUsuario" DROP CONSTRAINT "ProjetoUsuario_projeto_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjetoUsuario" DROP CONSTRAINT "ProjetoUsuario_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Tarefa" DROP CONSTRAINT "Tarefa_id_projeto_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_nivel_acesso_id_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "idade",
ADD COLUMN     "cargoId" INTEGER,
ALTER COLUMN "nivel_acesso_id" DROP DEFAULT;

-- DropTable
DROP TABLE "niveis_acesso";

-- CreateTable
CREATE TABLE "Cargo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NivelAcesso" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "NivelAcesso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TarefaUsuario" (
    "tarefa_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TarefaUsuario_pkey" PRIMARY KEY ("tarefa_id","usuario_id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anexo" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "tipo_arquivo" TEXT NOT NULL,
    "id_tarefa" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagToTarefa" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TagToTarefa_AB_pkey" PRIMARY KEY ("A","B")
);

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
CREATE INDEX "_TagToTarefa_B_index" ON "_TagToTarefa"("B");

-- CreateIndex
CREATE INDEX "Comentario_id_tarefa_idx" ON "Comentario"("id_tarefa");

-- CreateIndex
CREATE INDEX "Comentario_id_usuario_idx" ON "Comentario"("id_usuario");

-- CreateIndex
CREATE INDEX "ProjetoUsuario_projeto_id_idx" ON "ProjetoUsuario"("projeto_id");

-- CreateIndex
CREATE INDEX "ProjetoUsuario_usuario_id_idx" ON "ProjetoUsuario"("usuario_id");

-- CreateIndex
CREATE INDEX "Tarefa_id_projeto_idx" ON "Tarefa"("id_projeto");

-- CreateIndex
CREATE INDEX "Tarefa_status_id_idx" ON "Tarefa"("status_id");

-- CreateIndex
CREATE INDEX "Tarefa_prioridade_id_idx" ON "Tarefa"("prioridade_id");

-- CreateIndex
CREATE INDEX "Usuario_status_id_idx" ON "Usuario"("status_id");

-- CreateIndex
CREATE INDEX "Usuario_nivel_acesso_id_idx" ON "Usuario"("nivel_acesso_id");

-- CreateIndex
CREATE INDEX "Usuario_cargoId_idx" ON "Usuario"("cargoId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "NivelAcesso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoUsuario" ADD CONSTRAINT "ProjetoUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoUsuario" ADD CONSTRAINT "ProjetoUsuario_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoUsuario" ADD CONSTRAINT "ProjetoUsuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "NivelAcesso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarefa" ADD CONSTRAINT "Tarefa_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TarefaUsuario" ADD CONSTRAINT "TarefaUsuario_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "Tarefa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TarefaUsuario" ADD CONSTRAINT "TarefaUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_tarefa_fkey" FOREIGN KEY ("id_tarefa") REFERENCES "Tarefa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anexo" ADD CONSTRAINT "Anexo_id_tarefa_fkey" FOREIGN KEY ("id_tarefa") REFERENCES "Tarefa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTarefa" ADD CONSTRAINT "_TagToTarefa_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTarefa" ADD CONSTRAINT "_TagToTarefa_B_fkey" FOREIGN KEY ("B") REFERENCES "Tarefa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
