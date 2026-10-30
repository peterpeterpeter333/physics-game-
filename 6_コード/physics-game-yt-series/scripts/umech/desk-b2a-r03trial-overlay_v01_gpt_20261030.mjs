// B-2a S3 only. Claude S2 revisions; originals and prior S2 version are read-only.
// One frame entry; measured cards; exact native j (no nearest-frame substitution).
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {esc} from './anim.mjs';
import {chunkTimes,faceLayer,faceDefs,deskFrame as originalDeskFrame} from './desk-frame.mjs';
import {voiceMap,normKana} from './yt1-chain-00bx-common.mjs';

export const SOURCE_CACHE='/private/tmp/ys/ys-chain-b2a_gpt_20261029';
export const CACHE='/private/tmp/ys/ys-chain-b2a_r03trial_gpt_20261030';
export const ID='ys-chain-b2a_gpt_20261029',KEY='b2a_s4final_gpt_20261030',FPS=30;
const FONT='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const sm=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
const n=v=>Number(v.toFixed(3));
const metricCache=new Map(),layoutCache=new Map();
let prepared=false,currentClip=null,anchorsCache=null,bgCache=null;
const COLOR={white:'#fffaf0',blue:'#b6d2ff',pink:'#ffb4cc',gold:'#ffe0a7',muted:'#e4ddd2'};
export const LABELS=Object.freeze({
 nerveShort:'神経',brassShort:'真鍮',ironShort:'鉄',safety:'まねを しない',capacitor:'電気を ためる 板',londonDip:'ロンドン：下に 傾く',australiaDip:'オーストラリア：上に 傾く',
 answer:'答え合わせ',step1:'一段目',step2:'二段目',step3:'三段目',step4:'四段目',
 north:'北',south:'南',n:'N',s:'S',redMark:'赤い 印',redSouth:'赤い 印 ＝ 南',australia:'オーストラリア（南半球）',italy:'イタリア',london:'ロンドン',up:'答え：上に 傾く',
 score3:'言い伝え 0 − 3 実験',score4:'言い伝え 0 − 4 実験',
 definition:'言い伝え ＝ 信じられていたが、実験で 崩れた 考え',
 galvani:'1780年代 イタリア ボローニャ ガルヴァーニ',galvaniName:'ガルヴァーニ',nerve:'神経 ＝ 体に 合図を 伝える 糸',brass:'真鍮 ＝ 金色の 金属',iron:'鉄',
 battery:'電池',static:'静電気：ぱちっと 一瞬',analogy:'見方：たとえ話',example:'見方：具体例',check:'見方：確かめる側から',
 voltage:'高さの 差 ＝ 押す 力 ＝ 電圧（ボルト）',current:'流れる 量（1秒に どれだけ）＝ 電流',onefive:'1.5ボルト',thousands:'何千ボルト',ratio:'乾電池の 千倍 以上',
 amount:'見方：流れる 量から',highsmall:'静電気：高いけど 少ない → 一瞬',pump:'電池 ＝ くみ上げ 続ける ポンプ',
 machine:'静電気を 作る 機械',helper:'研究室で 手伝う 人',spark:'火花 → 足が ける',electricKick:'電気が 流れる → 足が 動く',metalKick:'金属だけでも ぴくっ → 電気が 流れた',
 hypothesis:'仮説：電気は カエルの 体の 中に ある（動物電気）',ray:'シビレエイ：体から 電気',path:'金属 ＝ 通り道（と ガルヴァーニは 考えた）',
 volta:'1790年代 イタリア パヴィーア ヴォルタ',book:'1791年 ガルヴァーニの 本',same:'同じ 金属（鉄と 鉄）：弱い',different:'違う 2種類（真鍮と 鉄）：強い',
 voltaIdea:'ヴォルタの 考え：電気は 違う 2種類の 金属から',detector:'電気を 感じる 道具？',alarm:'鳴る 物 ≠ 煙を 出す 物',kickQuestion:'動く 物 ≠ 電気を 出す 物？',
 ifTrue:'もし正しいなら',prediction:'予言：カエル なし → 電気は 出ない',role1:'役 その1：しょっぱい 水',zinc:'亜鉛',cardboard:'塩水の 厚紙',copper:'銅',salty:'カエルの 中も しょっぱい 水',
 role2:'役 その2：感じる → ぬらした 指',stronger:'重ねるほど 強い（わけは 後編）',year1800:'1800年 イタリア ヴォルタ',fact1:'事実1：カエル なしで、指に びりっ',
 scope:'金の 葉の 検電器',fact:'事実',fact2:'事実2：生き物で ない 道具でも、電気が 出ている',judgment:'判定 ×',later:'後に 分かったこと',nerveSignal:'神経の 合図 ＝ 小さな 電気',
 pile:'電堆（でんたい）＝ 電気の 積み重ね',letter:'1800年3月 ロンドンの 王立協会へ',member:'ヴォルタも 会員',once:'静電気：一度',repeat:'電堆：ため 直さず 何度でも',back:'B-2 後編',question:'？'
});

