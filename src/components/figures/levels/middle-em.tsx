import { Arw, Axes, Cap, Curve, L, Lbl, LevelFig, mapper, pingPong, step, useT, fmt } from './base';

// 電磁気学（電場・磁場を足し合わせる）の図解。
// 約束: 経路=黄(L.path) / 場の矢印=水色(L.field) / 選択中=金(L.focus)
//       正の寄与=黄緑(L.plus) / 負の寄与=紫(L.minus) / 法線=白(L.normal)
// 座標は px で計算する。向きの正しさが要る図は、縦横のスケールを必ずそろえる。

const RAD = Math.PI / 180;

/** 数学の角度（反時計回り、y は上向き）を画面座標の単位ベクトルへ。 */
function dir(deg: number): [number, number] {
  return [Math.cos(deg * RAD), -Math.sin(deg * RAD)];
}

/** 横から見た面の小片。法線の向き ndeg で姿勢が決まる。 */
function EdgeTile({ cx, cy, ndeg, len, active, color = L.field }: {
  cx: number; cy: number; ndeg: number; len: number; active?: boolean; color?: string;
}) {
  const [nx, ny] = dir(ndeg);
  const tx = -ny, ty = nx;
  const h = len / 2, th = 3;
  const p = (a: number, b: number) => `${(cx + tx * a + nx * b).toFixed(1)},${(cy + ty * a + ny * b).toFixed(1)}`;
  return (
    <polygon points={`${p(-h, th)} ${p(h, th)} ${p(h, -th)} ${p(-h, -th)}`}
      fill={active ? L.focus : color} opacity={active ? 0.8 : 0.32}
      stroke={active ? L.focus : L.dim} strokeWidth={1.2} />
  );
}

/** 法線の矢印。長さ1の約束を表すため、どの図でも同じ長さで描く。 */
function Normal({ cx, cy, ndeg, len = 24, color = L.normal, w = 2.2 }: {
  cx: number; cy: number; ndeg: number; len?: number; color?: string; w?: number;
}) {
  const [nx, ny] = dir(ndeg);
  return <Arw x={cx} y={cy} dx={nx * len} dy={ny * len} color={color} w={w} head={7} />;
}

function Dot({ x, y, color = L.focus, r = 3.2 }: { x: number; y: number; color?: string; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={color} />;
}

/** 直角の印。頂点 (x,y) から2方向へ小さな四角を描く。 */
function RightAngle({ x, y, a, b, size = 9, color = L.dim }: {
  x: number; y: number; a: number; b: number; size?: number; color?: string;
}) {
  const [ax, ay] = dir(a), [bx, by] = dir(b);
  const p1 = `${x + ax * size},${y + ay * size}`;
  const p2 = `${x + ax * size + bx * size},${y + ay * size + by * size}`;
  const p3 = `${x + bx * size},${y + by * size}`;
  return <polyline points={`${p1} ${p2} ${p3}`} fill="none" stroke={color} strokeWidth={1.3} />;
}

/** 一様な場を表す、横並びの矢印の列。 */
function UniformField({ ys, x0, len, color = L.field, w = 2 }: {
  ys: number[]; x0: number; len: number; color?: string; w?: number;
}) {
  return <g>{ys.map(y => <Arw key={y} x={x0} y={y} dx={len} dy={0} color={color} w={w} head={7} />)}</g>;
}

/** ∮（閉じた道）の記号。フォントに頼らず線で作る。 */
function OintGlyph({ x, y, size = 22, color = L.text }: { x: number; y: number; size?: number; color?: string }) {
  return (
    <g>
      <text x={x} y={y} fontSize={size} fill={color} textAnchor="middle">∫</text>
      <circle cx={x} cy={y - size * 0.33} r={size * 0.23} fill="none" stroke={color} strokeWidth={1.6} />
    </g>
  );
}

/** ∯（閉じた面）の記号。積分記号2本に輪を重ねる。 */
function OiintGlyph({ x, y, size = 22, color = L.text }: { x: number; y: number; size?: number; color?: string }) {
  return (
    <g>
      <text x={x} y={y} fontSize={size} fill={color} textAnchor="middle">∫∫</text>
      <ellipse cx={x} cy={y - size * 0.33} rx={size * 0.34} ry={size * 0.23} fill="none" stroke={color} strokeWidth={1.6} />
    </g>
  );
}

// ===================== 1. 場をベクトルで書く =====================

/** 位置ごとに矢印が1本決まることを、格子の上で見せる。 */
export function FieldMapGrid() {
  const t = useT();
  const xs = [64, 116, 168, 220, 272], ys = [50, 88, 126];
  const cells = xs.flatMap((sx, i) => ys.map((sy, j) => ({ sx, sy, i, j })));
  const pick = step(t, cells.length, 0.5);
  const field = (i: number, j: number): [number, number] => [1.4 + 0.25 * j, 0.55 * i - 1.1];
  return (
    <LevelFig label="空間の各点に矢印が1本ずつ対応する">
      {cells.map((c, k) => {
        const [ex, ey] = field(c.i, c.j);
        const on = k === pick;
        return (
          <g key={k}>
            <Arw x={c.sx} y={c.sy} dx={ex * 13} dy={-ey * 13} color={on ? L.focus : L.field} w={on ? 3 : 1.8} head={on ? 8 : 6} />
            <circle cx={c.sx} cy={c.sy} r={on ? 3 : 1.6} fill={on ? L.focus : L.dim} />
          </g>
        );
      })}
      <Lbl x={16} y={24} text="点を1つ決めると、矢印が1本決まる" color={L.text} size={11.5} />
      <Lbl x={16} y={156} text={(() => {
        const c = cells[pick]; const [ex, ey] = field(c.i, c.j);
        return `E(r) = (${fmt(ex, 2)}, ${fmt(ey, 2)}) N/C`;
      })()} color={L.focus} size={11.5} />
      <Cap text="矢印の集まりが電場。色の付いた点が、いま読んでいる場所" />
    </LevelFig>
  );
}

/** 24 px = 1 N/C の等スケール座標。3-4-5 が正しく見える。 */
const EM5 = mapper([0, 6], [0, 5], { x0: 70, y0: 26, x1: 214, y1: 146 });

/** 斜めの矢印を x 成分と y 成分に分ける。 */
export function EComponents() {
  const t = useT();
  const phase = step(t, 3, 1.3);
  const o = { x: EM5.x(0), y: EM5.y(0) };
  const tip = { x: EM5.x(4), y: EM5.y(3) };
  return (
    <LevelFig label="電場を x 成分と y 成分に分ける">
      <Axes m={EM5} xLabel="x 方向 [N/C]" yLabel="y 方向" />
      <Arw x={o.x} y={o.y} dx={tip.x - o.x} dy={tip.y - o.y} color={L.field} w={3} />
      <g opacity={phase >= 1 ? 1 : 0.15}>
        <Arw x={o.x} y={o.y} dx={tip.x - o.x} dy={0} color={L.plus} w={3} />
        <Lbl x={EM5.x(2)} y={EM5.y(0) + 16} text="Ex = 4 N/C" color={L.plus} size={11} anchor="middle" />
      </g>
      <g opacity={phase >= 2 ? 1 : 0.15}>
        <Arw x={tip.x} y={o.y} dx={0} dy={tip.y - o.y} color={L.plus} w={3} />
        <Lbl x={tip.x + 6} y={EM5.y(1.5)} text="Ey = 3 N/C" color={L.plus} size={11} />
      </g>
      <line x1={tip.x} y1={tip.y} x2={o.x} y2={tip.y} stroke={L.dim} strokeDasharray="4 3" />
      <Lbl x={160} y={20} text="E = (4, 3) N/C" color={L.focus} size={12.5} anchor="middle" bold />
      <Cap text="2本の内訳を足すと、元の斜めの矢印になる" />
    </LevelFig>
  );
}

// ===================== 2. 小区間の仕事を有限和で書く =====================

/** 40 px = 1 m の等スケール。折れ線の道はこの座標で描く。 */
const PM = mapper([-0.5, 2.5], [-0.5, 2.5], { x0: 100, y0: 26, x1: 220, y1: 146 });
const ES = 9; // 1 N/C あたりの px

type Edge = { from: [number, number]; to: [number, number]; mid: [number, number]; E: [number, number]; dW: number };
const EDGES: Edge[] = [
  { from: [0, 0], to: [1, 0], mid: [0.5, 0], E: [3, 0], dW: 3 },
  { from: [1, 0], to: [1, 1], mid: [1, 0.5], E: [0, 2], dW: 2 },
  { from: [1, 1], to: [1, 2], mid: [1, 1.5], E: [2, 0], dW: 0 },
  { from: [1, 2], to: [2, 2], mid: [1.5, 2], E: [-2, 0], dW: -2 },
];
const sx = (v: number) => PM.x(v), sy = (v: number) => PM.y(v);

function PathPoly({ active }: { active?: number }) {
  return (
    <g>
      {EDGES.map((e, i) => (
        <g key={i}>
          <line x1={sx(e.from[0])} y1={sy(e.from[1])} x2={sx(e.to[0])} y2={sy(e.to[1])}
            stroke={active === i ? L.focus : L.path} strokeWidth={active === i ? 4.5 : 3} strokeLinecap="round" />
        </g>
      ))}
      <Dot x={sx(0)} y={sy(0)} color={L.path} r={3.5} />
      <Lbl x={sx(0) - 14} y={sy(0) + 14} text="A" color={L.path} size={11} />
      <Dot x={sx(2)} y={sy(2)} color={L.path} r={3.5} />
      <Lbl x={sx(2) + 6} y={sy(2) - 6} text="B" color={L.path} size={11} />
    </g>
  );
}

function EdgeField({ i, color }: { i: number; color?: string }) {
  const e = EDGES[i];
  return (
    <Arw x={sx(e.mid[0])} y={sy(e.mid[1])} dx={e.E[0] * ES} dy={-e.E[1] * ES}
      color={color ?? L.field} w={2.6} head={7} />
  );
}

/** 一様な電場での W = qEΔx の復習。 */
export function WorkUniformRecall() {
  const t = useT();
  const u = pingPong(t, 6);
  const x0 = 80, y = 100, span = 120;
  return (
    <LevelFig label="一様な電場の中を電場の向きに進む">
      <UniformField ys={[52, 100, 148]} x0={60} len={40} />
      <UniformField ys={[52, 100, 148]} x0={130} len={40} />
      <UniformField ys={[52, 100, 148]} x0={200} len={40} />
      <line x1={x0} y1={y + 22} x2={x0 + span} y2={y + 22} stroke={L.path} strokeWidth={2.5} />
      <line x1={x0} y1={y + 16} x2={x0} y2={y + 28} stroke={L.path} strokeWidth={2} />
      <line x1={x0 + span} y1={y + 16} x2={x0 + span} y2={y + 28} stroke={L.path} strokeWidth={2} />
      <circle cx={x0 + span * u} cy={y} r={8} fill={L.plus} opacity={0.9} />
      <Lbl x={x0 + span * u} y={y + 4} text="q" color="#0b1020" size={11} anchor="middle" bold />
      <Lbl x={16} y={24} text="E = 3 N/C（どこでも同じ）" color={L.field} size={11} />
      <Lbl x={16} y={42} text="q = 1 C、Δx = 1 m" color={L.text} size={11} />
      <Lbl x={x0 + span / 2} y={y + 40} text="Δx" color={L.path} size={11} anchor="middle" />
      <Lbl x={16} y={158} text={`W = qEΔx = ${fmt(3 * u, 1)} J`} color={L.focus} size={12} />
      <Cap text="N/C × C × m = J。単位まで含めて掛け算1回" />
    </LevelFig>
  );
}

/** 道が曲がると、掛けるべき距離が1つに決まらない。 */
export function BentPathQuestion() {
  const t = useT();
  const blink = 0.45 + 0.35 * Math.sin(4 * t);
  return (
    <LevelFig label="曲がった道では距離を1つに決められない">
      <PathPoly />
      {EDGES.map((_, i) => <EdgeField key={i} i={i} />)}
      {EDGES.map((e, i) => (
        <Lbl key={i} x={sx(e.mid[0]) + 10} y={sy(e.mid[1]) - 8} text={`${i + 1}`} color={L.path} size={10.5} />
      ))}
      <Lbl x={16} y={24} text="辺ごとに進む向きが違う" color={L.text} size={11.5} />
      <Lbl x={16} y={42} text="電場の向きとも揃っていない" color={L.dim} size={10.5} />
      <g opacity={blink}>
        <Lbl x={16} y={156} text="どの Δx を掛ければよい？" color={L.minus} size={12} />
      </g>
      <Cap text="黄が道、水色が各辺の代表点での電場" />
    </LevelFig>
  );
}

/** 辺の情報を矢印1本 Δr にまとめる。 */
export function DeltaRArrow() {
  const t = useT();
  const pick = step(t, 4, 1.2);
  const e = EDGES[pick];
  const dx = sx(e.to[0]) - sx(e.from[0]), dy = sy(e.to[1]) - sy(e.from[1]);
  const comp: [number, number] = [e.to[0] - e.from[0], e.to[1] - e.from[1]];
  return (
    <LevelFig label="小区間を進む向きと長さを矢印1本で表す">
      <PathPoly active={pick} />
      <Arw x={sx(e.from[0])} y={sy(e.from[1])} dx={dx} dy={dy} color={L.focus} w={4} head={10} />
      <Lbl x={16} y={24} text="Δr i = 進む向きと長さ" color={L.focus} size={11.5} />
      <Lbl x={16} y={44} text={`i = ${pick + 1} 番目の辺`} color={L.text} size={11} />
      <Lbl x={16} y={62} text={`Δr = (${comp[0]}, ${comp[1]}) m`} color={L.focus} size={11.5} />
      <Lbl x={16} y={158} text="長さが距離、向きが進む向き" color={L.dim} size={10.5} />
      <Cap text="辺の情報が、2つの数値の組になった" />
    </LevelFig>
  );
}

/** 辺の代表点を決め、その点の場の値を使う。 */
export function RepresentativePoint() {
  const t = useT();
  const pick = step(t, 4, 1.2);
  const e = EDGES[pick];
  return (
    <LevelFig label="各辺の代表点で場の値を読む">
      <PathPoly active={pick} />
      {EDGES.map((d, i) => (
        <circle key={i} cx={sx(d.mid[0])} cy={sy(d.mid[1])} r={i === pick ? 4.2 : 2.4}
          fill={i === pick ? L.focus : L.dim} />
      ))}
      <EdgeField i={pick} color={L.field} />
      <Lbl x={16} y={24} text="代表点は、各辺の中点にとる" color={L.text} size={11.5} />
      <Lbl x={16} y={44} text={`r ${pick + 1} = (${e.mid[0]}, ${e.mid[1]}) m`} color={L.focus} size={11.5} />
      <Lbl x={16} y={62} text={`E(r ${pick + 1}) = (${e.E[0]}, ${e.E[1]}) N/C`} color={L.field} size={11} />
      <Lbl x={16} y={158} text="辺の中では、この値を使い回す" color={L.dim} size={10.5} />
      <Cap text="金の点が「どこの場の値を使うか」を決めている" />
    </LevelFig>
  );
}

/** 1辺目: 内積の投影を点線で見せる。 */
export function DotOneEdge() {
  const t = useT();
  const glow = 0.55 + 0.3 * Math.sin(3 * t);
  const e = EDGES[0];
  const mx = sx(e.mid[0]), my = sy(e.mid[1]);
  return (
    <LevelFig label="1辺の仕事を内積で計算する">
      <PathPoly active={0} />
      <Arw x={sx(0)} y={sy(0)} dx={sx(1) - sx(0)} dy={0} color={L.focus} w={4} head={10} />
      <Arw x={mx} y={my} dx={e.E[0] * ES} dy={-e.E[1] * ES} color={L.field} w={3} head={8} />
      <line x1={mx + e.E[0] * ES} y1={my} x2={mx + e.E[0] * ES} y2={my - 16} stroke={L.dim} strokeDasharray="3 3" />
      <g opacity={glow}>
        <line x1={mx} y1={my - 16} x2={mx + e.E[0] * ES} y2={my - 16} stroke={L.plus} strokeWidth={3} />
      </g>
      <Lbl x={16} y={82} text="黄緑 = 道方向の成分" color={L.plus} size={10} />
      <Lbl x={16} y={24} text="E = (3, 0) N/C、Δr = (1, 0) m" color={L.text} size={11} />
      <Lbl x={16} y={44} text="内積 = 3×1 + 0×0 = 3" color={L.field} size={11.5} />
      <Lbl x={16} y={62} text="ΔW1 = 1 C × 3 = 3 J" color={L.focus} size={12} bold />
      <Cap text="点線は電場を進む向きへ落とした投影" />
    </LevelFig>
  );
}

/** 2辺目と3辺目。直角なら内積が0。 */
export function PerpendicularZero() {
  const t = useT();
  const which = step(t, 2, 1.8);
  const i = 1 + which;
  const e = EDGES[i];
  const mx = sx(e.mid[0]), my = sy(e.mid[1]);
  return (
    <LevelFig label="電場と移動が直角なら仕事はゼロ">
      <PathPoly active={i} />
      <Arw x={sx(e.from[0])} y={sy(e.from[1])} dx={0} dy={sy(e.to[1]) - sy(e.from[1])} color={L.focus} w={4} head={10} />
      <Arw x={mx} y={my} dx={e.E[0] * ES} dy={-e.E[1] * ES} color={L.field} w={3} head={8} />
      {i === 2 && <RightAngle x={mx} y={my} a={0} b={90} size={11} color={L.minus} />}
      <Lbl x={16} y={24} text={`${i + 1} 区間目`} color={L.text} size={11.5} />
      <Lbl x={16} y={44} text={`E = (${e.E[0]}, ${e.E[1]}) N/C`} color={L.field} size={11} />
      <Lbl x={16} y={62} text="Δr = (0, 1) m" color={L.focus} size={11} />
      <Lbl x={16} y={82} text={i === 1 ? 'ΔW2 = 0×0+2×1 = 2 J' : 'ΔW3 = 2×0+0×1 = 0 J'}
        color={i === 1 ? L.plus : L.minus} size={11} bold />
      <Lbl x={16} y={158} text={i === 1 ? '同じ向きなので、そのまま効く' : '直角なので、揃った成分がない'} color={L.dim} size={10.5} />
      <Cap text="3辺目では直角の印が付き、内積が0になる" />
    </LevelFig>
  );
}

/** 4辺目: 逆向きの電場は負の仕事。 */
export function NegativeEdge() {
  const t = useT();
  const glow = 0.5 + 0.35 * Math.sin(3.4 * t);
  const e = EDGES[3];
  const mx = sx(e.mid[0]), my = sy(e.mid[1]);
  return (
    <LevelFig label="進む向きと逆の電場は負の仕事">
      <PathPoly active={3} />
      <Arw x={sx(1)} y={sy(2)} dx={sx(2) - sx(1)} dy={0} color={L.focus} w={4} head={10} />
      <g opacity={glow}>
        <Arw x={mx} y={my - 20} dx={e.E[0] * ES} dy={0} color={L.minus} w={3} head={8} />
      </g>
      <Lbl x={mx + 16} y={my - 24} text="F は左向き" color={L.minus} size={10.5} />
      <Lbl x={mx + 16} y={my + 20} text="Δr は右向き" color={L.focus} size={10.5} />
      <Lbl x={16} y={24} text="なす角は 180°" color={L.text} size={11} />
      <Lbl x={16} y={92} text="F = (−2, 0) N" color={L.minus} size={11} />
      <Lbl x={16} y={110} text="Δr = (1, 0) m" color={L.focus} size={11} />
      <Lbl x={16} y={128} text="内積 = −2×1+0×0" color={L.minus} size={11} />
      <Lbl x={16} y={148} text="ΔW4 = −2 J" color={L.minus} size={12.5} bold />
      <Lbl x={16} y={164 - 2} text="負号は、取り返された側という向きの情報" color={L.dim} size={10} />
      <Cap text="紫が負の寄与。大きさではなく符号に注目" />
    </LevelFig>
  );
}

/** 4辺の合計。1辺ずつ積み上げる。 */
export function SumFourEdges() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.95), 4);
  const partial = EDGES.slice(0, shown).reduce((a, e) => a + e.dW, 0);
  return (
    <LevelFig label="4辺の仕事を順に足す">
      <PathPoly active={shown - 1} />
      {EDGES.slice(0, shown).map((e, i) => (
        <Lbl key={i} x={sx(e.mid[0]) + (i === 1 || i === 2 ? 10 : 0)} y={sy(e.mid[1]) + (i === 1 || i === 2 ? 4 : -10)}
          text={`${e.dW > 0 ? '+' : ''}${e.dW}`} color={e.dW > 0 ? L.plus : e.dW < 0 ? L.minus : L.dim}
          size={12} anchor={i === 1 || i === 2 ? 'start' : 'middle'} bold />
      ))}
      <Lbl x={16} y={24} text="W = 3 + 2 + 0 − 2" color={L.text} size={12} />
      <Lbl x={16} y={46} text={`ここまでの合計 ${partial} J`} color={L.focus} size={12.5} bold />
      <Lbl x={16} y={66} text={`${shown} / 4 区間`} color={L.dim} size={10.5} />
      <Lbl x={16} y={158} text={shown === 4 ? '合計 3 J（初級と同じ数）' : ''} color={L.focus} size={11.5} />
      <Cap text="足しているのは、区間ごとの内積1回分の値" />
    </LevelFig>
  );
}

