"""Phrasing/accent review for Nemo narration.

For every sentence, print the best automatic prosody as AquesTalk-style kana
(phrases split by '/', accent after the mora marked with ', pauses as '、',
devoiced morae prefixed by '_'). A cue may then carry `kana` with a corrected
version; render-em-film-audio.py uses it, but only if its sounds are exactly the
furigana reading's sounds (checked here and again at synthesis time).

Usage: python3 scripts/umech/prosody.py /private/tmp/X/plan.json [--all]
  default: print sentences that have no `kana` yet; --all: print every sentence.
"""
import json, re, sys, os, urllib.request, urllib.parse
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from narration_pronunciation import word_reading, spoken_text
from narration_fluency import mora_signature

URL = os.environ.get('NEMO_URL', 'http://127.0.0.1:50123')
def post(path, params, body=None):
    req = urllib.request.Request(URL + path + '?' + urllib.parse.urlencode(params), data=json.dumps(body).encode() if body is not None else b'', headers={'Content-Type': 'application/json'}, method='POST')
    return json.loads(urllib.request.urlopen(req, timeout=120).read())
def query(text): return post('/audio_query', {'text': text, 'speaker': 10001})
def kana_phrases(kana): return post('/accent_phrases', {'text': kana, 'speaker': 10001, 'is_kana': 'true'})

def to_aquestalk(phrases):
    out = []
    for p in phrases:
        s = ''
        for i, m in enumerate(p['moras'], 1):
            s += ('_' if m['vowel'] in 'AIUEO' else '') + m['text'] + ("'" if i == p['accent'] else '')
        out.append(s + ('、' if p.get('pause_mora') else '/'))
    return ''.join(out).rstrip('/、')

def signature(phrases): return mora_signature({'accent_phrases': phrases})

def best(reading, subtitle):
    """Prefer the kanji sentence's own phrasing when its sounds equal the furigana."""
    ref = query(word_reading(reading))['accent_phrases']
    for label, cand in (('kanji', lambda: query(spoken_text(subtitle))['accent_phrases']),
                        ('compact-kana', lambda: query(re.sub(r'\s+', '', word_reading(reading)))['accent_phrases'])):
        ph = cand()
        if signature(ph) == signature(ref): return label, ph, ref
    return 'spaced-kana', ref, ref

if __name__ == '__main__':
    plan = json.load(open(sys.argv[1])); show_all = '--all' in sys.argv; bad = 0
    for c in plan:
        for s in c['scenes']:
            for q in s['cues']:
                ref = query(word_reading(q['reading']))['accent_phrases']
                if q.get('kana'):
                    ph = kana_phrases(q['kana'])
                    ok = signature(ph) == signature(ref)
                    if not ok:
                        bad += 1; print(f"[KANA≠READING] {q['subtitle']}\n  kana   {q['kana']}\n  auto   {to_aquestalk(ref)}")
                    elif show_all: print(f"[kana] {q['subtitle']}\n  {q['kana']}")
                    continue
                label, ph, _ = best(q['reading'], q['subtitle'])
                print(f"[{label}] {q['subtitle']}\n  {to_aquestalk(ph)}")
    sys.exit(1 if bad else 0)
