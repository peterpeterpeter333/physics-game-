// Only new S4 consumers are redirected; shared files are unchanged on disk.
import {registerHooks} from 'node:module';
import assert from 'node:assert/strict';
import {CACHE,realInput,PUMP_CAPTION_LAYOUT,LOWER_CAPTION_LAYOUT} from './desk-d1a-stage_s4_gpt_20261028.mjs';
const here=new URL('./',import.meta.url).href;
registerHooks({resolve(specifier,context,next){
 if(context.parentURL===here+'frame-vert.mjs'&&specifier==='./desk-frame.mjs')return {url:here+'desk-d1a-deskframe_s4_gpt_20261028.mjs',shortCircuit:true};
 if(context.parentURL===here+'desk-frame.mjs?d1a-s4-real'&&specifier==='./desk-d1v1-overlay.mjs')return {url:here+'desk-d1a-overlay-dispatch_s4_gpt_20261028.mjs',shortCircuit:true};
 return next(specifier,context);
},load(url,context,next){
 const loaded=next(url,context);if(url!==here+'desk-frame.mjs?d1a-s4-real')return loaded;
 assert.equal(process.env.EM_FILM_CACHE,CACHE);assert.notEqual(process.env.DESK_ALLOW_MISSING,'1');
 realInput(process.env.D1A_S4_RAW_DIR??CACHE+'/blender/desk');
 realInput(process.env.D1A_S4_ANCHORS_FILE??CACHE+'/blender/desk/anchors.json');
 let source=Buffer.from(loaded.source).toString('utf8');
 const replace=(a,b)=>{assert.equal(source.split(a).length,2,'Shared frame contract changed: '+a);source=source.replace(a,b);};
 replace("dir=root()+'/desk'","dir=(process.env.D1A_S4_RAW_DIR??root()+'/desk')");
 replace("const f=root()+'/desk/anchors.json'","const f=(process.env.D1A_S4_ANCHORS_FILE??root()+'/desk/anchors.json')");
 replace("ANC=existsSync(f)?JSON.parse(readFileSync(f,'utf8')).anchors:{};","ANC=JSON.parse(readFileSync(f,'utf8'));");
 replace("const a=ANC[name];if(!a)return null;const j=Math.max(0,Math.min(a.length-1,Math.round(t*DFPS)));return a[j];","const j=Math.round(t*DFPS);const points=ANC.anchors?null:ANC[String(j)];if(!ANC.anchors&&!points)throw Error('Missing exact S4 anchor frame '+j);const value=ANC.anchors?.[name]?.[j]??points?.[name]??null;if(value===false)throw Error('Unrendered exact S4 anchor '+j);return value;");
 replace("padStart(5,'0')}.jpg","padStart(5,'0')}.${process.env.D1A_S4_RAW_EXT??'jpg'}");
 replace('href="data:image/jpeg;base64,','href="data:image/${process.env.D1A_S4_RAW_EXT==="png"?"png":"jpeg"};base64,');
 const declaration=' const rows=capLines(q,k),sp=SP[q.speaker]??SP.kai;';
 const pumpBranch=`
 const layout=${JSON.stringify([PUMP_CAPTION_LAYOUT,LOWER_CAPTION_LAYOUT])}.find(l=>l.cues.includes(q.diagram.replace(/^cd1a-/,'')));
 if(layout){
  const ys=rows.length===1?[layout.oneLineBaseline]:layout.twoLineBaselines;
  const pop=sm((t-starts[k])/.12);
  let s=rows.map((r,i)=>capText(r,layout.x,ys[i],{size:layout.fontSize,op:.8+.2*pop})).join('');
  const ny=layout.speakerBaseline-11,nw=jw(sp.name)*layout.speakerFontSize+64;
  s+=\`<rect x="\${n(layout.speakerCenterX-nw/2)}" y="\${ny-28}" width="\${n(nw)}" height="52" rx="26" fill="#10131c" fill-opacity=".55"/><circle cx="\${n(layout.speakerCenterX-nw/2+26)}" cy="\${ny-2}" r="11" fill="\${sp.color}"/>\`
   +\`<text x="\${n(layout.speakerCenterX+layout.speakerNameTextOffsetX)}" y="\${layout.speakerBaseline}" \${FONT} font-size="\${layout.speakerFontSize}" font-weight="800" text-anchor="middle" fill="\${sp.color}">\${sp.name}</text>\`;
  return \`<g data-d1a-s4-caption-layout="\${layout.mode}">\${s}</g>\`;
 }
`;
 replace(declaration,declaration+pumpBranch);
 return {...loaded,source};
}});
