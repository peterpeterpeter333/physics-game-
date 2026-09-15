import { createContext, useContext, useEffect, useRef, useState } from "react";

export const MotionContext = createContext({ paused: false, speed: 1 });

/** 経過秒数 (60fps更新)。図解アニメーションの共通時計。 */
export function useT(): number {
  const [t, setT] = useState(0);
  const elapsed = useRef(0);
  const { paused, speed } = useContext(MotionContext);
  useEffect(() => {
    if (paused) return;
    let raf: number;
    let previous = performance.now();
    const loop = (now: number) => {
      elapsed.current += Math.min(.1, Math.max(0, (now - previous) / 1000)) * speed;
      previous = now;
      setT(elapsed.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused, speed]);
  return t;
}

/** Sweep a physical parameter, then keep the learner's manual setting until replay. */
export function useSweep(initial: number, min: number, max: number, period = 10): [number, (value: number) => void] {
  const t = useT();
  const [manual, setManual] = useState<number | null>(null);
  const phase = Math.acos(1 - 2 * (initial - min) / (max - min));
  const value = min + (max-min) * (1-Math.cos(t*2*Math.PI/period+phase))/2;
  return [manual ?? Math.round(value * 10)/10, setManual];
}

/** 0..range を往復する折り返し(壁での反射に使う) */
export function bounce(x: number, range: number): number {
  const m = ((x % (2 * range)) + 2 * range) % (2 * range);
  return m < range ? m : 2 * range - m;
}

/** 長方形の周囲上の点 (p: 0..1) — 回路の電子の周回に使う */
export function rectPoint(
  p: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): [number, number] {
  const w = x1 - x0;
  const h = y1 - y0;
  const P = 2 * (w + h);
  let d = (((p % 1) + 1) % 1) * P;
  if (d < w) return [x0 + d, y0];
  d -= w;
  if (d < h) return [x1, y0 + d];
  d -= h;
  if (d < w) return [x1 - d, y1];
  d -= w;
  return [x0, y1 - d];
}

/** 正弦波のpolyline points文字列 */
export function wavePoints(
  x0: number,
  x1: number,
  base: number,
  amp: number,
  k: number,
  phase: number,
  step = 4
): string {
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += step) {
    pts.push(`${x},${(base - amp * Math.sin(k * (x - x0) - phase)).toFixed(1)}`);
  }
  return pts.join(" ");
}

/** 2つの正弦波の和のpolyline (うなり用) */
export function sumWavePoints(
  x0: number,
  x1: number,
  base: number,
  amp: number,
  k1: number,
  k2: number,
  phase: number,
  step = 3
): string {
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += step) {
    const y =
      base -
      (amp / 2) *
        (Math.sin(k1 * (x - x0) - phase) + Math.sin(k2 * (x - x0) - phase));
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

// 共通カラー
export const C = {
  cyan: "#4ee1ff",
  purple: "#c86bff",
  gold: "#ffd166",
  green: "#7bffb2",
  red: "#ff5d7a",
  dim: "#9aa3c7",
  orange: "#ff8a5c",
};
