"""Pure E action schedule/probe audit; no bpy and no geometry acceptance."""
import ast
from collections import Counter
import hashlib
import json
from pathlib import Path
import runpy

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-e1v1')
OUT = C/'e1v1-actions-schedule-20261024.json'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not OUT.exists()
    helper = W/'scripts/blender/desk_axes_e1_actions_final_20261024.py'
    h = runpy.run_path(str(helper))
    receipt = json.loads((C/'e1v1-final-plan-receipt-20261024.json').read_text())
    cues = json.loads((C/'blender/data.json').read_text())['cues']
    event = lambda key, word: next(w['time'] for c in cues if c['key'] == key for w in c['wordEvents'] if word in w['word'])
    a, b = event('lon:spin', '24時間'), event('pen:judge', '負けた')
    plans, refs = receipt['plans'], receipt['originalObjectSourceFrames']
    selected = [j for j in range(11606) if h['selected_action'](cues, j/30, a, b)]
    definitions = ast.parse((W/'scripts/blender/desk_lib.py').read_text())
    nodes = [n for n in definitions.body if isinstance(n, ast.FunctionDef) and n.name in ('clamp', 'sm', 'seg')]
    g = {}
    exec(compile(ast.Module(body=nodes, type_ignores=[]), 'shared-pure-ease-readonly', 'exec'), g)
    signatures, mapping, sources = {}, {}, {}
    for j in selected:
        t = j/30
        action = h['selected_action'](cues, t, a, b)
        stage = (g['seg'](t, a, a+2),) if action == 'dial-follows-globe' else (1-g['seg'](t, b, b+1),) if action == 'complete-pendulum-stop' else ()
        signature = (refs[j], action, stage)
        k = signatures.setdefault(signature, j)
        mapping[j], sources[k] = k, refs[j]
    probes = []
    for t in h['PROBES']:
        j = round(t*30)
        assert j in mapping
        probes.append({'requestedTime': t, 'requestedFrame': j, 'actualSourceFrame': mapping[j],
                       'actualSourceTime': mapping[j]/30, 'exactRequestedIsActualSource': mapping[j] == j})
    all_actual = all(p['exactRequestedIsActualSource'] for p in probes)
    expected_local_ranges = set(range(3315, 3345)) | set(range(3735, 3765))
    assert set(selected).isdisjoint(expected_local_ranges)
    assert all(h['current'](cues, j/30)['key'] == h['current'](cues, refs[j]/30)['key'] for j in selected)
    result = {'id': 'ys-chain-e1v1', 'kind': 'Frozen schedule-only audit, not Blender/render/geometry result',
              'helper': str(helper), 'helperSha256': sha(helper), 'outputFrames': len(selected),
              'actualSourcesBeforeAnyExtraCameraUniqueness': len(sources),
              'actions': dict(Counter(h['selected_action'](cues, j/30, a, b) for j in selected)),
              'probes': probes, 'allRequestedProbesAreActualSources': all_actual,
              'local2MovingIntervalsDisjoint': True, 'allHeldOtherObjectReferencesSameCue': True,
              'stopFormulaExactlyZeroAtOrAfterOneSecond': all(1-g['seg'](t, b, b+1) == 0 for t in (b+1, b+1.5, b+2)),
              'allPhysicalWidthsClipsHatFitStillUnconfirmed': True, 'bpyImported': False, 'renderCalls': 0}
    with OUT.open('x') as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(json.dumps(result, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
