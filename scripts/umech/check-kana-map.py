"""Check a {subtitle: accent-kana} map against the plan's readings (sounds must match).
Usage: python3 scripts/umech/check-kana-map.py /private/tmp/X/plan.json map.json
Prints every mismatch with the automatic reference; exit 1 if any."""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from prosody import query, kana_phrases, signature, to_aquestalk, word_reading
plan = json.load(open(sys.argv[1])); kmap = json.load(open(sys.argv[2])); bad = 0; seen = 0
subs = {q['subtitle']: q for c in plan for s in c['scenes'] for q in s['cues']}
for sub, kana in kmap.items():
    q = subs.get(sub)
    if not q: print(f'[UNKNOWN SUBTITLE] {sub}'); bad += 1; continue
    seen += 1
    ref = query(word_reading(q['reading']))['accent_phrases']
    try: ph = kana_phrases(kana)
    except Exception as e: print(f'[KANA SYNTAX] {sub}\n  {kana}\n  {e}'); bad += 1; continue
    if signature(ph) != signature(ref):
        bad += 1; print(f'[KANA≠READING] {sub}\n  kana {kana}\n  auto {to_aquestalk(ref)}')
print(f'{seen} checked, {bad} problems'); sys.exit(1 if bad else 0)
