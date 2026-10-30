"""prosody.py の確認を、cue ごとの話し手（speaker）の声で行う（掛け合いの動画用）。prosody.py は変えていない。

各 cue の kana を、その cue の話し手（utterance の speaker。無ければ 10001）で Nemo に読ませ、
読み（reading）の音と同じか（mora_signature）を確かめる。あわせて、kana の各句にアクセントの ' が1つずつあるかを見る。
女声の cue は、男声 10001 でも同じ確認をする（どちらの声でも読みが同じであること）。
Usage: python3 scripts/umech/prosody-dlg.py /private/tmp/X/plan.json   → 問題があれば終了コード 1
"""
import json, re, sys, os, urllib.request, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from prosody import post, to_aquestalk, signature, word_reading

def query(text, spk): return post('/audio_query', {'text': text, 'speaker': spk})
def kana_phrases(kana, spk): return post('/accent_phrases', {'text': kana, 'speaker': spk, 'is_kana': 'true'})

if __name__ == '__main__':
    plan = json.load(open(sys.argv[1])); bad = 0; n = 0; per = {}
    for c in plan:
        for s in c['scenes']:
            for q, u in zip(s['cues'], s['utterances']):
                spk = int(u.get('speaker') or 10001); n += 1; per[spk] = per.get(spk, 0) + 1
                k = q.get('kana')
                if not k: bad += 1; print(f"[NO KANA] {q['subtitle']}"); continue
                for ph in re.split(r'[/、]', k.rstrip('？')):
                    if ph.count("'") != 1: bad += 1; print(f"[ACCENT] 句に ' が {ph.count(chr(39))} 個：{ph}  ／ {q['subtitle']}")
                for v in sorted({spk, 10001}):
                    ref = query(word_reading(q['reading']), v)['accent_phrases']
                    ph = kana_phrases(k, v)
                    if signature(ph) != signature(ref):
                        bad += 1; print(f"[KANA≠READING speaker {v}] {q['subtitle']}\n  kana {k}\n  auto {to_aquestalk(ref)}")
    print(f'{n} cue（話し手 ' + '、'.join(f'{k}: {v}' for k, v in sorted(per.items())) + f'）、問題 {bad}')
    sys.exit(1 if bad else 0)
