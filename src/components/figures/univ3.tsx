import { useT, C } from "./anim";
import { FigSvg, Caption } from "./mechanics";

// 「全ステップに図解」体制のための追加図解。

/** ma=F は予言マシン: 力を入れると運動の全歴史が出てくる */
export function PredictMachine() {
  const t = useT();
  const u = (t % 4) / 4;
  const ax = 20 + 60 * ((t * 0.9) % 1);
  const curve: string[] = [];
  for (let i = 0; i <= 60 * u; i++) {
    const x = 190 + i * 1.8;
    curve.push(`${x},${(140 - 0.9 * i + 0.006 * i * i).toFixed(1)}`);
  }
  return (
    <FigSvg>
      <line x1={ax} y1={95} x2={ax + 26} y2={95} stroke={C.red} strokeWidth={3} />
      <polygon points={`${ax + 34},95 ${ax + 22},89 ${ax + 22},101`} fill={C.red} />
      <text x={22} y={78} fontSize={11} fill={C.red}>入力: 力 F</text>
      <rect x={92} y={62} width={92} height={64} rx={10} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <text x={102} y={90} fontSize={12} fill={C.cyan}>ma = F</text>
      <text x={100} y={110} fontSize={10} fill={C.dim}>(微分方程式)</text>
      {curve.length > 1 && <polyline points={curve.join(" ")} fill="none" stroke={C.gold} strokeWidth={2.5} />}
      <text x={196} y={60} fontSize={11} fill={C.gold}>出力: 軌道 x(t)</text>
      <text x={196} y={74} fontSize={10} fill={C.dim}>(未来の全歴史)</text>
      <Caption text="力の法則に初期位置・初速度を加え、運動方程式から運動を求める" />
    </FigSvg>
  );
}

/** 力学の解法レシピ: いつも同じ3ステップ */
export function SolveRecipe() {
  const t = useT();
  const active = Math.floor(t / 1.4) % 3;
  const box = (i: number, x: number, label1: string, label2: string) => (
    <g opacity={active === i ? 1 : 0.45}>
      <rect x={x} y={62} width={86} height={62} rx={10}
        fill={active === i ? "rgba(78,225,255,0.12)" : "none"}
        stroke={active === i ? C.cyan : C.dim} strokeWidth={active === i ? 2.5 : 1.5} />
      <text x={x + 10} y={88} fontSize={11.5} fill={active === i ? C.cyan : C.dim}>{label1}</text>
      <text x={x + 10} y={106} fontSize={11.5} fill={active === i ? C.cyan : C.dim}>{label2}</text>
    </g>
  );
  return (
    <FigSvg>
      {box(0, 14, "① 働く力を", "　 全部書く")}
      {box(1, 118, "② ma = F に", "　 入れる")}
      {box(2, 222, "③ 積分して", "　 解く")}
      <polygon points="106,93 114,88 114,98" fill={C.dim} />
      <polygon points="210,93 218,88 218,98" fill={C.dim} />
      <text x={28} y={160} fontSize={11} fill={C.gold}>初期条件を指定し、解の意味と近似も確かめる</text>
      <Caption text="法則が1本だから、手順も1つで済む" />
    </FigSvg>
  );
}

/** 電場 = 「+1Cが受ける力」の矢印の地図 */
export function FieldMap() {
  const t = useT();
  const cx = 150, cy = 92;
  const ang = 0.7 * t;
  const tx = cx + 62 * Math.cos(ang);
  const ty = cy + 62 * Math.sin(ang);
  const arrows: JSX.Element[] = [];
  [30, 55, 82].forEach((r, ri) => {
    const n = 8;
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI * i) / n + ri * 0.26;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      const len = 16 - ri * 4.5;
      arrows.push(
        <g key={`${ri}-${i}`} opacity={0.55}>
          <line x1={x} y1={y} x2={x + len * Math.cos(a)} y2={y + len * Math.sin(a)} stroke={C.cyan} strokeWidth={1.8} />
          <polygon
            points={`${x + (len + 5) * Math.cos(a)},${y + (len + 5) * Math.sin(a)} ${x + (len - 3) * Math.cos(a) - 3.5 * Math.sin(a)},${y + (len - 3) * Math.sin(a) + 3.5 * Math.cos(a)} ${x + (len - 3) * Math.cos(a) + 3.5 * Math.sin(a)},${y + (len - 3) * Math.sin(a) - 3.5 * Math.cos(a)}`}
            fill={C.cyan}
          />
        </g>
      );
    }
  });
  return (
    <FigSvg>
      {arrows}
      <circle cx={cx} cy={cy} r={11} fill={C.red} />
      <text x={cx - 4} y={cy + 4} fontSize={11} fill="#fff">+</text>
      <circle cx={tx} cy={ty} r={7} fill={C.gold} />
      <line x1={tx} y1={ty} x2={tx + 20 * Math.cos(ang)} y2={ty + 20 * Math.sin(ang)} stroke={C.gold} strokeWidth={3} />
      <text x={16} y={26} fontSize={11} fill={C.gold}>小さな正の試験電荷qに働く力Fを測る</text>
      <Caption text="電場 E = F/q：各位置での単位電荷あたりの力" />
    </FigSvg>
  );
}

