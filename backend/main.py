import asyncio
import json
from aiohttp import web
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, MenuButtonWebApp

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import BOT_TOKEN, PORT, MINI_APP_URL
from themes import THEMES
from searcher import (
    search_tracks,
    get_stream_url,
    resolve_spotify_link,
    resolve_yandex_link
)
from uploader import send_audio_to_telegram

# Initialize Bot & Dispatcher
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

LAST_USER_ID: int = None

# ----------------- TELEGRAM BOT HANDLERS -----------------

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    global LAST_USER_ID
    if message.from_user:
        LAST_USER_ID = message.from_user.id

    welcome_text = (
        "👋 <b>Добро пожаловать в Music Cloud Bot!</b>\n\n"
        "Я умею находить и выгружать любую музыку без подписок из <b>YouTube Music</b>, "
        "<b>Spotify</b> и <b>Яндекс.Музыки</b> прямо в этот чат или твой канал!\n\n"
        "🌐 <b>Веб-плеер на компьютере:</b> http://localhost:3000\n\n"
        "⚡ <b>Команды:</b>\n"
        "• <code>/yt [запрос]</code> — поиск по YouTube Music\n"
        "• <code>/sp [запрос или ссылка]</code> — поиск / импорт из Spotify\n"
        "• <code>/ya [запрос или ссылка]</code> — поиск / импорт из Яндекс.Музыки\n"
        "• <code>/theme [тема]</code> — подборка (phonk, synthwave, lofi, rock, night_drive)\n"
        "• <i>Или просто отправь ссылку на трек / название песни!</i>"
    )

    buttons = []
    if MINI_APP_URL and MINI_APP_URL.startswith("https://"):
        buttons.append([InlineKeyboardButton(text="🎧 Открыть TMA Плеер", web_app=WebAppInfo(url=MINI_APP_URL))])

    buttons.append([
        InlineKeyboardButton(text="🔥 Phonk", callback_data="theme:phonk"),
        InlineKeyboardButton(text="🌆 Synthwave", callback_data="theme:synthwave"),
    ])
    buttons.append([
        InlineKeyboardButton(text="☕ Lo-Fi", callback_data="theme:lofi"),
        InlineKeyboardButton(text="🎸 Rock", callback_data="theme:rock"),
    ])
    buttons.append([
        InlineKeyboardButton(text="🌃 Night Drive", callback_data="theme:night_drive"),
    ])

    kb = InlineKeyboardMarkup(inline_keyboard=buttons)

    await message.answer(welcome_text, reply_markup=kb, parse_mode="HTML")

@dp.callback_query(F.data.startswith("theme:"))
async def handle_theme_callback(callback: types.CallbackQuery):
    theme_id = callback.data.split(":")[1]
    theme = THEMES.get(theme_id)
    if not theme:
        await callback.answer("Тема не найдена")
        return

    await callback.message.answer(
        f"⏳ Ищу и выгружаю треки из темы <b>{theme['title']}</b>...",
        parse_mode="HTML"
    )
    await callback.answer()

    for item in theme["tracks"][:3]:
        tracks = await search_tracks(item["query"], limit=1)
        if tracks:
            t = tracks[0]
            await send_audio_to_telegram(
                bot=bot,
                chat_id=callback.message.chat.id,
                video_id=t["id"],
                title=t["title"],
                artist=t["artist"],
                duration=t["duration"]
            )

@dp.message(Command("yt"))
async def cmd_yt(message: types.Message):
    query = message.text.replace("/yt", "").strip()
    if not query:
        await message.answer("Укажи запрос, например: <code>/yt Starboy The Weeknd</code>", parse_mode="HTML")
        return

    status_msg = await message.answer(f"🔍 Ищу в YouTube Music: <i>{query}</i>...", parse_mode="HTML")
    tracks = await search_tracks(query, limit=1)
    if not tracks:
        await status_msg.edit_text("❌ Трек не найден.")
        return

    t = tracks[0]
    await status_msg.edit_text(f"⏳ Скачиваю и отправляю: <b>{t['title']} — {t['artist']}</b>...", parse_mode="HTML")
    res = await send_audio_to_telegram(bot, message.chat.id, t["id"], t["title"], t["artist"], t["duration"])
    if res:
        await status_msg.delete()
    else:
        await status_msg.edit_text("❌ Ошибка при отправке аудио.")

