"""NEW bounded, visible shipboard pendulum after actualv6 probe9534 NG.

Root-only execution. Frozen models/clock hands/ship/waves/camera/Japanese,
audio and captions remain unchanged. Only the existing pendulum pivot's
angles change throughout the actual shipboard cue interval, plus the already
approved quiet opening hand. No source/runtime rebind or new geometry.
Original controls9540 now belongs to the intended repair: control9875 is the
first actual prize-cue frame, explicitly pinned to its old camera-patch JPEG.
All four controls require whole-image RGB0; no old9540 policy is transferred.
"""
import ast
import hashlib
import json
import math
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=W/'scripts/blender/desk_axes_e1_meaningful_motion_v6_20261025.py'
SOURCE_SHA='722e6918ed5902c374b8f075e58e36ca47f52668d7c6cd62899bb5238eef8797'
FAILED=Path('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v6-20261025/probe/report.json')
FAILED_SHA='d0874f898df088a56853f81fca898001c8a20f57870e9f7b170b75324d5f1f2b'
CONTROL9875=Path('/private/tmp/ys/ys-chain-e1v1-camera-final-20261024/blender/patch/09875.jpg')
CONTROL9875_SHA='15e787b47b8cdd7a56869d047bfb63d6fe5c6e340a6067bbb4f04cab41f7f803'
def _sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()
_pins={str(SOURCE):SOURCE_SHA,str(FAILED):FAILED_SHA,str(CONTROL9875):CONTROL9875_SHA,
       str(Path(__file__).resolve()):_sha(__file__)}
assert all(_sha(p)==h for p,h in _pins.items())
_original=SOURCE.read_text()
_before="_after_cache='/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v6-20261025'"
_after="_after_cache='/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v7-20261025'"
assert _original.count(_before)==1
_text=_original.replace(_before,_after,1)
assert _text.replace(_after,_before,1)==_original
_parent={'__name__':'e1_meaningful_motion_v7_parent_private','__file__':str(Path(__file__).resolve())}
exec(compile(_text,str(SOURCE)+' [private v7 fresh cache]','exec'),_parent)
_inner=_parent['_inner']
for _scope in (_parent,_parent['_parent'],_parent['_parent']['_parent']):
    _scope['_pins'].update(_pins)
_inner['_V3_EXTRA_PINS'].update(_pins)
_original_inner=_parent['_inner_text'];_inner_text=_original_inner;_boundaries=[]
def _change(before,after):
    global _inner_text
    assert _inner_text.count(before)==1,('Nonunique bounded-bob boundary',before[:100])
    _inner_text=_inner_text.replace(before,after,1);_boundaries.append((before,after))
_change('        if fact <= t < wave+BLEND:', '        if fact <= t < _SHIP_CUT:')
_change("            assert current(cues, t)['row'] == 35", "            assert current(cues, t)['row'] in (35,36)")
_change("'pendulumSeconds':[fact,wave,wave+BLEND], 'shipboardPeriodSeconds':PERIOD,",
        "'pendulumSeconds':[fact,wave,_SHIP_CUT], 'shipboardPeriodSeconds':PERIOD,")
_change('    began = time.time()',
        "    report['plannedProbeFrames'] = sorted(round(t*30) for t in PROBE_TIMES)\n"
        "    report['boundedShipboardPendulum'] = _BOUNDED_MOTION_PROOF\n"
        '    began = time.time()')
_change("            report['physical'].append({'frame':j,'time':j/30,'kind':kind(j),'pose':poses[j],",
        "            bob_evidence = None if groups == ('chart',) else _BOB_VISIBLE(g,d,parts,bpy,j,cloud,bounds)\n"
        "            report['physical'].append({'bobVisibility':bob_evidence,'frame':j,'time':j/30,'kind':kind(j),'pose':poses[j],")
_inverse=_inner_text
for before,after in reversed(_boundaries):
    assert _inverse.count(after)==1;_inverse=_inverse.replace(after,before,1)
assert _inverse==_original_inner

_STOP_START=None
def _smooth(u):
    u=max(0.,min(1.,u));return u*u*u*(10+u*(-15+6*u))

def _rotation(t,wave,unused_original):
    assert _STOP_START is not None
    phase=max(0.,t-wave)
    regular=(0.,.18*math.sin(2*math.pi*(t-wave)+.7),0.)
    # Same maximum .18rad as the land clock. A nearly stalled amplitude is
    # intentional in the supplied narration; no wild out-of-case rotations.
    amplitude=.10+.08*math.cos(1.2*phase)
    irregular=(.003*math.sin(4*phase),
               amplitude*math.sin(.7+6.2*phase+.7*math.sin(1.8*phase)),
               .02*math.sin(3*phase))
    blend=_smooth((t-wave)/.6)
    damping=1-_smooth(t-_STOP_START)
    angle=tuple(((1-blend)*a+blend*b)*damping for a,b in zip(regular,irregular))
    assert abs(angle[0])<=.003+1e-12 and abs(angle[1])<=.18+1e-12 and abs(angle[2])<=.02+1e-12
    if t>=_STOP_START+1:assert angle==(0.,0.,0.)
    return angle

