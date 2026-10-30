"""D1a S4 real-mesh / explicitly authorised true-inset primary measurement.

Import is inert. Call after apply(t) and after any exact-frame macro render.
The old projector and geometry-only utilities are reused read-only, but none
of the old save/load/cache guards or outputs are called. No camera fit, bound
clipping, proxy inflation, visibility change or legibility PASS is performed.
"""
import copy
import json
import math
import os
from pathlib import Path
import struct

import desk_d1a_s3_qa_gpt_20261028 as _old

CACHE = Path('/private/tmp/ys/ys-chain-d1a_s4_gpt_20261028')
ROOT = Path(__file__).resolve().parents[2]
BASE_PLAN = ROOT / 'outputs/ys-chain-d1a-backup/S3_20261028/magnifier/cache/shot-plan.json'
PLAN_EXCLUDED_ROWS = _old.PLAN_EXCLUDED_ROWS
_MIN_WIDTH = dict(_old._MIN_WIDTH)
_MIN_WIDTH[24] = .50  # latest Claude explicitly separates palm50% / can60%.


def _key(ns, key=None):
    actual = ns.get('_S4_KEY')
    if callable(actual):
        actual = actual()
    if actual is None and callable(ns.get('render_key')):
        actual = ns['render_key']()
    if not isinstance(actual, str) or len(actual) < 20:
        raise ValueError('Set the current S4 source fingerprint before measuring')
    if key is not None and key != actual:
        raise ValueError('S4 QA/source fingerprint differs; no force override')
    return actual


def _path(out):
    p = Path(os.path.abspath(os.fspath(out)))
    if p != CACHE and CACHE not in p.parents:
        raise ValueError('Write only inside the new S4 cache')
    for q in [p] + list(p.parents):
        if q.is_symlink():
            raise ValueError('No symlink output path: '+str(q))
        if q == CACHE:
            break
    return p


def _actual_words(ns):
    supplied = ns.get('S4_ACTUAL_WORDS')
    if supplied is not None:
        return supplied
    if '_S4_QA_WORDS' not in ns:
        ns['_S4_QA_WORDS'] = json.loads((CACHE/'word-events-actual_s3_20261028.json').read_text())
    return ns['_S4_QA_WORDS']


def _word(ns, cue, word):
    value = _actual_words(ns)[cue][word]['time']
    if not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError('No actual spoken-word time: '+cue+'/'+word)
    return float(value)


def _macro_window(ns, t):
    windows = ns.get('S4_MACRO_WINDOWS', [])
    if callable(windows):
        windows = windows(ns)
    hits = [x for x in windows if float(x['start']) <= t < float(x['end'])]
    if len(hits) > 1:
        raise ValueError('Overlapping macro-primary windows at '+str(t))
    if hits:
        return dict(hits[0])
    # row22 timing is an immutable spoken interval, independent of rounded
    # frame lookup. Pump windows must be declared by the actual model timing.
    if _word(ns, 'air:1kg', '1平方センチメートル') <= t < _word(ns, 'air:1kg', '手のひら'):
        return {'kind': 'square', 'start': _word(ns, 'air:1kg', '1平方センチメートル'),
                'end': _word(ns, 'air:1kg', '手のひら'), 'minWidth': .60}
    return None


def _macro_name(ns, window, t):
    kind = window['kind']
    if kind == 'square':
        return ('1平方センチメートルの升（実3D拡大）'
                if t < _word(ns, 'air:1kg', '1キログラム')
                else '1kgの重り（実3D拡大）')
    if window.get('name'):
        return window['name']
    return {'inlet': '入口の弁と蝶番（実3D拡大）',
            'outlet': '出口の弁と蝶番（実3D拡大）'}[kind]


