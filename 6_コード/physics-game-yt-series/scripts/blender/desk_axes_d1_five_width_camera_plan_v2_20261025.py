"""D-1 fixed camera plan v2: exact existing phrase-time provenance.

The v1 camera definitions/easing stay intact. Only timing verification changes:
the actual syllable offset plus exact cue start is checked against g.T, with no
assertion against a rounded transcription-table time. Import is inert.
"""
import hashlib
import json
from pathlib import Path
import re
import runpy

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
FINAL = Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025')
V1 = W/'scripts/blender/desk_axes_d1_five_width_camera_plan_20261025.py'
V1_SHA = 'e1bcc172a7fc12c60db96dd9fc6f0140a9faa8841fac333221372476a603494c'
assert hashlib.sha256(V1.read_bytes()).hexdigest() == V1_SHA
_v1 = runpy.run_path(str(V1))
for _name in ('first_frame', 'smoothstep', 'interpolate', 'selected_frames',
              'boundary_frames', 'sample_frames', 'fit_sampled_cloud', 'pose_for', 'apply_pose'):
    globals()[_name] = _v1[_name]


def timing_evidence(g):
    data_file, phrase_file = FINAL/'blender/data.json', FINAL/'phrase-times.json'
    data = json.loads(data_file.read_text())
    phrases = json.loads(phrase_file.read_text())
    result = []
    for key, needle in (('nc:install', 'スエツケ'), ('can:heat', 'サカサ'), ('air:who', 'マワリノ')):
        cue = next(c for c in data['cues'] if c['key'] == key)
        live = g['CUE'][key]
        assert cue['start'] == live['start'] and cue['subtitle'] == live['subtitle']
        phrase = phrases[cue['subtitle']]
        assert phrase == g['PT'][live['subtitle']]
        normalized = g['d'].norm(needle)
        match = re.compile(re.sub('[ウオ]', '[ウオ]', normalized)).search(phrase['s'])
        assert match is not None
        position = match.start()
        relative = phrase['t'][position]
        absolute = cue['start'] + relative
        assert g['T'](key, needle) == absolute
        result.append(dict(key=key, needle=needle, cueStart=cue['start'], phraseIndex=position,
                           phraseRelativeTime=relative, absoluteTime=absolute,
                           firstActualFrame=first_frame(absolute),
                           cueDataFile=str(data_file), phraseTimeFile=str(phrase_file),
                           cueDataSha256=hashlib.sha256(data_file.read_bytes()).hexdigest(),
                           phraseTimeSha256=hashlib.sha256(phrase_file.read_bytes()).hexdigest(),
                           matchesExistingRuntimeTExactly=True, roundedWordTableNotUsed=True))
    return result


def definitions(g):
    timing_evidence(g)
    return _v1['definitions'](g)
