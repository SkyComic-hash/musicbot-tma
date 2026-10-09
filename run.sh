#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
cd "$SCRIPT_DIR"

# Очищаем старые процессы
fuser -k 8000/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
fuser -k 3001/tcp 2>/dev/null

echo "=========================================================="
echo "✨ MusicBot TMA: Запуск системы..."
echo "=========================================================="

# Запуск бэкенда и Telegram-бота
python3 backend/main.py &
BACKEND_PID=$!

# Запуск фронтенда
npm run dev -- --host --port 3000 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "🤖 Telegram Бот: https://t.me/phazmalistplayer_bot"
echo "🌐 Локальный плеер: http://localhost:3000"
echo "=========================================================="
echo "Нажмите Ctrl+C для остановки."

wait
