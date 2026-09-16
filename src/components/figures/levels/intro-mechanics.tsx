import { Arw, Axes, Bar, Cap, Curve, FigSlider, L, Lbl, LevelFig, mapper, pingPong, step, useManual, useT, fmt } from './base';

/** 大学力学・初級の図解。
 * 一定力の仕事（長方形）から、変化する力の仕事（小区間の和）まで、同じ縦軸・横軸で通す。
 * 縦軸は力 [N]、横軸は位置 [m]。面積が仕事 [J]。 */

const F_X = mapper([0, 4], [0, 4], { x0: 48, y0: 30, x1: 288, y1: 146 });

/** 床の上の箱。x は箱の左端の画面座標。 */
function Box({ x, y = 96, w = 34, h = 26 }: { x: number; y?: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={5} fill={L.field} opacity={0.9} />;
}

function Floor({ y = 122 }: { y?: number }) {
  return <line x1={16} y1={y} x2={304} y2={y} stroke={L.dim} strokeWidth={2} />;
}

/** 一定の力で箱を押し、同じ向きに動かす。 */
export function PushBox() {
  const t = useT();
  const u = pingPong(t, 6);
  const x = 60 + 150 * u;
  return (
    <LevelFig label="一定の力で箱を押して動かす">
      <Floor />
      <Box x={x} />
      <Arw x={x - 36} y={109} dx={30} dy={0} color={L.plus} w={3} />
      <Lbl x={x - 40} y={100} text="F = 2 N" color={L.plus} size={11} />
      <line x1={60} y1={140} x2={210} y2={140} stroke={L.path} strokeWidth={2} />
      <line x1={60} y1={134} x2={60} y2={146} stroke={L.path} strokeWidth={2} />
      <line x1={210} y1={134} x2={210} y2={146} stroke={L.path} strokeWidth={2} />
      <Lbl x={135} y={158} text="L = 3 m" color={L.path} size={11} anchor="middle" />
      <Lbl x={20} y={40} text="力の向きと移動の向きが同じ" color={L.text} size={11.5} />
      <Lbl x={20} y={58} text={`W = F × L = 2 × ${fmt(3 * u, 1)} = ${fmt(6 * u, 1)} J`} color={L.focus} size={12} />
      <Cap text="同じ向きに押して動かした分だけ、仕事が増える" />
    </LevelFig>
  );
}

/** 力-位置グラフの長方形の面積が仕事。 */
export function WorkRect() {
  const t = useT();
  const u = pingPong(t, 6);
  const right = F_X.x(3 * u);
  return (
    <LevelFig label="力と位置のグラフの長方形の面積が仕事">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <rect x={F_X.x(0)} y={F_X.y(2)} width={Math.max(right - F_X.x(0), 0)} height={F_X.y(0) - F_X.y(2)}
        fill={L.focus} opacity={0.35} />
      <line x1={F_X.x(0)} y1={F_X.y(2)} x2={F_X.x(3)} y2={F_X.y(2)} stroke={L.field} strokeWidth={2.5} />
      <Lbl x={F_X.x(3) + 4} y={F_X.y(2) - 4} text="F = 2 N" color={L.field} size={10.5} />
      <Lbl x={F_X.x(1.5)} y={F_X.y(1) + 4} text={`面積 = ${fmt(6 * u, 1)} J`} color={L.focus} size={12} anchor="middle" />
      <Lbl x={66} y={22} text="縦 = 力、横 = 位置。囲む面積が仕事" color={L.text} size={11} />
      <Cap text="高さ2 N・幅3 mの長方形。面積2×3=6が仕事6 J" />
    </LevelFig>
  );
}

/** 単位の掛け算: N×m=J。 */
export function WorkUnits() {
  const t = useT();
  const phase = step(t, 3, 1.4);
  const rows = [
    { left: '力 F', right: '2 N', color: L.plus },
    { left: '移動距離 L', right: '3 m', color: L.path },
    { left: '仕事 W = F×L', right: '6 N·m = 6 J', color: L.focus },
  ];
  return (
    <LevelFig label="単位の掛け算でジュールになる">
      {rows.map((row, i) => (
        <g key={row.left} opacity={i <= phase ? 1 : 0.2}>
          <rect x={40} y={36 + i * 34} width={240} height={26} rx={6} fill={row.color} opacity={i === phase ? 0.22 : 0.1} />
          <Lbl x={52} y={54 + i * 34} text={row.left} color={L.text} size={12} />
          <Lbl x={268} y={54 + i * 34} text={row.right} color={row.color} size={12} anchor="end" bold={i === 2} />
        </g>
      ))}
      <Lbl x={160} y={156} text="N × m = J（ニュートン・メートルがジュール）" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="数だけでなく単位も掛ける。答えの単位がJなら仕事" />
    </LevelFig>
  );
}

/** 動かなければ仕事は0。 */
export function NoMoveNoWork() {
  const t = useT();
  const shake = 1.2 * Math.sin(8 * t);
  return (
    <LevelFig label="壁を押しても動かなければ仕事はゼロ">
      <Floor />
      <rect x={196} y={40} width={26} height={82} fill={L.dim} opacity={0.5} />
      <Box x={160 + shake} />
      <Arw x={128} y={109} dx={28} dy={0} color={L.plus} w={3} />
      <Lbl x={110} y={98} text="F = 200 N" color={L.plus} size={11} />
      <Lbl x={20} y={40} text="いくら押しても、壁は動かない" color={L.text} size={11.5} />
      <Lbl x={20} y={58} text="移動距離 L = 0 m" color={L.path} size={11.5} />
      <Lbl x={20} y={76} text="W = 200 × 0 = 0 J" color={L.minus} size={12} />
      <Cap text="物理の仕事は「力 × その向きに動いた距離」。動かなければ0" />
    </LevelFig>
  );
}

/** 力2倍・距離2倍で仕事はそれぞれ2倍。 */
export function WorkCompare() {
  const t = useT();
  const which = step(t, 3, 1.8);
  const cases = [
    { f: 2, l: 3, tag: '元の場合' },
    { f: 4, l: 3, tag: '力だけ2倍' },
    { f: 2, l: 6, tag: '距離だけ2倍' },
  ];
  const m = mapper([0, 7], [0, 5], { x0: 48, y0: 34, x1: 286, y1: 132 });
  const c = cases[which];
  return (
    <LevelFig label="力や距離を2倍にすると仕事も2倍">
      <Axes m={m} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <rect x={m.x(0)} y={m.y(c.f)} width={m.x(c.l) - m.x(0)} height={m.y(0) - m.y(c.f)} fill={L.focus} opacity={0.35} />
      <line x1={m.x(0)} y1={m.y(c.f)} x2={m.x(c.l)} y2={m.y(c.f)} stroke={L.field} strokeWidth={2.5} />
      <Lbl x={66} y={24} text={`${c.tag}: F = ${c.f} N、L = ${c.l} m`} color={L.text} size={11.5} />
      <Lbl x={m.x(c.l / 2)} y={m.y(c.f / 2)} text={`W = ${c.f * c.l} J`} color={L.focus} size={13} anchor="middle" bold />
      <Cap text="面積が2倍になるのは、縦を2倍にしても横を2倍にしても同じ" />
    </LevelFig>
  );
}

/** 進む向きと逆の力は負の仕事。 */
export function WorkNegative() {
  const t = useT();
  const u = pingPong(t, 6);
  const x = 70 + 120 * u;
  return (
    <LevelFig label="進む向きと逆向きの力は負の仕事">
      <Floor />
      <Box x={x} />
      <Arw x={x + 44} y={82} dx={28} dy={0} color={L.path} w={3} />
      <Lbl x={x + 40} y={74} text="進む向き" color={L.path} size={10.5} />
      <Arw x={x} y={109} dx={-28} dy={0} color={L.minus} w={3} />
      <Lbl x={x - 34} y={100} text="摩擦 1 N" color={L.minus} size={10.5} anchor="end" />
      <Lbl x={20} y={34} text="力が逆向きなら、仕事は負になる" color={L.text} size={11.5} />
      <Lbl x={20} y={52} text="W = −1 N × 2 m = −2 J" color={L.minus} size={12} />
      <Lbl x={20} y={70} text="運動エネルギーはその分だけ減る" color={L.dim} size={10.5} />
      <Cap text="符号は向きの情報。負の仕事は、取り出された分を表す" />
    </LevelFig>
  );
}

/** 斜めの力は、進む向きの成分だけが効く。 */
export function WorkAngle() {
  const [deg, setDeg] = useManual(time => 30 + 30 * pingPong(time, 8));
  const th = (deg * Math.PI) / 180;
  const ox = 92, oy = 134, len = 68;
  const fx = ox + len * Math.cos(th), fy = oy - len * Math.sin(th);
  const eff = 10 * Math.cos(th);
  return (
    <>
      <LevelFig label="斜めの力は前向きの成分だけが効く">
        <Floor y={134} />
        <Box x={ox - 18} y={108} w={36} h={26} />
        <Arw x={ox} y={oy} dx={fx - ox} dy={fy - oy} color={L.field} w={3} />
        <Lbl x={fx + 6} y={fy - 5} text="F = 10 N" color={L.field} size={11} />
        <line x1={fx} y1={fy} x2={ox + len * Math.cos(th)} y2={oy} stroke={L.dim} strokeDasharray="4 3" />
        <Arw x={ox} y={oy} dx={len * Math.cos(th)} dy={0} color={L.focus} w={5} />
        <Lbl x={ox + len * Math.cos(th) + 8} y={oy + 4} text={`前向き ${fmt(eff, 1)} N`} color={L.focus} size={10.5} />
        <Lbl x={16} y={28} text={`角度 ${Math.round(deg)}°、移動は右へ 2 m`} color={L.text} size={11.5} />
        <Lbl x={16} y={46} text={`W = ${fmt(eff, 1)} × 2 = ${fmt(eff * 2, 1)} J`} color={L.focus} size={12} />
        <Cap text="真上に引いても前へは進まない。効くのは前向きの成分だけ" />
      </LevelFig>
      <FigSlider label="力の角度 [度]" value={deg} min={0} max={90} step={1} onChange={setDeg} display={`${Math.round(deg)}°`} />
    </>
  );
}

/** 区間に分けても合計は変わらない（次の段への橋）。 */
export function WorkSplitSame() {
  const t = useT();
  const cut = step(t, 3, 1.5) + 1;
  const edges = Array.from({ length: cut + 1 }, (_, i) => (3 * i) / cut);
  return (
    <LevelFig label="区間に分けても仕事の合計は同じ">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      {edges.slice(0, -1).map((x0, i) => (
        <Bar key={i} m={F_X} x0={x0} x1={edges[i + 1]} height={2} active={i % 2 === 0} />
      ))}
      <line x1={F_X.x(0)} y1={F_X.y(2)} x2={F_X.x(3)} y2={F_X.y(2)} stroke={L.field} strokeWidth={2.5} />
      <Lbl x={66} y={22} text={`${cut} 個に分けて足す`} color={L.text} size={11.5} />
      <Lbl x={F_X.x(1.5)} y={F_X.y(1)} text={`合計 ${(2 * (3 / cut)).toFixed(1)} × ${cut} = 6 J`} color={L.focus} size={11.5} anchor="middle" />
      <Cap text="力が一定なら、何個に分けても合計は6 Jのまま" />
    </LevelFig>
  );
}

// ===== 変化する力の仕事（ui-work-changing）=====

/** 階段状に変わる力: 位置 0-1 で2 N、1-2 で3 N、2-3 で1 N、3-4 で2 N。 */
const STAIR = [2, 3, 1, 2];

function StairBars({ upto, active }: { upto: number; active?: number }) {
  return (
    <g>
      {STAIR.map((f, i) => (
        i < upto ? <Bar key={i} m={F_X} x0={i} x1={i + 1} height={f} active={active === i} /> : null
      ))}
    </g>
  );
}

function StairOutline() {
  const points: string[] = [];
  STAIR.forEach((f, i) => {
    points.push(`${F_X.x(i)},${F_X.y(f)}`, `${F_X.x(i + 1)},${F_X.y(f)}`);
  });
  return <polyline points={points.join(' ')} fill="none" stroke={L.field} strokeWidth={2.5} />;
}

/** 基本事項: 一定の力の長方形。 */
export function StepBase() {
  const t = useT();
  const u = pingPong(t, 6);
  return (
    <LevelFig label="一定の力の仕事は長方形の面積">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <rect x={F_X.x(0)} y={F_X.y(2)} width={(F_X.x(3) - F_X.x(0)) * u} height={F_X.y(0) - F_X.y(2)} fill={L.focus} opacity={0.35} />
      <line x1={F_X.x(0)} y1={F_X.y(2)} x2={F_X.x(3)} y2={F_X.y(2)} stroke={L.field} strokeWidth={2.5} />
      <Lbl x={66} y={22} text="力がずっと2 N、移動が3 m" color={L.text} size={11.5} />
      <Lbl x={F_X.x(1.5)} y={F_X.y(1)} text="W = 2 × 3 = 6 J" color={L.focus} size={12.5} anchor="middle" bold />
      <Cap text="縦2 N・横3 mの長方形。この面積が仕事6 J" />
    </LevelFig>
  );
}

/** 疑問: 力が途中で変わると、どのFを掛けるのか。 */
export function StepStairs() {
  const t = useT();
  const blink = 0.45 + 0.35 * Math.sin(4 * t);
  return (
    <LevelFig label="力が区間ごとに変わる場合">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <StairBars upto={4} />
      <StairOutline />
      {STAIR.map((f, i) => (
        <Lbl key={i} x={F_X.x(i + 0.5)} y={F_X.y(f) - 6} text={`${f} N`} color={L.field} size={10.5} anchor="middle" />
      ))}
      <Lbl x={66} y={22} text="2 N → 3 N → 1 N → 2 N と変わる" color={L.text} size={11.5} />
      <g opacity={blink}>
        <Lbl x={160} y={F_X.y(0) + 18} text="どの F を掛ければよい？" color={L.minus} size={12} anchor="middle" />
      </g>
      <Cap text="一つのFを選べない。長方形1個では表せない" />
    </LevelFig>
  );
}

/** 解決1: 最初の1 mだけを取り出す。 */
export function StepPiece1() {
  const t = useT();
  const glow = 0.6 + 0.25 * Math.sin(3 * t);
  return (
    <LevelFig label="最初の1メートル分の仕事">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <StairBars upto={4} active={0} />
      <StairOutline />
      <rect x={F_X.x(0)} y={F_X.y(2)} width={F_X.x(1) - F_X.x(0)} height={F_X.y(0) - F_X.y(2)}
        fill="none" stroke={L.focus} strokeWidth={2} opacity={glow} />
      <Lbl x={66} y={22} text="区間1: 力2 N、幅1 m" color={L.text} size={11.5} />
      <Lbl x={F_X.x(0.5)} y={F_X.y(1)} text="2 J" color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={150} y={F_X.y(0) + 18} text="ΔW₁ = 2 N × 1 m = 2 J" color={L.focus} size={11.5} />
      <Cap text="区間の中では力が一定なので、長方形1個で計算できる" />
    </LevelFig>
  );
}

/** 解決2: 二つ目を足して5 Jに。 */
export function StepPiece2() {
  const t = useT();
  const u = pingPong(t, 4);
  return (
    <LevelFig label="二つ目の区間を足す">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <StairBars upto={4} active={1} />
      <StairOutline />
      <Lbl x={F_X.x(0.5)} y={F_X.y(1)} text="2 J" color={L.plus} size={11.5} anchor="middle" />
      <Lbl x={F_X.x(1.5)} y={F_X.y(1.5)} text="3 J" color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={66} y={22} text="区間2: 力3 N、幅1 m → 3 J" color={L.text} size={11.5} />
      <Lbl x={150} y={F_X.y(0) + 18} text={`ここまでの合計 ${fmt(2 + 3 * u, 1)} J`} color={L.focus} size={11.5} />
      <Cap text="区間ごとの長方形を、順に足していく" />
    </LevelFig>
  );
}

/** 解決3: 残りの2区間。 */
export function StepPiece34() {
  const t = useT();
  const which = step(t, 2, 1.6);
  return (
    <LevelFig label="残りの区間の仕事">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <StairBars upto={4} active={2 + which} />
      <StairOutline />
      <Lbl x={F_X.x(2.5)} y={F_X.y(0.5)} text="1 J" color={which === 0 ? L.focus : L.plus} size={11.5} anchor="middle" bold={which === 0} />
      <Lbl x={F_X.x(3.5)} y={F_X.y(1)} text="2 J" color={which === 1 ? L.focus : L.plus} size={11.5} anchor="middle" bold={which === 1} />
      <Lbl x={66} y={22} text="区間3: 1 N×1 m = 1 J、区間4: 2 N×1 m = 2 J" color={L.text} size={11} />
      <Lbl x={150} y={F_X.y(0) + 18} text="力が小さい区間は、仕事も小さい" color={L.dim} size={10.5} />
      <Cap text="幅が同じでも、高さが違えば面積は違う" />
    </LevelFig>
  );
}

/** 合計: 4つの小さい仕事を足す。 */
export function StepTotal() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.9), 4);
  const partial = STAIR.slice(0, shown).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="小区間の仕事を全部足す">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      <StairBars upto={shown} active={shown - 1} />
      <StairOutline />
      <Lbl x={66} y={22} text="W = 2 + 3 + 1 + 2" color={L.text} size={12} />
      <Lbl x={66} y={40} text={`足した分 = ${partial} J`} color={L.focus} size={12.5} bold />
      <Lbl x={284} y={40} text={`${shown} / 4 区間`} color={L.dim} size={10.5} anchor="end" />
      <Lbl x={284} y={58} text={shown === 4 ? '合計 8 J' : ''} color={L.focus} size={12} anchor="end" bold />
      <Cap text="区間ごとの「その場所の力 × その区間の距離」の和" />
    </LevelFig>
  );
}

