import { Arw, Axes, Bar, Cap, Curve, FigSlider, L, Lbl, LevelFig, mapper, pingPong, step, useManual, useT, fmt } from './base';

// 数学の武器庫・中級（記号とグラフで、変化を式にする）の図解。
// 図解IDはすべて umx- で始める。
// 縦軸・横軸・色の意味は base.tsx の約束に従う。

/** 小さな点。 */
function Dot({ cx, cy, color, r = 3.4 }: { cx: number; cy: number; color: string; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill={color} />;
}

/** 図の上に文字を重ねるときの、暗い下敷き。 */
function Plate({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={Math.max(w, 0)} height={Math.max(h, 0)} rx={6} fill="#0d1326" opacity={0.82} />;
}

/** 枠付きの小さな板。 */
function Panel({ x, y, w, h, color, on = true }: { x: number; y: number; w: number; h: number; color: string; on?: boolean }) {
  return <rect x={x} y={y} width={Math.max(w, 0)} height={Math.max(h, 0)} rx={7} fill={color} opacity={on ? 0.18 : 0.07}
    stroke={color} strokeWidth={on ? 1.4 : 0.8} strokeOpacity={on ? 0.8 : 0.3} />;
}

// =====================================================================
// 1. um-average-rate — 平均変化率から微分へ（x = t² [m]、t [s]）
// =====================================================================

const PAR = mapper([0, 2.4], [0, 5.8], { x0: 44, y0: 30, x1: 262, y1: 146 });
const sq = (t: number) => t * t;

/** 2点を結ぶ直線の傾き Δx/Δt。 */
export function AvgTwoPoints() {
  const t = useT();
  const phase = step(t, 3, 1.4);
  const ax = PAR.x(1), ay = PAR.y(1), bx = PAR.x(2), by = PAR.y(4);
  return (
    <LevelFig label="2点を結ぶ直線の傾きが平均変化率">
      <Axes m={PAR} xLabel="t [s]" yLabel="x [m]" />
      <Curve m={PAR} f={sq} color={L.dim} xa={0} xb={2.4} w={2} />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={L.path} strokeWidth={2.5} />
      <line x1={ax} y1={ay} x2={bx} y2={ay} stroke={L.focus} strokeWidth={phase >= 0 ? 2.5 : 1} strokeDasharray="4 3" />
      <line x1={bx} y1={ay} x2={bx} y2={by} stroke={L.plus} strokeWidth={phase >= 1 ? 2.5 : 1} strokeDasharray="4 3" />
      <Dot cx={ax} cy={ay} color={L.path} />
      <Dot cx={bx} cy={by} color={L.path} />
      <Lbl x={PAR.x(1.5)} y={ay + 15} text="Δt = 1 s" color={L.focus} size={10.5} anchor="middle" />
      <Lbl x={bx + 5} y={(ay + by) / 2 + 4} text="Δx = 3 m" color={L.plus} size={10.5} />
      <Lbl x={66} y={22} text="2点を選ぶと、傾きが1つ決まる" color={L.text} size={11} />
      <Lbl x={66} y={46} text={phase >= 2 ? 'Δx / Δt = 3 / 1 = 3 m/s' : ''} color={L.path} size={12} />
      <Cap text="横の差Δtと縦の差Δxの割り算が、平均変化率" />
    </LevelFig>
  );
}

/** 幅 h を縮めると、直線の傾きが変わる。 */
export function AvgShrink() {
  const [h, setH] = useManual(time => 0.1 + 0.9 * (1 - pingPong(time, 9)));
  const slope = 2 + h;
  const ax = PAR.x(1), ay = PAR.y(1);
  const bx = PAR.x(1 + h), by = PAR.y(sq(1 + h));
  // 傾き slope の直線を、描画範囲いっぱいに伸ばす。
  const left = 0.2, right = 2.3;
  const ly = PAR.y(1 + slope * (left - 1)), ry = PAR.y(1 + slope * (right - 1));
  return (
    <>
      <LevelFig label="区間の幅を縮めると直線の傾きが変わる">
        <Axes m={PAR} xLabel="t [s]" yLabel="x [m]" />
        <Curve m={PAR} f={sq} color={L.dim} xa={0} xb={2.4} w={2} />
        <line x1={PAR.x(left)} y1={ly} x2={PAR.x(right)} y2={ry} stroke={L.path} strokeWidth={2.5} />
        <line x1={ax} y1={ay} x2={bx} y2={ay} stroke={L.focus} strokeWidth={2} />
        <Dot cx={ax} cy={ay} color={L.plus} />
        <Dot cx={bx} cy={by} color={L.focus} />
        <Lbl x={66} y={22} text={`幅 h = ${fmt(h, 2)} s`} color={L.text} size={11.5} />
        <Lbl x={66} y={44} text={`傾き = 2 + h = ${fmt(slope, 2)} m/s`} color={L.path} size={12} />
        <Lbl x={ax - 7} y={ay - 7} text="t = 1 s" color={L.plus} size={10} anchor="end" />
        <Cap text="hごとに傾きが違う。どれを瞬間の値と呼ぶのか" />
      </LevelFig>
      <FigSlider label="区間の幅 h [s]" value={h} min={0.1} max={1} step={0.01} onChange={setH} display={`${fmt(h, 2)} s`} />
    </>
  );
}

/** 何本もの直線が、接線に重なっていく。 */
export function AvgTangent() {
  const t = useT();
  const glow = 0.55 + 0.35 * Math.sin(3 * t);
  const hs = [1, 0.5, 0.25];
  const seg = (slope: number) => {
    const left = 0.2, right = 2.3;
    return { x1: PAR.x(left), y1: PAR.y(1 + slope * (left - 1)), x2: PAR.x(right), y2: PAR.y(1 + slope * (right - 1)) };
  };
  return (
    <LevelFig label="2点を結ぶ直線が接線に重なる">
      <Axes m={PAR} xLabel="t [s]" yLabel="x [m]" />
      <Curve m={PAR} f={sq} color={L.dim} xa={0} xb={2.4} w={2} />
      {hs.map((h, i) => {
        const s = seg(2 + h);
        return <line key={h} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={L.path} strokeWidth={1.6} opacity={0.3 + 0.15 * i} />;
      })}
      {(() => { const s = seg(2); return <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={L.focus} strokeWidth={3} opacity={glow} />; })()}
      <Dot cx={PAR.x(1)} cy={PAR.y(1)} color={L.plus} />
      <Lbl x={66} y={22} text="h = 1、0.5、0.25 の直線" color={L.dim} size={10.5} />
      <Lbl x={66} y={44} text="行き先は接線（傾き 2 m/s）" color={L.focus} size={11.5} />
      <Cap text="細い線が直線、太い線が行き先の接線" />
    </LevelFig>
  );
}

/** 数値表: h を縮めると差商が2へ。 */
export function AvgTable() {
  const t = useT();
  const shown = step(t, 5, 1.0);
  const rows = [
    { h: '1', q: '3' },
    { h: '0.1', q: '2.1' },
    { h: '0.01', q: '2.01' },
    { h: '0.001', q: '2.001' },
  ];
  return (
    <LevelFig label="hを縮めたときの差商の数値表">
      <Lbl x={30} y={26} text="幅 h [s]" color={L.dim} size={10.5} />
      <Lbl x={290} y={26} text="差商 2t + h [m/s]" color={L.dim} size={10.5} anchor="end" />
      {rows.map((row, i) => (
        <g key={row.h} opacity={i <= shown ? 1 : 0.18}>
          <Panel x={24} y={34 + i * 26} w={272} h={22} color={i === shown ? L.focus : L.dim} on={i <= shown} />
          <Lbl x={36} y={50 + i * 26} text={`h = ${row.h}`} color={L.text} size={11} />
          <Lbl x={284} y={50 + i * 26} text={row.q} color={i <= shown ? L.focus : L.dim} size={11.5} anchor="end" bold={i === shown} />
        </g>
      ))}
      <Lbl x={160} y={156} text={shown >= 4 ? 'h → 0 のとき 差商 → 2 m/s' : 'x = t² の t = 1 で計算している'}
        color={shown >= 4 ? L.plus : L.dim} size={11.5} anchor="middle" bold={shown >= 4} />
      <Cap text="hを10分の1にするたび、2との差も10分の1になる" />
    </LevelFig>
  );
}

/** (t+h)² の展開を、正方形の帯で見る。 */
export function AvgExpand() {
  const t = useT();
  const which = step(t, 3, 1.3);
  const bx = 52, by = 72, S = 64, hh = 24;
  return (
    <LevelFig label="正方形を広げて2乗の展開を見る">
      <rect x={bx} y={by} width={S} height={S} fill={L.dim} opacity={0.35} />
      <rect x={bx + S} y={by} width={hh} height={S} fill={L.focus} opacity={which === 0 ? 0.8 : 0.35} />
      <rect x={bx} y={by - hh} width={S} height={hh} fill={L.focus} opacity={which === 0 ? 0.8 : 0.35} />
      <rect x={bx + S} y={by - hh} width={hh} height={hh} fill={L.minus} opacity={which === 1 ? 0.9 : 0.4} />
      <rect x={bx} y={by - hh} width={S + hh} height={S + hh} fill="none" stroke={L.text} strokeWidth={1.2} opacity={0.5} />
      <Lbl x={bx + S / 2} y={by + S / 2 + 4} text="t²" color={L.text} size={12} anchor="middle" />
      <Lbl x={bx + S + hh / 2} y={by + S / 2 + 4} text="th" color={L.text} size={10} anchor="middle" />
      <Lbl x={bx + S / 2} y={by - hh / 2 + 4} text="th" color={L.text} size={10} anchor="middle" />
      <Lbl x={bx + S + hh / 2} y={by - hh / 2 + 4} text="h²" color={L.text} size={9} anchor="middle" />
      <Lbl x={bx + S / 2} y={by + S + 14} text="t" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={bx + S + hh / 2} y={by + S + 14} text="h" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={156} y={54} text="辺を h だけ広げる" color={L.text} size={11} />
      <Lbl x={156} y={80} text="帯 2 本 → 2th" color={which === 0 ? L.focus : L.dim} size={11.5} />
      <Lbl x={156} y={104} text="角 1 個 → h²" color={which === 1 ? L.minus : L.dim} size={11.5} />
      <Lbl x={156} y={132} text="増えた分 = 2th + h²" color={which === 2 ? L.plus : L.dim} size={11.5} />
      <Cap text="(t+h)² から t² を引いた残りが、帯2本と角1個" />
    </LevelFig>
  );
}

/** 分子を h でくくって約分する。 */
export function AvgCancel() {
  const t = useT();
  const shown = step(t, 3, 1.5);
  const rows = [
    { text: '( 2th + h² ) ÷ h', color: L.text },
    { text: '= h ( 2t + h ) ÷ h', color: L.focus },
    { text: '= 2t + h', color: L.plus },
  ];
  return (
    <LevelFig label="分子をhでくくって約分する">
      {rows.map((row, i) => (
        <g key={row.text} opacity={i <= shown ? 1 : 0.15}>
          <Panel x={30} y={38 + i * 34} w={260} h={26} color={i === shown ? row.color : L.dim} on={i <= shown} />
          <Lbl x={160} y={56 + i * 34} text={row.text} color={row.color} size={13} anchor="middle" bold={i === shown} />
        </g>
      ))}
      {shown >= 1 && <line x1={103} y1={96} x2={116} y2={80} stroke={L.minus} strokeWidth={2} />}
      {shown >= 1 && <line x1={220} y1={96} x2={233} y2={80} stroke={L.minus} strokeWidth={2} />}
      <Lbl x={160} y={152} text="h は 0 ではないので、割ってよい" color={L.dim} size={11} anchor="middle" />
      <Cap text="斜めの線が、約分で消える h。結果に h が1つ残る" />
    </LevelFig>
  );
}

/** h=0 を代入する（禁止）と、h→0 に近づける（正しい）。 */
export function AvgHZero() {
  const t = useT();
  const blink = 0.45 + 0.4 * Math.sin(4 * t);
  return (
    <LevelFig label="0を代入するのと0に近づけるのは違う">
      <Panel x={16} y={34} w={138} h={100} color={L.minus} />
      <Lbl x={85} y={54} text="h = 0 を代入" color={L.minus} size={11.5} anchor="middle" />
      <Lbl x={85} y={82} text="( 0 ) ÷ ( 0 )" color={L.text} size={13} anchor="middle" />
      <g opacity={blink}>
        <Lbl x={85} y={112} text="値が決まらない" color={L.minus} size={11} anchor="middle" />
      </g>
      <Panel x={166} y={34} w={138} h={100} color={L.plus} />
      <Lbl x={235} y={54} text="h → 0 に近づける" color={L.plus} size={11.5} anchor="middle" />
      <Lbl x={235} y={82} text="2t + h → 2t" color={L.text} size={13} anchor="middle" />
      <Lbl x={235} y={112} text="行き先が決まる" color={L.plus} size={11} anchor="middle" />
      <Lbl x={160} y={152} text="先に約分してから、0へ近づける" color={L.dim} size={11} anchor="middle" />
      <Cap text="微分は0で割る操作ではなく、行き先を見る操作" />
    </LevelFig>
  );
}

/** 差商 2+h の値が、h→0 で 2 に近づく。 */
export function AvgLimit() {
  const t = useT();
  const u = pingPong(t, 7);
  const h = 0.02 + 0.98 * (1 - u);
  const m = mapper([0, 1.08], [1.7, 3.2], { x0: 50, y0: 40, x1: 262, y1: 138 });
  return (
    <LevelFig label="hを0へ近づけると差商が2に近づく">
      <Axes m={m} xLabel="h [s]" yLabel="差商" />
      <line x1={m.x(0)} y1={m.y(2)} x2={m.x(1.08)} y2={m.y(2)} stroke={L.plus} strokeWidth={1.6} strokeDasharray="5 4" />
      <Curve m={m} f={v => 2 + v} color={L.path} xa={0} xb={1.05} />
      <Dot cx={m.x(h)} cy={m.y(2 + h)} color={L.focus} r={4} />
      <Dot cx={m.x(0)} cy={m.y(2)} color={L.plus} r={4} />
      <Lbl x={m.x(1.0)} y={m.y(2) + 16} text="行き先 2 m/s" color={L.plus} size={10.5} anchor="end" />
      <Lbl x={66} y={26} text={`h = ${fmt(h, 2)} → 差商 ${fmt(2 + h, 2)} m/s`} color={L.focus} size={11.5} />
      <Lbl x={66} y={156} text="h は 0 に達しないが、値は 2 に達する" color={L.dim} size={9.8} />
      <Cap text="点が左へ進むほど、差商の値は2へ寄っていく" />
    </LevelFig>
  );
}

/** 位置の式と、傾きの式の対応。 */
export function AvgDerivativeMap() {
  const t = useT();
  const tm = 0.35 + 1.75 * pingPong(t, 8);
  const top = mapper([0, 2.4], [0, 6], { x0: 46, y0: 28, x1: 272, y1: 84 });
  const bot = mapper([0, 2.4], [0, 5], { x0: 46, y0: 100, x1: 272, y1: 146 });
  const slope = 2 * tm;
  const d = 0.35;
  return (
    <LevelFig label="位置のグラフの傾きが速度のグラフの値">
      <line x1={42} y1={84} x2={292} y2={84} stroke={L.dim} strokeWidth={1.2} />
      <line x1={46} y1={88} x2={46} y2={26} stroke={L.dim} strokeWidth={1.2} />
      <line x1={42} y1={146} x2={292} y2={146} stroke={L.dim} strokeWidth={1.2} />
      <line x1={46} y1={150} x2={46} y2={98} stroke={L.dim} strokeWidth={1.2} />
      <Curve m={top} f={sq} color={L.dim} xa={0} xb={2.4} w={2} />
      <line x1={top.x(tm - d)} y1={top.y(sq(tm) - slope * d)} x2={top.x(tm + d)} y2={top.y(sq(tm) + slope * d)}
        stroke={L.focus} strokeWidth={2.6} />
      <Dot cx={top.x(tm)} cy={top.y(sq(tm))} color={L.path} />
      <Curve m={bot} f={v => 2 * v} color={L.path} xa={0} xb={2.4} w={2} />
      <Dot cx={bot.x(tm)} cy={bot.y(slope)} color={L.focus} r={4} />
      <line x1={top.x(tm)} y1={top.y(sq(tm))} x2={bot.x(tm)} y2={bot.y(slope)} stroke={L.focus} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
      <Lbl x={176} y={40} text="x = t² [m]" color={L.dim} size={10.5} />
      <Lbl x={150} y={142} text="dx/dt = 2t [m/s]" color={L.dim} size={10.5} />
      <Lbl x={54} y={40} text={`傾き ${fmt(slope, 2)}`} color={L.focus} size={10.5} />
      <Lbl x={54} y={114} text={`値 ${fmt(slope, 2)}`} color={L.focus} size={10.5} />
      <Lbl x={160} y={160} text={`t = ${fmt(tm, 2)} s`} color={L.text} size={10.5} anchor="middle" />
      <Cap text="上の接線の傾きが、そのまま下のグラフの高さになる" />
    </LevelFig>
  );
}

// =====================================================================
// 2. um-sum-to-integral — Σ から ∫ へ
// =====================================================================

const SUM = mapper([0, 4.4], [0, 4.6], { x0: 46, y0: 30, x1: 262, y1: 146 });
const hill = (x: number) => 1 + 2.4 * Math.sin((x / 4) * Math.PI * 0.85);
const lin = (x: number) => x;

/** 合計を作る部品は、値×幅の1本。 */
export function SumValueWidth() {
  const t = useT();
  const u = pingPong(t, 7);
  const x0 = 0.2 + 3.2 * u, x1 = x0 + 0.55;
  const hgt = hill((x0 + x1) / 2);
  return (
    <LevelFig label="合計の部品は値かける幅の長方形1本">
      <Axes m={SUM} xLabel="x" yLabel="f(x)" />
      <Curve m={SUM} f={hill} color={L.field} xa={0} xb={4.2} />
      <Bar m={SUM} x0={x0} x1={x1} height={hgt} active />
      <line x1={SUM.x(x0)} y1={SUM.y(hgt)} x2={SUM.x(x0)} y2={SUM.y(0)} stroke={L.plus} strokeWidth={2} />
      <Lbl x={SUM.x(x0) - 5} y={SUM.y(hgt / 2)} text="高さ" color={L.plus} size={10} anchor="end" />
      <Lbl x={SUM.x((x0 + x1) / 2)} y={SUM.y(0) + 15} text="幅" color={L.focus} size={10} anchor="middle" />
      <Lbl x={66} y={22} text="部品は「その場所の値 × その区間の幅」" color={L.text} size={11} />
      <Lbl x={66} y={44} text="この1本を、必要な数だけ足す" color={L.dim} size={10.5} />
      <Cap text="金色の長方形1本が、合計を作る最小の部品" />
    </LevelFig>
  );
}

/** 足し合わせる範囲 a から b を決める。 */
export function SumPartitionEnds() {
  const t = useT();
  const b = 2.6 + 1.4 * pingPong(t, 8);
  const a = 0.6;
  return (
    <LevelFig label="足し合わせる範囲の両端aとb">
      <Axes m={SUM} xLabel="x" yLabel="f(x)" />
      <polygon points={[`${SUM.x(a).toFixed(1)},${SUM.y(0).toFixed(1)}`,
        ...Array.from({ length: 33 }, (_, i) => { const x = a + ((b - a) * i) / 32; return `${SUM.x(x).toFixed(1)},${SUM.y(hill(x)).toFixed(1)}`; }),
        `${SUM.x(b).toFixed(1)},${SUM.y(0).toFixed(1)}`].join(' ')} fill={L.focus} opacity={0.22} />
      <Curve m={SUM} f={hill} color={L.field} xa={0} xb={4.2} />
      <line x1={SUM.x(a)} y1={SUM.y(0)} x2={SUM.x(a)} y2={SUM.y(hill(a))} stroke={L.plus} strokeWidth={2.4} />
      <line x1={SUM.x(b)} y1={SUM.y(0)} x2={SUM.x(b)} y2={SUM.y(hill(b))} stroke={L.plus} strokeWidth={2.4} />
      <Lbl x={SUM.x(a)} y={SUM.y(0) + 15} text="a" color={L.plus} size={12} anchor="middle" bold />
      <Lbl x={SUM.x(b)} y={SUM.y(0) + 15} text="b" color={L.plus} size={12} anchor="middle" bold />
      <Lbl x={66} y={22} text="左端が a（下端）、右端が b（上端）" color={L.text} size={11} />
      <Lbl x={160} y={158} text={`範囲の長さ b − a = ${fmt(b - a, 2)}`} color={L.focus} size={10.5} anchor="middle" />
      <Cap text="bを動かすと塗られた範囲が変わり、合計も変わる" />
    </LevelFig>
  );
}

/** n 等分すると幅は (b−a)/n。 */
export function SumWidth() {
  const t = useT();
  const n = [2, 4, 8][step(t, 3, 1.5)];
  const dx = 4 / n;
  return (
    <LevelFig label="n等分したときの1区間の幅">
      <Axes m={SUM} xLabel="x" yLabel="f(x)" />
      <Curve m={SUM} f={hill} color={L.dim} xa={0} xb={4.2} w={2} />
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={SUM.x(i * dx)} y={SUM.y(0) - 26} width={Math.max(SUM.x(dx) - SUM.x(0) - 1.5, 1)} height={26}
          fill={i % 2 === 0 ? L.focus : L.field} opacity={0.5} />
      ))}
      {Array.from({ length: n + 1 }, (_, i) => (
        <line key={i} x1={SUM.x(i * dx)} y1={SUM.y(0) + 5} x2={SUM.x(i * dx)} y2={SUM.y(3.4)} stroke={L.dim} strokeWidth={0.9} />
      ))}
      <Lbl x={66} y={22} text={`a = 0、b = 4 を ${n} 等分する`} color={L.text} size={11.5} />
      <Lbl x={66} y={44} text={`Δx = ( b − a ) / n = 4 / ${n} = ${fmt(dx, 2)}`} color={L.focus} size={11.5} />
      <Lbl x={160} y={158} text="n を増やすほど、1本の幅は狭くなる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="区切りの線が増えるたび、Δxの値が半分になる" />
    </LevelFig>
  );
}

