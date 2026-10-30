"""Prepend the master row-1 exact 2s silence once, without changing voice samples.
Keep the original renderer's unshifted products in a new archive directory.
"""
from pathlib import Path
import json,wave,shutil,hashlib,sys
C=Path('/private/tmp/ys/ys-chain-b2a_gpt_20261029');ID=C.name
archive=C/(sys.argv[1] if len(sys.argv)>1 else 'unshifted-render-original');archive.mkdir(exist_ok=False)
names=[ID+'.wav',ID+'.json','timed-selection.json','plan.json']
for name in names:shutil.copy2(C/name,archive/name)
with wave.open(str(archive/(ID+'.wav'))) as w:
    params=w.getparams();samples=w.readframes(w.getnframes())
assert params.nchannels==1 and params.sampwidth==2 and params.framerate==24000
with wave.open(str(C/(ID+'.wav')),'wb') as w:
    w.setparams(params);w.writeframes(b'\0'*(2*24000*2)+samples)
timed=json.loads((archive/(ID+'.json')).read_text())
old_duration=timed['duration'];timed['duration']+=2;timed['silentIntroSeconds']=2
for scene in timed['scenes']:
    scene['start']+=2;scene['end']+=2
    for cap in scene['captions']:cap['start']+=2;cap['end']+=2
(C/(ID+'.json')).write_text(json.dumps(timed,ensure_ascii=False,indent=2))
(C/'timed-selection.json').write_text(json.dumps([timed],ensure_ascii=False,indent=2))
plan=json.loads((archive/'plan.json').read_text());plan[0]['silentIntroSeconds']=2
(C/'plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2))
# Voice copy is explicitly voice-only; the mix producer must use this as its input.
shutil.copy2(C/(ID+'.wav'),C/(ID+'.voice.wav'))
with wave.open(str(C/(ID+'.wav'))) as w:
    assert abs(w.getnframes()/24000-timed['duration'])<1/24000
    pcm=w.readframes(w.getnframes())
assert pcm[:96000]==b'\0'*96000 and pcm[96000:]==samples
record={'silentIntroSeconds':2,'durationBefore':old_duration,'duration':timed['duration'],'voiceUnchangedAfterSample48000':True,'masterRow1HasNoSubtitle':True,'archive':str(archive),'voiceSha256':hashlib.sha256((C/(ID+'.voice.wav')).read_bytes()).hexdigest(),'firstVoicedCaptionStart':timed['scenes'][0]['captions'][0]['start']}
(C/'silent-intro-record.json').write_text(json.dumps(record,ensure_ascii=False,indent=2))
print(json.dumps(record,ensure_ascii=False))