/** 疑問の更新: 滑らかに変わる力。 */
export function StepSmooth() {
  const t = useT();
  const glow = 0.5 + 0.3 * Math.sin(3 * t);
  const f = (x: number) => 1.2 + 1.6 * Math.sin((x / 4) * Math.PI * 0.9);
  return (
    <LevelFig label="滑らかに変わる力">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      {[0, 1, 2, 3].map(i => (
        <Bar key={i} m={F_X} x0={i} x1={i + 1} height={f(i + 0.5)} />
      ))}
      <Curve m={F_X} f={f} color={L.field} xa={0} xb={4} />
      <Lbl x={66} y={22} text="力が階段でなく、なめらかに変わったら？" color={L.text} size={11} />
      <g opacity={glow}>
        <Lbl x={150} y={F_X.y(0) + 18} text="4個の長方形では、はみ出しが残る" color={L.minus} size={10.5} />
      </g>
      <Cap text="曲線と長方形の間にすき間ができ、合計が少しずれる" />
    </LevelFig>
  );
}

/** 予告: 分割を細かくすると近づく。 */
export function StepRefine() {
  const t = useT();
  const counts = [4, 8, 16, 32];
  const n = counts[step(t, counts.length, 1.5)];
  const f = (x: number) => 1.2 + 1.6 * Math.sin((x / 4) * Math.PI * 0.9);
  const w = 4 / n;
  const sum = Array.from({ length: n }, (_, i) => f((i + 0.5) * w) * w).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="分割を細かくすると合計が近づく">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      {Array.from({ length: n }, (_, i) => (
        <Bar key={i} m={F_X} x0={i * w} x1={(i + 1) * w} height={f((i + 0.5) * w)} />
      ))}
      <Curve m={F_X} f={f} color={L.field} xa={0} xb={4} />
      <Lbl x={66} y={22} text={`区間 ${n} 個`} color={L.text} size={11.5} />
      <Lbl x={150} y={F_X.y(0) + 18} text={`合計 ≈ ${sum.toFixed(2)} J`} color={L.focus} size={11.5} />
      <Cap text="細かくするほど、すき間が減って合計が落ち着く" />
    </LevelFig>
  );
}

/** 新しい基本事項: 小さい仕事を足すという読み方。 */
export function StepIntegralPreview() {
  const t = useT();
  const u = pingPong(t, 6);
  const f = (x: number) => 1.2 + 1.6 * Math.sin((x / 4) * Math.PI * 0.9);
  const n = 40, w = 4 / n;
  const filled = Math.max(1, Math.round(n * u));
  return (
    <LevelFig label="小さい仕事を足し集める">
      <Axes m={F_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      {Array.from({ length: filled }, (_, i) => (
        <Bar key={i} m={F_X} x0={i * w} x1={(i + 1) * w} height={f((i + 0.5) * w)} active={i === filled - 1} />
      ))}
      <Curve m={F_X} f={f} color={L.field} xa={0} xb={4} />
      <Lbl x={66} y={22} text="小さい仕事 ΔW = F × Δx を足し集める" color={L.text} size={11} />
      <Lbl x={150} y={F_X.y(0) + 18} text="上級編ではこれを ∫F dx と書く" color={L.minus} size={10.5} />
      <Cap text="足す操作は同じ。細かさの約束だけが変わる" />
    </LevelFig>
  );
}

// ===================================================================
// ===== uim2: 位置と速度・力の地図・F=ma・仕事と速さ・向きを変える力 =====
// ===================================================================

/** 共通部品: 2行の表。列0は行の名前。 */
function TableRow({ y, cells, highlight, color = L.focus }: {
  y: number; cells: string[]; highlight?: number; color?: string;
}) {
  return (
    <g>
      {cells.map((cell, c) => (
        <g key={c}>
          <rect x={12 + c * 50} y={y} width={48} height={28} rx={4}
            fill={c === highlight ? color : L.dim} opacity={c === highlight ? 0.3 : 0.14} />
          <text x={36 + c * 50} y={y + 19} fontSize={c === 0 ? 10 : 11}
            fill={c === highlight ? color : L.text} textAnchor="middle"
            fontWeight={c === highlight ? 700 : 400}>{cell}</text>
        </g>
      ))}
    </g>
  );
}

/** 共通部品: 左右一対の行を積んだカード。 */
function CardRows({ rows, active, y0 = 38, gap = 34, x = 34, w = 252 }: {
  rows: { left: string; right: string; color: string }[];
  active: number; y0?: number; gap?: number; x?: number; w?: number;
}) {
  return (
    <g>
      {rows.map((row, i) => (
        <g key={row.left} opacity={i <= active ? 1 : 0.25}>
          <rect x={x} y={y0 + i * gap} width={w} height={26} rx={6} fill={row.color}
            opacity={i === active ? 0.26 : 0.1} />
          <Lbl x={x + 12} y={y0 + 18 + i * gap} text={row.left} color={L.text} size={11.5} />
          <Lbl x={x + w - 12} y={y0 + 18 + i * gap} text={row.right} color={row.color} size={12}
            anchor="end" bold={i === active} />
        </g>
      ))}
    </g>
  );
}

/** 共通部品: 区間の幅を示すかぎ括弧と、その下のラベル。 */
function Span({ x0, x1, y, text, color = L.path }: {
  x0: number; x1: number; y: number; text: string; color?: string;
}) {
  return (
    <g>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={color} strokeWidth={2} />
      <line x1={x0} y1={y - 5} x2={x0} y2={y + 5} stroke={color} strokeWidth={2} />
      <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke={color} strokeWidth={2} />
      <Lbl x={(x0 + x1) / 2} y={y + 14} text={text} color={color} size={10.5} anchor="middle" />
    </g>
  );
}

// ===== 位置の記録から速度へ（ui-motion-record）=====

/** 記録した台車の位置。0.5 sごと。 */
const REC_T = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
const REC_X = [0, 0.5, 1.2, 2.1, 3.0, 2.6, 2.0];
const XT = mapper([0, 3], [0, 3.2], { x0: 52, y0: 32, x1: 252, y1: 146 });

/** 時刻 tv での記録位置（区間内は直線で補う）。 */
function recX(tv: number): number {
  const c = Math.min(Math.max(tv, 0), 3);
  const i = Math.min(Math.floor(c / 0.5), 5);
  const f = (c - i * 0.5) / 0.5;
  return REC_X[i] + (REC_X[i + 1] - REC_X[i]) * f;
}

/** 原点と正の向きを決める。 */
export function AxisOrigin() {
  const t = useT();
  const p = -2 + 5 * pingPong(t, 7);
  const at = (v: number) => 160 + v * 44;
  return (
    <LevelFig label="原点と正の向きを決めてから位置を測る">
      <Lbl x={18} y={30} text="原点と正の向きを決めてから測る" color={L.text} size={11.5} />
      <Arw x={196} y={60} dx={58} dy={0} color={L.path} w={2.5} />
      <Lbl x={192} y={64} text="正の向き" color={L.path} size={10.5} anchor="end" />
      <line x1={24} y1={100} x2={296} y2={100} stroke={L.dim} strokeWidth={1.8} />
      {[-3, -2, -1, 0, 1, 2, 3].map(v => (
        <g key={v}>
          <line x1={at(v)} y1={94} x2={at(v)} y2={106} stroke={v === 0 ? L.focus : L.dim} strokeWidth={v === 0 ? 2.4 : 1.4} />
          <Lbl x={at(v)} y={120} text={`${fmt(v, 0)}`} color={v === 0 ? L.focus : L.dim} size={10} anchor="middle" />
        </g>
      ))}
      <Lbl x={160} y={138} text="原点 (0 m)" color={L.focus} size={10.5} anchor="middle" />
      <circle cx={at(p)} cy={100} r={6} fill={L.field} />
      <Lbl x={at(p)} y={86} text={`x = ${fmt(p, 1)} m`} color={L.field} size={11} anchor="middle" />
      <Cap text="原点と向きを決めて、はじめて位置が数になる" />
    </LevelFig>
  );
}

/** 0.5 sごとの位置の表。 */
export function PositionTable() {
  const t = useT();
  const hl = step(t, 5, 1) + 1;
  return (
    <LevelFig label="時刻ごとの位置を並べた表">
      <Lbl x={14} y={34} text="0.5 sごとに位置を記録する" color={L.text} size={11.5} />
      <TableRow y={48} cells={['t [s]', '0', '0.5', '1.0', '1.5', '2.0']} highlight={hl} />
      <TableRow y={82} cells={['x [m]', '0', '0.5', '1.2', '2.1', '3.0']} highlight={hl} />
      <Lbl x={160} y={130} text="一行が「その時刻にどこにいたか」" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={154} text={`いま見ている時刻 ${REC_T[hl - 1].toFixed(1)} s`} color={L.focus} size={11} anchor="middle" />
      <Cap text="縦に並んだ2つの数が、一つの記録をつくる" />
    </LevelFig>
  );
}

/** 隣り合う行の差。 */
export function PositionGaps() {
  const t = useT();
  const hl = step(t, 4, 1.2);
  const gaps = [0.5, 0.7, 0.9, 0.9];
  return (
    <LevelFig label="隣り合う位置の差">
      <Lbl x={14} y={34} text="隣り合う行の差を取ってみる" color={L.text} size={11.5} />
      <TableRow y={48} cells={['x [m]', '0', '0.5', '1.2', '2.1', '3.0']} highlight={hl + 2} />
      {gaps.map((g, i) => {
        const c0 = 86 + i * 50;
        const on = i === hl;
        return (
          <g key={i}>
            <Arw x={c0 + 6} y={112} dx={38} dy={0} color={on ? L.focus : L.dim} w={on ? 2.6 : 1.8} head={7} />
            <Lbl x={c0 + 25} y={104} text={`+${g.toFixed(1)}`} color={on ? L.focus : L.dim} size={10.5} anchor="middle" />
          </g>
        );
      })}
      <Lbl x={160} y={138} text="同じ0.5 sでも、進む距離が違う" color={L.text} size={11} anchor="middle" />
      <Lbl x={160} y={156} text="この違いを一つの数で言いたい" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="差の大きさが区間ごとに変わっている" />
    </LevelFig>
  );
}

/** 位置の差 ÷ 時間 = 平均の速度。 */
export function AverageSpeed() {
  const t = useT();
  const u = pingPong(t, 5);
  const xa = XT.x(1.0), ya = XT.y(1.2), xb = XT.x(1.5), yb = XT.y(2.1);
  return (
    <LevelFig label="位置の差を時間で割ると平均の速度">
      <Axes m={XT} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <polyline points={REC_T.map((tv, i) => `${XT.x(tv)},${XT.y(REC_X[i])}`).join(' ')}
        fill="none" stroke={L.dim} strokeWidth={2} />
      <line x1={xa} y1={ya} x2={xb} y2={ya} stroke={L.path} strokeDasharray="4 3" strokeWidth={1.6} />
      <line x1={xb} y1={ya} x2={xb} y2={yb} stroke={L.plus} strokeDasharray="4 3" strokeWidth={1.6} />
      <line x1={xa} y1={ya} x2={xb} y2={yb} stroke={L.focus} strokeWidth={3} />
      <circle cx={xa + (xb - xa) * u} cy={ya + (yb - ya) * u} r={4.5} fill={L.focus} />
      <Lbl x={(xa + xb) / 2} y={ya + 14} text="Δt = 0.5 s" color={L.path} size={10} anchor="middle" />
      <Lbl x={xb + 5} y={(ya + yb) / 2} text="Δx = 0.9 m" color={L.plus} size={10} />
      <Lbl x={92} y={22} text="v = 0.9 ÷ 0.5 = 1.8 m/s" color={L.focus} size={12} />
      <Cap text="横に0.5 s進む間に、縦が0.9 m上がった" />
    </LevelFig>
  );
}

/** 引き返した区間は負の速度。 */
export function BackStep() {
  const t = useT();
  const u = pingPong(t, 5);
  const at = (v: number) => 30 + v * 77.14;
  const p = 3.0 + (2.6 - 3.0) * u;
  return (
    <LevelFig label="引き返した区間は負の速度">
      <Lbl x={18} y={32} text="Δx = 2.6 − 3.0 = −0.4 m" color={L.text} size={11.5} />
      <Lbl x={18} y={54} text="v = −0.4 ÷ 0.5 = −0.8 m/s" color={L.minus} size={12.5} />
      <Lbl x={302} y={32} text="正の向きは右 →" color={L.path} size={10.5} anchor="end" />
      <Arw x={at(3.0)} y={84} dx={at(2.6) - at(3.0)} dy={0} color={L.minus} w={3} head={9} />
      <Lbl x={at(2.6) - 6} y={80} text="左へ0.4 m" color={L.minus} size={10} anchor="end" />
      <rect x={at(p) - 17} y={98} width={34} height={24} rx={5} fill={L.field} opacity={0.9} />
      <line x1={20} y1={124} x2={300} y2={124} stroke={L.dim} strokeWidth={1.8} />
      {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].map(v => (
        <g key={v}>
          <line x1={at(v)} y1={118} x2={at(v)} y2={130} stroke={L.dim} strokeWidth={1.3} />
          <Lbl x={at(v)} y={142} text={v.toFixed(1)} color={L.dim} size={9.5} anchor="middle" />
        </g>
      ))}
      <Cap text="正の向きと逆に動くと、差も速度も負になる" />
    </LevelFig>
  );
}

