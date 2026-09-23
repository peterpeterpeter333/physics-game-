"""Reviewed sentence-level pronunciations; displayed Japanese is never rewritten."""
import hashlib
import json
import re
from pathlib import Path

OVERRIDES = json.loads(Path(__file__).with_name('narration-pronunciation.json').read_text())

WORDS = {'電気束':'でんきそく','電場':'でんば','磁場':'じば','磁束':'じそく',
         '上向き':'うえむき','下向き':'したむき','外向き':'そとむき','内向き':'うちむき',
         '負の':'ふの','正の':'せいの','初速度':'しょそくど','法線':'ほうせん',
         '一様':'いちよう','時定数':'じていすう','数密度':'すうみつど','ローレンツ力':'ローレンツりょく'}

def word_reading(text):
    for word, reading in sorted(WORDS.items(), key=lambda pair: -len(pair[0])):
        text = text.replace(word, reading)
    # Do not corrupt compounds such as 最大値, 絶対値, 調和, or 絶縁.
    for word, reading in [('値','あたい'),('和','わ'),('縁','ふち')]:
        text = re.sub(r'(?<![一-龠])'+word+r'(?![一-龠])', reading, text)
    return text

def spoken_text(text):
    words = word_reading(text)
    # Reviewed contextual sentences still take precedence over a generic reading.
    return OVERRIDES.get(text, {}).get('spoken',
        words.replace('電場','でんば').replace('磁場','じば').replace('電気束','でんきそく'))

def validate_query(text, query):
    expected = OVERRIDES.get(text, {}).get('expectedKana')
    if expected:
        actual = ''.join(m['text'] for p in query['accent_phrases'] for m in p['moras'])
        if actual != expected:
            raise ValueError(f'Unreviewed pronunciation for {text}: {actual} != {expected}')

def speech_key(text, speaker=10001):
    spoken = spoken_text(text)
    base = f'{speaker}|.90|.15|.2|{spoken}'
    if text in OVERRIDES:
        base += '|reviewed-reading-v1|' + OVERRIDES[text]['expectedKana']
    return hashlib.sha256(base.encode()).hexdigest()[:24]

def clip_fingerprint(clip):
    used = {text: OVERRIDES[text] for scene in clip['scenes']
            for part in scene['narration'].split('。') if part
            for text in [part+'。'] if text in OVERRIDES}
    if not used:
        return None
    return hashlib.sha256(json.dumps(used,ensure_ascii=False,sort_keys=True).encode()).hexdigest()
