/*
  Warnings:

  - You are about to drop the column `concluido_em` on the `Tarefa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tarefa" DROP COLUMN "concluido_em",
ADD COLUMN     "data_fim" TIMESTAMP(3),
ADD COLUMN     "data_inicio" TIMESTAMP(3);
