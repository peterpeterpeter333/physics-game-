// 振り分け（GPT 2026-10-26）：ys-chain-d1a なら前編の札、ほかの動画は今の版の札をそのまま。
import {overlayD1v1 as original} from './desk-d1v1-overlay.mjs';
import {overlayD1a} from './desk-d1a-overlay_gpt_20261026.mjs';
export function overlayD1v1(ctx){return ctx.clip.id==='ys-chain-d1a'?overlayD1a(ctx):original(ctx);}


