import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash}from'node:crypto';
// Invoke only after root has personally viewed these twelve comparisons and two PNGs.
assert(process.argv.includes('--root-personally-viewed-all14'));
const C='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025';
const W=new URL('../..',import.meta.url).pathname;
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=C+'/actual-mp4-review/manifest.json',m=JSON.parse(fs.readFileSync(manifest));
assert.equal(sha(m.video),'6780889510a3d881ec446a58627325edf00cd0b43206c7f8b61c166c270ca1d2');
const observations=[
 '開いた木箱の方位磁針と赤白の針を確認。字幕は針を隠していない。',
 '再現地図と磁石の島の札を確認。検証前の言い伝えとして区別している。',
 '青S・赤Nの棒磁石、付着した釘、ニンニク、実験の結論を確認。',
 '赤N同士の対向と操作する手、反発の字幕を確認。',
 '方位磁針と風見鶏の並列比較、たとえ話の札と対応説明を確認。',
 '黒い球上の複数の針と青い極を確認。主役を大きく見せている。',
 '黒い球の周りの線、Nの指示線、球面上の針を確認。',
 '青い上端S・赤い下端Nと針の上下の説明札を確認。',
 '島なら約20度・地球が磁石なら約70度という異なる予言の札を確認。',
 '実測約72度と判定、棄却した予言の取り消し表示を確認。',
 '地球儀の北側Sと方位磁針のNを結ぶ線を確認。',
 '冒頭と同じ開いた方位磁針で終わっていることを確認。'
];
assert.equal(m.major.frames.length,12);assert.equal(m.major.comparisons.length,12);
const comparisons=m.major.comparisons.map((file,i)=>{
 assert.equal(sha(file),m.major.comparisonSha256[file]);const f=m.major.frames[i];assert.equal(sha(f.file),f.sha256);
 return {file,sha256:sha(file),actuallyViewed:true,actualViewer:'/root',actualFrame:f.frame,time:f.time,actualJpeg:{file:f.file,sha256:f.sha256},observation:observations[i],newRequiredVisualIssue:false};
});
const problem=['挑戦','答え'].map(name=>{const file=C+'/problem/'+name+'.png';return{name,file,sha256:sha(file),actuallyViewed:true,actualViewer:'/root',scope:'1080×1920の問題用PNG。実MP4とは別の画像。'};});
const out=W+'/outputs/axes-20261023/root-b1-final5-major12-problem2-actual-eye-receipt-20261025.json';
fs.writeFileSync(out,JSON.stringify({schemaVersion:1,episode:'B-1',actualViewer:'/root',createdAt:new Date().toISOString(),video:{file:m.video,sha256:m.videoSha256},manifest:{file:manifest,sha256:sha(manifest)},comparisonOrientation:'左=今回B5実動画（ヘッダーB3+B6を継承）、右=見本1-1',comparisons,problem,viewingMethod:'view_imageで12枚の比較画像と2枚の問題PNGを個別に表示して確認。比較のactual側を確認。比較から個別原寸JPEGの視聴まで行ったとは主張しない。',earListeningPerformed:false,continuousPlaybackPerformed:false,everyFramePersonallyViewed:false,originalGateNGPreserved:true,finalAcceptance:false},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,sha256:sha(out),major12:true,problem2:true}));