/** Σ の添字と範囲を読む。 */
export function SigmaIndex() {
  const t = useT();
  const pick = step(t, 4, 0.9);
  const vals = [3, 2, 0, -2];
  return (
    <LevelFig label="Σ の添字と足す範囲">
      <Lbl x={46} y={56} text="Σ" color={L.text} size={30} anchor="middle" />
      <Lbl x={46} y={74} text="i = 1" color={L.focus} size={10} anchor="middle" />
      <Lbl x={46} y={28} text="4" color={L.focus} size={11} anchor="middle" />
      <Lbl x={70} y={54} text="F(r i) · Δr i" color={L.field} size={13} />
      {vals.map((v, i) => (
        <g key={i}>
          <rect x={44 + i * 58} y={96} width={48} height={32} rx={6}
            fill={i === pick ? L.focus : L.dim} opacity={i === pick ? 0.34 : 0.14}
            stroke={i === pick ? L.focus : 'none'} strokeWidth={1.5} />
          <Lbl x={68 + i * 58} y={110} text={`i = ${i + 1}`} color={L.dim} size={10} anchor="middle" />
          <Lbl x={68 + i * 58} y={124} text={`${v > 0 ? '+' : ''}${v} J`} color={v > 0 ? L.plus : v < 0 ? L.minus : L.text} size={11.5} anchor="middle" bold />
        </g>
      ))}
      <line x1={44} y1={136} x2={276} y2={136} stroke={L.focus} strokeWidth={1.4} />
      <line x1={44} y1={132} x2={44} y2={140} stroke={L.focus} strokeWidth={1.4} />
      <line x1={276} y1={132} x2={276} y2={140} stroke={L.focus} strokeWidth={1.4} />
      <Lbl x={160} y={152} text="下端 i=1 から 上端 4 まで、4個を足す" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="上端を書かないと、どこまで足したか伝わらない" />
    </LevelFig>
  );
}

// ===================== 3. 線積分の定義へ =====================

/** 50 px = 1 m の等スケール。なめらかな道はこの座標で描く。 */
const CM = mapper([-0.2, 2.4], [-0.3, 1.9], { x0: 70, y0: 32, x1: 200, y1: 142 });
/** 道: s = 0 → 1 で A から B へ。 */
const CURVE = (s: number): [number, number] => [2 * s, 1.2 * Math.sin(Math.PI * s)];
/** 場: 場所によって少しずつ変わる。 */
const EFN = (x: number, y: number): [number, number] => [1.4 - 0.25 * y, 0.5 + 0.35 * x];
const FS = 18; // 1 N/C あたりの px

const cxs = (s: number) => CM.x(CURVE(s)[0]);
const cys = (s: number) => CM.y(CURVE(s)[1]);

/** N 分割の中点和。分け方を細かくすると落ち着く値を見せるために使う。 */
function riemann(n: number): number {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const a = CURVE(i / n), b = CURVE((i + 1) / n), mid = CURVE((i + 0.5) / n);
    const [ex, ey] = EFN(mid[0], mid[1]);
    sum += ex * (b[0] - a[0]) + ey * (b[1] - a[1]);
  }
  return sum;
}

function SmoothPath({ dim }: { dim?: boolean }) {
  const pts = Array.from({ length: 61 }, (_, k) => `${cxs(k / 60).toFixed(1)},${cys(k / 60).toFixed(1)}`);
  return (
    <g>
      <polyline points={pts.join(' ')} fill="none" stroke={L.path} strokeWidth={dim ? 2 : 3}
        opacity={dim ? 0.4 : 1} strokeLinejoin="round" />
      <Dot x={cxs(0)} y={cys(0)} color={L.path} r={3.4} />
      <Dot x={cxs(1)} y={cys(1)} color={L.path} r={3.4} />
      <Lbl x={cxs(0) - 14} y={cys(0) + 6} text="A" color={L.path} size={11} />
      <Lbl x={cxs(1) + 6} y={cys(1) + 6} text="B" color={L.path} size={11} />
    </g>
  );
}

/** 折れ線近似の1本ぶんを、進む矢印として描く。 */
function ChordArrows({ n, active, head = 7, w = 2.4 }: { n: number; active?: number; head?: number; w?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x0 = cxs(i / n), y0 = cys(i / n), x1 = cxs((i + 1) / n), y1 = cys((i + 1) / n);
        const on = active === i;
        return <Arw key={i} x={x0} y={y0} dx={x1 - x0} dy={y1 - y0}
          color={on ? L.focus : L.path} w={on ? w + 1.4 : w} head={on ? head + 2 : head} />;
      })}
    </g>
  );
}

/** 電場に電荷を掛けると力になる。 */
export function ForceIsQE() {
  const t = useT();
  const phase = step(t, 2, 1.5);
  const ox = 92, oy = 96;
  return (
    <LevelFig label="電荷が受ける力は電場に電荷を掛けたもの">
      <circle cx={ox} cy={oy} r={11} fill={L.plus} opacity={0.9} />
      <Lbl x={ox} y={oy + 4} text="q" color="#0b1020" size={12} anchor="middle" bold />
      <Arw x={ox + 14} y={oy} dx={3 * 18} dy={0} color={L.field} w={2.6} head={8} />
      <Lbl x={ox + 20} y={oy - 10} text="E = 3 N/C" color={L.field} size={11} />
      <g opacity={phase >= 1 ? 1 : 0.15}>
        <Arw x={ox + 14} y={oy + 34} dx={6 * 18} dy={0} color={L.plus} w={3.4} head={10} />
        <Lbl x={ox + 20} y={oy + 54} text="F = qE = 6 N（q = 2 C）" color={L.plus} size={11} />
      </g>
      <Lbl x={16} y={26} text="仕事の定義に入るのは、電場ではなく力" color={L.text} size={11.5} />
      <Lbl x={16} y={46} text="N/C × C = N" color={L.dim} size={10.5} />
      <Cap text="水色が1 Cあたりの力、黄緑が実際に働く力" />
    </LevelFig>
  );
}

/** 代表点の位置ベクトルと、進む矢印の違い。 */
export function RiVsDri() {
  const t = useT();
  const n = 5;
  const pick = step(t, n, 1.1);
  const ox = CM.x(-0.2) - 12, oy = CM.y(-0.3) + 14;
  const ms = (pick + 0.5) / n;
  const mx = cxs(ms), my = cys(ms);
  const x0 = cxs(pick / n), y0 = cys(pick / n), x1 = cxs((pick + 1) / n), y1 = cys((pick + 1) / n);
  return (
    <LevelFig label="代表点の位置ベクトルと進む矢印">
      <line x1={ox} y1={oy} x2={296} y2={oy} stroke={L.dim} strokeWidth={1.1} />
      <line x1={ox} y1={oy} x2={ox} y2={30} stroke={L.dim} strokeWidth={1.1} />
      <Lbl x={ox - 11} y={oy - 4} text="O" color={L.dim} size={10} />
      <SmoothPath dim />
      <ChordArrows n={n} active={pick} />
      <Arw x={ox} y={oy} dx={mx - ox} dy={my - oy} color={L.normal} w={2} head={7} />
      <Dot x={mx} y={my} color={L.focus} r={3.6} />
      <Lbl x={210} y={54} text="白: r i（代表点の位置）" color={L.normal} size={10.5} />
      <Lbl x={210} y={72} text="金: Δr i（進む矢印）" color={L.focus} size={10.5} />
      <Lbl x={64} y={22} text="原点から測る矢印と、辺を進む矢印" color={L.text} size={11} />
      <Lbl x={16} y={158} text={`i = ${pick + 1}`} color={L.focus} size={11} />
      <Cap text="白は場の値を読む場所、金は進む量を決める" />
    </LevelFig>
  );
}

/** 1つの小区間で、力と進む矢印の内積をとる。 */
export function PieceWorkDot() {
  const t = useT();
  const glow = 0.55 + 0.3 * Math.sin(3 * t);
  const n = 5, i = 2;
  const ms = (i + 0.5) / n;
  const [mxm, mym] = CURVE(ms);
  const mx = CM.x(mxm), my = CM.y(mym);
  const x0 = cxs(i / n), y0 = cys(i / n), x1 = cxs((i + 1) / n), y1 = cys((i + 1) / n);
  const [ex, ey] = EFN(mxm, mym);
  const ux = x1 - x0, uy = y1 - y0;
  const ulen = Math.hypot(ux, uy);
  const fx = ex * FS, fy = -ey * FS;
  const proj = (fx * ux + fy * uy) / (ulen * ulen);
  return (
    <LevelFig label="小区間の仕事は力と進む矢印の内積">
      <SmoothPath dim />
      <ChordArrows n={n} active={i} />
      <Arw x={mx} y={my} dx={fx} dy={fy} color={L.plus} w={3} head={8} />
      <Lbl x={mx + fx + 4} y={my + fy - 4} text="F i = q E(r i)" color={L.plus} size={10.5} />
      <line x1={mx + fx} y1={my + fy} x2={mx + proj * ux} y2={my + proj * uy}
        stroke={L.dim} strokeDasharray="3 3" strokeWidth={1.3} />
      <g opacity={glow}>
        <Arw x={mx} y={my} dx={proj * ux} dy={proj * uy} color={L.focus} w={4.2} head={8} />
      </g>
      <Lbl x={64} y={22} text="効くのは、進む向きに揃った成分だけ" color={L.text} size={11} />
      <Lbl x={210} y={110} text="ΔW i" color={L.focus} size={12} bold />
      <Lbl x={210} y={128} text="= F i · Δr i" color={L.focus} size={11} />
      <Lbl x={16} y={158} text="点線が、力を進む向きへ落とした投影" color={L.dim} size={10.5} />
      <Cap text="黄緑が力、金の太い矢印が実際に効く成分" />
    </LevelFig>
  );
}

/** N 個に分けて全部足す。 */
export function SumNPieces() {
  const t = useT();
  const n = 6;
  const shown = Math.min(step(t, n + 1, 0.7), n);
  let partial = 0;
  for (let i = 0; i < shown; i++) {
    const a = CURVE(i / n), b = CURVE((i + 1) / n), mid = CURVE((i + 0.5) / n);
    const [ex, ey] = EFN(mid[0], mid[1]);
    partial += ex * (b[0] - a[0]) + ey * (b[1] - a[1]);
  }
  return (
    <LevelFig label="小区間の仕事を全部足す">
      <SmoothPath dim />
      <ChordArrows n={n} active={shown - 1} />
      {Array.from({ length: n }, (_, i) => {
        const [mxm, mym] = CURVE((i + 0.5) / n);
        const [ex, ey] = EFN(mxm, mym);
        return <Arw key={i} x={CM.x(mxm)} y={CM.y(mym)} dx={ex * 11} dy={-ey * 11}
          color={L.field} w={1.8} head={5} />;
      })}
      <Lbl x={64} y={22} text="N = 6 個に分けて、順に足す" color={L.text} size={11} />
      <Lbl x={212} y={64} text={`${shown} / 6 区間`} color={L.dim} size={10.5} />
      <Lbl x={212} y={84} text={`W6 ≈ ${partial.toFixed(2)} J`} color={L.focus} size={11.5} bold />
      <Lbl x={16} y={158} text="有限個で止めているので、まだ近似値" color={L.dim} size={10.5} />
      <Cap text="水色は代表点での力、金は今足している区間" />
    </LevelFig>
  );
}

/** 分割を細かくすると、和が落ち着く。 */
export function RefinePath() {
  const t = useT();
  const counts = [4, 8, 16];
  const n = counts[step(t, counts.length, 1.6)];
  return (
    <LevelFig label="分割を細かくすると和が落ち着く">
      <SmoothPath dim />
      <ChordArrows n={n} head={n > 8 ? 4 : 6} w={n > 8 ? 1.6 : 2.2} />
      <Lbl x={64} y={22} text={`N = ${n}`} color={L.text} size={12} />
      <Lbl x={212} y={64} text={`W${n} ≈ ${riemann(n).toFixed(3)} J`} color={L.focus} size={11.5} bold />
      <Lbl x={212} y={86} text="N を増やすと" color={L.dim} size={10} />
      <Lbl x={212} y={100} text="桁がそろってくる" color={L.dim} size={10} />
      <Lbl x={16} y={158} text="折れ線が曲線に近づき、代表点のずれも減る" color={L.dim} size={10.5} />
      <Cap text="4 → 8 → 16 と分けるほど、値が安定する" />
    </LevelFig>
  );
}

/** 極限をとった先の値。 */
export function LimitOfSum() {
  const t = useT();
  const counts = [16, 32, 64, 128];
  const k = step(t, counts.length, 1.2);
  const n = counts[k];
  return (
    <LevelFig label="分割を限りなく細かくした極限">
      <SmoothPath />
      <ChordArrows n={Math.min(n, 32)} head={3} w={1.3} />
      <Lbl x={64} y={22} text={`N = ${n} →  限りなく大きく`} color={L.text} size={11} />
      <Lbl x={212} y={62} text="lim" color={L.minus} size={13} />
      <Lbl x={212} y={76} text="N → ∞" color={L.minus} size={9.5} />
      <Lbl x={212} y={98} text={`≈ ${riemann(n).toFixed(4)} J`} color={L.focus} size={11.5} bold />
      <Lbl x={16} y={158} text="もう近似ではなく、分け方によらない1つの数" color={L.dim} size={10.5} />
      <Cap text="小区間の矢印は限りなく短く、個数は限りなく多く" />
    </LevelFig>
  );
}

/** Σ の式に、∫ という短い名前を付ける。 */
export function LineIntegralSymbol() {
  const t = useT();
  const u = pingPong(t, 5);
  return (
    <LevelFig label="極限の和に積分の記号を付ける">
      <SmoothPath />
      <ChordArrows n={24} head={3} w={1.2} />
      <g opacity={1 - u}>
        <Lbl x={206} y={62} text="Σ  F(r i) · Δr i" color={L.field} size={12} />
        <Lbl x={206} y={78} text="有限個の和" color={L.dim} size={10} />
      </g>
      <g opacity={u}>
        <Lbl x={206} y={62} text="∫C  F · dr" color={L.focus} size={14} bold />
        <Lbl x={206} y={78} text="極限に付けた名前" color={L.dim} size={10} />
      </g>
      <Lbl x={64} y={22} text="操作は同じ。書き方が短くなる" color={L.text} size={11} />
      <Lbl x={16} y={158} text="dr は Δr i を限りなく短くした矢印" color={L.dim} size={10.5} />
      <Cap text="Σ の表示が ∫ の表示へ入れ替わる" />
    </LevelFig>
  );
}