@dp.message(Command("sp"))
async def cmd_sp(message: types.Message):
    query = message.text.replace("/sp", "").strip()
    if not query:
        await message.answer("Укажи ссылку или название, например: <code>/sp Never Gonna Give You Up</code>", parse_mode="HTML")
        return

    status_msg = await message.answer("🔍 Распознаю Spotify трек...", parse_mode="HTML")
    if "open.spotify.com" in query:
        sp_data = await resolve_spotify_link(query)
        if sp_data and sp_data.get("title"):
            query = sp_data["title"]

    tracks = await search_tracks(f"{query} audio", limit=1, source="spotify")
    if not tracks:
        await status_msg.edit_text("❌ Трек не найден.")
        return

    t = tracks[0]
    await status_msg.edit_text(f"⏳ Скачиваю: <b>{t['title']} — {t['artist']}</b>...", parse_mode="HTML")
    res = await send_audio_to_telegram(bot, message.chat.id, t["id"], t["title"], t["artist"], t["duration"])
    if res:
        await status_msg.delete()
    else:
        await status_msg.edit_text("❌ Ошибка при отправке аудио.")

@dp.message(Command("ya"))
async def cmd_ya(message: types.Message):
    query = message.text.replace("/ya", "").strip()
    if not query:
        await message.answer("Укажи название или ссылку, например: <code>/ya Король и Шут</code>", parse_mode="HTML")
        return

    status_msg = await message.answer("🔍 Ищу трек...", parse_mode="HTML")
    tracks = await search_tracks(query, limit=1, source="yandex")
    if not tracks:
        await status_msg.edit_text("❌ Трек не найден.")
        return

    t = tracks[0]
    await status_msg.edit_text(f"⏳ Отправляю: <b>{t['title']} — {t['artist']}</b>...", parse_mode="HTML")
    res = await send_audio_to_telegram(bot, message.chat.id, t["id"], t["title"], t["artist"], t["duration"])
    if res:
        await status_msg.delete()
    else:
        await status_msg.edit_text("❌ Ошибка при отправке аудио.")

@dp.message()
async def handle_any_text(message: types.Message):
    text = message.text.strip()
    if not text:
        return

    status_msg = await message.answer(f"🔍 Ищу: <i>{text}</i>...", parse_mode="HTML")
    
    # Check if Spotify link
    if "open.spotify.com" in text:
        sp = await resolve_spotify_link(text)
        if sp and sp.get("title"):
            text = sp["title"]

    tracks = await search_tracks(text, limit=1)
    if not tracks:
        await status_msg.edit_text("❌ Ничего не найдено.")
        return

    t = tracks[0]
    await status_msg.edit_text(f"⏳ Скачиваю: <b>{t['title']} — {t['artist']}</b>...", parse_mode="HTML")
    res = await send_audio_to_telegram(bot, message.chat.id, t["id"], t["title"], t["artist"], t["duration"])
    if res:
        await status_msg.delete()
    else:
        await status_msg.edit_text("❌ Ошибка при скачивании аудио.")

# ----------------- HTTP REST API HANDLERS -----------------

def cors_response(data, status=200):
    return web.json_response(data, status=status, headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Private-Network": "true",
    })

async def handle_options(request):
    return web.Response(status=204, headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Private-Network": "true",
    })

async def api_health(request):
    return cors_response({"status": "ok", "bot": "@phazmalistplayer_bot"})

async def api_themes(request):
    return cors_response({"themes": list(THEMES.values())})

