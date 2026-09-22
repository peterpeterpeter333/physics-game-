"""Extract actual MP4 frames for an editorial audit; never alters app media."""
import json, subprocess, os, sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import imageio_ffmpeg
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('EM_REVIEW_OUT','/private/tmp/physics-video-review'))
OUT.mkdir(exist_ok=True)
movies=json.loads((ROOT/'src/content/em-video-catalog.generated.json').read_text())
if len(sys.argv)>1:movies=[m for m in movies if m['id'] in sys.argv[1:]]
movies=[json.loads((ROOT/'public/media/em'/f"{m['id']}.json").read_text()) for m in movies]
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
def extract(m):
    folder=OUT/m['id']; folder.mkdir(exist_ok=True)
    samples=[]
    for scene in m['scenes']:
        for i,cap in enumerate(scene['captions']):
            t=(cap['start']+cap['end'])/2
            file=folder/f"{scene['index']:02d}-{i}.png"
            # Always extract the current movie; a reused filename is not evidence of freshness.
            subprocess.run([ffmpeg,'-v','error','-ss',str(t),'-i',str(ROOT/'public/media/em'/f"{m['id']}.mp4"),'-frames:v','1','-y',str(file)],check=True)
            samples.append({'file':str(file),'time':t,'start':cap['start'],'end':cap['end'],'scene':scene['index']+1,'caption':cap['text']})
    sheet=Image.new('RGB',(1280,410*((len(samples)+1)//2)), '#182137')
    d=ImageDraw.Draw(sheet)
    for i,s in enumerate(samples):
        x=(i%2)*640;y=(i//2)*410
        sheet.paste(Image.open(s['file']).resize((640,380)),(x,y+25))
        d.text((x+8,y+5),f"{m['id']}  {s['time']:.2f}s  scene {s['scene']}",fill='white')
    sheet.save(folder/'sheet.jpg',quality=94)
    return dict(id=m['id'],stage=m['stageId'],title=m['title'],samples=samples)
with ThreadPoolExecutor(max_workers=3) as pool:
    result=[]
    for m in pool.map(extract,movies):
        result.append(m);print(f"{len(result)}/{len(movies)} {m['id']}",flush=True)
(OUT/'frames.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print('DONE',sum(len(m['samples']) for m in result),flush=True)
