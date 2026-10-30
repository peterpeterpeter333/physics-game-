/// <reference lib="es2022.intl" />
import type {LessonStep} from '../types';
export type MicroSlide={title:string;lines:string[];tex?:string;beat:number;kind:string};
// Break at Japanese word boundaries; no truncation and no smaller font to hide overflow.
export function textPages(text:string):string[][]{
 const words=typeof Intl.Segmenter==='function'?Array.from(new Intl.Segmenter('ja',{granularity:'word'}).segment(text),s=>s.segment):Array.from(text);
 const lines:string[]=[];let pieces:string[]=[];
 for(const word of words){for(const part of word.match(/.{1,21}/gu)||[]){
  if(Array.from(pieces.join('')+part).length>21){
   // Do not strand punctuation on its own line; carry the last word with it.
   const closing=/^[、。！？）」』】]$/.test(part);
   const carry=closing&&pieces.length>1?pieces.pop()!:'';
   lines.push(pieces.join(''));pieces=carry?[carry]:[];
  }
  pieces.push(part);if(/[。！？]$/.test(part)){lines.push(pieces.join(''));pieces=[];}
 }}if(pieces.length)lines.push(pieces.join(''));
 const pages:string[][]=[];for(let i=0;i<lines.length;i+=4)pages.push(lines.slice(i,i+4));return pages;
}
export function microSlides(step:LessonStep):MicroSlide[]{
 const s=step.story!;const cards:MicroSlide[]=[];
 const add=(kind:string,title:string,text:string,beat:number,tex?:string)=>textPages(text).forEach((lines,i)=>cards.push({kind,title,lines,beat,tex:i===textPages(text).length-1?tex:undefined}));
 add('goal','今回、何を求めるか',s.goal||step.body,0,s.goalTex);
 if(s.basis)add('basis','使う前提',s.basis,0);
 s.beats.forEach((b,i)=>{add('derivation',b.action,b.text,i,b.tex);add('look','図で確かめる',b.focus,i);});
 if(s.result)add('result','ここまでで分かったこと',s.result,s.beats.length-1);
 s.notes?.forEach(n=>add('note',n.title,n.text,s.beats.length-1,n.tex));
 return cards;
}
