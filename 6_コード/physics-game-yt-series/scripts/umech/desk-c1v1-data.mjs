// C-1 の数・撮影・動作の正本。既存の台本と音声は読むだけ。
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';
export const NUM={sum:45,ones:15,tens:4,carryInput:9999,carryAnswer:10000,carryFalls:4,movingGears:5,challengeInput:999,challengeAnswer:1000,challengeFalls:3,multiply:21,scores:[[0,0],[0,1],[0,2],[1,2]],places:['一万','千','百','十','一']};
export const arm=d=>60*d/9;
export function digitsAt(t,events){let v=0;for(const e of events)if(t>=e.time)v=e.value;return String(v).padStart(5,'0').split('').map(Number);}
assert.equal(27+18,NUM.sum);assert.equal(7+8,NUM.ones);assert.equal(2+1+1,NUM.tens);
assert.equal(9999+1,NUM.carryAnswer);assert.equal(999+1,NUM.challengeAnswer);assert.equal(7*3,7+7+7);assert.equal(arm(9),60);assert.equal(arm(0),0);
const carry=(n)=>{let falls=0,moves=1;while(n%10===9){falls++;moves++;n=Math.floor(n/10);}return [falls,moves];};
assert.deepEqual(carry(9999),[NUM.carryFalls,NUM.movingGears]);assert.deepEqual(carry(999),[NUM.challengeFalls,4]);
export async function build(){
 const W=fileURLToPath(new URL('../../',import.meta.url)),cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1',out=cache+'/blender';
 fs.mkdirSync(out+'/tex',{recursive:true});
 const clip=JSON.parse(fs.readFileSync(cache+'/ys-chain-c1v1.json')),pt=JSON.parse(fs.readFileSync(cache+'/phrase-times.json'));
 const plan=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0];
 const timing=fs.readFileSync(W+'docs/video-revision-20260924/deep/C-1_cue時刻一覧.md','utf8');
 const direction=fs.readFileSync('/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/C-1/C-1_制作指示書.md','utf8');
 const rows=new Map(),times=new Map();
 for(const l of direction.split('\n')){const m=l.match(/^\| (\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|$/);if(m)rows.set(+m[1],m.slice(2));}
 for(const l of timing.split('\n')){const m=l.match(/^\| (\d+) \| `([^`]+)` \| .*? \| [\d.]+ \| [\d.]+ \| [\d.]+ \| .*? \| (.*?) \|$/);if(m)times.set(m[2],{row:+m[1],words:m[3].split('<br>').map(w=>{const q=w.match(/^(.*?) ([\d.]+)$/);return q?{word:q[1],time:+q[2]}:null;}).filter(Boolean)});}
 const P=(x,y,z,dist,az,el,lens=40)=>[x,y,z,dist,az,el,lens];
 // 縦画面の横の画角を基準に、主役60〜70％。奥の部屋は上端に残す。
 const cameras={desk:P(-.43,.115,.04,1.10,-105,45),crowd:P(.10,.425,.05,.72,-10,32),pascal:P(.22,-.05,.10,.21,-12,38),paper:P(.05,-.22,.005,.49,0,70),
  m1:P(.05,.06,.045,.92,0,40),dial:P(.178,.028,.078,.18,0,55),m1close:P(.145,.055,.055,.47,0,50),
  meter:P(.40,-.08,.03,.35,0,30),pair:P(.18,.05,.16,.57,0,30),m2:P(0,.05,.30,1.35,0,30),eight:P(0,.05,.30,1.85,0,28),
  arm:P(.18,.05,.19,.52,-6,30),shishi:P(-.42,-.02,.07,.32,15,35),domino:P(.42,-.12,.018,.32,15,35),score:P(.58,.30,.07,.78,0,30),
  proto:P(.10,.36,.07,2.35,0,25),order:P(.05,-.18,.025,.87,0,45),price:P(.24,.14,.055,1.35,-12,35)};
 function setup(r){if(r<=2||r===5||r===43)return ['desk','desk'];if(r<=4)return ['crowd','crowd'];if(r===6)return ['pascal','pascal'];if(r<=10)return ['paper','paper'];if(r===12)return ['m1','dial'];if(r>=14&&r<=16)return ['m1','m1close'];if(r===17)return ['meter','meter'];if(r===18||r===19)return ['m2','pair'];if(r===21||r===22)return ['order','order'];if(r===23||r===35)return ['score','score'];if(r===27)return ['eight','eight'];if(r>=24&&r<=28||r===33||r===42)return ['m2','m2'];if(r>=29&&r<=31)return ['arm','arm'];if(r===32)return ['shishi','shishi'];if(r===34)return ['domino','domino'];if(r===36||r===37)return ['proto','proto'];if(r===38)return ['m1','price'];return ['m1','m1'];}
 const cues=[];let prior=null;
 for(let si=0;si<clip.scenes.length;si++){const s=clip.scenes[si];for(let i=0;i<s.cues.length;i++){
  const q=plan.scenes[si].cues[i],cap=s.captions[i],key=q.diagram.replace('cc1v1-',''),info=times.get(key);assert.ok(info,key);const [group,camera]=setup(info.row),ins=rows.get(info.row);assert.ok(ins,key);
  const move=prior===camera?0:key==='last:desk'?1.2:key==='desk:night'?1.5:1;
  cues.push({key,row:info.row,start:cap.start,end:cap.end,voiceEnd:cap.start+pt[q.subtitle].end,group,camera,pose:cameras[camera],move,subject:group==='arm'?'腕・おもり・一と十の歯車':ins[0],subjectWidth:group==='paper'?.60:group==='m2'?.70:.64,objects:ins[0],cameraInstruction:ins[1],action:ins[2],labels:ins[3],words:info.words,face:q.face??null,view:q.view??null});prior=camera;
 }}
 assert.equal(cues.length,53);const by=Object.fromEntries(cues.map(c=>[c.key,c]));
 const norm=s=>s.normalize('NFKC').replace(/[\s'_]/g,'').replace(/ハ/g,'ワ').replace(/ヘ/g,'エ').replace(/ヲ/g,'オ');
 function T(key,needle,occ=0){const c=by[key],p=pt[plan.scenes.flatMap(s=>s.cues).find(q=>q.diagram==='cc1v1-'+key).subtitle];let pos=-1;const pat=new RegExp(norm(needle).replace(/[ウオ]/g,'[ウオ]'),'g'),s=norm(p.s);for(let i=0;i<=occ;i++){const m=pat.exec(s);assert.ok(m,`${key} ${needle} / ${s}`);pos=m.index;}return c.start+p.t[pos];}
 const ev=[],add=(time,value,duration=.12,tag='click')=>ev.push({time,value,duration,tag});
 add(0,0,0,'reset');
 add(T('gear:dial','ヒトメモリ'),1,.4);add(by['gear:dial'].voiceEnd+.20,0,.30);
 for(let i=1;i<=2;i++)add(T('gear:27','ニメモリ')+(i-1)*.30,i*10);
 for(let i=1;i<=7;i++)add(T('gear:27','ナナメモリ')+(i-1)*.15,20+i);
 for(let i=1;i<=2;i++)add(T('gear:turn8','ハチメモリ')+(i-1)*.25,27+i);
 add(T('gear:zero','ゼロニ'),20);
 add(by['carry:simple'].start,29,0,'reset');add(T('carry:bump','オス'),30,.12,'bump');
 for(let i=1;i<=5;i++)add(T('carry:ones','ゴメモリ')+(i-1)*.20,30+i);
 add(T('carry:ten','ヒトメモリ'),45,.40);
 add(T('hard:9999','ツクル'),0,.4,'reset');add(T('hard:9999','キュウセン'),9999,.6,'reset');
 add(by['arm:lift'].start,7,.4,'reset');add(T('arm:lift','モチアゲテ'),8,.12);add(T('arm:lift','モチアゲテ')+.45,9,.12);
 add(T('arm:drop','ウデガ'),10,.15,'drop');add(by['arm:wait'].start,9999,.4,'reset');
 const chainStart=T('arm:chain','ジュウノクライオ');for(const [i,v]of[9990,9900,9000,10000].entries())add(chainStart+i*.25,v,.15,'drop');
 add(by['next:mult'].start,0,0,'reset');for(let i=1;i<=3;i++)add(T('next:mult','クリカエセバ')+(i-1)*.4,7*i,.12);
 add(by['ch:intro'].start,999,0,'reset');ev.sort((a,b)=>a.time-b.time);
 assert.deepEqual(digitsAt(by['gear:27'].end-.1,ev),[0,0,0,2,7]);assert.deepEqual(digitsAt(by['carry:45'].end-.1,ev),[0,0,0,4,5]);assert.deepEqual(digitsAt(by['arm:chain'].end-.1,ev),[1,0,0,0,0]);
 const effects={collapse:T('desk:pile','マチガイガ'),idea:T('son:idea','カンガエマシタ'),box:T('gear:box','ハグルマ'),meter:T('carry:meter','ゼロニ'),bump:T('carry:bump','オス'),contacts:T('hard:if','チョクセツ'),arrows:T('hard:if','イチドニ'),shake:T('hard:crack','ユビニ'),crack:T('hard:crack','ハガ'),shishi:T('arm:shishi','コント'),water:T('arm:shishi','ミズオ'),chain:chainStart,price:T('dad:price','タカクテ'),toll:by['dad:price'].voiceEnd+.15};
 const previews=[1.1,effects.collapse+.85,63.1,89,104.44,effects.bump+.08,155.3,effects.crack+.3,T('arm:lift','モチアゲテ')+.52,effects.shishi+.12,chainStart+.38,358.7];
 const motionSeconds=cues.reduce((a,c)=>a+c.move,0),topSeconds=cues.filter(c=>c.pose[5]>=65).reduce((a,c)=>a+c.end-c.start,0);assert.ok(motionSeconds/clip.duration<.2);assert.ok(topSeconds/clip.duration<.2);
 const mid=k=>(by[k].start+by[k].end)/2;
 const extraPreviews=[171.8,effects.water+1.5,effects.shishi+.18,...['desk:revolt','son:idea','gear:dial','carry:meter','arm:domino','carry:point','arm:judge','dad:proto','dad:price','hard:9999'].map(mid),T('arm:drop','ウデガ')+.17,effects.chain+1.1];
 const data={id:'c1v1',numbers:NUM,cues,cameras,duration:clip.duration,events:ev,effects,previews,extraPreviews,motionSeconds,topSeconds};
 fs.writeFileSync(out+'/data.json',JSON.stringify(data,null,1));
 const ledger=`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1000"><rect width="720" height="1000" fill="#efe2c4"/>${Array.from({length:16},(_,r)=>`<path d="M40 ${65+r*56}H680" stroke="#bca77e" stroke-width="2"/>${Array.from({length:4},(_,c)=>`<text x="${64+c*168}" y="${56+r*56}" font-family="serif" font-size="32" fill="#49331c">${String((r+3)*(c+7)*13).padStart(4,' ')}</text>`).join('')}`).join('')}</svg>`;
 await sharp(Buffer.from(ledger)).png().toFile(out+'/tex/c1-ledger.png');
 const doc=['# C-1 撮影台本（ChatGPT）','',`全${cues.length} cue、${clip.duration.toFixed(3)}秒。字幕・日本語・声・時刻は固定。カメラ移動 ${motionSeconds.toFixed(2)}秒／${(100*motionSeconds/clip.duration).toFixed(2)}％。仰角65°以上 ${topSeconds.toFixed(2)}秒／${(100*topSeconds/clip.duration).toFixed(2)}％。`,'','主役の横幅はカメラ設計値。関門B/Cの実写で再点検。M1/M2は同じeventsから読むdigits(t)を共有。8個の図は5個とは入れ替えて置く。'];
 for(const c of cues)doc.push('',`## 行${c.row}・${c.key} ${c.start.toFixed(2)}〜${c.end.toFixed(2)}秒`,'',`- カメラ：${c.move?`${c.start.toFixed(2)}秒から${c.move}秒で移り、その後止める`:'止める'}。P((${c.pose.slice(0,3)}),${c.pose.slice(3)})。`,`- 主役：${c.subject}。画面横幅の${Math.round(c.subjectWidth*100)}％。`,`- 物：${c.objects}`,`- 手・動き：${c.action}`,`- 合わせる語・秒：${c.words.map(w=>`${w.word} ${w.time.toFixed(2)}`).join('／')}`,`- 札：${c.labels}`,`- 顔：${JSON.stringify(c.face)}。見方：${c.view??'なし'}。`);
 doc.push('','## 補足','', '- 冒頭と最後は同一の姿勢 P(('+cameras.desk.slice(0,3).join(',')+'),'+cameras.desk.slice(3).join(',')+')。同じ6枚の帳簿・同じろうそくへ戻り、紙面へ焦点を合わせる。M1は指示の中央(.05,.06)のまま最後だけ紙の向こう側へ加わる。紙47％前後とM1全体の同時表示を実画像で点検する。','- 赤い突起は指定の8mm幅。歯車局所−36°に固定した真鍮carrierで自分の歯車へつなぎ、9の位置で隣の歯先に約.8mm重なる。行26では4接点が実際に同時に接し、黄の点もその接点へ置く。','- ししおどしは口が55°から15°までゆっくり下がり、0.07秒で水をこぼし、続く0.09秒で戻る。閉じた尻が右の石を打つのをコトンの時刻に合わせる。補足試写で給水途中と打撃直後も確かめる。','- 腕の落下は4段を0.25秒ずつずらす。水平時の重りの中心は隣の歯車の中心xに一致し、歯先との上下・前後の接触を約1mmで持つ。指の直接負荷を示す5本の矢印は同時に出す。','- 関門Cは主要12時刻に加え、全18カメラを覆う補足15時刻を撮る。盤・人物は寄り、幅広の得点板・試作列は引いて、物の横幅を4〜7割へ調整する。','- M2全体と8歯車のカメラtarget.zは.30。模型を指示の下半分へ置き、腕を札で隠さない。M2全体の桁札はy850/770、腕のアップはy680/600、9999の注記はy1560へ分離する。','- 行29は新しい見本7へ入れ直す。行42は999のまま止める。答えの1000は問題編の答え画像だけ。','- 得点と顔が同時になる箇所は台本の時刻を優先し、全画面の顔の間は札を隠す。');
 const docPath=W+'docs/video-revision-20260924/deep/C-1_撮影台本_ChatGPT.md';fs.writeFileSync(docPath,doc.join('\n'));
 const source=fs.readFileSync(W+'docs/video-revision-20260924/deep/技術の疑問の鎖_C-1_第1版_ナレーション.md','utf8'),problem=source.split('## 問題編への接続（いまは作らない。入れるときのため）\n')[1].split('\n## 点検で直した所')[0];fs.mkdirSync(cache+'/problem',{recursive:true});fs.writeFileSync(cache+'/problem/problem.json',JSON.stringify({sourceSection:problem,parts:['計算機の箱 M1','仕組みの拡大模型 M2','おもりの付いた腕','カイのミトンの手'],challengeDigits:[0,0,9,9,9],answerDigits:[0,1,0,0,0],falls:3},null,1));
 console.log(JSON.stringify({cache,cues:cues.length,duration:clip.duration,previews,assertions:'PASS',docPath},null,2));return data;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await build();
