#!/bin/bash
# Script de inicio para Render — Medusa v2
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MEDUSA_DIR="$SCRIPT_DIR/.medusa/server"

echo "→ Directorio raíz del proyecto: $SCRIPT_DIR"
echo "→ Cambiando al directorio de producción: $MEDUSA_DIR"
cd "$MEDUSA_DIR"

echo "→ Instalando dependencias de producción..."
npm install --production --silent

echo "→ Iniciando servidor Medusa..."
exec node_modules/.bin/medusa start
