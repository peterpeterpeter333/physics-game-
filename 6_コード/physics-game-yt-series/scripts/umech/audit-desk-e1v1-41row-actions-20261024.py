"""Read-only source/time audit of every E-1 individual §7 row.

This is not final-MP4 approval, bpy evaluation, sound listening, or a replacement
for the original image inspector. Only a new evidence JSON is produced.
"""
import ast
import hashlib
import json
import math
from pathlib import Path

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-e1v1')
HANDOFF = Path('/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22')
OUT = C/'e1v1-41row-action-source-audit-20261024.json'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


REVIEW = {
 1: ('implemented-with-explicit-lighting-deviation', 'map_state/hands/light', '7 ships translate together (.04,.025) with smoothstep0..1.5; Kai follows then exits slowly. Dim .68 reference light, not the individually requested blue tint. No bounce/impact/extra accident laugh.'),
 2: ('actual-preview-prop-clipping', 'map_state', 'Hat appears at supplied10.06s, descends .045m smoothly over .8s. Frozen hat x−.29 and unchanged map camera leave its left side clipped in actual r9 14s preview.'),
 3: ('implemented-source', 'map_state/overlay', 'Dashed white thought ring and anchored literal label start at19.62s 話し合い.'),
 4: ('implemented-source', 'map_state/overlay', 'Solid red ring starts25.67s 本当の位置; yellow offset arrow scales over .8s. Rock cluster and Scilly anchor exist.'),
 5: ('implemented-source', 'map_state/mix', 'Only first4 including flagship tilt X20° over34.62..35.82, opacity1→.5 over35.82..36.32. No sinking, break, splash, fall or bounce. Low bell35.07; no score flourish.'),
 6: ('implemented-source', 'map_state/canonical face', 'Quiet previous scene retained; supplied small serious-expression equivalent belongs to unchanged face system.'),
 7: ('implemented-source', 'globe_state/overlay', 'Latitude cyan emission51.71; longitude orange54.13; literal color-coded labels. Globe axis vertical, no cutaway.'),
 8: ('implemented-source', 'grid/overlay', '6 rows/8 columns modeled; cyan1..6 at57.46, orange1..8 at58.71, using exact projected grid anchors.'),
 9: ('implemented-source', 'latitude_state', 'Radial .03 observer, polar ornament and parallel +Z dotted sightline from66.60. Never treat finite nearby glyph as true stellar endpoint.'),
10: ('implemented-source', 'latitude_state/overlay', 'Equator0°, pole90° over73.55..74.15; resets0 at lat:step, then steps10/20/30 from79.89 at .4s spacing, .25s eased transitions. Tangent horizon math gives altitude=latitude.'),
11: ('implemented-source', 'latitude_state/overlay', '50° latitude settles87.45..88.25; yellow50° and score1−1 at89.23.'),
12: ('implemented-source', 'canonical face', 'Unchanged supplied full-frame face; no new physical action prescribed.'),
13: ('implemented-source-with-recorded-camera-deviation', 'globe_state/southern/overlay', 'Both50°N dolls rotate west→east with parallel fixed southern-star direction (0,−1,0); transit altitudes40° occur at different phases. Polar ornament hidden. 9:00/10:00 labels and star-specific15° camera recorded previously (nominal30° differs).'),
14: ('confirmed-direction-mismatch', 'globe_state', 'Source assigns globe.rot.z=+ang but dial.hand.z=−ang, whereas N5 explicitly requires the hand to rotate with the globe. 24h revolution113.38..115.38 and15° wedge120.35 otherwise implemented.'),
15: ('implemented-source-plus-approved-local-fit-pending', 'globe_state/hands', 'Torch click/hand126.64; world-fixed noon meridian at−90°, day/night shader fixed worldX; positive90° rotation128.58..132.97. East28° crosses before west−28°. Entry real width/clip is already queued local-fit2, not waived.'),
16: ('implemented-source', 'globe_state/overlay', 'Same torch/noon/towns retained; exact text East first140.07 and West later142.45. Town sun symbols appear in true crossing order.'),
17: ('implemented-source', 'clocks/overlay', 'Two clocks at .30/.42; Tokyo red rim, London black hands. Initial11/2 still differ9h; literal9h at149.16. 12/3 only during row18.'),
18: ('implemented-and-selected-old-preview-visible', 'clocks/bed/overlay', 'Tokyo12 from151.21, London3 from153.64; sleeping sailor/bed on London and Zzz. Actual r9 156.8s shows both full readable clocks and sleeping body. No ear claim.'),
19: ('implemented-source', 'arcs/overlay', '0° London white /135°E Akashi red pins, yellow arc grows .8s from160.29. Exact9×15=135 and London0 labels.'),
20: ('implemented-source', 'canonical face', 'Unchanged supplied full-frame insight face; no new physical action prescribed.'),
21: ('implemented-source', 'ship_state', 'Sun rises along circular arc181.22..182.42 and stops high; .65 homothety around deck observer preserves altitude. Transient vertical noon line .7s.'),
22: ('implemented-source', 'ship_state/overlay', 'Clock fades in190.37..191.02;13:00 rotates193.47..193.92; small globe and west15° arc appear198.39. Correct ship noon vs London13 gives west15.'),
23: ('minor-continuity-deviation', 'ship_state', 'Ship, sun and13:00 clock retained, supplied small face. Miniature globe/arcs are visible only row22 in source; disappear during row23 despite Same scene in §7. Old actual203s confirms absent small globe, no explanatory reversal.'),
24: ('implemented-source', 'ship_state/minutes/overlay', 'Close-up13:00 clock; 4-minute24° sector and5ticks at211.83, literal60÷15=4→1°.'),
25: ('implemented-source', 'globe_state/convergence/data', 'Equator white circle216.26, yellow1° band220.79. Band moves0→50° at225.23..226.44, actual surface math scales cos(latitude);71.42km asserts as about70.'),
26: ('implemented-source', 'apply_state/shift', 'Separate ship mark and .16world yellow map arrow grow .8s from235.93; source explicit map scale represents70km. No original thought/truth marks during this arrow shot.'),
27: ('implemented-source', 'canonical face', 'Unchanged supplied full-frame surprise; no extra physical action prescribed.'),
28: ('implemented-source', 'ship_state/overlay', 'Sailor on deck and complete compass beside it; red/white needle emission249.48. Literal speed×time and compass direction labels.'),
29: ('implemented-source-and-selected-old-preview-visible', 'ship_state/log/overlay', 'Rope extends255.75..261.31, knots travel .08m/s at .04 spacing =.5s; display1..5 from259.31. Hourglass upper shrinks/lower grows256.96..261.31 then stable. Old actual260s shows ship/stern/spool/knots/whole hourglass/compass; no literal rendered MP4 claim.'),
30: ('implemented-source', 'apply_state/drift', '3 blue current arrows265.65;5 dashed-white/solid-red daily segments separate at268.24+.4i, each day red marker. No actual afloat motion is added to dead reckoning schematic.'),
31: ('implemented-source', 'apply_state/map_state', 'Fog grows .12→.6 from273.49 over.6, polar ornament fades/hides; thought/truth/offset emission pulse285.46..287.06. Old fog flow moves .01m/s.'),
32: ('implemented-source', 'apply_state/canonical view', 'Same fog/map/marks/drift retained while unchanged checking-side view label persists.'),
33: ('implemented-source', 'apply_state/pendulum', 'Pendulum case drops .10→0 over297.65..298.25; regular Y .18sin(2πt) exactly1Hz. Literal hypothesis card at word.'),
34: ('implemented-source', 'apply_state/overlay', 'Regular desk pendulum retained; if/prediction paper cards add without removing prior hypothesis.'),
35: ('implemented-source', 'ship_state/overlay/mix', 'Clock on ship; both hull and case ±10° aroundX at1.3s. Pendulum varying amplitude/phase plusX/Z twist; clock hand accelerated/retarded. Irregular click only laugh slot. Old selected previews were seen previously, final actual pending.'),
36: ('confirmed-stop-incomplete', 'ship_state', 'Y amplitude decays to0 at326.43..327.43 but X=.12sin(4phase) and Z=.12sin(3phase) never decay. Full-frame supplied face hides body after326.43; this does not prove physical stop and is not a source-action PASS.'),
37: ('implemented-with-early-presence-caveat', 'apply_state/hands/prize', 'Open leather pouch and visible mouth coins;2coins spill336.75/336.87 onward, rotate/translate. Pouch and holding hand already visible from329.14; only last12mm settle336.25..336.85 matchesword, so not a fresh appearance at 大きな賞金.'),
38: ('implemented-source', 'prize/overlay', 'Same pouch and settled coins; exact4min→1°,2min→.5° text and supplied small face.'),
39: ('implemented-source', 'ship_state/ghost/overlay', 'Boat keeps ±10°/1.3s sway; ghost pocket-watch root remains world-horizontal, .4alpha with original questionmark anchor. No hidden clock answer exposed.'),
40: ('implemented-source', 'ship_state/canonical problem', 'Sun at highest, London fixed10:00, no east30 answer in film. Independently callable challenge/answer use ship+sun+10clock+smallglobe; east30 appears only answer state.'),
41: ('implemented-source-with-instruction-conflict-recorded', 'map_state/hands', 'Same original chart pose, only surviving3 ships at their original final positions; thought/real marks and edge London clock placed quietly382.58..383.48. Thin .30 fog follows explicit §7 same-thin-fog shot; N1 separately says fog0, an internal instruction conflict not silently claimed both satisfied.')}


