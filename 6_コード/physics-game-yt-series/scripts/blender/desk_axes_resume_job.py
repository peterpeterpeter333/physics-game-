"""Resume only the new four episode scenes; the original scripts and audio are read-only."""
import os,sys,runpy,traceback,contextlib,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
def run_episode(ep,extra,cache=None,problem=False):
    cache=cache or '/private/tmp/ys/ys-chain-'+ep+'v1'
    os.makedirs(cache,exist_ok=True)
    log=open(cache+'/'+ep+'-resume-gui.log','a',buffering=1)
    sys.argv=['desk_'+ep+'v1.py','--','--cache',cache]+extra
    try:
        with contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'START',sys.argv,flush=True)
            ns=runpy.run_path(W+'/scripts/blender/desk_'+ep+'v1.py',run_name='__main__')
            if problem:
                ns['A'].out=cache+'/problem-r3'
                ns['problem']()
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'DONE',flush=True)
        return ns
    except BaseException:
        traceback.print_exc(file=log);return None
nsD1r3=run_episode('d1',['--times','54.8,194,302.7,389,403.3','--out','/private/tmp/ys/ys-chain-d1v1-render/blender/landmarks-d1v1-r3'],cache='/private/tmp/ys/ys-chain-d1v1-render',problem=True)
nsB1catalog=run_episode('b1',['--catalog'])