/** 各区間の代表点 xᵢ。 */
export function SumSample() {
  const t = useT();
  const active = step(t, 4, 1.1);
  const names = ['x₁', 'x₂', 'x₃', 'x₄'];
  return (
    <LevelFig label="各区間の代表点を左端に取る">
      <Axes m={SUM} xLabel="x" yLabel="f(x)" />
      <Curve m={SUM} f={hill} color={L.field} xa={0} xb={4.2} />
      {[0, 1, 2, 3].map(i => (
        <Bar key={i} m={SUM} x0={i} x1={i + 1} height={hill(i)} active={i === active} />
      ))}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <line x1={SUM.x(i)} y1={SUM.y(0)} x2={SUM.x(i)} y2={SUM.y(hill(i))} stroke={L.plus} strokeWidth={1} strokeDasharray="3 3" />
          <Dot cx={SUM.x(i)} cy={SUM.y(hill(i))} color={i === active ? L.focus : L.plus} r={i === active ? 4 : 3} />
          <Lbl x={SUM.x(i)} y={SUM.y(0) + 15} text={names[i]} color={i === active ? L.focus : L.dim} size={10.5} anchor="middle" />
        </g>
      ))}
      <Lbl x={66} y={22} text="代表点は各区間の左端と約束する" color={L.text} size={11} />
      <Lbl x={66} y={44} text={`高さに使うのは f(${names[active]})`} color={L.focus} size={10.5} />
      <Cap text="点の高さが、その区間の長方形の高さになる" />
    </LevelFig>
  );
}

/** Σ 記号の読み方。 */
export function SumSigma() {
  const t = useT();
  const shown = step(t, 4, 1.2);
  const notes = [
    { y: 52, text: '上 n : 終わりの番号', color: L.focus },
    { y: 80, text: '下 i = 1 : 始まりの番号', color: L.focus },
    { y: 108, text: 'f(xᵢ)Δx : 1本分の量', color: L.plus },
    { y: 136, text: 'i は合計の外に残らない', color: L.dim },
  ];
  return (
    <LevelFig label="シグマ記号の各部分の読み方">
      <Lbl x={62} y={60} text="n" color={shown >= 0 ? L.focus : L.dim} size={13} anchor="middle" />
      <text x={62} y={112} fontSize={40} fill={L.text} textAnchor="middle">Σ</text>
      <Lbl x={62} y={132} text="i = 1" color={shown >= 1 ? L.focus : L.dim} size={12} anchor="middle" />
      <Lbl x={84} y={108} text="f(xᵢ) Δx" color={shown >= 2 ? L.plus : L.text} size={14} />
      {notes.map((note, i) => (
        <Lbl key={note.text} x={170} y={note.y} text={note.text} color={i <= shown ? note.color : L.dim} size={10} />
      ))}
      <Lbl x={14} y={108} text="Sₙ =" color={L.text} size={13} />
      <Lbl x={160} y={158} text="項の個数は n 個。番号順に足す" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="Σの下と上が、番号の始まりと終わりを指定する" />
    </LevelFig>
  );
}

/** n を増やすと和が 8 に近づく（f(x)=x、範囲 0〜4、左端代表）。 */
export function SumRefine() {
  const t = useT();
  const n = [4, 8, 16][step(t, 3, 1.6)];
  const dx = 4 / n;
  const sum = Array.from({ length: n }, (_, i) => lin(i * dx) * dx).reduce((a, b) => a + b, 0);
  const m = mapper([0, 4.4], [0, 4.6], { x0: 46, y0: 30, x1: 262, y1: 146 });
  return (
    <LevelFig label="分割を細かくすると和が8に近づく">
      <Axes m={m} xLabel="x" yLabel="f(x) = x" />
      {Array.from({ length: n }, (_, i) => (
        <Bar key={i} m={m} x0={i * dx} x1={(i + 1) * dx} height={lin(i * dx)} active={i === n - 1} />
      ))}
      <Curve m={m} f={lin} color={L.field} xa={0} xb={4} />
      <Lbl x={66} y={22} text={`n = ${n} 個、Δx = ${fmt(dx, 2)}`} color={L.text} size={11.5} />
      <Lbl x={66} y={44} text={`Sₙ = ${fmt(sum, 2)}`} color={L.focus} size={12} bold />
      <Lbl x={66} y={64} text={`8 との差 ${fmt(8 - sum, 2)}`} color={L.minus} size={10.5} />
      <Lbl x={160} y={158} text="左端を使うので、いつも 8 より小さい" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="棒が細くなるほど、和と8の差が小さくなる" />
    </LevelFig>
  );
}

