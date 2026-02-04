#!/usr/bin/env sh
set -e

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"
UVICORN_WORKERS="${UVICORN_WORKERS:-1}"

exec uvicorn app.main:app --host "$HOST" --port "$PORT" --workers "$UVICORN_WORKERS"
