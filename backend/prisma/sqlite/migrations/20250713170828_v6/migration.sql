/*
  Warnings:

  - You are about to drop the column `cargoId` on the `Usuario` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "cargo_id" INTEGER,
    "logout_em" DATETIME,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "apagado_em" DATETIME,
    CONSTRAINT "Usuario_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "StatusUsuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Usuario_nivel_acesso_id_fkey" FOREIGN KEY ("nivel_acesso_id") REFERENCES "NivelAcesso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Usuario_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "Cargo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Usuario" ("apagado_em", "atualizado_em", "avatar_url", "criado_em", "data_nascimento", "email", "id", "logout_em", "nivel_acesso_id", "primeiro_nome", "senha", "sobrenome", "status_id") SELECT "apagado_em", "atualizado_em", "avatar_url", "criado_em", "data_nascimento", "email", "id", "logout_em", "nivel_acesso_id", "primeiro_nome", "senha", "sobrenome", "status_id" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE INDEX "Usuario_status_id_idx" ON "Usuario"("status_id");
CREATE INDEX "Usuario_nivel_acesso_id_idx" ON "Usuario"("nivel_acesso_id");
CREATE INDEX "Usuario_cargo_id_idx" ON "Usuario"("cargo_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