async function measure(text,size,stroke=0){
 const key=JSON.stringify([text,size,stroke]);if(metricCache.has(key))return metricCache.get(key);
 if(!text){const zero={width:0,height:0,left:0,right:0,top:0,bottom:0};metricCache.set(key,zero);return zero;}
 const width=Math.max(640,Math.ceil([...text].length*size*1.7+160)),height=Math.ceil(size*4),x=60,y=size*2;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#fff"/><text x="${x}" y="${y}" ${FONT} font-size="${size}" font-weight="800" fill="#000"${stroke?` stroke="#000" stroke-width="${stroke}" paint-order="stroke"`:''}>${esc(text)}</text></svg>`;
 const {info}=await sharp(Buffer.from(svg)).trim({background:'#ffffff',threshold:24}).raw().toBuffer({resolveWithObject:true});
 const left=-info.trimOffsetLeft-x,top=-info.trimOffsetTop-y;
 const result={width:info.width,height:info.height,left,right:left+info.width,top,bottom:top+info.height};
 metricCache.set(key,result);return result;
}

async function makeLayout(text,size,maxWidth=952,maxLines=2){
 const key=JSON.stringify([text,size,maxWidth,maxLines]);if(layoutCache.has(key))return layoutCache.get(key);
 if(size===36&&maxWidth===450&&/^(同じ金属|違う2種類)（/.test(text)){
  const split=text.indexOf('（'),parts=[text.slice(0,split),text.slice(split)],lines=[];
  for(const part of parts){const metric=await measure(part,size);assert.ok(metric.width<=maxWidth);lines.push({text:part,metric});}
  const result={text,size,maxWidth,lines,width:Math.max(...lines.map(x=>x.metric.width))};layoutCache.set(key,result);return result;
 }
 const all=[...String(text)],lines=[];let i=0;
 while(i<all.length){
  let end=all.length,row=all.slice(i,end).join(''),m=await measure(row,size);
  if(m.width>maxWidth){
   let lo=i+1,hi=all.length;
   while(lo<hi){const mid=Math.ceil((lo+hi)/2);if((await measure(all.slice(i,mid).join(''),size)).width<=maxWidth)lo=mid;else hi=mid-1;}
   end=lo;
   // Keep punctuation with the preceding row if one extra character still fits.
   if(/[。、）」』]/.test(all[end]??'')&&(await measure(all.slice(i,end+1).join(''),size)).width<=maxWidth)end++;
   row=all.slice(i,end).join('');m=await measure(row,size);
  }
  assert.ok(end>i&&m.width<=maxWidth,`Unfittable B2a label: ${text}`);lines.push({text:row,metric:m});i=end;
 }
 if(lines.length===2){
  // Label wrapping is layout only: avoid a final one-character fragment such
  // as 考 / え or a closing bracket alone. The spoken/subtitle chunks are never
  // passed here and remain frozen in their original lines.
  const choices=[];
  for(let k=1;k<all.length;k++)if(/[ 　、。・：→]/.test(all[k-1])&&!/[。、）」』]/.test(all[k])){
   const a=all.slice(0,k).join(''),b=all.slice(k).join(''),ma=await measure(a,size),mb=await measure(b,size);
   if(ma.width<=maxWidth&&mb.width<=maxWidth)choices.push({a,b,ma,mb,cost:Math.abs(ma.width-mb.width)});
  }
  if(choices.length){const best=choices.sort((a,b)=>a.cost-b.cost)[0];lines.splice(0,2,{text:best.a,metric:best.ma},{text:best.b,metric:best.mb});}
 }
 assert.ok(lines.length<=maxLines,`B2a label exceeds ${maxLines} lines at ${size}px: ${text}`);
 assert.equal(lines.map(x=>x.text).join(''),String(text));
 const result={text,size,maxWidth,lines,width:Math.max(0,...lines.map(x=>x.metric.width))};layoutCache.set(key,result);return result;
}

