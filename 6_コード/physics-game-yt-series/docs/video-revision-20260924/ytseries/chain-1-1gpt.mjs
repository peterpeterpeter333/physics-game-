// 技術の疑問の鎖 1-1 ChatGPT 試作。
// 日本語（字幕・読み・アクセント・区切り）は正本と一致する第6版から参照する。
// この試作が独自に作るのは、Blender の物・カメラ・手、2D の札、音の演出であり、
// 第5・6版の場面コードやコマは使用しない。正本の文言は変更しない。
import {clips as source} from './chain-1-1v6.mjs';

const clone=structuredClone(source[0]);
clone.id='ys-chain-1-1gpt';
clone.condition='ChatGPT 試作。正本の全行を保ち、3D の場面と演出を新たに組み立てる。';
for(const scene of clone.scenes){
  scene.deskFrame='1-1gpt';
  for(const cue of scene.cues) cue.diagram=cue.diagram.replace(/^c11v6-/, 'c11gpt-');
}
// 短すぎる字幕だけを隣の区切りと統合する。正本の文言・読み・声は変えない。
const mergeChunk=(diagram,index)=>{
  const cue=clone.scenes.flatMap(scene=>scene.cues).find(c=>c.diagram===`c11gpt-${diagram}`);
  if(!cue)throw Error(`missing cue: ${diagram}`);
  cue.cap.splice(index,2,[...cue.cap[index],...cue.cap[index+1]]);
  cue.capReading.splice(index,2,cue.capReading[index]+cue.capReading[index+1]);
};
mergeChunk('letter:mio',0);
mergeChunk('disk:turn',0);
mergeChunk('doll:talk',0);
mergeChunk('e3:flip',4);
mergeChunk('tw:pair',3);
mergeChunk('rows:b',0);
clone.scenes.flatMap(scene=>scene.cues).find(c=>c.diagram==='c11gpt-rows:b').cap[0]=[
  'まず、1文字だけの','言葉を探します。',
];
export const clips=[clone];
