"""Root-only owned resume: frozen B6v6 physics, fresh output, exact487 reuse.

Import is inert. The original interrupted tree, helper and approval stay fixed.
Only three explicit AST adapter boundaries change: original probe path, a fresh
cache seed hook, and an I/O-guarded call to the unchanged retained renderer.
"""
import ast
import copy
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import time
import types

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE = W/'scripts/blender/desk_axes_b1_integrated_b6_v6_20261024.py'
SOURCE_SHA = 'bbcd5af4926fbccde672c6601b11362d6f18a72619fc1fd1daa628e25c218e61'
OLD = Path('/private/tmp/ys/ys-chain-b1v1-integrated-b6-v6-20261024')
OUT = Path('/private/tmp/ys/ys-chain-b1v1-integrated-b6-v6-owned-resume-20261025')
MANIFEST = W/'outputs/axes-20261023/b1-b6-v6-paused487-reuse-inventory-20261025.json'
MANIFEST_SHA = '7bdf2f2447e79a6fac89ddb2ceb7e39ee6a7b1a85d557f12022998a444cb7c40'
APPROVAL = W/'outputs/axes-20261023/root-b6v6-probe20-eye-approval-20261025.json'
PROBE_SHA = '7f75ac76028decf00ae1f83f082af3013ec5a47b06b86fbcfc8557e0ac8eb42d'
B4_SHA = '5bae5a0335fbe6b14555560e386315764b58eba42e24d85e5bd08bdcc81d9c53'
B5_SHA = '69f680bda23b6e30ca9a6272cd34009777683065aca4bc0661f342f1e8f460c5'
CANCEL = Path('/private/tmp/ys/axes-active-queue/cancel')

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def read(p):
    return json.loads(Path(p).read_text())

def write(p, value):
    with Path(p).open('x') as f:
        json.dump(value, f, ensure_ascii=False, indent=1, allow_nan=False)

def stat_hash(p):
    p = Path(p)
    s = p.lstat()
    assert p.is_file() and not p.is_symlink(), str(p)
    return {'bytes':s.st_size, 'mtimeNs':s.st_mtime_ns, 'inode':s.st_ino,
            'device':s.st_dev, 'sha256':sha(p)}

def tree_hash(root):
    root = Path(root)
    assert root.is_dir() and not root.is_symlink()
    answer = {}
    for p in sorted(root.rglob('*')):
        assert not p.is_symlink(), str(p)
        if p.is_file():
            answer[str(p)] = stat_hash(p)
    return answer

class _RenderGuard:
    def __init__(self, base, owner):
        self.base, self.owner = base, owner
    def render(self, *args, **kwargs):
        s = self.owner
        assert s.bpy.context.window.scene is s.scene
        assert kwargs.get('write_still') is True
        assert kwargs.get('scene', s.scene.name) == s.scene.name
        p = Path(s.scene.render.filepath)
        assert p.parent == s.raw and re.fullmatch(r'\d{5}\.jpg', p.name), str(p)
        j = int(p.stem)
        assert j in s.missing and j not in s.rendered, j
        assert not os.path.lexists(p), 'Never render over a cached/new JPEG'
        assert (s.scene.render.resolution_x, s.scene.render.resolution_y,
                s.scene.render.resolution_percentage) == (1080,1920,100)
        assert s.scene.render.image_settings.file_format == 'JPEG'
        assert not CANCEL.exists(), 'Cancellation remains authoritative'
        result = self.base.render(*args, **kwargs)
        assert p.is_file() and not p.is_symlink() and p.stat().st_size > 1000
        s.rendered.append(j)
        return result
    def __getattr__(self, name):
        return getattr(self.base, name)

class _OpsGuard:
    def __init__(self, base, owner):
        self.base = base
        self.render = _RenderGuard(base.render, owner)
    def __getattr__(self, name):
        return getattr(self.base, name)

class _BpyGuard:
    def __init__(self, base, owner):
        self.base = base
        self.ops = _OpsGuard(base.ops, owner)
    def __getattr__(self, name):
        return getattr(self.base, name)

