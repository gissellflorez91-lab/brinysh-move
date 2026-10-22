#!/usr/bin/env bash
# Inicia el servidor local de BRINYSH MOVE y abre el navegador.
# Uso: ./start.sh [puerto]   (por defecto 8080). Detener con Ctrl+C.
set -euo pipefail
cd "$(dirname "$0")"

PORT="${1:-8080}"
URL="http://localhost:${PORT}"

if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "El puerto $PORT ya está en uso. Prueba con otro: ./start.sh 8081"
  exit 1
fi

echo "BRINYSH MOVE corriendo en $URL (Ctrl+C para detener)"
( sleep 1; open "$URL" ) &
exec python3 -m http.server "$PORT" --bind 127.0.0.1