/** ∫ 記号の各部分。 */
export function SumIntegralSymbol() {
  const t = useT();
  const shown = step(t, 4, 1.2);
  const notes = [
    { y: 52, text: '上端 b : 範囲の右端', color: L.focus },
    { y: 80, text: '下端 a : 範囲の左端', color: L.focus },
    { y: 108, text: 'f(x) : その場所の高さ', color: L.plus },
    { y: 136, text: 'dx : Δx を細かくし切った幅', color: L.plus },
  ];
  return (
    <LevelFig label="積分記号の各部分の読み方">
      <Lbl x={56} y={54} text="b" color={shown >= 0 ? L.focus : L.dim} size={13} anchor="middle" />
      <text x={42} y={116} fontSize={44} fill={L.text} textAnchor="middle">∫</text>
      <Lbl x={56} y={134} text="a" color={shown >= 1 ? L.focus : L.dim} size={13} anchor="middle" />
      <Lbl x={70} y={104} text="f(x)" color={shown >= 2 ? L.plus : L.text} size={14} />
      <Lbl x={112} y={104} text="dx" color={shown >= 3 ? L.plus : L.text} size={14} />
      {notes.map((note, i) => (
        <Lbl key={note.text} x={158} y={note.y} text={note.text} color={i <= shown ? note.color : L.dim} size={10} />
      ))}
      <Lbl x={20} y={26} text="分割を限りなく細かくした行き先" color={L.dim} size={10.5} />
      <Lbl x={160} y={158} text="∫ は和の記号を引き伸ばした形" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="Σの下と上にあたるものが、∫では下端と上端" />
    </LevelFig>
  );
}

/** f(x)dx の1本を取り出して見る。 */
export function SumFdxPiece() {
  const t = useT();
  const u = pingPong(t, 8);
  const n = 26, dx = 4 / n;
  const k = Math.max(1, Math.min(n - 2, Math.round(u * (n - 1))));
  const xc = (k + 0.5) * dx;
  return (
    <LevelFig label="細い長方形1本の中身">
      <Axes m={SUM} xLabel="x" yLabel="f(x)" />
      {Array.from({ length: n }, (_, i) => (
        <Bar key={i} m={SUM} x0={i * dx} x1={(i + 1) * dx} height={hill((i + 0.5) * dx)} active={i === k} />
      ))}
      <Curve m={SUM} f={hill} color={L.field} xa={0} xb={4} />
      <Panel x={186} y={36} w={112} h={62} color={L.focus} />
      <Lbl x={196} y={54} text={`高さ f(x) = ${fmt(hill(xc), 2)}`} color={L.plus} size={10} />
      <Lbl x={196} y={72} text={`幅 dx = ${fmt(dx, 2)}`} color={L.focus} size={10} />
      <Lbl x={196} y={90} text={`1本 = ${fmt(hill(xc) * dx, 3)}`} color={L.text} size={10} />
      <Lbl x={66} y={22} text="f(x) dx は長方形1本分の量" color={L.text} size={11} />
      <Lbl x={160} y={158} text="∫ はこの1本を範囲いっぱい足す指示" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="金色の1本が f(x)dx。面積ではなく小片の量と読む" />
    </LevelFig>
  );
}

/** 同じ形の和が、物理では何になるか。 */
export function SumMeanings() {
  const t = useT();
  const which = step(t, 3, 1.6);
  const rows = [
    { a: '速度 [m/s] × 時間 [s]', b: '→ 距離 [m]' },
    { a: '力 [N] × 距離 [m]', b: '→ 仕事 [J]（N·m）' },
    { a: '電場 [N/C] × 距離 [m]', b: '→ 単位電荷あたりの仕事 [J/C]' },
  ];
  return (
    <LevelFig label="高さと幅の単位が合計の単位を決める">
      {rows.map((row, i) => (
        <g key={row.a}>
          <Panel x={18} y={26 + i * 40} w={284} h={34} color={i === which ? L.focus : L.dim} on={i === which} />
          <Lbl x={30} y={41 + i * 40} text={row.a} color={L.text} size={11} />
          <Lbl x={44} y={56 + i * 40} text={row.b} color={i === which ? L.focus : L.dim} size={10.5} />
        </g>
      ))}
      <Lbl x={160} y={158} text="足し算では単位が変わらない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="掛ける2つの単位から、合計の単位が決まる" />
    </LevelFig>
  );
}

/** 上端と下端を入れ替えると符号が反転する。 */
export function SumSwap() {
  const t = useT();
  const forward = step(t, 2, 2.0) === 0;
  const n = 8, dx = 4 / n;
  return (
    <LevelFig label="範囲の向きを入れ替えると符号が反転する">
      <Axes m={SUM} xLabel="x" yLabel="f(x)" />
      {Array.from({ length: n }, (_, i) => (
        <Bar key={i} m={SUM} x0={i * dx} x1={(i + 1) * dx} height={hill((i + 0.5) * dx)}
          color={forward ? L.plus : L.minus} />
      ))}
      <Curve m={SUM} f={hill} color={L.field} xa={0} xb={4} />
      {forward
        ? <Arw x={SUM.x(0.15)} y={SUM.y(0) + 15} dx={SUM.x(1.6) - SUM.x(0.15)} dy={0} color={L.plus} w={2.5} />
        : <Arw x={SUM.x(1.6)} y={SUM.y(0) + 15} dx={SUM.x(0.15) - SUM.x(1.6)} dy={0} color={L.minus} w={2.5} />}
      <Lbl x={66} y={22} text={forward ? 'a から b へ たどる' : 'b から a へ たどる'} color={L.text} size={11.5} />
      <Lbl x={66} y={44} text={forward ? '値は + 5' : '値は − 5'} color={forward ? L.plus : L.minus} size={12.5} bold />
      <Lbl x={248} y={161} text="大きさは同じ" color={L.dim} size={10} anchor="end" />
      <Cap text="矢印の向きが入れ替わると、棒の色と符号も入れ替わる" />
    </LevelFig>
  );
}

/** Σ と ∫ の対応表。 */
export function SumSigmaVsIntegral() {
  const t = useT();
  const row = step(t, 3, 1.5);
  const rows = [
    { k: '足す部品', a: '値 × 幅', b: '値 × 幅' },
    { k: '個数', a: '有限 n 個', b: '限りなく細かく' },
    { k: '書き方', a: 'Σ f(xᵢ) Δx', b: '∫ f(x) dx' },
  ];
  return (
    <LevelFig label="シグマと積分の対応表">
      <Lbl x={24} y={34} text="くらべる点" color={L.dim} size={10} />
      <Lbl x={122} y={34} text="Σ" color={L.field} size={13} bold />
      <Lbl x={216} y={34} text="∫" color={L.focus} size={14} bold />
      {rows.map((r0, i) => (
        <g key={r0.k}>
          <Panel x={16} y={44 + i * 34} w={288} h={28} color={i === row ? L.focus : L.dim} on={i === row} />
          <Lbl x={24} y={62 + i * 34} text={r0.k} color={L.dim} size={10} />
          <Lbl x={110} y={62 + i * 34} text={r0.a} color={L.field} size={10.5} />
          <Lbl x={204} y={62 + i * 34} text={r0.b} color={L.focus} size={10.5} />
        </g>
      ))}
      <Lbl x={160} y={158} text="足す操作は同じ。細かさの約束だけが違う" color={L.plus} size={10.5} anchor="middle" />
      <Cap text="1行目が同じで、2行目だけが違うことを確かめる" />
    </LevelFig>
  );
}

// =====================================================================
// 3. um-inner-product — 内積
// =====================================================================

/** 床と箱。 */
function Cart({ x, y = 112 }: { x: number; y?: number }) {
  return <rect x={x - 17} y={y - 13} width={34} height={26} rx={5} fill={L.field} opacity={0.85} />;
}

/** 斜めの力のうち、進む向きに揃った成分だけが効く。 */
export function DotCosStart() {
  const t = useT();
  const u = pingPong(t, 7);
  const cx = 120 + 80 * u;
  const th = (53 * Math.PI) / 180;
  const len = 60;
  return (
    <LevelFig label="斜めの力の進む向きの成分">
      <line x1={16} y1={126} x2={304} y2={126} stroke={L.dim} strokeWidth={2} />
      <Cart x={cx} />
      <Arw x={cx} y={112} dx={len * Math.cos(th)} dy={-len * Math.sin(th)} color={L.field} w={3} />
      <Lbl x={cx + len * Math.cos(th) + 4} y={112 - len * Math.sin(th) - 4} text="F = 5 N" color={L.field} size={10.5} />
      <Arw x={cx} y={112} dx={len * Math.cos(th)} dy={0} color={L.focus} w={4.5} />
      <line x1={cx + len * Math.cos(th)} y1={112} x2={cx + len * Math.cos(th)} y2={112 - len * Math.sin(th)}
        stroke={L.dim} strokeDasharray="4 3" />
      <Lbl x={cx + 24} y={106} text="θ = 53°" color={L.dim} size={9.5} />
      <Lbl x={18} y={32} text="進むのは右へ 2 m" color={L.text} size={11} />
      <Lbl x={18} y={54} text="効く成分 F cosθ = 3 N" color={L.focus} size={11} />
      <Lbl x={18} y={76} text="W = 3 N × 2 m = 6 J" color={L.plus} size={11.5} />
      <Cap text="太い横矢印が、進む向きに揃った成分" />
    </LevelFig>
  );
}

/** 同じ掛け算に、内積という名前と記号を与える。 */
export function DotNotation() {
  const t = useT();
  const shown = step(t, 3, 1.4);
  const ox = 70, oy = 120;
  const th = (53 * Math.PI) / 180;
  return (
    <LevelFig label="内積の記号と、答えが1つの数であること">
      <Arw x={ox} y={oy} dx={58 * Math.cos(th)} dy={-58 * Math.sin(th)} color={L.field} w={3} />
      <Arw x={ox} y={oy} dx={62} dy={0} color={L.path} w={3} />
      <Lbl x={ox + 40} y={oy - 52} text="F" color={L.field} size={12} bold />
      <Lbl x={ox + 66} y={oy + 14} text="Δr" color={L.path} size={12} bold />
      <Lbl x={ox + 12} y={oy - 6} text="θ" color={L.dim} size={10} />
      <Panel x={146} y={36} w={158} h={34} color={L.dim} on={shown >= 0} />
      <Lbl x={225} y={58} text="F Δr cosθ" color={L.text} size={13} anchor="middle" />
      <Panel x={146} y={78} w={158} h={34} color={L.focus} on={shown >= 1} />
      <Lbl x={225} y={100} text="F · Δr" color={shown >= 1 ? L.focus : L.dim} size={14} anchor="middle" bold />
      <Lbl x={225} y={146} text={shown >= 2 ? '= 6 J（1つの数）' : ''} color={L.plus} size={12} anchor="middle" />
      <Lbl x={18} y={28} text="同じ量に、点の記号を与える" color={L.dim} size={10.5} />
      <Cap text="矢印2本から出てくるのは、向きを持たない1つの数" />
    </LevelFig>
  );
}

/** 角度を毎回測るのは面倒、という疑問。 */
export function DotAngleProblem() {
  const t = useT();
  const blink = 0.4 + 0.45 * Math.sin(4 * t);
  const pairs = [
    { x: 66, y: 74, a: 20, b: 95 },
    { x: 172, y: 74, a: -35, b: 60 },
    { x: 262, y: 74, a: 10, b: 155 },
  ];
  return (
    <LevelFig label="角度を測るのが難しい場面">
      {pairs.map(p => {
        const ra = (p.a * Math.PI) / 180, rb = (p.b * Math.PI) / 180;
        return (
          <g key={p.x}>
            <Arw x={p.x} y={p.y} dx={40 * Math.cos(ra)} dy={-40 * Math.sin(ra)} color={L.field} w={2.4} />
            <Arw x={p.x} y={p.y} dx={40 * Math.cos(rb)} dy={-40 * Math.sin(rb)} color={L.path} w={2.4} />
            <g opacity={blink}>
              <Lbl x={p.x} y={p.y + 30} text="θ = ?" color={L.minus} size={11} anchor="middle" />
            </g>
          </g>
        );
      })}
      <Lbl x={18} y={26} text="組み合わせごとに角度が違う" color={L.text} size={11} />
      <Lbl x={160} y={132} text="毎回なす角を測るのは手間がかかる" color={L.dim} size={11} anchor="middle" />
      <Lbl x={160} y={154} text="角度を使わない計算法はないだろうか" color={L.minus} size={11} anchor="middle" />
      <Cap text="矢印の組ごとに角が違う。測らずに済ませたい" />
    </LevelFig>
  );
}

const VEC = mapper([-1.2, 5], [-1.2, 5], { x0: 30, y0: 26, x1: 150, y1: 146 });

/** 成分どうしを掛けて足す。 */
export function DotComponents() {
  const t = useT();
  const which = step(t, 2, 1.6);
  const o = { x: VEC.x(0), y: VEC.y(0) };
  return (
    <LevelFig label="成分どうしを掛けて足す内積">
      <line x1={VEC.x(-1.2)} y1={o.y} x2={VEC.x(5)} y2={o.y} stroke={L.dim} strokeWidth={1.2} />
      <line x1={o.x} y1={VEC.y(-1.2)} x2={o.x} y2={VEC.y(5)} stroke={L.dim} strokeWidth={1.2} />
      <Arw x={o.x} y={o.y} dx={VEC.x(3) - o.x} dy={VEC.y(4) - o.y} color={L.field} w={2.6} />
      <Arw x={o.x} y={o.y} dx={VEC.x(2) - o.x} dy={0} color={L.path} w={2.6} />
      <line x1={VEC.x(3)} y1={VEC.y(4)} x2={VEC.x(3)} y2={o.y} stroke={L.field} strokeDasharray="3 3" opacity={0.7} />
      <Lbl x={VEC.x(3) + 4} y={VEC.y(4) - 4} text="A = (3, 4)" color={L.field} size={10} />
      <Lbl x={VEC.x(2) + 4} y={o.y + 14} text="B = (2, 0)" color={L.path} size={10} />
      <Panel x={164} y={38} w={140} h={32} color={L.plus} on={which === 0} />
      <Lbl x={234} y={58} text="AxBx = 3 × 2 = 6" color={which === 0 ? L.plus : L.dim} size={11} anchor="middle" />
      <Panel x={164} y={76} w={140} h={32} color={L.plus} on={which === 1} />
      <Lbl x={234} y={96} text="AyBy = 4 × 0 = 0" color={which === 1 ? L.plus : L.dim} size={11} anchor="middle" />
      <Lbl x={234} y={128} text="A · B = 6 + 0 = 6" color={L.focus} size={12} anchor="middle" bold />
      <Cap text="同じ軸の成分どうしだけを掛け、あとで足す" />
    </LevelFig>
  );
}