def _bob_visible(g,d,parts,bpy,j,cloud,bounds):
    """Read actual evaluated meshes, not nominal circles or bounding-box proxies."""
    import numpy as np
    root=parts['pendulum']['root'];pivot=parts['pendulum']['pendulum']
    bob=[o for o in g['ext'].descendants(pivot) if o.type=='MESH' and o.name=='e1_pendulum_bob']
    panel=[o for o in g['GROUPS']['pendulum'] if o.type=='MESH' and o.name=='e1_pendulum_window']
    assert len(bob)==len(panel)==1
    assert not bob[0].hide_render and not panel[0].hide_render
    bw=cloud(bob);pw=cloud(panel);inverse=np.asarray(root.matrix_world.inverted(),dtype=np.float64)
    local=bw@inverse.T;window=pw@inverse.T
    left,right=float(window[:,0].min()),float(window[:,0].max())
    bottom,top=float(window[:,2].min()),float(window[:,2].max())
    front=float(window[:,1].min())
    clearance=min(float(local[:,0].min())-left,right-float(local[:,0].max()),float(local[:,2].min())-bottom,top-float(local[:,2].max()))
    # A meaningful exposed cap must remain ahead of the opaque dark panel.
    # Glass transparency is untouched. This does not pretend the complete
    # sphere is in front of that existing decorative panel or glass mesh.
    visible=local[:,1]<=front-.0004
    fraction=float(visible.sum())/len(local)
    assert clearance>=.0004,('Bob extends outside existing window opening',j,clearance)
    assert fraction>=.18,('Bob front cap buried behind opaque window panel',j,fraction)
    dg=bpy.context.evaluated_depsgraph_get()
    matrix=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
    clip=bw[visible]@np.asarray(matrix,dtype=np.float64).T
    assert np.isfinite(clip).all() and (clip[:,3]>0).all()
    xy=np.column_stack(((clip[:,0]/clip[:,3]+1)*540,(1-clip[:,1]/clip[:,3])*960))
    cap=[float(xy[:,0].min()),float(xy[:,1].min()),float(xy[:,0].max()),float(xy[:,1].max())]
    whole=bounds(bob);diameter=min(whole['box'][2]-whole['box'][0],whole['box'][3]-whole['box'][1])
    cap_diameter=min(cap[2]-cap[0],cap[3]-cap[1])
    assert whole['safe'] and diameter>=30 and cap_diameter>=25,('Bob too small/cropped despite hero bounds',j,whole,cap)
    assert cap[0]>=40 and cap[1]>=110 and cap[2]<=1040 and cap[3]<=1550
    assert pivot.rotation_mode=='XYZ' and max(abs(float(a)-float(b)) for a,b in zip(pivot.rotation_euler,_rotation(j/30,g['T']('pen:sway','波'),())))<=1e-7
    return {'actualEvaluatedBob':bob[0].name,'actualOpaquePanel':panel[0].name,
            'bobWorldVertices':len(bw),'frontCapVertices':int(visible.sum()),'frontCapVertexFraction':fraction,
            'opaquePanelFrontRootLocalY':front,'frontCapRequiredClearanceMeters':.0004,
            'windowOpeningXZClearanceMeters':clearance,'minimumWindowClearanceMeters':.0004,
            'wholeBobProjection':whole,'minimumWholeBobDiameterPixels':30,'wholeBobDiameterPixels':diameter,
            'visibleFrontCapProjectedBox':cap,'visibleFrontCapDiameterPixels':cap_diameter,'minimumFrontCapDiameterPixels':25,
            'threeAxisAnglesRadians':list(pivot.rotation_euler),'passed':True,
            'notAnActualPixelOrFullOcclusionProof':True,'rootActualProbeReviewStillMandatory':True}

_base_strict_compare=_parent['_parent']['_compare']
def _strict_compare(record):
    if record['frame']==9875:
        assert Path(record['expectedPath']).resolve()==CONTROL9875 and record['expectedSha256']==CONTROL9875_SHA
    result=_base_strict_compare(record)
    result.update({'explicitCaseAccepted':False,'old9540CaseNotTransferredTo9875':True})
    return result

def _strict_accept(record):
    assert record['frame'] in (380,450,9249,9875)
    assert _sha(record['path'])==record['sha256'] and _sha(record['expectedPath'])==record['expectedSha256']
    assert record['byteExactAgainstExistingDeliveredRaw']==(record['sha256']==record['expectedSha256'])
    if record['frame']==9875:
        assert Path(record['expectedPath']).resolve()==CONTROL9875 and record['expectedSha256']==CONTROL9875_SHA
    return (record['sourceEquivalentAgainstExistingDeliveredRaw'] is True and record['decodedRgbExact'] is True
            and record['decodedDifferenceMinMax']==[0,0] and record['explicitCaseAccepted'] is False)

