// Independent B-1 data. The supplied narration, subtitles and timing are read-only.
import {readFileSync,writeFileSync,mkdirSync,existsSync,copyFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const W=fileURLToPath(new URL('../../',import.meta.url));
const H='/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22';
const C=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-b1v1';
const R=C+'/blender';mkdirSync(R+'/tex',{recursive:true});
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const clip=json(C+'/ys-chain-b1v1.json');
const direction=readFileSync(H+'/B-1/B-1_制作指示書.md','utf8');
const canonical=readFileSync(W+'docs/video-revision-20260924/deep/技術の疑問の鎖_B-1_第1版_ナレーション.md','utf8');
const table=readFileSync(W+'docs/video-revision-20260924/deep/B-1_cue時刻一覧.md','utf8');
const rows=new Map(),times=new Map();
for(const l of direction.split('\n')){let m=l.match(/^\| (\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|$/);if(m)rows.set(+m[1],m.slice(2));}
for(const l of table.split('\n')){let m=l.match(/^\| (\d+) \| `([^`]+)` \| .*? \| [\d.]+ \| [\d.]+ \| [\d.]+ \| .*? \| (.*?) \|$/);if(m)times.set(m[2],{row:+m[1],words:m[3].split('<br>').map(w=>{const a=w.match(/^(.*?) ([\d.]+)$/);return a?{word:a[1],time:+a[2]}:null;}).filter(Boolean)});}
const rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI;
const dip=l=>deg(Math.atan2(2*Math.sin(rad(l)),Math.cos(rad(l))));
const dipLondon=dip(51.5),star=51.5,island=(90-51.5)/2,measurement=71+50/60,south=dip(-30);
assert.ok(Math.abs(dipLondon-68.3)<.1);assert.equal(dip(0),0);assert.ok(Math.abs(dip(90)-90)<1e-8);assert.equal(island,19.25);assert.ok(Math.abs(measurement-72)<.2);assert.ok(Math.abs(south+49.1)<.1);
const needles=Array.from({length:12},(_,i)=>{const lat=[-60,-35,0,30,51.5,72][i%6],lon=i<6?0:180;const th=rad(90-lat),ph=rad(lon);const r=[Math.sin(th)*Math.cos(ph),Math.sin(th)*Math.sin(ph),Math.cos(th)];const md=-r[2],B=r.map((x,j)=>3*md*x+(j===2?1:0));assert.ok(B.some(x=>Math.abs(x)>1e-6));return {lat,lon,r,B,dip:dip(lat)};});
const fieldLines=Array.from({length:16},(_,i)=>{const L=[.13,.15,.17,.19,.21,.23,.36,.50][Math.floor(i/2)];return Array.from({length:121},(_,j)=>{const th=Math.asin(Math.sqrt(.09/L))+(Math.PI-2*Math.asin(Math.sqrt(.09/L)))*j/120;const r=L*Math.sin(th)**2;assert.ok(r>=.09-1e-10);return [r*Math.sin(th)*(i%2?-1:1),r*Math.cos(th)];});});
const scores=clip.scenes.flatMap(s=>s.cues.filter(q=>q.score).map(q=>[q.score.make,q.score.brk]));
assert.equal(fieldLines.length,16);assert.deepEqual(scores,[[0,0],[0,1],[0,3]]);
const poses={compass:[0,-.18,.035,.45,-10,40,40],score:[.12,.02,.07,1.18,0,35,40],star:[-.29,.12,.14,1.02,-8,30,40],map:[-.32,.12,.01,.82,0,48,40],sailor:[0,-.02,.07,.47,0,36,40],gilbert:[-.48,-.10,.09,.36,0,32,40],magnet:[0,-.02,.025,.44,0,36,40],pair:[0,-.02,.02,.64,0,40,40],vane:[.25,-.1,.09,1.25,0,32,40],terrella:[0,.10,.125,.53,0,32,40],dip:[0,.10,.12,.55,0,15,40],powder:[0,.10,.14,.54,0,15,40],challenge:[0,.10,.12,.55,0,-8,40],globe:[.32,.12,.16,.70,0,30,40],predict:[.32,.12,.17,.72,0,10,40],meter:[-.30,-.04,.09,.43,0,15,40],book:[-.20,.30,.025,.48,0,40,40]};
function shot(row,key){if(row<=2||row===14||row===16||row===39)return ['compass','compass'];if(row===3)return ['score','score'];if(row===4)return ['star','star'];if(row<=6)return ['map','map'];if(row===7)return ['sailor','sailor'];if(row===8)return ['gilbert','gilbert'];if(row<=11)return ['garlic','magnet'];if(row<=13)return ['pair','pair'];if(row===15)return ['vane','vane'];if(row<=20)return ['terrella','terrella'];if(row===21)return ['dip','dip'];if(row<=23)return ['powder','powder'];if(row===24)return ['globe','globe'];if(row===25)return ['london','dip'];if(row===26||row===28||row===29)return ['predict','predict'];if(row===27)return ['meter','meter'];if(row<=34)return ['inside','globe'];if(row===35)return ['book','book'];if(row<=37)return ['mystery','globe'];return ['challenge','dip'];}
let prev=null;const cues=[];
for(const s of clip.scenes)for(let i=0;i<s.cues.length;i++){const q=s.cues[i],cap=s.captions[i],key=q.diagram.replace(/^cb1v1-/,''),tm=times.get(key);assert.ok(tm,key);const [group,camera]=shot(tm.row,key);const [objects,cameraInstruction,action,labels]=rows.get(tm.row);const move=prev===camera?0:key==='last:needle'?1.2:key==='open:box'?1.5:1;const wordEvents=tm.words;cues.push({key,row:tm.row,start:cap.start,end:cap.end,group,camera,pose:poses[camera],move,objects,cameraInstruction,action,labels,wordEvents,face:q.face??null,view:q.view??null});prev=camera;}
assert.equal(cues.length,50);assert.ok(cues.reduce((a,c)=>a+c.move,0)/clip.duration<.20);
const events=Object.fromEntries(cues.map(c=>[c.key,c.wordEvents]));
const textWidths={};const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const labels=['B 電気と電波 1','言い伝え 0 − 0 実験','言い伝え 0 − 1 実験','言い伝え 0 − 3 実験','仮説：地球は 大きな 磁石','もし正しいなら','予言：ロンドンで 約70度 下','事実：ロンドンで 約72度 下','判定 ○（地球が 磁石）','星なら：上','島なら：約20度 下','地球が 磁石なら：約70度 下','先に 決めた：北を 向く 先 ＝ N','だから：地球の 北 ＝ S極'];
for(const s of [...new Set(labels)])for(const size of [36,38,40,42,44]){const {info}=await sharp(Buffer.from(`<svg width="2400" height="160" xmlns="http://www.w3.org/2000/svg"><rect width="2400" height="160" fill="white"/><text x="30" y="110" font-family="Hiragino Sans" font-weight="800" font-size="${size}" fill="black">${esc(s)}</text></svg>`)).trim({background:'#ffffff'}).toBuffer({resolveWithObject:true});textWidths[s+'|'+size]=info.width;}
const map=`<svg width="1200" height="880" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="880" fill="#e9dcc0"/><g fill="none" stroke="#b99b69" stroke-width="3">${Array.from({length:9},(_,i)=>`<circle cx="600" cy="440" r="${70+i*58}"/>`).join('')}<path d="M40 440H1160M600 30V850"/></g><g fill="#a8aa7e" stroke="#766443" stroke-width="7"><path d="M70 600L160 510 260 500 320 570 280 730 130 800Z"/><path d="M880 700L990 520 1110 530 1160 750 1000 820Z"/><path d="M510 100L550 165 640 180 710 130 670 60Z"/></g><circle cx="600" cy="440" r="34" fill="#9f813d"/></svg>`;
const map4=map.replace('</g><circle cx="600"','<path d="M890 105L1060 140 1100 300 990 350 870 260Z"/></g><circle cx="600"');
await sharp(Buffer.from(map4)).png().toFile(R+'/tex/map.png');
// Retain the same geographic graticule and continents; make its existing ink
// readable on a phone instead of disappearing below one raster pixel.
const globe=`<svg width="1600" height="800" xmlns="http://www.w3.org/2000/svg"><rect width="1600" height="800" fill="#4f8fa8"/><g stroke="#c9c28d" stroke-width="5" fill="#90a76b"><path d="M70 120L330 75 450 160 370 295 290 310 220 410 170 330Z"/><path d="M330 430L455 400 520 495 435 710 370 650Z"/><path d="M760 150L920 70 1150 90 1430 180 1500 280 1290 370 1100 300 980 360 910 290 780 310Z"/><path d="M790 330L950 330 1040 440 940 640 840 600 780 450Z"/><path d="M1280 550L1410 500 1530 580 1430 680 1300 650Z"/></g><g stroke="#fff3c9" stroke-width="8" opacity=".95">${Array.from({length:7},(_,i)=>`<path d="M0 ${(i+1)*100}H1600"/>`).join('')}${Array.from({length:15},(_,i)=>`<path d="M${(i+1)*100} 0V800"/>`).join('')}</g></svg>`;
await sharp(Buffer.from(globe)).png().toFile(R+'/tex/globe.png');
const old=json(W+'scripts/blender/desk_assets/v6/blender/data.json');
const DATA={...old,b1:{duration:clip.duration,cues,poses,events,dipLondon,star,island,measurement,south,needles,fieldLines,textWidths,score:scores,preview:[2.7,34,75,97,113,142,168,185.9,234,259,294.4,354]}};
writeFileSync(R+'/data.json',JSON.stringify(DATA,null,1));
const md=['# B-1 撮影台本（ChatGPT）','','全50 cue。正本・台本・声と時刻は変更しない。主役の幅は投影で0.66を目標に校正する。以下は関門A用の全cue計画。'];
for(const c of cues)md.push(`\n## ${c.key}　${c.start.toFixed(2)}〜${c.end.toFixed(2)}秒\n\n- 行${c.row}／物：${c.objects}\n- 主役：${c.group}。画面の横幅0.66（4〜7割内、実測後に記録）。\n- カメラ：P((${c.pose.slice(0,3)}),${c.pose.slice(3)})。${c.move?`${c.move}秒で前の姿勢から移動、その後固定`:'全区間固定'}。\n- 手と動き：${c.action}\n- 同期：${c.wordEvents.map(w=>w.word+'＝'+w.time.toFixed(2)+'秒').join('／')}\n- 札：${c.labels}\n- 顔：${JSON.stringify(c.face)}。見方：${c.view??'なし'}。`);
writeFileSync(W+'docs/video-revision-20260924/deep/B-1_撮影台本_ChatGPT.md',md.join('\n'));
mkdirSync(C+'/problem',{recursive:true});
writeFileSync(C+'/problem/problem.json',JSON.stringify({canonical:canonical.slice(canonical.indexOf('## 問題編への接続')),parts:['terrella','needles','dipmeter','fieldLines'],answerDegrees:-south},null,2));
console.log(JSON.stringify({cues:cues.length,duration:clip.duration,assertions:'PASS',dipLondon,south,gateA:'all 50 cues planned'},null,2));