/** 成分での計算と、角度での計算が一致する。 */
export function DotCheck() {
  const t = useT();
  const which = step(t, 2, 1.8);
  const o = { x: VEC.x(0), y: VEC.y(0) };
  return (
    <LevelFig label="成分の計算と角度の計算が一致する">
      <line x1={VEC.x(-1.2)} y1={o.y} x2={VEC.x(5)} y2={o.y} stroke={L.dim} strokeWidth={1.2} />
      <line x1={o.x} y1={VEC.y(-1.2)} x2={o.x} y2={VEC.y(5)} stroke={L.dim} strokeWidth={1.2} />
      <Arw x={o.x} y={o.y} dx={VEC.x(3) - o.x} dy={VEC.y(4) - o.y} color={L.field} w={2.6} />
      <Arw x={o.x} y={o.y} dx={VEC.x(2) - o.x} dy={0} color={L.path} w={2.6} />
      <Lbl x={VEC.x(3) + 2} y={VEC.y(4) - 4} text="F = (3,4) N" color={L.field} size={9.5} />
      <Lbl x={VEC.x(2) + 4} y={o.y + 14} text="Δr = (2,0) m" color={L.path} size={9.5} />
      <Lbl x={o.x + 10} y={o.y - 8} text="θ ≈ 53°" color={L.dim} size={9.5} />
      <Panel x={160} y={40} w={144} h={36} color={L.plus} on={which === 0} />
      <Lbl x={232} y={56} text="成分で計算" color={L.dim} size={9.5} anchor="middle" />
      <Lbl x={232} y={70} text="3×2 + 4×0 = 6 J" color={which === 0 ? L.plus : L.dim} size={11} anchor="middle" />
      <Panel x={160} y={84} w={144} h={36} color={L.focus} on={which === 1} />
      <Lbl x={232} y={100} text="大きさと cosθ で計算" color={L.dim} size={9.5} anchor="middle" />
      <Lbl x={232} y={114} text="5×2×0.6 = 6 J" color={which === 1 ? L.focus : L.dim} size={11} anchor="middle" />
      <Lbl x={232} y={140} text="どちらも 6 J" color={L.text} size={12} anchor="middle" bold />
      <Cap text="2つの枠の答えが同じ値になることを確かめる" />
    </LevelFig>
  );
}

/** 直角なら内積は0。 */
export function DotPerpendicular() {
  const t = useT();
  const u = pingPong(t, 6);
  const cx = 96 + 90 * u;
  return (
    <LevelFig label="直角なら内積は0">
      <line x1={16} y1={126} x2={304} y2={126} stroke={L.dim} strokeWidth={2} />
      <Cart x={cx} />
      <Arw x={cx} y={112} dx={0} dy={-56} color={L.field} w={3} />
      <Lbl x={cx + 6} y={54} text="F = (0, 4) N" color={L.field} size={10.5} />
      <Arw x={cx} y={112} dx={56} dy={0} color={L.path} w={3} />
      <Lbl x={cx + 8} y={142} text="Δr = (2, 0) m" color={L.path} size={10} />
      <rect x={cx} y={112 - 12} width={12} height={12} fill="none" stroke={L.dim} strokeWidth={1.2} />
      <Lbl x={18} y={30} text="力は真上、移動は真横" color={L.text} size={11} />
      <Lbl x={18} y={50} text="0×2 + 4×0 = 0 J" color={L.minus} size={12} />
      <Lbl x={18} y={70} text="cos90° = 0" color={L.dim} size={10.5} />
      <Cap text="進む向きに揃った成分が1つもないので0になる" />
    </LevelFig>
  );
}

/** 逆向きなら内積は負。 */
export function DotNegative() {
  const t = useT();
  const u = pingPong(t, 6);
  const cx = 110 + 80 * u;
  return (
    <LevelFig label="逆向きの力では内積が負になる">
      <line x1={16} y1={126} x2={304} y2={126} stroke={L.dim} strokeWidth={2} />
      <Cart x={cx} />
      <Arw x={cx - 18} y={112} dx={-50} dy={0} color={L.minus} w={3} />
      <Lbl x={cx - 72} y={104} text="F = (−3, 0) N" color={L.minus} size={10} />
      <Arw x={cx + 18} y={84} dx={52} dy={0} color={L.path} w={3} />
      <Lbl x={cx + 22} y={76} text="Δr = (2, 0) m" color={L.path} size={10} />
      <Lbl x={18} y={30} text="力と移動が正反対を向く" color={L.text} size={11} />
      <Lbl x={18} y={50} text="(−3)×2 + 0×0 = −6 J" color={L.minus} size={12} />
      <Lbl x={18} y={70} text="cos180° = −1" color={L.dim} size={10.5} />
      <Cap text="負の値は、進む向きと逆に引かれていることの印" />
    </LevelFig>
  );
}

/** 大きさだけを掛ける誤り。 */
export function DotMagnitudeTrap() {
  const t = useT();
  const blink = 0.45 + 0.4 * Math.sin(4 * t);
  return (
    <LevelFig label="大きさだけを掛ける誤りとの比較">
      <Panel x={16} y={32} w={138} h={104} color={L.minus} />
      <Lbl x={85} y={52} text="大きさだけ掛ける" color={L.minus} size={11} anchor="middle" />
      <Lbl x={85} y={78} text="5 N × 2 m" color={L.text} size={12} anchor="middle" />
      <Lbl x={85} y={100} text="= 10 J" color={L.text} size={13} anchor="middle" />
      <g opacity={blink}>
        <Lbl x={85} y={124} text="向きを落としている" color={L.minus} size={10.5} anchor="middle" />
      </g>
      <Panel x={166} y={32} w={138} h={104} color={L.plus} />
      <Lbl x={235} y={52} text="内積で計算する" color={L.plus} size={11} anchor="middle" />
      <Lbl x={235} y={78} text="3×2 + 4×0" color={L.text} size={12} anchor="middle" />
      <Lbl x={235} y={100} text="= 6 J" color={L.plus} size={13} anchor="middle" bold />
      <Lbl x={235} y={124} text="cosθ = 0.6 が効く" color={L.plus} size={10.5} anchor="middle" />
      <Lbl x={160} y={156} text="10 J は真正面に押した場合の値" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="左が誤り、右が正しい。差は向きのずれの分" />
    </LevelFig>
  );
}

/** 角度を変えると、内積の値と符号が変わる。 */
export function DotProjection() {
  const [deg, setDeg] = useManual(time => 180 * pingPong(time, 10));
  const th = (deg * Math.PI) / 180;
  const ox = 228, oy = 110, len = 56;
  const value = 5 * 2 * Math.cos(th);
  const proj = len * Math.cos(th);
  const color = value >= 0 ? L.plus : L.minus;
  return (
    <>
      <LevelFig label="角度による内積の値の変わり方">
        <line x1={40} y1={oy} x2={296} y2={oy} stroke={L.dim} strokeWidth={1.2} />
        <Arw x={ox} y={oy} dx={60} dy={0} color={L.path} w={3} />
        <Lbl x={ox + 30} y={oy + 16} text="Δr = 2 m" color={L.path} size={10} anchor="middle" />
        <Arw x={ox} y={oy} dx={len * Math.cos(th)} dy={-len * Math.sin(th)} color={L.field} w={3} />
        <Lbl x={ox + len * Math.cos(th)} y={oy - len * Math.sin(th) - 8} text="F = 5 N" color={L.field} size={10} anchor="middle" />
        {Math.abs(proj) > 1 && <Arw x={ox} y={oy + 30} dx={proj} dy={0} color={color} w={4.5} />}
        <line x1={ox + proj} y1={oy} x2={ox + proj} y2={oy - len * Math.sin(th)} stroke={L.dim} strokeDasharray="3 3" />
        <Lbl x={66} y={26} text={`θ = ${Math.round(deg)}°、cosθ = ${fmt(Math.cos(th), 2)}`} color={L.text} size={11} />
        <Lbl x={66} y={50} text={`F · Δr = ${fmt(value, 2)} J`} color={color} size={11} bold />
        <Lbl x={160} y={152} text="0°で最大、90°で0、180°で最小" color={L.dim} size={10.5} anchor="middle" />
        <Cap text="太い横矢印が、進む向きに揃った成分。左向きなら負" />
      </LevelFig>
      <FigSlider label="なす角 θ [度]" value={deg} min={0} max={180} step={1} onChange={setDeg} display={`${Math.round(deg)}°`} />
    </>
  );
}

// =====================================================================
// 4. um-path-pieces — 曲がった道を折れ線で
// =====================================================================

/** 道の骨組み。4分割したときの頂点がちょうどこの5点になる。 */
const KNOTS: [number, number][] = [[0, 0], [1, 1], [2, 2], [3, 0.5], [4, -1]];

/** Catmull-Rom で骨組みの間をなめらかに補間する。s は 0〜4。 */
function pathAt(s: number): [number, number] {
  const clamp = (i: number) => KNOTS[Math.max(0, Math.min(KNOTS.length - 1, i))];
  const i = Math.max(0, Math.min(KNOTS.length - 2, Math.floor(s)));
  const u = s - i;
  const p0 = clamp(i - 1), p1 = clamp(i), p2 = clamp(i + 1), p3 = clamp(i + 2);
  const at = (k: 0 | 1) => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * u
    + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u * u
    + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u * u * u);
  return [at(0), at(1)];
}

function samples(n: number): [number, number][] {
  return Array.from({ length: n + 1 }, (_, i) => pathAt((4 * i) / n));
}

function polylineLength(pts: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return total;
}

const PATH = mapper([-0.4, 4.6], [-1.7, 2.7], { x0: 40, y0: 34, x1: 292, y1: 148 });

function toScreen(p: [number, number]) {
  return `${PATH.x(p[0]).toFixed(1)},${PATH.y(p[1]).toFixed(1)}`;
}

/** 下向き一定の重力の矢印を、背景に並べる。 */
function GravityField() {
  return (
    <g opacity={0.55}>
      {[0.4, 1.4, 2.4, 3.4, 4.3].map(x => (
        <Arw key={x} x={PATH.x(x)} y={PATH.y(2.6)} dx={0} dy={PATH.y(2.0) - PATH.y(2.6)} color={L.field} w={2} head={6} />
      ))}
    </g>
  );
}

/** まっすぐな1辺の寄与は、内積1回。 */
export function PathStraight() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  const m = mapper([-0.4, 2.2], [-0.4, 2.2], { x0: 46, y0: 34, x1: 166, y1: 148 });
  return (
    <LevelFig label="まっすぐな1辺の寄与は内積1回">
      <line x1={m.x(-0.4)} y1={m.y(0)} x2={m.x(2.2)} y2={m.y(0)} stroke={L.dim} strokeWidth={1.2} />
      <line x1={m.x(0)} y1={m.y(-0.4)} x2={m.x(0)} y2={m.y(2.2)} stroke={L.dim} strokeWidth={1.2} />
      <Arw x={m.x(0)} y={m.y(0)} dx={m.x(1) - m.x(0)} dy={m.y(1) - m.y(0)} color={L.path} w={3} />
      <Lbl x={m.x(1) + 4} y={m.y(1) + 2} text="Δr = (1, 1) m" color={L.path} size={9.5} />
      <g opacity={glow}>
        <Arw x={m.x(0.5)} y={m.y(0.5)} dx={0} dy={m.y(0) - m.y(0.5)} color={L.field} w={3} />
      </g>
      <Lbl x={m.x(0.5) + 5} y={m.y(0.25)} text="F = (0, −2) N" color={L.field} size={9.5} />
      <Panel x={186} y={48} w={118} h={70} color={L.minus} />
      <Lbl x={245} y={68} text="F · Δr" color={L.text} size={11.5} anchor="middle" />
      <Lbl x={245} y={88} text="0×1 + (−2)×1" color={L.text} size={10.5} anchor="middle" />
      <Lbl x={245} y={108} text="= −2 J" color={L.minus} size={13} anchor="middle" bold />
      <Lbl x={18} y={26} text="上りなので、寄与は負になる" color={L.dim} size={10.5} />
      <Lbl x={170} y={134} text="x [m]" color={L.dim} size={9.5} />
      <Lbl x={m.x(0) - 6} y={40} text="y [m]" color={L.dim} size={9.5} anchor="end" />
      <Cap text="力は下向き、移動は右上向き。角が90°を超えている" />
    </LevelFig>
  );
}

/** 曲がった道では Δr が1本に決まらない。 */
export function PathCurveQuestion() {
  const t = useT();
  const blink = 0.35 + 0.45 * Math.sin(4 * t);
  const fine = samples(60);
  return (
    <LevelFig label="曲がった道では変位が1本に決まらない">
      <GravityField />
      <polyline points={fine.map(toScreen).join(' ')} fill="none" stroke={L.path} strokeWidth={2.6} strokeLinejoin="round" />
      <Dot cx={PATH.x(0)} cy={PATH.y(0)} color={L.plus} />
      <Dot cx={PATH.x(4)} cy={PATH.y(-1)} color={L.plus} />
      <g opacity={blink}>
        <Arw x={PATH.x(0)} y={PATH.y(0)} dx={PATH.x(4) - PATH.x(0)} dy={PATH.y(-1) - PATH.y(0)} color={L.minus} w={2} />
        <Lbl x={PATH.x(2.2)} y={PATH.y(0.1)} text="これは道の向きではない" color={L.minus} size={10} anchor="middle" />
      </g>
      <Lbl x={18} y={26} text="進む向きが場所ごとに変わる" color={L.text} size={11} />
      <Lbl x={160} y={160} text="掛けるべき Δr をどう決めるのか" color={L.minus} size={10.5} anchor="middle" />
      <Cap text="始点と終点を結ぶ矢印では、途中の向きを表せない" />
    </LevelFig>
  );
}

