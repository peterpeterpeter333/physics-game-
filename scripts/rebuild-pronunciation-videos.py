"""Rebuild only clips using reviewed readings; resume safely after interruption."""
import hashlib,json,os,subprocess,sys,time
from pathlib import Path
from narration_pronunciation import clip_fingerprint

repo=Path(__file__).resolve().parent.parent
os.chdir(repo)
logdir=Path(os.environ.get('PRONUNCIATION_LOGS','/private/tmp/physics-pronunciation-rebuild'))
logdir.mkdir(parents=True,exist_ok=True)
if not os.environ.get('FFMPEG'):raise RuntimeError('Set FFMPEG')
jobs=[];audio=[];handles=[]
for group,folder in [('all','lessons'),('prerequisite','lessons'),('em','em')]:
 cache=Path(f'/private/tmp/physics-{group}-films')
 plan=json.loads((cache/'plan.json').read_text())
 selected=[c for c in plan if clip_fingerprint(c)]
 for c in selected:jobs.append((c,cache,folder))
 log=(logdir/f'audio-{group}.log').open('w');handles.append(log)
 if selected:
  audio.append(subprocess.Popen([sys.executable,'scripts/render-em-film-audio.py',*[c['id'] for c in selected]],env={**os.environ,'EM_FILM_CACHE':str(cache)},stdout=log,stderr=subprocess.STDOUT))
print(f'Rebuilding {len(jobs)} affected videos',flush=True)
running={};done=set();last=0
while len(done)<len(jobs):
 for proc in audio:
  if proc.poll() not in (None,0):raise RuntimeError('Audio generation failed; inspect logs')
 for ident,proc in list(running.items()):
  if proc.poll() is None:continue
  if proc.returncode:raise RuntimeError(f'Render failed: {ident}; inspect logs')
  done.add(ident);del running[ident]
 for clip,cache,folder in jobs:
  if len(running)>=3:break
  ident=clip['id']
  if ident in running or ident in done:continue
  file=cache/f'{ident}.json'
  if not file.exists():continue
  try:ready=json.loads(file.read_text())
  except json.JSONDecodeError:continue
  if ready.get('pronunciationFingerprint')!=clip_fingerprint(clip):continue
  log=(logdir/f'{ident}.log').open('w');handles.append(log)
  running[ident]=subprocess.Popen(['node','scripts/render-em-films.mjs' if folder=='em' else 'scripts/render-all-films.mjs',ident],env={**os.environ,'EM_FILM_CACHE':str(cache),'EM_FILM_NO_FINALIZE':'1'},stdout=log,stderr=subprocess.STDOUT)
 if time.monotonic()-last>20:
  print(f'Videos completed: {len(done)}/{len(jobs)}; rendering: {", ".join(running)}',flush=True);last=time.monotonic()
 time.sleep(1)
for proc in audio:
 if proc.wait()!=0:raise RuntimeError('Audio failed')
for log in handles:log.close()
print('All affected videos rendered. Run finalize-reviewed-videos.mjs and tests before publishing.',flush=True)
