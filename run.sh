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

# Переменные окружения
export MINI_APP_URL="https://SkyComic-hash.github.io/musicbot-tma/"

# Запуск бэкенда и Telegram-бота
python3 backend/main.py &
BACKEND_PID=$!

# Запуск фронтенда
npm run dev -- --host --port 3000 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "🤖 Telegram Бот: https://t.me/phazmalistplayer_bot"
echo "📱 TMA Mini App:  $MINI_APP_URL"
echo "🌐 Web (Desktop): http://localhost:3000"
echo "=========================================================="
echo "Нажмите Ctrl+C для остановки."

wait
