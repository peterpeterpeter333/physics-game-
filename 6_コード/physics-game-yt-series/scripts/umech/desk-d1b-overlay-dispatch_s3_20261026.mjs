import {overlayD1v1 as original} from './desk-d1v1-overlay.mjs';
import {overlayD1b} from './desk-d1b-overlay_s3_20261026.mjs';
export function overlayD1v1(ctx){return ctx.clip.id==='ys-chain-d1b'?overlayD1b(ctx):original(ctx);}
