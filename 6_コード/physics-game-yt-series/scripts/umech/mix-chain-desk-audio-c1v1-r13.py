"""Same preserved voice/music mix; only synchronize row34's eight domino sounds.

Prior mixed.wav/levels/mix files are protected and never overwritten.
"""
import os,sys,json,hashlib
from pathlib import Path

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def main():
    root=Path(__file__).resolve().parent;cache=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/ys/ys-chain-c1v1'));cid='ys-chain-c1v1'
    os.environ.setdefault('EM_FILM_CACHE',str(cache))
    base=root/'mix-chain-desk-audio-c1v1.py';source=base.read_text();base_sha=sha(base)
    substitutions={"K['arm:domino'][1]['start']+j*.08":"K['arm:domino'][1]['start']+.8+j*.08","cid+'.mixed.wav'":"cid+'.r13.mixed.wav'","cid+'.levels.json'":"cid+'.r13.levels.json'","cid+'.mix.json'":"cid+'.r13.mix.json'"}
    for before,after in substitutions.items():assert source.count(before)==1;source=source.replace(before,after)
    protected={str(cache/(cid+suffix)):sha(cache/(cid+suffix)) for suffix in ['.wav','.voice.wav','.mixed.wav','.levels.json','.mix.json','.json']}
    for suffix in ['.r13.mixed.wav','.r13.levels.json','.r13.mix.json']:assert not (cache/(cid+suffix)).exists(),'Preserve previous r13 mix output'
    sys.path.insert(0,str(root));ns={'__file__':str(base),'__name__':'c1_preserved_mix_render_only'};exec(compile(source,str(base),'exec'),ns);ns['main'](cid)
    assert sha(base)==base_sha and all(sha(p)==h for p,h in protected.items())
    levels=json.loads((cache/(cid+'.r13.levels.json')).read_text());assert abs(levels['integrated_lufs']+14)<.3 and levels['quiet_runs_below_-35dB_0.25s']==[]
    evidence={'approvedRow34Only':True,'voiceAndInputTimingUnchanged':True,'oldMixAndSourcesUnchanged':True,'protectedSha256':protected,'baseMixer':str(base),'baseMixerSha256':base_sha,'renderOnlySubstitutions':substitutions,'newMixSha256':sha(cache/(cid+'.r13.mixed.wav')),'dominoSfx':[x for x in levels['sfx'] if x[0]=='domino'],'integratedLufs':levels['integrated_lufs'],'peakDbfs':levels['peak_dbfs'],'quietRuns':levels['quiet_runs_below_-35dB_0.25s']}
    (cache/'c1-r13-mix-provenance.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=1));print(json.dumps(evidence,ensure_ascii=False,indent=1))

if __name__=='__main__':main()