export async function prepareTypography(clip){
 assert.equal(clip.id,ID);currentClip=clip;
 for(const text of Object.values(LABELS))await makeLayout(text,42,952,2);
 await makeLayout('かわいた 厚紙',42,952,2);
 for(const text of [LABELS.galvani,LABELS.volta,LABELS.year1800,LABELS.answer,LABELS.later])await makeLayout(text,36,952,2);
 await makeLayout('B 電気と電波 2',36,952,2);await makeLayout(clip.title,36,952,2);
 for(const key of ['londonDip','australiaDip'])await makeLayout(LABELS[key],36,450,2);
 for(const key of ['same','different'])await makeLayout(LABELS[key],36,952,2);
 for(const key of ['nerveShort','brassShort','ironShort','safety','capacitor'])await makeLayout(LABELS[key],36,952,2);
 await makeLayout(LABELS.alarm,36,512,2);
 for(const scene of clip.scenes)for(const q of scene.cues){
  for(const group of q.cap??[[q.subtitle]])for(const line of group){
   const m=await measure(line,66,7);assert.ok(m.width<=980,`Frozen caption wider than safe area: ${line}`);
  }
 }
 prepared=true;return typographyEvidence();
}

function card(text,{x=40,y=300,size=42,width=1000,maxLines=2,color=COLOR.white,bg='#151a24',opacity=1,audit=[],fixedWidth=false,compact=false}={}){
 if(opacity<=.001)return '';
 const key=JSON.stringify([text,size,width-48,maxLines]),layout=layoutCache.get(key);assert.ok(layout,'Label must be measured before composition: '+text);
 const lh=Math.ceil(size*1.24),h=compact?44:layout.lines.length*lh+20,drawWidth=fixedWidth?width:Math.ceil(layout.width+48);
 assert.ok(drawWidth<=width&&x>=40&&x+drawWidth<=1040&&y>=110&&y+h<=1600,'Card outside B2a safe rectangle');
 let s=`<g data-b2a-label="${esc(text)}" opacity="${n(opacity)}"><rect x="${x}" y="${y}" width="${drawWidth}" height="${h}" rx="14" fill="${bg}" fill-opacity=".82"/>`;
 const textBoxes=[];
 layout.lines.forEach(({text:line,metric:m},i)=>{
  // Use actual left bearing, not a character-count approximation.
  const tx=x+24-m.left,base=y+(compact?4:14)-m.top+i*lh;
  const b={x:tx+m.left,y:base+m.top,width:m.width,height:m.height,text:line,size};textBoxes.push(b);
  assert.ok(b.x>=x+20&&b.x+b.width<=x+drawWidth-20&&b.y>=y&&b.y+b.height<=y+h);
  s+=`<text x="${n(tx)}" y="${n(base)}" ${FONT} font-size="${size}" font-weight="800" fill="${color}">${esc(line)}</text>`;
 });
 audit.push({type:'label',text,size,rect:{x,y,width:drawWidth,height:h},textBoxes});return s+'</g>';
}

