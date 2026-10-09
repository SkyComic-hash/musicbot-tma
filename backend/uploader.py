import os
import asyncio
from typing import Optional
from aiogram import Bot
from aiogram.types import FSInputFile
from config import TEMP_DIR
from searcher import run_command_async

async def download_track_mp3(video_id: str, title: str = "", artist: str = "") -> Optional[str]:
    """Downloads audio in MP3 format with embedded metadata and thumbnail"""
    import re
    from searcher import search_tracks

    is_valid_id = bool(re.match(r'^[a-zA-Z0-9_-]{11}$', video_id))
    if video_id.startswith('http'):
        target_url = video_id
        safe_id = "track_" + str(abs(hash(video_id)))[:8]
    elif is_valid_id:
        target_url = f"https://www.youtube.com/watch?v={video_id}"
        safe_id = video_id
    else:
        query = f"{title} {artist}".strip() or video_id.replace('_', ' ')
        tracks = await search_tracks(query, limit=1)
        if tracks:
            safe_id = tracks[0]['id']
            target_url = f"https://www.youtube.com/watch?v={safe_id}"
        else:
            return None

    output_template = os.path.join(TEMP_DIR, f"{safe_id}.%(ext)s")
    final_mp3 = os.path.join(TEMP_DIR, f"{safe_id}.mp3")

    if os.path.exists(final_mp3):
        return final_mp3

    cmd = [
        'yt-dlp',
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '--embed-thumbnail',
        '--add-metadata',
        '--no-playlist',
        '-o', output_template,
        target_url
    ]

    try:
        await run_command_async(cmd)
        if os.path.exists(final_mp3):
            return final_mp3
        # Look for any file with this video_id in TEMP_DIR
        for f in os.listdir(TEMP_DIR):
            if f.startswith(video_id) and f.endswith('.mp3'):
                return os.path.join(TEMP_DIR, f)
        return None
    except Exception as e:
        print(f"Error downloading {video_id}: {e}")
        return None

async def send_audio_to_telegram(
    bot: Bot,
    chat_id: int,
    video_id: str,
    title: str,
    artist: str,
    duration: int = 0
) -> Optional[int]:
    """Downloads track and sends as native Telegram audio message"""
    mp3_path = await download_track_mp3(video_id, title, artist)
    if not mp3_path or not os.path.exists(mp3_path):
        return None

    try:
        audio_file = FSInputFile(mp3_path, filename=f"{artist} - {title}.mp3")
        caption = f"🎵 <b>{title}</b>\n👤 <i>{artist}</i>\n\n🎧 Скачано через @phazmalistplayer_bot"
        msg = await bot.send_audio(
            chat_id=chat_id,
            audio=audio_file,
            title=title,
            performer=artist,
            duration=duration,
            caption=caption,
            parse_mode="HTML"
        )
        return msg.message_id
    except Exception as e:
        print(f"Error sending audio to {chat_id}: {e}")
        return None
