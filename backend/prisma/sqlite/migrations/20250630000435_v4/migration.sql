/*
  Warnings:

  - The primary key for the `ProjetoUsuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProjetoUsuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tarefa" ADD COLUMN "concluido_em" DATETIME;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN "avatar_url" TEXT DEFAULT 'https://desenrola.com/default-avatar.png';

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjetoUsuario" (
    "usuario_id" INTEGER NOT NULL,
    "projeto_id" INTEGER NOT NULL,
    "nivel_acesso_id" INTEGER NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,

    PRIMARY KEY ("usuario_id", "projeto_id"),
    CONSTRAINT "ProjetoUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjetoUsuario_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "Projeto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjetoUsuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "niveis_acesso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjetoUsuario" ("apagado_em", "atualizado_em", "criado_em", "nivel_acesso_id", "projeto_id", "usuario_id") SELECT "apagado_em", "atualizado_em", "criado_em", "nivel_acesso_id", "projeto_id", "usuario_id" FROM "ProjetoUsuario";
DROP TABLE "ProjetoUsuario";
ALTER TABLE "new_ProjetoUsuario" RENAME TO "ProjetoUsuario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