async def api_search(request):
    q = request.query.get("q", "").strip()
    limit = int(request.query.get("limit", 6))
    source = request.query.get("source", "youtube")

    if not q:
        return cors_response({"tracks": []})

    tracks = await search_tracks(q, limit=limit, source=source)
    return cors_response({"tracks": tracks})

async def api_stream(request):
    video_id = request.query.get("id", "").strip()
    title = request.query.get("title", "").strip()
    artist = request.query.get("artist", "").strip()
    if not video_id and not title:
        return cors_response({"error": "id or title required"}, status=400)

    stream_url = await get_stream_url(video_id, title=title, artist=artist)
    if not stream_url:
        return cors_response({"error": "stream not found"}, status=404)

    return cors_response({"streamUrl": stream_url})

async def api_send_to_telegram(request):
    global LAST_USER_ID
    try:
        body = await request.json()
    except Exception:
        return cors_response({"error": "invalid json"}, status=400)

    chat_id = body.get("chat_id")
    video_id = body.get("video_id")
    title = body.get("title", "Track")
    artist = body.get("artist", "Artist")
    duration = body.get("duration", 0)

    if not video_id and not title:
        return cors_response({"error": "video_id required"}, status=400)

    target_chat = None
    if chat_id:
        try:
            cid = int(chat_id)
            if cid != 8788571555:
                target_chat = cid
        except ValueError:
            target_chat = chat_id

    if not target_chat and LAST_USER_ID:
        target_chat = LAST_USER_ID

    if not target_chat:
        return cors_response({"error": "chat_id required"}, status=400)

    msg_id = await send_audio_to_telegram(bot, target_chat, video_id, title, artist, duration)
    if msg_id:
        return cors_response({"success": True, "message_id": msg_id})
    return cors_response({"error": "failed to send audio"}, status=500)

async def api_import_link(request):
    try:
        body = await request.json()
    except Exception:
        return cors_response({"error": "invalid json"}, status=400)

    url = body.get("url", "").strip()
    if not url:
        return cors_response({"error": "url required"}, status=400)

    query = url
    source = "youtube"
    if "open.spotify.com" in url:
        source = "spotify"
        sp = await resolve_spotify_link(url)
        if sp and sp.get("title"):
            query = sp["title"]
    elif "music.yandex" in url:
        source = "yandex"
        ya = await resolve_yandex_link(url)
        if ya and ya.get("query"):
            query = ya["query"]

    tracks = await search_tracks(query, limit=5, source=source)
    return cors_response({"query": query, "source": source, "tracks": tracks})

# ----------------- MAIN RUNNER -----------------

async def main():
    # Setup aiohttp web app
    app = web.Application()
    app.router.add_route("OPTIONS", "/{tail:.*}", handle_options)
    app.router.add_get("/api/health", api_health)
    app.router.add_get("/api/themes", api_themes)
    app.router.add_get("/api/search", api_search)
    app.router.add_get("/api/stream", api_stream)
    app.router.add_post("/api/send_to_telegram", api_send_to_telegram)
    app.router.add_post("/api/import_link", api_import_link)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", PORT)
    await site.start()
    print(f"🚀 MusicBot HTTP API server running on http://0.0.0.0:{PORT}")

    # Start Bot Polling
    print("🤖 Starting Telegram Bot polling (@phazmalistplayer_bot)...")
    try:
        if MINI_APP_URL:
            await bot.set_chat_menu_button(
                menu_button=MenuButtonWebApp(
                    text="🎧 Плеер",
                    web_app=WebAppInfo(url=MINI_APP_URL)
                )
            )
            print(f"📱 TMA Menu button configured: {MINI_APP_URL}")
    except Exception as e:
        print(f"⚠️ Could not set menu button: {e}")

    try:
        await dp.start_polling(bot)
    finally:
        await runner.cleanup()
        await bot.session.close()

if __name__ == "__main__":
    asyncio.run(main())