/** 数直線の区間 [a,b] と、空間の道 C の違い。 */
export function PathLabelC() {
  const t = useT();
  const u = pingPong(t, 6);
  const ax = 70, bx = 250, ay = 62;
  return (
    <LevelFig label="数直線の区間と空間の道の違い">
      <line x1={50} y1={ay} x2={276} y2={ay} stroke={L.dim} strokeWidth={1.6} />
      <Dot x={ax} y={ay} color={L.dim} r={3} />
      <Dot x={bx} y={ay} color={L.dim} r={3} />
      <Lbl x={ax} y={ay - 8} text="a" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={bx} y={ay - 8} text="b" color={L.dim} size={10.5} anchor="middle" />
      <line x1={ax} y1={ay} x2={ax + (bx - ax) * u} y2={ay} stroke={L.focus} strokeWidth={4} />
      <Lbl x={64} y={26} text="∫ a→b : 数直線の区間" color={L.text} size={11} />
      <line x1={20} y1={84} x2={300} y2={84} stroke={L.dim} strokeDasharray="3 4" strokeWidth={1} />
      <Lbl x={20} y={102} text="∫C : 空間の中の道そのもの" color={L.text} size={11} />
      {(() => {
        const pts = Array.from({ length: 41 }, (_, k) => {
          const s = k / 40;
          return `${(70 + 160 * s).toFixed(1)},${(148 - 34 * Math.sin(Math.PI * s)).toFixed(1)}`;
        });
        const head = Math.max(1, Math.round(40 * u));
        return (
          <g>
            <polyline points={pts.join(' ')} fill="none" stroke={L.path} strokeWidth={2.5} opacity={0.45} />
            <polyline points={pts.slice(0, head + 1).join(' ')} fill="none" stroke={L.focus} strokeWidth={3.4} />
          </g>
        );
      })()}
      <Lbl x={62} y={158} text="A" color={L.path} size={10.5} />
      <Lbl x={236} y={158} text="B" color={L.path} size={10.5} />
      <Lbl x={244} y={112} text="C" color={L.path} size={12} bold />
      <Cap text="端点の数値ではなく、通った道の名札が C" />
    </LevelFig>
  );
}

/** 道の向きを変えると符号が反転する。 */
export function DirectionOfC() {
  const t = useT();
  const back = step(t, 2, 2.2) === 1;
  const n = 8;
  return (
    <LevelFig label="道の向きを逆にすると符号が反転する">
      <SmoothPath dim />
      {Array.from({ length: n }, (_, i) => {
        const a = back ? (i + 1) / n : i / n;
        const b = back ? i / n : (i + 1) / n;
        return <Arw key={i} x={cxs(a)} y={cys(a)} dx={cxs(b) - cxs(a)} dy={cys(b) - cys(a)}
          color={back ? L.minus : L.plus} w={2.6} head={7} />;
      })}
      <Lbl x={64} y={22} text={back ? 'B から A へ進む' : 'A から B へ進む'} color={L.text} size={11.5} />
      <Lbl x={210} y={66} text={back ? '∫ = −1.88 J' : '∫ = +1.88 J'} color={back ? L.minus : L.plus} size={12} bold />
      <Lbl x={210} y={86} text="大きさは同じ" color={L.dim} size={10} />
      <Lbl x={210} y={100} text="符号だけ反転" color={L.dim} size={10} />
      <Lbl x={16} y={158} text="Δr i が全部逆を向くので、内積の符号が変わる" color={L.dim} size={10.5} />
      <Cap text="C を指定するとは、進む向きまで決めること" />
    </LevelFig>
  );
}

/** 線積分の値は、一般には道にも依存し得る。 */
export function PathDependent() {
  const t = useT();
  const blink = 0.4 + 0.4 * Math.sin(3 * t);
  return (
    <LevelFig label="線積分の値は道にも依存し得る">
      <rect x={28} y={32} width={264} height={46} rx={8} fill={L.plus} opacity={0.16} stroke={L.plus} strokeWidth={1.4} />
      <Lbl x={44} y={52} text="決まった: 道 C に沿った仕事" color={L.plus} size={11.5} bold />
      <Lbl x={44} y={70} text="W = ∫C F · dr" color={L.text} size={11} />
      <rect x={28} y={88} width={264} height={52} rx={8} fill={L.minus} opacity={0.14} stroke={L.minus} strokeWidth={1.4} strokeDasharray="5 4" />
      <Lbl x={44} y={108} text="決まっていない: 道を変えたら？" color={L.minus} size={11.5} bold />
      <Lbl x={44} y={126} text="一般には、値が変わり得る" color={L.text} size={11} />
      <g opacity={blink}>
        <Lbl x={272} y={126} text="?" color={L.minus} size={18} anchor="end" bold />
      </g>
      <Lbl x={160} y={158} text="曲線の長さを足しているのではない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="上の枠は確定、下の枠はまだ未確定" />
    </LevelFig>
  );
}

// ===================== 3. 静電場の電位差 =====================

/** 40 px = 1 m。A(0,0) と B(3,2) を結ぶ2本の道を描く座標。 */
const QM = mapper([-0.5, 3.5], [-0.5, 2.5], { x0: 76, y0: 26, x1: 236, y1: 146 });
const qx = (v: number) => QM.x(v), qy = (v: number) => QM.y(v);
const QE = 7; // 1 N/C あたりの px（E = 4 N/C → 28 px）

/** 一様な電場（右向き4 N/C）の矢印。 */
function QField({ rows = [52, 88, 120], opacity = 1 }: { rows?: number[]; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {rows.flatMap(y => [80, 150, 220].map(x => (
        <Arw key={`${x}-${y}`} x={x} y={y} dx={4 * QE} dy={0} color={L.field} w={1.8} head={6} />
      )))}
    </g>
  );
}

function QEnds() {
  return (
    <g>
      <Dot x={qx(0)} y={qy(0)} color={L.path} r={4} />
      <Lbl x={qx(0) - 6} y={qy(0) + 20} text="A(0,0)" color={L.path} size={10.5} anchor="middle" />
      <Dot x={qx(3)} y={qy(2)} color={L.path} r={4} />
      <Lbl x={qx(3) + 8} y={qy(2) - 8} text="B(3,2)" color={L.path} size={10.5} />
    </g>
  );
}

/** 同じ2点を結ぶ道は何通りもある。 */
export function TwoEndpoints() {
  const t = useT();
  const u = pingPong(t, 6);
  const curves = [0.9, 0.35, -0.5];
  return (
    <LevelFig label="同じ2点を結ぶ道は何通りもある">
      <QField opacity={0.55} />
      {curves.map((k, i) => {
        const pts = Array.from({ length: 31 }, (_, j) => {
          const s = j / 30;
          return `${qx(3 * s).toFixed(1)},${qy(2 * s + k * Math.sin(Math.PI * s)).toFixed(1)}`;
        });
        return <polyline key={i} points={pts.join(' ')} fill="none" stroke={L.path}
          strokeWidth={2} opacity={0.3 + 0.25 * Math.abs(Math.sin(u * Math.PI + i))} strokeDasharray="5 4" />;
      })}
      <polyline points={`${qx(0)},${qy(0)} ${qx(3)},${qy(0)} ${qx(3)},${qy(2)}`} fill="none" stroke={L.path} strokeWidth={2.6} />
      <polyline points={`${qx(0)},${qy(0)} ${qx(0)},${qy(2)} ${qx(3)},${qy(2)}`} fill="none" stroke={L.path} strokeWidth={2.6} />
      <QEnds />
      <Lbl x={16} y={22} text="E = (4, 0) N/C で一様、q = 2 C" color={L.field} size={11} />
      <Lbl x={16} y={158} text="道が違えば、W も違うのだろうか？" color={L.minus} size={11} />
      <Cap text="実線が、これから数値で比べる2本の道" />
    </LevelFig>
  );
}

/** 2本の道を交互に見せて比べる。 */
export function TwoPathsCompare() {
  const t = useT();
  const which = step(t, 2, 1.9);
  const right = `${qx(0)},${qy(0)} ${qx(3)},${qy(0)} ${qx(3)},${qy(2)}`;
  const up = `${qx(0)},${qy(0)} ${qx(0)},${qy(2)} ${qx(3)},${qy(2)}`;
  return (
    <LevelFig label="先に右へ行く道と、先に上がる道">
      <QField opacity={0.5} />
      <polyline points={right} fill="none" stroke={which === 0 ? L.focus : L.path}
        strokeWidth={which === 0 ? 4.4 : 2} opacity={which === 0 ? 1 : 0.4} />
      <polyline points={up} fill="none" stroke={which === 1 ? L.focus : L.path}
        strokeWidth={which === 1 ? 4.4 : 2} opacity={which === 1 ? 1 : 0.4} />
      <QEnds />
      <Lbl x={16} y={22} text={which === 0 ? '道1: 先に右、次に上' : '道2: 先に上、次に右'} color={L.focus} size={11.5} bold />
      <Lbl x={16} y={40} text="同じ A から、同じ B へ" color={L.dim} size={10.5} />
      <Lbl x={16} y={158} text="どちらが得か、実際に計算してみる" color={L.text} size={10.5} />
      <Cap text="金で強調されているほうが、いま見ている道" />
    </LevelFig>
  );
}

/** 道1の各区間の値。 */
export function PathRightFirst() {
  const t = useT();
  const shown = Math.min(step(t, 3, 1.2), 2);
  return (
    <LevelFig label="先に右へ行く道の仕事">
      <QField opacity={0.45} />
      <polyline points={`${qx(0)},${qy(0)} ${qx(0)},${qy(2)} ${qx(3)},${qy(2)}`} fill="none"
        stroke={L.path} strokeWidth={1.6} opacity={0.25} strokeDasharray="4 4" />
      <Arw x={qx(0)} y={qy(0)} dx={qx(3) - qx(0)} dy={0} color={shown >= 1 ? L.focus : L.path} w={4} head={10} />
      <Arw x={qx(3)} y={qy(0)} dx={0} dy={qy(2) - qy(0)} color={shown >= 2 ? L.focus : L.path} w={4} head={10} />
      <QEnds />
      <Lbl x={qx(1.5)} y={qy(0) + 20} text={shown >= 1 ? '(3,0) m → +24 J' : ''} color={L.plus} size={10.5} anchor="middle" />
      <Lbl x={qx(3) + 6} y={qy(1)} text={shown >= 2 ? '(0,2) m → 0 J' : ''} color={L.dim} size={10.5} />
      {shown >= 2 && <RightAngle x={qx(3)} y={qy(1)} a={90} b={0} size={9} color={L.minus} />}
      <Lbl x={16} y={22} text="1区間目は電場と同じ向き" color={L.text} size={11} />
      <Lbl x={16} y={158} text={shown >= 2 ? '合計 24 + 0 = 24 J' : '…'} color={L.focus} size={12} bold />
      <Cap text="2区間目は電場と直角なので、直角の印が付く" />
    </LevelFig>
  );
}

/** 道2の各区間の値。 */
export function PathUpFirst() {
  const t = useT();
  const shown = Math.min(step(t, 3, 1.2), 2);
  return (
    <LevelFig label="先に上がる道の仕事">
      <QField opacity={0.45} />
      <polyline points={`${qx(0)},${qy(0)} ${qx(3)},${qy(0)} ${qx(3)},${qy(2)}`} fill="none"
        stroke={L.path} strokeWidth={1.6} opacity={0.25} strokeDasharray="4 4" />
      <Arw x={qx(0)} y={qy(0)} dx={0} dy={qy(2) - qy(0)} color={shown >= 1 ? L.focus : L.path} w={4} head={10} />
      <Arw x={qx(0)} y={qy(2)} dx={qx(3) - qx(0)} dy={0} color={shown >= 2 ? L.focus : L.path} w={4} head={10} />
      <QEnds />
      {shown >= 1 && <RightAngle x={qx(0)} y={qy(1)} a={90} b={0} size={9} color={L.minus} />}
      <Lbl x={qx(0) + 12} y={qy(1) - 8} text={shown >= 1 ? '(0,2) m → 0 J' : ''} color={L.dim} size={10.5} />
      <Lbl x={qx(1.5)} y={qy(2) - 10} text={shown >= 2 ? '(3,0) m → +24 J' : ''} color={L.plus} size={10.5} anchor="middle" />
      <Lbl x={16} y={22} text="順番を入れ替えても" color={L.text} size={11} />
      <Lbl x={16} y={158} text={shown >= 2 ? '合計 0 + 24 = 24 J（道1と同じ）' : '…'} color={L.focus} size={12} bold />
      <Cap text="直角な区間は、どちらの順でも寄与しない" />
    </LevelFig>
  );
}

/** 効いたのは x 方向の移動だけ。 */
export function XDisplacementOnly() {
  const t = useT();
  const which = step(t, 2, 1.8);
  const pts = which === 0
    ? `${qx(0)},${qy(0)} ${qx(3)},${qy(0)} ${qx(3)},${qy(2)}`
    : `${qx(0)},${qy(0)} ${qx(0)},${qy(2)} ${qx(3)},${qy(2)}`;
  return (
    <LevelFig label="効くのは電場方向に進んだ分だけ">
      <QField opacity={0.4} rows={[52, 88]} />
      <polyline points={pts} fill="none" stroke={L.path} strokeWidth={3} />
      <line x1={qx(0)} y1={qy(0)} x2={qx(0)} y2={156} stroke={L.dim} strokeDasharray="3 3" />
      <line x1={qx(3)} y1={qy(2)} x2={qx(3)} y2={156} stroke={L.dim} strokeDasharray="3 3" />
      <Arw x={qx(0)} y={150} dx={qx(3) - qx(0)} dy={0} color={L.plus} w={3.4} head={9} />
      <Lbl x={qx(1.5)} y={142} text="x 方向に 3 m" color={L.plus} size={10.5} anchor="middle" />
      <QEnds />
      <Lbl x={16} y={22} text={which === 0 ? '道1' : '道2'} color={L.focus} size={11.5} bold />
      <Lbl x={16} y={40} text="上下の移動は電場と直角" color={L.dim} size={10.5} />
      <Lbl x={16} y={58} text="→ 仕事に入らない" color={L.dim} size={10.5} />
      <Cap text="道を切り替えても、下の黄緑の長さは変わらない" />
    </LevelFig>
  );
}

/** 静電場では、一周した線積分が0になる。 */
export function LoopZero() {
  const t = useT();
  const legs = [
    { pts: [[0, 0], [3, 0]], val: 24 },
    { pts: [[3, 0], [3, 2]], val: 0 },
    { pts: [[3, 2], [0, 2]], val: -24 },
    { pts: [[0, 2], [0, 0]], val: 0 },
  ];
  const shown = Math.min(step(t, 5, 0.95), 4);
  const total = legs.slice(0, shown).reduce((a, l) => a + l.val, 0);
  return (
    <LevelFig label="静電場では一周の線積分がゼロ">
      <QField opacity={0.35} rows={[86]} />
      {legs.map((l, i) => {
        const [a, b] = l.pts;
        const on = i === shown - 1;
        const done = i < shown;
        return (
          <Arw key={i} x={qx(a[0])} y={qy(a[1])} dx={qx(b[0]) - qx(a[0])} dy={qy(b[1]) - qy(a[1])}
            color={on ? L.focus : done ? (l.val > 0 ? L.plus : l.val < 0 ? L.minus : L.dim) : L.dim}
            w={done ? 3.4 : 1.6} head={done ? 9 : 6} />
        );
      })}
      <Lbl x={qx(1.5)} y={qy(0) + 18} text={shown >= 1 ? '+24 J' : ''} color={L.plus} size={11} anchor="middle" />
      <Lbl x={qx(3) + 8} y={qy(1)} text={shown >= 2 ? '0 J' : ''} color={L.dim} size={11} />
      <Lbl x={qx(1.5)} y={qy(2) - 8} text={shown >= 3 ? '−24 J' : ''} color={L.minus} size={11} anchor="middle" />
      <Lbl x={qx(0) - 8} y={qy(1)} text={shown >= 4 ? '0 J' : ''} color={L.dim} size={11} anchor="end" />
      <Lbl x={16} y={22} text={`一周の合計 = ${total} J`} color={L.focus} size={12} bold />
      <Lbl x={16} y={158} text="静電場（電荷配置が時間変化しない）のとき" color={L.dim} size={10} />
      <Cap text="行きで得た分を、帰りでちょうど返している" />
    </LevelFig>
  );
}

/** W_AB = q ∫ E·dr。 */
export function WorkAB() {
  const t = useT();
  const u = pingPong(t, 6);
  return (
    <LevelFig label="電場が電荷にする仕事">
      <QField opacity={0.5} rows={[46, 96]} />
      <polyline points={`${qx(0)},${qy(0)} ${qx(3)},${qy(0)} ${qx(3)},${qy(2)}`} fill="none" stroke={L.path} strokeWidth={3} />
      <QEnds />
      <circle cx={qx(3 * Math.min(1, u * 2))} cy={u < 0.5 ? qy(0) : qy(2 * (u - 0.5) * 2)} r={7} fill={L.plus} opacity={0.9} />
      <Lbl x={16} y={22} text="電場が電荷にする仕事" color={L.text} size={11.5} />
      <Lbl x={16} y={44} text="W AB = q ∫ E · dr" color={L.focus} size={12.5} bold />
      <Lbl x={16} y={62} text="A から B まで、道に沿って足す" color={L.dim} size={10} />
      <Lbl x={16} y={158} text="q は定数なので、積分の外に出せる" color={L.dim} size={10.5} />
      <Cap text="黄の道の上を、電荷が A から B へ運ばれる" />
    </LevelFig>
  );
}

/** ΔU = −W。仕事をした分だけ位置エネルギーが減る。 */
export function EnergyChange() {
  const t = useT();
  const u = pingPong(t, 5);
  const top = 46, bottom = 130;
  const h = top + (bottom - top) * u;
  return (
    <LevelFig label="電場が仕事をすると位置エネルギーが減る">
      <line x1={60} y1={bottom} x2={272} y2={bottom} stroke={L.dim} strokeWidth={1.4} />
      <rect x={96} y={h} width={40} height={bottom - h} fill={L.minus} opacity={0.35} />
      <Lbl x={116} y={h - 8} text="U" color={L.minus} size={12} anchor="middle" bold />
      <Arw x={116} y={h + 6} dx={0} dy={22} color={L.minus} w={2.4} head={7} />
      <rect x={196} y={bottom - (h - top)} width={40} height={Math.max(h - top, 1)} fill={L.plus} opacity={0.35} />
      <Lbl x={216} y={bottom - (h - top) - 8} text="W" color={L.plus} size={12} anchor="middle" bold />
      <Lbl x={16} y={22} text="電場がした仕事の分だけ" color={L.text} size={11} />
      <Lbl x={16} y={40} text="位置エネルギーは減る" color={L.text} size={11} />
      <Lbl x={16} y={62} text="ΔU = −W AB" color={L.focus} size={12.5} bold />
      <Lbl x={116} y={152} text="位置エネルギー" color={L.minus} size={10} anchor="middle" />
      <Lbl x={216} y={152} text="電場がした仕事" color={L.plus} size={10} anchor="middle" />
      <Cap text="紫が減った分、黄緑が出ていった分。大きさは等しい" />
    </LevelFig>
  );
}

