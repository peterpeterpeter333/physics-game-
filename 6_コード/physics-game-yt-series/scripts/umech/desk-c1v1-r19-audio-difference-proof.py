"""Read-only PCM proof: old r13 vs new r19, two expected moved-tone windows.

No synthesis, playback, original audio edits, or changes to any inspector.
"""
import hashlib,json,wave
from pathlib import Path
import numpy as np
C=Path('/private/tmp/ys/ys-chain-c1v1');OUT=C/'c1-r19-audio-difference-proof.json'
assert not OUT.exists()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def pcm(p):
    with wave.open(str(p)) as w:
        assert (w.getnchannels(),w.getsampwidth(),w.getframerate())==(1,2,24000)
        return np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').copy()
old=C/'ys-chain-c1v1.r13.mixed.wav';new=C/'ys-chain-c1v1.r19.mixed.wav';a=pcm(old);b=pcm(new);assert a.shape==b.shape
ol=json.loads((C/'ys-chain-c1v1.r13.levels.json').read_text());nl=json.loads((C/'ys-chain-c1v1.r19.levels.json').read_text());assert ol['gain']==nl['gain']
times=[307.65266666666673,312.4676666666667];margin=.02;duration=.45;allowed=np.zeros(len(a),dtype=bool)
for t in times:allowed[max(0,int((t-margin)*24000)):min(len(a),int((t+duration+margin)*24000)+1)]=True
changed=a!=b;outside=np.flatnonzero(changed&~allowed);assert len(outside)==0,'Unexpected mixed PCM changed outside moved point-tone windows'
ix=np.flatnonzero(changed);windows=[]
for t in times:
    q=np.flatnonzero(changed& (np.arange(len(a))/24000>=t-margin)&(np.arange(len(a))/24000<=t+duration+margin))
    windows.append({'expectedToneStart':t,'expectedToneSeconds':duration,'limiterGuardSeconds':margin,'actualChangedSamples':len(q),'actualFirstChange':float(q[0]/24000),'actualLastChange':float(q[-1]/24000)})
voice=C/'ys-chain-c1v1.voice.wav';assert sha(voice)=='57565f6d6f812410201859591b435be76279b36156acaa5baae19d0bdf358a48'
report={'sourceSha256':sha(Path(__file__)),'oldMixedSha256':sha(old),'newMixedSha256':sha(new),'voiceSha256':sha(voice),'suppliedVoiceFileUnchanged':True,'sampleRate':24000,'samples':len(a),'oldAndNewNormalizationGainEqual':True,'normalizationGain':nl['gain'],'changedPcmSamples':int(changed.sum()),'unchangedPcmSamples':int((~changed).sum()),'expectedMovedToneWindows':windows,'changedSamplesOutsideExpectedWindows':0,'allMixedPcmOutsideMovedToneWindowsByteIdentical':True,'earsVerified':False,'notAReplacementForFinalAudioInspector':True}
OUT.write_text(json.dumps(report,ensure_ascii=False,indent=1));print(json.dumps(report,ensure_ascii=False,indent=1))
