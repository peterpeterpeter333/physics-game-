"""Small six-tile record of existing D production raw. No rendering/encoding."""
import hashlib,json
from pathlib import Path
from PIL import Image,ImageDraw
P=Path('/private/tmp/ys/ys-chain-d1v1-production-r15/blender/desk')
OUT=Path('/private/tmp/ys/ys-chain-d1v1-render/d1-old-local-contact-20261024')
assert not OUT.exists();OUT.mkdir()
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
sheet=Image.new('RGB',(1080,1344),'#f4e8cc');rows=[]
for i,(frame,label)in enumerate([(3618,'120.6s before turn'),(3645,'121.5s midway turn'),(3669,'122.3s after turn'),(10170,'339.0s joined valve'),(10194,'339.8s release'),(10248,'341.6s separated')]):
    p=P/('%05d.jpg'%frame);im=Image.open(p).convert('RGB');assert im.size==(1080,1920);im=im.resize((360,640),Image.Resampling.LANCZOS)
    x=(i%3)*360;y=(i//3)*672;sheet.paste(im,(x,y+32));ImageDraw.Draw(sheet).text((x+8,y+8),label,fill='#24180c')
    rows.append({'frame':frame,'time':frame/30,'path':str(p),'sha256':sha(p),'actuallyViewedByThisScript':False})
target=OUT/'existing-raw-six.jpg';sheet.save(target,quality=92)
report={'episode':'D-1','kind':'Existing original production raw contact sheet, no new GPU frames','images':rows,'contactSheet':str(target),'contactSheetSha256':sha(target),'finalMp4':False,'actualEyereviewNotInferredFromContactCreation':True,'sourceRawUntouched':True}
(OUT/'manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=1))
print(json.dumps({'contactSheet':str(target),'manifest':str(OUT/'manifest.json'),'sha256':sha(OUT/'manifest.json')}))