class _FactoryGuard:
    """Only the copied shared-main scope receives a scoped bpy I/O guard."""
    def __init__(self, owner, d):
        self.owner, self.d, self.calls = owner, d, 0
    def FunctionType(self, code, scope, *args, **kwargs):
        assert code is self.d.main.__code__, 'Only the retained shared main is allowed'
        assert scope['SC'] is self.owner.scene
        self.calls += 1
        assert self.calls == 1
        guarded = dict(scope)
        guarded['bpy'] = _BpyGuard(scope['bpy'], self.owner)
        return types.FunctionType(code, guarded, *args, **kwargs)
    def __getattr__(self, name):
        return getattr(types, name)

class _Resume:
    def __init__(self, ns, manifest):
        self.manifest = manifest
        self.g = ns['main'].__globals__
        self.bpy, self.scene = self.g['bpy'], self.g['d'].SC
        self.raw = OUT/'render/blender/patch'
        self.cached = {row['frame']:row for row in manifest['cachedImages']}
        self.wanted = sorted(int(k) for k in read(OLD/'render/preflight.json')['patchFrameToUnchangedObjectSourceFrame'])
        self.missing = set(self.wanted)-set(self.cached)
        self.rendered = []
        self.original_tree = tree_hash(OLD/'render')
        self.evidence = {str(Path(r['path']) if Path(r['path']).is_absolute() else W/r['path']):r['sha256']
                         for r in manifest['preservedEvidence']}
        self.started = time.time()
        self.proof = {'adapter':str(Path(__file__).resolve()), 'adapterSha256':sha(__file__),
            'frozenHelper':str(SOURCE), 'frozenHelperSha256':SOURCE_SHA,
            'inventory':str(MANIFEST), 'inventorySha256':MANIFEST_SHA,
            'originalInterruptedReport':str(OLD/'render/report.json'),
            'originalInterruptedReportSha256':sha(OLD/'render/report.json'),
            'approvedOriginalProbe':str(OLD/'probe/report.json'), 'approvedOriginalProbeSha256':PROBE_SHA,
            'originalApproval':str(APPROVAL), 'originalApprovalSha256':sha(APPROVAL),
            'reusedActualFrames':sorted(self.cached), 'expectedNewRenderFrames':sorted(self.missing),
            'reusedCount':len(self.cached), 'expectedNewRenderCount':len(self.missing),
            'independentFreshCopiesNotHardlinksOrSymlinks':True,
            'frozenModelPoseTimeAndQualityGuardsUnchanged':True,
            'all803AnchorsRecomputed':False, 'oldInterruptedTreePreserved':False,
            'cachedFreshCopiesByteUnchanged':False, 'actualNewRenderFrames':[],
            'finalAcceptance':False, 'earsVerified':False}
        assert len(self.wanted)==803 and len(self.cached)==487 and len(self.missing)==316
        assert sorted(self.cached)==self.wanted[:487]

    def verify_original(self):
        assert sha(SOURCE)==SOURCE_SHA and sha(MANIFEST)==MANIFEST_SHA
        assert tree_hash(OLD/'render')==self.original_tree
        for p, h in self.evidence.items():
            assert sha(p)==h, p
        for j, row in self.cached.items():
            p = Path(row['path'])
            assert p.parent==OLD/'render/blender/patch' and int(p.stem)==j
            s = p.lstat()
            assert not p.is_symlink() and s.st_size==row['bytes']
            assert s.st_ino==row['ino'] and s.st_dev==row['dev']
            assert sha(p)==row['sha256']
            assert row['fullJpegDecodePassed'] and (row['width'],row['height'],row['channels'])==(1080,1920,3)

    def seed(self, dest, report, wanted):
        assert dest==OUT/'render' and wanted==self.wanted and not self.raw.exists()
        old = read(OLD/'render/preflight.json')
        for key in ('physical','newPoses','replacementFrameToActualPatchFrame',
                    'patchFrameToUnchangedObjectSourceFrame','patchFrameToUnchangedOtherObjectSourceFrame',
                    'replacementOutputs','actualSources','integratedMagneticWorldProof'):
            assert report[key]==old[key], ('Frozen803 state mismatch',key)
        assert report['allGuardedStatesPass'] and report['allCandidateSelectionsRequireExactPerStateQuality']
        assert report['helperSha256']==SOURCE_SHA and report['approvedProbeReportSha256']==PROBE_SHA
        self.verify_original()
        self.raw.mkdir(parents=True)
        for j, row in self.cached.items():
            src, dst = Path(row['path']), self.raw/('%05d.jpg'%j)
            with src.open('rb') as source, dst.open('xb') as target:
                shutil.copyfileobj(source,target,1024*1024)
            shutil.copystat(src,dst)
            assert not dst.is_symlink() and dst.stat().st_ino!=src.stat().st_ino
            assert sha(dst)==row['sha256']
        report['ownedResume'] = self.proof
        report['helperIdentityNote'] = 'helperSha256 identifies frozen v6 physics; ownedResume separately identifies the narrow AST/cache/I-O adapter. This is an explicit derivative, not an unmodified full-run claim.'

    def render_main(self, g, scope, wanted, report):
        assert g is self.g and wanted==self.wanted and scope['A'].force is False
        assert str(scope['A'].out)==str(self.raw)
        assert [round(float(x)*30) for x in scope['A'].times.split(',')]==self.wanted
        factory = _FactoryGuard(self,g['d'])
        copied = {**scope,'types':factory}
        # Both episode-main and shared-main code objects remain unchanged.
        types.FunctionType(g['main'].__code__,copied)()
        assert factory.calls==1 and self.rendered==sorted(self.missing)
        assert sorted(int(p.stem) for p in self.raw.glob('*.jpg'))==self.wanted
        for j, row in self.cached.items():
            assert sha(self.raw/('%05d.jpg'%j))==row['sha256']
        assert read(self.raw/'anchors.json')==read(OLD/'render/blender/patch/anchors.json'), 'All803 anchors must match, not only the reused487'
        self.verify_original()
        self.proof.update(all803AnchorsRecomputed=True,oldInterruptedTreePreserved=True,
            cachedFreshCopiesByteUnchanged=True,actualNewRenderFrames=self.rendered[:],
            actualNewRenderCount=len(self.rendered),retainedEpisodeAndSharedMainCodeUnchanged=True,
            skipExistingWasEnforcedBeforeEveryActualRender=True)

