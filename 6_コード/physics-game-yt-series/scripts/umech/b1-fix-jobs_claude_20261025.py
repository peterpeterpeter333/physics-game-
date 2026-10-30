"""Claude 2026-10-25: B-1 local scene fixes -- per-frame camera plan and Blender job files (new file).

usage: python3 b1-fix-jobs_claude_20261025.py OUTROOT
Writes OUTROOT/plan.json (every changed output frame -> scene, pose, render key) and OUTROOT/job-<scene>.json.
Object states are the delivered ones (originalObjectSourceFrame of the delivered final5 cache); only cameras
(and, for the section, the added cross-section parts) change. Identical (state, pose) frames share one render.
"""
import json, math, sys
from pathlib import Path

SRC = Path('/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025')
BLEND_CACHE = '/private/tmp/ys/ys-chain-b1v1-claude-blender-20261025'
OUT = Path(sys.argv[1])
R = json.load(open(SRC/'composite-provenance.json'))['records']
P = json.load(open(SRC/'blender/delivered-camera-poses.json'))['poses']


def sm(x):
    x = max(0., min(1., x)); return x*x*(3-2*x)


def lerp(a, b, u):
    return [x+(y-x)*u for x, y in zip(a, b)]


PG = [-.035, -.01, .035, .42, 75, 35, 40]        # rows 9-11: magnet, garlic and nails (Gilbert half at the edge)
PP = [-.035, .06, .035, .38, 50, 28, 40]         # rows 12-13: the two bar magnets and Mio's hand
PW = [0, .1, .12, .58, 0, 15, 40]                # rows 22-23: terrella and the iron-powder lines
PS = [.297, .12, .197, .60, 0, 10, 40]           # rows 26, 28, 36-37: frontal earth cross-section (elevation 10)
PB = json.loads(sys.argv[2]) if len(sys.argv) > 2 else [-.05, .28, .06, 1.3, 0, 45, 40]   # row 35: book + score board
ROW21 = [0, .1, .12, .429, 0, 15, 40]
LINE_AT = [(222.13, .6), (229.27, .6), (234.40, .9)]
GARLIC_T = [(68.0, 71.2), (81.0, 81.95), (97.0, 98.7)]   # time-dependent object actions (B6 garlic, retire, B5 stages)

plan = {}


def add(j, scene, pose, key):
    plan[j] = dict(frame=j, scene=scene, pose=[round(v, 7) for v in pose], key=json.dumps(key))


for j in range(1817, 2971):
    if j < 1847:
        pose = PG[:]; pose[3] *= 1+.04*(1-sm((j-1817)/30))
    elif 2433 <= j < 2463:
        pose = lerp(PG, PP, sm((j-2433)/30))
    elif j >= 2463:
        pose = PP
    else:
        pose = PG
    t = j/30; ref = R[j]['originalObjectSourceFrame']
    tdep = any(a <= t <= b for a, b in GARLIC_T)
    add(j, 'garlic', pose, ['garlic', j if tdep else ref, pose])
for j in range(4825, 5663):
    pose = lerp(ROW21, PW, sm((j-4825)/30)) if j < 4855 else PW
    add(j, 'powder', pose, ['powder', R[j]['originalObjectSourceFrame'], pose])
for a, b in [(6519, 7070), (7576, 7823), (9614, 9980)]:
    for j in range(a, b+1):
        pose = PS[:]
        if j < a+30:
            pose[3] *= 1+.08*(1-sm((j-a)/30))
        t = j/30
        phase = [round(max(0, min(1, (t-at)/du))*40) for at, du in LINE_AT]
        add(j, 'section', pose, ['section', R[j]['originalObjectSourceFrame'], pose, phase])
for j in range(9428, 9614):
    add(j, 'book', PB, ['book', R[j]['originalObjectSourceFrame'], PB])
# Under Mio's opaque full face and its fade-out (rows 29 -> 30): show the delivered row-30 opening picture
# (the whole globe at the delivered pose) instead of the old plain disc.
for j in range(7824, 8058):
    plan[j] = dict(frame=j, scene='hold8058', pose=P[8058], key='hold8058')

OUT.mkdir(parents=True, exist_ok=True)
reps = {}
for j in sorted(plan):
    p = plan[j]
    if p['scene'] == 'hold8058':
        p['raw'] = str((SRC/'blender/desk/08058.jpg').resolve()); continue
    rep = reps.setdefault(p['key'], j)
    p['raw'] = str(OUT/'raw'/p['scene']/('%05d.jpg' % rep)); p['rep'] = rep
json.dump({'frames': [plan[j] for j in sorted(plan)]}, open(OUT/'plan.json', 'w'))
for scene in ['garlic', 'powder', 'section', 'book']:
    frames = []
    for j in sorted(plan):
        p = plan[j]
        if p['scene'] == scene and p['rep'] == j:
            frames.append(dict(frame=j, ref=R[j]['originalObjectSourceFrame'], scene=scene, pose=p['pose'], out=p['raw']))
    json.dump(dict(cache=BLEND_CACHE, frames=frames, projections=str(OUT/('proj-%s.json' % scene))), open(OUT/('job-%s.json' % scene), 'w'))
    print(scene, 'outputs', sum(1 for p in plan.values() if p['scene'] == scene), 'renders', len(frames))
print('changed outputs', len(plan))
