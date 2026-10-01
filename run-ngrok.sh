#!/usr/bin/env bash
# Start the Next.js dev server (if it isn't already running) and expose it
# through an ngrok tunnel. Prints the public URL. Ctrl+C stops everything
# this script started.
#
# Usage: ./run-ngrok.sh [port]   (default port 3000)

# Re-run under bash if started with `sh run-ngrok.sh` (dash lacks pipefail etc.)
if [ -z "${BASH_VERSION:-}" ]; then
  exec bash "$0" "$@"
fi

set -euo pipefail

PORT="${1:-3000}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$PROJECT_DIR/.ngrok-logs"
mkdir -p "$LOG_DIR"

DEV_PID=""
NGROK_PID=""

cleanup() {
  echo
  echo "Stopping..."
  [ -n "$NGROK_PID" ] && kill "$NGROK_PID" 2>/dev/null || true
  [ -n "$DEV_PID" ] && kill "$DEV_PID" 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

if ! command -v ngrok >/dev/null 2>&1; then
  echo "ngrok is not installed. Install it with: sudo snap install ngrok"
  exit 1
fi

port_in_use() {
  ss -ltn 2>/dev/null | grep -q ":$PORT "
}

# 1. Dev server
if port_in_use; then
  echo "Dev server already running on port $PORT - reusing it."
else
  echo "Starting Next.js dev server on port $PORT..."
  cd "$PROJECT_DIR"
  npm run dev -- -p "$PORT" > "$LOG_DIR/dev.log" 2>&1 &
  DEV_PID=$!
  for _ in $(seq 1 60); do
    port_in_use && break
    if ! kill -0 "$DEV_PID" 2>/dev/null; then
      echo "Dev server failed to start. Log:"
      tail -20 "$LOG_DIR/dev.log"
      exit 1
    fi
    sleep 1
  done
  port_in_use || { echo "Dev server did not come up in 60s. See $LOG_DIR/dev.log"; cleanup; }
  echo "Dev server is up."
fi

# 2. ngrok tunnel (stop any old tunnel first so the 4040 API reports ours)
pkill -x ngrok 2>/dev/null || true
sleep 1
echo "Starting ngrok tunnel..."
ngrok http "$PORT" --log=stdout > "$LOG_DIR/ngrok.log" 2>&1 &
NGROK_PID=$!

URL=""
for _ in $(seq 1 30); do
  URL=$(curl -s http://127.0.0.1:4040/api/tunnels \
    | grep -o '"public_url":"https[^"]*"' | head -1 | cut -d'"' -f4 || true)
  [ -n "$URL" ] && break
  if ! kill -0 "$NGROK_PID" 2>/dev/null; then
    echo "ngrok failed to start. Log:"
    tail -20 "$LOG_DIR/ngrok.log"
    cleanup
  fi
  sleep 1
done

if [ -z "$URL" ]; then
  echo "Could not get the ngrok URL. See $LOG_DIR/ngrok.log"
  cleanup
fi

echo
echo "=============================================="
echo "  Site is live at: $URL"
echo "  Local:           http://localhost:$PORT"
echo "  ngrok dashboard: http://127.0.0.1:4040"
echo "=============================================="
echo "Press Ctrl+C to stop."

wait "$NGROK_PID"
cleanup