def _adapt(owner):
    """Structurally reversible AST adapter; no original guard is removed."""
    original = ast.parse(SOURCE.read_text(),str(SOURCE))
    tree = copy.deepcopy(original)
    outer = next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='run')
    probe_nodes = [n for n in ast.walk(outer) if isinstance(n,ast.Assign)
                   and len(n.targets)==1 and isinstance(n.targets[0],ast.Name) and n.targets[0].id=='prfile']
    assert len(probe_nodes)==1
    probe = probe_nodes[0]
    assert ast.dump(probe.value)==ast.dump(ast.parse("OUT/'probe/report.json'",mode='eval').body)
    prior_probe = copy.deepcopy(probe.value)
    probe.value = ast.Constant(str(OLD/'probe/report.json'))
    body = next(n for n in outer.body if isinstance(n,ast.Try)).body
    seed_at = [i for i,n in enumerate(body) if isinstance(n,ast.Expr)
               and ast.dump(n.value)==ast.dump(ast.parse('dest.mkdir(parents=True)',mode='eval').body)]
    main_at = [i for i,n in enumerate(body) if isinstance(n,ast.Expr)
               and ast.dump(n.value)==ast.dump(ast.parse("types.FunctionType(g['main'].__code__,scope)()",mode='eval').body)]
    assert len(seed_at)==len(main_at)==1
    old_main = copy.deepcopy(body[main_at[0]])
    replacement = ast.parse('_resume_render_main(g,scope,wanted,report)').body[0]
    body[main_at[0]] = replacement
    hook = ast.parse('_resume_seed(dest,report,wanted)').body[0]
    body.insert(seed_at[0]+1,hook)
    restored = copy.deepcopy(tree)
    rr = next(n for n in restored.body if isinstance(n,ast.FunctionDef) and n.name=='run')
    rp = next(n for n in ast.walk(rr) if isinstance(n,ast.Assign) and len(n.targets)==1
              and isinstance(n.targets[0],ast.Name) and n.targets[0].id=='prfile')
    rp.value = prior_probe
    rb = next(n for n in rr.body if isinstance(n,ast.Try)).body
    rb.pop(seed_at[0]+1)
    rb[main_at[0]] = old_main
    assert ast.dump(restored)==ast.dump(original), 'Only the three declared adapter boundaries may differ'
    ast.fix_missing_locations(tree)
    scope = {'__name__':'_b6_v6_owned_resume','__file__':str(SOURCE)}
    exec(compile(tree,str(SOURCE),'exec'),scope)
    scope.update(OUT=OUT,_resume_seed=owner.seed,_resume_render_main=owner.render_main)
    return scope['run']

