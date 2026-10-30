"""Merge {subtitle: accent-kana} maps into a manuscript's D(...) cues (adds or replaces kana:"...").
Usage: python3 scripts/umech/merge-kana.py <manuscript.mjs> <map.json>..."""
import json, re, sys
path, maps = sys.argv[1], sys.argv[2:]
src = open(path).read(); kmap = {}
for m in maps: kmap.update(json.load(open(m)))
done = 0
for sub, kana in kmap.items():
    i = src.find("D(" + json.dumps(sub, ensure_ascii=False).replace('"', "'"))
    if i < 0: print('not found:', sub[:40]); continue
    j = src.index("{", src.index("'mx", i))          # the extras object after the diagram key
    k = src.index("}", j)
    body = re.sub(r'kana:"[^"]*",?', '', src[j + 1:k])
    src = src[:j + 1] + 'kana:' + json.dumps(kana, ensure_ascii=False) + (',' if body.strip() else '') + body + src[k:]
    done += 1
open(path, 'w').write(src); print(f'merged {done}/{len(kmap)}')
