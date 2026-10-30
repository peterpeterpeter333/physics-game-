// Read-only old-3D reuse preflight. Writes only a fresh W/outputs QA directory.
// No Blender, no A production desk/cache writes, no nearby-frame fallback.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import sharp from 'sharp';

const W=path.resolve(new URL('../..',import.meta.url).pathname),id='ys-chain-d1a';
const inputCache='/private/tmp/ys/ys-chain-d1a_gpt_20261026';
const sourcePath=path.join(W,'scripts/blender/desk_d1a_gpt_20261026.py');
const backup=path.join(W,'outputs/axes-20261023/d1v1-3d-frames-backup-20261026/desk');
const oldAssets=path.join(W,'scripts/blender/desk_assets/d1v1'),aAssets=path.join(W,'scripts/blender/desk_assets/d1a');
const qa=path.join(W,'outputs/d1ab-gpt-20261026/qa');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const stamp=p=>({path:p,bytes:fs.statSync(p).size,sha256:sha(fs.readFileSync(p))});
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','Never use nearby raw fallback.');
const sourceText=fs.readFileSync(sourcePath,'utf8'),sourceSha=sha(sourceText);
const reuseProgram=path.join(W,'scripts/umech/desk-d1a-reuse-map_gpt_20261026.mjs');
const mapped=spawnSync(process.execPath,[reuseProgram],{cwd:W,encoding:'utf8'});
assert.equal(mapped.status,0,mapped.stderr);const reuseMap=JSON.parse(mapped.stdout);
assert.equal(reuseMap.reuseCueCount,24);assert.equal(fs.realpathSync(reuseMap.source3D),fs.realpathSync(backup));
const excluded=['can:crush','can:mio','air:inside'];
const targetCues=reuseMap.rows.filter(r=>r.reuseEligible&&!excluded.includes(r.key));assert.equal(targetCues.length,21);
const timed=read(inputCache+'/'+id+'.json'),data=read(inputCache+'/blender/data.json'),nf=Math.ceil(timed.duration*30);
assert.equal(sha(fs.readFileSync(inputCache+'/'+id+'.json')),sha(fs.readFileSync(aAssets+'/'+id+'.json')),'A timed/caption file must equal supplied asset.');
assert.equal(sha(fs.readFileSync(inputCache+'/phrase-times.json')),sha(fs.readFileSync(aAssets+'/phrase-times.json')));
const oldTimed=read(oldAssets+'/ys-chain-d1v1.json');
const oldAnchorsPath=backup+'/anchors.json',oldAnchors=read(oldAnchorsPath);
assert.equal(oldAnchors.fps,30);assert.equal(oldAnchors.frames,Math.ceil(oldTimed.duration*30));
assert.equal(stamp(oldAnchorsPath).sha256,stamp(inputCache+'/blender/reuse-anchors_gpt_20261026.json').sha256,'Canonical old anchors and A supplied reuse copy must match.');
const sampleMap=new Map();
function add(j,reason,cue){
 assert.ok(j>=Math.ceil(cue.start*30-1e-8)&&j<=Math.floor((cue.end-1e-7)*30),'Sample must stay strictly inside its A cue.');
 if(!sampleMap.has(j))sampleMap.set(j,{frame:j,time:j/30,key:cue.key,reasons:[]});
 assert.equal(sampleMap.get(j).key,cue.key);sampleMap.get(j).reasons.push(reason);
}
for(const c of targetCues){
 for(let sec=Math.ceil(c.start);sec<c.end;sec++)add(sec*30,'one-hz',c);
 add(Math.ceil(c.start*30-1e-8),'cue-first-visible',c);
 add(Math.floor((c.end-1e-7)*30),'cue-last-visible',c);
}
const samples=[...sampleMap.values()].sort((a,b)=>a.frame-b.frame);
// Parse the exact snapshot's sets/functions and execute ONLY reuse_frame,
// cue_at, old_points. No bpy import or Blender source top-level runs.
const python=String.raw`import ast,json,sys,math,os,bisect,types,hashlib
p=json.load(sys.stdin); src=p['source']; tree=ast.parse(src)
def assigned(name):
    for n in tree.body:
        if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id==name for t in n.targets): return ast.literal_eval(n.value)
    raise KeyError(name)
def func(name):
    return ast.get_source_segment(src,next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name==name))
allowed=assigned('REUSE_ALLOWED'); redraw=assigned('REQUIRED_REDRAW')
assert redraw=={'can:crush','can:mio','air:inside'}
old={q['subtitle']:{'key':q['diagram'].replace('cd1v1-',''),'start':s['captions'][i]['start'],'end':s['captions'][i]['end']} for s in p['old']['scenes'] for i,q in enumerate(s['cues'])}
cues=p['data']['cues']; reuse={c['key']:old[c['subtitle']] for c in cues if c['key'] in allowed and c['subtitle'] in old and p['phrase'][c['subtitle']]==p['oldPhrase'][c['subtitle']]}
assert len(reuse)==24
keys=sorted(set(reuse)-redraw); assert keys==sorted(c['key'] for c in p['targetCues'])
anchorTree=ast.parse(p['anchorSource']); anchorFn=next(n for n in anchorTree.body if isinstance(n,ast.FunctionDef) and n.name=='anchors')
ret=next(n for n in ast.walk(anchorFn) if isinstance(n,ast.Return)); names=[ast.literal_eval(k) for k in ret.value.keys]+['can','fuji','gin','airpump','inlet','outlet']
g={'math':math,'os':os,'bisect':bisect,'A':types.SimpleNamespace(no_reuse=False,reuse_source=p['backup']),'REUSE':reuse,'REDRAW':redraw,'FPS':30,'OLD_NF':math.ceil(p['old']['duration']*30),'CUES':cues,'STARTS':[c['start'] for c in cues],'OLD_ANCHORS':p['anchors']['anchors'],'ANC_NAMES':names}
codes={k:func(k) for k in ['cue_at','reuse_frame','old_points']}
for f in codes.values(): exec(f,g)
rows=[]
for s in p['samples']:
    t=s['time']; assert g['cue_at'](t)['key']==s['key']; oldj=g['reuse_frame'](t); assert oldj is not None
    o=reuse[s['key']]; assert math.ceil(o['start']*30)<=oldj<=math.floor((o['end']-1e-7)*30)
    rows.append(dict(s,oldFrame=oldj,oldTime=oldj/30,oldKey=o['key'],oldStart=o['start'],oldEnd=o['end'],anchors=g['old_points'](oldj)))
fingerprint={'allowed':sorted(allowed),'redraw':sorted(redraw),'functions':codes,'anchorNames':names,'keys':keys,'mappings':{k:reuse[k] for k in keys}}
print(json.dumps({'samples':rows,'targetKeys':keys,'fingerprint':fingerprint,'mappingSha256':hashlib.sha256(json.dumps(fingerprint,sort_keys=True).encode()).hexdigest()}))
`;
const anchorSourcePath=path.join(W,'scripts/blender/desk_lib_d1_machine_claude_20261026.py');
const payload={source:sourceText,data,old:oldTimed,phrase:read(inputCache+'/phrase-times.json'),oldPhrase:read(oldAssets+'/phrase-times.json'),anchors:oldAnchors,backup,targetCues,samples,anchorSource:fs.readFileSync(anchorSourcePath,'utf8')};
const inspect=src=>{
 const r=spawnSync('python3',['-c',python],{input:JSON.stringify({...payload,source:src}),encoding:'utf8',maxBuffer:16*1024*1024});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);
};
const exact=inspect(sourceText);assert.equal(exact.samples.length,samples.length);
const out=path.join(qa,'a-reuse-preflight_gpt_20261026-'+new Date().toISOString().replace(/[:.]/g,'-'));
assert.ok(!fs.existsSync(out));const cache=out+'/isolated-cache';
for(const dir of [cache+'/blender/desk',out+'/source-snapshot_gpt_20261026',out+'/fullres',out+'/contacts'])fs.mkdirSync(dir,{recursive:true});
const inputStamps=[stamp(reuseProgram),stamp(oldAnchorsPath),stamp(anchorSourcePath)];
for(const f of ['plan.json',id+'.json','phrase-times.json','blender/data.json']){
 const src=inputCache+'/'+f,dst=cache+'/'+f;inputStamps.push(stamp(src));fs.copyFileSync(src,dst,fs.constants.COPYFILE_EXCL);
}
for(const [name,src] of [['ys-chain-d1v1.json',oldAssets+'/ys-chain-d1v1.json'],['old-phrase-times.json',oldAssets+'/phrase-times.json']])inputStamps.push(stamp(src));
fs.writeFileSync(out+'/source-snapshot_gpt_20261026/desk_d1a_gpt_20261026.py',sourceText,{flag:'wx'});
const sourceInventory=fs.readdirSync(path.join(W,'scripts/umech')).filter(f=>f.endsWith('.mjs')).sort().map(f=>stamp(path.join(W,'scripts/umech',f)));
const anchorNames=exact.fingerprint.anchorNames,ownAnchors={fps:30,frames:nf,previewOnly:true,reuseOnly:true,anchors:Object.fromEntries(anchorNames.map(n=>[n,Array.from({length:nf},()=>[0,0,false])]))};
const oldReceiptPath='/private/tmp/ys/ys-chain-d1v1-claude-fix-compose-20261025/composition-receipt.json';
const oldReceipt=read(oldReceiptPath),protectedCorrected=new Map(Object.entries(oldReceipt.protectedInputs).filter(([p])=>/\/render-[^/]+\/\d{5}\.jpg$/.test(p)).map(([p,h])=>[path.basename(p),h]));
inputStamps.push(stamp(oldReceiptPath));
for(const s of exact.samples){
 const oldName=String(s.oldFrame).padStart(5,'0')+'.jpg',src=path.join(backup,oldName),dst=path.join(cache,'blender/desk',String(s.frame).padStart(5,'0')+'.jpg');
 const before=stamp(src);if(protectedCorrected.has(oldName))assert.equal(before.sha256,protectedCorrected.get(oldName),'Old Claude corrected frame provenance mismatch: '+oldName);
 fs.copyFileSync(src,dst,fs.constants.COPYFILE_EXCL);assert.equal(stamp(dst).sha256,before.sha256);assert.equal(stamp(src).sha256,before.sha256,'Old raw changed while copying.');
 const meta=await sharp(dst).metadata();assert.equal(meta.width,1080);assert.equal(meta.height,1920);
 for(const nm of anchorNames){const v=s.anchors[nm];assert.ok(Array.isArray(v)&&v.length===3);ownAnchors.anchors[nm][s.frame]=v;}
 s.raw={...before,isolatedPath:dst,correctedClaudeProvenanceChecked:protectedCorrected.has(oldName)};
}
fs.writeFileSync(cache+'/blender/desk/anchors.json',JSON.stringify(ownAnchors),{flag:'wx'});
process.env.EM_FILM_CACHE=cache;delete process.env.DESK_ALLOW_MISSING;
await import(pathToFileURL(path.join(W,'scripts/umech/desk-d1a-hooks_gpt_20261026.mjs')));
const {vertFrame}=await import(pathToFileURL(path.join(W,'scripts/umech/frame-vert.mjs')));
const entry=read(cache+'/plan.json').find(x=>x.id===id);
const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,j)=>({...s,start:timed.scenes[j].start,end:timed.scenes[j].end,captions:timed.scenes[j].captions})),animationFPS:30,mediaDirectory:entry.mediaDirectory??'lessons'};
const full=[];
for(const s of exact.samples){
 const scene=clip.scenes.find(x=>s.time>=x.start&&s.time<x.end)??clip.scenes.at(-1),k=Math.max(0,scene.captions.findLastIndex(c=>c.start<=s.time));
 assert.equal(scene.cues[k].diagram,'cd1a-'+s.key,'Displayed A cue must match reuse mapping.');
 const svg=vertFrame(clip,scene,s.time);assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg));
 const file=path.join(out,'fullres',String(s.frame).padStart(5,'0')+'.jpg');await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).jpeg({quality:93}).toFile(file);
 const row=data.cues.find(c=>c.key===s.key).row;
 full.push({...s,row,image:file,sha256:stamp(file).sha256,svgSha256:sha(svg),personallyViewed:false});
 if(full.length%80===0)console.log(JSON.stringify({composed:full.length,total:exact.samples.length}));
}
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
async function sheets(name,list){
 const record=[],tw=360,th=640,lh=38,cols=5,per=10;
 for(let offset=0;offset<list.length;offset+=per){const page=list.slice(offset,offset+per),layers=[];
  for(let i=0;i<page.length;i++){const f=page[i],left=i%cols*tw,top=Math.floor(i/cols)*(th+lh),title=Buffer.from(`<svg width="${tw}" height="${lh}"><rect width="100%" height="100%" fill="white"/><text x="5" y="17" font-family="Arial" font-size="15">${esc(f.key)} A ${f.time.toFixed(3)}s</text><text x="5" y="33" font-family="Arial" font-size="14">row ${f.row} / A f${f.frame} / old f${f.oldFrame}</text></svg>`);layers.push({input:title,left,top},{input:await sharp(f.image).resize(tw,th).jpeg({quality:94}).toBuffer(),left,top:top+lh});}
  const file=path.join(out,'contacts',name+'-'+String(record.length+1).padStart(2,'0')+'.jpg');await sharp({create:{width:tw*cols,height:(th+lh)*2,channels:3,background:'#eee'}}).composite(layers).jpeg({quality:93}).toFile(file);
  record.push({...stamp(file),frames:page.map(f=>f.frame),personallyViewed:false});
 }return record;
}
const allPages=await sheets('all',full),cueEnds=full.filter(f=>f.reasons.includes('cue-last-visible')),cueEndPages=await sheets('cue-ends',cueEnds);
assert.equal(cueEnds.length,21);
for(const p of [...inputStamps,...sourceInventory])assert.equal(stamp(p.path).sha256,p.sha256,'Protected input/composition source changed during preflight: '+p.path);
for(const f of full)assert.equal(stamp(f.raw.path).sha256,f.raw.sha256,'Old raw changed during preflight: '+f.raw.path);
const currentSource=fs.readFileSync(sourcePath,'utf8'),current=inspect(currentSource);
assert.equal(current.mappingSha256,exact.mappingSha256,'A reuse mapping changed while preflight ran.');
const receipt={createdAt:new Date().toISOString(),episode:'D-1前編',purpose:'Existing raw reuse validity preflight only; not A 3D production, not complete movie QA.',output:out,cache,inputCacheReadOnly:inputCache,oldRawReadOnly:backup,sourceSnapshot:{path:sourcePath,sha256:sourceSha,snapshot:out+'/source-snapshot_gpt_20261026/desk_d1a_gpt_20261026.py',currentSha256:sha(currentSource),sourceChangedDuringRun:sha(currentSource)!==sourceSha,reuseMappingUnchanged:true,mappingSha256:exact.mappingSha256,fingerprint:exact.fingerprint},inputStamps,sourceInventory,targetCues,excludedMandatoryRedraw:excluded,sampleCount:full.length,fullres:full,allPages,cueEndPages,oneHzAllTargetCuesCovered:true,all21CueEndsCovered:true,exactProductionReuseFrameFunctionExecuted:true,pythonBankersRoundingPreserved:true,oldCueBoundaryClampApplied:true,productionAHooks:true,providedJapaneseCaptionsUnchanged:true,nearbyFallback:false,productionCacheWritten:false,blenderLaunched:false,audioGenerated:false,earsPerformed:false,personallyViewed:false,allMoviePass:false};
const receiptPath=out+'/reuse-preflight-receipt_gpt_20261026.json';fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output:out,receipt:receiptPath,targetCues:targetCues.length,nativeComposites:full.length,allPages:allPages.length,cueEndPages:cueEndPages.length,reuseMappingSha256:exact.mappingSha256,visualReviewPending:true},null,2));
