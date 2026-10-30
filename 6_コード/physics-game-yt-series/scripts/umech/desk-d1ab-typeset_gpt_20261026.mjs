// Measured Japanese typography; all existing helpers remain untouched.
import sharp from 'sharp';
import {esc} from './anim.mjs';
export const FONT='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const widths=new Map();
export async function measureLabels(labels){
 for(const text of new Set(labels))for(const size of [36,38,40,42,44,46,48]){
  const w=Math.ceil(Math.max(400,[...text].length*size*1.5+100)),h=Math.ceil(size*2.5);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/><text x="20" y="${size*1.6}" ${FONT} font-size="${size}" font-weight="800" fill="#000">${esc(text)}</text></svg>`;
  const {info}=await sharp(Buffer.from(svg)).trim({background:'#ffffff',threshold:40}).png().toBuffer({resolveWithObject:true});
  widths.set(size+'|'+text,info.width);
 }
}
export const textWidth=(text,size)=>widths.get(size+'|'+text)??[...text].reduce((sum,c)=>sum+(/[ -~]/.test(c)?.67:1.03)*size,0);
// Breaks affect layout only. Concatenated rows reproduce the input verbatim.
export function wrapText(text,size,maxWidth){
 if(textWidth(text,size)<=maxWidth)return [text];
 const out=[];let row='';
 for(const ch of text){if(row&&textWidth(row+ch,size)>maxWidth){out.push(row);row='';}row+=ch;}
 if(row)out.push(row);if(out.join('')!==text)throw Error('Typesetting changed wording');return out;
}
