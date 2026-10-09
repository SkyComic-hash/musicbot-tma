import os

BOT_TOKEN = os.getenv("BOT_TOKEN", "8788571555:AAHBKE6tRdyAPgGi5-I8p1yyjoo2pxvG2ps")
PORT = int(os.getenv("PORT", 8000))
TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp_audio")

os.makedirs(TEMP_DIR, exist_ok=True)