/** ΔV = ΔU / q。1 Cあたりに直す。 */
export function PotentialDef() {
  const t = useT();
  const phase = step(t, 3, 1.3);
  const rows = [
    { left: '位置エネルギーの変化', right: 'ΔU = −24 J', color: L.minus },
    { left: '電荷で割る', right: '÷ q = 2 C', color: L.text },
    { left: '電位差（1 Cあたり）', right: 'ΔV = −12 V', color: L.focus },
  ];
  return (
    <LevelFig label="位置エネルギーを電荷で割ると電位差">
      {rows.map((row, i) => (
        <g key={row.left} opacity={i <= phase ? 1 : 0.18}>
          <rect x={30} y={36 + i * 34} width={260} height={26} rx={6} fill={row.color} opacity={i === phase ? 0.24 : 0.1} />
          <Lbl x={42} y={54 + i * 34} text={row.left} color={L.text} size={11} />
          <Lbl x={278} y={54 + i * 34} text={row.right} color={row.color} size={11.5} anchor="end" bold={i === 2} />
        </g>
      ))}
      <Lbl x={160} y={156} text="単位は J / C = V。電荷によらない量になる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="電荷で割ると、電荷の大きさによらない量になる" />
    </LevelFig>
  );
}

/** 2つの式を代入すると q が消える。 */
export function PotentialFormula() {
  const t = useT();
  const phase = step(t, 3, 1.5);
  return (
    <LevelFig label="代入すると電荷が約分されて消える">
      <g opacity={phase >= 0 ? 1 : 0.2}>
        <Lbl x={30} y={44} text="ΔV = ΔU / q" color={L.text} size={13} />
      </g>
      <g opacity={phase >= 1 ? 1 : 0.2}>
        <Lbl x={30} y={78} text="ΔU = − W AB = −" color={L.field} size={12.5} />
        <Lbl x={148} y={78} text="q" color={L.focus} size={12.5} bold />
        <Lbl x={162} y={78} text="∫ E · dr" color={L.field} size={12.5} />
        {phase >= 1 && <line x1={30} y1={94} x2={252} y2={94} stroke={L.dim} strokeWidth={1} strokeDasharray="4 3" />}
      </g>
      <g opacity={phase >= 2 ? 1 : 0.2}>
        <Lbl x={30} y={118} text="V B − V A = − ∫ E · dr" color={L.focus} size={14} bold />
        <Lbl x={30} y={138} text="q が約分されて消える" color={L.dim} size={10.5} />
      </g>
      {phase >= 2 && (
        <g>
          <line x1={143} y1={68} x2={159} y2={84} stroke={L.minus} strokeWidth={2} />
          <line x1={159} y1={68} x2={143} y2={84} stroke={L.minus} strokeWidth={2} />
        </g>
      )}
      <Lbl x={160} y={158} text="静電場のときだけ、位置だけの差として使える" color={L.minus} size={10.5} anchor="middle" />
      <Cap text="上から順に代入し、最後に q が消えることを見る" />
    </LevelFig>
  );
}

/** 単位の連鎖: N/C × m = J/C = V。 */
export function VoltUnits() {
  const t = useT();
  const phase = step(t, 4, 1.2);
  const rows = [
    { left: '電場 × 距離', right: 'N/C × m', color: L.field },
    { left: 'まとめる', right: 'N·m / C', color: L.field },
    { left: 'N·m = J', right: 'J / C', color: L.plus },
    { left: 'J/C に付けた別名', right: 'V（ボルト）', color: L.focus },
  ];
  return (
    <LevelFig label="電場の単位から電位差の単位へ">
      {rows.map((row, i) => (
        <g key={row.left} opacity={i <= phase ? 1 : 0.18}>
          <rect x={30} y={28 + i * 30} width={260} height={24} rx={6} fill={row.color} opacity={i === phase ? 0.24 : 0.1} />
          <Lbl x={42} y={45 + i * 30} text={row.left} color={L.text} size={11} />
          <Lbl x={278} y={45 + i * 30} text={row.right} color={row.color} size={11.5} anchor="end" bold={i === 3} />
        </g>
      ))}
      <Lbl x={160} y={160} text="4 N/C × 3 m = 12 V" color={L.focus} size={12} anchor="middle" bold />
      <Cap text="だから電場の単位は V/m とも書ける" />
    </LevelFig>
  );
}

/** 電位を標高として読む。等電位面は電場と直交する。 */
export function PotentialAsHeight() {
  const t = useT();
  const u = pingPong(t, 6);
  const vs = [0, -4, -8, -12];
  const label = (v: number) => `${v < 0 ? "−" : ""}${Math.abs(v)} V`;
  return (
    <LevelFig label="電位を標高のように読む">
      {vs.map((v, i) => (
        <g key={v}>
          <line x1={qx(i)} y1={34} x2={qx(i)} y2={134} stroke={L.normal} strokeWidth={1.4} opacity={0.5} strokeDasharray="4 4" />
          <Lbl x={qx(i)} y={148} text={label(v)} color={L.normal} size={10.5} anchor="middle" />
        </g>
      ))}
      <QField rows={[50, 96]} opacity={0.85} />
      <circle cx={qx(3 * u)} cy={120} r={8} fill={L.plus} opacity={0.9} />
      <Lbl x={qx(3 * u)} y={124} text="q" color="#0b1020" size={11} anchor="middle" bold />
      <Lbl x={64} y={22} text="ΔV = −W/q = −24/2 = −12 V" color={L.focus} size={12} bold />
      <Lbl x={16} y={162} text="破線は等電位面。電場の矢印と直交する" color={L.dim} size={10} />
      <Cap text="右へ進むほど電位が下がる。標高と同じ読み方" />
    </LevelFig>
  );
}

/** 磁場が時間変化すると、一周が0でなくなる。 */
export function ChangingBWarning() {
  const t = useT();
  const grow = 0.4 + 0.6 * pingPong(t, 4);
  const marks = [[0.7, 0.6], [1.5, 0.6], [2.3, 0.6], [0.7, 1.4], [1.5, 1.4], [2.3, 1.4]];
  return (
    <LevelFig label="磁場が時間変化すると一周がゼロでなくなる">
      <polyline points={`${qx(0)},${qy(0)} ${qx(3)},${qy(0)} ${qx(3)},${qy(2)} ${qx(0)},${qy(2)} ${qx(0)},${qy(0)}`}
        fill="none" stroke={L.path} strokeWidth={2.6} />
      <Arw x={qx(1.4)} y={qy(0)} dx={22} dy={0} color={L.path} w={2.6} head={8} />
      {marks.map(([mx, my], i) => (
        <g key={i}>
          <circle cx={qx(mx)} cy={qy(my)} r={4 + 4 * grow} fill="none" stroke={L.field} strokeWidth={1.6} />
          <line x1={qx(mx) - 3} y1={qy(my) - 3} x2={qx(mx) + 3} y2={qy(my) + 3} stroke={L.field} strokeWidth={1.4} />
          <line x1={qx(mx) - 3} y1={qy(my) + 3} x2={qx(mx) + 3} y2={qy(my) - 3} stroke={L.field} strokeWidth={1.4} />
        </g>
      ))}
      <Lbl x={16} y={22} text="B が時間とともに増えていく" color={L.field} size={11} />
      <Lbl x={16} y={40} text="→ 一周の線積分が 0 でなくなる" color={L.minus} size={11} />
      <Lbl x={16} y={162} text="位置だけの電位を、同じ形では置けない" color={L.minus} size={10} />
      <Cap text="印の大きさが、時間変化する磁場を表す" />
    </LevelFig>
  );
}

// ===================== 4. 面積ベクトル =====================

/** 面は横から見る。磁場は右向きで一様（0.5 T）。 */
function BBackdrop({ rows = [42, 74, 106, 138], xs = [20, 54, 236, 270], len = 28, opacity = 0.9 }: {
  rows?: number[]; xs?: number[]; len?: number; opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      {rows.flatMap(y => xs.map(x => (
        <Arw key={`${x}-${y}`} x={x} y={y} dx={len} dy={0} color={L.field} w={1.9} head={6} />
      )))}
    </g>
  );
}

/** 曲がった面。法線の向きが 0°, 60°, 90°, 120° と変わる4枚。 */
const CURVE_TILES = (() => {
  const angs = [0, 60, 90, 120];
  const len = 34;
  let x = 112, y = 44;
  return angs.map(a => {
    const tx = Math.sin(a * RAD), ty = Math.cos(a * RAD);
    const cx = x + (tx * len) / 2, cy = y + (ty * len) / 2;
    const ex = x + tx * len, ey = y + ty * len;
    const seg = { ndeg: a, cx, cy, len, x0: x, y0: y, x1: ex, y1: ey, cos: Math.cos(a * RAD) };
    x = ex; y = ey;
    return { ...seg, flux: 0.5 * seg.cos * 0.2 };
  });
})();

/** 平らな面。4枚とも法線が右向き。 */
const FLAT_TILES = [0, 1, 2, 3].map(i => ({ cx: 164, cy: 52 + i * 26, ndeg: 0, len: 26 }));

/** 1枚のタイルの磁束は「貫く成分 × 面積」。 */
export function OneTileFlux() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="1枚のタイルを貫く磁束">
      <BBackdrop rows={[54, 90, 126]} xs={[36, 74, 216, 254]} />
      <g opacity={glow}>
        <EdgeTile cx={162} cy={90} ndeg={0} len={72} active />
      </g>
      <Normal cx={162} cy={90} ndeg={0} len={30} />
      <Lbl x={196} y={84} text="n" color={L.normal} size={12} bold />
      <Lbl x={162} y={46} text="ΔA = 0.2 m²" color={L.focus} size={11} anchor="middle" />
      <Lbl x={16} y={24} text="B = 0.5 T が、面を垂直に貫く" color={L.field} size={11} />
      <RightAngle x={162} y={90} a={0} b={90} size={10} />
      <Lbl x={16} y={146} text="ΔΦ = 0.5 × 0.2 = 0.1 Wb" color={L.focus} size={12.5} bold />
      <Lbl x={16} y={162} text="T·m² に付けた別名が Wb" color={L.dim} size={10} />
      <Cap text="金の帯が面、白い矢印が面に垂直な向き" />
    </LevelFig>
  );
}

/** 小タイルは、広さと向きの2つで決まる。 */
export function TileTwoFacts() {
  const t = useT();
  const which = step(t, 2, 1.6);
  return (
    <LevelFig label="小タイルを決めるのは広さと向きの2つ">
      <EdgeTile cx={132} cy={92} ndeg={20} len={80} active={which === 0} />
      <g opacity={which === 1 ? 1 : 0.3}>
        <Normal cx={132} cy={92} ndeg={20} len={34} />
      </g>
      <line x1={132 - Math.sin(20 * RAD) * 40} y1={92 - Math.cos(20 * RAD) * 40}
        x2={132 + Math.sin(20 * RAD) * 40} y2={92 + Math.cos(20 * RAD) * 40}
        stroke={which === 0 ? L.focus : L.dim} strokeWidth={which === 0 ? 2.4 : 1.2} strokeDasharray="3 3" />
      <rect x={196} y={44} width={96} height={30} rx={6} fill={L.focus} opacity={which === 0 ? 0.28 : 0.08} />
      <Lbl x={244} y={58} text="広さ" color={L.text} size={10.5} anchor="middle" />
      <Lbl x={244} y={70} text="ΔA [m²]" color={L.focus} size={10.5} anchor="middle" />
      <rect x={196} y={84} width={96} height={30} rx={6} fill={L.normal} opacity={which === 1 ? 0.28 : 0.08} />
      <Lbl x={244} y={98} text="向き" color={L.text} size={10.5} anchor="middle" />
      <Lbl x={244} y={110} text="法線 n" color={L.normal} size={10.5} anchor="middle" />
      <Lbl x={16} y={24} text="この2つだけで、1枚が決まる" color={L.text} size={11.5} />
      <Lbl x={16} y={158} text="ΔA は向きを持たない正の数" color={L.dim} size={10.5} />
      <Cap text="右の2つの札が、交互に光ることを見てください" />
    </LevelFig>
  );
}

/** 法線は大きさ1の、向き専用の矢印。 */
export function NormalIntro() {
  const t = useT();
  const ndeg = 50 * pingPong(t, 7) - 10;
  return (
    <LevelFig label="法線は大きさ1の向き専用の矢印">
      <EdgeTile cx={150} cy={92} ndeg={ndeg} len={76} />
      <Normal cx={150} cy={92} ndeg={ndeg} len={40} />
      <RightAngle x={150} y={92} a={ndeg} b={ndeg + 90} size={11} />
      <line x1={230} y1={62} x2={230} y2={102} stroke={L.normal} strokeWidth={2} />
      <line x1={226} y1={62} x2={234} y2={62} stroke={L.normal} strokeWidth={2} />
      <line x1={226} y1={102} x2={234} y2={102} stroke={L.normal} strokeWidth={2} />
      <Lbl x={238} y={86} text="大きさ 1" color={L.normal} size={10.5} />
      <Lbl x={16} y={24} text="面をどう傾けても" color={L.text} size={11.5} />
      <Lbl x={16} y={42} text="法線は面と直角のまま" color={L.text} size={11.5} />
      <Lbl x={16} y={152} text="|n| = 1。運ぶのは向きの情報だけ" color={L.dim} size={10.5} />
      <Cap text="白い矢印の長さは変わらない。角度だけが変わる" />
    </LevelFig>
  );
}

/** 傾けると貫く量が減る。 */
export function TileDotNormal() {
  const t = useT();
  const th = 78 * pingPong(t, 8);
  const cx = 150, cy = 96;
  const [nx, ny] = dir(th);
  const blen = 75;
  const proj = 0.5 * Math.cos(th * RAD);
  return (
    <LevelFig label="面を傾けると貫く量が減る">
      <EdgeTile cx={cx} cy={cy} ndeg={th} len={72} />
      <Normal cx={cx} cy={cy} ndeg={th} len={46} />
      <Arw x={cx} y={cy} dx={blen} dy={0} color={L.field} w={3} head={8} />
      <Lbl x={cx + blen + 4} y={cy + 4} text="B" color={L.field} size={12} bold />
      <line x1={cx + blen} y1={cy} x2={cx + nx * blen * Math.cos(th * RAD)} y2={cy + ny * blen * Math.cos(th * RAD)}
        stroke={L.dim} strokeDasharray="3 3" strokeWidth={1.3} />
      <Arw x={cx} y={cy} dx={nx * blen * Math.cos(th * RAD)} dy={ny * blen * Math.cos(th * RAD)}
        color={L.plus} w={4} head={8} />
      <path d={`M ${cx + 26} ${cy} A 26 26 0 0 0 ${cx + 26 * nx} ${cy + 26 * ny}`} fill="none" stroke={L.dim} strokeWidth={1.2} />
      <Lbl x={cx + 30} y={cy + 20} text={`θ = ${Math.round(th)}°`} color={L.dim} size={10.5} />
      <Lbl x={16} y={24} text="面に沿う成分は、1本も貫かない" color={L.text} size={11} />
      <Lbl x={16} y={152} text={`貫く成分 = 0.5 × cos θ = ${fmt(proj, 2)} T`} color={L.plus} size={11.5} bold />
      <Cap text="点線が投影。黄緑が実際に貫く成分" />
    </LevelFig>
  );
}

/** 大きさ1の法線との内積が、垂直成分そのもの。 */
export function UnitNormalWhy() {
  const t = useT();
  const th = 50;
  const cx = 140, cy = 96;
  const [nx, ny] = dir(th);
  const blen = 78;
  const phase = step(t, 2, 1.6);
  return (
    <LevelFig label="大きさ1の法線との内積が垂直成分">
      <EdgeTile cx={cx} cy={cy} ndeg={th} len={76} />
      <Normal cx={cx} cy={cy} ndeg={th} len={40} />
      <Arw x={cx} y={cy} dx={blen} dy={0} color={L.field} w={3} head={8} />
      <g opacity={phase === 1 ? 1 : 0.25}>
        <line x1={cx + blen} y1={cy} x2={cx + nx * blen * Math.cos(th * RAD)} y2={cy + ny * blen * Math.cos(th * RAD)}
          stroke={L.dim} strokeDasharray="3 3" strokeWidth={1.3} />
        <Arw x={cx} y={cy} dx={nx * blen * Math.cos(th * RAD)} dy={ny * blen * Math.cos(th * RAD)}
          color={L.plus} w={4.2} head={8} />
      </g>
      <Lbl x={16} y={24} text="B · n = |B| |n| cos θ" color={L.text} size={11.5} />
      <Lbl x={16} y={44} text="|n| = 1 なので" color={L.dim} size={10.5} />
      <Lbl x={16} y={62} text="B · n = |B| cos θ" color={L.plus} size={12} bold />
      <Lbl x={214} y={140} text="= 垂直成分そのもの" color={L.plus} size={10.5} anchor="middle" />
      <Lbl x={16} y={158} text="広さの情報は ΔA が別に持つ" color={L.dim} size={10.5} />
      <Cap text="黄緑の矢印が B·n。法線の長さは掛からない" />
    </LevelFig>
  );
}

/** 法線に面積を掛けて、向き付き面積を作る。 */
export function CombineIntoArrow() {
  const t = useT();
  const u = pingPong(t, 5);
  const cx = 166, cy = 96, th = 35;
  const len = 22 + 34 * u;
  return (
    <LevelFig label="法線に面積を掛けて向き付き面積を作る">
      <EdgeTile cx={cx} cy={cy} ndeg={th} len={76} />
      <Normal cx={cx} cy={cy} ndeg={th} len={22} color={L.dim} w={1.8} />
      <Normal cx={cx} cy={cy} ndeg={th} len={len} color={L.focus} w={3.4} />
      <Lbl x={16} y={24} text="向きは法線と同じ" color={L.text} size={11.5} />
      <Lbl x={16} y={42} text="大きさを面積 ΔA にする" color={L.text} size={11.5} />
      <Lbl x={16} y={64} text="ΔA ベクトル = n ΔA" color={L.focus} size={12.5} bold />
      <Lbl x={214} y={56} text="灰: n（大きさ1）" color={L.dim} size={10} />
      <Lbl x={214} y={74} text="金: ΔA ベクトル" color={L.focus} size={10} />
      <Lbl x={16} y={158} text="矢印1本で、タイル1枚を表せる" color={L.dim} size={10.5} />
      <Cap text="灰の矢印が伸びて、長さが面積になる" />
    </LevelFig>
  );
}

