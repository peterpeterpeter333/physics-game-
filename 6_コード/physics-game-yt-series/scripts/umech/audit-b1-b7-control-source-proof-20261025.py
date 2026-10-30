"""Read existing18 JPEG headers/quantization and exact B4→B3 lineage only.
No image load/pixel decode/save, Blender, render, encode or existing-file edits.
"""
from pathlib import Path
import hashlib,json,time
import PIL
from PIL import Image

W=Path(__file__).resolve().parents[2]
C=Path('/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-v2-20261025')
B3=Path('/private/tmp/ys/ys-chain-b1v1-score-entries-d1-v2-20261024/render')
OUT=W/'outputs/axes-20261023/b1-b7-control18-source-quantization-proof-20261025.json'
PINS={C/'composite-provenance.json':'685711993fb83cc22f55e22ae3d81a359ce9c58aea4a8efd38c82caf9629460d',
 C/'blender/delivered-camera-poses.json':'aa4106563b81e8afc8d33c4eb1d19d58ace2e0b706330409bb48ed1a070d883f',
 B3/'report.json':'dcccf2cfa6162b40e6d063b6a0261d8df2bcb7e37f7f1fef208e5577fdcedba6',
 W/'scripts/blender/desk_axes_b1_score_entries_d1_v2_20261024.py':'ec6d7cebb1b285518df2eadda60740ab2d39a9e031c50c98e9a82a0bb9b79a8f',
 W/'scripts/blender/desk_lib.py':'5c919a1f2336a7320736e153a0604f652422c26dc9c05ad134a50cae6e82e4d2'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def canonical(x):return json.dumps(x,sort_keys=True,separators=(',',':'),allow_nan=False).encode()
# JPEG Annex K standard quantization tables, natural8x8 order used by Pillow.
STD_LUMA=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99]
STD_CHROMA=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99]
expected={0:[max(1,min(255,(x*16+50)//100))for x in STD_LUMA],1:[max(1,min(255,(x*16+50)//100))for x in STD_CHROMA]}
assert not OUT.exists()
for p,h in PINS.items():assert sha(p)==h,p
v=read(C/'composite-provenance.json');poses=read(C/'blender/delivered-camera-poses.json')['poses'];b=read(B3/'report.json')
physical={r['frame']:r for r in b['physical']};mapping={int(j):int(k)for j,k in b['replacementFrameToActualPatchFrame'].items()};refs={int(j):int(k)for j,k in b['patchFrameToUnchangedObjectSourceFrame'].items()}
rows=[]
for j in range(4124,4142):
 r=v['records'][j];p=Path(r['source']);before=p.stat();assert p==B3/'blender/patch'/('%05d.jpg'%j)
 assert r['kind']=='byte-identical-B3-delivered-raw'and r['previousB3Record']['kind']=='actual-B3-score-placement-and-entry-camera'
 assert mapping[j]==j and r['previousB3Record']['actualPatchFrame']==j and refs[j]==r['originalObjectSourceFrame']
 assert r['sha256']==r['previousB3Record']['sha256']==sha(p)and(C/'blender/desk'/('%05d.jpg'%j)).resolve()==p.resolve()
 assert physical[j]['pose']==poses[j]and physical[j]['unchangedObjectSourceFrame']==refs[j]
 with Image.open(p)as im:
  assert im.format=='JPEG'and im.size==(1080,1920)and im.quantization==expected
  q={str(k):list(z)for k,z in im.quantization.items()};header={'format':im.format,'size':list(im.size),'mode':im.mode,'jpegComponents':im.layer,'quantization':q,'quantizationSha256':hashlib.sha256(canonical(q)).hexdigest()}
 assert p.stat()==before and sha(p)==r['sha256']
 rows.append({'frame':j,'source':str(p),'sourceSha256':r['sha256'],'otherObjectSourceFrame':refs[j],'actualB3PatchFrame':j,'pose':poses[j],**header,'standardQuality92TablesExact':True,'pixelDecodePerformed':False})
assert len(rows)==18 and len({r['quantizationSha256']for r in rows})==1
for p,h in PINS.items():assert sha(p)==h,p
report={'episode':'B-1','kind':'Actual18 control-source lineage and JPEG header proof, not rendered control success','createdAt':time.time(),'script':str(Path(__file__).resolve()),'scriptSha256':sha(__file__),'PillowVersion':PIL.__version__,
 'inputsSha256':{str(p):h for p,h in PINS.items()},'rows':rows,'all18ActualSourcesAreB3RawNotB6':True,'all18PoseAndRefMatchOriginalB3Report':True,'all18JpegTablesIdenticalAndExactStandard92':True,
 'controlSettingsRequired':{'resolution':[1080,1920,100],'engine':'BLENDER_EEVEE','taaRenderSamples':16,'jpegQuality':92,'jpegQuantizationMustMatchTheListedFullActualTables':True},
 'evidenceLimit':'The B3 helper sets1080x1920/JPEG/16samples without changing quality; the shared source sets92, independently confirmed by every actual JPEG full quantization table. This does not establish future render pixel equality.',
 'controlImagesActuallyRendered':False,'controlPixelEqualityVerified':False,'blenderOrGPUUsed':False,'imagePixelsDecoded':False,'originalFilesModified':False,'finalAcceptance':False}
with OUT.open('x')as f:json.dump(report,f,ensure_ascii=False,indent=1,allow_nan=False);f.write('\n')
print(json.dumps({'path':str(OUT),'sha256':sha(OUT),'actualSources':18,'quality92TablesExact':True,'controlPixelEqualityVerified':False,'GPU':False}))
