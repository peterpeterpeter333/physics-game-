"""D1-only actual still comparison using the unchanged original gmap/corr.

This is a preview diagnostic, never a substitute for the full encoded gate10.
"""
import argparse,hashlib,importlib.util,json,pathlib,tempfile,time
ap=argparse.ArgumentParser();ap.add_argument('--first',nargs='+',required=True);ap.add_argument('--last',nargs='+',required=True);ap.add_argument('--out',required=True);args=ap.parse_args()
target=pathlib.Path(args.out)
if target.exists():raise RuntimeError('Existing D1 ends diagnostic preserved')
base=pathlib.Path(__file__).resolve().parent;original_path=base/'desk-quality-gate-frames.py'
spec=importlib.util.spec_from_file_location('d1_original_ends',original_path);original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
files=[pathlib.Path(p).resolve() for p in args.first+args.last]
assert all(p.is_file() for p in files),'Actual D1 preview images required'
with tempfile.TemporaryDirectory(prefix='d1-ends-',dir='/private/tmp') as temp:
    listing=pathlib.Path(temp)/'frames.txt';listing.write_text('ffconcat version 1.0\n'+''.join("file '%s'\nduration 1\n"%str(p).replace("'","'\\''") for p in files))
    maps=[original.gmap(original.gray(img)) for img in original.run_frames(ff,['-f','concat','-safe','0','-i',str(listing),'-vf','scale=270:480:flags=area','-fps_mode','passthrough'],270,480)]
assert len(maps)==len(files),'Diagnostic images incomplete'
n=len(args.first);pairs=[{'first':str(files[a]),'last':str(files[b]),'correlation':original.corr(maps[a],maps[b])} for a in range(n) for b in range(n,len(files))]
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
record={'episode':'D-1','status':'actual preview still diagnostic only; not encoded MP4 gate10','createdAt':time.strftime('%Y-%m-%d %H:%M:%S'),'originalFeatures':str(original_path),'originalFeaturesSha256':sha(original_path),'resize':'scale=270:480:flags=area','best':max(pairs,key=lambda p:p['correlation']),'pairs':pairs,'inputs':[{'path':str(p),'sha256':sha(p)} for p in files]}
target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(record,ensure_ascii=False,indent=1));print(json.dumps(record,ensure_ascii=False,indent=1))