/** ΔA と ΔA ベクトルの違い。 */
export function DaVsVecDa() {
  const t = useT();
  const which = step(t, 2, 1.8);
  return (
    <LevelFig label="面積そのものと、向き付き面積">
      <line x1={160} y1={30} x2={160} y2={140} stroke={L.dim} strokeDasharray="4 4" strokeWidth={1} />
      <g opacity={which === 0 ? 1 : 0.35}>
        <rect x={44} y={58} width={56} height={40} fill={L.field} opacity={0.35} stroke={L.dim} strokeWidth={1.2} />
        <Lbl x={72} y={82} text="0.2" color={L.text} size={13} anchor="middle" bold />
        <Lbl x={72} y={44} text="ΔA" color={L.field} size={13} anchor="middle" bold />
        <Lbl x={72} y={118} text="面積そのもの" color={L.dim} size={10} anchor="middle" />
        <Lbl x={72} y={132} text="向きを持たない正の数" color={L.dim} size={9.5} anchor="middle" />
      </g>
      <g opacity={which === 1 ? 1 : 0.35}>
        <EdgeTile cx={212} cy={84} ndeg={0} len={44} />
        <Normal cx={212} cy={84} ndeg={0} len={44} color={L.focus} w={3.4} />
        <Lbl x={236} y={44} text="ΔA ベクトル" color={L.focus} size={12} anchor="middle" bold />
        <Lbl x={236} y={118} text="向きを持つ矢印" color={L.dim} size={10} anchor="middle" />
        <Lbl x={236} y={132} text="大きさが ΔA" color={L.dim} size={9.5} anchor="middle" />
      </g>
      <Lbl x={16} y={24} text="矢印が付くかどうかで、別の量" color={L.text} size={11} />
      <Cap text="左は数、右は矢印。書き分けを省略しない" />
    </LevelFig>
  );
}

/** 寄与は B と向き付き面積の内積。 */
export function TileFluxVector() {
  const t = useT();
  const glow = 0.55 + 0.3 * Math.sin(3 * t);
  const cx = 146, cy = 94, th = 40;
  const [nx, ny] = dir(th);
  const alen = 52, blen = 76;
  return (
    <LevelFig label="小タイルの寄与は磁場と向き付き面積の内積">
      <EdgeTile cx={cx} cy={cy} ndeg={th} len={70} />
      <Arw x={cx} y={cy} dx={blen} dy={0} color={L.field} w={3} head={8} />
      <Lbl x={cx + blen + 4} y={cy + 4} text="B" color={L.field} size={12} bold />
      <g opacity={glow}>
        <Arw x={cx} y={cy} dx={nx * alen} dy={ny * alen} color={L.focus} w={3.4} head={9} />
      </g>
      <Lbl x={cx + nx * alen + 4} y={cy + ny * alen - 4} text="ΔA ベクトル" color={L.focus} size={10.5} />
      <path d={`M ${cx + 24} ${cy} A 24 24 0 0 0 ${cx + 24 * nx} ${cy + 24 * ny}`} fill="none" stroke={L.dim} strokeWidth={1.2} />
      <Lbl x={cx + 28} y={cy - 10} text="θ" color={L.dim} size={10.5} />
      <Lbl x={16} y={24} text="2本の矢印の内積を1回とる" color={L.text} size={11.5} />
      <Lbl x={16} y={150} text="ΔΦ = B · ΔA ベクトル" color={L.focus} size={12.5} bold />
      <Lbl x={16} y={164 - 2} text="展開すれば B · n ΔA と同じ" color={L.dim} size={10} />
      <Cap text="水色と金の2本だけで、寄与が決まる" />
    </LevelFig>
  );
}

/** 表裏の決め方を変えると、符号が一斉に反転する。 */
export function NormalSideChoice() {
  const t = useT();
  const flipped = step(t, 2, 2.0) === 1;
  const ndeg = flipped ? 180 : 0;
  return (
    <LevelFig label="法線を反対にすると符号が反転する">
      <BBackdrop rows={[50, 92, 134]} xs={[34, 72, 220, 258]} />
      <EdgeTile cx={158} cy={92} ndeg={0} len={72} active />
      <Normal cx={158} cy={92} ndeg={ndeg} len={34} color={flipped ? L.minus : L.plus} w={2.8} />
      <Lbl x={flipped ? 116 : 200} y={84} text="n" color={flipped ? L.minus : L.plus} size={12} anchor="middle" bold />
      <Lbl x={16} y={24} text={flipped ? '左側を表に決めた場合' : '右側を表に決めた場合'} color={L.text} size={11.5} />
      <Lbl x={16} y={148} text={flipped ? 'ΔΦ = −0.1 Wb' : 'ΔΦ = +0.1 Wb'} color={flipped ? L.minus : L.plus} size={12.5} bold />
      <Lbl x={178} y={148} text="磁場も面も同じまま" color={L.dim} size={10} />
      <Cap text="向きを決めずに、磁束の符号は言えない" />
    </LevelFig>
  );
}

/** 曲面ではタイルごとに法線の向きが違う。 */
export function CurvedNormals() {
  const t = useT();
  const pick = step(t, 4, 0.8);
  return (
    <LevelFig label="曲がった面では法線がタイルごとに違う">
      <BBackdrop rows={[36, 112, 138]} xs={[24, 58, 238, 272]} opacity={0.55} />
      <polyline
        points={CURVE_TILES.map(s => `${s.x0.toFixed(1)},${s.y0.toFixed(1)}`)
          .concat(`${CURVE_TILES[3].x1.toFixed(1)},${CURVE_TILES[3].y1.toFixed(1)}`).join(' ')}
        fill="none" stroke={L.dim} strokeWidth={1.2} strokeDasharray="4 4" />
      {CURVE_TILES.map((s, i) => (
        <g key={i}>
          <EdgeTile cx={s.cx} cy={s.cy} ndeg={s.ndeg} len={s.len} active={i === pick} />
          <Normal cx={s.cx} cy={s.cy} ndeg={s.ndeg} len={26} color={i === pick ? L.focus : L.normal} w={i === pick ? 2.8 : 2} />
        </g>
      ))}
      <Lbl x={16} y={24} text="面が曲がると、垂直な向きも1枚ごとに変わる" color={L.text} size={10.5} />
      <Lbl x={16} y={162} text="だから n には添字 i が要る" color={L.focus} size={11.5} />
      <Cap text="白い矢印が扇のように向きを変えることを見る" />
    </LevelFig>
  );
}

// ===================== 5. 有限和から面積分へ =====================

/** 平らな面なら、法線が全部同じで和が掛け算に退化する。 */
export function FlatTilesSum() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.85), 4);
  return (
    <LevelFig label="平らな面では4枚とも同じ値">
      <BBackdrop rows={[44, 78, 112, 142]} xs={[30, 68, 224, 262]} opacity={0.75} />
      {FLAT_TILES.map((tile, i) => (
        <g key={i}>
          <EdgeTile cx={tile.cx} cy={tile.cy} ndeg={0} len={tile.len} active={i < shown} />
          <Normal cx={tile.cx} cy={tile.cy} ndeg={0} len={22} color={i < shown ? L.normal : L.dim} />
          <Lbl x={tile.cx + 30} y={tile.cy + 4} text={i < shown ? '0.1 Wb' : ''} color={L.plus} size={10.5} />
        </g>
      ))}
      <Lbl x={16} y={24} text="法線が全部同じ向き（磁場と平行）" color={L.text} size={11} />
      <Lbl x={16} y={160} text={`合計 ${fmt(0.1 * shown, 2)} Wb（${shown} / 4 枚）`} color={L.focus} size={12} bold />
      <Cap text="どの枚も同じ値なので、和が掛け算1回になる" />
    </LevelFig>
  );
}

/** 曲面の4枚を1枚ずつ計算する。 */
export function CurvedEachTile() {
  const t = useT();
  const pick = step(t, 4, 1.4);
  const s = CURVE_TILES[pick];
  return (
    <LevelFig label="曲面のタイルを1枚ずつ計算する">
      <BBackdrop rows={[118, 140]} xs={[24, 58, 238, 272]} opacity={0.5} />
      {CURVE_TILES.map((c, i) => (
        <EdgeTile key={i} cx={c.cx} cy={c.cy} ndeg={c.ndeg} len={c.len} active={i === pick} />
      ))}
      <Normal cx={s.cx} cy={s.cy} ndeg={s.ndeg} len={30} color={L.focus} w={2.8} />
      <Arw x={s.cx} y={s.cy} dx={34} dy={0} color={L.field} w={2.4} head={7} />
      <Lbl x={212} y={44} text={`${pick + 1} 枚目`} color={L.text} size={11.5} bold />
      <Lbl x={212} y={62} text={`θ = ${s.ndeg}°`} color={L.dim} size={11} />
      <Lbl x={212} y={80} text={`cos θ = ${fmt(s.cos, 2)}`} color={L.dim} size={11} />
      <Lbl x={212} y={100} text={`ΔΦ = ${fmt(s.flux, 2)} Wb`}
        color={s.flux > 0 ? L.plus : s.flux < 0 ? L.minus : L.text} size={11.5} bold />
      <Lbl x={16} y={24} text="B = 0.5 T、ΔA = 0.2 m² は共通" color={L.field} size={10.5} />
      <Lbl x={16} y={162} text="違うのは、法線と磁場のなす角だけ" color={L.dim} size={10.5} />
      <Cap text="水色の矢印と白い矢印の角度が、値を決めている" />
    </LevelFig>
  );
}

/** 曲面の寄与を足し上げる。 */
export function CurvedTilesSum() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.9), 4);
  const total = CURVE_TILES.slice(0, shown).reduce((a, s) => a + s.flux, 0);
  return (
    <LevelFig label="曲面のタイルを足し合わせる">
      {CURVE_TILES.map((s, i) => (
        <g key={i}>
          <EdgeTile cx={s.cx} cy={s.cy} ndeg={s.ndeg} len={s.len} active={i < shown}
            color={s.flux < 0 ? L.minus : L.field} />
          {i < shown && (
            <Lbl x={s.cx + (i < 2 ? -8 : 8)} y={s.cy - 12} text={`${s.flux > 0 ? '+' : ''}${fmt(s.flux, 2)}`}
              color={s.flux > 0 ? L.plus : s.flux < 0 ? L.minus : L.dim} size={10.5}
              anchor={i < 2 ? 'end' : 'start'} bold />
          )}
        </g>
      ))}
      <BBackdrop rows={[124]} xs={[24, 60, 232, 268]} opacity={0.45} />
      <Lbl x={212} y={30} text="平らな面なら" color={L.dim} size={10} />
      <Lbl x={212} y={44} text="0.4 Wb" color={L.dim} size={11} />
      <Lbl x={212} y={62} text={shown === 4 ? '曲面は小さい' : ''} color={L.minus} size={10} />
      <Lbl x={16} y={146} text="0.1 + 0.05 + 0 − 0.05" color={L.text} size={11.5} />
      <Lbl x={16} y={164 - 2} text={`合計 ${fmt(total, 2)} Wb`} color={L.focus} size={12} bold />
      <Cap text="紫のタイルは負の寄与。裏側から貫いている" />
    </LevelFig>
  );
}

// ===================== 1・2 で追加する図 =====================

/** 有効な力 = |F| cosθ。道方向の成分だけを取り出す。 */
export function EffectiveForce() {
  const t = useT();
  const th = 10 + 60 * pingPong(t, 8);
  const ox = 96, oy = 116, flen = 92;
  const [fx, fy] = dir(th);
  const eff = Math.cos(th * RAD);
  return (
    <LevelFig label="力のうち道方向の成分だけが効く">
      <Arw x={40} y={oy} dx={236} dy={0} color={L.path} w={3} head={9} />
      <Lbl x={248} y={oy - 8} text="道の向き" color={L.path} size={10.5} anchor="middle" />
      <Arw x={ox} y={oy} dx={fx * flen} dy={fy * flen} color={L.field} w={3} head={9} />
      <Lbl x={ox + fx * flen + 6} y={oy + fy * flen - 4} text="F" color={L.field} size={12} bold />
      <line x1={ox + fx * flen} y1={oy + fy * flen} x2={ox + fx * flen} y2={oy + 20} stroke={L.dim} strokeDasharray="3 3" strokeWidth={1.3} />
      <Arw x={ox} y={oy + 20} dx={flen * eff} dy={0} color={L.plus} w={4.2} head={9} />
      <Lbl x={ox + flen * eff + 8} y={oy + 24} text="有効な力" color={L.plus} size={10.5} />
      <path d={`M ${ox + 30} ${oy} A 30 30 0 0 0 ${ox + 30 * fx} ${oy + 30 * fy}`} fill="none" stroke={L.dim} strokeWidth={1.2} />
      <Lbl x={ox + 34} y={oy - 6} text={`θ = ${Math.round(th)}°`} color={L.dim} size={10} />
      <Lbl x={16} y={26} text="道に垂直な成分は、仕事をしない" color={L.text} size={11} />
      <Lbl x={16} y={46} text={`有効な力 = |F| cos θ = ${fmt(eff, 2)} |F|`} color={L.plus} size={11.5} bold />
      <Cap text="点線が投影。黄緑の長さが道方向の成分" />
    </LevelFig>
  );
}

/** 小区間の仕事 = 有効な力 × 小移動の長さ。 */
export function WorkPieceCos() {
  const t = useT();
  const u = pingPong(t, 5);
  const x0 = 70, y = 96, eff = 44, span = 150;
  return (
    <LevelFig label="有効な力に小移動の長さを掛ける">
      <rect x={x0} y={y - eff} width={Math.max(span * u, 1)} height={eff} fill={L.focus} opacity={0.3} />
      <line x1={x0} y1={y - eff} x2={x0 + span} y2={y - eff} stroke={L.plus} strokeWidth={3} />
      <Lbl x={x0 - 6} y={y - eff / 2} text="有効な力" color={L.plus} size={10.5} anchor="end" />
      <Lbl x={x0 - 6} y={y - eff / 2 + 14} text="|F| cos θ" color={L.plus} size={10.5} anchor="end" />
      <Arw x={x0} y={y + 16} dx={span * u} dy={0} color={L.path} w={3} head={9} />
      <Lbl x={x0 + span / 2} y={y + 36} text="小移動の長さ |Δr|" color={L.path} size={10.5} anchor="middle" />
      <Lbl x={16} y={26} text="この2つを掛けると、小区間の仕事" color={L.text} size={11} />
      <Lbl x={16} y={152} text="ΔW = (|F| cos θ) |Δr|" color={L.focus} size={12.5} bold />
      <Cap text="金の面積が、その小区間でした仕事にあたる" />
    </LevelFig>
  );
}

/** この形に内積という名前を付ける。 */
export function DotDefinition() {
  const t = useT();
  const phase = step(t, 2, 1.8);
  return (
    <LevelFig label="この形に内積という名前を付ける">
      <g opacity={phase === 0 ? 1 : 0.3}>
        <rect x={26} y={44} width={268} height={34} rx={8} fill={L.plus} opacity={0.18} />
        <Lbl x={160} y={66} text="(|F| cos θ) × |Δr|" color={L.plus} size={14} anchor="middle" bold />
      </g>
      <Arw x={160} y={84} dx={0} dy={16} color={L.dim} w={2} head={7} />
      <g opacity={phase === 1 ? 1 : 0.3}>
        <rect x={26} y={106} width={268} height={34} rx={8} fill={L.focus} opacity={0.22} />
        <Lbl x={160} y={128} text="F · Δr" color={L.focus} size={16} anchor="middle" bold />
      </g>
      <Lbl x={16} y={26} text="同じ中身に、短い名前を付ける" color={L.text} size={11.5} />
      <Lbl x={160} y={156} text="F · Δr = |F| |Δr| cos θ（内積の定義）" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="上の式と下の式は、まったく同じ量を表す" />
    </LevelFig>
  );
}

/** 大きさどうしの積との違い。 */
export function NotJustProduct() {
  const t = useT();
  const th = 90 * pingPong(t, 7);
  const c = Math.cos(th * RAD);
  const full = 120;
  return (
    <LevelFig label="大きさの積と内積の違い">
      <rect x={70} y={44} width={full} height={22} rx={4} fill={L.dim} opacity={0.3} />
      <Lbl x={70 + full + 8} y={60} text="|F| |Δr|" color={L.dim} size={11} />
      <Lbl x={64} y={38} text="2本が揃ったときの最大値" color={L.dim} size={10} />
      <rect x={70} y={86} width={Math.max(full * Math.max(c, 0), 1)} height={22} rx={4} fill={L.focus} opacity={0.75} />
      <Lbl x={70 + full + 8} y={102} text="F · Δr" color={L.focus} size={11} bold />
      <Lbl x={64} y={80} text={`× cos θ（θ = ${Math.round(th)}°）`} color={L.focus} size={10} />
      <line x1={70 + full} y1={40} x2={70 + full} y2={112} stroke={L.dim} strokeDasharray="3 3" strokeWidth={1} />
      <Lbl x={16} y={26} text="内積はただの掛け算ではない" color={L.text} size={11.5} />
      <Lbl x={16} y={136} text={`cos θ = ${fmt(c, 2)}`} color={L.text} size={11} />
      <Lbl x={16} y={156} text="向きが揃っていない分だけ、値は小さくなる" color={L.dim} size={10.5} />
      <Cap text="上の帯が最大値、下の帯が実際の値" />
    </LevelFig>
  );
}

/** 道に沿って場が変わる。 */
export function VaryingFieldPath() {
  const t = useT();
  const s = pingPong(t, 6);
  const [mxm, mym] = CURVE(s);
  const [ex, ey] = EFN(mxm, mym);
  return (
    <LevelFig label="道に沿って力の大きさも向きも変わる">
      <SmoothPath />
      {Array.from({ length: 9 }, (_, i) => {
        const si = (i + 0.5) / 9;
        const [px, py] = CURVE(si);
        const [gx, gy] = EFN(px, py);
        return <Arw key={i} x={CM.x(px)} y={CM.y(py)} dx={gx * 13} dy={-gy * 13} color={L.field} w={1.7} head={5} />;
      })}
      <Dot x={CM.x(mxm)} y={CM.y(mym)} color={L.focus} r={4} />
      <Arw x={CM.x(mxm)} y={CM.y(mym)} dx={ex * 22} dy={-ey * 22} color={L.focus} w={3} head={8} />
      <Lbl x={64} y={22} text="場所ごとに、大きさも向きも変わる" color={L.text} size={11} />
      <Lbl x={210} y={62} text="いまの点の力" color={L.dim} size={10} />
      <Lbl x={210} y={80} text={`(${fmt(ex, 2)}, ${fmt(ey, 2)})`} color={L.focus} size={11.5} bold />
      <Lbl x={16} y={158} text="掛けるべき F が、1つに決まらない" color={L.minus} size={10.5} />
      <Cap text="金の点が動くと、金の矢印も変わることを見る" />
    </LevelFig>
  );
}