/** 正の向きを決め直すと符号が入れ替わる。 */
export function FlipDirection() {
  const t = useT();
  const u = (t % 5) / 5;
  const dot = 46 + 216 * u;
  return (
    <LevelFig label="正の向きを決め直すと符号が入れ替わる">
      <Lbl x={20} y={26} text="動きは同じ。決めた向きだけが違う" color={L.text} size={11.5} />
      <Lbl x={20} y={46} text="右を正とすると" color={L.dim} size={11} />
      <Lbl x={300} y={46} text="v = +1.8 m/s" color={L.plus} size={12} anchor="end" />
      <line x1={20} y1={66} x2={300} y2={66} stroke={L.dim} strokeWidth={1.6} />
      <circle cx={dot} cy={66} r={5} fill={L.focus} />
      <Arw x={110} y={54} dx={60} dy={0} color={L.path} w={2.5} />
      <Lbl x={20} y={86} text="正の向き →" color={L.field} size={10.5} />
      <Lbl x={20} y={108} text="左を正とすると" color={L.dim} size={11} />
      <Lbl x={300} y={108} text="v = −1.8 m/s" color={L.minus} size={12} anchor="end" />
      <line x1={20} y1={128} x2={300} y2={128} stroke={L.dim} strokeWidth={1.6} />
      <circle cx={dot} cy={128} r={5} fill={L.focus} />
      <Arw x={110} y={116} dx={60} dy={0} color={L.path} w={2.5} />
      <Lbl x={20} y={148} text="← 正の向き" color={L.field} size={10.5} />
      <Cap text="黄色い点の動きは上下とも同じ。符号だけが違う" />
    </LevelFig>
  );
}

/** 表の数字を点にして打つ。 */
export function XtGraph() {
  const t = useT();
  const n = step(t, 7, 0.75) + 1;
  return (
    <LevelFig label="時刻と位置のグラフ">
      <Axes m={XT} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <polyline points={REC_T.slice(0, n).map((tv, i) => `${XT.x(tv)},${XT.y(REC_X[i])}`).join(' ')}
        fill="none" stroke={L.path} strokeWidth={2.5} strokeLinejoin="round" />
      {REC_T.slice(0, n).map((tv, i) => (
        <circle key={tv} cx={XT.x(tv)} cy={XT.y(REC_X[i])} r={i === n - 1 ? 5.5 : 4}
          fill={i === n - 1 ? L.focus : L.path} />
      ))}
      <Lbl x={92} y={22} text="表の数字を、点にして打つ" color={L.text} size={11.5} />
      <Lbl x={92} y={40} text={`${n} / 7 点`} color={L.dim} size={10} />
      <Cap text="2.0 sまで上がり、その後は下がっていく" />
    </LevelFig>
  );
}

/** 傾きの急さが速度の大きさ。 */
export function SlopeRead() {
  const t = useT();
  const which = step(t, 3, 1.7);
  const segs = [
    { a: 0, b: 0.5, v: '1.0', color: L.plus },
    { a: 1.0, b: 1.5, v: '1.8', color: L.focus },
    { a: 2.0, b: 2.5, v: '−0.8', color: L.minus },
  ];
  const s = segs[which];
  const ia = Math.round(s.a / 0.5), ib = Math.round(s.b / 0.5);
  return (
    <LevelFig label="位置のグラフの傾きが速度">
      <Axes m={XT} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <polyline points={REC_T.map((tv, i) => `${XT.x(tv)},${XT.y(REC_X[i])}`).join(' ')}
        fill="none" stroke={L.dim} strokeWidth={2} />
      <line x1={XT.x(s.a)} y1={XT.y(REC_X[ia])} x2={XT.x(s.b)} y2={XT.y(REC_X[ib])}
        stroke={s.color} strokeWidth={4} />
      <Lbl x={92} y={22} text={`${s.a.toFixed(1)}〜${s.b.toFixed(1)} s の傾き`} color={L.text} size={11} />
      <Lbl x={92} y={40} text={`v = ${s.v} m/s`} color={s.color} size={12.5} bold />
      <Lbl x={66} y={162} text="水平な区間なら v = 0 m/s" color={L.dim} size={10} />
      <Cap text="急なら速く、下り坂なら負。水平なら止まっている" />
    </LevelFig>
  );
}

/** 区間を短くすると、その時刻の速度に近づく。 */
export function ShrinkInterval() {
  const t = useT();
  const h = 1 - 0.9 * pingPong(t, 7);
  const a = Math.max(1.25 - h, 0), b = Math.min(1.25 + h, 3);
  const slope = (recX(b) - recX(a)) / (b - a);
  return (
    <LevelFig label="区間を短くすると平均が近づく">
      <Axes m={XT} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <polyline points={REC_T.map((tv, i) => `${XT.x(tv)},${XT.y(REC_X[i])}`).join(' ')}
        fill="none" stroke={L.dim} strokeWidth={2} />
      <line x1={XT.x(a)} y1={XT.y(recX(a))} x2={XT.x(b)} y2={XT.y(recX(b))} stroke={L.focus} strokeWidth={3} />
      <circle cx={XT.x(a)} cy={XT.y(recX(a))} r={4} fill={L.focus} />
      <circle cx={XT.x(b)} cy={XT.y(recX(b))} r={4} fill={L.focus} />
      <Lbl x={92} y={22} text={`区間の幅 ${fmt(b - a, 2)} s`} color={L.text} size={11.5} />
      <Lbl x={92} y={40} text={`平均 ${fmt(slope, 2)} m/s`} color={L.focus} size={12.5} bold />
      <Lbl x={66} y={162} text="狭めると 1.8 m/s に落ち着く" color={L.dim} size={10} />
      <Cap text="幅が狭いほど、その時刻の速度に近い値になる" />
    </LevelFig>
  );
}

/** 速度を読む三手順。 */
export function RecordSummary() {
  const t = useT();
  const active = step(t, 3, 1.4);
  return (
    <LevelFig label="速度を読む三つの手順">
      <Lbl x={30} y={28} text="この三手順で速度が出る" color={L.text} size={11.5} />
      <CardRows active={active} y0={40} x={30} w={260} rows={[
        { left: '① 原点と正の向きを決める', right: '右を正', color: L.path },
        { left: '② 時刻ごとの位置を記録', right: 't と x の表', color: L.field },
        { left: '③ 差を取って時間で割る', right: 'v = Δx ÷ Δt', color: L.focus },
      ]} />
      <Lbl x={160} y={158} text="向きを決めずに測ると、符号の意味が消える" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="どれか一つ抜けると、速度の値が決まらない" />
    </LevelFig>
  );
}

// ===== 力の地図を描く（ui-force-map）=====

/** 自由物体図の矢印。大きさの目安として長さは √F に比例させる。 */
const fbdLen = (f: number) => 8.2 * Math.sqrt(f);

/** 対象を一つだけ囲む。 */
export function IsolateRing() {
  const t = useT();
  const glow = 0.55 + 0.35 * Math.sin(3 * t);
  return (
    <LevelFig label="力を数える対象を一つだけ囲む">
      <Lbl x={16} y={30} text="力を数える対象を、一つだけ囲む" color={L.text} size={11.5} />
      <Lbl x={16} y={50} text="手も床も、輪の外から力を及ぼす相手" color={L.dim} size={10.5} />
      <Floor y={134} />
      <rect x={92} y={110} width={36} height={20} rx={5} fill={L.dim} opacity={0.5} />
      <Lbl x={110} y={104} text="手" color={L.dim} size={10.5} anchor="middle" />
      <rect x={140} y={104} width={44} height={30} rx={5} fill={L.field} opacity={0.9} />
      <Lbl x={162} y={124} text="箱" color={L.text} size={11} anchor="middle" />
      <ellipse cx={162} cy={118} rx={46} ry={34} fill="none" stroke={L.focus}
        strokeWidth={2.2} strokeDasharray="6 4" opacity={glow} />
      <Lbl x={214} y={112} text="この輪の中だけ" color={L.focus} size={10.5} />
      <Lbl x={214} y={128} text="を数える" color={L.focus} size={10.5} />
      <Lbl x={16} y={158} text="床（輪の外）" color={L.dim} size={10} />
      <Cap text="囲みの内と外で、数える力と数えない力を分ける" />
    </LevelFig>
  );
}

