#!/usr/bin/env python3
"""E-1 fix by Claude (2026-10-25). Build a NEW validation cache for the gate:
every 3D raw frame (fixed frames -> Claude renders, others -> delivered raw),
patched anchors, the town layer data, and camera-motion.json recomputed from the
delivered poses with the fixed frames' actual poses. Nothing existing is edited.
Usage: e1-fix-validation-cache_claude_20261025.py manifest.json compose_cache NEW_VALIDATION_CACHE"""
import json, os, sys, shutil

man_path, compose, out = sys.argv[1:]
FINAL = '/private/tmp/ys/ys-chain-e1v1-final2-meaningful-motion-20261025'
VAL = FINAL + '/validation-final-v1'
assert not os.path.exists(out)
man = json.load(open(man_path))
os.makedirs(out + '/blender/desk')
for name in ['plan.json', 'ys-chain-e1v1.json', 'phrase-times.json', 'ys-chain-e1v1.voice.wav', 'ys-chain-e1v1.wav']:
    os.symlink(os.path.realpath(VAL + '/' + name), out + '/' + name)
shutil.copytree(VAL + '/verify', out + '/verify', symlinks=True)   # audio/caption-only qx-verify report (audio unchanged)
for name in ['data.json', 'tex']:
    os.symlink(FINAL + '/blender/' + name, out + '/blender/' + name)
raw = {r['frame']: r['raw'] for r in man['frames']}
for j in range(11606):
    src = raw.get(j, FINAL + '/blender/desk/%05d.jpg' % j)
    os.symlink(os.path.realpath(src), out + '/blender/desk/%05d.jpg' % j)
shutil.copyfile(compose + '/blender/desk/anchors.json', out + '/blender/desk/anchors.json')
shutil.copyfile(compose + '/claude-fix-towns.json', out + '/claude-fix-towns.json')
poses = json.load(open(FINAL + '/blender/delivered-camera-poses.json'))['poses']
recs = {}
for d in sorted({os.path.dirname(p) for p in raw.values()}):
    for k, v in json.load(open(d + '/fix-record.json'))['frames'].items(): recs[(d, int(k))] = v['pose']
for r in man['frames']:
    d = os.path.dirname(r['raw']); k = int(os.path.basename(r['raw'])[:5])
    poses[r['frame']] = recs[(d, k)]
mv = [False] + [any(abs(a-b) > 1e-9 for a, b in zip(poses[j], poses[j-1])) for j in range(1, len(poses))]
cm = {'frames': len(poses), 'moving_frames': sum(mv), 'moving_ratio': sum(mv)/len(poses),
      'top_ratio': sum(p[5] >= 65 for p in poses)/len(poses),
      'method': 'Delivered final poses with the Claude-fixed frames replaced by their actual render poses; hard cuts count as motion.'}
json.dump(cm, open(out + '/blender/camera-motion.json', 'w'), indent=1)
json.dump({'poses': poses, 'fps': 30, 'frames': len(poses)}, open(out + '/blender/delivered-camera-poses.json', 'w'))
print(json.dumps(cm))
