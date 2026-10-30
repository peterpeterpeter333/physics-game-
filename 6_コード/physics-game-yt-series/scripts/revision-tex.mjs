import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);
const math=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const cache=new Map();
export function texBox(tex,x,y,w=1120,h=72){
 if(!tex)return '';
 const key=JSON.stringify([tex,x,y,w,h]);if(cache.has(key))return cache.get(key);
 let svg=adaptor.outerHTML(adaptor.firstChild(math.convert(tex,{display:true})));
 if(/data-mjx-error|data-mml-node="merror"/.test(svg))throw Error(`Invalid revision formula: ${tex}`);
 const [,view]=svg.match(/viewBox="([^"]+)"/),[, ,vw,vh]=view.split(' ').map(Number);
 const height=Math.min(h,w*vh/vw),width=height*vw/vh;
 svg=svg.replace(/width="[^"]+"/,`width="${width}"`).replace(/height="[^"]+"/,`height="${height}"`).replaceAll('currentColor','#83ecc0').replace('<svg ',`<svg x="${x+(w-width)/2}" y="${y+(h-height)/2}" `);
 cache.set(key,svg);return svg;
}
