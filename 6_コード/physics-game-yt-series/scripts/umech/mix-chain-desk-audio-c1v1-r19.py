"""Private derivative: preserve supplied voice, move only row38 low point SFX.

The already-approved row34 eight clacks stay delayed .8 seconds. The complete
deterministic original recipe is reused; loudness normalization is recalculated.
All original and r13 mix files are protected, never overwritten.
"""
import os,sys,json,hashlib
from pathlib import Path
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
    root=Path(__file__).resolve().parent;cache=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/ys/ys-chain-c1v1'));cid='ys-chain-c1v1';base=root/'mix-chain-desk-audio-c1v1.py'
    os.environ.setdefault('EM_FILM_CACHE',str(cache));source=base.read_text();base_sha=sha(base)
    changes={"K['arm:domino'][1]['start']+j*.08":"K['arm:domino'][1]['start']+.8+j*.08","tt=c['start']+a.phrase_time(q['subtitle'],q['score']['at'])":"tt=D['effects']['toll'] if q['score']['make']==1 else c['start']+a.phrase_time(q['subtitle'],q['score']['at'])","cid+'.mixed.wav'":"cid+'.r19.mixed.wav'","cid+'.levels.json'":"cid+'.r19.levels.json'","cid+'.mix.json'":"cid+'.r19.mix.json'"}
    for before,after in changes.items():assert source.count(before)==1;source=source.replace(before,after)
    protected={str(cache/(cid+x)):sha(cache/(cid+x)) for x in ['.wav','.voice.wav','.json','.mixed.wav','.levels.json','.mix.json','.r13.mixed.wav','.r13.levels.json','.r13.mix.json']}
    for x in ['.r19.mixed.wav','.r19.levels.json','.r19.mix.json']:assert not (cache/(cid+x)).exists(),'Preserve previous mix output'
    voice_sha=sha(cache/(cid+'.voice.wav'));assert voice_sha=='57565f6d6f812410201859591b435be76279b36156acaa5baae19d0bdf358a48'
    sys.path.insert(0,str(root));ns={'__file__':str(base),'__name__':'c1_private_final_point_timing'};exec(compile(source,str(base),'exec'),ns);ns['main'](cid)
    assert sha(base)==base_sha and all(sha(p)==h for p,h in protected.items())
    levels=json.loads((cache/(cid+'.r19.levels.json')).read_text());data=json.loads((cache/'blender/data.json').read_text());point=data['effects']['toll']
    assert abs(point-312.4676666666667)<1e-8 and abs(levels['integrated_lufs']+14)<.3 and levels['quiet_runs_below_-35dB_0.25s']==[]
    assert abs([x[1] for x in levels['sfx'] if x[0]=='score'][-1]-point)<.0001
    report={'revision':'r19-row38-low-point-after-voice','oldPointTime':data['effects']['price'],'newPointTime':point,'voiceEnd':next(c['voiceEnd'] for c in data['cues'] if c['key']=='dad:price'),'sourceSha256':sha(__file__),'baseMixerSha256':base_sha,'protectedSha256':protected,'substitutions':changes,'suppliedVoiceWaveformUnchanged':True,'voiceSha256':voice_sha,'newMixSha256':sha(cache/(cid+'.r19.mixed.wav')),'oldMixedAudioUnchanged':True,'mixedAudioIsNotTheOldMix':True,'onlySfxTimingRecipeChangedAndLoudnessNormalizationRecalculated':True,'dominoSfx':[x for x in levels['sfx'] if x[0]=='domino'],'scoreSfx':[x for x in levels['sfx'] if x[0]=='score'],'integratedLufs':levels['integrated_lufs'],'peakDbfs':levels['peak_dbfs'],'quietRuns':levels['quiet_runs_below_-35dB_0.25s'],'earsVerified':False}
    (cache/'c1-r19-mix-provenance.json').write_text(json.dumps(report,ensure_ascii=False,indent=1));print(json.dumps(report,ensure_ascii=False,indent=1))
if __name__=='__main__':main()