function measuredCompact(text,{x=40,y=300,width=1000,size=42,...rest}={}){
 // All labels are measured at full safe width. Short narrow tags are lazily
 // precomputed by prepareTypography; no emergency character-count fallback.
 return card(text,{x,y,width,size,...rest});
}

export function typographyEvidence(){return {method:'Native SVG text rasterized with Sharp/Hiragino; measured ink extents and bearings',fontFamily:FONT,minimumLabelFont:36,measuredTextCount:metricCache.size,layouts:[...layoutCache.values()].map(l=>({text:l.text,size:l.size,maxWidth:l.maxWidth,lines:l.lines.map(x=>({text:x.text,...x.metric}))}))};}
function yearFor(row){if(row>=9&&row<=23)return LABELS.galvani;if(row>=24&&row<=31)return LABELS.volta;if(row>=32&&row<=43&&row!==36)return LABELS.year1800;if(row===36)return LABELS.later;return row>=2&&row<=7?LABELS.answer:null;}
function viewFor(row){return ({14:'analogy',16:'example',18:'amount',25:'example',27:'analogy',28:'check'})[row];}
function spokenAt(row,kana){
 for(const scene of currentClip.scenes)for(let i=0;i<scene.cues.length;i++){
  const q=scene.cues[i];if(q.masterRow!==row)continue;
  const vm=voiceMap({cue:q,t:0,dur:scene.captions[i].end-scene.captions[i].start}),at=vm.s.indexOf(normKana(kana));
  if(at>=0)return scene.captions[i].start+vm.t[at];
 }
 throw new Error('No frozen spoken label clock: '+row+'/'+kana);
}
const insetCache=new Map();
function priorInset(j,x,y,w,h){
 const f=path.join('/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029/blender/desk',String(j).padStart(5,'0')+'.jpg');
 if(!insetCache.has(f))insetCache.set(f,fs.readFileSync(f).toString('base64'));
 return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 165 540 420" overflow="hidden"><image width="540" height="960" href="data:image/jpeg;base64,${insetCache.get(f)}"/></svg>`;
}