/** 電磁気の法則は「電圧」と「磁束」の2語で書かれる */
export function TwoWords() {
  const t = useT();
  const left = Math.floor(t / 1.6) % 2 === 0;
  const u = (t % 1.6) / 1.6;
  const px = 30 + 80 * u;
  return (
    <FigSvg>
      <g opacity={left ? 1 : 0.4}>
        <rect x={12} y={40} width={140} height={108} rx={10} fill="none" stroke={left ? C.cyan : C.dim} strokeWidth={1.5} />
        <line x1={28} y1={110} x2={132} y2={110} stroke={C.dim} strokeWidth={2} />
        {[40, 70, 100].map((x) => (
          <polygon key={x} points={`${x + 12},110 ${x},104 ${x},116`} fill={C.cyan} opacity={0.6} />
        ))}
        <circle cx={px} cy={110} r={6} fill={C.gold} />
        <text x={26} y={62} fontSize={11.5} fill={C.cyan}>電圧(電位差)</text>
        <text x={26} y={78} fontSize={10} fill={C.dim}>= −(電気力の仕事)/q</text>
        <text x={26} y={138} fontSize={10} fill={C.gold}>−∫E·dr（始点→終点）</text>
      </g>
      <g opacity={left ? 0.4 : 1}>
        <rect x={168} y={40} width={140} height={108} rx={10} fill="none" stroke={left ? C.dim : C.purple} strokeWidth={1.5} />
        <ellipse cx={238} cy={104} rx={44} ry={16} fill="none" stroke={C.purple} strokeWidth={2.5} />
        {[214, 238, 262].map((x) => (
          <g key={x}>
            <line x1={x} y1={128} x2={x} y2={82} stroke={C.cyan} strokeWidth={2} opacity={0.8} />
            <polygon points={`${x},76 ${x - 5},86 ${x + 5},86`} fill={C.cyan} opacity={0.8} />
          </g>
        ))}
        <text x={182} y={62} fontSize={11.5} fill={C.purple}>磁束</text>
        <text x={182} y={78} fontSize={10} fill={C.dim}>= 垂直成分×面積の合計</text>
        <text x={252} y={138} fontSize={10} fill={C.gold}>∫B·dA</text>
      </g>
      <Caption text="電磁気の法則はこの2つの量で書かれる — 1つずつ作ろう" />
    </FigSvg>
  );
}

/** ∮: 閉じた一周の道での集計。静電場なら一周で合計0 */
export function LoopIntegral() {
  const t = useT();
  const cx = 120, cy = 92, R = 52;
  const ang = 1.1 * t;
  const px = cx + R * Math.cos(ang);
  const py = cy + R * Math.sin(ang);
  const tx = -Math.sin(ang), ty = Math.cos(ang);
  const dot = tx; // 場は右向き(1,0)との内積
  const acc = Math.sin(ang) - Math.sin(0); // ∮cos成分 の途中経過 = sin
  const arrows: JSX.Element[] = [];
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 3; j++) {
      const x = 40 + i * 62, y = 40 + j * 52;
      arrows.push(
        <g key={`${i}${j}`} opacity={0.3}>
          <line x1={x} y1={y} x2={x + 16} y2={y} stroke={C.cyan} strokeWidth={2} />
          <polygon points={`${x + 22},${y} ${x + 13},${y - 4} ${x + 13},${y + 4}`} fill={C.cyan} />
        </g>
      );
    }
  return (
    <FigSvg>
      {arrows}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.dim} strokeWidth={2.5} />
      <circle cx={px} cy={py} r={7} fill={C.gold} />
      <line x1={px} y1={py} x2={px + 30 * Math.abs(dot) * tx * Math.sign(dot)} y2={py + 30 * Math.abs(dot) * ty * Math.sign(dot)} stroke={C.gold} strokeWidth={4} />
      <text x={224} y={40} fontSize={11} fill="#fff">合計(いま):</text>
      <line x1={252} y1={92} x2={296} y2={92} stroke={C.dim} strokeWidth={1} />
      <rect
        x={264}
        y={acc >= 0 ? 92 - acc * 36 : 92}
        width={16}
        height={Math.abs(acc) * 36 + 0.5}
        fill={acc >= 0 ? C.green : C.red}
        opacity={0.9}
      />
      <text x={224} y={170} fontSize={10.5} fill={C.dim}>行きは+、帰りは−</text>
      <Caption text="∮ = 閉じた一周で集計。静電場では一周すると合計0に戻る" />
    </FigSvg>
  );
}

