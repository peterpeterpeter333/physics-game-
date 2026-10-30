"""Metadata-only wrapper: unchanged policy calculation plus expected print field."""
import argparse,hashlib,json,runpy
from pathlib import Path
SOURCE=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/umech/compare-b1-b7-window-policy-20261025.py')
SOURCE_SHA='4fe4e2d51abccbfc884512c776b72b1ab2e147822bcbfd0f04b72dbb40db502b'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def compare(left,right,left_sha,right_sha):
    assert sha(SOURCE)==SOURCE_SHA
    original=runpy.run_path(str(SOURCE))['compare'](left,right,left_sha,right_sha)
    assert 'comparisonMethod'not in original
    result={**original,'comparisonMethod':'Exact non-window RGB plus separately root-approved tiny window-only residual; full-image zero-difference result retained'}
    assert {k:v for k,v in result.items()if k!='comparisonMethod'}==original
    assert sha(SOURCE)==SOURCE_SHA
    return result
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--left',required=True);p.add_argument('--right',required=True);p.add_argument('--left-sha256',required=True);p.add_argument('--right-sha256',required=True)
    a=p.parse_args();result=compare(Path(a.left),Path(a.right),a.left_sha256,a.right_sha256)
    print(json.dumps(result,ensure_ascii=False,allow_nan=False));raise SystemExit(0 if result['pass']else 2)
