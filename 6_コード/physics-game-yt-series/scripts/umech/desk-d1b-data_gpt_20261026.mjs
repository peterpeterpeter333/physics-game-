// D-1 後編（ys-chain-d1b）の data.json（Claude 2026-10-26）。desk-d1v1-data.mjs を写して、行番号ではなく cue キーで場面を決める形にした。
// 台本・声・時刻は読むだけ（変えない）。cue の行番号と主な語の時刻は docs/…/deep/D-1後編_cue時刻一覧.md から。
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const W=fileURLToPath(new URL('../../',import.meta.url));
const ID='ys-chain-d1b',CACHE=process.env.EM_FILM_CACHE??'/private/tmp/ys/'+ID+'_gpt_20261026';
assert.equal(CACHE,'/private/tmp/ys/ys-chain-d1b_gpt_20261026','Only isolated GPT cache is writable');
const root=CACHE+'/blender';mkdirSync(root+'/tex',{recursive:true});
const clip=JSON.parse(readFileSync(CACHE+'/'+ID+'.json'));
const timing=readFileSync(W+'docs/video-revision-20260924/deep/D-1後編_cue時刻一覧.md','utf8');
const tm=new Map();
for(const l of timing.split('\n')){const m=l.match(/^\| (\d+) \| `([^`]+)` \| .*? \| [\d.]+ \| [\d.]+ \| [\d.]+ \| .*? \| (.*?) \|$/);if(m)tm.set(m[2],{row:+m[1],words:m[3]});}
const numbers={fujiRatio:.63,efficiency:.01,perMinute:12,scores:[[1,0],[1,1],[1,2]],arrowsThin:2,arrowsWide:18};
assert.equal(numbers.fujiRatio,.63);assert.ok(numbers.efficiency>=.005&&numbers.efficiency<=.01);
assert.ok(numbers.perMinute>=10&&numbers.perMinute<20);assert.deepEqual(numbers.scores,[[1,0],[1,1],[1,2]]);
const palmPositions=[];for(let r=0;r<5;r++){const n=[3,5,6,5,3][r];for(let c=0;c<n;c++)palmPositions.push([(c-(n-1)/2)*.0082,(r-2)*.0093]);}
const layerCounts=Array.from({length:10},(_,i)=>40-4*i);
const fujiCounts=[27,...layerCounts.slice(3)];
assert.ok(Math.abs(fujiCounts.reduce((a,b)=>a+b,0)/layerCounts.reduce((a,b)=>a+b,0)-.63)<.01);
const cues=[];
for(const scene of clip.scenes)for(let i=0;i<scene.cues.length;i++){
 const q=scene.cues[i],cap=scene.captions[i],key=q.diagram.replace(/^cd1b-/,''),info=tm.get(key);assert.ok(info,key);
 const wordEvents=info.words.split('<br>').flatMap(w=>{const m=w.match(/^(.*?) ([\d.]+)$/);return m?[{word:m[1],time:+m[2]}]:[];});
 cues.push({key,row:info.row,start:cap.start,end:cap.end,subtitle:q.subtitle,wordEvents,face:q.face??null,view:q.view??null,group:key.split(':')[0]});
}
assert.equal(cues.length,63);assert.equal(new Set(cues.map(c=>c.row)).size,48);
const data={episode:'d1b',duration:clip.duration,cues,numbers,palmPositions,layerCounts,fujiCounts,events:Object.fromEntries(cues.map(c=>[c.key,c.wordEvents]))};
writeFileSync(root+'/data.json',JSON.stringify(data,null,1));
mkdirSync(CACHE+'/problem',{recursive:true});
const md=readFileSync(W+'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1後編_ナレーション.md','utf8');
const section=md.split('## 問題編への接続（いまは作らない。入れるときのため）')[1].trim();
writeFileSync(CACHE+'/problem/problem.json',JSON.stringify({episode:'D-1 後編',sourceMarkdown:section,images:{challenge:'挑戦.png',answer:'答え.png'},parts:['排水の弁（どちらにも開く）','筒','ピストン','空気の粒']},null,1));
// 地図（今の版と同じ板の絵）
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840"><rect width="1200" height="840" fill="#bdced0"/><path d="M150 120 L190 80 225 105 205 170 240 210 225 250 200 275 185 210 160 185Z M295 170 L365 135 440 150 485 130 530 165 610 115 680 145 710 100 755 145 800 160 850 145 1000 230 1080 350 980 420 915 510 855 500 830 600 760 650 710 570 660 600 630 535 595 500 570 600 530 625 500 545 450 520 380 535 305 500 270 405 310 360 285 300Z M660 90 L700 25 750 35 760 95 710 165Z" fill="#92a779" stroke="#f4e8cc" stroke-width="12"/><path d="M380 260 Q600 310 780 250 M380 380 Q600 390 900 340 M480 170 L500 500 M680 180 L675 480" fill="none" stroke="#c9d0ad" stroke-width="5"/></svg>`;
await sharp(Buffer.from(svg)).png().toFile(root+'/tex/d1-europe.png');
console.log(JSON.stringify({cache:CACHE,cues:cues.length,rows:48,duration:clip.duration},null,1));

