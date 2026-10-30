"""Rebuild the four new scenes after recovering the renderer; no old files touched."""
import os,sys,json,time,runpy,traceback,contextlib
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
def fresh_episode(ep,cache,extra):
    log=open(cache+'/'+ep+'-batch3-gui.log','a',buffering=1)
    with contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'START',extra,flush=True)
            sys.argv=['desk_'+ep+'v1.py','--','--cache',cache]+extra
            ns=runpy.run_path(W+'/scripts/blender/desk_'+ep+'v1.py',run_name='__main__' if ep in ['c1','e1'] else 'axes_preview_'+ep)
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'BUILT',len(ns['d'].SC.objects),flush=True)
            if ep=='b1':
                ns['A'].force=True;ns['catalog']()
                times=sorted(set(round(t*30)/30 for t in ns['DATA']['preview']+[c['end']-.2 for c in ns['CUES']]))
                json.dump({'times':times,'frames':[round(t*30) for t in times]},open(cache+'/blender/preview-times-b1v1.json','w'),indent=1)
                ns['A'].times=','.join(map(str,times));ns['A'].out=cache+'/blender/preview';ns['main']();ns['write_problem']()
            elif ep=='d1':
                ns['main']();ns['A'].out=cache+'/blender/catalog-d1v1-r4';ns['catalog']();ns['A'].out=cache+'/problem-r4';ns['problem']()
            elif ep=='c1':
                ns['A'].force=True
                extra=[37.63133333333333,182.676,288.4333333333334,295.45933333333335,284.13333333333344]
                base=ns['DATA']['previews']+ns['DATA'].get('extraPreviews',[])
                times=sorted(set(round(t*30)/30 for t in base+extra))
                ns['A'].times=','.join(map(str,times));ns['A'].out=cache+'/blender/preview';ns['main']()
                json.dump({'times':times},open(cache+'/blender/batch3-times.json','w'),indent=1)
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'DONE',flush=True);return ns
        except BaseException:traceback.print_exc(file=log)
nsB1=fresh_episode('b1','/private/tmp/ys/ys-chain-b1v1',[])
nsD1=fresh_episode('d1','/private/tmp/ys/ys-chain-d1v1-render',['--times','4,24.5,54.8,84.3,104.5,126.17,140.5,157,165,175,180,194,210.7,263.9,296,302.7,318,325.9,332.7,334.2,341.6,352,369,389,403.3','--out','/private/tmp/ys/ys-chain-d1v1-render/blender/landmarks-d1v1-r4','--force'])
nsC1=fresh_episode('c1','/private/tmp/ys/ys-chain-c1v1',['--gates','--force'])
e1_frozen=json.load(open('/private/tmp/ys/ys-chain-e1v1/e1v1-r2-source-freeze.json'))
nsE1=fresh_episode('e1','/private/tmp/ys/ys-chain-e1v1',e1_frozen['preview']['args'])