/** 曲線を4辺の折れ線に置きかえる。 */
export function PathPolyline() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.9), 4);
  const fine = samples(60);
  const pts = samples(4);
  return (
    <LevelFig label="曲線を4辺の折れ線に置きかえる">
      <polyline points={fine.map(toScreen).join(' ')} fill="none" stroke={L.dim} strokeWidth={2} strokeLinejoin="round" />
      <polyline points={pts.slice(0, shown + 1).map(toScreen).join(' ')} fill="none" stroke={L.path} strokeWidth={3} strokeLinejoin="round" />
      {pts.map((p, i) => (
        <Dot key={i} cx={PATH.x(p[0])} cy={PATH.y(p[1])} color={i <= shown ? L.focus : L.dim} r={i <= shown ? 4 : 3} />
      ))}
      <Lbl x={18} y={26} text="頂点は曲線の上に取る" color={L.text} size={11} />
      <Lbl x={18} y={46} text={`つないだ辺 ${shown} / 4`} color={L.focus} size={11} />
      <Lbl x={160} y={160} text="1辺の中では、向きが1つに決まる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="細い線が元の曲線、太い線が置きかえた折れ線" />
    </LevelFig>
  );
}

const EDGE_WORK = [-2, -2, 3, 3];

/** 1辺を取り出すと、位置・変位・力が決まる。 */
export function PathOneEdge() {
  const t = useT();
  const k = step(t, 4, 1.4);
  const pts = samples(4);
  const a = pts[k], b = pts[k + 1];
  const mid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return (
    <LevelFig label="1辺で決まる位置と変位と力">
      <polyline points={pts.map(toScreen).join(' ')} fill="none" stroke={L.dim} strokeWidth={2} strokeLinejoin="round" />
      <line x1={PATH.x(a[0])} y1={PATH.y(a[1])} x2={PATH.x(b[0])} y2={PATH.y(b[1])} stroke={L.path} strokeWidth={3.4} />
      <Arw x={PATH.x(a[0])} y={PATH.y(a[1])} dx={PATH.x(b[0]) - PATH.x(a[0])} dy={PATH.y(b[1]) - PATH.y(a[1])} color={L.focus} w={2.6} />
      <Dot cx={PATH.x(mid[0])} cy={PATH.y(mid[1])} color={L.plus} r={4} />
      <Arw x={PATH.x(mid[0])} y={PATH.y(mid[1])} dx={0} dy={PATH.y(mid[1] - 0.6) - PATH.y(mid[1])} color={L.field} w={2.6} />
      <Plate x={12} y={16} w={152} h={76} />
      <Lbl x={18} y={30} text={`辺 ${k + 1} を取り出す`} color={L.text} size={11} />
      <Lbl x={18} y={48} text={`rᵢ = (${fmt(mid[0], 1)}, ${fmt(mid[1], 1)}) m`} color={L.plus} size={10.5} />
      <Lbl x={18} y={66} text={`Δrᵢ = (${fmt(b[0] - a[0], 1)}, ${fmt(b[1] - a[1], 1)}) m`} color={L.focus} size={10.5} />
      <Lbl x={18} y={84} text="F(rᵢ) = (0, −2) N" color={L.field} size={10.5} />
      <Lbl x={160} y={160} text={`この辺の寄与 ${fmt(EDGE_WORK[k], 1)} J`} color={EDGE_WORK[k] >= 0 ? L.plus : L.minus} size={11} anchor="middle" />
      <Cap text="代表の位置・変位・その場所の力の3つが揃う" />
    </LevelFig>
  );
}

/** 辺ごとに角度が違い、寄与の符号が混ざる。 */
export function PathAngles() {
  const t = useT();
  const k = step(t, 4, 1.3);
  const pts = samples(4);
  return (
    <LevelFig label="辺ごとに角度が違い符号が混ざる">
      <polyline points={pts.map(toScreen).join(' ')} fill="none" stroke={L.path} strokeWidth={2.6} strokeLinejoin="round" />
      {pts.slice(0, 4).map((a, i) => {
        const b = pts[i + 1];
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const w = EDGE_WORK[i];
        return (
          <g key={i}>
            <Arw x={PATH.x(mx)} y={PATH.y(my)} dx={0} dy={PATH.y(my - 0.55) - PATH.y(my)}
              color={i === k ? L.field : L.dim} w={i === k ? 2.8 : 1.8} head={6} />
            <Lbl x={PATH.x(mx) + (i === 1 ? 13 : 8)} y={PATH.y(my) + (i === 1 ? 22 : -6)} text={`${w > 0 ? '+' : '−'}${Math.abs(w)} J`}
              color={w >= 0 ? L.plus : L.minus} size={10.5} bold={i === k} />
          </g>
        );
      })}
      <Plate x={12} y={16} w={228} h={42} />
      <Lbl x={18} y={30} text="重力は下向き 2 N で一定" color={L.text} size={11} />
      <Lbl x={18} y={50} text={k < 2 ? '上りの辺 → 角が90°を超える → 負' : '下りの辺 → 角が90°より小さい → 正'}
        color={k < 2 ? L.minus : L.plus} size={10.5} />
      <Lbl x={160} y={160} text="同じ道の中で、符号が混ざる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="上りの2辺が負、下りの2辺が正になっている" />
    </LevelFig>
  );
}

/** 辺ごとの寄与を、順に足していく。 */
export function PathSum() {
  const t = useT();
  const shown = Math.min(step(t, 5, 1.0), 4);
  const pts = samples(4);
  const partial = EDGE_WORK.slice(0, shown).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="辺ごとの寄与を順に足していく">
      <polyline points={pts.map(toScreen).join(' ')} fill="none" stroke={L.dim} strokeWidth={2} strokeLinejoin="round" />
      {pts.slice(0, 4).map((a, i) => (
        i < shown ? (
          <line key={i} x1={PATH.x(a[0])} y1={PATH.y(a[1])} x2={PATH.x(pts[i + 1][0])} y2={PATH.y(pts[i + 1][1])}
            stroke={EDGE_WORK[i] >= 0 ? L.plus : L.minus} strokeWidth={3.4} />
        ) : null
      ))}
      <Lbl x={18} y={26} text="W ≈ (−2) + (−2) + 3 + 3" color={L.text} size={11} />
      <Lbl x={18} y={48} text={`ここまでの合計 ${fmt(partial, 1)} J`} color={L.focus} size={12} bold />
      <Lbl x={292} y={48} text={`${shown} / 4 辺`} color={L.dim} size={10.5} anchor="end" />
      <Lbl x={160} y={160} text={shown === 4 ? '合計 2 J（山を越えて少し下がった分）' : '符号を含めて足していく'}
        color={shown === 4 ? L.plus : L.dim} size={10.5} anchor="middle" />
      <Cap text="緑の辺が正の寄与、紫の辺が負の寄与" />
    </LevelFig>
  );
}

/** 辺を増やすと、折れ線が曲線に近づく。 */
export function PathRefine() {
  const t = useT();
  const n = [4, 8, 16][step(t, 3, 1.6)];
  const pts = samples(n);
  const fine = samples(400);
  const len = polylineLength(pts);
  const exact = polylineLength(fine);
  return (
    <LevelFig label="辺を増やすと折れ線が曲線に近づく">
      <polyline points={fine.map(toScreen).join(' ')} fill="none" stroke={L.dim} strokeWidth={2.6} strokeLinejoin="round" />
      <polyline points={pts.map(toScreen).join(' ')} fill="none" stroke={L.path} strokeWidth={2.2} strokeLinejoin="round" />
      {pts.map((p, i) => <Dot key={i} cx={PATH.x(p[0])} cy={PATH.y(p[1])} color={L.focus} r={2.2} />)}
      <Lbl x={18} y={26} text={`辺の数 ${n}`} color={L.text} size={11.5} />
      <Lbl x={18} y={46} text={`折れ線の長さ ${fmt(len, 3)} m`} color={L.path} size={10.5} />
      <Lbl x={18} y={64} text={`曲線との差 ${fmt(exact - len, 3)} m`} color={L.minus} size={10.5} />
      <Lbl x={160} y={160} text={`曲線の長さ ${fmt(exact, 3)} m`} color={L.dim} size={10.5} anchor="middle" />
      <Cap text="辺の数が増えるほど、長さの差が小さくなる" />
    </LevelFig>
  );
}

/** 逆向きにたどると、寄与の符号が全部反転する。 */
export function PathReverse() {
  const t = useT();
  const forward = step(t, 2, 2.0) === 0;
  const pts = samples(4);
  const total = forward ? 2 : -2;
  return (
    <LevelFig label="逆向きにたどると符号が反転する">
      <polyline points={pts.map(toScreen).join(' ')} fill="none" stroke={L.dim} strokeWidth={2.4} strokeLinejoin="round" />
      {pts.slice(0, 4).map((a, i) => {
        const b = pts[i + 1];
        const from = forward ? a : b, to = forward ? b : a;
        const w = forward ? EDGE_WORK[i] : -EDGE_WORK[i];
        return (
          <g key={i}>
            <Arw x={PATH.x(from[0])} y={PATH.y(from[1])} dx={PATH.x(to[0]) - PATH.x(from[0])} dy={PATH.y(to[1]) - PATH.y(from[1])}
              color={w >= 0 ? L.plus : L.minus} w={2.8} />
            <Lbl x={PATH.x((a[0] + b[0]) / 2) + 6} y={PATH.y((a[1] + b[1]) / 2) - 7} text={`${w > 0 ? '+' : '−'}${Math.abs(w)}`}
              color={w >= 0 ? L.plus : L.minus} size={10.5} />
          </g>
        );
      })}
      <Lbl x={18} y={26} text={forward ? '始点から終点へたどる' : '終点から始点へたどる'} color={L.text} size={11} />
      <Lbl x={18} y={48} text={`合計 ${fmt(total, 1)} J`} color={total >= 0 ? L.plus : L.minus} size={12.5} bold />
      <Lbl x={160} y={160} text="力は同じ。変わったのは Δrᵢ の向きだけ" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="矢印が反転すると、各辺の符号がすべて入れ替わる" />
    </LevelFig>
  );
}

/** 辺を限りなく短くした行き先が線積分。 */
export function PathLineIntegral() {
  const t = useT();
  const u = pingPong(t, 7);
  const n = 24;
  const pts = samples(n);
  const filled = Math.max(1, Math.round(n * u));
  return (
    <LevelFig label="辺を限りなく短くした行き先が線積分">
      <polyline points={pts.map(toScreen).join(' ')} fill="none" stroke={L.dim} strokeWidth={2.4} strokeLinejoin="round" />
      <polyline points={pts.slice(0, filled + 1).map(toScreen).join(' ')} fill="none" stroke={L.path} strokeWidth={3} strokeLinejoin="round" />
      {pts.slice(0, filled).filter((_, i) => i % 3 === 0).map((p, i) => (
        <Arw key={i} x={PATH.x(p[0])} y={PATH.y(p[1])} dx={0} dy={PATH.y(p[1] - 0.4) - PATH.y(p[1])} color={L.field} w={1.6} head={5} />
      ))}
      <Plate x={12} y={16} w={186} h={64} />
      <Lbl x={18} y={30} text="辺を短くしていくと" color={L.text} size={11} />
      <Lbl x={18} y={52} text="W = ∫C F · dr" color={L.focus} size={13} bold />
      <Lbl x={18} y={72} text="C は向きを含めた道の名前" color={L.dim} size={10} />
      <Lbl x={160} y={160} text="足す操作は、辺ごとの内積のまま" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="小さな矢印1本ずつが、辺ごとの力の寄与" />
    </LevelFig>
  );
}

// =====================================================================
// 5. um-area-vector — 面積ベクトルと法線
// =====================================================================

/** 水平右向きの場の矢印を並べる。 */
function FieldRows({ rows = [46, 74, 102, 130], from = 20, to = 96, color = L.field }:
  { rows?: number[]; from?: number; to?: number; color?: string }) {
  return (
    <g opacity={0.8}>
      {rows.map(y => <Arw key={y} x={from} y={y} dx={to - from} dy={0} color={color} w={2} head={6} />)}
    </g>
  );
}

/** 面を通る量は、広さと向きで決まる。 */
export function AreaThrough() {
  const [deg, setDeg] = useManual(time => 80 * pingPong(time, 9));
  const th = (deg * Math.PI) / 180;
  const cx = 196, cy = 90, half = 44;
  const ex = half * Math.sin(th), ey = half * Math.cos(th);
  const flux = 2 * 3 * Math.cos(th);
  return (
    <>
      <LevelFig label="面の傾きで通る量が変わる">
        <FieldRows to={150} />
        <line x1={cx - ex} y1={cy - ey} x2={cx + ex} y2={cy + ey} stroke={L.path} strokeWidth={5} strokeLinecap="round" />
        {[46, 74, 102, 130].map(y => (
          <Arw key={y} x={150} y={y} dx={40} dy={0} color={L.field} w={2} head={6} />
        ))}
        <Lbl x={18} y={26} text="広さ 3 m²、場 2 T は変えない" color={L.text} size={11} />
        <Lbl x={18} y={160} text={`傾き ${Math.round(deg)}°`} color={L.dim} size={10.5} />
        <Lbl x={292} y={160} text={`通る量 ${fmt(flux, 2)} Wb`} color={L.focus} size={11.5} anchor="end" bold />
        <Cap text="広さが同じでも、寝かせるほど通る量が減る" />
      </LevelFig>
      <FigSlider label="面の傾き [度]" value={deg} min={0} max={90} step={1} onChange={setDeg} display={`${Math.round(deg)}°`} />
    </>
  );
}

