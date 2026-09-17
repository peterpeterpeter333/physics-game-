import {mkdirSync} from 'node:fs';
import sharp from 'sharp';
import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
const a=liteAdaptor();RegisterHTMLHandler(a);
const doc=mathjax.document('',{InputJax:new TeX(),OutputJax:new SVG({fontCache:'none'})});
const r=String.raw;
const formulae=[null,r`\vec F=q\vec E`,r`\Delta W\approx F\cos\theta\,\Delta s`,r`\Delta W\approx\vec F\cdot\Delta\vec r`,r`W_N=\sum_{i=1}^{N}\vec F_i\cdot\Delta\vec r_i`,r`W=\lim_{N\to\infty}W_N=\int_C\vec F\cdot d\vec r`,r`W=q\int_C\vec E\cdot d\vec r`];
mkdirSync('/private/tmp/physics-nemo-pilot/render',{recursive:true});
for(let i=1;i<formulae.length;i++){
 const root=doc.convert(formulae[i],{display:true});
 let svg=a.outerHTML(a.firstChild(root));
 const view=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
 const h=56,w=Math.ceil(h*view[2]/view[3]);
 svg=svg.replace(/width="[^"]+"/,`width="${w}"`).replace(/height="[^"]+"/,`height="${h}"`).replaceAll('currentColor',i>=4?'#8aebc1':'#eef3ff');
 await sharp(Buffer.from(svg)).png().toFile(`/private/tmp/physics-nemo-pilot/render/formula-${i}.png`);
}