export function overlayB2A({t,cue:q,cap,anchor,audit=[]}){
 const row=q.masterRow,part=q.part??1;let s='';
 const add=(key,y=310,opts={})=>{s+=measuredCompact(LABELS[key]??key,{y,audit,...opts});};
 const yr=yearFor(row);if(yr)s+=card(yr,{y:110,size:36,audit,color:COLOR.gold});
 const view=viewFor(row);if(view)add(view,190,{color:COLOR.pink});
 switch(row){
  case 4:add('step1');break;
  case 5:add('step2');break;
  case 6:add('step3');break;
  case 7:add('step4');if(part>=2)add('up',980,{color:COLOR.gold});break;
  case 8:add('score3',110,{color:COLOR.gold});if(part>=2)add('definition',232);break;
  case 10:if(part===1){add('nerve');add('brass',232);}break;
  case 12:add('battery');break;
  case 13:add('static');break;
  case 15:add(part===1?'voltage':'current',310,{color:COLOR.gold});break;
  case 16:add(part===1?'onefive':'thousands',310,{color:COLOR.gold});if(part>=2)add('ratio',1010);break;
  case 18:add(part===1?'highsmall':'pump',330,{color:COLOR.blue});break;
  case 19:
   if(t>=spokenAt(19,'セエデンキオツクルキカイ'))add('machine',230);
   if(t>=spokenAt(19,'ピクットケッタ'))add('spark',1110,{color:COLOR.gold});
   break;
  case 20:add(part===1?'electricKick':'metalKick',310,{color:COLOR.gold});break;
  case 21:add('hypothesis');break;
  case 22:add(part===1?'ray':'path');break;
  case 24:if(part===1)add('book');break;
  case 25:
   // Screen-fixed matched panels: never dependent on a clipped 3D anchor.
   s+='<path d="M40 806 H1040" stroke="#9a8067" stroke-width="3" opacity=".5"/>';
   s+=card(LABELS.same,{x:40,y:250,size:36,width:1000,color:COLOR.muted,audit,fixedWidth:true,compact:true});
   s+=card(LABELS.different,{x:40,y:826,size:36,width:1000,color:COLOR.gold,audit,fixedWidth:true,compact:true});
   break;
  case 26:add(part===1?'voltaIdea':'detector');break;
  case 27:
   // Large detector above, the exact same Z-foot below. These are labels for
   // two corresponding cause/result pictures, not a replacement for them.
   s+='<path d="M40 989 H1040" stroke="#9a8067" stroke-width="3" opacity=".5"/>';
   if(t>=spokenAt(27,'ナリワシテモ'))add('alarm',830,{x:480,width:560,size:36});
   add('kickQuestion',1010,{color:COLOR.gold});
   break;
  case 28:add('ifTrue',330);add('prediction',430,{color:COLOR.gold});break;
  case 29:add('role1');if(part>=2)add('salty',190);break;
  case 30:add('role2');break;
  case 31:add('stronger');break;
  case 32:add('fact1');break;
  case 33:add(part===1?'scope':'fact2',310,{color:COLOR.gold});break;
  case 34:
   add('score4',190,{color:COLOR.gold});
   add(part===1?'prediction':'hypothesis',300,{color:COLOR.gold});
   add('fact',480,{color:COLOR.blue});
   s+='<rect x="40" y="565" width="1000" height="390" rx="16" fill="#e9e4da"/>';
   s+=priorInset(Math.round((spokenAt(32,'ビリット')+.15)*FPS),50,580,470,360)+priorInset(Math.round((spokenAt(33,'ハガヒライタ')+.8)*FPS),560,580,470,360);
   if(t>=spokenAt(34,'ヨゲントジジツガアイマセン'))add('judgment',1000,{color:COLOR.pink});
   if(t>=spokenAt(34,'クズレタ'))s+='<path d="M50 355 L1020 355" stroke="#ff5a4a" stroke-width="9"/>';
   break;
  case 36:
   if(t>=spokenAt(36,'ゼンブガマチガイデワナカッタ'))add('nerveSignal',310,{color:COLOR.blue});
   if(t>=spokenAt(36,'コノツクエノ')){add('hypothesis',950);s+='<path d="M60 980 L1030 1090 M1030 980 L60 1090" stroke="#ff5a4a" stroke-width="10"/>';}
   break;
  case 37:add('pile',310,{color:COLOR.gold});break;
  case 38:add('letter');add('member',1020);break;
  case 39:add(t<spokenAt(39,'デンタイワ')?'once':'repeat',310,{color:COLOR.gold});break;
  case 41:add('back',310,{color:COLOR.gold});break;
  case 42:
   add(t<spokenAt(42,'カワイタアツガミ')?'cardboard':'かわいた 厚紙',310,{color:COLOR.gold});
   if(t>=spokenAt(42,'ビリット'))add('question',1030,{color:COLOR.gold});break;
  case 43:add('score4',232,{color:COLOR.gold});break;
 }
 // All dedicated callouts below refer to native projected anchors. Text added
 // here is authorized in Claude's S2 correction instructions, not narration.
 const anchorPoint=name=>{
  const p=anchor?.('label.'+name);
  // project() may retain positive depth for a point outside the camera crop.
  // Never draw a misleading leader all the way from an off-screen pole.
  return p&&p[2]!==false&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&p[0]>=40&&p[0]<=1040&&p[1]>=110&&p[1]<=1160?p:null;
 };
 const leaderCard=(name,text,{x,y,size=42,width=1000,color=COLOR.gold,leader=true}={})=>{
  const p=anchorPoint(name);if(!p)return;
  const lay=layoutCache.get(JSON.stringify([text,size,width-48,2]));assert.ok(lay,'Unmeasured anchored callout '+text);
  const w=Math.ceil(lay.width+48),h=lay.lines.length*Math.ceil(size*1.24)+20;
  x=Math.max(40,Math.min(1040-w,x??p[0]-w/2));
  const minY=row===25?270:row===9&&name==='galvani'?230:460;
  y=Math.max(minY,Math.min(1160-h,y??p[1]-h-65));
  const overlaps=(xx,yy)=>audit.some(a=>a.type==='label'&&a.rect&&xx<a.rect.x+a.rect.width+8&&xx+w+8>a.rect.x&&yy<a.rect.y+a.rect.height+8&&yy+h+8>a.rect.y);
  // Nerve and brass targets meet physically, but their tags must stay distinct.
  // Move the tag, not its target or the supplied text, if two cards would touch.
  const candidates=[y,y+82,y-82,y+164,y-164,y+246,y-246].filter(v=>v>=minY&&v+h<=1160);
  const clear=candidates.find(v=>!overlaps(x,v));if(clear!==undefined)y=clear;
  if(leader){
   const edges=[{x:Math.max(x,Math.min(x+w,p[0])),y},{x:Math.max(x,Math.min(x+w,p[0])),y:y+h},{x,y:Math.max(y,Math.min(y+h,p[1]))},{x:x+w,y:Math.max(y,Math.min(y+h,p[1]))}];
   const from=edges.sort((a,b)=>Math.hypot(a.x-p[0],a.y-p[1])-Math.hypot(b.x-p[0],b.y-p[1]))[0];
   s+=`<path d="M${n(from.x)} ${n(from.y)} L${n(p[0])} ${n(p[1])}" fill="none" stroke="${color}" stroke-width="3" stroke-opacity=".9"/><circle cx="${n(p[0])}" cy="${n(p[1])}" r="5" fill="${color}"/>`;
  }
  s+=card(text,{x,y,size,width,audit,color});
  audit.push({type:'anchorTarget',anchor:'label.'+name,anchorPosition:p,text,rect:{x,y,width:w,height:h}});
 };
 const rotationDone=row!==4||t>=spokenAt(4,'チキュウノキタ')+1.2;
 const names=[4,5].includes(row)&&rotationDone?(row===4?['north','south','n','s']:['north','south']):[6,7].includes(row)?['australia']:row===29?['copper','cardboard','zinc']:row===38?['italy','london']:[];
 const items=names.map(name=>({name,p:anchorPoint(name)})).filter(x=>x.p);
 const materialY={};
 if(row===29){let prev=460-82;for(const item of items){const y=Math.max(460,item.p[1]-36,prev+82);materialY[item.name]=y;prev=y;}const overflow=Math.max(0,prev-1050);for(const name of Object.keys(materialY))materialY[name]-=overflow;}
 for(const {name,p} of items){
  const text=LABELS[name],lay=layoutCache.get(JSON.stringify([text,42,952,2])),w=Math.ceil(lay.width+48);
  let x=40,y=1080,leader=false;
  if([2,3,4,5].includes(row)){x=name==='n'||name==='s'?p[0]+65:p[0]-w-65;y=p[1]-36;leader=true;}
  else if(row===29){x=40;y=materialY[name];leader=true;}
  else if(row===38){x=name==='italy'?p[0]+65:p[0]-w-65;y=p[1]-36;leader=true;}
  leaderCard(name,text,{x,y,leader,color:name==='n'?'#ff8b78':name==='s'?'#99c6ff':COLOR.gold});
 }
 if([2,3,4].includes(row))leaderCard('redMark',row===4&&rotationDone?LABELS.redSouth:LABELS.redMark,{x:40,y:470,color:'#ffb4a0'});
 if(row===8){
  for(const [name,key] of [['london','londonDip'],['australia','australiaDip']]){
   const p=anchorPoint(name);if(p)leaderCard(name,LABELS[key],{x:name==='london'?40:542,y:p[1]+90,size:36,width:498,color:COLOR.gold});
  }
 }
 const footRevealed=row!==43||part>1||t>=cap.start+.9;
 if([9,10,11,20,21,28,43].includes(row)&&footRevealed){
  const ns=anchorPoint('nerve'),bs=anchorPoint('brass'),is=anchorPoint('iron');
  // Compact 36px object tags point to the actual white nerve and colored rods.
  if(ns)leaderCard('nerve',LABELS.nerveShort,{x:ns[0]-140,y:ns[1]-145,size:36,color:COLOR.white});
  if(bs)leaderCard('brass',LABELS.brassShort,{x:bs[0]-165,y:bs[1]-100,size:36,color:COLOR.gold});
  if(is)leaderCard('iron',LABELS.ironShort,{x:is[0]+60,y:is[1]+45,size:36,color:COLOR.blue});
 }
 if(row===9){
  const head=anchorPoint('galvani');
  if(head)leaderCard('galvani',LABELS.galvaniName,{y:Math.min(365,head[1]-150),color:COLOR.gold,leader:false});
 }
 if(row===33&&t>=spokenAt(33,'ハナレテヒラク')&&t<spokenAt(33,'デンタイノハシニツナグ')){
  s+='<path d="M480 800 l-36 35 m36 -35 l-9 30 M600 800 l36 35 m-36 -35 l9 30" fill="none" stroke="#ffd23f" stroke-width="6"/>';
 }
 if(row===33){const p=anchorPoint('capacitor');if(p)leaderCard('capacitor',LABELS.capacitor,{x:p[0]+60,y:p[1]-50,size:36,color:COLOR.gold});}
 if([13,16,30,32,39].includes(row)||(row===22&&part===1)){
  const text=LABELS.safety,lay=layoutCache.get(JSON.stringify([text,36,952,2])),w=Math.ceil(lay.width+48);
  s+=card(text,{x:1040-w,y:1450,size:36,color:'#ffd0bc',bg:'#48251f',audit});
 }

 return s;
}

