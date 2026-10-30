"""Read-only A S3 supplied input/lint/query audit. Never calls Nemo or synthesis.
Only new reports beneath the A S3 cache are written; raw/movie are not touched.
"""
from pathlib import Path
import hashlib, json, os, re, subprocess, sys

W = Path(__file__).resolve().parents[2]
C = Path('/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028')
A = W / 'scripts/blender/desk_assets/d1a'
SCRIPT = W / 'docs/video-revision-20260924/ytseries/chain-d-1a.mjs'
MD = W / 'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1前編_ナレーション.md'
OUT = C / 'qa/input-audit_s3_gpt_20261028.json'
assert not OUT.exists()
assert C.resolve() == C
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
sys.dont_write_bytecode = True
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
names = ['plan.json', 'ys-chain-d1a.json', 'phrase-times.json', 'timed-selection.json', 'prosody.txt']
protected = [C/n for n in names] + [C/'ys-chain-d1a.voice.wav', A/'ys-chain-d1a.wav', SCRIPT, MD,
             W/'scripts/umech/chain-desk-lint.mjs', W/'scripts/umech/check-readings.py', W/'scripts/umech/prosody-speaker.py', W/'scripts/umech/qx-verify.mjs']
before = {str(p): sha(p) for p in protected}
copies = {n: sha(C/n) == sha(A/n) for n in names}
copies['suppliedVoice'] = sha(C/'ys-chain-d1a.voice.wav') == sha(A/'ys-chain-d1a.wav')
assert all(copies.values()), copies
env = dict(os.environ, EM_FILM_CACHE=str(C))
cmd = ['node', 'scripts/umech/chain-desk-lint.mjs', str(SCRIPT), 'ys-chain-d1a', str(MD)]
lint = subprocess.run(cmd, cwd=W, env=env, text=True, capture_output=True)

# Reuse the unmodified reading checker's pure normalization functions only.
# Stop before its plan loop, so no query() call or HTTP request is performed.
checker = W/'scripts/umech/check-readings.py'
pure = checker.read_text().split('plan = json.load', 1)[0]
ns = {'__file__': str(checker), '__name__': 'offline_supplied_query_normalization'}
exec(compile(pure, str(checker), 'exec'), ns)
queries = [(p, json.loads(p.read_text())) for p in sorted((A/'speech').glob('*.query.json'))]
plan = json.loads((C/'plan.json').read_text())
records = []
for clip in plan:
    for scene in clip['scenes']:
        assert len(scene['cues']) == len(scene['utterances'])
        for q, u in zip(scene['cues'], scene['utterances']):
            want = ns['expected'](q['reading'])
            kana = ns['norm'](re.sub(r'[^ァ-ヴー]', '', q['kana']))
            matches = [(p, x) for p, x in queries if x.get('subtitle') == q['subtitle'] and x.get('reading') == ns['word_reading'](q['reading'])]
            states = [{'file': str(p), 'querySoundsMatchReading': ns['engine'](x) == want,
                       'providedKanaSoundsMatchQuery': kana == ns['engine'](x),
                       'literalAccentKanaMatches': x.get('kana') == q['kana'],
                       'recordedPronunciationMatched': x.get('pronunciationMatched'), 'selection': x.get('selection')}
                      for p, x in matches]
            records.append({'cue': q['diagram'], 'speaker': u.get('speaker'),
                            'providedKanaSoundsMatchReading': kana == want, 'savedQueries': states})
assert len(records) == 54
summary = {
    'cues': 54, 'savedQueryFilesAvailable': len(queries),
    'cuesWithSavedQuery': sum(bool(r['savedQueries']) for r in records),
    'providedKanaSoundsMatchReading': sum(r['providedKanaSoundsMatchReading'] for r in records),
    'cuesWithMatchingSavedQuerySounds': sum(any(x['querySoundsMatchReading'] and x['providedKanaSoundsMatchQuery'] for x in r['savedQueries']) for r in records),
    'cuesWithLiteralAccentKanaMatch': sum(any(x['literalAccentKanaMatches'] for x in r['savedQueries']) for r in records),
}
after = {str(p): sha(p) for p in protected}
assert before == after, 'Input/checker changed during read-only audit'
result = {'stage': 'A S3 pre-render input audit', 'copiedInputsEqualSuppliedAssets': copies,
          'lint': {'command': cmd, 'exitCode': lint.returncode, 'stdout': lint.stdout, 'stderr': lint.stderr},
          'offlineSavedQuerySoundComparison': summary, 'cueResults': records,
          'inputAndOriginalCheckerHashes': before, 'protectedInputsUnchangedDuringAudit': True,
          'NemoRequests': 0, 'speechRegenerated': False, 'earsPerformed': False,
          'limits': ['Saved query pronunciation comparison is not proof that each query generated the supplied concatenated voice.',
                     'Literal accent-kana differences are reported, not rewritten. No new Nemo accent/prosody check was run.',
                     'qx-verify actual-MP4 check is deferred until the S3 draft exists.',
                     'The immutable supplied WAV remains authoritative; this audit does not assess naturalness by listening.'],
          'qxCommandWhenDraftExists': 'EM_FILM_CACHE='+str(C)+' node scripts/umech/qx-verify.mjs ys-chain-d1a '+str(C/'draft/ys-chain-d1a_draft.mp4'),
          'wholeMoviePass': False}
OUT.parent.mkdir(parents=True, exist_ok=True)
with OUT.open('x') as f: json.dump(result, f, ensure_ascii=False, indent=1); f.write('\n')
print(json.dumps({'report': str(OUT), 'lintExitCode': lint.returncode, **summary}, ensure_ascii=False))
sys.exit(lint.returncode or (0 if summary['providedKanaSoundsMatchReading'] == 54 and summary['cuesWithMatchingSavedQuerySounds'] == 54 else 1))