/** 曲線をN個の短い直線に分ける。 */
export function ChopIntoN() {
  const t = useT();
  const n = 8;
  const shown = Math.min(step(t, n + 1, 0.4), n);
  return (
    <LevelFig label="曲線をN個の短い直線に分ける">
      <SmoothPath dim />
      {Array.from({ length: shown }, (_, i) => (
        <line key={i} x1={cxs(i / n)} y1={cys(i / n)} x2={cxs((i + 1) / n)} y2={cys((i + 1) / n)}
          stroke={L.focus} strokeWidth={3.2} strokeLinecap="round" />
      ))}
      {Array.from({ length: n + 1 }, (_, i) => (
        <circle key={i} cx={cxs(i / n)} cy={cys(i / n)} r={i <= shown ? 2.6 : 1.4}
          fill={i <= shown ? L.focus : L.dim} />
      ))}
      <Lbl x={64} y={22} text="短く切れば、1本ずつはまっすぐ" color={L.text} size={11} />
      <Lbl x={212} y={64} text={`${shown} / ${n} 本`} color={L.focus} size={11.5} bold />
      <Lbl x={16} y={158} text="曲線 → 短い直線の集まり。これが最初の一手" color={L.dim} size={10.5} />
      <Cap text="薄い曲線の上に、金の直線が1本ずつ載っていく" />
    </LevelFig>
  );
}

/** F = qE を代入する。 */
export function SubstituteQE() {
  const t = useT();
  const phase = step(t, 3, 1.4);
  const rows = [
    { text: 'W = ∫C F · dr', color: L.plus },
    { text: 'F = q E を代入', color: L.field },
    { text: 'W = q ∫C E · dr', color: L.focus },
  ];
  return (
    <LevelFig label="力を電場で書き直す">
      {rows.map((row, i) => (
        <g key={row.text} opacity={i <= phase ? 1 : 0.2}>
          <rect x={30} y={40 + i * 36} width={260} height={28} rx={7} fill={row.color} opacity={i === phase ? 0.24 : 0.1} />
          <Lbl x={160} y={59 + i * 36} text={row.text} color={row.color} size={13} anchor="middle" bold={i === 2} />
        </g>
      ))}
      <Lbl x={16} y={26} text="q は定数なので、積分の外へ出せる" color={L.text} size={11} />
      <Lbl x={160} y={158} text="単位は N/C × C × m = J のまま" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="上から順に置き換わる。中身の操作は変わらない" />
    </LevelFig>
  );
}

// ===================== 5 で追加する図 =====================

/** 円弧の面。N枚のタイルに分ける。 */
function arcTiles(n: number) {
  const cx = 168, cy = 158, R = 92;
  const a0 = 38, a1 = 142;
  return Array.from({ length: n }, (_, i) => {
    const a = a0 + ((a1 - a0) * (i + 0.5)) / n;
    const [ux, uy] = dir(a);
    return { cx: cx + ux * R, cy: cy + uy * R, ndeg: a, len: ((a1 - a0) * RAD * R) / n };
  });
}

/** タイルを増やすと、1枚が小さくなる。 */
export function SumTilesN() {
  const t = useT();
  const counts = [4, 8, 16];
  const n = counts[step(t, counts.length, 1.6)];
  return (
    <LevelFig label="タイルの枚数を増やすと1枚が小さくなる">
      <BBackdrop rows={[40, 72, 104]} xs={[16, 48, 252, 284]} len={24} opacity={0.6} />
      {arcTiles(n).map((s, i) => (
        <g key={i}>
          <EdgeTile cx={s.cx} cy={s.cy} ndeg={s.ndeg} len={s.len} active={i % 2 === 0} />
          {n <= 8 && <Normal cx={s.cx} cy={s.cy} ndeg={s.ndeg} len={18} w={1.7} />}
        </g>
      ))}
      <Lbl x={16} y={24} text={`N = ${n} 枚`} color={L.text} size={12} bold />
      <Lbl x={16} y={128} text="1枚あたりの ΔA が小さくなる" color={L.dim} size={10.5} />
      <Lbl x={16} y={144} text="平らとみなす無理が減る" color={L.dim} size={10.5} />
      <Lbl x={160} y={162} text="合計はある値へ落ち着く" color={L.focus} size={11} anchor="middle" />
      <Cap text="4 → 8 → 16 と分けるほど、タイルが細かくなる" />
    </LevelFig>
  );
}

/** 極限に面積分の記号を付ける。 */
export function SurfaceIntegralSymbol() {
  const t = useT();
  const u = pingPong(t, 5);
  return (
    <LevelFig label="極限の和に面積分の記号を付ける">
      {arcTiles(24).map((s, i) => (
        <EdgeTile key={i} cx={s.cx} cy={s.cy} ndeg={s.ndeg} len={s.len} />
      ))}
      <g opacity={1 - u}>
        <Lbl x={160} y={44} text="Σ  B(r i) · n i ΔA i" color={L.field} size={12.5} anchor="middle" />
        <Lbl x={160} y={60} text="有限枚の和" color={L.dim} size={10} anchor="middle" />
      </g>
      <g opacity={u}>
        <Lbl x={160} y={44} text="∫S  B · dA" color={L.focus} size={15} anchor="middle" bold />
        <Lbl x={160} y={60} text="極限に付けた名前" color={L.dim} size={10} anchor="middle" />
      </g>
      <Lbl x={16} y={24} text="タイルを限りなく小さくした先" color={L.text} size={11} />
      <Cap text="Σ の表示が ∫S の表示へ入れ替わる" />
    </LevelFig>
  );
}

/** C は曲線、S は面。足す相手が違う。 */
export function CvsS() {
  return (
    <LevelFig label="曲線Cと面Sの違い">
      <line x1={160} y1={26} x2={160} y2={140} stroke={L.dim} strokeDasharray="4 4" strokeWidth={1} />
      <polyline points={Array.from({ length: 21 }, (_, i) => {
        const s = i / 20;
        return `${(30 + 100 * s).toFixed(1)},${(104 - 34 * Math.sin(Math.PI * s)).toFixed(1)}`;
      }).join(' ')} fill="none" stroke={L.path} strokeWidth={2.6} />
      <Arw x={68} y={86} dx={22} dy={-8} color={L.focus} w={3} head={8} />
      <Lbl x={80} y={44} text="曲線 C" color={L.path} size={12} anchor="middle" bold />
      <Lbl x={80} y={124} text="1次元。足す相手は" color={L.dim} size={10} anchor="middle" />
      <Lbl x={80} y={138} text="Δr ベクトル" color={L.focus} size={10.5} anchor="middle" />
      {arcTiles(6).map((s, i) => (
        <g key={i}>
          <EdgeTile cx={s.cx * 0.55 + 110} cy={s.cy * 0.45 + 30} ndeg={s.ndeg} len={s.len * 0.5} />
          <Normal cx={s.cx * 0.55 + 110} cy={s.cy * 0.45 + 30} ndeg={s.ndeg} len={14} w={1.6} />
        </g>
      ))}
      <Lbl x={240} y={44} text="面 S" color={L.field} size={12} anchor="middle" bold />
      <Lbl x={240} y={124} text="2次元。足す相手は" color={L.dim} size={10} anchor="middle" />
      <Lbl x={240} y={138} text="ΔA ベクトル" color={L.focus} size={10.5} anchor="middle" />
      <Cap text="どちらも「どこで足すか」を指す名札" />
    </LevelFig>
  );
}

/** dA と dA ベクトルの区別。 */
export function DaLimit() {
  const t = useT();
  const which = step(t, 2, 1.8);
  return (
    <LevelFig label="面積そのものと、法線を含む向き付き面積">
      <line x1={160} y1={30} x2={160} y2={136} stroke={L.dim} strokeDasharray="4 4" strokeWidth={1} />
      <g opacity={which === 0 ? 1 : 0.35}>
        <Lbl x={80} y={48} text="dA" color={L.field} size={16} anchor="middle" bold />
        <rect x={56} y={62} width={48} height={34} fill={L.field} opacity={0.35} stroke={L.dim} strokeWidth={1.1} />
        <Lbl x={80} y={116} text="面積そのもの" color={L.dim} size={10} anchor="middle" />
        <Lbl x={80} y={130} text="単位 m²、向きなし" color={L.dim} size={9.5} anchor="middle" />
      </g>
      <g opacity={which === 1 ? 1 : 0.35}>
        <Lbl x={240} y={48} text="dA ベクトル" color={L.focus} size={13} anchor="middle" bold />
        <EdgeTile cx={240} cy={86} ndeg={0} len={34} />
        <Normal cx={240} cy={86} ndeg={0} len={34} color={L.focus} w={3.2} />
        <Lbl x={240} y={116} text="法線を含む向き付き面積" color={L.dim} size={10} anchor="middle" />
        <Lbl x={240} y={130} text="大きさが dA" color={L.dim} size={9.5} anchor="middle" />
      </g>
      <Lbl x={16} y={24} text="矢印が付くかどうかで、別の量" color={L.text} size={11} />
      <Cap text="左は数、右は向きを持つ矢印" />
    </LevelFig>
  );
}

/** 面積分は面積を掛ける操作ではない。 */
export function NotAreaTimes() {
  const t = useT();
  const which = step(t, 2, 2.0);
  const cx = 160, cy = 92;
  const ndeg = which === 0 ? 0 : 90;
  return (
    <LevelFig label="面積を掛ける操作ではない">
      <BBackdrop rows={[56, 96, 136]} xs={[30, 66, 226, 262]} opacity={0.8} />
      <EdgeTile cx={cx} cy={cy} ndeg={ndeg} len={72} active />
      <Normal cx={cx} cy={cy} ndeg={ndeg} len={30} />
      {which === 1 && <RightAngle x={cx} y={cy} a={0} b={90} size={10} color={L.minus} />}
      <Lbl x={16} y={24} text={which === 0 ? '面が磁場に垂直' : '面が磁場と平行'} color={L.text} size={11} />
      <Lbl x={16} y={40} text="面積はどちらも 0.2 m² のまま" color={L.dim} size={10.5} />
      <Lbl x={16} y={150} text={which === 0 ? 'ΔΦ = 0.1 Wb' : 'ΔΦ = 0 Wb'}
        color={which === 0 ? L.plus : L.minus} size={13} bold />
      <Lbl x={160} y={164 - 2} text="選んでいるのは、法線方向の成分だけ" color={L.dim} size={10} anchor="middle" />
      <Cap text="面積が同じでも、向きが変われば値が変わる" />
    </LevelFig>
  );
}

/** ∮ と ∯ の使い分け。 */
export function OintVsOiint() {
  const t = useT();
  const u = pingPong(t, 5);
  return (
    <LevelFig label="閉じた道と閉じた面の記号">
      <line x1={160} y1={26} x2={160} y2={140} stroke={L.dim} strokeDasharray="4 4" strokeWidth={1} />
      <ellipse cx={80} cy={86} rx={46} ry={32} fill="none" stroke={L.path} strokeWidth={2.6} />
      {(() => {
        const a = 360 * u;
        const [ux, uy] = dir(a);
        const px = 80 + 46 * ux, py = 86 + 32 * uy;
        return <Arw x={px} y={py} dx={-uy * 16 * 1.4} dy={ux * 16} color={L.focus} w={2.6} head={7} />;
      })()}
      <OintGlyph x={80} y={44} size={20} color={L.path} />
      <Lbl x={80} y={136} text="閉じた道（輪1本）" color={L.dim} size={10} anchor="middle" />
      <circle cx={240} cy={88} r={34} fill={L.field} opacity={0.22} stroke={L.field} strokeWidth={1.6} />
      {[30, 90, 150, 210, 270, 330].map(a => {
        const [ux, uy] = dir(a);
        return <Arw key={a} x={240 + ux * 34} y={88 + uy * 34} dx={ux * 16} dy={uy * 16} color={L.normal} w={1.8} head={6} />;
      })}
      <OiintGlyph x={240} y={44} size={20} color={L.field} />
      <Lbl x={240} y={136} text="閉じた面（輪2本）" color={L.dim} size={10} anchor="middle" />
      <Lbl x={16} y={22} text="輪が1本か2本かで、道と面を区別する" color={L.text} size={10.5} />
      <Cap text="左は一周する道、右は袋の表面ぜんぶ" />
    </LevelFig>
  );
}

/** 開いた面に ∯ は使えない。 */
export function OpenVsClosedSurface() {
  const t = useT();
  const blink = 0.4 + 0.4 * Math.sin(3.2 * t);
  return (
    <LevelFig label="開いた面に閉曲面の記号は使えない">
      <line x1={160} y1={26} x2={160} y2={140} stroke={L.dim} strokeDasharray="4 4" strokeWidth={1} />
      <path d="M 36 108 Q 80 52 124 108" fill="none" stroke={L.field} strokeWidth={5} opacity={0.5} />
      <Dot x={36} y={108} color={L.minus} r={4} />
      <Dot x={124} y={108} color={L.minus} r={4} />
      <Lbl x={80} y={128} text="ふちがある（開いた面）" color={L.dim} size={10} anchor="middle" />
      <g opacity={blink}>
        <OiintGlyph x={80} y={48} size={18} color={L.minus} />
        <line x1={62} y1={50} x2={98} y2={26} stroke={L.minus} strokeWidth={2.4} />
      </g>
      <Lbl x={80} y={146} text="∫S と書く" color={L.plus} size={11} anchor="middle" bold />
      <circle cx={240} cy={84} r={32} fill={L.field} opacity={0.22} stroke={L.field} strokeWidth={2} />
      <Lbl x={240} y={128} text="ふちがない（閉じた面）" color={L.dim} size={10} anchor="middle" />
      <OiintGlyph x={240} y={48} size={18} color={L.plus} />
      <Lbl x={240} y={146} text="∮∮S と書ける" color={L.plus} size={11} anchor="middle" bold />
      <Lbl x={16} y={22} text="記号は、外向き法線の約束まで持ち込む" color={L.text} size={10.5} />
      <Cap text="左の赤い点がふち。ふちがあると内外を決められない" />
    </LevelFig>
  );
}

// ===================== 6. 閉曲面の電気束 =====================

/** 箱を横から見た断面。左右・上下の4面が見える。 */
const BOX = { x0: 116, x1: 216, y0: 50, y1: 124 };
const BOX_FACES = [
  { key: 'left', cx: BOX.x0, cy: (BOX.y0 + BOX.y1) / 2, ndeg: 180, len: BOX.y1 - BOX.y0, val: -2 },
  { key: 'right', cx: BOX.x1, cy: (BOX.y0 + BOX.y1) / 2, ndeg: 0, len: BOX.y1 - BOX.y0, val: 2 },
  { key: 'top', cx: (BOX.x0 + BOX.x1) / 2, cy: BOX.y0, ndeg: 90, len: BOX.x1 - BOX.x0, val: 0 },
  { key: 'bottom', cx: (BOX.x0 + BOX.x1) / 2, cy: BOX.y1, ndeg: 270, len: BOX.x1 - BOX.x0, val: 0 },
];

/** 一様な電場（右向き5 N/C）。初級と同じ水色・同じ向きで描く。 */
function EBackdrop({ rows = [66, 92, 118], opacity = 0.9 }: { rows?: number[]; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {rows.flatMap(y => [24, 62, 240, 278].map(x => (
        <Arw key={`${x}-${y}`} x={x} y={y} dx={30} dy={0} color={L.field} w={2} head={6} />
      )))}
    </g>
  );
}

function BoxOutline({ active }: { active?: string }) {
  return (
    <g>
      <rect x={BOX.x0} y={BOX.y0} width={BOX.x1 - BOX.x0} height={BOX.y1 - BOX.y0}
        fill={L.dim} opacity={0.12} stroke={L.dim} strokeWidth={1.4} />
      {BOX_FACES.map(f => (
        <EdgeTile key={f.key} cx={f.cx} cy={f.cy} ndeg={f.ndeg} len={f.len} active={active === f.key} />
      ))}
    </g>
  );
}

/** 閉じた面では法線を外向きにそろえる。 */
export function ClosedOutwardNormals() {
  const t = useT();
  const pick = step(t, BOX_FACES.length, 0.7);
  return (
    <LevelFig label="閉じた面では法線を外向きにそろえる">
      <BoxOutline active={BOX_FACES[pick].key} />
      {BOX_FACES.map((f, i) => (
        <Normal key={f.key} cx={f.cx} cy={f.cy} ndeg={f.ndeg} len={24}
          color={i === pick ? L.focus : L.normal} w={i === pick ? 2.8 : 2} />
      ))}
      <Lbl x={16} y={24} text="法線は、袋の外へ出る向きにそろえる" color={L.text} size={11} />
      <Lbl x={16} y={44} text="出る束が正、入る束が負" color={L.dim} size={10.5} />
      <Lbl x={16} y={162} text="この約束込みの記号が ∮∮" color={L.focus} size={11} />
      <Cap text="4本の白い矢印が、すべて外を向いていることを見る" />
    </LevelFig>
  );
}

/** 一様な電場の中に箱を置く。 */
export function BoxInUniformField() {
  const t = useT();
  const u = pingPong(t, 6);
  return (
    <LevelFig label="一様な電場の中に箱を置く">
      <EBackdrop />
      <BoxOutline />
      {[66, 92, 118].map(y => (
        <Arw key={y} x={BOX.x0 + 6} y={y} dx={(BOX.x1 - BOX.x0 - 12) * (0.4 + 0.6 * u)} dy={0}
          color={L.field} w={2} head={6} />
      ))}
      <Lbl x={16} y={24} text="E = (5, 0) N/C（どこでも同じ）" color={L.field} size={11} />
      <Lbl x={16} y={42} text="左右2面の面積はどちらも 0.4 m²" color={L.dim} size={10.5} />
      <Lbl x={16} y={162} text="電場は左右2面に垂直に当たる" color={L.dim} size={10.5} />
      <Lbl x={BOX.x0 - 8} y={BOX.y1 + 20} text="左面" color={L.normal} size={10} anchor="middle" />
      <Lbl x={BOX.x1 + 8} y={BOX.y1 + 20} text="右面" color={L.normal} size={10} anchor="middle" />
      <Cap text="矢印が箱を左から右へ通り抜けていく" />
    </LevelFig>
  );
}

