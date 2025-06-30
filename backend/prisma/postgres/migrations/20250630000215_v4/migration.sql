/*
  Warnings:

  - The primary key for the `ProjetoUsuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProjetoUsuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjetoUsuario" DROP CONSTRAINT "ProjetoUsuario_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProjetoUsuario_pkey" PRIMARY KEY ("usuario_id", "projeto_id");

-- AlterTable
ALTER TABLE "Tarefa" ADD COLUMN     "concluido_em" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "avatar_url" TEXT DEFAULT 'https://desenrola.com/default-avatar.png';
