// Isolated S4 helper (2026-10-27); original S3 files remain unchanged.
import {overlayD1v1 as original} from './desk-d1v1-overlay.mjs';
import {overlayD1b} from './desk-d1b-overlay_s4_gpt_20261027.mjs';
export function overlayD1v1(ctx){return ctx.clip.id==='ys-chain-d1b'?overlayD1b(ctx):original(ctx);}

