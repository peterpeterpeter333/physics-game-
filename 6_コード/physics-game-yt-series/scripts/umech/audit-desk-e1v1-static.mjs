// E1-specific source freeze and preview request; never changes shared checks.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url)),cache='/private/tmp/ys/ys-chain-e1v1',tag=process.env.E1_FREEZE_TAG??'r2';
assert.ok(/^r\d+$/.test(tag),'Own E1 freeze tag only');
const D=JSON.parse(fs.readFileSync(cache+'/blender/data.json')),src=fs.readFileSync(W+'scripts/blender/desk_e1v1.py','utf8');
const events=[];
for(const m of src.matchAll(/T\('([^']+)','([^']+)'(?:,(\d+))?\)/g)){
 const cue=D.cues.find(c=>c.key===m[1]);assert.ok(cue,m[0]);
 assert.ok(cue.wordEvents.filter(w=>w.word.includes(m[2]))[+(m[3]??0)],m[0]);events.push(m[0]);
}
for(const m of src.matchAll(/[SE]\('([^']+)'\)/g))assert.ok(D.cues.some(c=>c.key===m[1]),m[0]);
assert.equal(D.cues.length,54);assert.equal(Math.ceil(D.duration*30),11606);
assert.equal(D.cues.find(c=>c.row===29).move,0);
const fleet=[];
for(let i=0;i<7;i++){
 const start=D.map.fleetLead.map((n,j)=>n-i*D.map.fleetPitch[j]),end=start.map((n,j)=>n+D.map.fleetMove[j]);fleet.push({i,start,end});
 for(const p of [start,end]){assert.ok(p[0]-.035>=-.2&&p[0]+.035<=.2);assert.ok(p[1]-.0133>=-.22&&p[1]+.0133<=.06);}
}
assert.ok(D.map.fleetPitch[1]>.0266,'Hull separation');
const extras=[34.9,35.6,36.4,100.5,104,108.5,114.5,120.8,128.5,134.5,162,181.5,182.8,190.7,198.8,220.95,226,249.8,255.9,259.6,261.4,298,306,326.9,337.2,350,362.7,366.3];
const times=[...new Set([...Array.from({length:Math.ceil(D.duration)},(_,i)=>i),...D.gateTimes,...D.cues.map(c=>c.end-.15),...extras].map(t=>Math.round(t*30)/30))].sort((a,b)=>a-b);
const files=['scripts/blender/desk_e1v1.py','scripts/blender/desk_lib_e1.py','scripts/blender/desk_e1v1_hotfix_r3.py','scripts/blender/desk_e1v1_hotfix_r4.py','scripts/blender/desk_e1v1_hotfix_r5.py','scripts/umech/desk-e1v1-data.mjs','scripts/umech/desk-e1v1-overlay.mjs','scripts/umech/desk-e1v1-preview.mjs','scripts/umech/desk-e1v1-problem.mjs','scripts/umech/publish-desk-e1v1-catalog.mjs','scripts/umech/audit-desk-e1v1-static.mjs'];
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
if(Number(tag.slice(1))>=6)files.push('scripts/blender/desk_e1v1_hotfix_r6.py');
if(Number(tag.slice(1))>=7)files.push('scripts/blender/desk_e1v1_hotfix_r7.py');
if(Number(tag.slice(1))>=8)files.push('scripts/blender/desk_e1v1_hotfix_r8.py','scripts/blender/desk_render_axes.py');
if(Number(tag.slice(1))>=9)files.push('scripts/blender/desk_e1v1_hotfix_r9.py');
const out=cache+'/blender/gate-e1v1-'+tag;
const result={phase:'E1 '+tag+' source frozen before GUI preview',time:new Date().toISOString(),eventsChecked:events.length,cues:54,frames:11606,fleet,files:Object.fromEntries(files.map(f=>[f,hash(W+f)])),dataSHA256:hash(cache+'/blender/data.json'),textureSHA256:hash(cache+'/blender/tex/e1-chart.png'),canonicalVoiceSHA256:hash(cache+'/ys-chain-e1v1.wav'),preview:{times,gateTimes:D.gateTimes,oneSecondProbe:true,extraCount:times.length-12,out,args:['--cache',cache,'--gates','--times',times.join(','),'--out',out,'--samples','16','--scale','1']}};
fs.writeFileSync(cache+'/e1v1-'+tag+'-source-freeze.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