def main():
    assert not OUT.exists()
    data = json.loads((C/'blender/data.json').read_text())
    source = W/'scripts/blender/desk_e1v1.py'
    freeze = json.loads((C/'e1v1-r9-source-freeze.json').read_text())
    assert all(sha(W/p) == h for p, h in freeze['files'].items())
    assert set(REVIEW) == set(range(1, 42))
    rows = []
    for row, (status, handlers, evidence) in REVIEW.items():
        cc = [c for c in data['cues'] if c['row'] == row]
        assert cc
        rows.append({'row': row, 'cueKeys': [c['key'] for c in cc], 'firstTime': cc[0]['start'], 'lastTime': cc[-1]['end'],
                     'status': status, 'sourceHandlers': handlers.split('/'), 'evidence': evidence,
                     'exactWordEvents': {c['key']: c['wordEvents'] for c in cc},
                     'individualInstruction': {'objects': cc[0]['objects'], 'camera': cc[0]['cameraInstruction'],
                                               'action': cc[0]['action'], 'labels': cc[0]['labels']},
                     'finalEncodedMp4Verified': False})
    ast_source = ast.parse(source.read_text())
    functions = {n.name: {'start': n.lineno, 'end': n.end_lineno} for n in ast_source.body if isinstance(n, ast.FunctionDef)}
    event = lambda key, word: next(w['time'] for c in data['cues'] if c['key'] == key for w in c['wordEvents'] if word in w['word'])
    stop = event('pen:judge', '負けた') + 1
    wave = event('pen:sway', '波')
    residual = [{'time': t, 'rotationXYZ': [.12*math.sin((t-wave)*4), 0., .12*math.sin((t-wave)*3)]}
                for t in [stop, 327.5, 328.0, 328.5]]
    assert any(abs(v) > .01 for r in residual for v in (r['rotationXYZ'][0], r['rotationXYZ'][2]))
    files = [(14.,'Hat left clipping actually viewed'), (156.8,'Both readable clocks and bed actually viewed'),
             (203.,'Miniature globe absent in row23 actually viewed'), (260.,'Log/hg/compass actually viewed'),
             (327.,'Original full-frame face actually viewed; does not reveal pendulum stop')]
    viewed = []
    for t, note in files:
        file = C/'review-e1v1-r9-allcue'/('e1v1-%05d.jpg' % round(t*30))
        viewed.append({'time': t, 'file': str(file), 'sha256': sha(file), 'actuallyViewed': True,
                       'kind': 'old r9 exact 2D-composited preview, NOT completed production MP4', 'observation': note})
    protected = [source,W/'scripts/blender/desk_lib_e1.py',W/'scripts/umech/desk-e1v1-overlay.mjs',
                 W/'scripts/umech/desk-e1v1-data.mjs',W/'scripts/umech/mix-chain-desk-audio-e1v1.py',
                 W/'docs/video-revision-20260924/deep/E-1_cue時刻一覧.md',
                 HANDOFF/'07_軸の1本目_共通の制作指示.md',HANDOFF/'E-1/E-1_制作指示書.md']
    result = {'id': 'ys-chain-e1v1', 'kind': 'All41 §7 rows frozen source/action/timing audit, no renderer invoked',
              'reviewedEveryRow': True, 'rows': rows, 'functionSourceLines': functions,
              'confirmedRepairCandidates': [
                  {'id': 'E-action-1', 'row': 14, 'reason': '24h dial hand reverses globe direction', 'sourceLine': 273},
                  {'id': 'E-action-2', 'row': 36, 'reason': 'Pendulum X/Z never decay, Y alone stops', 'sourceLine': 331,
                   'nonzeroResidualPureFormula': residual, 'notClaimedVisibleThroughApprovedFullFace': True},
                  {'id': 'E-action-3', 'row': 2, 'reason': 'Hat left clipping visible in actual old14s preview', 'noNewRenderClaimed': True}],
              'lowerPriorityJudgmentsRequired': [23, 1, 37],
              'instructionConflictsNotSilentlyResolved': [{'row': 41, 'details': '§7 says original thin fog, N1 says clear to0; existing source chooses same thin .30.'}],
              'alreadyPlannedGeometryRepairs': {'rows': [14,15], 'helper': 'scripts/blender/desk_axes_e1_local_fit_20261024.py',
                                                'actualProbeAndFinalProductionPending': True},
              'selectedOldPreviewActuallyViewed': viewed, 'inputSha256': {str(p): sha(p) for p in protected},
              'sourceFilesEdited': False, 'bpyImported': False, 'renderCalls': 0,
              'originalGateNGRetained': True, 'earListeningPerformed': False, 'actualFinalAcceptance': False}
    with OUT.open('x') as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(OUT)


if __name__ == '__main__':
    main()