/** 面の中の方向は無数にあり、代表が決まらない。 */
export function AreaOrientationQ() {
  const t = useT();
  const blink = 0.35 + 0.45 * Math.sin(4 * t);
  const cx = 150, cy = 92;
  const dirs = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <LevelFig label="面の中の方向は無数にあって代表が決まらない">
      <ellipse cx={cx} cy={cy} rx={82} ry={40} fill={L.path} opacity={0.18} stroke={L.path} strokeWidth={1.6} />
      {dirs.map(d => {
        const rad = (d * Math.PI) / 180;
        return <Arw key={d} x={cx} y={cy} dx={64 * Math.cos(rad)} dy={-30 * Math.sin(rad)} color={L.dim} w={1.6} head={6} />;
      })}
      <g opacity={blink}>
        <Lbl x={cx} y={cy - 54} text="どれが面の向き?" color={L.minus} size={12} anchor="middle" />
      </g>
      <Lbl x={18} y={26} text="広さは数1つで書ける" color={L.text} size={11} />
      <Lbl x={160} y={152} text="しかし向きは、面の中からは選べない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="面の中の矢印はどれも同格。代表を決められない" />
    </LevelFig>
  );
}

/** 面に垂直な向き（法線）なら、表裏の2つに絞れる。 */
export function AreaNormal() {
  const t = useT();
  const glow = 0.55 + 0.35 * Math.sin(3 * t);
  const cx = 150, cy = 96;
  return (
    <LevelFig label="面に垂直な法線は表裏の2つだけ">
      <ellipse cx={cx} cy={cy} rx={82} ry={38} fill={L.path} opacity={0.16} stroke={L.path} strokeWidth={1.6} />
      <g opacity={glow}>
        <Arw x={cx} y={cy} dx={0} dy={-50} color={L.normal} w={3.2} />
      </g>
      <Arw x={cx} y={cy} dx={0} dy={44} color={L.dim} w={2} />
      <Lbl x={cx + 8} y={cy - 40} text="n（長さ 1）" color={L.normal} size={11} />
      <Lbl x={cx + 8} y={cy + 44} text="裏向きも選べる" color={L.dim} size={10} />
      <Lbl x={18} y={26} text="面に垂直な向きは表と裏の2つだけ" color={L.text} size={11} />
      <Lbl x={160} y={156} text="どちらかに決めて、途中で変えない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="明るい矢印が選んだ法線。長さは1で向きだけを表す" />
    </LevelFig>
  );
}

/** 法線に面積を掛けて、面積ベクトルを作る。 */
export function AreaVectorBuild() {
  const t = useT();
  const u = pingPong(t, 6);
  const cx = 96, cy = 116;
  const len = 22 + 44 * u;
  return (
    <LevelFig label="法線に面積を掛けて面積ベクトルを作る">
      <ellipse cx={cx} cy={cy} rx={56} ry={22} fill={L.path} opacity={0.18} stroke={L.path} strokeWidth={1.4} />
      <Arw x={cx} y={cy} dx={0} dy={-22} color={L.normal} w={2.4} />
      <Arw x={cx} y={cy} dx={0} dy={-len} color={L.focus} w={3.4} />
      <Lbl x={cx + 8} y={cy - len + 4} text={`長さ ${fmt(1 + 2 * u, 2)}`} color={L.focus} size={10} />
      <Lbl x={cx - 62} y={cy + 32} text="面積 ΔA = 3 m²" color={L.path} size={10.5} />
      <Panel x={182} y={40} w={122} h={88} color={L.focus} />
      <Lbl x={243} y={60} text="向き = n（長さ1）" color={L.normal} size={10.5} anchor="middle" />
      <Lbl x={243} y={82} text="長さ = ΔA" color={L.path} size={10.5} anchor="middle" />
      <Lbl x={243} y={110} text="面積ベクトル = n ΔA" color={L.focus} size={10.5} anchor="middle" bold />
      <Lbl x={18} y={26} text="2つの情報を矢印1本にまとめる" color={L.text} size={11} />
      <Cap text="細い矢印が法線、太い矢印が面積ベクトル" />
    </LevelFig>
  );
}

/** 傾いた面を通る量は B ΔA cosθ。 */
export function AreaTilt() {
  const [deg, setDeg] = useManual(time => 90 * pingPong(time, 9));
  const th = (deg * Math.PI) / 180;
  const cx = 186, cy = 92, half = 40;
  const ex = half * Math.sin(th), ey = half * Math.cos(th);
  const nx = 48 * Math.cos(th), ny = -48 * Math.sin(th);
  const flux = 2 * 3 * Math.cos(th);
  return (
    <>
      <LevelFig label="傾いた面を通る量の計算">
        <FieldRows rows={[62, 88, 114, 140]} from={16} to={130} />
        <line x1={cx - ex} y1={cy - ey} x2={cx + ex} y2={cy + ey} stroke={L.path} strokeWidth={5} strokeLinecap="round" />
        <Arw x={cx} y={cy} dx={nx} dy={ny} color={L.normal} w={2.8} />
        <Lbl x={cx + nx + 4} y={cy + ny} text="n" color={L.normal} size={11} />
        <Arw x={cx} y={cy} dx={46} dy={0} color={L.field} w={2.4} />
        <Lbl x={cx + 48} y={cy + 14} text="B = 2 T" color={L.field} size={10} />
        <Lbl x={18} y={26} text={`θ = ${Math.round(deg)}°、cosθ = ${fmt(Math.cos(th), 2)}`} color={L.text} size={11} />
        <Lbl x={18} y={48} text={`Φ = 2 × 3 × ${fmt(Math.cos(th), 2)} = ${fmt(flux, 2)} Wb`} color={L.focus} size={11.5} bold />
        <Lbl x={160} y={158} text="θ は法線と場のなす角" color={L.dim} size={10.5} anchor="middle" />
        <Cap text="法線が場に揃うほど、通る量が大きくなる" />
      </LevelFig>
      <FigSlider label="法線と場のなす角 θ [度]" value={deg} min={0} max={90} step={1} onChange={setDeg} display={`${Math.round(deg)}°`} />
    </>
  );
}

/** 面に沿う矢印を代表に選ぶ誤り。 */
export function AreaInplaneTrap() {
  const t = useT();
  const blink = 0.4 + 0.42 * Math.sin(4 * t);
  return (
    <LevelFig label="法線でなく面に沿う矢印を使う誤り">
      <Panel x={16} y={30} w={138} h={108} color={L.minus} />
      <line x1={85} y1={54} x2={85} y2={104} stroke={L.path} strokeWidth={4} strokeLinecap="round" />
      <Arw x={85} y={79} dx={0} dy={-26} color={L.dim} w={2.4} />
      <Arw x={40} y={79} dx={30} dy={0} color={L.field} w={2} head={6} />
      <g opacity={blink}>
        <Lbl x={85} y={124} text="面に沿う矢印 → 0 Wb" color={L.minus} size={10} anchor="middle" />
      </g>
      <Lbl x={85} y={46} text="誤り" color={L.minus} size={11} anchor="middle" bold />
      <Panel x={166} y={30} w={138} h={108} color={L.plus} />
      <line x1={235} y1={54} x2={235} y2={104} stroke={L.path} strokeWidth={4} strokeLinecap="round" />
      <Arw x={235} y={79} dx={34} dy={0} color={L.normal} w={2.6} />
      <Arw x={190} y={79} dx={30} dy={0} color={L.field} w={2} head={6} />
      <Lbl x={235} y={124} text="法線 → 6 Wb" color={L.plus} size={10} anchor="middle" />
      <Lbl x={235} y={46} text="正しい" color={L.plus} size={11} anchor="middle" bold />
      <Lbl x={160} y={156} text="場は 2 T、面積は 3 m²。正面から貫いている" color={L.dim} size={10} anchor="middle" />
      <Cap text="左は面に沿う矢印を使った誤り、右が法線を使った計算" />
    </LevelFig>
  );
}

/** 曲面を4片に分けて足す。 */
export function AreaSum() {
  const t = useT();
  const k = step(t, 4, 1.2);
  const cx = 100, cy = 94, R = 58;
  const pieces = 4;
  const arc = (Math.PI / 2) * 2 / pieces; // 半径2 m、奥行き1 mの四分円を4片に分けたときの1片の面積 [m²]
  const angle = (i: number) => ((i + 0.5) * (Math.PI / 2)) / pieces;
  const total = Array.from({ length: pieces }, (_, i) => 2 * Math.cos(angle(i)) * arc).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="曲面を小さな平らな片に分けて足す">
      <FieldRows rows={[48, 76, 104, 132]} from={16} to={58} />
      {Array.from({ length: pieces }, (_, i) => {
        const a0 = (i * (Math.PI / 2)) / pieces, a1 = ((i + 1) * (Math.PI / 2)) / pieces;
        const p0 = { x: cx + R * Math.sin(a0), y: cy - R * Math.cos(a0) };
        const p1 = { x: cx + R * Math.sin(a1), y: cy - R * Math.cos(a1) };
        const am = angle(i);
        const mx = cx + R * Math.sin(am), my = cy - R * Math.cos(am);
        return (
          <g key={i}>
            <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={i === k ? L.focus : L.path} strokeWidth={i === k ? 4.5 : 3} />
            <Arw x={mx} y={my} dx={26 * Math.sin(am)} dy={-26 * Math.cos(am)} color={i === k ? L.normal : L.dim} w={i === k ? 2.6 : 1.6} head={6} />
          </g>
        );
      })}
      <Lbl x={196} y={44} text="片ごとに法線の向きが違う" color={L.text} size={10} />
      <Lbl x={196} y={68} text={`片 ${k + 1}: θ = ${fmt((angle(k) * 180) / Math.PI, 1)}°`} color={L.focus} size={10} />
      <Lbl x={196} y={88} text={`寄与 ${fmt(2 * Math.cos(angle(k)) * arc, 3)} Wb`} color={L.plus} size={10} />
      <Lbl x={196} y={112} text={`合計 ${fmt(total, 3)} Wb`} color={L.focus} size={11} bold />
      <Lbl x={196} y={132} text="細かくすると 4 Wb へ" color={L.dim} size={9.5} />
      <Cap text="片ごとの法線の傾きが違うので、寄与も違う" />
    </LevelFig>
  );
}

/** 法線を裏返すと符号が反転する。 */
export function AreaFlip() {
  const t = useT();
  const front = step(t, 2, 2.0) === 0;
  const cx = 150, cy = 92;
  const th = (60 * Math.PI) / 180;
  const half = 40;
  const ex = half * Math.sin(th), ey = half * Math.cos(th);
  const nx = 46 * Math.cos(th) * (front ? 1 : -1), ny = -46 * Math.sin(th) * (front ? 1 : -1);
  return (
    <LevelFig label="法線を裏返すと通る量の符号が反転する">
      <FieldRows rows={[62, 88, 114, 140]} from={16} to={96} />
      <line x1={cx - ex} y1={cy - ey} x2={cx + ex} y2={cy + ey} stroke={L.path} strokeWidth={5} strokeLinecap="round" />
      <Arw x={cx} y={cy} dx={nx} dy={ny} color={front ? L.plus : L.minus} w={3} />
      <Lbl x={cx + nx + (front ? 6 : -6)} y={cy + ny} text="n" color={front ? L.plus : L.minus} size={11} anchor={front ? 'start' : 'end'} />
      <Lbl x={18} y={26} text={front ? '法線を表向きに選ぶ' : '法線を裏向きに選ぶ'} color={L.text} size={11} />
      <Lbl x={18} y={48} text={front ? 'Φ = +3 Wb' : 'Φ = −3 Wb'} color={front ? L.plus : L.minus} size={13} bold />
      <Lbl x={160} y={158} text="面も場も変えていない。変えたのは向きの約束だけ" color={L.dim} size={10} anchor="middle" />
      <Cap text="矢印が裏返るたびに、符号だけが入れ替わる" />
    </LevelFig>
  );
}

/** 片を限りなく小さくした行き先が面積分。 */
export function AreaFluxIntegral() {
  const t = useT();
  const u = pingPong(t, 7);
  const cx = 104, cy = 96, R = 60, pieces = 16;
  const filled = Math.max(1, Math.round(pieces * u));
  return (
    <LevelFig label="片を限りなく小さくした行き先が面積分">
      <FieldRows rows={[48, 76, 104, 132]} from={14} to={50} />
      {Array.from({ length: pieces }, (_, i) => {
        const a0 = (i * (Math.PI / 2)) / pieces, a1 = ((i + 1) * (Math.PI / 2)) / pieces;
        const am = (a0 + a1) / 2;
        const p0 = { x: cx + R * Math.sin(a0), y: cy - R * Math.cos(a0) };
        const p1 = { x: cx + R * Math.sin(a1), y: cy - R * Math.cos(a1) };
        return (
          <g key={i} opacity={i < filled ? 1 : 0.25}>
            <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={i < filled ? L.focus : L.dim} strokeWidth={3.4} />
            <Arw x={cx + R * Math.sin(am)} y={cy - R * Math.cos(am)} dx={16 * Math.sin(am)} dy={-16 * Math.cos(am)}
              color={L.normal} w={1.4} head={5} />
          </g>
        );
      })}
      <Lbl x={186} y={50} text="Φ = ∫ B · dA" color={L.focus} size={13} bold />
      <Lbl x={186} y={76} text="dA = n dA" color={L.normal} size={11.5} />
      <Lbl x={186} y={98} text="向き = 法線" color={L.dim} size={10} />
      <Lbl x={186} y={116} text="長さ = 小片の面積" color={L.dim} size={10} />
      <Lbl x={160} y={158} text="足す操作は、片ごとの内積のまま" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="小さな法線1本ずつが、片ごとの向きを表している" />
    </LevelFig>
  );
}

