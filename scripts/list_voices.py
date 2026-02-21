import asyncio
from edge_tts import list_voices

async def main():
    voices = await list_voices()
    en_voices = [v for v in voices if v['Locale'].startswith('en-US')]
    for v in en_voices:
        print(f"{v['ShortName']:40s} {v['Gender']:8s}")

asyncio.run(main())
