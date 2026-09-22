"""Reviewed sentence-level pronunciations; displayed Japanese is never rewritten."""
import hashlib
import json
from pathlib import Path

OVERRIDES = json.loads(Path(__file__).with_name('narration-pronunciation.json').read_text())

def spoken_text(text):
    return OVERRIDES.get(text, {}).get('spoken',
        text.replace('電場','でんば').replace('磁場','じば').replace('電気束','でんきそく'))

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
