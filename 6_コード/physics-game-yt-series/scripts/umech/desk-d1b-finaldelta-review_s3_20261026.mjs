// Exact final-delta comparisons, preserving the219-frame S2 review and originals.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const C='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026',out=path.join(C,'s2review/final-comparisons8');
assert.equal(fs.existsSync(out),false);fs.mkdirSync(out,{recursive:true});
const keys=[1128,1362,1497,3277,3301,3431,3467,10512,10713],pairs=[];
for(const j of keys){
 const n=String(j).padStart(5,'0')+'.jpg',before=path.join(C,'s2review/composite7',n),after=path.join(C,'s2review/final-composite8',n);
 for(const f of [before,after])assert.ok(fs.existsSync(f),f);
 const label=Buffer.from(`<svg width="1080" height="50"><rect width="1080" height="50" fill="#172239"/><g fill="white" font-size="19" font-family="sans-serif"><text x="10" y="23">${(j/30).toFixed(3)}s  f${j}</text><text x="210" y="45">S2再試写7</text><text x="745" y="45">最終修正8</text></g></svg>`),image=path.join(out,'pair-'+String(j).padStart(5,'0')+'.jpg');
 await sharp({create:{width:1080,height:1010,channels:3,background:'#172239'}}).composite([{input:label,left:0,top:0},{input:before,left:0,top:50},{input:after,left:540,top:50}]).jpeg({quality:94}).toFile(image);
 pairs.push({frame:j,seconds:j/30,before,after,image});
}
fs.writeFileSync(path.join(out,'comparisons.json'),JSON.stringify({type:'Final local delta only; supplements original104 comparisons, does not replace them',sourceKey:JSON.parse(fs.readFileSync(path.join(C,'s2review/final-delta8/preview-meta.json'))).sourceKey,pairs,visualPassClaimed:false},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,pairs:pairs.length}));
