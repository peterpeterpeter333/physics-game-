import { useState } from 'react';
import { useT, C } from '../anim';

/** 初級・中級の図解で使う共通部品。
 * 視覚語彙は仕様で固定されている。同じ概念を別の色・別の比喩に変えない。 */

export const W = 320;
export const H = 190;

/** 固定の色の約束。 */
export const L = {
  /** 経路・道 */
  path: '#e6c84a',
  /** 力・電場・磁場の矢印 */
  field: C.cyan,
  /** いま選んでいる小区間・小面 */
  focus: C.gold,
  /** 正の寄与 */
  plus: C.green,
  /** 負の寄与 */
  minus: C.purple,
  /** 法線 */
  normal: '#dbe6ff',
  /** 補助線・軸 */
  dim: C.dim,
  text: '#ffffff',
};

export { useT, C };

export function LevelFig({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <svg className="fig" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function width(s: string, size: number): number {
  let w = 0;
  for (const ch of s) w += ch.charCodeAt(0) > 0x2e7f ? size * 1.08 : size * 0.6;
  return w;
}

/** 図の下の一文。長ければ縮小し、それでも入らなければ2行に折り返す。 */
export function Cap({ text }: { text: string }) {
  const max = W - 16;
  let size = 11;
  while (size > 9.5 && width(text, size) > max) size -= 0.5;
  if (width(text, size) <= max) {
    return <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={size} fill={L.dim}>{text}</text>;
  }
  const chars = [...text];
  const middle = Math.floor(chars.length / 2);
  const stop = /[、。，,;；:：—→=)）」]/;
  let cut = middle;
  for (let d = 0; d < middle; d++) {
    if (stop.test(chars[middle + d] ?? '')) { cut = middle + d + 1; break; }
    if (stop.test(chars[middle - d] ?? '')) { cut = middle - d + 1; break; }
  }
  return (
    <g fontSize={9.5} fill={L.dim} textAnchor="middle">
      <text x={W / 2} y={H - 18}>{chars.slice(0, cut).join('')}</text>
      <text x={W / 2} y={H - 6}>{chars.slice(cut).join('')}</text>
    </g>
  );
}

/** 図の中の短いラベル。
 * 置き場所の約束: y は 164 以下（Cap の領域と重ねない）。
 * Axes を使う図で上部に文を置くときは x >= 64 にする（左上の縦軸ラベルと重なるため）。 */
export function Lbl({ x, y, text, color = L.text, size = 11, anchor = 'start', bold = false }: {
  x: number; y: number; text: string; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; bold?: boolean;
}) {
  return <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} fontWeight={bold ? 700 : 400}>{text}</text>;
}