/** 左面: 入ってくるので負。 */
export function BoxLeftFace() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="電場が入ってくる面の寄与は負">
      <EBackdrop opacity={0.6} />
      <BoxOutline active="left" />
      <g opacity={glow}>
        <Normal cx={BOX.x0} cy={92} ndeg={180} len={30} color={L.minus} w={3} />
      </g>
      <Lbl x={BOX.x0 - 34} y={74} text="n = (−1, 0)" color={L.minus} size={10.5} anchor="middle" />
      <Arw x={BOX.x0 - 54} y={110} dx={46} dy={0} color={L.field} w={2.6} head={8} />
      <Lbl x={16} y={24} text="外向き法線と電場が反対を向く" color={L.text} size={11} />
      <Lbl x={16} y={44} text="E · n = 5 ×(−1) = −5 N/C" color={L.minus} size={11} />
      <Lbl x={16} y={152} text="ΔΦ = −5 × 0.4 = −2 N·m²/C" color={L.minus} size={12} bold />
      <Cap text="紫が負の寄与。電場が箱へ入ってくる面" />
    </LevelFig>
  );
}

/** 右面: 出ていくので正。 */
export function BoxRightFace() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="電場が出ていく面の寄与は正">
      <EBackdrop opacity={0.6} />
      <BoxOutline active="right" />
      <g opacity={glow}>
        <Normal cx={BOX.x1} cy={92} ndeg={0} len={30} color={L.plus} w={3} />
      </g>
      <Lbl x={BOX.x1 + 36} y={74} text="n = (+1, 0)" color={L.plus} size={10.5} anchor="middle" />
      <Arw x={BOX.x1 + 8} y={110} dx={46} dy={0} color={L.field} w={2.6} head={8} />
      <Lbl x={16} y={24} text="外向き法線と電場が同じ向き" color={L.text} size={11} />
      <Lbl x={16} y={44} text="E · n = 5 × 1 = 5 N/C" color={L.plus} size={11} />
      <Lbl x={16} y={152} text="ΔΦ = 5 × 0.4 = +2 N·m²/C" color={L.plus} size={12} bold />
      <Cap text="電場は同じでも、法線が逆なので符号が反対" />
    </LevelFig>
  );
}

/** 上下・前後の面: 直角なので0。 */
export function BoxSideFaces() {
  const t = useT();
  const which = step(t, 2, 1.6);
  const key = which === 0 ? 'top' : 'bottom';
  const f = BOX_FACES.find(x => x.key === key)!;
  return (
    <LevelFig label="電場と直角な面の寄与はゼロ">
      <EBackdrop opacity={0.6} />
      <BoxOutline active={key} />
      <Normal cx={f.cx} cy={f.cy} ndeg={f.ndeg} len={28} color={L.focus} w={3} />
      <RightAngle x={f.cx} y={f.cy} a={0} b={f.ndeg} size={11} color={L.minus} />
      <Lbl x={16} y={24} text={which === 0 ? '上の面（前後の面も同じ）' : '下の面（前後の面も同じ）'} color={L.text} size={11} />
      <Lbl x={16} y={44} text="E · n = 5 × 0 = 0" color={L.dim} size={11} />
      <Lbl x={16} y={152} text="ΔΦ = 0 × 0.4 = 0" color={L.dim} size={12} bold />
      <Cap text="面に沿って走る電場は、その面を貫かない" />
    </LevelFig>
  );
}

/** 6面の合計は0。 */
export function BoxTotalZero() {
  const t = useT();
  const shown = Math.min(step(t, 7, 0.7), 6);
  const vals = [-2, 2, 0, 0, 0, 0];
  const total = vals.slice(0, shown).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="6面の寄与を全部足すとゼロ">
      <BoxOutline />
      <Normal cx={BOX.x0} cy={92} ndeg={180} len={22} color={shown >= 1 ? L.minus : L.dim} />
      <Normal cx={BOX.x1} cy={92} ndeg={0} len={22} color={shown >= 2 ? L.plus : L.dim} />
      <Normal cx={(BOX.x0 + BOX.x1) / 2} cy={BOX.y0} ndeg={90} len={22} color={shown >= 3 ? L.normal : L.dim} />
      <Normal cx={(BOX.x0 + BOX.x1) / 2} cy={BOX.y1} ndeg={270} len={22} color={shown >= 4 ? L.normal : L.dim} />
      <Lbl x={BOX.x0 - 30} y={96} text={shown >= 1 ? '−2' : ''} color={L.minus} size={12} anchor="middle" bold />
      <Lbl x={BOX.x1 + 30} y={96} text={shown >= 2 ? '+2' : ''} color={L.plus} size={12} anchor="middle" bold />
      <Lbl x={(BOX.x0 + BOX.x1) / 2} y={BOX.y0 - 28} text={shown >= 3 ? '0' : ''} color={L.dim} size={11.5} anchor="middle" />
      <Lbl x={(BOX.x0 + BOX.x1) / 2} y={BOX.y1 + 36} text={shown >= 4 ? '0' : ''} color={L.dim} size={11.5} anchor="middle" />
      <Lbl x={16} y={24} text={`${shown} / 6 面`} color={L.dim} size={10.5} />
      <Lbl x={16} y={44} text={`合計 ${total} N·m²/C`} color={L.focus} size={12.5} bold />
      <Lbl x={16} y={158} text={shown === 6 ? '入った分が、そのまま出ていった' : ''} color={L.dim} size={10.5} />
      <Cap text="前後の2面も直角で0。左右の−2と+2が相殺する" />
    </LevelFig>
  );
}

/** 束0でも、場は0ではない。 */
export function ZeroFluxNonzeroField() {
  const t = useT();
  const blink = 0.45 + 0.4 * Math.sin(3 * t);
  return (
    <LevelFig label="束がゼロでも電場はゼロではない">
      <EBackdrop />
      <BoxOutline />
      {[66, 92, 118].map(y => (
        <Arw key={y} x={BOX.x0 + 6} y={y} dx={BOX.x1 - BOX.x0 - 12} dy={0} color={L.field} w={2.4} head={7} />
      ))}
      <Lbl x={16} y={24} text="∮∮ E · dA = 0" color={L.focus} size={12} bold />
      <g opacity={blink}>
        <Lbl x={16} y={46} text="でも、箱の中の E は 5 N/C" color={L.minus} size={11.5} bold />
      </g>
      <Lbl x={160} y={152} text="0 になったのは、出入りの差だけ" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="箱の中にも水色の矢印がある。場は0ではない" />
    </LevelFig>
  );
}

/** 閉曲面の合計が表すのは、正味の出入りだけ。 */
export function NetOutflowMeaning() {
  const t = useT();
  const u = pingPong(t, 5);
  const x = BOX.x0 - 60 + (BOX.x1 - BOX.x0 + 120) * u;
  return (
    <LevelFig label="閉曲面の合計は正味の出入りを表す">
      <BoxOutline />
      <line x1={30} y1={92} x2={290} y2={92} stroke={L.field} strokeWidth={1.4} opacity={0.4} strokeDasharray="5 4" />
      <circle cx={x} cy={92} r={5} fill={L.field} />
      <Arw x={BOX.x0 - 52} y={68} dx={40} dy={0} color={L.minus} w={2.4} head={7} />
      <Lbl x={BOX.x0 - 32} y={60} text="入る（負）" color={L.minus} size={10} anchor="middle" />
      <Arw x={BOX.x1 + 12} y={68} dx={40} dy={0} color={L.plus} w={2.4} head={7} />
      <Lbl x={BOX.x1 + 32} y={60} text="出る（正）" color={L.plus} size={10} anchor="middle" />
      <Lbl x={16} y={24} text="入った分と出た分が、ちょうど相殺" color={L.text} size={11} />
      <Lbl x={160} y={144} text="合計0 = 正味の出入りが0" color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={160} y={162} text="中の場の値については、何も言っていない" color={L.dim} size={10} anchor="middle" />
      <Cap text="点が左から入り、右へ抜けていくことを見てください" />
    </LevelFig>
  );
}

// ===================== 7. 中心の点電荷と球面 =====================

const SPH = { cx: 152, cy: 88, r: 46 };
const SPH_ANGLES = [20, 70, 120, 170, 220, 270, 320];

/** 点電荷のまわりの電場は半径方向。 */
export function PointChargeRadial() {
  const t = useT();
  const u = pingPong(t, 5);
  return (
    <LevelFig label="点電荷のまわりの電場は半径方向">
      <circle cx={SPH.cx} cy={SPH.cy} r={10} fill={L.plus} opacity={0.9} />
      <Lbl x={SPH.cx} y={SPH.cy + 4} text="+" color="#0b1020" size={15} anchor="middle" bold />
      <Lbl x={SPH.cx + 14} y={SPH.cy + 18} text="Q" color={L.plus} size={11} />
      {SPH_ANGLES.map(a => {
        const [ux, uy] = dir(a);
        const start = 14 + 22 * u;
        return <Arw key={a} x={SPH.cx + ux * start} y={SPH.cy + uy * start}
          dx={ux * 24} dy={uy * 24} color={L.field} w={2.2} head={7} />;
      })}
      <Lbl x={16} y={22} text="どの向きにも、まっすぐ外へ出る" color={L.text} size={11} />
      <Lbl x={16} y={162} text="向きは半径方向。大きさは距離だけで決まる" color={L.dim} size={10.5} />
      <Cap text="矢印がすべて中心から外を向いていることを見る" />
    </LevelFig>
  );
}

/** 閉じた面として球面を選ぶ。 */
export function SphereChoice() {
  const t = useT();
  const pick = step(t, SPH_ANGLES.length, 0.55);
  return (
    <LevelFig label="閉じた面として球面を選ぶ">
      <circle cx={SPH.cx} cy={SPH.cy} r={SPH.r} fill={L.field} opacity={0.14} stroke={L.field} strokeWidth={1.8} />
      <circle cx={SPH.cx} cy={SPH.cy} r={8} fill={L.plus} opacity={0.9} />
      <Lbl x={SPH.cx} y={SPH.cy + 4} text="+" color="#0b1020" size={13} anchor="middle" bold />
      <line x1={SPH.cx} y1={SPH.cy} x2={SPH.cx + SPH.r} y2={SPH.cy} stroke={L.normal} strokeWidth={1.4} strokeDasharray="4 3" />
      <Lbl x={SPH.cx + SPH.r / 2} y={SPH.cy - 6} text="r" color={L.normal} size={11} anchor="middle" />
      {SPH_ANGLES.map((a, i) => {
        const [ux, uy] = dir(a);
        return <Normal key={a} cx={SPH.cx + ux * SPH.r} cy={SPH.cy + uy * SPH.r} ndeg={a} len={16}
          color={i === pick ? L.focus : L.normal} w={i === pick ? 2.6 : 1.8} />;
      })}
      <Lbl x={16} y={22} text="半径 r の球面を、閉じた面 S にとる" color={L.text} size={11} />
      <Lbl x={16} y={162} text="外向き法線も、中心から外への半径方向" color={L.dim} size={10.5} />
      <Cap text="白い矢印がすべて球の外を向いている" />
    </LevelFig>
  );
}

/** 球面上では、電場と法線が平行。 */
export function EParallelNormal() {
  const t = useT();
  const picks = [20, 70, 120, 170, 320];
  const a = picks[step(t, picks.length, 0.8)];
  const [ux, uy] = dir(a);
  const px = SPH.cx + ux * SPH.r, py = SPH.cy + uy * SPH.r;
  return (
    <LevelFig label="球面上では電場と法線が平行">
      <circle cx={SPH.cx} cy={SPH.cy} r={SPH.r} fill="none" stroke={L.dim} strokeWidth={1.4} strokeDasharray="4 4" />
      <circle cx={SPH.cx} cy={SPH.cy} r={8} fill={L.plus} opacity={0.9} />
      <EdgeTile cx={px} cy={py} ndeg={a} len={26} active />
      <Arw x={px} y={py} dx={ux * 28} dy={uy * 28} color={L.field} w={3.2} head={9} />
      <Normal cx={px} cy={py} ndeg={a} len={20} color={L.normal} w={2.4} />
      <Lbl x={16} y={22} text="2本とも半径方向 → 平行" color={L.text} size={11.5} />
      <Lbl x={16} y={42} text="なす角 0°、cos = 1" color={L.dim} size={10.5} />
      <Lbl x={16} y={152} text="E · n = E（そのまま）" color={L.focus} size={12.5} bold />
      <Cap text="水色と白の矢印が、いつも重なって見える" />
    </LevelFig>
  );
}

/** 同じ r なら、E の大きさも同じ。 */
export function SameMagnitude() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(2.6 * t);
  return (
    <LevelFig label="同じ半径なら電場の大きさも同じ">
      <circle cx={SPH.cx} cy={SPH.cy} r={SPH.r} fill="none" stroke={L.dim} strokeWidth={1.4} strokeDasharray="4 4" />
      <circle cx={SPH.cx} cy={SPH.cy} r={8} fill={L.plus} opacity={0.9} />
      <g opacity={glow}>
        {SPH_ANGLES.map(a => {
          const [ux, uy] = dir(a);
          return <Arw key={a} x={SPH.cx + ux * SPH.r} y={SPH.cy + uy * SPH.r}
            dx={ux * 22} dy={uy * 22} color={L.field} w={2.6} head={8} />;
        })}
      </g>
      {SPH_ANGLES.map(a => {
        const [ux, uy] = dir(a);
        return <Dot key={a} x={SPH.cx + ux * SPH.r} y={SPH.cy + uy * SPH.r} color={L.focus} r={2.6} />;
      })}
      <Lbl x={16} y={22} text="球面上の点は、どれも中心から距離 r" color={L.text} size={11} />
      <Lbl x={16} y={162} text="だから E の大きさはどこでも同じ値" color={L.focus} size={11} />
      <Cap text="矢印の長さがすべて等しいことを見てください" />
    </LevelFig>
  );
}

/** 共通の E を、面積分の外へ出す。 */
export function FactorOutE() {
  const t = useT();
  const phase = step(t, 3, 1.4);
  const rows = [
    { text: 'ΔΦ i = E · n i ΔA i = E ΔA i', color: L.field },
    { text: 'Σ E ΔA i', color: L.text },
    { text: 'E × Σ ΔA i', color: L.focus },
  ];
  return (
    <LevelFig label="共通のEを和の外へ出す">
      {rows.map((row, i) => (
        <g key={row.text} opacity={i <= phase ? 1 : 0.2}>
          <rect x={26} y={40 + i * 36} width={268} height={28} rx={7} fill={row.color} opacity={i === phase ? 0.24 : 0.1} />
          <Lbl x={160} y={59 + i * 36} text={row.text} color={row.color} size={12.5} anchor="middle" bold={i === 2} />
        </g>
      ))}
      <Lbl x={16} y={26} text="どのタイルも同じ E が掛かっている" color={L.text} size={11} />
      <Lbl x={160} y={158} text="残るのは、タイルの面積の合計だけ" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="E が共通なので、和の外へ括り出せる" />
    </LevelFig>
  );
}

/** 面積の合計は、球の表面積 4πr²。 */
export function SphereAreaSum() {
  const t = useT();
  const n = 16;
  const shown = Math.min(step(t, n + 1, 0.22), n);
  return (
    <LevelFig label="タイルの面積の合計は球の表面積">
      <circle cx={SPH.cx} cy={SPH.cy} r={SPH.r} fill="none" stroke={L.dim} strokeWidth={1.2} strokeDasharray="4 4" />
      <circle cx={SPH.cx} cy={SPH.cy} r={8} fill={L.plus} opacity={0.9} />
      {Array.from({ length: n }, (_, i) => {
        const a = (360 / n) * i + 11;
        const [ux, uy] = dir(a);
        return <EdgeTile key={i} cx={SPH.cx + ux * SPH.r} cy={SPH.cy + uy * SPH.r} ndeg={a}
          len={(2 * Math.PI * SPH.r) / n} active={i < shown} />;
      })}
      <Lbl x={16} y={22} text={`${shown} / ${n} 枚ぶんを合計`} color={L.dim} size={10.5} />
      <Lbl x={16} y={44} text="Σ ΔA i = 4πr²" color={L.focus} size={12.5} bold />
      <Lbl x={16} y={152} text="∮∮ E · dA = E (4πr²)" color={L.focus} size={13} bold />
      <Cap text="タイルが1周そろうと、球の表面積になる" />
    </LevelFig>
  );
}

/** 左辺は書き換えたが、右辺はまだ未定。 */
export function NotAProof() {
  const t = useT();
  const blink = 0.4 + 0.4 * Math.sin(3 * t);
  return (
    <LevelFig label="左辺の書き換えだけで右辺はまだ未定">
      <rect x={20} y={46} width={132} height={54} rx={8} fill={L.plus} opacity={0.16} stroke={L.plus} strokeWidth={1.4} />
      <Lbl x={86} y={68} text="左辺" color={L.plus} size={11} anchor="middle" bold />
      <Lbl x={86} y={88} text="E (4πr²)" color={L.text} size={13} anchor="middle" />
      <Lbl x={160} y={80} text="=" color={L.dim} size={18} anchor="middle" />
      <rect x={168} y={46} width={132} height={54} rx={8} fill={L.minus} opacity={0.14}
        stroke={L.minus} strokeWidth={1.4} strokeDasharray="5 4" />
      <Lbl x={234} y={68} text="右辺" color={L.minus} size={11} anchor="middle" bold />
      <g opacity={blink}>
        <Lbl x={234} y={90} text="?" color={L.minus} size={20} anchor="middle" bold />
      </g>
      <Lbl x={16} y={26} text="示したのは、左辺の書き換えだけ" color={L.text} size={11.5} />
      <Lbl x={160} y={128} text="右辺が中の電荷で決まることは、まだ出ていない" color={L.dim} size={10} anchor="middle" />
      <Lbl x={160} y={150} text="これは証明ではなく、計算上の準備" color={L.focus} size={11.5} anchor="middle" bold />
      <Cap text="左の枠は確定、右の破線の枠はまだ未定" />
    </LevelFig>
  );
}

