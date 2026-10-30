// D-1 後編（ys-chain-d1b）だけの読み込みの差し替え（Claude 2026-10-26）。共通のファイル（desk-frame.mjs など）は1字も変えない。
// 使い方：node --import ./scripts/umech/desk-d1b-hooks_claude_20261026.mjs <書き出し・検査のプログラム> …
//  - frame-vert.mjs が読む './desk-frame.mjs' を、desk-d1b-deskframe_claude_20261026.mjs（包み）に差し替える。
//  - 包みが読む本物の desk-frame（?d1b-real）が読む './desk-d1v1-overlay.mjs' を、振り分け（d1b なら後編の札、ほかは元のまま）に差し替える。
import {registerHooks} from 'node:module';
const here=new URL('./',import.meta.url).href;
const frameVert=here+'frame-vert.mjs',wrapper=here+'desk-d1b-deskframe_claude_20261026.mjs',dispatch=here+'desk-d1b-overlay-dispatch_claude_20261026.mjs';
registerHooks({resolve(specifier,context,next){
 if(context.parentURL===frameVert&&specifier==='./desk-frame.mjs')return {url:wrapper,shortCircuit:true};
 if(context.parentURL===here+'desk-frame.mjs?d1b-real'&&specifier==='./desk-d1v1-overlay.mjs')return {url:dispatch,shortCircuit:true};
 return next(specifier,context);
}});