_proof={'adapter':str(Path(__file__).resolve()),'adapterSha256':_sha(__file__),
        'source':str(SOURCE),'sourceSha256':SOURCE_SHA,'oldActualV6ProbeRetained':str(FAILED),'oldActualV6ProbeSha256':FAILED_SHA,
        'exactReversibleInnerBoundaries':len(_boundaries),'inverseByteIdenticalOutsideNewMotionAndVisibilityGuards':True,
        'onlyPivotAnglesAndPreviouslyApprovedHandChange':True,'clockHandsShipWaveTimesCameraAndModelsUnchanged':True,
        'maximumAnglesXYZRadians':[.003,.18,.02],'irregularAmplitudeRangeRadians':[.02,.18],
        'waveBlendSeconds':.6,'calmAndLandClockPeriodSeconds':1,'wholeImageRgbZeroAllFourControls':True,
        'controls':[380,450,9249,9875],'old9540CaseOnlyArchivedNotReused':True,
        'control9875OriginalCameraPatch':str(CONTROL9875),'control9875OriginalCameraPatchSha256':CONTROL9875_SHA,
        'bobEveryActualFrameNeedsFrontCapWindowClearanceAndProjectedDiameter':True,
        'additionalNumericalVisibilityIsNotPixelReview':True,'rootAllProbeEyeApprovalRequired':True,'finalAcceptance':False}
_inner['_SOURCE_PROOF']['v7BoundedVisibleBobMotionProof']=_proof
_inner['repaired_pendulum']=_rotation
_inner['_BOB_VISIBLE']=_bob_visible
_inner['_INDEPENDENT_RGB_COMPARE']=_strict_compare
_inner['_CONTROL_ACCEPT']=_strict_accept
_inner['CONTROL_FRAMES']=(380,450,9249,9875)
_nodes=[n for n in ast.parse(_inner_text).body if isinstance(n,ast.FunctionDef) and n.name=='run']
assert len(_nodes)==1
exec(compile(ast.Module(body=_nodes,type_ignores=[]),str(SOURCE)+' [private v7 bounded bob run]','exec'),_inner)
OUT=_parent['OUT']

def run(ns,authorized=False,mode='probe',approved_probe_sha256=None,*,allow_temporary_unhide=False):
    global _STOP_START
    assert authorized is True and allow_temporary_unhide is True
    assert all(_sha(p)==h for p,h in _pins.items())
    g=ns['apply'].__globals__;fact=g['S']('pen:fact');wave=g['T']('pen:sway','波')
    _STOP_START=g['T']('pen:judge','負けた');cut=g['S']('prize:act')
    assert abs(fact-308.316)<1e-8 and abs(wave-317.21)<1e-8
    assert abs(_STOP_START-326.43)<1e-8 and abs(cut-329.1393333333334)<1e-8
    _inner['_SHIP_CUT']=cut
    times=[12.9,13.47,13.9,14.5,308.4,309.1,310.2,311.4,314.2,317.2,317.5,317.8,
           318.,318.2,318.6,319.,319.6,320.,320.8,321.6,322.4,323.4,324.4,325.4,326.4,326.9,327.5,328.5,329.1]
    ship_frames=[j for j in range(11606) if fact<=j/30<cut]
    assert len(ship_frames)==625
    # Explicit maximum deflections join the fixed semantic/stop probes.
    angles={j:_rotation(j/30,wave,()) for j in ship_frames}
    for axis in (0,1,2):
        times.extend(j/30 for j in (min(ship_frames,key=lambda j:angles[j][axis]),max(ship_frames,key=lambda j:angles[j][axis])))
    frames=sorted(set(round(t*30) for t in times))
    assert len(frames)>=27 and all(381<=j<450 or j in angles for j in frames)
    _inner['PROBE_TIMES']=tuple(j/30 for j in frames)
    _inner['_BOUNDED_MOTION_PROOF']={**_proof,'shipboardInterval':[fact,cut],'stopInterval':[_STOP_START,_STOP_START+1],
        'expectedActualFrames':694,'handActualFrames':69,'shipActualFrames':625,
        'plannedProbeFrames':frames,'plannedProbeImages':len(frames),'actualProbeEyesPerformed':False}
    result=_parent['run'](ns,authorized=True,mode=mode,approved_probe_sha256=approved_probe_sha256,allow_temporary_unhide=True)
    assert result['actualSources']==694 and len(result['replacementFrameToActualPatchFrame'])==694
    assert all(_sha(p)==h for p,h in _pins.items())
    return result
