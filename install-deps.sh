#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔧 Copiando .env.example para .env (raiz do projeto)..."
if [ -f "$REPO_ROOT/.env.example" ]; then
  cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env"
  cp "$REPO_ROOT/.env.example" "$REPO_ROOT/backend/.env"
  cp "$REPO_ROOT/.env.example" "$REPO_ROOT/frontend/.env"
else
  echo "⚠️  .env.example não encontrado na raiz."
fi

echo "📦 Instalando dependências do backend..."
cd "${REPO_ROOT}/backend"
npm install

echo "📦 Instalando dependências do frontend..."
cd "${REPO_ROOT}/frontend"
npm install

echo "✅ Ambiente configurado com sucesso!"