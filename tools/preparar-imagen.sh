#!/usr/bin/env bash
# Deja una foto en el formato estándar del catálogo (360x636, vertical, recorte centrado).
# Uso: ./tools/preparar-imagen.sh foto-original.jpg img/nombre-final.jpg
set -euo pipefail
[ $# -eq 2 ] || { echo "Uso: $0 entrada.jpg salida.jpg"; exit 1; }
W=360; H=636
sips -s format jpeg -s formatOptions 92 "$1" --out "$2" >/dev/null
read -r w h < <(sips -g pixelWidth -g pixelHeight "$2" | awk '/pixel/{print $2}' | paste -sd' ' -)
# Escala para cubrir 360x636 y recorta el excedente desde el centro.
if [ $((w * H)) -ge $((h * W)) ]; then sips --resampleHeight $H "$2" >/dev/null; else sips --resampleWidth $W "$2" >/dev/null; fi
sips -c $H $W "$2" >/dev/null
echo "Listo: $2 ($W x $H)"