def selector(ns, t):
    """Semantic subject at the actual t, never delayed for a camera arrival."""
    t = float(t)
    result = dict(_old.selector(ns, t))
    cue = _old._cue(ns, t)
    if result.get('excludedFullFace'):
        return result
    if cue.get('row') == 24:
        minimum = .50 if t < _word(ns, 'air:inside', '缶がつぶれた') else .60
        value = ns.get('SHOTQA_PRIMARY', {}).get(cue['key'])
        if callable(value):
            value = value(ns, cue, t)
        stated = value.get('minWidth') if isinstance(value, dict) else None
        result['minWidth'] = max(minimum, float(stated)) if stated is not None else minimum
    window = _macro_window(ns, t)
    if window is not None:
        result.update(name=_macro_name(ns, window, t), minWidth=max(.60, float(window.get('minWidth', .60))),
                      minHeight=None, maxWidth=None, source='authorised-true-3D-inset', macroWindow=window)
    return result


def _warning(ns, code, detail):
    item = {'code': code, 'detail': str(detail)}
    warnings = ns.setdefault('S4_PRIMARY_WARNINGS', [])
    if item not in warnings:
        warnings.append(item)


def _circle(entry):
    c = entry['circle']
    if isinstance(c, dict):
        x, y, r = c['cx'], c['cy'], c['r']
        stroke = c.get('strokeWidth', 0)
    elif isinstance(c, (list, tuple)) and len(c) == 3:
        x, y, r = c
        stroke = 0
    else:
        raise ValueError('circle must be actual [cx,cy,r] or {cx,cy,r,strokeWidth}')
    if not all(isinstance(v, (int, float)) and math.isfinite(v) for v in [x, y, r, stroke]) or r <= 0 or stroke < 0:
        raise ValueError('Invalid actual macro circle')
    radius = float(r) + float(stroke)/2
    return [float(x)-radius, float(y)-radius, float(x)+radius, float(y)+radius]


def _image_size(path):
    """Read actual PNG/JPEG dimensions, not a claimed JSON resolution."""
    with path.open('rb') as f:
        first = f.read(24)
        if first[:8] == b'\x89PNG\r\n\x1a\n':
            return list(struct.unpack('>II', first[16:24]))
        if first[:2] != b'\xff\xd8':
            raise ValueError('True macro image is not PNG/JPEG')
        f.seek(2)
        while True:
            a = f.read(1)
            if not a:
                break
            if a != b'\xff':
                continue
            code = f.read(1)
            while code == b'\xff':
                code = f.read(1)
            if not code or code[0] in (0xD9, 0xDA):
                break
            if code[0] in (0, 1) or 0xD0 <= code[0] <= 0xD8:
                continue
            length = struct.unpack('>H', f.read(2))[0]
            if code[0] in (0xC0,0xC1,0xC2,0xC3,0xC5,0xC6,0xC7,0xC9,0xCA,0xCB,0xCD,0xCE,0xCF):
                body = f.read(length-2)
                height,width = struct.unpack('>HH',body[1:5])
                return [width,height]
            f.seek(length-2,1)
    raise ValueError('Actual macro dimensions unavailable')


def _macro(ns, frame, spec):
    registry = ns.get('S4_MACRO_PRIMARY', ns.get('_S4_MACRO', {}))
    entry = registry(str(frame)) if callable(registry) else registry.get(str(frame))
    if entry is None:
        return None
    if entry.get('kind') != spec['macroWindow']['kind']:
        raise ValueError('Exact macro kind/semantic differs at '+str(frame))
    if 'frame' in entry and entry['frame'] != frame:
        raise ValueError('Wrong exact macro image frame')
    if float(entry.get('opacity', 0)) < .05:
        return None  # invisible/faded inset does not acquire a visible box.
    image = Path(entry['image'])
    if not image.is_absolute():
        image = CACHE/image
    image = _path(image)
    if not image.is_file() or image.is_symlink():
        return None
    resolution = entry.get('resolution')
    if not (isinstance(resolution, (list, tuple)) and len(resolution) == 2
            and resolution[0] == resolution[1] and resolution[0] >= 480):
        raise ValueError('Actual separately rendered square macro resolution is required')
    if entry.get('samples') not in (4, 16):
        raise ValueError('Record actual preview4 or production16 macro samples')
    headers = ns.setdefault('_S4_MACRO_IMAGE_HEADERS', {})
    stat = image.stat();header_key = (str(image),stat.st_size,stat.st_mtime_ns)
    if header_key not in headers:
        headers[header_key] = _image_size(image)
    if headers[header_key] != list(resolution):
        raise ValueError('Actual macro file dimensions differ from declared resolution')
    return {'entry': entry, 'image': str(image), 'bounds': _circle(entry)}