/** 箱に外から働く4本の力。 */
export function ForcesOnBox() {
  const t = useT();
  const which = step(t, 4, 1.2);
  const arrows = [
    { x: 160, y: 80, dx: 0, dy: -fbdLen(20), lx: 166, ly: 40, text: '垂直抗力 20 N' },
    { x: 160, y: 108, dx: 0, dy: fbdLen(20), lx: 166, ly: 152, text: '重力 20 N' },
    { x: 178, y: 94, dx: fbdLen(6), dy: 0, lx: 204, ly: 90, text: '押す力 6 N' },
    { x: 142, y: 94, dx: -fbdLen(2), dy: 0, lx: 126, ly: 90, text: '摩擦 2 N', end: true },
  ];
  return (
    <LevelFig label="箱に外から働く四つの力">
      <Lbl x={14} y={26} text="箱に外から働く力だけを描く" color={L.text} size={11.5} />
      <Lbl x={14} y={46} text="速度は力ではないので描かない" color={L.dim} size={9.5} />
      <rect x={142} y={80} width={36} height={28} rx={5} fill={L.dim} opacity={0.5} />
      {arrows.map((a, i) => (
        <g key={a.text}>
          <Arw x={a.x} y={a.y} dx={a.dx} dy={a.dy} color={i === which ? L.focus : L.field} w={i === which ? 3.4 : 2.5} head={7} />
          <Lbl x={a.lx} y={a.ly} text={a.text} color={i === which ? L.focus : L.field} size={10.5}
            anchor={a.end ? 'end' : 'start'} bold={i === which} />
        </g>
      ))}
      <Cap text="4本とも、箱という一つの物体に働いている" />
    </LevelFig>
  );
}

/** どう足せば右向きが出てくるのか。 */
export function WhichMatters() {
  const t = useT();
  const blink = 0.62 + 0.28 * Math.sin(3.4 * t);
  return (
    <LevelFig label="どの矢印が動きを変えるのか">
      <Lbl x={14} y={26} text="4本が同じだけ効くなら、動かないはず" color={L.text} size={11} />
      <rect x={142} y={60} width={36} height={28} rx={5} fill={L.dim} opacity={0.35} />
      <Arw x={160} y={74} dx={0} dy={-34} color={L.dim} w={2.2} />
      <Arw x={160} y={74} dx={0} dy={34} color={L.dim} w={2.2} />
      <Arw x={160} y={74} dx={22} dy={0} color={L.dim} w={2.2} />
      <Arw x={160} y={74} dx={-16} dy={0} color={L.dim} w={2.2} />
      <Lbl x={166} y={38} text="20 N" color={L.dim} size={10} />
      <Lbl x={166} y={118} text="20 N" color={L.dim} size={10} />
      <Lbl x={186} y={70} text="6 N" color={L.dim} size={10} />
      <Lbl x={140} y={62} text="2 N" color={L.dim} size={10} anchor="end" />
      <Arw x={110} y={132} dx={72} dy={0} color={L.path} w={3.5} />
      <Lbl x={186} y={136} text="こちらへ動き出す" color={L.path} size={10.5} />
      <g opacity={blink}>
        <Lbl x={160} y={158} text="どう足せば、この向きが出る？" color={L.minus} size={11.5} anchor="middle" />
      </g>
      <Cap text="足し方を決めないと、どちらへ動くか言えない" />
    </LevelFig>
  );
}

/** 向かい合う二力は相殺する。 */
export function BalancePair() {
  const t = useT();
  const on = step(t, 3, 1.3);
  return (
    <LevelFig label="向かい合う二力が相殺する">
      <Lbl x={16} y={32} text="向かい合う二力を、符号を付けて足す" color={L.text} size={11.5} />
      <Lbl x={20} y={66} text="上向きを正" color={L.dim} size={11} />
      <Lbl x={20} y={92} text="20 − 20 = 0 N" color={on === 2 ? L.focus : L.dim} size={13} bold={on === 2} />
      <Lbl x={20} y={114} text="縦には何も残らない" color={L.dim} size={10.5} />
      <rect x={194} y={84} width={40} height={26} rx={5} fill={L.dim} opacity={0.5} />
      <Arw x={214} y={97} dx={0} dy={-40} color={on === 0 ? L.focus : L.field} w={on === 0 ? 3.4 : 2.6} />
      <Arw x={214} y={97} dx={0} dy={40} color={on === 1 ? L.focus : L.field} w={on === 1 ? 3.4 : 2.6} />
      <Lbl x={242} y={50} text="垂直抗力" color={L.field} size={10} />
      <Lbl x={242} y={62} text="20 N" color={L.field} size={10} />
      <Lbl x={242} y={134} text="重力" color={L.field} size={10} />
      <Lbl x={242} y={146} text="20 N" color={L.field} size={10} />
      <Cap text="同じ大きさで逆向きなら、足して0になる" />
    </LevelFig>
  );
}

/** 横向きの力を足すと4 Nが残る。 */
export function NetForce() {
  const t = useT();
  const show = step(t, 3, 1.3);
  return (
    <LevelFig label="横向きの力を足すと合力が残る">
      <Lbl x={16} y={30} text="右向きを正とすると" color={L.text} size={11.5} />
      <Lbl x={16} y={54} text="6 − 2 = 4 N" color={L.focus} size={14} bold />
      <Lbl x={16} y={74} text="残った4 Nが合力" color={L.focus} size={11} />
      <g opacity={show === 2 ? 1 : 0.25}>
        <Arw x={150} y={88} dx={24} dy={0} color={L.focus} w={3.5} />
        <Lbl x={178} y={92} text="合力 4 N" color={L.focus} size={10.5} />
      </g>
      <Floor y={140} />
      <rect x={138} y={108} width={44} height={32} rx={5} fill={L.field} opacity={0.85} />
      <Arw x={182} y={124} dx={36} dy={0} color={show === 0 ? L.focus : L.plus} w={3} />
      <Lbl x={222} y={120} text="押す力 6 N" color={L.plus} size={10.5} />
      <Arw x={138} y={124} dx={-12} dy={0} color={show === 1 ? L.focus : L.minus} w={3} head={7} />
      <Lbl x={122} y={120} text="摩擦 2 N" color={L.minus} size={10.5} anchor="end" />
      <Cap text="相殺しきれずに残った4 Nだけが、速度を変える" />
    </LevelFig>
  );
}

/** 斜めの力を縦と横に分けて列へ入れる。 */
export function AxisSplit() {
  const t = useT();
  const deg = 25 + 35 * pingPong(t, 7);
  const th = (deg * Math.PI) / 180;
  const ox = 150, oy = 104, len = 66;
  const cx = len * Math.cos(th), cy = len * Math.sin(th);
  return (
    <LevelFig label="斜めの力を縦と横に分ける">
      <Lbl x={16} y={28} text="斜めの力は、縦と横に分けて列へ入れる" color={L.text} size={11} />
      <Floor y={134} />
      <rect x={104} y={104} width={46} height={30} rx={5} fill={L.field} opacity={0.85} />
      <line x1={ox + cx} y1={oy - cy} x2={ox + cx} y2={oy} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={ox + cx} y1={oy - cy} x2={ox} y2={oy - cy} stroke={L.dim} strokeDasharray="4 3" />
      <Arw x={ox} y={oy} dx={cx} dy={-cy} color={L.field} w={3} />
      <Lbl x={ox + cx + 6} y={oy - cy - 4} text="斜めの力" color={L.field} size={10.5} />
      <Arw x={ox} y={oy} dx={cx} dy={0} color={L.focus} w={4} />
      <Lbl x={ox + cx / 2} y={120} text="横の分" color={L.focus} size={10} anchor="middle" />
      <Arw x={ox} y={oy} dx={0} dy={-cy} color={L.plus} w={3} />
      <Lbl x={144} y={oy - cy / 2 + 4} text="縦の分" color={L.plus} size={10} anchor="end" />
      <Lbl x={16} y={152} text="縦は支える側と、横は進む側と足し合わせる" color={L.dim} size={10.5} />
      <Cap text="分けてから足せば、矢印が何本でも扱える" />
    </LevelFig>
  );
}

/** 作用と反作用を同じ図に入れてしまう誤り。 */
export function ActionPair() {
  const t = useT();
  const blink = 0.62 + 0.28 * Math.sin(3.2 * t);
  return (
    <LevelFig label="作用と反作用を同じ図に入れた場合">
      <Lbl x={160} y={32} text="両方を箱の図に入れると…" color={L.text} size={11.5} anchor="middle" />
      <g opacity={blink}>
        <Lbl x={160} y={54} text="6 − 6 = 0 で永久に動かない" color={L.minus} size={12.5} anchor="middle" />
      </g>
      <Floor y={152} />
      <ellipse cx={163} cy={124} rx={60} ry={30} fill="none" stroke={L.minus}
        strokeWidth={2} strokeDasharray="6 4" />
      <rect x={72} y={112} width={38} height={24} rx={5} fill={L.dim} opacity={0.5} />
      <Lbl x={91} y={106} text="手" color={L.dim} size={10} anchor="middle" />
      <rect x={140} y={120} width={46} height={32} rx={5} fill={L.field} opacity={0.85} />
      <Arw x={116} y={118} dx={20} dy={0} color={L.plus} w={3} head={7} />
      <Lbl x={190} y={116} text="手 → 箱 6 N" color={L.plus} size={10} />
      <Arw x={138} y={134} dx={-20} dy={0} color={L.minus} w={3} head={7} />
      <Lbl x={190} y={138} text="箱 → 手 6 N" color={L.minus} size={10} />
      <Cap text="同じ図に二本入れると、合力が消えてしまう" />
    </LevelFig>
  );
}

/** 物体ごとに図を分ける。 */
export function TwoDiagrams() {
  const t = useT();
  const side = step(t, 2, 1.6);
  return (
    <LevelFig label="物体ごとに分けた二つの図">
      <Lbl x={80} y={30} text="箱の図" color={L.text} size={11.5} anchor="middle" />
      <Lbl x={240} y={30} text="手の図" color={L.text} size={11.5} anchor="middle" />
      <line x1={160} y1={40} x2={160} y2={150} stroke={L.dim} strokeWidth={1.4} strokeDasharray="4 4" />
      <g opacity={side === 0 ? 1 : 0.4}>
        <ellipse cx={80} cy={85} rx={44} ry={32} fill="none" stroke={L.focus} strokeWidth={2} strokeDasharray="6 4" />
        <rect x={60} y={70} width={40} height={30} rx={5} fill={L.field} opacity={0.85} />
        <Arw x={34} y={85} dx={24} dy={0} color={L.plus} w={3} />
        <Lbl x={80} y={126} text="手が箱を押す 6 N" color={L.plus} size={10} anchor="middle" />
      </g>
      <g opacity={side === 1 ? 1 : 0.4}>
        <ellipse cx={242} cy={85} rx={42} ry={30} fill="none" stroke={L.focus} strokeWidth={2} strokeDasharray="6 4" />
        <rect x={224} y={72} width={36} height={26} rx={5} fill={L.dim} opacity={0.6} />
        <Arw x={290} y={85} dx={-24} dy={0} color={L.minus} w={3} />
        <Lbl x={242} y={126} text="箱が手を押す 6 N" color={L.minus} size={10} anchor="middle" />
      </g>
      <Lbl x={160} y={152} text="相手が違うので、同じ図には並ばない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="作用と反作用は、別々の図に一本ずつ入る" />
    </LevelFig>
  );
}

/** つり合いと作用反作用の見分け。 */
export function BalanceVsPair() {
  const t = useT();
  const active = step(t, 2, 1.8);
  const rows = [
    { title: 'つり合い', detail: '同じ一つの物体に働く二力。足すと0', color: L.plus },
    { title: '作用反作用', detail: '二つの物体が及ぼし合う一組。別の図', color: L.minus },
  ];
  return (
    <LevelFig label="つり合いと作用反作用の見分け">
      <Lbl x={20} y={32} text="二つを見分ける基準" color={L.text} size={11.5} />
      {rows.map((row, i) => (
        <g key={row.title} opacity={i === active ? 1 : 0.5}>
          <rect x={20} y={46 + i * 44} width={280} height={36} rx={6} fill={row.color}
            opacity={i === active ? 0.24 : 0.1} />
          <Lbl x={32} y={64 + i * 44} text={row.title} color={row.color} size={11.5} bold />
          <Lbl x={32} y={78 + i * 44} text={row.detail} color={L.text} size={10} />
        </g>
      ))}
      <Lbl x={160} y={150} text="同じ物体か、別の物体か。まずそこを見る" color={L.focus} size={11} anchor="middle" />
      <Cap text="同じ物体に働くならつり合い、別なら作用反作用" />
    </LevelFig>
  );
}

