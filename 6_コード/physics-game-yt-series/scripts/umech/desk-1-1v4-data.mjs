// 技術の疑問の鎖 1-1 第4版（ys-chain-1-1v4）の数と、Blender の机の上の場面（scripts/blender/desk_1_1v4.py）に渡すデータ・模様（テクスチャ）。
// 図のキーは持たない（-diagrams で終わらないので自動読み込みされない）。
// 数は全部ここで計算し、assert で確かめる（カエサル、26!、1300万年、挑戦の暗号、塔の高さ、並べたタイル、記号の塔）。
// 使い方：EM_FILM_CACHE=/private/tmp/ys/ys-chain-1-1v4 node scripts/umech/desk-1-1v4-data.mjs
//   → $EM_FILM_CACHE/blender/data.json と $EM_FILM_CACHE/blender/tex/*.png（手紙・追伸・巻物・本・記号のタイル）
import {mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {ABC,ix,SUB,subst,caesar,shift,TEXT1,C1,CL1,CCNT1,CPCT1,WORDS1,F26,YEARS,letters,counts} from './yt1-chain-00bx-common.mjs';
import {CHALLENGE,GLYPH,SYM} from './yt1-chain-00b1v3-diagrams.mjs';

// ---------- カエサル（行5〜10） ----------
assert.equal(caesar('CAT',3),'FDW');
export const BACK=[1,2,3].map(k=>caesar('FDW',-k));
assert.deepEqual(BACK,['ECV','DBU','CAT']);                       // 1つ・2つ・3つ戻す
assert.equal(shift('A',3),'D');assert.equal(shift('B',3),'E');      // AはD、BはE
export const N_SHIFTS=25;assert.equal(N_SHIFTS,26-1);               // ずらし方は 1〜25 目盛り
// ---------- 入れ替え（行11〜13） ----------
assert.equal([...SUB].sort().join(''),ABC);
export const FACT_STEPS=Array.from({length:26},(_,i)=>26-i);         // 26×25×…×1
assert.equal(FACT_STEPS.reduce((a,b)=>a*BigInt(b),1n),F26);
assert.equal(F26,403291461126605635584000000n);
export const F26_MANT=Number(F26)/1e26;assert.ok(Math.abs(F26_MANT-4.03)<.005,'4.03×10²⁶');
assert.ok(Math.abs(YEARS/1.3e7-1)<.03,'約1300万年 '+YEARS);            // 1.28×10⁷ 年
// ---------- 数える（行19〜23） ----------
assert.equal(CL1.length,541);
export const TOWER=[...CCNT1];                                       // 暗号文の文字ごとの回数（塔の板の枚数）
assert.equal(TOWER.reduce((a,b)=>a+b,0),541);
assert.equal(Math.max(...TOWER),70);assert.equal(TOWER[ix('X')],70);   // 一番高い塔＝X＝E の行き先
assert.equal(TOWER[ix('J')],60);                                     // 次に高い＝J＝T
assert.equal([...TOWER].sort((a,b)=>b-a)[1],60);
assert.ok(Math.abs(CPCT1[ix('X')]-12.9)<.05,'X は 12.9％');
assert.equal(SUB[ix('E')],'X');assert.equal(SUB[ix('T')],'J');assert.equal(SUB[ix('H')],'V');
assert.equal(WORDS1.filter(w=>w==='JVX').length,14);
// 並べたタイル（行21・22）：TEXT1 の最初の文
export const ROW_PLAIN=['THE ARMY WILL','MEET AT THE','OLD BRIDGE','BEFORE THE SUN','RISES'];
assert.equal(ROW_PLAIN.join(' '),TEXT1.split('.')[0]);
export const ROW_CIPH=ROW_PLAIN.map(r=>subst(r));
assert.equal(ROW_CIPH[0],'JVX QSNI DPGG');
assert.equal(letters(ROW_PLAIN.join(' ')).length,46);
// 読めていく順：E(X)・T(J)・H(V) の後は、暗号文全体での回数の多い順
const ORDER=CCNT1.map((v,i)=>[v,i]).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]||a[1]-b[1]).map(x=>ABC[x[1]]);
export const FILL=['X','J','V',...ORDER.filter(c=>!'XJV'.includes(c))];
assert.ok(letters(ROW_CIPH.join('')).every(c=>FILL.includes(c)),'並べたタイルの文字は全部 FILL にある');
// 記号の塔（行25）：TEXT1 を記号に入れ替えて数える。k 本目＝記号 GLYPH[k]
const PCNT=counts(letters(TEXT1));
export const GLYPHS=[...GLYPH];
export const GTOWER=GLYPHS.map(g=>PCNT[SYM.indexOf(g)]);
assert.equal(GTOWER.reduce((a,b)=>a+b,0),541);
assert.equal(Math.max(...GTOWER),70);assert.equal(GTOWER[GLYPHS.indexOf(SYM[ix('E')])],70);
// ---------- 挑戦（行30） ----------
assert.equal(CHALLENGE,'MYEXD DRO VODDOBC');assert.equal(caesar(CHALLENGE,-10),'COUNT THE LETTERS');