def _pump_measurements(ns):
    """Independent typed-role sizes; never add these to the main bound."""
    roles = ns.get('S4_PUMP', {}).get('roles', {})
    if not roles:
        return {}
    definitions = {'body': {'minWidth': .25, 'minHeight': .55},
                   'sphere': {'minWidth': .30},
                   'inlet_door': {'minWidth': .08},
                   'outlet_door': {'minWidth': .08}}
    result = {}
    for name,limits in definitions.items():
        spec = {'objects': _old._objects(ns,roles.get(name,[])), 'source':'scene-SHOTQA_PRIMARY'}
        meshes = _old._visible(ns,spec)
        projected = _old._qa._project(ns,meshes,ns.setdefault('_S4_QA_VERTEX_CACHE',{})) if meshes else {}
        width,height = projected.get('width_ratio'),projected.get('height_ratio')
        result[name] = dict(limits,exists=bool(projected.get('exists')),rawBounds01=projected.get('bounds01'),
                            width=width,height=height,inFrame=bool(projected.get('in_frame')),
                            selectedMeshCount=len(meshes),subjectAddedToMainBound=False,
                            widthMinimumMet=width>=limits['minWidth'] if width is not None else False,
                            heightMinimumMet=height>=limits['minHeight'] if height is not None and 'minHeight' in limits else None)
    return result