/** 面と平行な矢印は1本も面を貫かない */
export function ParallelMiss() {
  const t = useT();
  const slide = (t * 40) % 60;
  return (
    <FigSvg>
      <line x1={160} y1={30} x2={160} y2={150} stroke={C.gold} strokeWidth={4} />
      <text x={128} y={168} fontSize={11} fill={C.gold}>面(横から見た図)</text>
      {[46, 78, 110].map((y) => (
        <g key={y}>
          <line x1={40} y1={y} x2={272} y2={y} stroke={C.cyan} strokeWidth={2} opacity={0.9} />
          <polygon points={`${60 + slide * 3.2 > 272 ? 272 : 60 + slide * 3.2},${y} ${52 + slide * 3.2},${y - 5} ${52 + slide * 3.2},${y + 5}`} fill={C.cyan} />
        </g>
      ))}
      <text x={182} y={44} fontSize={10.5} fill={C.cyan}>垂直な矢印: 貫く ✓</text>
      {[0, 1].map((k) => (
        <g key={k} opacity={0.75}>
          <line x1={138 - k * 24} y1={40} x2={138 - k * 24} y2={140} stroke={C.red} strokeWidth={2} strokeDasharray="6 5" strokeDashoffset={-slide} />
          <polygon points={`${138 - k * 24},34 ${133 - k * 24},44 ${143 - k * 24},44`} fill={C.red} />
        </g>
      ))}
      <text x={30} y={30} fontSize={10.5} fill={C.red}>平行な矢印: 1本も貫かない ✗</text>
      <Caption text="貫くのは垂直な成分だけ — それを式にしたのが内積 B·dA" />
    </FigSvg>
  );
}

/** 面積ベクトル: 面(広さ+向き)は矢印1本で表せる。向き=垂直、長さ=面積 */
export function AreaVector() {
  const t = useT();
  const th = 0.35 * Math.sin(0.8 * t) + 0.4;
  // 面の向き f と法線 n が直交するように (画面座標はy下向き): f=(sinθ, cosθ), n=(cosθ, −sinθ)
  const fx = Math.sin(th), fy = Math.cos(th);
  const nx = Math.cos(th), ny = -Math.sin(th);
  const tile = (cx: number, cy: number, half: number, arrow: number, label: string, area: string) => (
    <g>
      <line x1={cx - half * fx} y1={cy - half * fy} x2={cx + half * fx} y2={cy + half * fy} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + arrow * nx} y2={cy + arrow * ny} stroke={C.purple} strokeWidth={3} />
      <polygon
        points={`${cx + (arrow + 9) * nx},${cy + (arrow + 9) * ny} ${cx + (arrow - 3) * nx - 5 * ny},${cy + (arrow - 3) * ny + 5 * nx} ${cx + (arrow - 3) * nx + 5 * ny},${cy + (arrow - 3) * ny - 5 * nx}`}
        fill={C.purple}
      />
      <text x={cx - 26} y={cy + half + 18} fontSize={11} fill={C.gold}>{label}</text>
      <text x={cx + (arrow + 14) * nx - 10} y={cy + (arrow + 14) * ny - 6} fontSize={10.5} fill={C.purple}>{area}</text>
    </g>
  );
  return (
    <FigSvg>
      {tile(78, 96, 24, 30, "面積 S", "dA")}
      {tile(196, 96, 44, 56, "面積 2S", "長さも2倍")}
      <text x={14} y={24} fontSize={11} fill="#fff">微小な面の広さと法線方向を、矢印で表す</text>
      <text x={14} y={40} fontSize={11} fill={C.purple}>→ 矢印1本で表せる: 向き=面に垂直、長さ=面積</text>
      <Caption text="面積ベクトル dA: 向き=面に垂直、長さ=面積" />
    </FigSvg>
  );
}