def run(ns, authorized=False):
    assert authorized is True and not CANCEL.exists()
    assert sha(SOURCE)==SOURCE_SHA and sha(MANIFEST)==MANIFEST_SHA
    assert not os.path.lexists(OUT) and not OUT.parent.is_symlink()
    manifest = read(MANIFEST)
    assert manifest['frozenHelperSha256']==SOURCE_SHA and manifest['cachedCount']==487
    approval, probe, interrupted = read(APPROVAL),read(OLD/'probe/report.json'),read(OLD/'render/report.json')
    assert approval['helperSha256']==SOURCE_SHA and approval['probeReportSha256']==PROBE_SHA==sha(OLD/'probe/report.json')
    assert approval['allTwentyActualProbesTeamViewed'] and approval['approvedForIntegratedRender']
    assert approval['concreteDefectsRemaining']==0 and approval['finalAcceptance'] is False
    assert approval['probeActualImages']==[{k:im[k] for k in ('frame','path','sha256')} for im in probe['actualImages']]
    for im in probe['actualImages']:
        assert sha(im['path'])==im['sha256']
    for receipt in approval['scopedReceipts']:
        assert sha(receipt['file'])==receipt['sha256']
    assert interrupted['error']=={'type':'InterruptedError','message':'Render cancelled by user request'}
    assert interrupted['actualSources']==803 and interrupted['replacementOutputs']==2386
    assert interrupted['allGuardedStatesPass'] and all(interrupted['protectionChecks'].values())
    owner = _Resume(ns,manifest)
    owner.verify_original()
    adapted = _adapt(owner)
    result = None
    succeeded = False
    try:
        result = adapted(ns,authorized=True,mode='render',b4_probe_sha256=B4_SHA,b5_probe_sha256=B5_SHA,
            dependency_probes_visually_approved=True,visually_approved=True,probe_report_sha256=PROBE_SHA)
        assert result['allPatchFramesActuallyRendered'] and len(result['actualImages'])==803
        assert result['raw']==str(owner.raw) and all(result['protectionChecks'].values())
        assert len(owner.rendered)==316 and owner.proof['all803AnchorsRecomputed']
        succeeded = True
        return result
    finally:
        owner.verify_original()
        if (OUT/'render').is_dir():
            write(OUT/'owned-resume-completion.json',{'episode':'B-1','success':succeeded,
                'report':str(OUT/'render/report.json'),'reportSha256':sha(OUT/'render/report.json'),
                'adapterSha256':sha(__file__),'inventorySha256':MANIFEST_SHA,
                'frozenHelperSha256':SOURCE_SHA,'actualSources':803,'reusedActualSources':487,
                'newActualRenders':len(owner.rendered),'newRenderFrames':owner.rendered,
                'allOriginalInterruptedFilesByteAndStatUnchanged':True,
                'finalAcceptance':False,'earsVerified':False,'seconds':round(time.time()-owner.started,3)})