// ===== F=ma が決めるもの（ui-newton-small-step）=====

/** 縦軸は速度 [m/s]、横軸は時刻 [s]。m=2 kg、F=4 N、a=2 m/s²。 */
const VT = mapper([0, 2.2], [0, 4.6], { x0: 52, y0: 32, x1: 252, y1: 142 });

/** 合力が残ると速度が変わる。 */
export function NetChangesV() {
  const t = useT();
  const u = (t % 4) / 4;
  const bx = 40 + 180 * u;
  return (
    <LevelFig label="合力が残ると速度が増えていく">
      <Lbl x={16} y={30} text="合力 4 N が残っている 2 kg の箱" color={L.text} size={11.5} />
      <Lbl x={16} y={52} text="変わるのは位置ではなく、速度" color={L.dim} size={10.5} />
      <Lbl x={16} y={76} text={`速度 ${fmt(4 * u, 1)} m/s`} color={L.focus} size={13} bold />
      <Floor y={140} />
      <rect x={bx} y={108} width={44} height={32} rx={5} fill={L.field} opacity={0.85} />
      <Arw x={bx - 32} y={124} dx={26} dy={0} color={L.plus} w={3} />
      <Arw x={bx + 10} y={96} dx={8 + 46 * u} dy={0} color={L.path} w={3} />
      <Lbl x={bx + 10} y={88} text="速度" color={L.path} size={10} />
      <Cap text="力があるかぎり、速度の矢印が伸び続ける" />
    </LevelFig>
  );
}

/** a = F ÷ m の割り算。 */
export function FmaNumber() {
  const t = useT();
  const active = step(t, 3, 1.4);
  return (
    <LevelFig label="合力を質量で割って加速度を出す">
      <CardRows active={active} y0={36} x={40} w={240} rows={[
        { left: '合力 F', right: '4 N', color: L.field },
        { left: '質量 m', right: '2 kg', color: L.path },
        { left: '加速度 a = F ÷ m', right: '2 m/s²', color: L.focus },
      ]} />
      <Lbl x={160} y={156} text="1秒ごとに速度が 2 m/s 増える、という意味" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="割り算1回で、いまの加速度が決まる" />
    </LevelFig>
  );
}

/** 同じ力でも質量が大きいと加速度が小さい。 */
export function MassCompare() {
  const t = useT();
  const u = (t % 5) / 5;
  const ax = 36 + 160 * u * u;
  const bx = 36 + 80 * u * u;
  return (
    <LevelFig label="同じ力でも質量が違うと加速度が違う">
      <Lbl x={20} y={40} text="2 kg に 4 N → a = 2 m/s²" color={L.text} size={11} />
      <Floor y={78} />
      <rect x={ax} y={52} width={34} height={26} rx={5} fill={L.field} opacity={0.85} />
      <Arw x={ax - 28} y={66} dx={24} dy={0} color={L.plus} w={3} />
      <Lbl x={20} y={108} text="4 kg に 4 N → a = 1 m/s²" color={L.text} size={11} />
      <Floor y={146} />
      <rect x={bx} y={120} width={34} height={26} rx={5} fill={L.field} opacity={0.5} />
      <Arw x={bx - 28} y={134} dx={24} dy={0} color={L.plus} w={3} />
      <Lbl x={300} y={160} text="同じ力でも、重いと加速度は半分" color={L.dim} size={10} anchor="end" />
      <Cap text="同じ4 Nでも、質量が2倍なら加速度は半分" />
    </LevelFig>
  );
}

/** 加速度に時間を掛けると速度の増え分。 */
export function HalfSecond() {
  const t = useT();
  const sweep = 40 + 100 * pingPong(t, 4);
  return (
    <LevelFig label="加速度に時間を掛けると速度の増え分">
      <Lbl x={20} y={34} text="加速度 2 m/s² に、時間を掛ける" color={L.text} size={11.5} />
      <rect x={40} y={52} width={200} height={24} rx={5} fill={L.field} opacity={0.3} />
      <Lbl x={140} y={68} text="1 s → 2 m/s 増える" color={L.field} size={11} anchor="middle" />
      <rect x={40} y={96} width={100} height={24} rx={5} fill={L.focus} opacity={0.45} />
      <Lbl x={90} y={112} text="0.5 s → 1 m/s" color={L.text} size={11} anchor="middle" />
      <line x1={sweep} y1={92} x2={sweep} y2={124} stroke={L.focus} strokeWidth={2} />
      <Lbl x={20} y={148} text="Δv = a × Δt = 2 × 0.5 = 1 m/s" color={L.focus} size={12} />
      <Cap text="時間が半分なら、速度の増え分も半分" />
    </LevelFig>
  );
}

/** 0.5 sごとの速度の表。 */
export function VelocityTable() {
  const t = useT();
  const hl = step(t, 5, 0.9) + 1;
  return (
    <LevelFig label="0.5秒ごとの速度の表">
      <Lbl x={14} y={34} text="0.5 sごとに、速度を書き足す" color={L.text} size={11} />
      <TableRow y={46} cells={['t [s]', '0', '0.5', '1.0', '1.5', '2.0']} highlight={hl} />
      <TableRow y={78} cells={['v [m/s]', '0', '1', '2', '3', '4']} highlight={hl} />
      {[0, 1, 2, 3].map(i => {
        const c0 = 86 + i * 50;
        const on = i === hl - 2;
        return (
          <g key={i}>
            <Arw x={c0 + 6} y={124} dx={38} dy={0} color={on ? L.focus : L.plus} w={on ? 2.6 : 1.8} head={7} />
            <Lbl x={c0 + 25} y={116} text="+1" color={on ? L.focus : L.plus} size={10.5} anchor="middle" />
          </g>
        );
      })}
      <Lbl x={160} y={148} text="毎回ちょうど 1 m/s ずつ増える" color={L.focus} size={11} anchor="middle" />
      <Cap text="一行進むごとに、同じ1 m/sが足される" />
    </LevelFig>
  );
}

/** 速度のグラフは直線。 */
export function VLine() {
  const t = useT();
  const n = step(t, 5, 0.8) + 1;
  const pts = [0, 0.5, 1, 1.5, 2];
  return (
    <LevelFig label="速度のグラフは直線になる">
      <Axes m={VT} xLabel="時刻 t [s]" yLabel="速度 v [m/s]" />
      <Curve m={VT} f={x => 2 * x} color={L.field} xa={0} xb={2.1} />
      {pts.slice(0, n).map((tv, i) => (
        <circle key={tv} cx={VT.x(tv)} cy={VT.y(2 * tv)} r={i === n - 1 ? 5.5 : 4}
          fill={i === n - 1 ? L.focus : L.path} />
      ))}
      <line x1={VT.x(1)} y1={VT.y(2)} x2={VT.x(2)} y2={VT.y(2)} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={VT.x(2)} y1={VT.y(2)} x2={VT.x(2)} y2={VT.y(4)} stroke={L.dim} strokeDasharray="4 3" />
      <Lbl x={(VT.x(1) + VT.x(2)) / 2} y={VT.y(2) + 13} text="1 s" color={L.dim} size={10} anchor="middle" />
      <Lbl x={VT.x(2) + 5} y={(VT.y(2) + VT.y(4)) / 2} text="2 m/s" color={L.dim} size={10} />
      <Lbl x={92} y={22} text="点は一直線に並ぶ" color={L.text} size={11.5} />
      <Lbl x={92} y={40} text="傾き = 加速度 2 m/s²" color={L.focus} size={11} />
      <Cap text="直線の傾きが、そのまま加速度にあたる" />
    </LevelFig>
  );
}

/** どの速度に時間を掛ければよいか分からない。 */
export function PosQuestion() {
  const t = useT();
  const blink = 0.62 + 0.28 * Math.sin(3.2 * t);
  return (
    <LevelFig label="どの速度に時間を掛けるのか">
      <Axes m={VT} xLabel="時刻 t [s]" yLabel="速度 v [m/s]" />
      <rect x={VT.x(0)} y={VT.y(4)} width={VT.x(2) - VT.x(0)} height={VT.y(0) - VT.y(4)}
        fill="none" stroke={L.minus} strokeWidth={1.8} strokeDasharray="5 4" />
      <Curve m={VT} f={x => 2 * x} color={L.field} xa={0} xb={2.1} />
      <g opacity={blink}>
        <Lbl x={VT.x(1)} y={VT.y(4) + 15} text="4 m/s なら 8 m（大きすぎ）" color={L.minus} size={10} anchor="middle" />
        <Lbl x={VT.x(1)} y={VT.y(0) - 8} text="0 m/s なら 0 m（小さすぎ）" color={L.minus} size={10} anchor="middle" />
      </g>
      <Lbl x={92} y={22} text="どの速度に 2.0 s を掛ける？" color={L.text} size={11.5} />
      <Cap text="速度が変わり続けるので、一つの値では決まらない" />
    </LevelFig>
  );
}

/** 区間の平均の速度で、その区間の距離を出す。 */
export function StripDistance() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="区間の平均の速度で距離を出す">
      <Axes m={VT} xLabel="時刻 t [s]" yLabel="速度 v [m/s]" />
      <Bar m={VT} x0={1} x1={1.5} height={2.5} active />
      <Curve m={VT} f={x => 2 * x} color={L.field} xa={0} xb={2.1} />
      <line x1={VT.x(1)} y1={VT.y(2.5)} x2={VT.x(1.5)} y2={VT.y(2.5)} stroke={L.focus}
        strokeWidth={2.4} opacity={glow} />
      <circle cx={VT.x(1)} cy={VT.y(2)} r={4} fill={L.path} />
      <circle cx={VT.x(1.5)} cy={VT.y(3)} r={4} fill={L.path} />
      <Lbl x={VT.x(1) - 4} y={VT.y(2) - 6} text="2 m/s" color={L.path} size={10} anchor="end" />
      <Lbl x={VT.x(1.5) + 5} y={VT.y(3) - 4} text="3 m/s" color={L.path} size={10} />
      <Lbl x={92} y={22} text="前後の平均 2.5 m/s を使う" color={L.text} size={11.5} />
      <Lbl x={VT.x(1.25)} y={VT.y(1.1)} text="2.5 × 0.5 = 1.25 m" color={L.text} size={10.5} anchor="middle" />
      <Cap text="長方形の高さは、区間の前後の速度の平均" />
    </LevelFig>
  );
}

/** 位置の積み上がり方。 */
export function XCurve() {
  const t = useT();
  const n = step(t, 5, 0.9);
  const XP = mapper([0, 2.2], [0, 4.6], { x0: 52, y0: 32, x1: 252, y1: 142 });
  const pts = [
    { tv: 0.5, x: 0.25 }, { tv: 1, x: 1 }, { tv: 1.5, x: 2.25 }, { tv: 2, x: 4 },
  ];
  return (
    <LevelFig label="位置の積み上がり方">
      <Axes m={XP} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <Curve m={XP} f={x => x * x} color={L.dim} xa={0} xb={2.1} w={2} dash="4 3" />
      <polyline points={[{ tv: 0, x: 0 }, ...pts].slice(0, n + 1).map(p => `${XP.x(p.tv)},${XP.y(p.x)}`).join(' ')}
        fill="none" stroke={L.path} strokeWidth={2.5} strokeLinejoin="round" />
      {pts.slice(0, n).map((p, i) => (
        <g key={p.tv}>
          <circle cx={XP.x(p.tv)} cy={XP.y(p.x)} r={i === n - 1 ? 5.5 : 4} fill={i === n - 1 ? L.focus : L.path} />
          {i === n - 1 && (
            <Lbl x={XP.x(p.tv) + 7} y={XP.y(p.x) + 4} text={`${p.x.toFixed(2)} m`} color={L.focus} size={11} bold />
          )}
        </g>
      ))}
      <Lbl x={92} y={22} text="同じ0.5 sでも、進む距離が増える" color={L.text} size={11} />
      <Cap text="0.25、0.75、1.25、1.75 mと、足す量が増える" />
    </LevelFig>
  );
}

