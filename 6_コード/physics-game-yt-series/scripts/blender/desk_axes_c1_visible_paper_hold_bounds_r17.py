"""Read-only R17 named-paper addendum through the actual16.36s crowd cut.

The earlier helper, its r16 NG and all original gate/721 evidence stay intact.
Root calls audit(nsC1, final_cache). No render, no namespace rebinding.
"""
import hashlib,json
from pathlib import Path
OLD=Path(__file__).with_name('desk_axes_c1_visible_paper_hold_bounds.py')
OLD_SHA='dd669f9a64b5f3d3b0e654bd1e35570dc0996eafd20c959463b04d52f4793d48'
def audit(ns,final_cache):
    assert hashlib.sha256(OLD.read_bytes()).hexdigest()==OLD_SHA
    proof=json.loads((Path(final_cache)/'camera-patch.json').read_text())
    assert proof['revision']=='r17-paper-hand-hold-plus-r16-camera-semantic'
    cut=proof['additionalCameraAndWritingHandVisibilityFix']['cut'];assert abs(cut-16.36)<1e-8
    source=OLD.read_text()
    old="word=g['T']('desk:revolt','大きな反乱');samples=[r for r in dims['samples'] if r['cue']=='desk:revolt' and r['time']<word]"
    new="word=g['T']('desk:revolt','大きな反乱');cut=proof['additionalCameraAndWritingHandVisibilityFix']['cut'];samples=[r for r in dims['samples'] if r['cue']=='desk:revolt' and r['time']<cut]"
    assert source.count(old)==1;source=source.replace(old,new)
    source=source.replace("'反乱の語の前まで実際に保持する帳簿の最上面1枚'","'群衆へのcut16.36秒まで実際に保持する帳簿の最上面1枚'")
    source=source.replace("'r12 approved paper hold; do not falsely substitute the future cue subject before it is visible'","'R17 approved actual paper hold through word+.4; do not count the future crowd as the paper subject'")
    source=source.replace("'movingTowardCrowd':word-g['CUE']['desk:revolt']['move']<=t<word","'movingTowardCrowd':False,'paperHeldThroughCutTime':cut")
    source=source.replace("'paperBeforeCrowdWord':word,'rows':rows","'paperBeforeCrowdWord':word,'actualPaperHoldCutTime':cut,'originalHalfSecond16Included':any(r['time']==16.0 for r in rows),'baseReadOnlyHelperSha256':'"+OLD_SHA+"','rows':rows")
    source=source.replace("assert 7<=len(samples)<=10","assert len(samples)==9 and any(r['time']==16.0 for r in samples)")
    scope={'__file__':str(Path(__file__).resolve()),'__name__':'c1_r17_readonly_paper_projection'}
    exec(compile(source,str(Path(__file__).resolve()),'exec'),scope)
    return scope['audit'](ns,final_cache)
