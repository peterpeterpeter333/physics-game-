"""Verify every university-mechanics reading against the Nemo engine.

1) The spaced kana reading we send must come back from Nemo as exactly the same
   sounds (catches particle misparses such as へいほう → エ/イホオ).
2) Nemo's own reading of the kanji subtitle is compared with our reading; every
   difference is listed so a person can confirm the furigana is right.
Usage: python3 scripts/umech/check-readings.py /private/tmp/X/plan.json [--diff]
"""
import json, sys, re, urllib.request, urllib.parse, difflib, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from narration_pronunciation import word_reading, spoken_text

URL = os.environ.get('NEMO_URL', 'http://127.0.0.1:50123')
def query(text):
    req = urllib.request.Request(URL + '/audio_query?' + urllib.parse.urlencode({'text': text, 'speaker': 10001}), data=b'', method='POST')
    return json.loads(urllib.request.urlopen(req, timeout=120).read())

def kata(s): return ''.join(chr(ord(c) + 0x60) if 'ぁ' <= c <= 'ゖ' else c for c in s)
V = {}
for row, v in [('アカサタナハマヤラワガザダバパァャヮ', 'a'), ('イキシチニヒミリギジヂビピィ', 'i'), ('ウクスツヌフムユルグズヅブプゥュヴ', 'u'), ('エケセテネヘメレゲゼデベペェ', 'e'), ('オコソトノホモヨロヲゴゾドボポォョ', 'o')]:
    for c in row: V[c] = v
VK = {'a': 'ア', 'i': 'イ', 'u': 'ウ', 'e': 'エ', 'o': 'オ'}
def norm(s):
    out = []; last = None
    for c in s:
        c = {'ヅ': 'ズ', 'ヂ': 'ジ'}.get(c, c)
        if c == 'ー' and last: c = VK[last]
        elif c == 'ウ' and last == 'o': c = 'オ'
        elif c == 'イ' and last == 'e': c = 'エ'
        if c in V: last = V[c]
        elif c in 'ッン': last = None
        out.append(c)
    return ''.join(out)

def expected(reading):
    """Our reading as katakana, with particles は/へ/を at the end of a phrase read as ワ/エ/オ."""
    r = word_reading(reading)
    r = re.sub(r'は(?=[\s、。？！」]|$)', 'わ', r)
    r = re.sub(r'へ(?=[\s、。？！」]|$)', 'え', r)
    r = r.replace('を', 'お')
    return norm(re.sub(r'[^ァ-ヴー]', '', kata(r)))

def engine(q): return norm(re.sub(r"[^ァ-ヴー]", '', ''.join(m['text'] for p in q['accent_phrases'] for m in p['moras'])))

plan = json.load(open(sys.argv[1])); show = '--diff' in sys.argv
bad = 0; total = 0; diffs = []
for c in plan:
    for s in c['scenes']:
        for u in s['utterances']:
            total += 1
            got = engine(query(word_reading(u['reading'])))
            want = expected(u['reading'])
            if got != want:
                bad += 1
                sm = difflib.SequenceMatcher(None, want, got)
                ops = [f"{want[a:b]}→{got[c2:d]}" for t, a, b, c2, d in sm.get_opcodes() if t != 'equal']
                print(f"[READING] {c['id']}: {u['subtitle']}\n    reading: {u['reading']}\n    mismatch: {' '.join(ops)}")
            if show:
                k = engine(query(spoken_text(u['subtitle'])))
                if k != want:
                    sm = difflib.SequenceMatcher(None, want, k)
                    ops = [f"{want[a:b] or '∅'}≠{k[c2:d] or '∅'}" for t, a, b, c2, d in sm.get_opcodes() if t != 'equal']
                    diffs.append(f"{c['id']}: {u['subtitle']}\n    ours≠kanji-engine: {'  '.join(ops)}")
print(f'\n{total} sentences, {bad} reading mismatches')
if show:
    print(f'\n--- {len(diffs)} sentences where Nemo would read the kanji differently (review our furigana) ---')
    print('\n'.join(diffs))
sys.exit(1 if bad else 0)