/** 矢印（始点 + 変位）。 */
export function Arw({ x, y, dx, dy, color, w = 2.5, head = 8 }: {
  x: number; y: number; dx: number; dy: number; color: string; w?: number; head?: number;
}) {
  const len = Math.hypot(dx, dy);
  if (!(len > 0.4)) return null;
  const ux = dx / len, uy = dy / len;
  const ex = x + dx, ey = y + dy;
  const bx = ex - ux * head, by = ey - uy * head;
  const px = -uy * head * 0.5, py = ux * head * 0.5;
  return (
    <g>
      <line x1={x} y1={y} x2={bx} y2={by} stroke={color} strokeWidth={w} />
      <polygon points={`${ex},${ey} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
    </g>
  );
}

export type Mapper = {
  x: (v: number) => number; y: (v: number) => number;
  x0: number; y0: number; x1: number; y1: number;
  xr: [number, number]; yr: [number, number];
};

/** 数学座標 → 画面座標。y は上が大きい値になる。 */
export function mapper(xr: [number, number], yr: [number, number],
  box: { x0?: number; y0?: number; x1?: number; y1?: number } = {}): Mapper {
  const x0 = box.x0 ?? 44, y0 = box.y0 ?? 28, x1 = box.x1 ?? 296, y1 = box.y1 ?? 152;
  return {
    x: v => x0 + ((v - xr[0]) / (xr[1] - xr[0])) * (x1 - x0),
    y: v => y1 - ((v - yr[0]) / (yr[1] - yr[0])) * (y1 - y0),
    x0, y0, x1, y1, xr, yr,
  };
}

export function Axes({ m, xLabel, yLabel }: { m: Mapper; xLabel: string; yLabel: string }) {
  const ox = m.xr[0] <= 0 && m.xr[1] >= 0 ? m.x(0) : m.x0;
  const oy = m.yr[0] <= 0 && m.yr[1] >= 0 ? m.y(0) : m.y1;
  return (
    <g>
      <line x1={m.x0 - 4} y1={oy} x2={m.x1 + 8} y2={oy} stroke={L.dim} strokeWidth={1.4} />
      <line x1={ox} y1={m.y1 + 4} x2={ox} y2={m.y0 - 8} stroke={L.dim} strokeWidth={1.4} />
      <text x={m.x1 + 2} y={oy + 14} fontSize={10.5} fill={L.dim}>{xLabel}</text>
      <text x={ox - 34} y={m.y0 - 1} fontSize={10.5} fill={L.dim}>{yLabel}</text>
    </g>
  );
}

/** y = f(x) の折れ線。範囲外・NaN は描かない。 */
export function Curve({ m, f, color, w = 2.5, xa, xb, dash, n = 120 }: {
  m: Mapper; f: (x: number) => number; color: string; w?: number; xa?: number; xb?: number; dash?: string; n?: number;
}) {
  const a = xa ?? m.xr[0], b = xb ?? m.xr[1];
  const segments: string[] = [];
  let run: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    const y = f(x);
    if (!Number.isFinite(y) || y < m.yr[0] - (m.yr[1] - m.yr[0]) || y > m.yr[1] + (m.yr[1] - m.yr[0])) {
      if (run.length > 1) segments.push(run.join(' '));
      run = [];
      continue;
    }
    run.push(`${m.x(x).toFixed(1)},${m.y(y).toFixed(1)}`);
  }
  if (run.length > 1) segments.push(run.join(' '));
  return <g>{segments.map((pts, i) => (
    <polyline key={i} points={pts} fill="none" stroke={color} strokeWidth={w} strokeDasharray={dash} strokeLinejoin="round" />
  ))}</g>;
}

/** 階段状・曲線状の量を短冊で近似したときの1本。選択中は focus 色で塗る。 */
export function Bar({ m, x0, x1, height, active, color = L.field }: {
  m: Mapper; x0: number; x1: number; height: number; active?: boolean; color?: string;
}) {
  const top = m.y(Math.max(height, 0));
  const base = m.y(0);
  const y = Math.min(top, base), h = Math.abs(base - top);
  return (
    <rect x={m.x(x0)} y={y} width={Math.max(m.x(x1) - m.x(x0) - 1, 1)} height={h}
      fill={active ? L.focus : color} opacity={active ? 0.85 : 0.4}
      stroke={active ? L.focus : 'none'} strokeWidth={active ? 1.5 : 0} />
  );
}

/** 経過時間から、0,1,2,…,n-1 を一定間隔で巡回させる。小片を1つずつ数える演出に使う。 */
export function step(t: number, n: number, seconds = 1.1): number {
  return Math.floor((t % (n * seconds)) / seconds);
}

/** 0→1→0 を往復する係数。 */
export function pingPong(t: number, period = 5): number {
  const u = (t % period) / period;
  const v = u < 0.5 ? u * 2 : 2 - u * 2;
  return v * v * (3 - 2 * v);
}

/** 図の下に置く操作スライダー。物理量を変えるときだけ使い、名前と単位を付ける。 */
export function FigSlider({ label, value, min, max, step: s = 0.01, onChange, display }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; display?: string;
}) {
  return (
    <label className="figure-range">
      {label}{display ? ` = ${display}` : ''}
      <input type="range" aria-label={label} min={min} max={max} step={s} value={value}
        onChange={e => onChange(Number(e.target.value))} />
    </label>
  );
}

/** 自動で動かしつつ、学習者がスライダーを触ったらその値を保つ。 */
export function useManual(auto: (t: number) => number): [number, (v: number) => void] {
  const t = useT();
  const [manual, setManual] = useState<number | null>(null);
  return [manual ?? auto(t), setManual];
}

/** 数値を短く表示する。 */
export function fmt(v: number, digits = 1): string {
  return v.toFixed(digits).replace(/\.0+$/, '').replace('-', '−');
}
