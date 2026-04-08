#!/bin/bash
# Script de inicio para Render — Medusa v2
# Medusa v2 compila a .medusa/server/ y requiere iniciarse desde ahí.
set -e

MEDUSA_DIR="$(dirname "$0")/.medusa/server"

echo "→ Cambiando al directorio de producción: $MEDUSA_DIR"
cd "$MEDUSA_DIR"

echo "→ Iniciando servidor Medusa..."
exec node_modules/.bin/medusa start
