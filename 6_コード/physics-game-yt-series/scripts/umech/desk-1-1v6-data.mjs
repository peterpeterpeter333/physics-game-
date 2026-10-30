// 技術の疑問の鎖 1-1 第6版（ys-chain-1-1v6）の数と、Blender（scripts/blender/desk_1_1v6.py）・2D（desk-1-1v6-overlay.mjs）に渡すデータ。
// 第5版の desk-1-1v5-data.mjs（変えていない）の数と模様をそのまま読み込み、第6版の行40a〜40k（穴埋め）の数を足して assert で確かめる。
// 図のキーは持たない（-diagrams で終わらないので自動読み込みされない）。
// 使い方：EM_FILM_CACHE=/private/tmp/ys/ys-chain-1-1v6 node scripts/umech/desk-1-1v6-data.mjs
//   → $EM_FILM_CACHE/blender/data.json（第5版の DATA ＋ fill6）と $EM_FILM_CACHE/blender/tex/*.png（第5版のキャッシュの模様の写し）
import {mkdirSync,writeFileSync,readdirSync,copyFileSync,existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {ABC,ix,SUB,subst,TEXT1,C1,WORDS1} from './yt1-chain-00bx-common.mjs';
import {DATA as DATA5,SHEET_LINES,SHEET,ROW_PLAIN,ROW_CIPH} from './desk-1-1v5-data.mjs';

const enc=c=>SUB[ix(c)];
// ---------- 行40 の検算（正本の検算欄） ----------
// 入れ替え表 QWEMXAZVPBTGNOCLRSUJHYDFIK：A→Q、T→J、E→X、H→V、L→G、W→D、I→P、M→N、R→S、Y→I
for(const [p,c] of [['A','Q'],['T','J'],['E','X'],['H','V'],['L','G'],['W','D'],['I','P'],['M','N'],['R','S'],['Y','I']])assert.equal(enc(p),c,p+'→'+c);
assert.equal(C1.replace(/[^A-Z]/g,'').length,541);
// 1文字だけの言葉：暗号文では Q だけ、4回（平文の A：BRING A MAP、SEND A RIDER、WITH A LAMP、LIGHT A FIRE）
const single=WORDS1.filter(w=>w.length===1);
assert.deepEqual(single,['Q','Q','Q','Q']);
const PW=TEXT1.split(/[^A-Z]+/).filter(Boolean);
assert.deepEqual(PW.filter(w=>w.length===1),['A','A','A','A']);
for(const ph of ['BRING A MAP','SEND A RIDER','WITH A LAMP','LIGHT A FIRE'])assert.ok(TEXT1.includes(ph),ph);
// NXXJ QJ JVX の並び（1回）＝MEET AT THE。Q＝I なら □EET IT THE、Q＝A なら □EET AT THE
assert.equal((C1.match(/NXXJ QJ JVX/g)??[]).length,1);
assert.equal(subst('MEET AT THE'),'NXXJ QJ JVX');
// JXGG（1回）＝TELL。T・E の後に同じ文字が2つ続く 4文字の暗号の言葉は JXGG だけ。平文で TE□□（同じ文字2つ）は TELL だけ
const cnt=w=>WORDS1.filter(x=>x===w).length;
assert.equal(cnt('JXGG'),1);assert.equal(subst('TELL'),'JXGG');
assert.deepEqual([...new Set(WORDS1.filter(w=>/^JX(.)\1$/.test(w)))],['JXGG']);
assert.deepEqual([...new Set(PW.filter(w=>/^TE(.)\1$/.test(w)))],['TELL']);
// DPGG（3回）＝WILL
assert.equal(cnt('DPGG'),3);assert.equal(subst('WILL'),'DPGG');
// 冒頭の行の暗号：JVX QSNI DPGG NXXJ QJ JVX ＝ THE ARMY WILL MEET AT THE
export const HEAD_PLAIN='THE ARMY WILL MEET AT THE',HEAD_CIPH='JVX QSNI DPGG NXXJ QJ JVX';
assert.equal(subst(HEAD_PLAIN),HEAD_CIPH);
assert.ok(C1.startsWith(HEAD_CIPH));assert.ok(SHEET_LINES[0].startsWith(HEAD_CIPH));
assert.equal(ROW_CIPH.slice(0,2).join(' '),HEAD_CIPH);
// 分かっていく文字（暗号の文字 → 平文の文字）：E・T・H（行37〜39）→ A（40f2）→ L（40h）→ W・I（40j）
export const KNOWN={ETH:{X:'E',J:'T',V:'H'},A:{Q:'A'},L:{G:'L'},M:{N:'M'},RY:{S:'R',I:'Y'},WI:{D:'W',P:'I'}};
// 40i2：□EET の候補 MEET・FEET（AT THE の前なら MEET）→ N＝M。40i3：QSNI＝A□M□ → ARMY（S＝R、I＝Y）
assert.equal(subst('MEET'),'NXXJ');assert.equal(subst('ARMY'),'QSNI');
for(const st of Object.values(KNOWN))for(const [c,p] of Object.entries(st))assert.equal(enc(p),c);
// 穴埋め（分かった文字だけ入れる。□＝まだ分からない）
export const reveal=(ciph,known)=>[...ciph].map(c=>c===' '?' ':known[c]??'□').join('');
const K1={...KNOWN.ETH},K2={...K1,...KNOWN.A},K3={...K2,...KNOWN.L},K3m={...K3,...KNOWN.M},K3r={...K3m,...KNOWN.RY},K4={...K3r,...KNOWN.WI};
assert.equal(reveal('QSNI',K3m),'A□M□');assert.equal(reveal('QSNI',K3r),'ARMY');assert.equal(reveal('NXXJ',K3m),'MEET');
assert.equal(reveal('NXXJ QJ JVX',K1),'□EET □T THE');            // 40d（Q は試す文字）
assert.equal(reveal(HEAD_CIPH,K3),'THE A□□□ □□LL □EET AT THE');   // 40i（字幕と同じ）
assert.equal(reveal('DPGG',K4),'WILL');                           // 40j
assert.equal(reveal('JXGG',K1),'TE□□');                           // 40g
// 1文字の Q の場所（暗号文の紙の行・列）
export const Q_POS=[];SHEET_LINES.forEach((l,r)=>{const re=/(^|[^A-Z])Q(?=[^A-Z]|$)/g;let m;while((m=re.exec(l)))Q_POS.push([r,m.index+m[1].length]);});
assert.equal(Q_POS.length,4);
// JXGG・NXXJ QJ JVX の場所（紙の行・列）
const findPos=w=>{const out=[];SHEET_LINES.forEach((l,r)=>{let i=l.indexOf(w);while(i>=0){out.push([r,i]);i=l.indexOf(w,i+1);}});return out;};
export const JXGG_POS=findPos('JXGG');assert.equal(JXGG_POS.length,1);
export const MEET_POS=findPos('NXXJ QJ JVX');assert.equal(MEET_POS.length,1);assert.deepEqual(MEET_POS[0],[0,14]);

// 第5版のキャッシュの data.json（紙の大きさ SHEET.W・H は、第5版が模様を書くときに決めた値）を土台にする。中身が第5版の計算と同じことを確かめる
const D5F='/private/tmp/ys/ys-chain-1-1v5/blender/data.json';
export const DATA5C=existsSync(D5F)?JSON.parse(readFileSync(D5F,'utf8')):null;
if(DATA5C){const a={...JSON.parse(JSON.stringify(DATA5)),sheet:null,scroll:null},b={...DATA5C,sheet:null,scroll:null};   // 紙の大きさ・巻物の行は、模様を書くときに決まるassert.deepEqual(b,a,'第5版の data.json が第5版の計算と違う');
 for(const k of ['w','cw','lh','px','py'])assert.equal(DATA5C.sheet[k],SHEET[k]);}
export const DATA={...(DATA5C??DATA5),fill6:{sheetLines:SHEET_LINES,sheet:DATA5C?.sheet??SHEET,qPos:Q_POS,jxggPos:JXGG_POS,meetPos:MEET_POS,headCiph:HEAD_CIPH,headPlain:HEAD_PLAIN}};

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const root=(process.env.EM_FILM_CACHE??'')+'/blender';assert.ok(process.env.EM_FILM_CACHE,'EM_FILM_CACHE');
 const src='/private/tmp/ys/ys-chain-1-1v5/blender/tex';assert.ok(existsSync(src),'第5版の模様が無い：'+src+'（desk-1-1v5-data.mjs を先に）');
 mkdirSync(root+'/tex',{recursive:true});
 for(const f of readdirSync(src))copyFileSync(`${src}/${f}`,`${root}/tex/${f}`);
 writeFileSync(root+'/data.json',JSON.stringify(DATA,null,1));
 console.log('data.json と模様を書いた',root,'Q の場所',JSON.stringify(Q_POS),'JXGG',JSON.stringify(JXGG_POS),'紙の行',SHEET_LINES.length);
}