def measure(ns, t):
    """After scene apply and exact macro creation; store only real evidence."""
    key = _key(ns)
    t = float(t); fps = float(ns.get('FPS', 30)); frame = int(round(t*fps))
    cue, spec = _old._cue(ns, t), selector(ns, t)
    primary = ns.setdefault('PRIMARY', {}); records = ns.setdefault('S4_PRIMARY_METADATA', {})
    record = dict(frame=frame, time=t, cue=cue.get('key'), row=cue.get('row'), name=spec['name'],
                  minWidth=spec.get('minWidth'), minHeight=spec.get('minHeight'), maxWidth=spec.get('maxWidth'),
                  sourceKey=key, logicalResolution=[1080, 1920], selectionSource=spec['source'],
                  selectionReason=spec.get('reason'), cameraChangedByMeasurement=False,
                  occlusionOrReadabilityChecked=False, planExcludedRow=cue.get('row') in PLAN_EXCLUDED_ROWS)
    if spec.get('excludedFullFace'):
        record.update(sizeApplicable=False, excludedFullFace=True, measured=False)
        primary[str(frame)] = None; records[str(frame)] = record
        return None
    record['sizeApplicable'] = True
    if cue.get('row') == 35:
        record['pumpIndependentDimensions'] = _pump_measurements(ns)
    if spec.get('macroWindow') is not None:
        macro = _macro(ns, frame, spec)
        if macro is None:
            record.update(measured=False, missing=True, macroPending=True,
                          note='Do not certify a planned/unrendered/transparent inset. Measure again after the actual exact macro exists.')
            primary[str(frame)] = None; records[str(frame)] = record
            _warning(ns, 'EXACT_MACRO_NOT_RENDERED_OR_VISIBLE', frame)
            return None
        box = macro['bounds']+[spec['name']]
        width, height = (box[2]-box[0])/1080, (box[3]-box[1])/1920
        inside = 0 <= box[0] <= box[2] <= 1080 and 0 <= box[1] <= box[3] <= 1920
        record.update(measured=True, missing=False, macroPending=False,
                      measurementDomain='Actual displayed true-3D inset circle, explicitly authorised by Claude',
                      rawBoundsLogical=box[:4], rawBounds01=[box[0]/1080, 1-box[3]/1920, box[2]/1080, 1-box[1]/1920],
                      width=width, height=height, inFrame=inside, cropped=not inside,
                      geometricMinimumMet=width >= spec['minWidth'], geometricHeightMinimumMet=None,
                      geometricMaximumMet=None, macroImage=macro['image'], macroKind=macro['entry']['kind'],
                      macroResolution=list(macro['entry']['resolution']), macroSamples=macro['entry']['samples'],
                      macroOpacity=macro['entry']['opacity'], macroTarget=macro['entry'].get('target'),
                      geometryVerticesReprojectedForCircle=False, note='Screen-space circle is real overlay geometry, not a padded mesh bound. Actual image readability is not judged here.')
        primary[str(frame)] = box; records[str(frame)] = record
        return box
    meshes = _old._visible(ns, spec)
    names = tuple(o.name for o in meshes)
    selections = ns.setdefault('S4_PRIMARY_SELECTIONS', [])
    index = ns.setdefault('_S4_QA_SELECTION_INDEX', {})
    if names not in index:
        index[names] = len(selections); selections.append(list(names))
    record.update(selectionIndex=index[names], selectedMeshCount=len(meshes), measurementDomain='Actual evaluated mesh vertices')
    if not meshes:
        record.update(measured=False, missing=True)
        primary[str(frame)] = None; records[str(frame)] = record
        _warning(ns, 'PRIMARY_NO_VISIBLE_REAL_MESH', cue.get('key'))
        return None
    projected = _old._qa._project(ns, meshes, ns.setdefault('_S4_QA_VERTEX_CACHE', {}))
    raw = projected.get('bounds01')
    if not projected.get('exists') or not raw or not all(math.isfinite(float(x)) for x in raw):
        record.update(measured=False, missing=True, rawBounds01=raw)
        primary[str(frame)] = None; records[str(frame)] = record
        return None
    x0,y0,x1,y1 = map(float,raw)
    box = [x0*1080,(1-y1)*1920,x1*1080,(1-y0)*1920,spec['name']]
    width,height = float(projected['width_ratio']),float(projected['height_ratio'])
    total,front = projected.get('vertices',0),projected.get('vertices_in_front',0)
    record.update(measured=True,missing=False,rawBounds01=list(raw),rawBoundsLogical=box[:4],width=width,height=height,
                  allVerticesInFront=total>0 and total==front,vertices=total,verticesInFront=front,
                  inFrame=bool(projected.get('in_frame')),cropped=not bool(projected.get('in_frame')),
                  geometricMinimumMet=width>=spec['minWidth'] if spec.get('minWidth') is not None else None,
                  geometricHeightMinimumMet=height>=spec['minHeight'] if spec.get('minHeight') is not None else None,
                  geometricMaximumMet=width<=spec['maxWidth'] if spec.get('maxWidth') is not None else None,
                  note='Unclamped actual geometry. No occlusion/transparency/readability claim.')
    primary[str(frame)] = box; records[str(frame)] = record
    return box


def _validate(primary, records, key, complete=False, nf=11618):
    if set(primary) != set(records):
        raise ValueError('Primary/metadata frame sets differ')
    if complete and set(primary) != {str(j) for j in range(nf)}:
        raise ValueError('Final primary/metadata requires every exact frame')
    for j, b in primary.items():
        r = records[j]
        if not j.isdigit() or r.get('frame') != int(j) or r.get('sourceKey') != key:
            raise ValueError('Primary source/frame mismatch: '+str(j))
        if complete and abs(float(r.get('time',-1))-int(j)/30) > 1e-7:
            raise ValueError('Final primary time is not the actual integer frame')
        if b is not None and (not isinstance(b,list) or len(b)!=5
                or not all(isinstance(v,(int,float)) and math.isfinite(v) for v in b[:4])
                or b[0]>b[2] or b[1]>b[3] or b[4]!=r.get('name') or b[:4]!=r.get('rawBoundsLogical')):
            raise ValueError('Invalid real primary bound: '+j)
        if complete and (r.get('macroPending') or (r.get('macroImage') and r.get('macroSamples')!=16)):
            raise ValueError('Final S4 macro is pending or not16samples at '+j)