/** 力を止めると加速度が0になり、速度は残る。 */
export function ForceOff() {
  const t = useT();
  const FO = mapper([0, 4], [0, 5], { x0: 52, y0: 32, x1: 252, y1: 142 });
  const u = (t % 5) / 5;
  const tv = 4 * u;
  const vv = tv <= 2 ? 2 * tv : 4;
  return (
    <LevelFig label="力を止めると速度は保たれる">
      <Axes m={FO} xLabel="時刻 t [s]" yLabel="速度 v [m/s]" />
      <line x1={FO.x(2)} y1={FO.y(0)} x2={FO.x(2)} y2={FO.y(4)} stroke={L.dim} strokeDasharray="4 3" />
      <Curve m={FO} f={x => (x <= 2 ? 2 * x : 4)} color={L.path} xa={0} xb={4} />
      <circle cx={FO.x(tv)} cy={FO.y(vv)} r={5} fill={L.focus} />
      <Lbl x={92} y={22} text="2.0 s で合力を 0 にする" color={L.text} size={11.5} />
      <Lbl x={92} y={42} text="合力 4 N → 傾き 2" color={L.field} size={10.5} />
      <Lbl x={202} y={76} text="速度は 4 m/s のまま" color={L.focus} size={10.5} anchor="middle" />
      <Lbl x={60} y={162} text="力が決めるのは加速度。速度は残る" color={L.focus} size={10.5} />
      <Cap text="傾きが0になるだけで、速度は減らない" />
    </LevelFig>
  );
}

// ===== 仕事が速さを変える（ui-energy-change）=====

/** 同じ力でも押す距離が違うと速さが違う。 */
export function WorkToSpeed() {
  const t = useT();
  const u = (t % 4) / 4;
  const ax = 40 + 40 * u, bx = 40 + 120 * u;
  const sp = Math.sqrt(u);
  return (
    <LevelFig label="押す距離が違うと速さが違う">
      <Lbl x={20} y={34} text="同じ 3 N でも、押す距離が違う" color={L.text} size={11.5} />
      <Floor y={76} />
      <rect x={ax} y={50} width={32} height={26} rx={5} fill={L.field} opacity={0.85} />
      <Arw x={ax - 26} y={63} dx={22} dy={0} color={L.plus} w={2.6} />
      <Arw x={ax + 36} y={44} dx={2 + 24 * sp} dy={0} color={L.path} w={2.6} />
      <Lbl x={300} y={52} text="W = 3 J" color={L.focus} size={11} anchor="end" />
      <Floor y={142} />
      <rect x={bx} y={116} width={32} height={26} rx={5} fill={L.field} opacity={0.85} />
      <Arw x={bx - 26} y={129} dx={22} dy={0} color={L.plus} w={2.6} />
      <Arw x={bx + 36} y={110} dx={2 + 41.6 * sp} dy={0} color={L.path} w={2.6} />
      <Lbl x={300} y={122} text="W = 9 J" color={L.focus} size={11} anchor="end" />
      <Lbl x={20} y={162} text="仕事が大きいほど速い。では何と一致する？" color={L.dim} size={10} />
      <Cap text="黄色い矢印が速度。長く押したほうが長く伸びる" />
    </LevelFig>
  );
}

/** 混ざるものを外す条件の札。 */
export function ConditionsCard() {
  const t = useT();
  const active = step(t, 3, 1.4);
  const rows = ['水平面 — 高さが変わらない', '摩擦なし — 熱にならない', '静止から出発 — 初速は 0 m/s'];
  return (
    <LevelFig label="この段で置く三つの条件">
      <Lbl x={20} y={32} text="混ざるものを、先に外しておく" color={L.text} size={11.5} />
      {rows.map((text, i) => (
        <g key={text} opacity={i <= active ? 1 : 0.3}>
          <rect x={26} y={46 + i * 32} width={268} height={26} rx={6} fill={L.plus}
            opacity={i === active ? 0.24 : 0.1} />
          <Lbl x={40} y={64 + i * 32} text="✓" color={L.plus} size={12} bold />
          <Lbl x={60} y={64 + i * 32} text={text} color={L.text} size={11} />
        </g>
      ))}
      <Lbl x={160} y={156} text="この三つを外すと、W = FL だけが効く" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="条件を書かないと、何が混ざったか分からない" />
    </LevelFig>
  );
}

/** 3 Nで3 m押して9 J。 */
export function Push9J() {
  const t = useT();
  const u = pingPong(t, 6);
  const bx = 40 + 120 * u;
  return (
    <LevelFig label="3ニュートンで3メートル押すと9ジュール">
      <Lbl x={16} y={32} text="F = 3 N、同じ向きに 3 m" color={L.text} size={11.5} />
      <Lbl x={16} y={56} text={`W = 3 × ${fmt(3 * u, 1)} = ${fmt(9 * u, 1)} J`} color={L.focus} size={13} bold />
      <Lbl x={16} y={78} text="単位は N·m = J" color={L.dim} size={10.5} />
      <Floor y={134} />
      <rect x={bx} y={106} width={40} height={28} rx={5} fill={L.field} opacity={0.85} />
      <Arw x={bx - 30} y={120} dx={26} dy={0} color={L.plus} w={3} />
      <Span x0={40} x1={160} y={146} text="L = 3 m" />
      <Cap text="掛け算1回。単位も一緒に掛けてJになる" />
    </LevelFig>
  );
}

/** 9 Jはどこへ行ったのか。 */
export function Where9J() {
  const t = useT();
  const blink = 0.62 + 0.28 * Math.sin(3.2 * t);
  return (
    <LevelFig label="した仕事はどこへ行ったのか">
      <Lbl x={20} y={34} text="押し終えた物体は 3 m/s になっていた" color={L.text} size={11} />
      <rect x={18} y={54} width={104} height={48} rx={8} fill={L.field} opacity={0.22} />
      <Lbl x={70} y={74} text="した仕事" color={L.text} size={11} anchor="middle" />
      <Lbl x={70} y={94} text="9 J" color={L.focus} size={15} anchor="middle" bold />
      <Arw x={128} y={78} dx={56} dy={0} color={L.path} w={3} />
      <rect x={192} y={54} width={110} height={48} rx={8} fill={L.focus} opacity={0.18} />
      <Lbl x={247} y={74} text="3 m/s で動く" color={L.text} size={11} anchor="middle" />
      <g opacity={blink}>
        <Lbl x={247} y={94} text="? J" color={L.minus} size={15} anchor="middle" bold />
      </g>
      <Lbl x={160} y={128} text="熱も出ず、高さも変わっていない" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={150} text="この 9 J は、どこへ行ったのか" color={L.minus} size={11.5} anchor="middle" />
      <Cap text="仕事の分は、動きの状態のほうに移ったはず" />
    </LevelFig>
  );
}

/** 速さから½mv²を作る。 */
export function HalfMv2() {
  const t = useT();
  const active = step(t, 3, 1.4);
  return (
    <LevelFig label="速さから½mv²を作る">
      <CardRows active={active} y0={36} x={40} w={240} rows={[
        { left: '質量 m', right: '2 kg', color: L.path },
        { left: '速さ v', right: '3 m/s', color: L.field },
        { left: '½ m v²', right: '½×2×3² = 9 J', color: L.focus },
      ]} />
      <Lbl x={160} y={156} text="単位は kg·m²/s² = N·m = J" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="速さから作った数が、ちょうど9 Jになる" />
    </LevelFig>
  );
}

/** 数値を変えても二つの値は一致する。 */
export function Match9J() {
  const t = useT();
  const which = step(t, 2, 2.2);
  const cases = [{ f: 3, l: 3, v: 3, w: 9 }, { f: 4, l: 4, v: 4, w: 16 }];
  const c = cases[which];
  const h = c.w * 5.25;
  return (
    <LevelFig label="した仕事と運動エネルギーの高さ比べ">
      <Lbl x={16} y={28} text={`F = ${c.f} N、L = ${c.l} m、v = ${c.v} m/s`} color={L.text} size={11} />
      <rect x={70} y={140 - h} width={54} height={h} rx={4} fill={L.field} opacity={0.5} />
      <rect x={190} y={140 - h} width={54} height={h} rx={4} fill={L.focus} opacity={0.5} />
      <Lbl x={97} y={134 - h} text={`${c.w} J`} color={L.field} size={12} anchor="middle" bold />
      <Lbl x={217} y={134 - h} text={`${c.w} J`} color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={157} y={104} text="=" color={L.text} size={20} anchor="middle" bold />
      <Lbl x={97} y={156} text="した仕事" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={217} y={156} text="½mv²" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="数値を変えても、二本の高さは同じままになる" />
    </LevelFig>
  );
}

/** 仕事4倍で速さ2倍。 */
export function QuadrupleWork() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  const bars = [
    { x: 44, h: 20, label: '9 J', color: L.field },
    { x: 84, h: 80, label: '36 J', color: L.field },
    { x: 196, h: 30, label: '3 m/s', color: L.path },
    { x: 236, h: 60, label: '6 m/s', color: L.path },
  ];
  return (
    <LevelFig label="仕事4倍で速さは2倍">
      <Lbl x={16} y={26} text="仕事を 4 倍にすると、速さは 2 倍" color={L.text} size={11.5} />
      {bars.map(b => (
        <g key={b.x}>
          <rect x={b.x} y={132 - b.h} width={30} height={b.h} rx={3} fill={b.color} opacity={0.55} />
          <Lbl x={b.x + 15} y={146} text={b.label} color={b.color} size={10} anchor="middle" />
        </g>
      ))}
      <g opacity={glow}>
        <Lbl x={79} y={44} text="×4" color={L.focus} size={12.5} anchor="middle" bold />
        <Lbl x={231} y={64} text="×2" color={L.focus} size={12.5} anchor="middle" bold />
      </g>
      <Lbl x={79} y={162} text="仕事" color={L.text} size={11} anchor="middle" />
      <Lbl x={231} y={162} text="速さ" color={L.text} size={11} anchor="middle" />
      <Cap text="仕事を4倍にしても、速さは2倍にしかならない" />
    </LevelFig>
  );
}

/** 摩擦の負の仕事を引く。 */
export function FrictionCut() {
  const t = useT();
  const u = pingPong(t, 5);
  return (
    <LevelFig label="摩擦の分を引いた正味の仕事">
      <Lbl x={20} y={34} text="摩擦 1 N が 3 m はたらくと −3 J" color={L.text} size={11} />
      <Lbl x={148} y={60} text="押す力の仕事 9 J" color={L.dim} size={11} anchor="middle" />
      <rect x={40} y={70} width={216} height={34} rx={4} fill={L.plus} opacity={0.35} />
      <rect x={144} y={70} width={112 * u} height={34} rx={4} fill={L.minus} opacity={0.55} />
      <Lbl x={92} y={92} text="正味 6 J" color={L.focus} size={12.5} anchor="middle" bold />
      <Lbl x={200} y={92} text="−3 J" color={L.minus} size={11} anchor="middle" />
      <Lbl x={40} y={128} text="9 − 3 = 6 J が ½mv² の増加になる" color={L.focus} size={11.5} />
      <Lbl x={20} y={154} text="条件を外すと、引き算が一つ増える" color={L.dim} size={10.5} />
      <Cap text="取られた分を引いた残りが、速さの増加に使える" />
    </LevelFig>
  );
}

/** 合力がした仕事が½mv²の増加。 */
export function NetWorkCard() {
  const t = useT();
  const active = step(t, 3, 1.4);
  return (
    <LevelFig label="合力がした仕事が運動エネルギーの増加">
      <CardRows active={active} y0={38} x={36} w={248} rows={[
        { left: '押す力の仕事', right: '+9 J', color: L.plus },
        { left: '摩擦の仕事', right: '−3 J', color: L.minus },
        { left: '合力の仕事 = ½mv² の増加', right: '+6 J', color: L.focus },
      ]} />
      <Lbl x={160} y={156} text="導出は中級で、運動方程式から作る" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="足し算の結果だけが、½mv²の増加になる" />
    </LevelFig>
  );
}

// ===== 向きだけ変える力（ui-turning-motion）=====

/** 速度と同じ直線上の力。 */
export function AlongForce() {
  const t = useT();
  const phase = step(t, 2, 2.6);
  const cx = 70 + 160 * ((t % 5) / 5);
  const fast = phase === 0;
  return (
    <LevelFig label="速度と同じ直線上にはたらく力">
      <Lbl x={16} y={30} text="速度と同じ直線上に力がはたらく場合" color={L.text} size={11} />
      <Arw x={cx - 17} y={68} dx={34} dy={0} color={L.path} w={2.6} />
      <Lbl x={cx} y={58} text="速度" color={L.path} size={10} anchor="middle" />
      <circle cx={cx} cy={92} r={14} fill={L.field} opacity={0.9} />
      {fast ? (
        <g>
          <Arw x={cx - 52} y={92} dx={34} dy={0} color={L.plus} w={3} />
          <Lbl x={cx - 56} y={96} text="力" color={L.plus} size={11} anchor="end" />
        </g>
      ) : (
        <g>
          <Arw x={cx + 52} y={92} dx={-34} dy={0} color={L.minus} w={3} />
          <Lbl x={cx + 56} y={96} text="力" color={L.minus} size={11} />
        </g>
      )}
      <Lbl x={160} y={146} text={fast ? '仕事は正 → 速くなる' : '仕事は負 → 遅くなる'}
        color={fast ? L.plus : L.minus} size={12} anchor="middle" bold />
      <Cap text="沿った成分は、速さを増やしたり減らしたりする" />
    </LevelFig>
  );
}

