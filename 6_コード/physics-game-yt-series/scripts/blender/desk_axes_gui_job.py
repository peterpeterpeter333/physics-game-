"""Explicit GUI job entry. Read-only source scripts; only new episode output locations."""
import os,sys,runpy,traceback,contextlib,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
def run_job(episode,extra,cache=None,catalog=False,problem=False):
    cid='ys-chain-'+episode+'v1';cache=cache or '/private/tmp/ys/'+cid
    os.makedirs(cache,exist_ok=True)
    log=open(cache+'/'+episode+'-gui-job.log','a',buffering=1)
    sys.argv=['desk_'+episode+'v1.py','--','--cache',cache]+extra
    try:
        with contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'START',sys.argv,flush=True)
            ns=runpy.run_path(W+'/scripts/blender/desk_'+episode+'v1.py',run_name='__main__')
            if catalog or problem:ns['A'].out=None
            if catalog:ns['catalog']()
            if problem:ns['problem']()
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'DONE',flush=True)
        return ns
    except BaseException:traceback.print_exc(file=log);return None
nsD1r2=run_job('d1',['--times','4,24.5,54.8,84.3,104.5,126.17,140.5,210.7,263.9,302.7,341.6,403.3,157,175,194,296,318,352,369,389','--out','/private/tmp/ys/ys-chain-d1v1-render/blender/landmarks-d1v1'],cache='/private/tmp/ys/ys-chain-d1v1-render',catalog=True,problem=True)
nsE1gate=run_job('e1',['--catalog'])
nsE1preview=run_job('e1',['--times','1.5,31.5,38.5,55.2,81.8,131,156.8,199.5,233.8,260.5,318.8,385','--out','/private/tmp/ys/ys-chain-e1v1/blender/gate12'])