/** 法則は任意の閉曲面で成り立つ。対称性は計算を楽にする条件。 */
export function SymmetryNotCondition() {
  const t = useT();
  const which = step(t, 2, 2.0);
  const lumpy = Array.from({ length: 33 }, (_, i) => {
    const a = (360 / 32) * i;
    const [ux, uy] = dir(a);
    const rr = 40 + 12 * Math.sin(3 * a * RAD) + 6 * Math.cos(5 * a * RAD);
    return `${(232 + ux * rr).toFixed(1)},${(84 + uy * rr).toFixed(1)}`;
  }).join(' ');
  return (
    <LevelFig label="法則は任意の閉曲面で成り立つ">
      <line x1={160} y1={26} x2={160} y2={126} stroke={L.dim} strokeDasharray="4 4" strokeWidth={1} />
      <circle cx={84} cy={84} r={40} fill={L.field} opacity={which === 0 ? 0.24 : 0.12}
        stroke={L.field} strokeWidth={1.8} />
      <Lbl x={84} y={38} text="球面" color={L.field} size={11} anchor="middle" bold />
      <Lbl x={84} y={138} text="法則: 成り立つ" color={L.plus} size={10} anchor="middle" />
      <Lbl x={84} y={152} text="E を取り出せる" color={L.plus} size={10} anchor="middle" />
      <polygon points={lumpy} fill={L.field} opacity={which === 1 ? 0.24 : 0.12} stroke={L.field} strokeWidth={1.8} />
      <Lbl x={232} y={38} text="いびつな面" color={L.field} size={11} anchor="middle" bold />
      <Lbl x={232} y={138} text="法則: 成り立つ" color={L.plus} size={10} anchor="middle" />
      <Lbl x={232} y={152} text="E は取り出せない" color={L.minus} size={10} anchor="middle" />
      <Lbl x={16} y={20} text="対称性は、計算を楽にする条件にすぎない" color={L.text} size={10.5} />
      <Cap text="どちらでも法則は成り立つ。違うのは計算のしやすさ" />
    </LevelFig>
  );
}

/** この一手が使えない場合と、上級での使い方。 */
export function GaussPreview() {
  const t = useT();
  const off = 22 * pingPong(t, 5);
  const cx = 104 + off, cy = 86;
  return (
    <LevelFig label="電荷が中心からずれると使えない">
      <circle cx={104} cy={86} r={44} fill="none" stroke={L.dim} strokeWidth={1.4} strokeDasharray="4 4" />
      <circle cx={cx} cy={cy} r={7} fill={L.plus} opacity={0.9} />
      {[20, 90, 160, 230, 300].map(a => {
        const [ux, uy] = dir(a);
        const px = 104 + ux * 44, py = 86 + uy * 44;
        const dx = px - cx, dy = py - cy;
        const d = Math.max(Math.hypot(dx, dy), 1);
        const len = 900 / (d * d) * 30 + 8;
        return (
          <g key={a}>
            <Arw x={px} y={py} dx={(dx / d) * len} dy={(dy / d) * len} color={L.field} w={2} head={6} />
            <Normal cx={px} cy={py} ndeg={a} len={14} w={1.5} />
          </g>
        );
      })}
      <Lbl x={16} y={22} text="中心からずれると" color={L.text} size={11} />
      <Lbl x={16} y={162} text="E が場所ごとに違い、外へ出せない" color={L.minus} size={10.5} />
      <rect x={172} y={44} width={132} height={62} rx={8} fill={L.focus} opacity={0.14} stroke={L.focus} strokeWidth={1.3} />
      <Lbl x={238} y={64} text="上級では" color={L.dim} size={10} anchor="middle" />
      <Lbl x={238} y={84} text="∮∮ E · dA" color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={238} y={100} text="= Q(内) / ε₀" color={L.focus} size={12} anchor="middle" bold />
      <Cap text="電荷が中心からずれると、矢印の長さが不ぞろいになる" />
    </LevelFig>
  );
}

export const um_emFigures: Record<string, () => JSX.Element> = {
  // 1. 小区間の仕事
  'ume-field-map-grid': FieldMapGrid,
  'ume-e-components': EComponents,
  'ume-work-uniform-recall': WorkUniformRecall,
  'ume-bent-path-question': BentPathQuestion,
  'ume-delta-r-arrow': DeltaRArrow,
  'ume-representative-point': RepresentativePoint,
  'ume-force-is-qe': ForceIsQE,
  'ume-effective-force': EffectiveForce,
  'ume-work-piece-cos': WorkPieceCos,
  'ume-dot-definition': DotDefinition,
  'ume-dot-one-edge': DotOneEdge,
  'ume-perpendicular-zero': PerpendicularZero,
  'ume-negative-edge': NegativeEdge,
  'ume-not-just-product': NotJustProduct,
  // 2. 有限和から線積分へ
  'ume-piece-work-dot': PieceWorkDot,
  'ume-varying-field-path': VaryingFieldPath,
  'ume-chop-into-n': ChopIntoN,
  'ume-ri-vs-dri': RiVsDri,
  'ume-sum-n-pieces': SumNPieces,
  'ume-sigma-index': SigmaIndex,
  'ume-sum-four-edges': SumFourEdges,
  'ume-refine-path': RefinePath,
  'ume-limit-of-sum': LimitOfSum,
  'ume-line-integral-symbol': LineIntegralSymbol,
  'ume-substitute-qe': SubstituteQE,
  'ume-path-label-c': PathLabelC,
  'ume-direction-of-c': DirectionOfC,
  'ume-path-dependent': PathDependent,
  // 3. 静電場の電位差
  'ume-two-endpoints': TwoEndpoints,
  'ume-two-paths-compare': TwoPathsCompare,
  'ume-path-right-first': PathRightFirst,
  'ume-path-up-first': PathUpFirst,
  'ume-x-displacement-only': XDisplacementOnly,
  'ume-loop-zero': LoopZero,
  'ume-work-ab': WorkAB,
  'ume-energy-change': EnergyChange,
  'ume-potential-def': PotentialDef,
  'ume-potential-formula': PotentialFormula,
  'ume-volt-units': VoltUnits,
  'ume-potential-as-height': PotentialAsHeight,
  'ume-changing-b-warning': ChangingBWarning,
  // 4. 面積ベクトル
  'ume-one-tile-flux': OneTileFlux,
  'ume-tile-two-facts': TileTwoFacts,
  'ume-normal-intro': NormalIntro,
  'ume-tile-dot-normal': TileDotNormal,
  'ume-unit-normal-why': UnitNormalWhy,
  'ume-combine-into-arrow': CombineIntoArrow,
  'ume-da-vs-vec-da': DaVsVecDa,
  'ume-tile-flux-vector': TileFluxVector,
  'ume-normal-side-choice': NormalSideChoice,
  'ume-curved-normals': CurvedNormals,
  // 5. 有限和から面積分へ
  'ume-flat-tiles-sum': FlatTilesSum,
  'ume-curved-each-tile': CurvedEachTile,
  'ume-curved-tiles-sum': CurvedTilesSum,
  'ume-sum-tiles-n': SumTilesN,
  'ume-surface-integral-symbol': SurfaceIntegralSymbol,
  'ume-c-vs-s': CvsS,
  'ume-da-limit': DaLimit,
  'ume-not-area-times': NotAreaTimes,
  'ume-oint-vs-oiint': OintVsOiint,
  'ume-open-vs-closed-surface': OpenVsClosedSurface,
  // 6. 閉曲面の電気束
  'ume-closed-outward-normals': ClosedOutwardNormals,
  'ume-box-in-uniform-field': BoxInUniformField,
  'ume-box-left-face': BoxLeftFace,
  'ume-box-right-face': BoxRightFace,
  'ume-box-side-faces': BoxSideFaces,
  'ume-box-total-zero': BoxTotalZero,
  'ume-zero-flux-nonzero-field': ZeroFluxNonzeroField,
  'ume-net-outflow-meaning': NetOutflowMeaning,
  // 7. 中心の点電荷と球面
  'ume-point-charge-radial': PointChargeRadial,
  'ume-sphere-choice': SphereChoice,
  'ume-e-parallel-normal': EParallelNormal,
  'ume-same-magnitude': SameMagnitude,
  'ume-factor-out-e': FactorOutE,
  'ume-sphere-area-sum': SphereAreaSum,
  'ume-not-a-proof': NotAProof,
  'ume-symmetry-not-condition': SymmetryNotCondition,
  'ume-gauss-preview': GaussPreview,
};

export const um_emReadings: Record<string, string> = {
  'ume-field-map-grid': '格子の各点に矢印が1本ずつ出ています。金色に変わる点が「いま読んでいる場所」で、その点の成分が下に出ます。',
  'ume-e-components': '斜めの矢印から、横向きの成分と縦向きの成分が順に現れます。2本を足すと元の矢印に戻ります。',
  'ume-work-uniform-recall': '水色の矢印がどこでも同じ長さ・同じ向きで、電場が一様であることを表します。黄の線が進んだ距離です。',
  'ume-bent-path-question': '黄の折れ線が道、水色が各区間の代表点での電場です。区間ごとに向きの関係が違うことを見てください。',
  'ume-delta-r-arrow': '金の矢印が、いま選んでいる小区間の進む向きと長さです。左に成分の組が出ます。',
  'ume-representative-point': '各区間の中点に置いた点が代表点です。金色の点で読んだ場の値が、その区間全体に使われます。',
  'ume-force-is-qe': '水色が電場、黄緑が電荷の受ける力です。長さが2倍になるのは電荷が2 Cだからで、単位もN/CからNへ変わります。',
  'ume-effective-force': '黄の直線が道の向きです。水色の力から点線を下ろした先の黄緑が、道方向の成分にあたります。',
  'ume-work-piece-cos': '縦が有効な力、横が小移動の長さです。塗られた面積が、その小区間でした仕事にあたります。',
  'ume-dot-definition': '上の式と下の式が交互に光ります。中身はまったく同じで、書き方だけが短くなっています。',
  'ume-dot-one-edge': '点線は、力を進む向きへ落とした投影です。黄緑の太い線がその長さで、これが仕事に効く成分です。',
  'ume-perpendicular-zero': '2つの区間が交互に選ばれます。直角の印が付いた区間では、内積が0になることを確かめてください。',
  'ume-negative-edge': '紫の矢印（力）と金の矢印（進む向き）が反対を向いています。このとき仕事に負号が付きます。',
  'ume-not-just-product': '上の灰の帯が大きさの積、下の金の帯が内積です。角度が90°に近づくほど、下の帯が短くなります。',
  'ume-piece-work-dot': '黄緑の力から点線を下ろした先が、金の太い矢印です。この長さだけが、その区間の仕事に効きます。',
  'ume-varying-field-path': '金の点が道の上を動くと、そこでの力の矢印も長さと向きを変えます。値が1つに決まらないことを見てください。',
  'ume-chop-into-n': '薄い曲線の上に、金の短い直線が1本ずつ載っていきます。曲線が直線の集まりに置き換わります。',
  'ume-ri-vs-dri': '白の矢印は原点から代表点まで、金の矢印はその区間を進む向きと長さです。始点が違うことを見てください。',
  'ume-sum-n-pieces': '金の矢印が1本ずつ増え、右の合計が積み上がります。水色は各区間の代表点で読んだ力です。',
  'ume-sigma-index': '下端i=1と上端4が、足す範囲を表しています。下の4つの箱が、実際に足される項です。',
  'ume-sum-four-edges': '区間の値が1つずつ現れ、左上の合計が積み上がります。0の区間と負の区間の足し方に注目してください。',
  'ume-refine-path': '区間の数が4、8、16と増えます。折れ線が曲線に近づき、右の合計の値が落ち着くことを見てください。',
  'ume-limit-of-sum': '矢印が細かくなるほど、右の数値の上の桁が変わらなくなります。これが極限の値です。',
  'ume-line-integral-symbol': '右の表示がΣの式から∫の式へ入れ替わります。描かれている操作は同じであることを確かめてください。',
  'ume-substitute-qe': '上から順に式が置き換わります。力が電場に変わり、qが積分の外へ出ることを見てください。',
  'ume-path-label-c': '上は数直線の区間、下は空間の中の曲線です。同じ積分記号でも、下に付く名札の意味が違います。',
  'ume-direction-of-c': '矢印の向きが一斉に反転し、右の符号も変わります。大きさは変わらないことを見てください。',
  'ume-path-dependent': '上の実線の枠が、いま確定した内容です。下の破線の枠は、道を変えたときにどうなるかという未確定の部分です。',
  'ume-two-endpoints': '同じAとBを結ぶ道が何本も描かれています。実線の2本が、このあと数値で比べる道です。',
  'ume-two-paths-compare': '2本の道が交互に金色になります。どちらも同じAから同じBへ向かっていることを確かめてください。',
  'ume-path-right-first': '1区間目は電場と同じ向き、2区間目は直角です。直角の印が付いた区間の値が0になることを見てください。',
  'ume-path-up-first': '順番が入れ替わっても、直角な区間の値は0のままです。合計が道1と同じになることを確かめてください。',
  'ume-x-displacement-only': '下の黄緑の矢印が、電場方向に進んだ分です。道を切り替えてもこの長さが変わらないことを見てください。',
  'ume-loop-zero': '一周する間に、正の区間・0の区間・負の区間が順に現れます。左上の合計が最後に0へ戻ることを見てください。',
  'ume-work-ab': '黄の道の上を電荷がAからBへ運ばれます。この道に沿って足したものが、電場のする仕事です。',
  'ume-energy-change': '紫の柱が減った分と、黄緑の柱が増えた分の高さが等しくなっています。符号が逆で大きさが同じ関係です。',
  'ume-potential-def': '上から順に、位置エネルギーの変化を電荷で割る流れが出ます。最後の行の単位がVになることを見てください。',
  'ume-potential-formula': '2行目を1行目に代入すると、qが打ち消されます。×印が付く位置を確かめてください。',
  'ume-volt-units': '単位が上から順に書き換わります。最後の行でJ/CがVになる対応を確かめてください。',
  'ume-potential-as-height': '破線が等電位面で、電場の矢印と直交しています。右へ進むほど電位の数値が下がります。',
  'ume-changing-b-warning': '輪の中の印が大きくなり、磁場が時間とともに増えることを表しています。このとき一周の値は0になりません。',
  'ume-one-tile-flux': '金の帯が面を横から見たもの、白い矢印が法線です。磁場の矢印と法線が平行になっていることを確かめてください。',
  'ume-tile-two-facts': '右の2つの札が交互に光ります。広さを表す札と、向きを表す札が別々であることを見てください。',
  'ume-normal-intro': '面が傾いても、白い矢印は面と直角のまま大きさも変わりません。右の目盛りが大きさ1を表します。',
  'ume-tile-dot-normal': '水色の磁場から点線を下ろした先が黄緑の矢印です。角度が増えるほどこの長さが短くなります。',
  'ume-unit-normal-why': '黄緑の矢印がB·nです。法線の大きさは1なので、この長さがそのまま垂直成分になります。',
  'ume-combine-into-arrow': '灰の矢印（大きさ1の法線）が伸びて金の矢印になります。伸びた長さが面積を表します。',
  'ume-da-vs-vec-da': '左は数値の入った四角、右は向きを持つ矢印です。同じ量ではないことを確かめてください。',
  'ume-tile-flux-vector': '水色の磁場と金の向き付き面積、2本の矢印だけで寄与が決まります。間の角度に注目してください。',
  'ume-normal-side-choice': '面も磁場もそのままで、白い矢印の向きだけが反転します。そのたびに下の符号が変わります。',
  'ume-curved-normals': '白い矢印が扇のように向きを変えます。面が曲がると、垂直な向きが1枚ごとに変わることを見てください。',
  'ume-flat-tiles-sum': '4枚の法線がすべて同じ向きです。1枚ずつ金色になり、左下の合計が0.1ずつ増えます。',
  'ume-curved-each-tile': '選ばれたタイルの法線と磁場のなす角が、右の数値に出ます。角が90°を超えると値が負になります。',
  'ume-curved-tiles-sum': 'タイルごとの値が現れ、合計が積み上がります。紫のタイルが引き算になることを確かめてください。',
  'ume-sum-tiles-n': 'タイルの枚数が4、8、16と増えます。1枚あたりの帯が短くなっていくことを見てください。',
  'ume-surface-integral-symbol': '上の表示がΣの式から∫Sの式へ入れ替わります。並んでいるタイルは同じままです。',
  'ume-c-vs-s': '左は1次元の曲線、右は2次元の面です。足す相手がΔrベクトルかΔAベクトルかで違います。',
  'ume-da-limit': '左は面積を表す四角、右は法線の矢印が付いたタイルです。矢印の有無で別の量になります。',
  'ume-not-area-times': '面積は同じままで、向きだけが変わります。向きが変わると値が0になることを確かめてください。',
  'ume-oint-vs-oiint': '左は一周する道、右は袋の表面です。積分記号の輪が1本か2本かで区別しています。',
  'ume-open-vs-closed-surface': '左の面にはふち（紫の点）があります。ふちがある面には、閉曲面の記号を使えません。',
  'ume-closed-outward-normals': '4本の白い矢印が、すべて箱の外を向いています。順に金色になるので1本ずつ確かめてください。',
  'ume-box-in-uniform-field': '水色の矢印が箱を左から右へ通り抜けます。どこでも同じ長さ・同じ向きであることを見てください。',
  'ume-box-left-face': '外向き法線（紫）と電場（水色）が反対を向いています。このとき寄与が負になります。',
  'ume-box-right-face': '外向き法線（黄緑）と電場が同じ向きです。左の面と電場は同じなのに、符号が反対になります。',
  'ume-box-side-faces': '外向き法線と電場が直角で、直角の印が付いています。この面の寄与は0です。',
  'ume-box-total-zero': '面の寄与が1つずつ現れ、左上の合計が変わります。−2と+2が相殺して0になることを見てください。',
  'ume-zero-flux-nonzero-field': '合計は0ですが、箱の中にも水色の矢印があります。場そのものは0でないことを確かめてください。',
  'ume-net-outflow-meaning': '点が左から箱へ入り、右へ抜けていきます。入った分と出た分が相殺することだけを表しています。',
  'ume-point-charge-radial': '矢印がすべて中心から外を向いています。向きが半径方向であることを確かめてください。',
  'ume-sphere-choice': '球面上のすべての点で、白い矢印が球の外を向いています。破線が半径rです。',
  'ume-e-parallel-normal': '水色の電場と白い法線が、いつも重なって見えます。なす角が0°であることを確かめてください。',
  'ume-same-magnitude': '球面上の点に出ている矢印の長さが、すべて等しくなっています。距離が同じだからです。',
  'ume-factor-out-e': '上から順に式が変わり、共通のEが和の外へ出ます。残るのが面積の合計だけになることを見てください。',
  'ume-sphere-area-sum': 'タイルが1枚ずつ金色になり、1周そろうと球の表面積になります。合計が4πr²になることを見てください。',
  'ume-not-a-proof': '左の実線の枠は確定した左辺、右の破線の枠はまだ分かっていない右辺です。',
  'ume-symmetry-not-condition': '左が球面、右がいびつな面です。どちらでも法則は成り立ち、違うのはEを取り出せるかどうかです。',
  'ume-gauss-preview': '電荷が中心からずれると、球面上の矢印の長さが不ぞろいになります。法線とも平行でなくなります。',
};
