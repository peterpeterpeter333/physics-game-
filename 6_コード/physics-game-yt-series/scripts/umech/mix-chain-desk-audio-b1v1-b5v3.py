"""Root-authorized B5v3 SE synchronization, new mixed files only.

Move turn97.08→97.65 and return-click98.15→98.60. Keep supplied voice,
music, other SE, duration and every original source/mix file unchanged.
"""
import os,sys,json,hashlib,wave
from pathlib import Path
import numpy as np
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def pcm(p):
    with wave.open(str(p)) as w:
        assert (w.getnchannels(),w.getsampwidth(),w.getframerate())==(1,2,24000)
        return np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').copy()
def main():
    scripts=Path(__file__).resolve().parent;cache=Path('/private/tmp/ys/ys-chain-b1v1');cid='ys-chain-b1v1';base=scripts/'mix-chain-desk-audio-b1v1.py';out=cache/(cid+'.b5v3.mixed.wav');report_file=cache/'b1-b5v3-sfx-provenance.json'
    os.environ['EM_FILM_CACHE']=str(cache)
    for p in [out,cache/(cid+'.b5v3.levels.json'),report_file]:assert not p.exists(),'Preserve existing B derivative output'
    source=base.read_text();assert sha(base)=='d8903b27ded36ccd13dedbb2e8a03c92fadbd54e4844832c0ccaa331a98af3cf'
    changes={"hit('turn',97.08,":"hit('turn',97.65,","hit('magnet-return',98.15,":"hit('magnet-return',98.60,","cid+'.mixed.wav'":"cid+'.b5v3.mixed.wav'","cid+'.levels.json'":"cid+'.b5v3.levels.json'","levels={'integrated_lufs':":"levels={'normalization_gain':gain,'integrated_lufs':"}
    for before,after in changes.items():assert source.count(before)==1;source=source.replace(before,after)
    protected={str(p):sha(p) for p in [base,cache/(cid+'.wav'),cache/(cid+'.mixed.wav'),cache/(cid+'.levels.json'),cache/'plan.json',cache/(cid+'.json'),cache/'phrase-times.json',cache/'blender/data.json']}
    voice_sha=sha(cache/(cid+'.wav'));assert voice_sha=='9422c88f5c925d717c4d6fe2fd40b4d091c460f533465c5d97df75111e8f8d91'
    sys.path.insert(0,str(scripts));ns={'__file__':str(base),'__name__':'private_b5v3_sfx_timing'};exec(compile(source,str(base),'exec'),ns);ns['main']()
    assert all(sha(p)==h for p,h in protected.items())
    old_levels=json.loads((cache/(cid+'.levels.json')).read_text());levels=json.loads((cache/(cid+'.b5v3.levels.json')).read_text());old=pcm(cache/(cid+'.mixed.wav'));new=pcm(out);assert old.shape==new.shape
    assert levels['sfx']==[[name,97.65 if name=='turn' else 98.60 if name=='magnet-return' else t] for name,t in old_levels['sfx']]
    assert levels['music_spans']==old_levels['music_spans'] and abs(levels['integrated_lufs']+14)<.25 and not levels['quiet_runs']
    events=[{'event':'turn','old':97.08,'new':97.65,'duration':.35},{'event':'magnet-return','old':98.15,'new':98.60,'duration':.06}];mask=np.zeros(len(old),dtype=bool);changed=old!=new;margin=.02
    for event in events:
        evidence=[]
        for field in ['old','new']:
            start=event[field];lo=max(0,int((start-margin)*24000));hi=min(len(old),int((start+event['duration']+margin)*24000)+1);mask[lo:hi]=True;ix=np.flatnonzero(changed[lo:hi])+lo
            evidence.append({'which':field,'expectedStart':start,'duration':event['duration'],'changedSamples':len(ix),'firstChange':float(ix[0]/24000) if len(ix) else None,'lastChange':float(ix[-1]/24000) if len(ix) else None})
        event['actualDifferenceSubwindows']=evidence
    outside=int(np.count_nonzero(changed&~mask));report={'revision':'B5v3-two-SE-events-only','sourceSha256':sha(__file__),'baseMixerSha256':sha(base),'protectedInputSha256':protected,'oldMixedSha256':protected[str(cache/(cid+'.mixed.wav'))],'newMixed':str(out),'newMixSha256':sha(out),'voiceSha256':voice_sha,'suppliedVoiceWaveformUnchanged':True,'originalMixAndSourcesUnchanged':True,'musicAndOtherSeRecipeUnchanged':True,'sfxTimingSubstitutions':changes,'sampleRate':24000,'samples':len(old),'duration':len(old)/24000,'expectedMovedEventGroups':events,'limiterGuardSeconds':margin,'changedPcmSamples':int(changed.sum()),'unchangedPcmSamples':int((~changed).sum()),'changedSamplesOutsideExpectedEventSubwindows':outside,'allPcmOutsideMovedTwoEventGroupsByteIdentical':outside==0,'integratedLufs':levels['integrated_lufs'],'peakDbfs':levels['true_peak_dbfs'],'quietRuns':levels['quiet_runs'],'earsVerified':False,'notAReplacementForFinalAACInspectors':True}
    report_file.write_text(json.dumps(report,ensure_ascii=False,indent=1));assert outside==0,'Unexpected PCM changes outside the moved two event groups; evidence preserved, do not accept'
    print(json.dumps(report,ensure_ascii=False,indent=1))
if __name__=='__main__':main()
