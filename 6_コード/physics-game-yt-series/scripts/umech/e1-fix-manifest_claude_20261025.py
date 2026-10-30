#!/usr/bin/env python3
"""E-1 fix by Claude (2026-10-25). Build the composition manifest from the
Blender fix renders (fix-record.json per output dir) and the original
render/dup plan. Usage: e1-fix-manifest_claude_20261025.py frameplan.json out.json RENDER_DIR..."""
import json, sys, os, math

plan_path, out_path, *dirs = sys.argv[1:]
plan = json.load(open(plan_path))
FINAL = '/private/tmp/ys/ys-chain-e1v1-final2-meaningful-motion-20261025'
rec = {}
for d in dirs:
    r = json.load(open(d + '/fix-record.json'))
    for k, v in r['frames'].items():
        p = d + '/%05d.jpg' % int(k)
        if os.path.isfile(p):
            rec[int(k)] = (p, v)
frames, missing = [], []
src_of = {}
for blk, p in plan.items():
    for j in p['render']:
        if j > 11604: continue
        if j not in rec: missing.append(j); continue
        src_of[j] = j
    for j, k in p['dup'].items():
        j, k = int(j), int(k)
        if j > 11604: continue
        src_of[j] = k
for j in sorted(src_of):
    k = src_of[j]
    if k not in rec: missing.append(j); continue
    frames.append({'frame': j, 'raw': rec[k][0], 'anchorProjections': rec[k][1]['anchors']})
assert not missing, ('missing renders', missing[:20], len(missing))

data = json.load(open(FINAL + '/blender/data.json'))
cue = {c['key']: c for c in data['cues']}
def T(key, word, occ=0): return [w['time'] for w in cue[key]['wordEvents'] if word in w['word']][occ]
sm = lambda x: (lambda y: y*y*(3-2*y))(max(0., min(1., x)))
towns = {'times': {'east16': T('lon:east', '先に昼'), 'west16': T('lon:east', '遅れて昼'), 'labels': cue['lon:torch']['start'] + 1.1},
         'dx16': {'east': 0, 'west': -80}, 'frames': {}}
cross = {}
for j in sorted(src_of):
    k = src_of[j]; tw = rec[k][1].get('towns') or {}
    for name, v in tw.items():
        if v['noon'] and name not in cross: cross[name] = j / 30
for j in sorted(src_of):
    k = src_of[j]; tw = rec[k][1].get('towns') or {}
    if not tw: continue
    row = {}
    for name, v in tw.items():
        fade = sm((v['facing'] - .05) / .25)
        row[name] = {'top': v['top'], 'vis': fade > .003, 'fade': fade, 'noon': v['noon'], 'cross': cross.get(name, 1e9)}
    towns['frames'][str(j)] = row
json.dump({'sourceCache': FINAL, 'frames': frames, 'towns': towns}, open(out_path, 'w'))
print(json.dumps({'frames': len(frames), 'townFrames': len(towns['frames']), 'cross': cross}))
