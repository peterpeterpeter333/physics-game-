// D-1 Claude fix (2026-10-25), row 22 only: a 2D magnifier circle over the
// 1 cm square (with its 1 kg weight), drawn onto the new Blender raw frame.
// Usage: node THIS.mjs RENDER_DIR OUT_DIR
// For every NNNNN.jpg in RENDER_DIR: if mag-NNNNN.jpg + extra-NNNNN.json (with sq)
// exist, writes OUT_DIR/NNNNN.jpg with the magnifier; otherwise a byte copy.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [inDir, outDir] = process.argv.slice(2);
if(!inDir||!outDir||!outDir.includes('_gpt_20261026')||path.resolve(inDir)===path.resolve(outDir))throw Error('Use a separate new *_gpt_20261026 output directory');
fs.mkdirSync(outDir, {recursive: true});
const R = 150, RING = 8;
const sm = x => {x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x);};
for (const f of fs.readdirSync(inDir).filter(x => /^\d{5}\.jpg$/.test(x)).sort()) {
  const j = f.slice(0, 5), src = path.join(inDir, f), dst = path.join(outDir, f);
  if(fs.existsSync(dst))throw Error('Preserve existing magnified frame '+dst);
  const mag = path.join(inDir, `mag-${j}.jpg`), ex = path.join(inDir, `extra-${j}.json`);
  const extra = fs.existsSync(ex) ? JSON.parse(fs.readFileSync(ex)) : {};
  if (!extra.sq || !fs.existsSync(mag)) { fs.copyFileSync(src, dst); continue; }
  const op = sm((extra.t - extra.magT) / .3);
  if (op <= 0) { fs.copyFileSync(src, dst); continue; }
  const [sx, sy] = extra.sq, half = Math.max(30, Math.abs(extra.sq_edge[0] - sx)) * 1.5;
  const cx = Math.round(Math.min(1040 - R, Math.max(40 + R, sx - 40))), cy = Math.round(sy - 330);
  // circular crop of the close-up render
  const D = 2 * R;
  const mask = Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${R}" cy="${R}" r="${R}" fill="#fff"/></svg>`);
  const lens = await sharp(mag).resize(D, D, {fit: 'cover'}).composite([{input: mask, blend: 'dest-in'}]).png().toBuffer();
  // leader from the circle bottom to a ring around the square
  const ang = Math.atan2(sy - cy, sx - cx), ex0 = cx + (R + RING) * Math.cos(ang), ey0 = cy + (R + RING) * Math.sin(ang);
  const ringR = half + 6, ex1 = sx - ringR * Math.cos(ang), ey1 = sy - ringR * Math.sin(ang);
  const svg = `<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg"><g opacity="${op.toFixed(3)}">
<path d="M${ex0.toFixed(1)} ${ey0.toFixed(1)} L${ex1.toFixed(1)} ${ey1.toFixed(1)}" stroke="#3a2a1a" stroke-width="9" stroke-linecap="round"/>
<path d="M${ex0.toFixed(1)} ${ey0.toFixed(1)} L${ex1.toFixed(1)} ${ey1.toFixed(1)}" stroke="#fff7e6" stroke-width="5" stroke-linecap="round"/>
<circle cx="${sx}" cy="${sy}" r="${ringR.toFixed(1)}" fill="none" stroke="#3a2a1a" stroke-width="9"/>
<circle cx="${sx}" cy="${sy}" r="${ringR.toFixed(1)}" fill="none" stroke="#fff7e6" stroke-width="5"/>
</g></svg>`;
  const ring = `<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg"><g opacity="${op.toFixed(3)}">
<circle cx="${cx}" cy="${cy}" r="${R + RING / 2}" fill="none" stroke="#3a2a1a" stroke-width="${RING + 6}"/>
<circle cx="${cx}" cy="${cy}" r="${R + RING / 2}" fill="none" stroke="#fff7e6" stroke-width="${RING}"/></g></svg>`;
  const lensFaded = await sharp(lens).ensureAlpha().composite([{input: Buffer.from([255, 255, 255, Math.round(255 * op)]), raw: {width: 1, height: 1, channels: 4}, tile: true, blend: 'dest-in'}]).png().toBuffer();
  await sharp(src).composite([
    {input: Buffer.from(svg), left: 0, top: 0},
    {input: lensFaded, left: cx - R, top: cy - R},
    {input: Buffer.from(ring), left: 0, top: 0},
  ]).jpeg({quality: 92}).toFile(dst);
}
console.log('magnifier done', outDir);