/** 速度に直角な力。 */
export function PerpForce() {
  const t = useT();
  const blink = 0.62 + 0.28 * Math.sin(3.2 * t);
  const cx = 70 + 170 * ((t % 5) / 5);
  return (
    <LevelFig label="速度に直角にはたらく力">
      <Lbl x={16} y={30} text="同じ物体を、真上に 5 N で引く" color={L.text} size={11.5} />
      <circle cx={cx} cy={110} r={14} fill={L.field} opacity={0.9} />
      <Arw x={cx + 18} y={110} dx={36} dy={0} color={L.path} w={2.6} />
      <Lbl x={cx + 20} y={100} text="4 m/s" color={L.path} size={10} />
      <Arw x={cx} y={96} dx={0} dy={-44} color={L.field} w={3} />
      <Lbl x={cx + 6} y={60} text="5 N" color={L.field} size={10.5} />
      <g opacity={blink}>
        <Lbl x={160} y={154} text="この力は、何を変えるのだろう？" color={L.minus} size={12} anchor="middle" />
      </g>
      <Cap text="右へ進む向きには、押しても引いてもいない" />
    </LevelFig>
  );
}

/** 直角な力の仕事は0。 */
export function PerpWorkZero() {
  const t = useT();
  const cx = 110 + 80 * ((t % 5) / 5);
  return (
    <LevelFig label="直角な力の仕事はゼロ">
      <Lbl x={16} y={28} text="進む向きの成分を取り出す" color={L.text} size={11.5} />
      <line x1={30} y1={110} x2={290} y2={110} stroke={L.path} strokeWidth={1.6} strokeDasharray="5 4" />
      <Lbl x={238} y={100} text="進む向き" color={L.path} size={10} />
      <circle cx={cx} cy={110} r={13} fill={L.field} opacity={0.9} />
      <Arw x={cx} y={97} dx={0} dy={-45} color={L.field} w={3} />
      <Lbl x={cx + 6} y={72} text="5 N" color={L.field} size={10.5} />
      <circle cx={cx} cy={110} r={4} fill={L.focus} />
      <Span x0={110} x1={190} y={132} text="2 m" />
      <Lbl x={160} y={162} text="沿う成分 0 N → W = 0 J" color={L.focus} size={11.5} anchor="middle" bold />
      <Cap text="成分が0 Nなら、何m進んでも仕事は0 J" />
    </LevelFig>
  );
}

/** 仕事が0なら½mv²も変わらない。 */
export function SpeedKept() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="仕事がゼロなら運動エネルギーも変わらない">
      <Lbl x={16} y={30} text="仕事が 0 なら、½mv² の増加も 0" color={L.text} size={11.5} />
      <rect x={70} y={60} width={52} height={66} rx={4} fill={L.focus} opacity={0.5} />
      <rect x={180} y={60} width={52} height={66} rx={4} fill={L.focus} opacity={0.5} />
      <Lbl x={96} y={54} text="½mv²" color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={206} y={54} text="½mv²" color={L.focus} size={12} anchor="middle" bold />
      <g opacity={glow}>
        <Arw x={126} y={93} dx={48} dy={0} color={L.path} w={3} />
        <Lbl x={150} y={84} text="W = 0 J" color={L.path} size={10.5} anchor="middle" />
      </g>
      <Lbl x={96} y={142} text="はじめ" color={L.dim} size={11} anchor="middle" />
      <Lbl x={206} y={142} text="あと" color={L.dim} size={11} anchor="middle" />
      <Lbl x={160} y={160} text="速さは 4 m/s のまま変わらない" color={L.plus} size={11} anchor="middle" />
      <Cap text="仕事が0だから、½mv²も速さも変わらない" />
    </LevelFig>
  );
}

/** 長さは同じで向きだけ回る速度の矢印。 */
export function DirectionChanges() {
  const t = useT();
  const deg = 60 * pingPong(t, 6);
  const ox = 70, oy = 130, len = 78;
  const tip = (d: number): [number, number] => {
    const a = (d * Math.PI) / 180;
    return [ox + len * Math.cos(a), oy - len * Math.sin(a)];
  };
  const [ex, ey] = tip(60);
  const [sx, sy] = tip(0);
  return (
    <LevelFig label="長さが同じで向きだけ回る速度の矢印">
      <Lbl x={16} y={28} text="矢印の長さは同じ。向きだけが回る" color={L.text} size={11.5} />
      <path d={`M${sx.toFixed(1)},${sy.toFixed(1)} A${len},${len} 0 0 0 ${ex.toFixed(1)},${ey.toFixed(1)}`}
        fill="none" stroke={L.dim} strokeWidth={1.4} strokeDasharray="4 4" />
      {[0, 15, 30, 45, 60].map(d => {
        const [x, y] = tip(d);
        return <Arw key={d} x={ox} y={oy} dx={x - ox} dy={y - oy} color={L.dim} w={1.6} head={6} />;
      })}
      <Arw x={ox} y={oy} dx={tip(deg)[0] - ox} dy={tip(deg)[1] - oy} color={L.focus} w={3.4} />
      <circle cx={ox} cy={oy} r={5} fill={L.field} />
      <Lbl x={156} y={126} text="長さ = 速さ 4 m/s" color={L.focus} size={10.5} />
      <Lbl x={160} y={158} text="大きさが同じでも、速度は変化している" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="長さを変えずに、矢印が少しずつ傾いていく" />
    </LevelFig>
  );
}

/** 同じ角ずつ回り続けると道が閉じる。 */
export function TurnRepeat() {
  const t = useT();
  const k = step(t, 12, 0.5);
  const cx = 112, cy = 92, R = 58;
  const pt = (i: number): [number, number] => {
    const a = (i * 30 * Math.PI) / 180;
    return [cx + R * Math.cos(a), cy - R * Math.sin(a)];
  };
  const [px, py] = pt(k);
  const a = (k * 30 * Math.PI) / 180;
  return (
    <LevelFig label="同じ角ずつ回り続けると道が閉じる">
      <Lbl x={16} y={26} text="力をいつも速度と直角に保ち続ける" color={L.text} size={11} />
      <polygon points={Array.from({ length: 12 }, (_, i) => pt(i).map(v => v.toFixed(1)).join(',')).join(' ')}
        fill="none" stroke={L.path} strokeWidth={1.8} strokeDasharray="5 4" />
      <circle cx={px} cy={py} r={7} fill={L.field} />
      <Arw x={px} y={py} dx={-30 * Math.sin(a)} dy={-30 * Math.cos(a)} color={L.path} w={2.8} />
      <Arw x={px} y={py} dx={-26 * Math.cos(a)} dy={26 * Math.sin(a)} color={L.field} w={2.8} />
      <Lbl x={184} y={74} text="少し進むたびに" color={L.dim} size={10.5} />
      <Lbl x={184} y={90} text="矢印が同じ角だけ回る" color={L.dim} size={10.5} />
      <Lbl x={160} y={158} text="速さは一定のまま、道が閉じて円になる" color={L.focus} size={11} anchor="middle" />
      <Cap text="黄色が速度、水色が力。いつも直角に保たれる" />
    </LevelFig>
  );
}

/** 円のどの点でも力は中心を向く。 */
export function CircleCenter() {
  const t = useT();
  const hot = step(t, 4, 1.2);
  const cx = 110, cy = 92, R = 56;
  const pt = (i: number): [number, number] => {
    const a = (i * 90 * Math.PI) / 180;
    return [cx + R * Math.cos(a), cy - R * Math.sin(a)];
  };
  return (
    <LevelFig label="円のどの点でも力は中心を向く">
      <Lbl x={16} y={26} text="速度は接線、力は中心向き" color={L.text} size={11.5} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={L.path} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={3} fill={L.dim} />
      {[0, 1, 2, 3].map(i => {
        const [px, py] = pt(i);
        const a = (i * 90 * Math.PI) / 180;
        const on = i === hot;
        return (
          <g key={i}>
            <Arw x={px} y={py} dx={-28 * Math.sin(a)} dy={-28 * Math.cos(a)} color={L.path} w={on ? 3 : 1.8} head={7} />
            <Arw x={px} y={py} dx={-26 * Math.cos(a)} dy={26 * Math.sin(a)} color={on ? L.focus : L.field} w={on ? 3.2 : 1.8} head={7} />
          </g>
        );
      })}
      <Arw x={cx + R} y={cy} dx={26} dy={0} color={L.minus} w={2} head={7} />
      <Lbl x={196} y={80} text="外向きなら" color={L.minus} size={10.5} />
      <Lbl x={196} y={96} text="円から離れる" color={L.minus} size={10.5} />
      <Lbl x={160} y={158} text="どの点でも直角なので、仕事は 0 のまま" color={L.focus} size={11} anchor="middle" />
      <Cap text="中心向きの力だけが、速さを変えずに曲げられる" />
    </LevelFig>
  );
}

/** 5 Nを沿う3 Nと直角な4 Nに分ける。 */
export function SplitAlongPerp() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  const ox = 96, oy = 112;
  return (
    <LevelFig label="斜めの力を沿う分と直角な分に分ける">
      <Lbl x={16} y={28} text="5 N を、沿う分と直角な分に分ける" color={L.text} size={11} />
      <line x1={ox + 36} y1={64} x2={ox + 36} y2={oy} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={ox + 36} y1={64} x2={ox} y2={64} stroke={L.dim} strokeDasharray="4 3" />
      <Arw x={ox} y={oy} dx={36} dy={-48} color={L.field} w={3} />
      <Lbl x={136} y={58} text="5 N" color={L.field} size={11} />
      <Arw x={ox} y={oy} dx={36} dy={0} color={L.focus} w={4} />
      <Lbl x={114} y={128} text="3 N" color={L.focus} size={11} anchor="middle" />
      <Arw x={ox} y={oy} dx={0} dy={-48} color={L.plus} w={3} />
      <Lbl x={90} y={88} text="4 N" color={L.plus} size={11} anchor="end" />
      <Arw x={ox} y={138} dx={70} dy={0} color={L.path} w={2.6} />
      <Lbl x={170} y={142} text="進む向き" color={L.path} size={10} />
      <Lbl x={192} y={70} text="速さを変えるのは" color={L.text} size={10.5} />
      <Lbl x={192} y={86} text="3 N だけ" color={L.focus} size={11} bold />
      <g opacity={glow}>
        <Lbl x={192} y={108} text="W = 3 × 2 = 6 J" color={L.focus} size={11} />
      </g>
      <Lbl x={192} y={130} text="4 N は向きを変える" color={L.plus} size={10} />
      <Cap text="沿う成分だけが仕事をし、直角成分は向きを変える" />
    </LevelFig>
  );
}

/** 磁場の中の電荷への橋。 */
export function LorentzBridge() {
  const t = useT();
  const u = pingPong(t, 6);
  const cx = 150, cy = 150, R = 90;
  const deg = 130 - 80 * u;
  const a = (deg * Math.PI) / 180;
  const px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
  const marks: [number, number][] = [];
  for (const gx of [40, 88, 136, 184, 232, 280]) for (const gy of [46, 78, 110]) marks.push([gx, gy]);
  const arc = Array.from({ length: 41 }, (_, i) => {
    const d = ((130 - (80 * i) / 40) * Math.PI) / 180;
    return `${(cx + R * Math.cos(d)).toFixed(1)},${(cy - R * Math.sin(d)).toFixed(1)}`;
  }).join(' ');
  return (
    <LevelFig label="磁場の中を動く電荷が受ける力">
      {marks.map(([gx, gy]) => (
        <g key={`${gx}-${gy}`} opacity={0.3}>
          <line x1={gx - 4} y1={gy - 4} x2={gx + 4} y2={gy + 4} stroke={L.field} strokeWidth={1.4} />
          <line x1={gx - 4} y1={gy + 4} x2={gx + 4} y2={gy - 4} stroke={L.field} strokeWidth={1.4} />
        </g>
      ))}
      <Lbl x={16} y={28} text="磁場の中を動く電荷" color={L.text} size={11.5} />
      <Lbl x={302} y={28} text="× は紙面の裏向きの磁場" color={L.field} size={10} anchor="end" />
      <polyline points={arc} fill="none" stroke={L.path} strokeWidth={2} strokeDasharray="5 4" />
      <Arw x={px} y={py} dx={36 * Math.sin(a)} dy={36 * Math.cos(a)} color={L.path} w={2.8} />
      <Arw x={px} y={py} dx={-36 * Math.cos(a)} dy={36 * Math.sin(a)} color={L.field} w={3} />
      <circle cx={px} cy={py} r={9} fill={L.plus} />
      <Lbl x={px} y={py + 4} text="+" color="#11162c" size={13} anchor="middle" bold />
      <Lbl x={160} y={134} text="速さは変わらず、道だけ曲がる" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={158} text="力はいつも速度と直角 → 仕事は 0" color={L.focus} size={11.5} anchor="middle" />
      <Cap text="磁場から受ける力も、速度と直角を向き続ける" />
    </LevelFig>
  );
}

