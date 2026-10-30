"""NEW fixed right-edge policy checker; old16x16 NG remains preserved.

Root authorized the fixed inclusive rectangle1040,110..1079,320 after actual129.
Only frame9540 against the same frozen original may differ: <=100 pixels,
maximum channel delta2, every outside pixel0, identical quantization/dimensions.
This never fits a rectangle to newly observed differences or changes a gate.
"""
import hashlib
from pathlib import Path

SOURCE=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/umech/compare-e1-control9540-authorized-case-20261025.py')
SOURCE_SHA='9874bd85abd5dd231c9b4c0096cd222e2454c655272c4156076c56619e7a1cf5'
def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()
assert sha(SOURCE)==SOURCE_SHA
_original=SOURCE.read_text();_text=_original;_boundaries=[]
def _change(before,after,count=1):
    global _text
    assert _text.count(before)==count,('Nonunique fixed-policy checker boundary',before)
    _text=_text.replace(before,after);_boundaries.append((before,after,count))
_change('inside the inclusive 16x16','inside the root-authorized fixed right-edge')
_change('authorized_box = (1056, 192, 1072, 208)','authorized_box = (1040, 110, 1080, 321)')
_change("'authorizedBoundingBoxInclusive': [1056, 192, 1071, 207]", "'authorizedBoundingBoxInclusive': [1040, 110, 1079, 320]")
_change("'safePrincipalRegionExactlyZeroImpliedByDisjointRectangle'", "'strictSafeInteriorX40To1039ExactlyZeroImpliedByDisjointRectangle'")
_inverse=_text
for before,after,count in reversed(_boundaries):
    assert _inverse.count(after)==count;_inverse=_inverse.replace(after,before)
assert _inverse==_original
_scope={'__name__':'e1_fixed_right_edge_control9540_case_private','__file__':str(SOURCE)}
exec(compile(_text,str(SOURCE)+' [four reversible fixed-policy boundaries]','exec'),_scope)

if __name__=='__main__':
    _self=sha(__file__)
    try:
        _exit=_scope['main']()
    finally:
        assert sha(SOURCE)==SOURCE_SHA and sha(__file__)==_self
    raise SystemExit(_exit)