def _atomic(p, value):
    p = _path(p);p.parent.mkdir(parents=True,exist_ok=True)
    temporary = p.with_name(p.name+'.tmp-'+str(os.getpid()))
    if temporary.exists():
        raise ValueError('Preserve existing incomplete QA write: '+str(temporary))
    with temporary.open('x',encoding='utf8') as f:
        json.dump(value,f,ensure_ascii=False,separators=(',',':'),allow_nan=False)
    os.replace(temporary,p)


def save(ns, out, key=None, complete=False):
    key = _key(ns,key);out = _path(out)
    previous = out/'primary-metadata.json'
    if previous.exists() and json.loads(previous.read_text()).get('sourceKey')!=key:
        raise ValueError('Do not overwrite QA from a different S4 source key')
    primary,records = ns.setdefault('PRIMARY',{}),ns.setdefault('S4_PRIMARY_METADATA',{})
    _validate(primary,records,key,complete,int(ns.get('NF',11618)))
    metadata = dict(stage='S4',sourceKey=key,logicalResolution=[1080,1920],fps=ns.get('FPS',30),
                    frames=records,selections=ns.get('S4_PRIMARY_SELECTIONS',[]),warnings=ns.get('S4_PRIMARY_WARNINGS',[]),
                    complete=bool(complete),planExcludedRows=sorted(PLAN_EXCLUDED_ROWS),
                    occlusionOrReadabilityPassClaimed=False,
                    geometryAndScreenSpaceDomainsExplicit=True,
                    heightGateLimitation='Gate7d checks width only; row21 height70% is separately retained')
    _atomic(out/'primary.json',primary);_atomic(previous,metadata)
    return {'primary':str(out/'primary.json'),'metadata':str(previous),'frames':len(records),'complete':complete,'sourceKey':key}


def load(ns, out, key=None):
    key = _key(ns,key);out = _path(out);p,m = out/'primary.json',out/'primary-metadata.json'
    if not p.exists() and not m.exists():
        ns.setdefault('PRIMARY',{});ns.setdefault('S4_PRIMARY_METADATA',{})
        return {'loaded':False,'frames':0}
    if not p.is_file() or not m.is_file():
        raise ValueError('Resume needs matching primary and metadata files')
    primary,metadata = json.loads(p.read_text()),json.loads(m.read_text())
    if (metadata.get('sourceKey')!=key or metadata.get('stage')!='S4'
            or metadata.get('logicalResolution')!=[1080,1920] or metadata.get('fps')!=ns.get('FPS',30)):
        raise ValueError('Saved S4 source/resolution/fps mismatch; force is forbidden')
    records = metadata.get('frames',{});_validate(primary,records,key)
    ns['PRIMARY'],ns['S4_PRIMARY_METADATA'] = primary,records
    ns['S4_PRIMARY_SELECTIONS'] = metadata.get('selections',[])
    ns['_S4_QA_SELECTION_INDEX'] = {tuple(v):i for i,v in enumerate(ns['S4_PRIMARY_SELECTIONS'])}
    ns['S4_PRIMARY_WARNINGS'] = metadata.get('warnings',[])
    return {'loaded':True,'frames':len(primary),'sourceKey':key}


