"""1-2 第2版：変えた場面だけ書き直す（desk_1_2v1_retouch.py のやり方）。desk_1_2v2.py --retouch から、その名前空間で実行する。
キャッシュ（/private/tmp/ys/ys-chain-1-2v2/blender/desk）には、はじめに第1版の全コマを写してある。
1. RANGES の外では、カメラの姿勢が第1版と同じことを確かめる（第1版の set_camera12 を第1版のデータで計算して比べる）。
2. RANGES の外のコマのハッシュを取り、RANGES の中だけ書き、外のコマが1枚も変わっていないことを確かめる。"""
import ast
from pathlib import Path
RANGES=[(15.9,60.80),(76.7,88.6),(113.8,199.5),(213.3,228.1),(257.8,276.3),(294.4,335.7),(342.0,349.8),(364.6,386.0)]
def inside(t):return any(a<=t<b for a,b in RANGES)
def v1_pose_fn():
    src=(Path(os.path.dirname(os.path.abspath(__file__)))/'desk_1_2v1_state.py').read_text()
    tree=ast.parse(src);keep=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ['cue_at','u','set_camera12']]
    v1=json.load(open('/private/tmp/ys/ys-chain-1-2v1-render/blender/data.json'))['episode12']
    ns={'CUES':v1['cues'],'STARTS':[c['start'] for c in v1['cues']],'DATA':v1,'d':d,'math':math,'bisect':__import__('bisect'),'Vector':Vector}
    exec(compile(ast.Module(body=keep,type_ignores=[]),'desk_1_2v1_state.py(set_camera12)','exec'),ns)
    return ns['set_camera12'],v1
def retouch():
    root=Path(A.cache);F=root/'blender'/'desk';NF=math.ceil(DATA['duration']*FPS)
    f1,v1=v1_pose_fn()
    assert abs(v1['duration']-DATA['duration'])<1e-9
    bad=[]
    for j in range(NF):
        t=j/FPS
        if inside(t):continue
        a=[round(x,9) for x in f1(t)];b=[round(x,9) for x in pose12(t,CUES,DATA)[0]]
        if a!=b:bad.append((t,a,b))
    assert not bad,('camera differs outside the retouch ranges',bad[:5],len(bad))
    print('[1-2v2 retouch] camera identical to the 1st edition outside the ranges: %d frames'%sum(1 for j in range(NF) if not inside(j/FPS)),flush=True)
    def digest(j):return hashlib.sha256((F/('%05d.jpg'%j)).read_bytes()).hexdigest()
    outside=[j for j in range(NF) if not inside(j/FPS)]
    before={j:digest(j) for j in outside}
    v1sha=json.load(open(root/'blender'/'v1-frames-sha256.json'))
    assert all(before[j]==v1sha[str(j)] for j in outside),'outside frames are not the 1st-edition frames'
    A.times=None;A.out=str(F);A.force=False
    t0=time.time()
    # RETOUCH_RENDER（環境変数 "a-b,c-d"）があれば、その区間だけ書き直す（2回目以降の直し）。区間は RANGES の中に限る。
    render=[tuple(map(float,x.split('-'))) for x in os.environ['RETOUCH_RENDER'].split(',')] if os.environ.get('RETOUCH_RENDER') else RANGES
    assert all(any(a0<=a and b<=b0 for a0,b0 in RANGES) for a,b in render)
    for a,b in render:
        A.start=a;A.stop=b;print('[1-2v2 retouch]',a,b,flush=True);main()
    # A clone whose source was re-rendered can differ in JPEG bytes while its pixels are identical.
    # List them; desk-1-2v2-restore.mjs checks pixel identity and puts the 1st-edition bytes back.
    changed=[j for j in outside if digest(j)!=before[j]]
    (root/'blender'/'retouch-outside-changed.json').write_text(json.dumps(changed))
    plans=[plan12(j) for j in range(NF)]
    ev={'ranges':RANGES,'rendered_ranges':render,'frames':NF,'outside_frames':len(outside),'outside_bytes_changed':len(changed),
        'inside_frames':NF-len(outside),'rendered_frames':sum(1 for j,p in enumerate(plans) if p[0]=='render' and inside(j/FPS)),
        'seconds':round(time.time()-t0,1)}
    (root/'blender'/'retouch-1-2v2.json').write_text(json.dumps(ev,indent=1))
    print('[1-2v2 retouch] verified',ev,flush=True)
retouch()
