// A S2 uses the unchanged prepared A overlay, with the new cache set by the helper.
import {overlayD1v1 as original} from './desk-d1v1-overlay.mjs';
import {overlayD1a} from './desk-d1a-overlay_gpt_20261026.mjs';
export function overlayD1v1(ctx){return ctx.clip.id==='ys-chain-d1a'?overlayD1a(ctx):original(ctx);}
