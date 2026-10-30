// New S4 shot plan. Canonical spoken words stay at their TRUE wt() times.
// Geometry is NOT measured here. Existing gate scans t0..t0+1.5s, allowing
// the instructed0.6-1.0s camera move without changing/forging the word time.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {wt} from './yt1-chain-00bx-common.mjs';
const W=path.resolve(new URL('../..',import.meta.url).pathname),CACHE='/private/tmp/ys/ys-chain-d1b_s4_gpt_20261027';
assert.equal(process.env.EM_FILM_CACHE??CACHE,CACHE);process.env.EM_FILM_CACHE=CACHE;
const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?undefined:args[i+1];};
const within=f=>{const p=path.resolve(f);assert.ok(p.startsWith(CACHE+path.sep),'New S4 cache output only');return p;};
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const selector=path.join(W,'scripts/blender/desk_d1b_s4_qa_gpt_20261027.py');
if(opt('--adopt')){
 const candidate=within(opt('--adopt')),metadata=within(opt('--metadata')??candidate.replace(/\.json$/,'.metadata.json'));
 const backup=within(opt('--backup')??path.join(CACHE,'shot-plan-before-S4-adoption.json'));
 const canonical=path.join(CACHE,'shot-plan.json'),receipt=backup.replace(/\.json$/,'.adoption.json'),temporary=backup.replace(/\.json$/,'.adoption.tmp.json');
 assert.notEqual(candidate,canonical);for(const p of [backup,receipt,temporary])assert.equal(fs.existsSync(p),false,'Preserve previous adoption: '+p);
 const report=JSON.parse(fs.readFileSync(metadata)),plan=JSON.parse(fs.readFileSync(candidate));
 assert.equal(report.output,candidate);assert.equal(report.selectorSnapshotSha256,sha(selector),'Semantic selector changed; regenerate candidate first');
 assert.equal(report.planSha256,sha(candidate));assert.equal(plan.length,report.planRows);assert.equal(plan.length,90);
 for(const row of plan)assert.ok(row.cue.startsWith('cd1b-')&&row.primary&&row.minWidth>0);
 fs.copyFileSync(canonical,backup,fs.constants.COPYFILE_EXCL);
 fs.writeFileSync(temporary,fs.readFileSync(candidate),{flag:'wx'});fs.renameSync(temporary,canonical);
 fs.writeFileSync(receipt,JSON.stringify({candidate,metadata,canonical,oldPlanPreservedAt:backup,oldSha256:sha(backup),adoptedSha256:sha(canonical),selectorSha256:sha(selector),geometryPassClaimed:false},null,1)+'\n',{flag:'wx'});
 console.log(JSON.stringify({canonical,backup,receipt,adoptedRows:plan.length}));process.exit(0);
}
const source=path.join(W,'outputs/d1ab-gpt-20261026/qa/d1b-S2-baseline-shot-plan_gpt_20261026.json'),base=JSON.parse(fs.readFileSync(source,'utf8'));
const output=within(opt('--out')??path.join(CACHE,'shot-plan.json'));
const original=within(opt('--original')??(opt('--out')?output.replace(/\.json$/,'.S2-original.json'):path.join(CACHE,'shot-plan_S2-original_20261026.json')));
const metadata=within(opt('--metadata')??(opt('--out')?output.replace(/\.json$/,'.metadata.json'):path.join(CACHE,'shot-plan_s4_gpt_20261027_metadata.json')));
for(const f of [output,original,metadata])assert.equal(fs.existsSync(f),false,'Preserve existing plan: '+f);
const data=JSON.parse(fs.readFileSync(path.join(CACHE,'blender/data.json'))),timed=JSON.parse(fs.readFileSync(path.join(CACHE,'ys-chain-d1b.json'))),by=new Map(data.cues.map(c=>[c.key,c])),qs=timed.scenes.flatMap(s=>s.cues);
const plan=base.shotPlan.map(r=>({...r}));
for(const r of plan){
 const row=by.get(r.cue).row;
 if([1,6,10,12,14,36,42].includes(row))r.minWidth=.76;
 if(row===19)r.minWidth=r.word==='オシサゲマス'?.55:r.cue==='run:back'?.55:.76;
 if(r.cue==='run:steam'&&r.word==='アケテ')r.word='ジョオキノベンオアケテ';
 if(r.cue==='run:spray'&&r.word==='アケマス')r.word='レイスイノベン';
 if(row===46)r.minWidth=.6;
 if(r.minWidth===.75)r.minWidth=.76;
 // 行29の指定は坑の『高さ』6割。横は通常の4割、縦6割は実geometry別検査。
 if(row===29&&r.word==='クダオウエエウエエ')r.minWidth=.4;
 if(row===48){r.minWidth=r.word?.includes('チイサナベン')?.6:.76;if(r.word)r.word='チイサナベン';}
}
for(const r of [
 {cue:'open:machine',word:'タンコオノソコカラ',occ:0,minWidth:.76},
 {cue:'drain:steam',word:'スコシダケツヨク',occ:0,minWidth:.55},
 {cue:'next:spread',word:'イギリス',occ:0,minWidth:.7},
])plan.push(r);
const rows=[],covered=new Set();
for(const r of plan){
 const c=by.get(r.cue),q=qs.find(q=>q.diagram==='cd1b-'+r.cue);assert.ok(c&&q);
 assert.ok(!q.face||q.face.small||c.row===5,'Full-screen face must not enter the plan');
 const t0=c.start+(r.word?wt({cue:q,t:0,dur:c.end-c.start},r.word,r.occ??0):(c.end-c.start)/2);
 assert.ok(t0>=c.start-1e-7&&t0<c.end);covered.add(c.key);
 rows.push({cue:c.key,row:c.row,word:r.word??null,t0,gateWindow:[t0,t0+1.5],nameSelectionAt:Math.min(t0+.8,c.end-1/30)});
}
const py=`
import sys,json,warnings
sys.dont_write_bytecode=True
warnings.filterwarnings('ignore')
sys.path.insert(0,sys.argv[1])
import desk_d1b_s4_qa_gpt_20261027 as q
x=json.load(sys.stdin); by={c['key']:c for c in x['cues']}; out=[]
for r in x['rows']:
 c=by[r['cue']];ns={'DATA':{'cues':x['cues']},'M':{'all':[],'groups':{},'s3':{}},'G':{},'S3_MITT':[],'S3_FUJI':[],'cue_at':lambda t,c=c:c,'PHRASE':lambda key,kana:x['lastValveTime'] if key=='last:valve' and kana in ('チイサナベン','ベンデシタ') else float('inf')}
 X={'_s3_primary':{'name':'温め直す筒と石炭の山','objects':[],'minWidth':.6}} if c['key']=='next:who' else None
 s=q._select(ns,r['nameSelectionAt'],X)
 out.append({'name':s['name'],'source':s['source']})
print(json.dumps(out,ensure_ascii=False))
`;
const last=by.get('last:valve'),lastQ=qs.find(q=>q.diagram==='cd1b-last:valve'),lastValveTime=last.start+wt({cue:lastQ,t:0,dur:last.end-last.start},'チイサナベン');
const resolved=spawnSync('python3',['-c',py,path.join(W,'scripts/blender')],{input:JSON.stringify({cues:data.cues,rows,lastValveTime}),encoding:'utf8',maxBuffer:4<<20});assert.equal(resolved.status,0,resolved.stderr);
const names=JSON.parse(resolved.stdout);assert.equal(names.length,plan.length);
for(let i=0;i<plan.length;i++){plan[i].primary=names[i].name;plan[i].cue='cd1b-'+plan[i].cue;rows[i].primary=names[i].name;rows[i].nameSelectorSource=names[i].source;assert.ok(!names[i].name.startsWith('UNKNOWN'));}
const excluded=data.cues.filter(c=>!covered.has(c.key)).map(c=>({row:c.row,cue:c.key}));
assert.deepEqual(excluded.map(c=>c.row).sort((a,b)=>a-b),[3,20,21,27]);
const gate=fs.readFileSync(path.join(W,'scripts/umech/desk-quality-gate.mjs'),'utf8');assert.ok(gate.includes('primaryWin:1.5'));
fs.copyFileSync(source,original,fs.constants.COPYFILE_EXCL);
fs.writeFileSync(output,JSON.stringify(plan,null,1)+'\n',{flag:'wx'});
fs.writeFileSync(metadata,JSON.stringify({stage:'S4',source,output,oldPlanPreservedAt:original,planSha256:sha(output),planRows:plan.length,coveredCues:covered.size,totalCues:63,excludedFullFaceCues:excluded,partialFaceRow5:'Only ミズ54.202s; later face is not separately tested',trueSpokenTimes:true,lastValvePhraseTime:lastValveTime,gateUnchanged:true,gateWindowSeconds:1.5,expectedCameraMoveSeconds:[.6,1.0],wordTimesShifted:false,nameResolution:'Read-only S4 semantic selector names including exact last-valve PHRASE time; no Blender/geometry measurement',selectorSnapshotSha256:sha(selector),limitations:['7d requires exact primary name equality; a changed semantic selector requires a new plan. Nonmatching names are skipped and best stays0.','7d finds best width in1.5s; it does not prove arrival at the word instant','Report noun not visible at t0 and actual settle delays separately','Size and cropping/readability still require actual S4 frames','Legacy multi-part semantic names do not independently certify each named part','Row22 requires separate height60% check; gate7d only measures width'],rows},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({output,original,metadata,rows:plan.length,coveredCues:covered.size,excludedFullFaceCues:excluded,spokenTimesUnshifted:true}));