// =====================================================================
// 6. um-simple-derivative-equation — 変化率が残りに比例する式
// =====================================================================

const DEC = mapper([0, 8.4], [0, 112], { x0: 48, y0: 30, x1: 262, y1: 146 });
const decay = (s: number) => 100 * Math.exp(-0.2 * s);

/** 変化率は、グラフの接線の傾き。 */
export function OdeRateRecall() {
  const t = useT();
  const tm = 0.5 + 6.4 * pingPong(t, 9);
  const slope = -0.2 * decay(tm);
  const d = 1.0;
  return (
    <LevelFig label="変化率はグラフの接線の傾き">
      <Axes m={DEC} xLabel="t [s]" yLabel="y [g]" />
      <Curve m={DEC} f={decay} color={L.field} xa={0} xb={8.4} />
      <line x1={DEC.x(tm - d)} y1={DEC.y(decay(tm) - slope * d)} x2={DEC.x(tm + d)} y2={DEC.y(decay(tm) + slope * d)}
        stroke={L.focus} strokeWidth={2.8} />
      <Dot cx={DEC.x(tm)} cy={DEC.y(decay(tm))} color={L.path} r={4} />
      <Lbl x={66} y={22} text="接線の傾きが dy/dt" color={L.text} size={11} />
      <Lbl x={170} y={44} text={`t = ${fmt(tm, 1)} s で y = ${fmt(decay(tm), 1)} g`} color={L.path} size={10} />
      <Lbl x={170} y={66} text={`dy/dt = ${fmt(slope, 2)} g/s`} color={L.minus} size={11} bold />
      <Lbl x={160} y={160} text="傾きが負なので、y は減っている" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="点が右へ進むほど、接線の傾きがゆるくなる" />
    </LevelFig>
  );
}

/** 減る速さが、今の量に比例する。 */
export function OdeProportional() {
  const t = useT();
  const k = step(t, 3, 1.5);
  const cases = [{ y: 100, r: 20 }, { y: 50, r: 10 }, { y: 25, r: 5 }];
  const c = cases[k];
  return (
    <LevelFig label="減る速さが今の量に比例する">
      <Lbl x={24} y={30} text="いまの量 y [g]" color={L.dim} size={10} />
      <Lbl x={296} y={30} text="減る速さ k y [g/s]" color={L.dim} size={10} anchor="end" />
      {cases.map((cs, i) => (
        <g key={cs.y} opacity={i === k ? 1 : 0.32}>
          <rect x={24} y={44 + i * 36} width={Math.max((cs.y / 100) * 120, 2)} height={22} rx={4}
            fill={L.field} opacity={0.75} />
          <Lbl x={30} y={60 + i * 36} text={`${cs.y} g`} color={L.text} size={11} />
          <rect x={296 - Math.max((cs.r / 20) * 120, 2)} y={44 + i * 36} width={Math.max((cs.r / 20) * 120, 2)} height={22} rx={4}
            fill={L.minus} opacity={0.75} />
          <Lbl x={290} y={60 + i * 36} text={`${cs.r} g/s`} color={L.text} size={11} anchor="end" />
        </g>
      ))}
      <Lbl x={160} y={160} text={`y が ${c.y} g のとき、減る速さは ${c.r} g/s（k = 0.2 /s）`} color={L.focus} size={10.5} anchor="middle" />
      <Cap text="左の棒が半分になると、右の棒も半分になる" />
    </LevelFig>
  );
}

/** 負号の有無で、減るか増えるかが変わる。 */
export function OdeMinusSign() {
  const t = useT();
  const m = mapper([0, 5.2], [0, 230], { x0: 46, y0: 32, x1: 262, y1: 136 });
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="負号があると減り、なければ増える">
      <Axes m={m} xLabel="t [s]" yLabel="y [g]" />
      <Curve m={m} f={s => 100 * Math.exp(-0.2 * s)} color={L.minus} xa={0} xb={5.2} w={3} />
      <Curve m={m} f={s => 100 * Math.exp(0.16 * s)} color={L.dim} xa={0} xb={5.2} w={2} dash="5 4" />
      <Dot cx={m.x(0)} cy={m.y(100)} color={L.plus} r={4} />
      <g opacity={glow}>
        <Arw x={m.x(4.4)} y={m.y(60)} dx={0} dy={m.y(30) - m.y(60)} color={L.minus} w={2.4} head={7} />
      </g>
      <Lbl x={66} y={24} text="右辺 −ky は必ず負（k > 0、y > 0）" color={L.text} size={10.5} />
      <Lbl x={m.x(1.5)} y={m.y(16)} text="dy/dt = −ky（実線）" color={L.minus} size={10} />
      <Lbl x={m.x(2.2)} y={m.y(190)} text="dy/dt = +ky なら増える" color={L.dim} size={10} />
      <Lbl x={160} y={158} text="負号は「減る向き」だけを担っている" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="実線が負号あり、点線が負号を外した場合" />
    </LevelFig>
  );
}

/** 両辺の単位から k の単位を決める。 */
export function OdeKUnit() {
  const t = useT();
  const shown = step(t, 3, 1.4);
  const rows = [
    { text: '左辺 dy/dt … g / s', color: L.field },
    { text: 'g / s = [k] × g', color: L.focus },
    { text: '両辺を g で割って [k] = 1 / s', color: L.plus },
  ];
  return (
    <LevelFig label="両辺の単位からkの単位を決める">
      {rows.map((row, i) => (
        <g key={row.text} opacity={i <= shown ? 1 : 0.16}>
          <Panel x={22} y={36 + i * 36} w={276} h={28} color={i === shown ? row.color : L.dim} on={i <= shown} />
          <Lbl x={160} y={55 + i * 36} text={row.text} color={row.color} size={11.5} anchor="middle" bold={i === shown} />
        </g>
      ))}
      <Lbl x={160} y={156} text="k = 0.2 /s は「1秒あたり2割ずつ」の目安" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="単位をそろえる作業が、kの意味も教えてくれる" />
    </LevelFig>
  );
}

/** 出発点と傾きだけでは、先の道が決まらないように見える。 */
export function OdeNextStepQ() {
  const t = useT();
  const blink = 0.35 + 0.45 * Math.sin(4 * t);
  return (
    <LevelFig label="出発点と傾きから先をどう追うか">
      <Axes m={DEC} xLabel="t [s]" yLabel="y [g]" />
      <Dot cx={DEC.x(0)} cy={DEC.y(100)} color={L.plus} r={4.5} />
      <line x1={DEC.x(0)} y1={DEC.y(100)} x2={DEC.x(1.6)} y2={DEC.y(100 - 0.2 * 100 * 1.6)} stroke={L.focus} strokeWidth={2.6} />
      <g opacity={blink}>
        {[0.55, 0.75, 1.0].map(f => (
          <Curve key={f} m={DEC} f={s => 100 * Math.pow(f, s)} color={L.dim} xa={0} xb={8.4} w={1.6} dash="5 4" />
        ))}
        <Lbl x={200} y={92} text="この先は?" color={L.minus} size={12} />
      </g>
      <Lbl x={66} y={22} text="分かっているのは出発点と変化率だけ" color={L.text} size={10.5} />
      <Lbl x={66} y={44} text="y₀ = 100 g、dy/dt = −20 g/s" color={L.plus} size={10.5} />
      <Lbl x={160} y={160} text="先を追うには、少しずつ進めるしかない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="点線はどれも候補。出発点の傾きだけでは選べない" />
    </LevelFig>
  );
}

/** 1ステップ進めて、次の値を出す。 */
export function OdeEulerStep() {
  const t = useT();
  const u = pingPong(t, 6);
  const m = mapper([0, 2.4], [40, 112], { x0: 52, y0: 32, x1: 260, y1: 132 });
  const xEnd = 1 * u;
  return (
    <LevelFig label="接線に沿って1ステップ進める">
      <Axes m={m} xLabel="t [s]" yLabel="y [g]" />
      <Curve m={m} f={decay} color={L.dim} xa={0} xb={2.4} w={2} dash="5 4" />
      <line x1={m.x(0)} y1={m.y(100)} x2={m.x(xEnd)} y2={m.y(100 - 20 * xEnd)} stroke={L.focus} strokeWidth={3} />
      <Dot cx={m.x(0)} cy={m.y(100)} color={L.plus} r={4} />
      <Dot cx={m.x(xEnd)} cy={m.y(100 - 20 * xEnd)} color={L.focus} r={4} />
      <line x1={m.x(0)} y1={m.y(100)} x2={m.x(1)} y2={m.y(100)} stroke={L.dim} strokeDasharray="3 3" />
      <line x1={m.x(1)} y1={m.y(100)} x2={m.x(1)} y2={m.y(80)} stroke={L.minus} strokeDasharray="3 3" />
      <Lbl x={m.x(0.5)} y={m.y(100) - 6} text="Δt = 1 s" color={L.dim} size={10} anchor="middle" />
      <Lbl x={m.x(1) + 5} y={m.y(90)} text="Δy = −20 g" color={L.minus} size={10} />
      <Lbl x={70} y={24} text="接線に沿って Δt だけ進める" color={L.text} size={10.5} />
      <Lbl x={150} y={152} text="y₁ ≈ 100 × ( 1 − 0.2 × 1 ) = 80 g" color={L.focus} size={10} anchor="middle" bold />
      <Cap text="点線が本当の減り方、太い直線が1ステップの近似" />
    </LevelFig>
  );
}

/** 1ステップずつの表。 */
export function OdeTable() {
  const t = useT();
  const shown = step(t, 5, 1.0);
  const rows = [
    { t: '0', y: '100', d: '−20' },
    { t: '1', y: '80', d: '−16' },
    { t: '2', y: '64', d: '−12.8' },
    { t: '3', y: '51.2', d: '−10.24' },
    { t: '4', y: '40.96', d: '−' },
  ];
  return (
    <LevelFig label="1ステップずつ減らした数値の表">
      <Lbl x={36} y={30} text="t [s]" color={L.dim} size={10} />
      <Lbl x={136} y={30} text="y [g]" color={L.dim} size={10} />
      <Lbl x={236} y={30} text="次の Δy [g]" color={L.dim} size={10} />
      {rows.map((row, i) => (
        <g key={row.t} opacity={i <= shown ? 1 : 0.16}>
          <Panel x={22} y={36 + i * 23} w={276} h={19} color={i === shown ? L.focus : L.dim} on={i <= shown} />
          <Lbl x={36} y={50 + i * 23} text={row.t} color={L.text} size={10.5} />
          <Lbl x={136} y={50 + i * 23} text={row.y} color={i === shown ? L.focus : L.text} size={10.5} bold={i === shown} />
          <Lbl x={236} y={50 + i * 23} text={row.d} color={L.minus} size={10.5} />
        </g>
      ))}
      <Lbl x={160} y={160} text="毎回 0.8 倍。減る幅そのものが小さくなる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="yの列と、減り幅の列が同じ割合で小さくなっている" />
    </LevelFig>
  );
}

/** 刻みを細かくすると、値が上がって落ち着く。 */
export function OdeFiner() {
  const t = useT();
  const k = step(t, 3, 1.6);
  const dts = [1, 0.5, 0.25];
  const dt = dts[k];
  const m = mapper([0, 4.6], [30, 112], { x0: 50, y0: 32, x1: 260, y1: 130 });
  const steps = Math.round(4 / dt);
  const pts: string[] = [];
  let y = 100;
  pts.push(`${m.x(0).toFixed(1)},${m.y(100).toFixed(1)}`);
  for (let i = 1; i <= steps; i++) {
    y = y * (1 - 0.2 * dt);
    pts.push(`${m.x(i * dt).toFixed(1)},${m.y(y).toFixed(1)}`);
  }
  const exact = 100 * Math.exp(-0.8);
  return (
    <LevelFig label="刻みを細かくすると計算値が上がる">
      <Axes m={m} xLabel="t [s]" yLabel="y [g]" />
      <Curve m={m} f={decay} color={L.dim} xa={0} xb={4.6} w={2} dash="5 4" />
      <polyline points={pts.join(' ')} fill="none" stroke={L.focus} strokeWidth={2.6} strokeLinejoin="round" />
      <Dot cx={m.x(4)} cy={m.y(y)} color={L.focus} r={4} />
      <Dot cx={m.x(4)} cy={m.y(exact)} color={L.plus} r={4} />
      <Lbl x={70} y={24} text={`刻み Δt = ${dt} s（${steps} ステップ）`} color={L.text} size={10.5} />
      <Lbl x={70} y={46} text={`4 s 後 ${fmt(y, 2)} g`} color={L.focus} size={11.5} bold />
      <Lbl x={284} y={46} text={`行き先 ${fmt(exact, 2)} g`} color={L.plus} size={10.5} anchor="end" />
      <Lbl x={160} y={152} text={`差 ${fmt(exact - y, 2)} g`} color={L.minus} size={10.5} anchor="middle" />
      <Cap text="刻みを細かくするたび、折れ線が点線に近づく" />
    </LevelFig>
  );
}

