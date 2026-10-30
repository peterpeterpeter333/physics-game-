"""prosody.py（変えていない）の確かめを、cue の話す人の声（speaker）で行う写し。
技術の疑問の鎖 1-1 第4版（ys-chain-1-1v4）で、女声（ミオ、10005）の cue も kana の音が reading と同じかを確かめるために作った。
prosody.py の関数（to_aquestalk・signature・post）をそのまま読み込み、speaker だけを cue ごとに替える。
Usage: python3 scripts/umech/prosody-speaker.py <plan.json>   → 終了コード 0（全 cue の kana が reading と同じ音）
"""
import json, sys, os, importlib.util
from pathlib import Path
_spec = importlib.util.spec_from_file_location('prosody', str(Path(__file__).with_name('prosody.py')))
P = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(P)
plan = json.load(open(sys.argv[1])); bad = 0; n = {}
for c in plan:
    for s in c['scenes']:
        for q, u in zip(s['cues'], s['utterances']):
            spk = int(u.get('speaker') or 10001); n[spk] = n.get(spk, 0) + 1
            ref = P.post('/audio_query', {'text': P.word_reading(q['reading']), 'speaker': spk})['accent_phrases']
            if not q.get('kana'): bad += 1; print(f"[NO KANA] {q['subtitle']}"); continue
            ph = P.post('/accent_phrases', {'text': q['kana'], 'speaker': spk, 'is_kana': 'true'})
            if P.signature(ph) != P.signature(ref):
                bad += 1; print(f"[KANA≠READING speaker {spk}] {q['subtitle']}\n  kana   {q['kana']}\n  auto   {P.to_aquestalk(ref)}")
print('cue の数（声ごと）:', n, '／ 合わない:', bad)
sys.exit(1 if bad else 0)
