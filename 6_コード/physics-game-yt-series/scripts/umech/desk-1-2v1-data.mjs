// Independent 1-2 production snapshot. Never writes the supplied voice cache.
import {readFileSync,writeFileSync,mkdirSync,existsSync,readdirSync,copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {ABC,SUB,TEXT1,letters,subst,counts,ALB_ROT1,vig,albUnder,caesar} from './yt1-chain-00bx-common.mjs';

const W=fileURLToPath(new URL('../../',import.meta.url));
const SOURCE=W+'scripts/blender/desk_assets/1-2v1';
const CACHE=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-1-2v1-render';
assert.notEqual(CACHE,'/private/tmp/ys/ys-chain-1-2v1','supplied cache is read-only');
const root=CACHE+'/blender';
mkdirSync(root+'/tex',{recursive:true});
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const protectedFiles=['scripts/blender/desk_lib.py','scripts/blender/desk_1_1v6.py','scripts/umech/desk-overlay-lib.mjs','scripts/umech/desk_audio_lib.py','scripts/umech/desk-frame.mjs','scripts/umech/desk-faces.mjs','scripts/umech/frame-vert.mjs','docs/video-revision-20260924/ytseries/chain-1-2.mjs'];
const baseline=root+'/protected-1-2v1.json';
if(!existsSync(baseline))writeFileSync(baseline,JSON.stringify(Object.fromEntries(protectedFiles.map(p=>[p,sha(W+p)])),null,2));
for(const f of ['plan.json','phrase-times.json','timed-selection.json','ys-chain-1-2v1.json','ys-chain-1-2v1.wav']){
 const dst=CACHE+'/'+f;
 if(existsSync(dst)){
  const voice=CACHE+'/ys-chain-1-2v1.voice.wav';
  if(f.endsWith('.wav')&&existsSync(voice))assert.equal(sha(voice),sha(SOURCE+'/'+f),'source voice changed');
  else assert.equal(sha(dst),sha(SOURCE+'/'+f),'source changed: create a fresh render cache, not an overwrite');
 }
 else copyFileSync(SOURCE+'/'+f,dst);
}
const old=W+'scripts/blender/desk_assets/v6/blender/tex';
for(const f of readdirSync(old))if(!existsSync(root+'/tex/'+f))copyFileSync(old+'/'+f,root+'/tex/'+f);
const oldData=JSON.parse(readFileSync(W+'scripts/blender/desk_assets/v6/blender/data.json'));
const tableSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840"><rect width="600" height="840" fill="#efe2c4"/>${[...ABC].map((c,i)=>{const x=65+(i%4)*140,y=75+Math.floor(i/4)*113;return `<text x="${x}" y="${y}" font-family="Arial" font-size="36" fill="#3b2412">${c}</text><text x="${x}" y="${y+43}" font-family="Arial" font-size="36" fill="#b86b2b">${SUB[i]}</text>`;}).join('')}</svg>`;
await sharp(Buffer.from(tableSvg)).png().toFile(root+'/tex/table-1-2v1.png');
const keywordSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840"><rect width="600" height="840" fill="#ecdcb6"/>${['KEY KEY','ABC DEF','BCD EFG','CDE FGH','DEF GHI','EFG HIJ'].map((s,i)=>`<text x="300" y="${100+i*120}" font-family="Arial" font-size="44" text-anchor="middle" fill="#3b2412">${s}</text>`).join('')}</svg>`;
await sharp(Buffer.from(keywordSvg)).png().toFile(root+'/tex/keyword-1-2v1.png');
const sequences={fixed:letters(subst(TEXT1)),alberti:ALB_ROT1,key:letters(vig(TEXT1,'KEY')),keyword:letters(vig(TEXT1,'KEYWORD'))};
const frequencies=Object.fromEntries(Object.entries(sequences).map(([k,v])=>[k,counts(v)]));
const maxPct=k=>+(100*Math.max(...frequencies[k])/541).toFixed(1);
assert.equal(letters(TEXT1).length,541);
assert.equal(frequencies.fixed[23],70);assert.equal(frequencies.fixed[9],60);
assert.deepEqual(['fixed','alberti','key','keyword'].map(maxPct),[12.9,5.5,9.6,7.4]);
assert.equal(albUnder(0,0),'g');assert.equal(albUnder(0,1),'j');
const decoder=Array.from({length:10},(_,i)=>caesar('MYEXD DRO VODDOBC',-i-1));
assert.deepEqual(decoder.map(s=>s.slice(0,5)),['LXDWC','KWCVB','JVBUA','IUATZ','HTZSY','GSYRX','FRXQW','EQWPV','DPVOU','COUNT']);
assert.equal(decoder[9],'COUNT THE LETTERS');
assert.deepEqual([...'KEY'].map(c=>ABC.indexOf(c)),[10,4,24]);
assert.equal(vig('CAT','KEY'),'MER');assert.equal(vig('AAA','KEY'),'KEY');assert.equal(vig('WELL DONE','KEY'),'GIJV HMXI');
for(const v of Object.values(frequencies))assert.equal(v.reduce((a,b)=>a+b,0),541);

const clip=JSON.parse(readFileSync(CACHE+'/ys-chain-1-2v1.json'));
const pt=JSON.parse(readFileSync(CACHE+'/phrase-times.json'));
const cueTable=readFileSync(W+'docs/video-revision-20260924/deep/1-2_cue時刻一覧.md','utf8');
const direction=readFileSync('/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/1-2/1-2_制作指示書.md','utf8');
const rows=new Map();
for(const line of direction.split('\n')){const m=line.match(/^\| (\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|$/);if(m)rows.set(+m[1],m.slice(2));}
const timing=new Map();
for(const line of cueTable.split('\n')){const m=line.match(/^\| (\d+) \| `([^`]+)` \| .*? \| [\d.]+ \| [\d.]+ \| [\d.]+ \| .*? \| (.*?) \|$/);if(m)timing.set(m[2],{row:+m[1],words:m[3]});}
const P=(x,y,z,d,az,el,lens=40)=>[x,y,z,d,az,el,lens];
const cameras={
 letter:P(0,-.10,0,.55,-15,48),score:P(.30,.36,.07,.55,-10,40),
 answer:P(.02,-.15,.02,1.40,0,45),tower:P(0,-.10,.09,1.45,0,35),
 albWide:P(0,-.10,0,.81,0,35),alb:P(0,-.10,0,.72,0,55),albRead:P(0,-.10,0,.72,0,70),
 albStack:P(.08,-.10,.015,.98,0,50),albReceive:P(.08,-.10,.015,1.30,0,45),
 names:P(0,-.10,.045,1.42,0,35),books:P(0,-.10,.025,.88,5,42),plan:P(0,-.10,0,.65,0,50),
 numbers:P(0,-.10,0,.79,0,65),keyRing:P(0,-.16,.015,.94,0,55),count:P(0,-.10,0,.73,0,65),
 tiles:P(0,-.10,0,.47,0,45),compare:P(0,-.10,.07,1.48,0,40),key:P(0,-.10,.01,1.18,0,43),
 stack:P(0,-.10,.015,.65,-15,35),challenge:P(0,-.10,.015,1.15,0,45),
};
function setup(row,key){
 if(row<=2)return ['letter','letter'];if(row===3||row===49||row===50)return ['score','score'];
 if(row<=6)return ['answer','answer'];if(row<=9)return ['tower','tower'];
 if(row===10)return ['alberti','alb'];if(row<=15)return ['alberti',row===11?'albRead':'alb'];
 if(row<=17)return ['paperstack','albStack'];if(row===18)return ['receiver','albReceive'];
 if(row<=21)return ['names','names'];if(row<=27)return ['compare','tower'];if(row<=29)return ['books','books'];
 if(row<=31)return ['plan','plan'];if(row<=33)return ['numbers','numbers'];if(row===34)return ['ringkey','keyRing'];
 if(row<=37)return ['count','count'];if(row<=40)return ['tiles','tiles'];if(row<=45)return ['three','compare'];
 if(row===46)return ['count','count'];if(row===47)return ['skip','key'];if(row===48)return ['stack','stack'];
 if(row===51)return ['key','key'];if(row===52)return ['challenge','challenge'];return ['letter','letter'];
}
const cues=[];let previousCamera=null;
for(const s of clip.scenes)for(let i=0;i<s.cues.length;i++){
 const q=s.cues[i],cap=s.captions[i],key=q.diagram.replace(/^c12v1-/,''),info=timing.get(key);assert.ok(info,key);
 const [group,cam]=setup(info.row,key),instructions=rows.get(info.row);assert.ok(instructions,key);
 const p=pt[q.subtitle];assert.ok(p,key);
 const [objects,cameraInstruction,action,labels]=instructions;
 const move=previousCamera===cam?0:key==='letter:open'?1.5:key==='last:letter'?1.2:1.0;
 const wordEvents=info.words.split('<br>').map(w=>{const m=w.match(/^(.*?) ([\d.]+)$/);return m?{word:m[1],time:+m[2]}:null;}).filter(Boolean);
 cues.push({key,row:info.row,start:cap.start,end:cap.end,voiceEnd:cap.start+p.end,subtitle:q.subtitle,group,camera:cam,pose:cameras[cam],move,objects,action,labels,wordEvents,face:q.face??null,view:q.view??null,music:q.music??null});
 previousCamera=cam;
}
assert.equal(cues.length,59);
const motionSeconds=cues.reduce((a,c)=>a+c.move,0);assert.ok(motionSeconds/clip.duration<=.2);
const topSeconds=cues.filter(c=>c.pose[5]>=65).reduce((a,c)=>a+c.end-c.start,0);assert.ok(topSeconds/clip.duration<=.2);
const shotMD=['# 1-2 撮影台本（ChatGPT、制作第1版）','',`音声は写しの現在版を固定。全${cues.length} cue、${clip.duration.toFixed(3)}秒。本文・字幕・読み・台本は編集しない。`,`カメラ移動の設計上限：${motionSeconds.toFixed(2)}秒（${(100*motionSeconds/clip.duration).toFixed(2)}％）。仰角65°以上：${topSeconds.toFixed(2)}秒（${(100*topSeconds/clip.duration).toFixed(2)}％）。`,'','姿勢＝P((x,y,z),距離m,方位°,仰角°,レンズ)。以下の動作は各 cue の絶対秒に合わせる。待ち時間は物を止め、札の答えを声より先に出さない。',''];
for(const c of cues){shotMD.push(`## 行${c.row}・${c.key}　${c.start.toFixed(2)}–${c.end.toFixed(2)}秒`,'',`- カメラ：${c.move?`${c.start.toFixed(2)}から${c.move.toFixed(1)}秒だけ前の姿勢から移動し、その後止める`:'全区間止める'}。P((${c.pose.slice(0,3).join(',')}),${c.pose.slice(3).join(',')})。`, `- 物：${c.objects}`,`- 手と動き：${c.action}`,`- 合わせる語と絶対秒：${c.wordEvents.map(w=>`${w.word}＝${w.time.toFixed(2)}`).join('／')}`,`- 札：${c.labels}`,`- 顔：${c.face?JSON.stringify(c.face):'なし（台本どおり）'}。見方：${c.view?JSON.stringify(c.view):'台本の view 指定を使用'}。`,'');}
shotMD.push('## 制作上の注意','', '- 行24は正本の追記により chk:alb と chk:count に分かれる。史実の「何語かごと」と、比較用の「1文字ごと」を混同しない。','- 行26の得点の時刻は、撮影指示表は「まちがい＋0.3秒」、cue表は「判定」。映像では指示表の187.97秒に合わせる。声・字幕は変更しない。','- カメラ・物・指の数値は試し撮り後に見え方を確認して調整する。現時点では品質合格ではない。');
const shotPath=W+'docs/video-revision-20260924/deep/1-2_撮影台本_ChatGPT.md';
writeFileSync(shotPath,shotMD.join('\n'));
const data={...oldData,episode12:{abc:ABC,sub:SUB,decoder,sequences,frequencies,maxPercent:Object.fromEntries(Object.keys(frequencies).map(k=>[k,maxPct(k)])),cameras,cues,duration:clip.duration,motionSeconds,topSeconds,sourceSHA:sha(SOURCE+'/ys-chain-1-2v1.json'),audioSHA:sha(SOURCE+'/ys-chain-1-2v1.wav')}};
writeFileSync(root+'/data.json',JSON.stringify(data,null,1));
console.log(JSON.stringify({cache:CACHE,shotPath,cues:cues.length,duration:clip.duration,motionRatio:motionSeconds/clip.duration,topRatio:topSeconds/clip.duration,assertions:'PASS'},null,2));
