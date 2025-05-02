#!/usr/bin/env bash

set -euo pipefail

PORTS=(3000 4000 5555)

echo ""
echo "🔄 Atualizando repositório..."
git pull
echo ""

echo "🔍 Validando portas livres..."
for port in "${PORTS[@]}"; do
  if netstat -ano | grep LISTENING | grep ":$port" >/dev/null; then
    echo "❌ Porta $port está em uso. Libere antes de continuar."
    exit 1
  else
    echo ""
    echo "✅ Porta $port OK"
  fi
done

echo ""
echo "📦 Iniciando containers..."
docker compose up -d

echo ""
echo "☕ Ambiente iniciado com sucesso!"
echo ""
echo -e "\033[31m   - Frontend: http://localhost:3000\033[0m"
echo -e "\033[33m   - Backend:  http://localhost:4000\033[0m"
echo -e "\033[32m   - Prisma Studio: http://localhost:5555\033[0m"