// Only A S3 dispatch is replaced; all other films retain their original overlay.
import {overlayD1v1 as original} from './desk-d1v1-overlay.mjs';
import {overlayD1a} from './desk-d1a-overlay_s3_gpt_20261028.mjs';
export function overlayD1v1(ctx){return ctx.clip.id==='ys-chain-d1a'?overlayD1a(ctx):original(ctx);}
