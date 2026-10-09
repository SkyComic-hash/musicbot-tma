from typing import List, Dict

THEMES: Dict[str, Dict] = {
    "phonk": {
        "id": "phonk",
        "title": "Drift Phonk",
        "description": "Мощный бас, ковбеллы и энергетика ночного дрифта",
        "coverUrl": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=80",
        "tracks": [
            {"title": "Close Eyes", "artist": "DVRST", "query": "DVRST Close Eyes"},
            {"title": "Murder In My Mind", "artist": "KORDHELL", "query": "KORDHELL Murder In My Mind"},
            {"title": "Flare", "artist": "Hensonn", "query": "Hensonn Flare"},
            {"title": "METAMORPHOSIS", "artist": "INTERWORLD", "query": "INTERWORLD METAMORPHOSIS"},
            {"title": "Rapture", "artist": "INTERWORLD", "query": "INTERWORLD Rapture"},
        ]
    },
    "synthwave": {
        "id": "synthwave",
        "title": "Cyberpunk & Synthwave",
        "description": "Неоновый синтвейв, 80-е и атмосфера Найт-Сити",
        "coverUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80",
        "tracks": [
            {"title": "Midnight City", "artist": "M83", "query": "M83 Midnight City"},
            {"title": "Resonance", "artist": "HOME", "query": "HOME Resonance"},
            {"title": "Nightcall", "artist": "Kavinsky", "query": "Kavinsky Nightcall"},
            {"title": "Blinding Lights", "artist": "The Weeknd", "query": "The Weeknd Blinding Lights"},
            {"title": "Starboy", "artist": "The Weeknd, Daft Punk", "query": "The Weeknd Starboy"},
        ]
    },
    "lofi": {
        "id": "lofi",
        "title": "Lo-Fi Chill & Study",
        "description": "Мягкие ламповые биты для концентрации, кодинга и отдыха",
        "coverUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
        "tracks": [
            {"title": "controlla", "artist": "idealism", "query": "idealism controlla"},
            {"title": "Twilight", "artist": "Kupla", "query": "Kupla Twilight"},
            {"title": "Affection", "artist": "Jinsang", "query": "Jinsang Affection"},
            {"title": "Again", "artist": "Wun Two", "query": "Wun Two Again"},
        ]
    },
    "rock": {
        "id": "rock",
        "title": "Rock & Alternative",
        "description": "Легендарный рок, драйв и бессмертная классика",
        "coverUrl": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=500&q=80",
        "tracks": [
            {"title": "Прыгну со скалы", "artist": "Король и Шут", "query": "Король и Шут Прыгну со скалы"},
            {"title": "Кукла колдуна", "artist": "Король и Шут", "query": "Король и Шут Кукла колдуна"},
            {"title": "In the End", "artist": "Linkin Park", "query": "Linkin Park In the End"},
            {"title": "Группа крови", "artist": "Кино", "query": "Кино Группа крови"},
            {"title": "Smells Like Teen Spirit", "artist": "Nirvana", "query": "Nirvana Smells Like Teen Spirit"},
        ]
    },
    "night_drive": {
        "id": "night_drive",
        "title": "Night Drive & Darkwave",
        "description": "Пост-панк, меланхолия и пустые ночные трассы",
        "coverUrl": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80",
        "tracks": [
            {"title": "After Dark", "artist": "Mr.Kitty", "query": "Mr.Kitty After Dark"},
            {"title": "Судно (Борис Рыжий)", "artist": "Молчат Дома", "query": "Молчат Дома Судно"},
            {"title": "The Perfect Girl", "artist": "Mareux", "query": "Mareux The Perfect Girl"},
            {"title": "Space Song", "artist": "Beach House", "query": "Beach House Space Song"},
        ]
    }
}