function exactBackground(t){
 const cache=process.env.EM_FILM_CACHE??CACHE;assert.equal(cache,CACHE,'B2a uses its isolated cache');
 const j=Math.round(t*FPS),f=path.join(cache,'blender/desk',String(j).padStart(5,'0')+'.jpg');
 assert.ok(fs.existsSync(f),'Missing exact B2a native frame '+f);
 if(bgCache?.file!==f)bgCache={file:f,bytes:fs.readFileSync(f).toString('base64')};
 return `<image x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" href="data:image/jpeg;base64,${bgCache.bytes}"/>`;
}
function exactAnchor(name,t){
 const f=path.join(CACHE,'blender/desk/anchors.json');
 anchorsCache??=JSON.parse(fs.readFileSync(f,'utf8')).anchors;
 const values=anchorsCache?.[name];if(!values)return null;
 const j=Math.round(t*FPS);assert.ok(j<values.length,'Anchor frame is absent '+j);return values[j];
}
function captionSvg(q,cap,t,audit){
 const timing=chunkTimes(q,cap);let k=0;for(let i=0;i<timing.starts.length;i++)if(t>=timing.starts[i])k=i;
 const lines=q.cap?.[k]??[q.subtitle];assert.ok(lines.length<=2,'Do not reflow original caption lines');
 const offset=[25,27].includes(q.masterRow)?235:0;
 const ys=(lines.length===1?[1292]:[1250,1334]).map(y=>y+offset),size=66;
 const sp=q.speaker==='mio'?{name:'ミオ',color:'#ff8fb1'}:{name:'カイ',color:'#7fa8ff'};
 let s='';
 lines.forEach((line,i)=>{
  const m=metricCache.get(JSON.stringify([line,size,7]));assert.ok(m,'Unmeasured frozen caption');
  const tx=540-(m.left+m.right)/2,base=ys[i];
  const box={x:tx+m.left,y:base+m.top,width:m.width,height:m.height};
  assert.ok(box.x>=40&&box.x+box.width<=1040&&box.y>=110&&box.y+box.height<=1600);
  audit.push({type:'caption',text:line,size,rect:box,chunk:k,exactVoiceTiming:timing.exact});
  s+=`<text x="${n(tx)}" y="${base+4}" ${FONT} font-size="${size}" font-weight="800" fill="#000" stroke="#000" stroke-width="10" opacity=".62" filter="url(#b2ashadow)">${esc(line)}</text><text x="${n(tx)}" y="${base}" ${FONT} font-size="${size}" font-weight="800" fill="#fff" stroke="#1a1208" stroke-width="7" stroke-linejoin="round" paint-order="stroke">${esc(line)}</text>`;
 });
 const y=ys[0]-82;
 s+=`<rect x="474" y="${y-28}" width="132" height="52" rx="26" fill="#10131c" fill-opacity=".65"/><circle cx="498" cy="${y-2}" r="10" fill="${sp.color}"/><text x="552" y="${y+11}" ${FONT} font-size="38" font-weight="800" text-anchor="middle" fill="${sp.color}">${sp.name}</text>`;
 return s;
}
export function deskFrame(c,s,t,{audit=[]}={}){
 // The unchanged quality gate reconstructs scenes from the frozen S0 plan.
 // Accept its original scene key only for this same immutable episode ID.
 if(c.id!==ID||![KEY,'b2a_gpt_20261029'].includes(s.deskFrame))return originalDeskFrame(c,s,t);
 assert.equal(c.id,ID);assert.ok(prepared&&currentClip?.id===c.id,'Call prepareTypography(clip) once before composition');
 let body=exactBackground(t);
 if(t<2){
  const op=1-sm((t-1.5)/.5);body+=card('B 電気と電波 2',{y:110,size:36,opacity:op,audit});
  body+=card(c.title,{y:178,size:36,opacity:op,audit});
 }else{
  const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),cap=s.captions[k],q=s.cues[k];assert.ok(q&&cap);
  let fc=q.face?{...q.face}:null;
  if(fc?.at){const m=voiceMap({cue:q,t:0,dur:cap.end-cap.start}),i=m.s.indexOf(normKana(fc.at));assert.ok(i>=0);fc.atT=m.t[i];}
  let full=false;
  if(fc&&!fc.small){const a=fc.at?cap.start+fc.atT:cap.start+(fc.a??0)*(cap.end-cap.start),b=cap.start+(fc.b??1)*(cap.end-cap.start);full=t>=a+.18&&t<=b;}
  if(!full)body+=overlayB2A({t,cue:q,cap,anchor:name=>exactAnchor(name,t),audit});
  const f=faceLayer(fc,t,cap.start,cap.end,q);
  const smallFaceY=q.masterRow===23?450:1040;
  body+=fc?.small?`<g transform="translate(860 ${smallFaceY}) scale(.72) translate(-860 -380)">${f}</g>`:f;
  body+=captionSvg(q,cap,t,audit);
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><defs><filter id="b2ashadow" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>${faceDefs}</defs><rect width="1080" height="1920" fill="#2a2018"/>${body}</svg>`;
}

export function inspectLayouts(clip){
 assert.ok(prepared&&currentClip?.id===clip.id);let cueCount=0,chunkCount=0,captionInkBoxes=0,labelBoxes=0;const limits={minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity};
 for(const scene of clip.scenes)for(let k=0;k<scene.cues.length;k++){
  const q=scene.cues[k],cap=scene.captions[k],ct=chunkTimes(q,cap);cueCount++;
  assert.ok(ct.exact,'Caption voice chunk mapping must remain exact');
  for(let i=0;i<ct.starts.length;i++){
   const end=ct.starts[i+1]??cap.end,t=(ct.starts[i]+end)/2,audit=[];
   captionSvg(q,cap,t,audit);overlayB2A({t,cue:q,cap,anchor:()=>null,audit});chunkCount++;
   for(const a of audit){if(a.type==='caption')captionInkBoxes++;else labelBoxes++;
    const b=a.rect;limits.minX=Math.min(limits.minX,b.x);limits.maxX=Math.max(limits.maxX,b.x+b.width);limits.minY=Math.min(limits.minY,b.y);limits.maxY=Math.max(limits.maxY,b.y+b.height);
   }
  }
 }
 return {cueCount,chunkCount,captionInkBoxes,labelBoxes,limits,exactVoiceTimingAll:true,minimumLabelFont:36,captionFont:66,captionWordingReflowed:false,scope:'Measured 2D text geometry only, not actual native image/ear review'};
}

export {chunkTimes};



