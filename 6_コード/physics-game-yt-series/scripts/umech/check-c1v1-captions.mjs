// 既存gate 8と同じchunkTimes・未丸め値・上側中央値で、不変の字幕を点検する。
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {chunkTimes} from './desk-frame.mjs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1',base=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/ys-chain-c1v1.json'));
const clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const durs=[];let inexact=0;
for(const s of clip.scenes)s.cues.forEach((q,k)=>{const cap=s.captions[k],{starts,exact}=chunkTimes(q,cap);if(!exact)inexact++;starts.forEach((a,i)=>durs.push({d:(i+1<starts.length?starts[i+1]:cap.end)-a,t:a,text:(q.cap?.[i]??[q.subtitle]).join('')}));});
const v=durs.map(x=>x.d).sort((a,b)=>a-b),med=v[Math.floor(v.length/2)]??0,short=durs.filter(x=>x.d<.4),warn=durs.filter(x=>x.d<.5),pass=med>=1&&med<=1.5&&!short.length;
const gate='scripts/umech/desk-quality-gate.mjs',report={id:'ys-chain-c1v1',gate:8,status:pass?'OK':'NG',medianExact:med,medianDisplay:med.toFixed(2),count:v.length,min:v[0],max:v.at(-1),belowPoint4:short.length,belowPoint5:warn.length,inexact,threshold:{median:[1,1.5],minimum:.4},algorithm:'desk-frame.chunkTimes; no rounding; sorted[Math.floor(length/2)]',gateSha256:createHash('sha256').update(fs.readFileSync(gate)).digest('hex'),nearMedian:v.slice(Math.floor(v.length/2)-4,Math.floor(v.length/2)+5),durations:durs};
fs.writeFileSync(cache+'/c1-caption-gate8.json',JSON.stringify(report,null,1));console.log(JSON.stringify({...report,durations:undefined},null,1));process.exit(pass?0:1);
