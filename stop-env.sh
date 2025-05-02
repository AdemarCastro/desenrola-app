#!/usr/bin/env bash

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "🛑 Parando e removendo containers..."
docker compose down
echo ""

read -p "Deseja limpar todos os volumes e imagens utilizados? (y/N) " RESP
if [[ "$RESP" =~ ^[Yy]$ ]]; then
  echo ""
  echo "🧹 Limpando volumes pendentes..."
  docker volume rm $(docker volume ls -q) || echo "Nenhum volume pendente encontrado."

  echo ""
  echo "🧹 Limpando imagens pendentes..."
  docker image rm $(docker images -q) || echo "Nenhuma imagem pendente encontrada."

  echo ""
  echo "🧹 Limpando caches de build..."
  docker builder prune -a -f || echo "Nenhum cache de build encontrado."

  echo ""
  echo "🧹 Limpando caches de rede..."
  docker network prune -f || echo "Nenhum cache de rede encontrado."

  echo ""
  echo "✅ Limpeza concluída."
else
  echo ""
  echo "🔒 Mantendo volumes e imagens."
fi

echo ""
echo "👍 Ambiente finalizado."