// ---------- 模様（テクスチャ） ----------
const symText=s=>[...s].map(c=>/[A-Z]/.test(c)?SYM[ix(c)]:c).join('');
// メアリーの手紙（再現）：TEXT1 の始めを記号に入れ替えて書いた紙。図のための再現（本物の手紙・記号表ではない）
export const LETTER_LINES=(()=>{const w=symText(TEXT1).split(' ');const out=[];let cur='';for(const x of w){if([...(cur?cur+' '+x:x)].length>15){out.push(cur);cur=x;}else cur=cur?cur+' '+x:x;}if(cur)out.push(cur);return out.slice(0,11);})();
export const PS_TEXT='TELL ME THE NAMES';                     // 偽の追伸（再現）：仲間の名前を教えてほしい
export const PS_LINE=symText(PS_TEXT);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const FONT=`font-family="Hiragino Mincho ProN, Hiragino Sans, serif"`;
const SANS=`font-family="Hiragino Sans, sans-serif"`;
function paper(w,h,seed=1){
 // 古い紙：クリーム色に、ゆるいむら
 let s=`<rect width="${w}" height="${h}" fill="#efe2c4"/>`;
 let r=seed*9301;const rnd=()=>((r=(r*9301+49297)%233280)/233280);
 for(let i=0;i<40;i++)s+=`<circle cx="${(rnd()*w).toFixed(0)}" cy="${(rnd()*h).toFixed(0)}" r="${(30+rnd()*120).toFixed(0)}" fill="#c9a979" opacity="${(.03+rnd()*.05).toFixed(3)}"/>`;
 s+=`<rect x="6" y="6" width="${w-12}" height="${h-12}" fill="none" stroke="#b89a6a" stroke-width="5" opacity=".35"/>`;
 return s;
}
function letterSVG(){
 const W=1024,H=1332;let s=paper(W,H,3);
 LETTER_LINES.forEach((l,i)=>{s+=`<text x="80" y="${150+i*94}" ${FONT} font-size="64" fill="#4a250c" letter-spacing="4">${esc(l)}</text>`;});
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${s}</svg>`;
}
function psSVG(){
 // 追伸の行（透明の背景、赤茶のインク）。手紙の下の余白（v 0.06〜0.13）に重ねる
 const W=1024,H=160;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><text x="90" y="105" ${FONT} font-size="62" fill="#7a1f0c" letter-spacing="6">${esc(PS_LINE)}</text></svg>`;
}
// 巻物：上から順に 26・×25・…・×1、＝ 約4×10²⁶ 通り、1秒に1兆通り → 1300万年
export const SCROLL={w:0.15,len:2.25,rows:[]};
function scrollSVG(){
 const W=600,H=Math.round(W*SCROLL.len/SCROLL.w);let s=`<rect width="${W}" height="${H}" fill="#f2e6c9"/>`;
 s+=`<rect x="14" y="0" width="${W-28}" height="${H}" fill="none" stroke="#c4a26a" stroke-width="8" opacity=".6"/>`;
 const px=v=>v/SCROLL.len*H;              // 巻物の長さ（m）→ 画素
 const rows=[];
 // 掛け算の段：最初の3段は大きく、残りは詰める
 FACT_STEPS.forEach((k,i)=>{const at=i<3?.05+i*.085:.33+(i-3)*.045;rows.push({s:at,text:(i?'× ':'')+k,size:i<3?150:118,col:'#3b2412'});});
 rows.push({s:1.40,text:'＝約4×10²⁶',size:84,col:'#1d5fd1'});
 rows.push({s:1.50,text:'通り',size:84,col:'#1d5fd1'});
 rows.push({s:1.74,text:'1秒に1兆通り',size:76,col:'#3b2412'});
 rows.push({s:1.82,text:'試すと',size:76,col:'#3b2412'});
 rows.push({s:2.02,text:'1300万年',size:110,col:'#a3261b'});
 for(const r of rows){s+=`<text x="${W/2}" y="${px(r.s)+r.size*.36}" text-anchor="middle" ${SANS} font-weight="800" font-size="${r.size}" fill="${r.col}">${esc(r.text)}</text>`;SCROLL.rows.push({s:r.s,text:r.text});}
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${s}</svg>`;
}
// キンディーの本（9世紀）：文字を数える頁のイメージ。文字は書かず、点と数える棒（|||| の束）だけ（本物の写本の写しではない）
function bookSVG(){
 const W=1024,H=700;let s=`<rect width="${W}" height="${H}" fill="#ecdcb6"/>`;
 s+=`<rect x="${W/2-4}" y="0" width="8" height="${H}" fill="#b89a6a" opacity=".6"/>`;
 for(const x0 of [60,W/2+60]){
  for(let i=0;i<9;i++){const y=90+i*64,n=[14,9,8,7,7,6,5,4,3][i];
   s+=`<circle cx="${x0+18}" cy="${y-12}" r="14" fill="#5a2a0a"/>`;
   for(let k=0;k<n;k++){const x=x0+60+k*22+Math.floor(k/5)*14;s+=`<line x1="${x}" y1="${y-34}" x2="${x}" y2="${y+6}" stroke="#5a2a0a" stroke-width="6" stroke-linecap="round"/>`;
    if(k%5===4)s+=`<line x1="${x-92}" y1="${y-4}" x2="${x+6}" y2="${y-30}" stroke="#5a2a0a" stroke-width="5"/>`;}
  }
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${s}</svg>`;
}
// 記号のタイルの面（橙の地に、こげ茶の記号）
function glyphSVG(g){return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#f08a2c"/><text x="128" y="128" dominant-baseline="central" text-anchor="middle" font-family="Hiragino Sans, Apple Symbols, sans-serif" font-weight="700" font-size="170" fill="#2a1406">${esc(g)}</text></svg>`;}

export const DATA={
 caesar:{plain:'CAT',key:3,cipher:'FDW',back:BACK},
 sub:SUB,abc:ABC,
 fact:FACT_STEPS.map(String),
 tower:TOWER,cipherLetters:CL1.join(''),
 rows:{plain:ROW_PLAIN,cipher:ROW_CIPH},fill:FILL,
 glyphs:GLYPHS,gtower:GTOWER,symPlain:SYM.join(''),
 challenge:CHALLENGE,
 scroll:SCROLL,
 letterLines:LETTER_LINES,ps:PS_LINE,
};

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const sharp=(await import('sharp')).default;
 const root=(process.env.EM_FILM_CACHE??'')+'/blender';assert.ok(process.env.EM_FILM_CACHE,'EM_FILM_CACHE');
 mkdirSync(root+'/tex',{recursive:true});
 const save=async(name,svg)=>{await sharp(Buffer.from(svg)).png().toFile(`${root}/tex/${name}.png`);};
 await save('letter',letterSVG());await save('ps',psSVG());await save('scroll',scrollSVG());await save('book',bookSVG());
 for(const [i,g] of GLYPHS.entries())await save('glyph'+i,glyphSVG(g));
 writeFileSync(root+'/data.json',JSON.stringify(DATA,null,1));
 console.log('data.json と模様を書いた',root,'巻物の行',SCROLL.rows.length,'手紙の行',LETTER_LINES.length);
}
