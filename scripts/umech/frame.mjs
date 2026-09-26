// Frame composer for visualPilot 'umech-v1' (university mechanics).
// Layout matches the revised high-school films (title, heading, stage, 3-line captions)
// so the app looks consistent, but each cue may show a picture, an equation, or both.
import {C,clamp,mix,smooth,label,line,fade,tex,texWidth} from './anim.mjs';
import {diagrams} from './diagrams.mjs';

export const PILOT='umech-v1';
const STAGE={x:40,y:100,w:1200,h:515};

function wrap(s,max){const rows=[];let row='',w=0;for(const ch of s){const cw=/[ -~]/.test(ch)?.55:1;if(w+cw>max&&!/[。、）」？！]/.test(ch)){rows.push(row);row='';w=0;}row+=ch;w+=cw;}if(row)rows.push(row);return rows;}

// An equation row made of tokens. Tokens that also existed in the previous row slide
// from their old place; new tokens fade in with a brief underline that then disappears
// (a lasting underline reads like a fill-in blank).
function layoutRow(tokens,size,cx){
 const gap=size*.28,widths=tokens.map(t=>texWidth(t,size)),total=widths.reduce((a,b)=>a+b,0)+gap*(tokens.length-1);
 let x=cx-total/2;const seen={};
 return tokens.map((t,i)=>{const r={t,key:`${t}#${seen[t]=(seen[t]??0)+1}`,x,w:widths[i]};x+=widths[i]+gap;return r;});
}
function fitSize(tokens,size,maxW){const w=tokens.reduce((a,t)=>a+texWidth(t,size),0)+size*.28*(tokens.length-1);return w>maxW?size*maxW/w:size;}
export function equationStage(q,p,dur){
 const u=smooth(clamp(p*dur/1.1));
 const prev=q.previousFormula??[],hasPrev=prev.length>0;
 const size=fitSize(q.formula,q.size??58,1080),psize=fitSize(prev,44,1080);
 const now=layoutRow(q.formula,size,640),old=hasPrev?layoutRow(prev,psize,640):[];
 const yOld=250,yNew=hasPrev?410:330;
 let s='';
 if(q.operation)s+=label(q.operation,640,150,{size:26,color:C.t,anchor:'middle'});
 if(hasPrev)s+=label('直前の式',70,yOld-50,{size:21,color:C.dim})+old.map(o=>tex(o.t,o.x+o.w/2,yOld,{size:psize,opacity:.35})).join('');
 for(const a of now){
  const from=old.find(o=>o.key===a.key);
  if(from){s+=tex(a.t,mix(from.x+from.w/2,a.x+a.w/2,u),mix(yOld,yNew,u),{size:mix(psize,size,u)});}
  else{s+=fade(u,tex(a.t,a.x+a.w/2,yNew,{size}))+(hasPrev?fade(u*.7*(1-smooth((p*dur-1.6)/.6)),line(a.x,yNew+size*.62,a.x+a.w,yNew+size*.62,{color:C.hi,w:2.5})):'');}
 }
 if(q.note)s+=fade(u,label(q.note,640,yNew+size+40,{size:24,color:C.dim,anchor:'middle'}));
 return s;
}

export function umechFrame(c,s,t){
 if(c.visualPilot!==PILOT)return null;
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),cap=s.captions[k],q=s.cues[k];
 if(!q)throw Error(`Missing cue ${c.id}/${s.index}/${k}`);
 const dur=Math.max(.05,cap.end-cap.start),p=clamp((t-cap.start)/dur);
 const rows=wrap(cap.text,44);if(rows.length>3)throw Error(`Caption overflow ${c.id}/${s.index}/${k}: ${cap.text}`);
 const prevQ=k>0?s.cues[k-1]:null;
 // A new picture fades in; the same picture continues without a cut.
 const group=d=>(d??'').split(':')[0];
 const cut=!prevQ||prevQ.display!==q.display||group(prevQ.diagram)!==group(q.diagram);
 const inA=cut?smooth(clamp((t-cap.start)/.35)):1;
 let body='';
 if(q.display==='diagram'||q.display==='both'){
  const fn=diagrams[q.diagram];if(!fn)throw Error(`Unknown diagram ${q.diagram} in ${c.id}`);
  body+=`<svg data-presentation="diagram" x="${STAGE.x}" y="${STAGE.y}" width="${STAGE.w}" height="${STAGE.h}" viewBox="0 0 1200 515">${fn(p,{t:t-cap.start,dur,k,cue:q,clip:c,scene:s})}</svg>`;
 }
 if(q.display==='equation')body+=`<g data-presentation="equation">${equationStage(q,p,dur)}</g>`;
 if(!body)throw Error(`Empty cue ${c.id}/${s.index}/${k}`);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760"><style>text{font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',sans-serif}</style><rect width="1280" height="760" fill="${C.bg}"/>`
  +label(c.title,38,42,{size:29})+label(s.heading,38,80,{size:22,color:C.dim})
  +fade(inA,body)
  +line(35,626,1245,626,{color:'#28364e',w:2})+rows.map((v,i)=>label(v,40,662+i*30,{size:27})).join('')
  +label('音声：VOICEVOX Nemo 男声1',38,748,{size:15,color:C.dim})+label(`${s.index+1} / ${c.scenes.length}`,1242,748,{size:18,color:C.dim,anchor:'end'})
  +`<rect x="0" y="755" width="${(1280*t/c.duration).toFixed(1)}" height="5" fill="${C.x}"/></svg>`;
}