/** 沿う成分と直角成分の役割。 */
export function TurnSummary() {
  const t = useT();
  const active = step(t, 2, 1.8);
  const rows = [
    { title: '速度に沿う成分', detail: '速さを変える（仕事をする）', color: L.focus },
    { title: '速度に直角な成分', detail: '向きを変える（仕事は 0）', color: L.plus },
  ];
  return (
    <LevelFig label="沿う成分と直角成分の役割">
      <Lbl x={24} y={36} text="力の効き方は、速度とのなす角で決まる" color={L.text} size={11.5} />
      {rows.map((row, i) => (
        <g key={row.title} opacity={i === active ? 1 : 0.5}>
          <rect x={24} y={52 + i * 44} width={272} height={36} rx={6} fill={row.color}
            opacity={i === active ? 0.24 : 0.1} />
          <Lbl x={38} y={70 + i * 44} text={row.title} color={row.color} size={11.5} bold />
          <Lbl x={38} y={84 + i * 44} text={row.detail} color={L.text} size={10} />
        </g>
      ))}
      <Lbl x={160} y={160} text="大きさだけでは、効き方は決まらない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="同じ5 Nでも、角度によって役割が分かれる" />
    </LevelFig>
  );
}

export const ui_mechFigures: Record<string, () => JSX.Element> = {
  'uim-push-box': PushBox,
  'uim-work-rect': WorkRect,
  'uim-work-units': WorkUnits,
  'uim-no-move': NoMoveNoWork,
  'uim-work-compare': WorkCompare,
  'uim-work-negative': WorkNegative,
  'uim-work-angle': WorkAngle,
  'uim-work-split-same': WorkSplitSame,
  'uim-step-base': StepBase,
  'uim-step-stairs': StepStairs,
  'uim-step-piece1': StepPiece1,
  'uim-step-piece2': StepPiece2,
  'uim-step-piece34': StepPiece34,
  'uim-step-total': StepTotal,
  'uim-step-smooth': StepSmooth,
  'uim-step-refine': StepRefine,
  'uim-step-integral-preview': StepIntegralPreview,
  'uim2-axis-origin': AxisOrigin,
  'uim2-position-table': PositionTable,
  'uim2-position-gaps': PositionGaps,
  'uim2-average-speed': AverageSpeed,
  'uim2-back-step': BackStep,
  'uim2-flip-direction': FlipDirection,
  'uim2-xt-graph': XtGraph,
  'uim2-slope-read': SlopeRead,
  'uim2-shrink-interval': ShrinkInterval,
  'uim2-record-summary': RecordSummary,
  'uim2-isolate-ring': IsolateRing,
  'uim2-forces-on-box': ForcesOnBox,
  'uim2-which-matters': WhichMatters,
  'uim2-balance-pair': BalancePair,
  'uim2-net-force': NetForce,
  'uim2-axis-split': AxisSplit,
  'uim2-action-pair': ActionPair,
  'uim2-two-diagrams': TwoDiagrams,
  'uim2-balance-vs-pair': BalanceVsPair,
  'uim2-net-changes-v': NetChangesV,
  'uim2-fma-number': FmaNumber,
  'uim2-mass-compare': MassCompare,
  'uim2-half-second': HalfSecond,
  'uim2-velocity-table': VelocityTable,
  'uim2-v-line': VLine,
  'uim2-pos-question': PosQuestion,
  'uim2-strip-distance': StripDistance,
  'uim2-x-curve': XCurve,
  'uim2-force-off': ForceOff,
  'uim2-work-to-speed': WorkToSpeed,
  'uim2-conditions-card': ConditionsCard,
  'uim2-push-9j': Push9J,
  'uim2-where-9j': Where9J,
  'uim2-half-mv2': HalfMv2,
  'uim2-match-9j': Match9J,
  'uim2-quadruple-work': QuadrupleWork,
  'uim2-friction-cut': FrictionCut,
  'uim2-net-work-card': NetWorkCard,
  'uim2-along-force': AlongForce,
  'uim2-perp-force': PerpForce,
  'uim2-perp-work-zero': PerpWorkZero,
  'uim2-speed-kept': SpeedKept,
  'uim2-direction-changes': DirectionChanges,
  'uim2-turn-repeat': TurnRepeat,
  'uim2-circle-center': CircleCenter,
  'uim2-split-along-perp': SplitAlongPerp,
  'uim2-lorentz-bridge': LorentzBridge,
  'uim2-turn-summary': TurnSummary,
};

export const ui_mechReadings: Record<string, string> = {
  'uim-push-box': '力の矢印の向きと、箱が動いた向きが同じであること。動いた距離だけ仕事が増えます。',
  'uim-work-rect': '縦軸が力、横軸が位置です。塗られた長方形の面積が仕事で、単位はN×m=Jです。',
  'uim-work-units': '数と一緒に単位も掛けています。N×mがJになる対応を確かめてください。',
  'uim-no-move': '力の矢印はありますが、箱は動いていません。移動距離が0なら仕事も0です。',
  'uim-work-compare': '長方形の縦を2倍にした場合と、横を2倍にした場合を見比べてください。面積はどちらも2倍です。',
  'uim-work-negative': '進む向きの矢印と、力の矢印が逆を向いています。このとき仕事に負号が付きます。',
  'uim-work-angle': '斜めの矢印から下ろした点線と、床に沿った太い矢印が前向き成分です。スライダーで角度を変えられます。',
  'uim-work-split-same': '同じ長方形を何個に区切っても、色の付いた面積の合計が変わらないことを見てください。',
  'uim-step-base': '高さが一定の長方形です。この形なら掛け算1回で仕事が出ます。',
  'uim-step-stairs': '区間ごとに棒の高さが違います。高さが1つに決まらないことを確かめてください。',
  'uim-step-piece1': '金色に囲まれた区間だけを見ています。その中では力が一定です。',
  'uim-step-piece2': '2本目の棒が金色になり、合計が増えます。棒を1本ずつ足しています。',
  'uim-step-piece34': '高さの低い区間と高い区間で、同じ幅でも面積が違うことを見てください。',
  'uim-step-total': '棒が1本ずつ増えるたびに、右のゲージへ合計が積み上がります。足しているのは面積であることを確かめてください。',
  'uim-step-smooth': '曲線と長方形の上端の間にすき間があります。そのすき間が誤差です。',
  'uim-step-refine': '区間の数が4、8、16、32と増えます。合計の数値の変わり方に注目してください。',
  'uim-step-integral-preview': '細い棒が左から順に足されていきます。1本1本が小さい仕事です。',
  'uim2-axis-origin': '数直線の0の位置と、右向きの矢印に注目してください。この二つを決めてはじめて、点の位置が数として言えます。',
  'uim2-position-table': '上の行が時刻、下の行がそのときの位置です。色の付いた列が、一組の記録にあたります。',
  'uim2-position-gaps': '隣り合う位置の間に付いた矢印と、その上の数字が差です。同じ0.5 sでも差が変わることを見てください。',
  'uim2-average-speed': '点線の横が0.5 s、縦が0.9 mです。この縦を横で割った値が、太い線の区間の平均の速度になります。',
  'uim2-back-step': '箱が左へ動き、矢印も左を向いています。正の向きは右なので、差も速度も負になります。',
  'uim2-flip-direction': '上下の線で黄色い点はまったく同じ動きをします。違うのは正の向きの矢印と、右側の符号だけです。',
  'uim2-xt-graph': '表の数字が1点ずつ打たれていきます。折れ線が上がる区間と下がる区間を見分けてください。',
  'uim2-slope-read': '色の付いた区間の傾きと、左上の速度の値を見比べてください。下り坂のときだけ値が負になります。',
  'uim2-shrink-interval': '太い線で結ぶ2点の間隔がだんだん狭くなります。左上の平均の値がどこに落ち着くかを見てください。',
  'uim2-record-summary': '上から順に三つの手順が光ります。どれか一つでも抜けると、速度の値が決まりません。',
  'uim2-isolate-ring': '破線の輪が囲んでいるのは箱だけです。手と床は輪の外にあり、外から力を及ぼす相手になります。',
  'uim2-forces-on-box': '箱の中心から出ている4本が、箱に働く力です。矢印の長さは大小の目安で、比例した長さではありません。',
  'uim2-which-matters': '灰色の4本に対して、下の黄色い矢印が実際に動き出す向きです。足し方を決める必要があることを見てください。',
  'uim2-balance-pair': '上下の矢印は同じ長さで逆向きです。左の式が0になることと対応しています。',
  'uim2-net-force': '右向き6 Nと左向き2 Nの矢印の長さの差が、上に出る合力4 Nにあたります。',
  'uim2-axis-split': '斜めの矢印から下ろした点線と、横の太い矢印・縦の矢印が成分です。角度が変わると長さも変わります。',
  'uim2-action-pair': '破線の輪の中に、向きの違う2本が入っています。これを足すと0になってしまうことを見てください。',
  'uim2-two-diagrams': '左右で囲んでいる物体が違います。同じ6 Nでも、入る図が別なので打ち消し合いません。',
  'uim2-balance-vs-pair': '上下の札で「同じ物体」か「別の物体」かが違います。ここが見分けの基準です。',
  'uim2-net-changes-v': '合力の矢印は同じ長さのままですが、黄色い速度の矢印が伸び続けます。増えているのは速度です。',
  'uim2-fma-number': '上から合力・質量・加速度の順です。割り算1回で加速度が決まることを確かめてください。',
  'uim2-mass-compare': '上下の箱に同じ長さの力の矢印が付いています。同じ時間で進む距離が違うことを見比べてください。',
  'uim2-half-second': '長い帯が1秒分、短い帯がその半分の0.5秒分です。帯の長さと増え分が対応しています。',
  'uim2-velocity-table': '下の行の速度が、列ごとに+1ずつ増えます。増え分がいつも同じであることを見てください。',
  'uim2-v-line': '点が一直線に並びます。点線で作った三角形の縦2 m/sと横1 sの比が、加速度2 m/s²です。',
  'uim2-pos-question': '破線の大きな長方形は、4 m/sで計算した場合の大きすぎる見積もりです。実際の直線との差に注目してください。',
  'uim2-strip-distance': '金色の長方形の高さは、区間の前後の速度2 m/sと3 m/sの平均です。その面積が進んだ距離になります。',
  'uim2-x-curve': '点が増えるほど、隣の点との高さの差が大きくなります。同じ0.5 sで進む距離が増えている印です。',
  'uim2-force-off': '2.0 sの点線から先で、線が水平になります。傾きが0になるだけで、高さは下がりません。',
  'uim2-work-to-speed': '上下の箱に同じ長さの力の矢印が付いています。長く押した下のほうが、黄色い速度の矢印が長くなります。',
  'uim2-conditions-card': '三つの札が、この段で置いた条件です。これを外さないと、余計な量が混ざります。',
  'uim2-push-9j': '箱が進むにつれて、左上の仕事の値が増えていきます。下の括弧が押した距離3 mです。',
  'uim2-where-9j': '左の札が9 J、右の札が動いている状態です。矢印は、量がどこへ移ったのかを問うています。',
  'uim2-half-mv2': '質量と速さを入れて、最後の行で½mv²の値が出ます。単位がJになることも確かめてください。',
  'uim2-match-9j': '左が「した仕事」、右が「½mv²」の高さです。数値が切り替わっても高さが同じままであることを見てください。',
  'uim2-quadruple-work': '左の2本が仕事、右の2本が速さです。仕事が4倍になっても、速さの棒は2倍にしかなりません。',
  'uim2-friction-cut': '帯全体が9 J、右から食い込む紫の部分が摩擦の−3 Jです。残った左側が正味の6 Jです。',
  'uim2-net-work-card': '押す力と摩擦を符号込みで足した最後の行が、½mv²の増加にあたります。',
  'uim2-along-force': '力の矢印が速度と同じ向きの場合と逆向きの場合で切り替わります。下の文の正負と対応しています。',
  'uim2-perp-force': '速度の矢印は右向き、力の矢印は真上を向いています。二つが直角であることを確かめてください。',
  'uim2-perp-work-zero': '力の矢印は真上で、進む向きの成分がありません。だから括弧の2 m進んでも仕事は0 Jです。',
  'uim2-speed-kept': '左右の棒は同じ高さです。間の矢印に書かれた仕事が0なので、高さが変わりません。',
  'uim2-direction-changes': '扇形に並ぶ矢印はすべて同じ長さです。長さは変わらず、傾きだけが変わることを見てください。',
  'uim2-turn-repeat': '黄色が速度、水色が力です。頂点を進むたびに二つが同じ角だけ回り、道が閉じていきます。',
  'uim2-circle-center': '4か所の力の矢印はすべて中心を向いています。右の紫の矢印は、外向きにすると円から離れる例です。',
  'uim2-split-along-perp': '斜めの5 Nが、横の3 Nと縦の4 Nに分かれています。仕事に使えるのは横の3 Nだけです。',
  'uim2-lorentz-bridge': '背景の×が紙面の裏向きの磁場です。黄色の速度と水色の力が、どの位置でも直角であることを見てください。',
  'uim2-turn-summary': '上の札が沿う成分、下の札が直角な成分です。それぞれ変えるものが違うことを確かめてください。',
};
