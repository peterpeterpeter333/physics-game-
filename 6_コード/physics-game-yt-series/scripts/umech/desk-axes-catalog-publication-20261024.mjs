// Publish a separate catalog appendix; never alter a shared catalog or image.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import sharp from 'sharp';
const W=process.cwd();assert(W.endsWith('/work/physics-game-yt-series'));
const deep=W+'/docs/video-revision-20260924/deep';
const dst=deep+'/部品カタログ画像/軸の1本目_20261024';
const md=deep+'/机の部品カタログ_B-1からE-1_追補_20261024.md';
assert(!fs.existsSync(dst)&&!fs.existsSync(md));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const sources={
 b1:['/private/tmp/ys/ys-chain-b1v1/blender/catalog','/private/tmp/ys/ys-chain-b1v1/blender/catalog-globe-r6','/private/tmp/ys/ys-chain-b1v1/blender/catalog-affected-r7'],
 c1:['/private/tmp/ys/ys-chain-c1v1/blender/catalog-r10'],
 d1:['/private/tmp/ys/ys-chain-d1v1-render/blender/catalog-d1v1-final-r15'],
 e1:['/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r5/catalog']
};
const names={
 b1:{book:'開いた本',compass:'方位磁針',garlic:'ニンニク',gilbert:'ギルバートの人形',globe:'磁極を示す地球儀',magnets:'棒磁石の対',map:'北極の地図',meter:'傾きを読む分度器',mysterybox:'電気の箱',norman:'ノーマンの人形',powder:'鉄粉の模様',predictions:'3つの説を比べる模型',sailor:'船乗りの人形',ship:'船',star:'北極星を示す模型',terrella:'丸い磁石の石',vane:'風向計'},
 c1:{arm:'おもりの付いた腕',bump:'歯車の出っぱり',domino:'8枚のドミノ',m1:'計算機の箱',m2:'仕組みの拡大模型',meter:'走行距離のメーター',paper:'筆算の紙',pascal:'若いパスカルの人形',proto:'試作の箱',shishi:'ししおどし'},
 d1:{air:'空気の層',area:'面積を比べる円盤',balloon:'風船',can:'空き缶',coal:'石炭の消費を示す模型',engine:'ニューコメンの機械',fuji:'富士山の模型',hemispheres:'銅の半球',map:'ヨーロッパの地図',mine:'炭鉱の断面',straw:'ストロー',twocans:'2本の筒',weights:'空気の重さを示す模型'},
 e1:{arc:'緯度を読む弧',chart:'航海の地図',dial:'24時間の文字盤',fleet:'4隻の艦隊',log:'船の速さを測る道具',observer:'観測者の人形',pendulum:'振り子',prize:'経度賞を示す模型',ship:'船',southern:'南の空を示す模型',torch:'太陽の光を示すライト'}
};
const sharedCatalog=deep+'/机の部品カタログ.md';
const sharedBefore=hash(sharedCatalog);
fs.mkdirSync(dst,{recursive:true});
const items=[],sheets=[];
let text='# 技術の疑問の鎖 B-1からE-1の部品カタログ追補\n\n';
text+='4回で使用する51種類の部品を、斜め上と真上の2方向から見られます。画像は制作時の部品カタログから複写し、元の画像と共有カタログは残しています。\n\n';
text+='部品単体の形や机の材質を確かめるための一覧です。本編の動きやカメラ、磁力線の表示などの修正は、別途、完成MP4の検収記録で確認します。\n\n';
text+='[元の共有カタログ](机の部品カタログ.md)\n\n';
for(const [ep,labels] of Object.entries(names)){
 const tag=ep[0].toUpperCase()+'-1',cards=[];
 text+='## '+tag+'の部品\n\n| 部品 | 斜め上 | 真上 |\n| --- | --- | --- |\n';
 for(const [part,label] of Object.entries(labels)){
  const links=[];
  for(const view of ['oblique','top']){
   const base=(ep==='b1'?'':ep+'v1_')+part+'_'+view+'.jpg';
   const candidates=sources[ep].map(folder=>folder+'/'+base).filter(p=>fs.existsSync(p));
   assert(candidates.length,base);const src=candidates.at(-1);
   const name=ep+'_'+part+'_'+view+'.jpg',file=dst+'/'+name,sourceSha=hash(src);
   fs.copyFileSync(src,file,fs.constants.COPYFILE_EXCL);assert.equal(hash(file),sourceSha);
   const meta=await sharp(file).metadata();assert(meta.width>100&&meta.height>100);
   const input=await sharp(file).resize(300,300,{fit:'contain',background:'white'}).toBuffer();
   const title=Buffer.from(`<svg width="300" height="40"><rect width="300" height="40" fill="white"/><text x="8" y="27" font-family="Hiragino Sans" font-size="17">${tag} ${label} ${view==='top'?'真上':'斜め上'}</text></svg>`);
   cards.push(await sharp({create:{width:300,height:340,channels:3,background:'white'}}).composite([{input,left:0,top:40},{input:title,left:0,top:0}]).jpeg({quality:92}).toBuffer());
   links.push('[画像](部品カタログ画像/軸の1本目_20261024/'+name+')');
   items.push({episode:tag,part,label,view,source:src,sourceSha256:sourceSha,file,sha256:hash(file),width:meta.width,height:meta.height});
  }
  text+='| '+label+' | '+links.join(' | ')+' |\n';
 }
 const rows=Math.ceil(cards.length/6),sheet=dst+'/'+tag+'_全画像一覧.jpg';
 await sharp({create:{width:1800,height:rows*340,channels:3,background:'white'}}).composite(cards.map((input,i)=>({input,left:i%6*300,top:Math.floor(i/6)*340}))).jpeg({quality:94}).toFile(sheet);
 sheets.push({episode:tag,file:sheet,images:cards.length,sha256:hash(sheet),actuallyViewedByThisScript:false});
 text+='\n[全画像の一覧](部品カタログ画像/軸の1本目_20261024/'+tag+'_全画像一覧.jpg)\n\n';
}
assert.equal(items.length,102);
fs.writeFileSync(md,text,{flag:'wx'});assert.equal(hash(sharedCatalog),sharedBefore);
fs.writeFileSync(dst+'/publication.json',JSON.stringify({date:new Date().toISOString(),parts:51,images:102,allCopiedByteIdentically:true,sharedCatalogUnchanged:true,sharedCatalogSha256:sharedBefore,appendix:md,appendixSha256:hash(md),items,sheets,finalFilmAcceptance:false},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({appendix:md,parts:51,images:102,allCopiesByteIdentical:true,sharedCatalogUnchanged:true}));
