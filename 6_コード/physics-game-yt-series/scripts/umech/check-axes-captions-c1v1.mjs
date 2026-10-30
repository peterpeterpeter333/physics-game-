// 不変入力を読むだけ。共通gate 8の未丸めアルゴリズムを独立プロセスでB/C/D/Eへ適用。
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=fileURLToPath(import.meta.url),root=path.resolve(path.dirname(here),'../..');
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const gateFile=root+'/scripts/umech/desk-quality-gate.mjs',gateText=fs.readFileSync(gateFile,'utf8');
const m=/capMedian:\[([\d.]+),([\d.]+)\],capMin:([\d.]+)/.exec(gateText);if(!m)throw Error('Threshold source changed');
const limits={median:[+m[1],+m[2]],minimum:+m[3]},algorithm='desk-frame.chunkTimes; no duration rounding; v.sort((a,b)=>a-b); med=v[Math.floor(v.length/2)]';
if(process.argv[2]==='--one'){
 const id=process.argv[3],axis=id.match(/ys-chain-([bcde])1v1/)[1],cache='/private/tmp/ys/'+id;process.env.EM_FILM_CACHE=cache;
 const files={plan:cache+'/plan.json',timed:cache+'/'+id+'.json',phraseTimes:cache+'/phrase-times.json',script:root+'/docs/video-revision-20260924/ytseries/chain-'+axis+'-1.mjs',canonical:root+'/docs/video-revision-20260924/deep/技術の疑問の鎖_'+axis.toUpperCase()+'-1_第1版_ナレーション.md',suppliedVoice:root+'/scripts/blender/desk_assets/'+axis+'1v1/'+id+'.wav'};
 const inputs=Object.fromEntries(Object.entries(files).map(([k,f])=>[k,{path:f,sha256:sha(f)}]));
 const frameFile=root+'/scripts/umech/desk-frame.mjs',frameSource=fs.readFileSync(frameFile,'utf8'),chunkSource=frameSource.split('export function chunkTimes(q,cap){')[1]?.split('\nfunction capLines')[0];if(!chunkSource)throw Error('chunkTimes not found');
 const {chunkTimes}=await import('./desk-frame.mjs');
 const base=JSON.parse(fs.readFileSync(files.plan))[0],timed=JSON.parse(fs.readFileSync(files.timed)),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
 const durs=[];let inexact=0,cueIndex=0;
 for(const s of clip.scenes)s.cues.forEach((q,k)=>{cueIndex++;const cap=s.captions[k];try{const {starts,exact}=chunkTimes(q,cap);if(!exact)inexact++;starts.forEach((a,i)=>durs.push({d:(i+1<starts.length?starts[i+1]:cap.end)-a,t:a,text:(q.cap?.[i]??[q.subtitle]).join(''),cueIndex,key:q.diagram,chunkIndex:i+1}));}catch(e){inexact++;throw e;}});
 const v=durs.map(x=>x.d).sort((a,b)=>a-b),med=v[Math.floor(v.length/2)]??0,short=durs.filter(x=>x.d<limits.minimum),warn=durs.filter(x=>x.d<.5),pass=med>=limits.median[0]&&med<=limits.median[1]&&!short.length;
 const unchanged=Object.values(inputs).every(x=>sha(x.path)===x.sha256);if(!unchanged)throw Error('Input changed during read');
 const report={id,axis:axis.toUpperCase()+'-1',gate:8,status:pass?'OK':'NG',medianExact:med,medianDisplay:med.toFixed(2),count:v.length,min:v[0],max:v.at(-1),belowPoint4:short.length,belowPoint5:warn.length,inexact,limits,algorithm,source:{gate:{path:gateFile,sha256:sha(gateFile)},deskFrame:{path:frameFile,sha256:sha(frameFile)},chunkTimesSha256:createHash('sha256').update('export function chunkTimes(q,cap){'+chunkSource).digest('hex')},inputs,inputUnchanged:unchanged,durs};
 console.log(JSON.stringify(report));process.exit(pass?0:1);
}
const out=process.argv[2]??'/private/tmp/ys/ys-chain-c1v1/caption-audit-allaxes';fs.mkdirSync(out,{recursive:true});
const results=[];
for(const axis of ['b','c','d','e']){const id='ys-chain-'+axis+'1v1',r=spawnSync(process.execPath,[here,'--one',id],{cwd:root,encoding:'utf8',maxBuffer:10e6,env:{...process.env,EM_FILM_CACHE:'/private/tmp/ys/'+id}});if(![0,1].includes(r.status)||!r.stdout.trim().startsWith('{'))throw Error(id+': '+r.stderr+' '+r.stdout.slice(0,200));const a=JSON.parse(r.stdout);results.push(a);fs.writeFileSync(out+'/'+id+'-gate8.json',JSON.stringify(a,null,1));}
const report={createdAt:new Date().toISOString(),algorithm,limits,allPass:results.every(r=>r.status==='OK'),results};fs.writeFileSync(out+'/all-axes-gate8.json',JSON.stringify(report,null,1));
const md=['# B/C/D/E 不変字幕の gate 8 独立集計','',`共通検査は変更せず、各回を別のNodeプロセスで読み込んだ。${algorithm}。入力ファイルは読み取りだけ。`, '', '| 回 | 判定 | 中央値（未丸め、秒） | gateの表示 | 区切り数 | 最短 | 0.4秒未満 | inexact |','|---|---|---:|---:|---:|---:|---:|---:|'];
for(const r of results)md.push(`| ${r.axis} | ${r.status} | ${r.medianExact.toPrecision(17)} | ${r.medianDisplay} | ${r.count} | ${r.min.toPrecision(17)} | ${r.belowPoint4} | ${r.inexact} |`);
md.push('','基準：中央値1.0〜1.5秒（丸め前で比較）、0.4秒未満0。NGを声・字幕・cap・時刻・共通検査の変更で解消することはしていない。C-1は表示上1.50秒でも厳密値1.503秒なので不合格。','');
for(const r of results){md.push(`## ${r.axis}`,'',`- 判定：${r.status}。入力不変：${r.inputUnchanged}。`,'- 共通検査SHA256：'+r.source.gate.sha256,'- desk-frame SHA256：'+r.source.deskFrame.sha256,'- chunkTimes関数SHA256：'+r.source.chunkTimesSha256,'','### 入力SHA256','','| 入力 | パス | SHA256 |','|---|---|---|');for(const [key,v]of Object.entries(r.inputs))md.push(`| ${key} | ${v.path} | ${v.sha256} |`);md.push('','### 全区切り（丸め前のdurs）','','| cue | key | 区切り | 開始秒 | 長さ秒 | 表示 |','|---:|---|---:|---:|---:|---|');for(const q of r.durs)md.push(`| ${q.cueIndex} | ${q.key} | ${q.chunkIndex} | ${q.t.toPrecision(17)} | ${q.d.toPrecision(17)} | ${q.text.replaceAll('|','｜')} |`);md.push('');}
fs.writeFileSync(out+'/all-axes-gate8.md',md.join('\n'));console.log(JSON.stringify({out,limits,results:results.map(({id,status,medianExact,medianDisplay,count,min,belowPoint4,inexact,inputUnchanged})=>({id,status,medianExact,medianDisplay,count,min,belowPoint4,inexact,inputUnchanged}))},null,1));process.exit(report.allPass?0:1);
