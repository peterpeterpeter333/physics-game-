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
};