def clone_primary(ns, src, dst, key=None):
    key = _key(ns,key)
    if type(src) is not int or type(dst) is not int:
        raise TypeError('Integer frame indices required')
    records=ns.setdefault('S4_PRIMARY_METADATA',{});primary=ns.setdefault('PRIMARY',{})
    if str(src) not in records or str(src) not in primary:
        raise ValueError('Source primary/metadata absent')
    r=copy.deepcopy(records[str(src)])
    if r.get('sourceKey')!=key or r.get('macroImage'):
        raise ValueError('Do not clone a stale source or a separately rendered macro; measure the destination')
    spec=selector(ns,dst/float(ns.get('FPS',30)));cue=_old._cue(ns,dst/float(ns.get('FPS',30)))
    if spec['name']!=r.get('name') or spec.get('macroWindow'):
        raise ValueError('Semantic changes require a fresh measurement')
    if not callable(ns.get('plan')) or tuple(ns['plan'](dst))!=('dup',src):
        raise ValueError('Parent did not declare this actual identical duplicate')
    if not callable(ns.get('pose_at')) or tuple(ns['pose_at'](src/30))!=tuple(ns['pose_at'](dst/30)):
        raise ValueError('Duplicate camera is not identical')
    r.update(frame=dst,time=dst/30,cue=cue.get('key'),row=cue.get('row'),clonedFromFrame=src,
             cloneEvidence='Explicit parent duplicate with identical camera/semantic; no new projection claimed')
    primary[str(dst)] = copy.deepcopy(primary[str(src)]);records[str(dst)] = r
    return primary[str(dst)]


def build_shot_plan(ns, out):
    """Copy the62 original width tests; change subjects only where authorised."""
    out=_path(out);rows=copy.deepcopy(json.loads(BASE_PLAN.read_text()))
    words=_actual_words(ns);cues={c['key']:c for c in ns.get('CUES',ns.get('DATA',{}).get('cues',[]))}
    if len(rows)!=62:
        raise ValueError('Expected the preserved62-row C5 shot plan')
    requests=[('air:1kg','1キログラム'),('air:inside','缶がつぶれた')]
    existing={(r['cue'].replace('cd1a-',''),r.get('suppliedEventWord')) for r in rows}
    for cue,word in requests:
        if (cue,word) in existing:
            continue
        event=words[cue][word]
        if not event.get('kana') or event.get('fallback'):
            raise ValueError('No exact provided kana for new shot-plan word')
        rows.append(dict(cue='cd1a-'+cue,row=cues[cue]['row'],word=event['kana'],occ=event.get('occ',0),
                         suppliedEventWord=word,actualGateTime=event['time'],
                         sourceTime=event.get('sourceTime'),reason='Latest Claude S4 semantic split'))
    for r in rows:
        cue=r['cue'].replace('cd1a-','');word=r.get('suppliedEventWord')
        if word is None:
            raise ValueError('Preserved shot-plan row lacks its source spoken event')
        time=words[cue][word]['time'];spec=selector(ns,time)
        if spec.get('excludedFullFace') or spec.get('minWidth') is None or spec['name'].startswith('UNKNOWN:'):
            raise ValueError('Invalid width-only plan subject at actual word: '+cue+'/'+word)
        r.update(primary=spec['name'],minWidth=spec['minWidth'],minHeight=spec.get('minHeight'),actualGateTime=time)
        if spec.get('maxWidth') is not None:r['maxWidth']=spec['maxWidth']
        else:r.pop('maxWidth',None)
    _atomic(out/'shot-plan.json',rows)
    meta=dict(stage='S4',sourceKey=_key(ns),rows=len(rows),basis=str(BASE_PLAN),baseRows=62,
              actualWordTimesUnchanged=True,primaryNamesMatchActualPhase=True,excludedRows=sorted(PLAN_EXCLUDED_ROWS),
              additions=requests,screenInsetOnlyWhenActualImageExists=True,
              heightOnlyRow21='Recorded in primary metadata; unchanged gate has no height-only shot test',
              allGeometryOrVisualPassClaimed=False)
    _atomic(out/'shot-plan-metadata.json',meta)
    return {'plan':str(out/'shot-plan.json'),'rows':len(rows),'metadata':str(out/'shot-plan-metadata.json')}
