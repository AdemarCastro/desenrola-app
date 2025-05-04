#!/usr/bin/env bash

set -euo pipefail

cd backend

echo ""
read -rp "🛠️  Nome da migration (ex: add-user-field): " MIGRATION_NAME

echo ""
echo "🔨  Criando migration \"$MIGRATION_NAME\"..."
npm run migrate:create -- "$MIGRATION_NAME"  >/dev/null

echo ""
echo "🔄  Criando migration no dev..."
npm run migrate:dev                         >/dev/null

echo ""
echo "⚙️  Gerando Prisma Client..."
npm run generate                            >/dev/null

echo ""
echo "🚀  Deploy de migrations em produção..."
npm run migrate:deploy                      >/dev/null

echo ""
echo -e "\033[32m✅ Migration '$MIGRATION_NAME' aplicada com sucesso!\033[0m"