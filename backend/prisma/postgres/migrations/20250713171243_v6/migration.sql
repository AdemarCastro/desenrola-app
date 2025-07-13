/*
  Warnings:

  - You are about to drop the column `cargoId` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_cargoId_fkey";

-- DropIndex
DROP INDEX "Usuario_cargoId_idx";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "cargoId",
ADD COLUMN     "cargo_id" INTEGER;

-- CreateIndex
CREATE INDEX "Usuario_cargo_id_idx" ON "Usuario"("cargo_id");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "Cargo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
