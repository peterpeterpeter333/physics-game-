"""Save only the four task-owned scenes to a new library, never a user file."""
import bpy,hashlib,json,os,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
out=W+'/outputs/axes-20261023/axes_scenes_checkpoint_20261024.blend'
if os.path.exists(out):raise RuntimeError('Preserve existing scene checkpoint')
spaces={'b1':nsB1r6['main'].__globals__,'c1':nsC1['main'].__globals__,'d1':nsD1['main'].__globals__,'e1':nsE1['apply'].__globals__}
scenes={ep:g['d'].SC for ep,g in spaces.items()}
assert len({s.name for s in scenes.values()})==4
before=bpy.data.filepath
bpy.data.libraries.write(out,set(scenes.values()),fake_user=True,compress=True)
assert bpy.data.filepath==before, 'Saving a library must not replace the open user file'
assert os.path.isfile(out) and os.path.getsize(out)>1000
json.dump({'purpose':'unfinished task scene checkpoint, NOT four finished videos','date':time.strftime('%Y-%m-%d %H:%M:%S'),'file':out,'bytes':os.path.getsize(out),'sha256':hashlib.sha256(open(out,'rb').read()).hexdigest(),'scenes':{e:s.name for e,s in scenes.items()},'sourceSha256':{e:hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest() for e,g in spaces.items()},'openBlendFileUnchanged':before,'externalTexturePathsMayStillReferToCaches':True,'originalVideoAudioAndScriptsUntouched':True},open(out+'.json','w'),ensure_ascii=False,indent=2)
print('Saved four owned scene library without replacing current file:',out,os.path.getsize(out),flush=True)
