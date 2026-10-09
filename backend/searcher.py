import asyncio
import json
import re
import urllib.request
import urllib.parse
from typing import List, Dict, Optional

async def run_command_async(cmd: List[str]) -> str:
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await proc.communicate()
    if proc.returncode != 0:
        err = stderr.decode('utf-8', errors='ignore')
        raise RuntimeError(f"Command failed ({proc.returncode}): {err}")
    return stdout.decode('utf-8', errors='ignore')

def parse_title_artist(raw_title: str, uploader: str = "") -> tuple[str, str]:
    """Cleans up YouTube title into (title, artist)"""
    # Remove official video, official audio, etc.
    cleaned = re.sub(r'\(.*?(?:official|audio|video|clip|lyrics|remix|hd|4k).*?\)', '', raw_title, flags=re.IGNORECASE)
    cleaned = re.sub(r'\[.*?(?:official|audio|video|clip|lyrics|remix|hd|4k).*?\]', '', cleaned, flags=re.IGNORECASE)
    cleaned = cleaned.strip()

    if ' - ' in cleaned:
        parts = cleaned.split(' - ', 1)
        artist = parts[0].strip()
        title = parts[1].strip()
        return title, artist
    elif uploader:
        return cleaned, uploader.replace(' - Topic', '').strip()
    return cleaned, "Unknown Artist"

async def search_tracks(query: str, limit: int = 6, source: str = "youtube") -> List[Dict]:
    """Searches YouTube / Web for audio tracks"""
    search_query = f"ytsearch{limit}:{query}"
    cmd = ['yt-dlp', '-j', '--flat-playlist', search_query]
    
    try:
        raw_output = await run_command_async(cmd)
    except Exception as e:
        print(f"Search error for {query}: {e}")
        return []

    tracks = []
    for line in raw_output.strip().splitlines():
        if not line.strip():
            continue
        try:
            data = json.loads(line)
            video_id = data.get('id')
            raw_title = data.get('title', 'Unknown')
            uploader = data.get('uploader', '')
            title, artist = parse_title_artist(raw_title, uploader)
            duration = int(data.get('duration') or 200)

            # Thumbnail
            thumbnails = data.get('thumbnails') or []
            cover_url = thumbnails[-1].get('url') if thumbnails else f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"

            tracks.append({
                "id": video_id,
                "title": title,
                "artist": artist,
                "album": uploader.replace(' - Topic', '').strip() or "Single",
                "duration": duration,
                "coverUrl": cover_url,
                "source": source,
                "webpageUrl": f"https://www.youtube.com/watch?v={video_id}",
                "cacheStatus": "not_cached"
            })
        except Exception as err:
            print(f"Error parsing item: {err}")
            continue

    return tracks

async def get_stream_url(video_id_or_url: str, title: str = "", artist: str = "") -> Optional[str]:
    """Extracts direct audio stream URL for HTML5 Audio playback"""
    is_valid_id = bool(re.match(r'^[a-zA-Z0-9_-]{11}$', video_id_or_url))
    if video_id_or_url.startswith('http'):
        target = video_id_or_url
    elif is_valid_id:
        target = f"https://www.youtube.com/watch?v={video_id_or_url}"
    else:
        # Internal ID (e.g. phonk_0, 2) or query - search YouTube first
        query = f"{title} {artist}".strip() or video_id_or_url.replace('_', ' ')
        tracks = await search_tracks(query, limit=1)
        if tracks:
            target = f"https://www.youtube.com/watch?v={tracks[0]['id']}"
        else:
            return None

    cmd = ['yt-dlp', '-g', '-f', 'bestaudio', target]
    try:
        output = await run_command_async(cmd)
        lines = output.strip().splitlines()
        return lines[0] if lines else None
    except Exception as e:
        print(f"Stream URL extraction error for {target}: {e}")
        return None

async def resolve_spotify_link(url: str) -> Optional[Dict]:
    """Resolves Spotify track link via public oEmbed API"""
    oembed_url = f"https://open.spotify.com/oembed?url={urllib.parse.quote(url)}"
    try:
        req = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            title = data.get('title', '')
            thumbnail_url = data.get('thumbnail_url', '')
            return {
                "title": title,
                "thumbnailUrl": thumbnail_url,
                "originalUrl": url
            }
    except Exception as e:
        print(f"Spotify oEmbed error: {e}")
        return None

async def resolve_yandex_link(url: str) -> Optional[Dict]:
    """Extracts track ID / query from Yandex Music URL"""
    match = re.search(r'track/(\d+)', url)
    if match:
        track_id = match.group(1)
        return {
            "query": f"yandex music track {track_id}",
            "originalUrl": url
        }
    return None