/** 半分になる時間が、いつも等しい。 */
export function OdeCurve() {
  const t = useT();
  const k = step(t, 2, 1.8);
  const half = Math.log(2) / 0.2;
  return (
    <LevelFig label="半分になるまでの時間がいつも等しい">
      <Axes m={DEC} xLabel="t [s]" yLabel="y [g]" />
      <Curve m={DEC} f={decay} color={L.field} xa={0} xb={8.4} />
      {[0, 1].map(i => {
        const t0 = i * half, t1 = (i + 1) * half;
        const on = i === k;
        return (
          <g key={i} opacity={on ? 1 : 0.4}>
            <line x1={DEC.x(t0)} y1={DEC.y(decay(t0))} x2={DEC.x(t0)} y2={DEC.y(0)} stroke={L.dim} strokeDasharray="3 3" />
            <line x1={DEC.x(t1)} y1={DEC.y(decay(t1))} x2={DEC.x(t1)} y2={DEC.y(0)} stroke={L.dim} strokeDasharray="3 3" />
            <Arw x={DEC.x(t0)} y={DEC.y(6)} dx={DEC.x(t1) - DEC.x(t0)} dy={0} color={on ? L.focus : L.dim} w={2.4} />
            <Lbl x={DEC.x((t0 + t1) / 2)} y={DEC.y(6) - 6} text={`${fmt(half, 1)} s`} color={on ? L.focus : L.dim} size={10} anchor="middle" />
          </g>
        );
      })}
      <Dot cx={DEC.x(0)} cy={DEC.y(100)} color={L.plus} r={3.4} />
      <Dot cx={DEC.x(half)} cy={DEC.y(50)} color={L.plus} r={3.4} />
      <Dot cx={DEC.x(2 * half)} cy={DEC.y(25)} color={L.plus} r={3.4} />
      <Lbl x={66} y={22} text={k === 0 ? '100 g → 50 g' : '50 g → 25 g'} color={L.focus} size={11.5} />
      <Lbl x={66} y={44} text={`どちらも約 ${fmt(half, 1)} s`} color={L.plus} size={11} />
      <Cap text="2本の矢印の長さが等しいことを確かめる" />
    </LevelFig>
  );
}

/** 行き先は指数関数。 */
export function OdeExponential() {
  const t = useT();
  const tm = 8.2 * pingPong(t, 9);
  return (
    <LevelFig label="行き先は指数関数の形になる">
      <Axes m={DEC} xLabel="t [s]" yLabel="y [g]" />
      <Curve m={DEC} f={decay} color={L.field} xa={0} xb={8.4} />
      <Dot cx={DEC.x(tm)} cy={DEC.y(decay(tm))} color={L.focus} r={4.5} />
      <line x1={DEC.x(tm)} y1={DEC.y(decay(tm))} x2={DEC.x(tm)} y2={DEC.y(0)} stroke={L.focus} strokeDasharray="3 3" />
      <Lbl x={66} y={22} text="y = y₀ e^(−kt)" color={L.focus} size={13} bold />
      <Lbl x={66} y={44} text="y₀ = 100 g、k = 0.2 /s、e ≈ 2.718" color={L.dim} size={10} />
      <Lbl x={286} y={68} text={`t = ${fmt(tm, 1)} s で ${fmt(decay(tm), 1)} g`} color={L.plus} size={10.5} anchor="end" />
      <Lbl x={160} y={160} text="この式をどう導くかは上級で扱う" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="毎回同じ割合を掛け続けた行き先が、この曲線" />
    </LevelFig>
  );
}

// =====================================================================

export const um_mathFigures: Record<string, () => JSX.Element> = {
  'umx-avg-two-points': AvgTwoPoints,
  'umx-avg-shrink': AvgShrink,
  'umx-avg-tangent': AvgTangent,
  'umx-avg-table': AvgTable,
  'umx-avg-expand': AvgExpand,
  'umx-avg-cancel': AvgCancel,
  'umx-avg-h-zero': AvgHZero,
  'umx-avg-limit': AvgLimit,
  'umx-avg-derivative-map': AvgDerivativeMap,
  'umx-sum-value-width': SumValueWidth,
  'umx-sum-partition-ends': SumPartitionEnds,
  'umx-sum-width': SumWidth,
  'umx-sum-sample': SumSample,
  'umx-sum-sigma': SumSigma,
  'umx-sum-refine': SumRefine,
  'umx-sum-integral-symbol': SumIntegralSymbol,
  'umx-sum-fdx-piece': SumFdxPiece,
  'umx-sum-meanings': SumMeanings,
  'umx-sum-swap': SumSwap,
  'umx-sum-sigma-vs-integral': SumSigmaVsIntegral,
  'umx-dot-cos-start': DotCosStart,
  'umx-dot-notation': DotNotation,
  'umx-dot-angle-problem': DotAngleProblem,
  'umx-dot-components': DotComponents,
  'umx-dot-check': DotCheck,
  'umx-dot-perpendicular': DotPerpendicular,
  'umx-dot-negative': DotNegative,
  'umx-dot-magnitude-trap': DotMagnitudeTrap,
  'umx-dot-projection': DotProjection,
  'umx-path-straight': PathStraight,
  'umx-path-curve-question': PathCurveQuestion,
  'umx-path-polyline': PathPolyline,
  'umx-path-one-edge': PathOneEdge,
  'umx-path-angles': PathAngles,
  'umx-path-sum': PathSum,
  'umx-path-refine': PathRefine,
  'umx-path-reverse': PathReverse,
  'umx-path-line-integral': PathLineIntegral,
  'umx-area-through': AreaThrough,
  'umx-area-orientation-q': AreaOrientationQ,
  'umx-area-normal': AreaNormal,
  'umx-area-vector-build': AreaVectorBuild,
  'umx-area-tilt': AreaTilt,
  'umx-area-inplane-trap': AreaInplaneTrap,
  'umx-area-sum': AreaSum,
  'umx-area-flip': AreaFlip,
  'umx-area-flux-integral': AreaFluxIntegral,
  'umx-ode-rate-recall': OdeRateRecall,
  'umx-ode-proportional': OdeProportional,
  'umx-ode-minus-sign': OdeMinusSign,
  'umx-ode-k-unit': OdeKUnit,
  'umx-ode-next-step-q': OdeNextStepQ,
  'umx-ode-euler-step': OdeEulerStep,
  'umx-ode-table': OdeTable,
  'umx-ode-finer': OdeFiner,
  'umx-ode-curve': OdeCurve,
  'umx-ode-exponential': OdeExponential,
};

export const um_mathReadings: Record<string, string> = {
  'umx-avg-two-points': '曲線の上の2点と、その間の横の差Δt・縦の差Δxを見てください。2点を結ぶ直線の傾きが平均変化率です。',
  'umx-avg-shrink': 'スライダーで幅hを変えられます。hを小さくしたときに、直線の傾きの数値がどこへ向かうかを見てください。',
  'umx-avg-tangent': '細い線がh=1、0.5、0.25の直線です。hを小さくするほど、太い線（接線）に重なっていきます。',
  'umx-avg-table': '左の列がhの値、右の列が差商の値です。hを10分の1にするたび、2との差も10分の1になります。',
  'umx-avg-expand': '大きい正方形が t²、両側の帯が th の2本、右上の小さな角が h² です。増えた面積が 2th + h² だと確かめてください。',
  'umx-avg-cancel': '上から順に、くくり出し・約分・結果と進みます。斜めの線が引かれたhが、約分で消える部分です。',
  'umx-avg-h-zero': '左の枠が0を代入した場合、右の枠が0へ近づけた場合です。左では値が決まらないことを見てください。',
  'umx-avg-limit': '横軸が幅h、縦軸が差商の値です。点が左へ進むほど、値が破線の2に寄っていくことを見てください。',
  'umx-avg-derivative-map': '上が位置のグラフ、下が変化率のグラフです。上の接線の傾きの数値が、そのまま下の点の高さになっています。',
  'umx-sum-value-width': '金色の長方形1本が、合計を作る最小の部品です。高さと幅がそれぞれ何にあたるかを確かめてください。',
  'umx-sum-partition-ends': '左端aと右端bの2本の縦線が、足し合わせる範囲を決めています。bを動かすと塗られた範囲が変わります。',
  'umx-sum-width': '区切りの線の数が2、4、8と変わります。そのたびにΔxの値が半分になることを確かめてください。',
  'umx-sum-sample': '各区間の左端に打たれた点が代表点です。その点の高さが、その区間の長方形の高さになります。',
  'umx-sum-sigma': 'Σの上の数が終わりの番号、下の数が始まりの番号です。右側の注が、それぞれの部分の役割を示します。',
  'umx-sum-refine': '区間の数が4、8、16と増えます。合計Sₙの値と、8との差がどう変わるかを一緒に見てください。',
  'umx-sum-integral-symbol': '∫の上が上端b、下が下端aです。Σの上下の番号にあたるものが、範囲の両端に変わっています。',
  'umx-sum-fdx-piece': '金色の細い1本が f(x)dx です。右の枠に、その1本の高さと幅と値が表示されます。',
  'umx-sum-meanings': '高さと幅にどんな量を入れるかで、合計の意味が変わります。単位の掛け算を確かめてください。',
  'umx-sum-swap': 'たどる向きの矢印が入れ替わると、棒の色と合計の符号も入れ替わります。大きさは変わりません。',
  'umx-sum-sigma-vs-integral': '1行目は同じ、2行目だけが違います。足す操作は同じで、細かさの約束だけが違うことを確かめてください。',
  'umx-dot-cos-start': '斜めの矢印から下ろした点線と、床に沿った太い矢印が進む向きの成分です。効くのはこの成分だけです。',
  'umx-dot-notation': '同じ量が2通りに書かれています。上が角度を使う形、下が点の記号の形で、答えはどちらも1つの数です。',
  'umx-dot-angle-problem': '矢印の組ごとに、なす角が違います。毎回この角を測るのが手間だという点を見てください。',
  'umx-dot-components': '斜めの矢印から縦に下ろした点線が、x成分を切り出しています。同じ軸の成分どうしだけを掛けます。',
  'umx-dot-check': '右の2つの枠が、成分での計算と角度での計算です。どちらも同じ6 Jになることを確かめてください。',
  'umx-dot-perpendicular': '力の矢印と移動の矢印が直角です。進む向きに揃った成分がないので、内積が0になります。',
  'umx-dot-negative': '力の矢印と移動の矢印が正反対を向いています。このとき内積に負号が付きます。',
  'umx-dot-magnitude-trap': '左が大きさだけを掛けた誤り、右が内積での計算です。差がcosθの分だけであることを見てください。',
  'umx-dot-projection': 'スライダーで角度を変えられます。太い横矢印が進む向きの成分で、左を向いたとき値が負になります。',
  'umx-path-straight': '力の矢印は下向き、変位の矢印は右上向きです。角が90°を超えているので寄与が負になります。',
  'umx-path-curve-question': '始点と終点を結んだ細い矢印は、途中の道の向きとは違います。どのΔrを使うかが決まらない点を見てください。',
  'umx-path-polyline': '細い線が元の曲線、太い線が置きかえた折れ線です。頂点がすべて曲線の上にあることを確かめてください。',
  'umx-path-one-edge': '1辺だけを取り出しています。代表の位置・変位の矢印・その場所の力の3つが揃うことを見てください。',
  'umx-path-angles': '辺ごとに下向きの力との角が違います。上りの2辺が負、下りの2辺が正になることを確かめてください。',
  'umx-path-sum': '辺が1本ずつ色付きになり、合計が積み上がります。緑が正の寄与、紫が負の寄与です。',
  'umx-path-refine': '辺の数が4、8、16と増えます。折れ線の長さと、曲線との差の数値がどう変わるかを見てください。',
  'umx-path-reverse': '矢印の向きが反転すると、各辺の符号と合計の符号が入れ替わります。力の矢印は変わっていません。',
  'umx-path-line-integral': '短い辺が左から順に足されていきます。小さな矢印1本ずつが、辺ごとの力の寄与です。',
  'umx-area-through': 'スライダーで面の傾きを変えられます。広さを変えなくても、通る量が変わることを見てください。',
  'umx-area-orientation-q': '面の中に引いた矢印はどれも同格で、面の向きの代表になりません。その困りごとを見てください。',
  'umx-area-normal': '明るい矢印が選んだ法線で、長さは1です。反対向きにも選べることを確かめてください。',
  'umx-area-vector-build': '細い矢印が法線、太い矢印が面積ベクトルです。向きは法線のまま、長さだけが面積になります。',
  'umx-area-tilt': 'スライダーで法線と場のなす角を変えられます。角が大きくなるほど通る量が減ることを見てください。',
  'umx-area-inplane-trap': '左は面に沿う矢印を使った誤り、右は法線を使った計算です。同じ面なのに答えが違う点を見てください。',
  'umx-area-sum': '曲面が4枚の平らな片に分かれ、片ごとに法線の向きが違います。寄与と合計の数値を見てください。',
  'umx-area-flip': '法線の矢印が表と裏で入れ替わります。面も場も変わらないのに、符号だけが反転します。',
  'umx-area-flux-integral': '小さな片が順に足されていきます。片ごとに立っている短い矢印が、その片の法線です。',
  'umx-ode-rate-recall': '曲線に接する直線の傾きが、その時刻のdy/dtです。右へ進むほど傾きがゆるくなることを見てください。',
  'umx-ode-proportional': '左の棒がいまの量、右の棒が減る速さです。左が半分になると右も半分になることを確かめてください。',
  'umx-ode-minus-sign': '実線が負号ありの減る場合、点線が負号を外した増える場合です。符号1つで意味が逆になります。',
  'umx-ode-k-unit': '上から順に、両辺の単位を並べてからgで割ります。kが1/sになる理由を追ってください。',
  'umx-ode-next-step-q': '点線はどれも候補の曲線です。出発点と最初の傾きだけでは、どれか1つに決まらない点を見てください。',
  'umx-ode-euler-step': '点線が本当の減り方、太い直線が接線に沿った1ステップです。少し下へ行き過ぎることを見てください。',
  'umx-ode-table': 'yの列と、次の減り幅の列を見比べてください。どちらも同じ割合で小さくなっていきます。',
  'umx-ode-finer': '刻みΔtが1、0.5、0.25と細かくなります。4 s後の値と、行き先との差の数値を見てください。',
  'umx-ode-curve': '2本の矢印が、100 gから50 g、50 gから25 gにかかる時間です。長さが等しいことを確かめてください。',
  'umx-ode-exponential': '点が曲線の上を進みます。毎回同じ割合を掛け続けた行き先が、この曲線であることを見てください。',
};
