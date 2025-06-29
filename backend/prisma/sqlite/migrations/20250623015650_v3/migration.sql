/*
  Warnings:

  - You are about to drop the column `concluido_em` on the `Tarefa` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tarefa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "status_id" INTEGER NOT NULL,
    "prioridade_id" INTEGER NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "data_inicio" DATETIME,
    "data_fim" DATETIME,
    "apagado_em" DATETIME,
    "id_projeto" INTEGER NOT NULL,
    CONSTRAINT "Tarefa_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "StatusTarefa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarefa_prioridade_id_fkey" FOREIGN KEY ("prioridade_id") REFERENCES "PrioridadeTarefa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarefa_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projeto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tarefa" ("apagado_em", "atualizado_em", "criado_em", "descricao", "id", "id_projeto", "prioridade_id", "status_id") SELECT "apagado_em", "atualizado_em", "criado_em", "descricao", "id", "id_projeto", "prioridade_id", "status_id" FROM "Tarefa";
DROP TABLE "Tarefa";
ALTER TABLE "new_Tarefa" RENAME TO "Tarefa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
