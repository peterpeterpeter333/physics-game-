// 振り分け（Claude 2026-10-26）：ys-chain-d1b なら後編の札、ほかの動画は今の版の札をそのまま。
import {overlayD1v1 as original} from './desk-d1v1-overlay.mjs';
import {overlayD1b} from './desk-d1b-overlay_claude_20261026.mjs';
export function overlayD1v1(ctx){return ctx.clip.id==='ys-chain-d1b'?overlayD1b(ctx):original(ctx);}
