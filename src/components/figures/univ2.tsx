import { useState } from "react";
import { useT, C } from "./anim";
import { FigSvg, Caption } from "./mechanics";

// 大学編・第2弾の図解。「どうしてこうなるのか」を絵で見せるための道具たち。

/** (t²)' = 2t の図形的証明: 正方形の辺を dt 伸ばすと面積は 2t·dt + dt² 増える */
export function PowerRule() {
  const t = useT();
  const p = 0.4 + 0.45 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 6));
  const s = 110 * p;
  const d = 15;
  const x0 = 88, y0 = 168;
  return (
    <FigSvg>
      <rect x={x0} y={y0 - s} width={s} height={s} fill={C.cyan} opacity={0.32} />
      <rect x={x0 + s + 1} y={y0 - s} width={d} height={s} fill={C.gold} opacity={0.8} />
      <rect x={x0} y={y0 - s - d - 1} width={s} height={d} fill={C.gold} opacity={0.8} />
      <rect x={x0 + s + 1} y={y0 - s - d - 1} width={d} height={d} fill={C.red} opacity={0.85} />
      <text x={x0 + s / 2 - 14} y={y0 - s / 2 + 4} fontSize={13} fill={C.cyan}>t × t</text>
      <text x={x0 + s + 20} y={y0 - s / 2} fontSize={11} fill={C.gold}>← t·dt</text>
      <text x={x0 + s / 2 - 20} y={y0 - s - d - 8} fontSize={11} fill={C.gold}>t·dt</text>
      <text x={x0 + s + 20} y={y0 - s - d + 8} fontSize={10} fill={C.red}>← dt² (極小: 無視)</text>
      <text x={12} y={30} fontSize={11} fill="#fff">辺 t の正方形を dt だけ広げる</text>
      <Caption text="増えた面積 ≈ 細長い帯2本 = 2t·dt。だから (t²)′ = 2t" />
    </FigSvg>
  );
}

/** sinの接線の傾きを記録していくと、cosのカーブが現れる */
export function SlopeTrace() {
  const t = useT();
  const u = (t % 6) / 6;
  const k = (2 * Math.PI) / 250;
  const X = 45 + 250 * u;
  const yTop = (x: number) => 58 - 30 * Math.sin(k * (x - 45));
  const slope = -30 * k * Math.cos(k * (X - 45)); // px単位の傾き
  const yBot = (x: number) => 148 - 24 * Math.cos(k * (x - 45));
  const topPts: string[] = [];
  const botPts: string[] = [];
  for (let x = 45; x <= 295; x += 4) topPts.push(`${x},${yTop(x).toFixed(1)}`);
  for (let x = 45; x <= X; x += 4) botPts.push(`${x},${yBot(x).toFixed(1)}`);
  return (
    <FigSvg>
      <line x1={45} y1={58} x2={295} y2={58} stroke={C.dim} strokeWidth={1} opacity={0.4} />
      <line x1={45} y1={148} x2={295} y2={148} stroke={C.dim} strokeWidth={1} opacity={0.4} />
      <polyline points={topPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.2} />
      <line x1={X - 24} y1={yTop(X) - 24 * -slope} x2={X + 24} y2={yTop(X) + 24 * slope} stroke={C.gold} strokeWidth={2.5} />
      <circle cx={X} cy={yTop(X)} r={5} fill={C.gold} />
      {botPts.length > 1 && <polyline points={botPts.join(" ")} fill="none" stroke={C.purple} strokeWidth={2.2} />}
      <circle cx={X} cy={yBot(X)} r={5} fill={C.purple} />
      <line x1={X} y1={yTop(X)} x2={X} y2={yBot(X)} stroke="#fff" strokeDasharray="3 4" opacity={0.35} />
      <text x={48} y={22} fontSize={11} fill={C.cyan}>y = sinθ と、その接線(金)</text>
      <text x={48} y={176} fontSize={11} fill={C.purple}>接線の傾きを記録すると… cosθ の曲線!</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** ∫f dx の解剖: 1枚の短冊 = 高さf(x) × 幅dx。それを左から全部足す */
export function DxAnatomy() {
  const t = useT();
  const u = (t % 5) / 5;
  const f = (x: number) => 142 - 45 * Math.sin(((x - 45) / 250) * Math.PI) - 22 * ((x - 45) / 250);
  const w = 26;
  const sx = 45 + (250 - w) * u;
  const filled: JSX.Element[] = [];
  for (let x = 45; x + 8 <= sx; x += 8) {
    filled.push(<rect key={x} x={x} y={f(x + 4)} width={7} height={150 - f(x + 4)} fill={C.cyan} opacity={0.25} />);
  }
  const curve: string[] = [];
  for (let x = 45; x <= 295; x += 4) curve.push(`${x},${f(x).toFixed(1)}`);
  const fy = f(sx + w / 2);
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={45} y1={150} x2={300} y2={150} />
        <line x1={45} y1={150} x2={45} y2={25} />
      </g>
      {filled}
      <rect x={sx} y={fy} width={w} height={150 - fy} fill={C.gold} opacity={0.7} />
      <polyline points={curve.join(" ")} fill="none" stroke={C.green} strokeWidth={2.5} />
      <line x1={sx - 6} y1={fy} x2={sx - 6} y2={150} stroke={C.gold} strokeWidth={1.5} />
      <text x={sx - 60 > 46 ? sx - 60 : 48} y={(fy + 150) / 2} fontSize={10.5} fill={C.gold}>高さ f(x)</text>
      <text x={sx - 4} y={164} fontSize={10.5} fill={C.gold}>幅 dx</text>
      <text x={200} y={40} fontSize={11.5} fill="#fff">1枚の面積 = f(x)·dx</text>
      <text x={200} y={56} fontSize={11.5} fill={C.cyan}>∫ = それを全部足す</text>
      <Caption text="∫f(x)dx は「高さ×幅の短冊を、端から全部足せ」という1つの文" />
    </FigSvg>
  );
}

/** チェインルール = ギア比の掛け算 */
export function ChainGears() {
  const t = useT();
  const a1 = t * 1.1;
  const a2 = -t * 2.2; // 半径半分 → 2倍回る
  const gear = (cx: number, cy: number, r: number, ang: number, color: string) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2.5} />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const a = ang + (k * Math.PI) / 3;
        return <circle key={k} cx={cx + (r - 5) * Math.cos(a)} cy={cy + (r - 5) * Math.sin(a)} r={2.5} fill={color} />;
      })}
      <line x1={cx} y1={cy} x2={cx + r * Math.cos(ang)} y2={cy + r * Math.sin(ang)} stroke={color} strokeWidth={2} />
    </g>
  );
  const dist = ((t * 2.2 * 14) % 200);
  return (
    <FigSvg>
      {gear(85, 82, 44, a1, C.cyan)}
      {gear(151, 82, 22, a2, C.gold)}
      <text x={52} y={22} fontSize={11} fill={C.cyan}>ペダル: 1回転</text>
      <text x={140} y={22} fontSize={11} fill={C.gold}>ギア: 2回転</text>
      <line x1={50} y1={150} x2={250} y2={150} stroke={C.dim} strokeWidth={1.5} />
      <rect x={50} y={144} width={dist} height={12} fill={C.green} opacity={0.7} rx={3} />
      <text x={200} y={140} fontSize={11} fill={C.green}>進む距離: さらに×2m</text>
      <text x={50} y={176} fontSize={11.5} fill="#fff">変化率の連鎖は掛け算: 1回転 × 2 × 2m = 4m</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 積の微分: 縦横両方が伸びる長方形。増分は帯2本の和 */
export function ProductRect() {
  const t = useT();
  const p = 0.45 + 0.4 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 6));
  const fw = 150 * p;
  const gh = 100 * p;
  const df = 13, dg = 11;
  const x0 = 70, y0 = 158;
  return (
    <FigSvg>
      <rect x={x0} y={y0 - gh} width={fw} height={gh} fill={C.cyan} opacity={0.3} />
      <rect x={x0 + fw + 1} y={y0 - gh} width={df} height={gh} fill={C.gold} opacity={0.8} />
      <rect x={x0} y={y0 - gh - dg - 1} width={fw} height={dg} fill={C.purple} opacity={0.8} />
      <rect x={x0 + fw + 1} y={y0 - gh - dg - 1} width={df} height={dg} fill={C.red} opacity={0.85} />
      <text x={x0 + fw / 2 - 18} y={y0 - gh / 2 + 4} fontSize={13} fill={C.cyan}>f × g</text>
      <text x={x0 + fw + 18} y={y0 - gh / 2} fontSize={11} fill={C.gold}>← (fの伸び)×g</text>
      <text x={x0 + 6} y={y0 - gh - dg - 7} fontSize={11} fill={C.purple}>f×(gの伸び)</text>
      <text x={x0 + fw + 18} y={y0 - gh - dg + 8} fontSize={10} fill={C.red}>← 極小×極小 (無視)</text>
      <Caption text="面積fgの増分 = 帯2本の和 → (fg)′ = f′g + fg′" />
    </FigSvg>
  );
}

/** ベクトルの成分分解: 矢印1本 = 数字の組 (Ax, Ay) */
export function VectorComponents() {
  const t = useT();
  const th = 0.62 + 0.42 * Math.sin(0.7 * t);
  const ox = 70, oy = 150, L = 112;
  const ax = L * Math.cos(th);
  const ay = L * Math.sin(th);
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={40} y1={150} x2={300} y2={150} />
        <line x1={70} y1={170} x2={70} y2={25} />
      </g>
      <line x1={ox} y1={oy} x2={ox + ax} y2={oy - ay} stroke={C.gold} strokeWidth={3.5} />
      <polygon
        points={`${ox + (L + 10) * Math.cos(th)},${oy - (L + 10) * Math.sin(th)} ${ox + (L - 4) * Math.cos(th) + 6 * Math.sin(th)},${oy - (L - 4) * Math.sin(th) + 6 * Math.cos(th)} ${ox + (L - 4) * Math.cos(th) - 6 * Math.sin(th)},${oy - (L - 4) * Math.sin(th) - 6 * Math.cos(th)}`}
        fill={C.gold}
      />
      <line x1={ox + ax} y1={oy - ay} x2={ox + ax} y2={oy} stroke={C.dim} strokeDasharray="4 3" />
      <line x1={ox + ax} y1={oy - ay} x2={ox} y2={oy - ay} stroke={C.dim} strokeDasharray="4 3" />
      <line x1={ox} y1={oy} x2={ox + ax} y2={oy} stroke={C.cyan} strokeWidth={4} />
      <line x1={ox} y1={oy} x2={ox} y2={oy - ay} stroke={C.purple} strokeWidth={4} />
      <text x={ox + ax / 2 - 30} y={168} fontSize={11.5} fill={C.cyan}>Ax = Acosθ</text>
      <text x={12} y={oy - ay / 2} fontSize={11.5} fill={C.purple}>Ay</text>
      <text x={ox + ax - 20} y={oy - ay - 12} fontSize={12} fill={C.gold}>A = (Ax, Ay)</text>
      <Caption text="矢印1本の正体は数字の組。式のベクトルは「成分ごとの式の束」" />
    </FigSvg>
  );
}

/** 微積分学の基本定理: 面積A(x)の増える速さ = いまの高さf(x) */
export function Ftc() {
  const t = useT();
  const u = (t % 5.5) / 5.5;
  const f = (x: number) => 138 - 40 * Math.sin(((x - 45) / 255) * Math.PI * 0.9) - 18 * ((x - 45) / 255);
  const X = 55 + 200 * u;
  const area: string[] = [`45,150`];
  let sum = 0;
  for (let x = 45; x <= X; x += 4) {
    area.push(`${x},${f(x).toFixed(1)}`);
    sum += (150 - f(x)) * 4;
  }
  area.push(`${X},150`);
  const curve: string[] = [];
  for (let x = 45; x <= 275; x += 4) curve.push(`${x},${f(x).toFixed(1)}`);
  const barH = Math.min(sum / 180, 120);
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={45} y1={150} x2={280} y2={150} />
        <line x1={45} y1={150} x2={45} y2={25} />
      </g>
      <polygon points={area.join(" ")} fill={C.cyan} opacity={0.3} />
      <rect x={X - 3} y={f(X)} width={6} height={150 - f(X)} fill={C.gold} opacity={0.95} />
      <polyline points={curve.join(" ")} fill="none" stroke={C.green} strokeWidth={2.5} />
      <text x={X - 30} y={f(X) - 10} fontSize={10.5} fill={C.gold}>先端の高さ f(x)</text>
      <text x={60} y={142} fontSize={11} fill={C.cyan}>たまった面積 A(x)</text>
      <rect x={296} y={150 - barH} width={14} height={barH} fill={C.cyan} opacity={0.8} />
      <text x={286} y={166} fontSize={10} fill={C.cyan}>A(x)</text>
      <Caption text="xを少し進めると面積は「高さ×幅」だけ増える → dA/dx = f(x)" />
    </FigSvg>
  );
}

/** e^t: 「高さ」と「傾き」が常に等しい唯一の曲線 */
export function EulerE() {
  const t = useT();
  const u = (t % 5) / 5;
  const X = 60 + 160 * u;
  const yOf = (x: number) => 162 - 7 * Math.exp((x - 60) / 70);
  const y = yOf(X);
  const h = 162 - y;
  const curve: string[] = [];
  for (let x = 45; x <= 260; x += 4) curve.push(`${x},${Math.max(yOf(x), 22).toFixed(1)}`);
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={45} y1={162} x2={300} y2={162} />
        <line x1={45} y1={162} x2={45} y2={22} />
      </g>
      <polyline points={curve.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <line x1={X} y1={y} x2={X} y2={162} stroke={C.gold} strokeWidth={3} />
      <line x1={X} y1={y} x2={X + 70} y2={y - h} stroke={C.purple} strokeWidth={2.5} />
      <line x1={X + 70} y1={y} x2={X + 70} y2={y - h} stroke={C.purple} strokeWidth={2} strokeDasharray="4 3" />
      <line x1={X} y1={y} x2={X + 70} y2={y} stroke={C.dim} strokeDasharray="4 3" />
      <circle cx={X} cy={y} r={5} fill={C.cyan} />
      <text x={X + 6} y={(y + 162) / 2} fontSize={11} fill={C.gold}>高さ</text>
      <text x={X + 74} y={y - h / 2} fontSize={11} fill={C.purple}>傾きの上がり幅</text>
      <text x={52} y={36} fontSize={11.5} fill="#fff">y = eᵗ : 高さと傾きが常に同じ</text>
      <Caption text="「増える速さ = いまの量」の世界では、必ず e が現れる" />
    </FigSvg>
  );
}

/** 線積分: 曲がった道を歩きながら「道の向き成分×歩幅」を集める */
export function LineIntegral() {
  const t = useT();
  const u = (t % 6) / 6;
  const px = (s: number) => 40 + 250 * s;
  const py = (s: number) => 158 - 108 * s + 16 * Math.sin(2 * Math.PI * s);
  const X = px(u), Y = py(u);
  const dx = 250, dy = -108 + 16 * 2 * Math.PI * Math.cos(2 * Math.PI * u);
  const dl = Math.hypot(dx, dy);
  const tx = dx / dl, ty = dy / dl;
  const fAng = -0.32; // 場の向き (一定)
  const fx = Math.cos(fAng), fy = Math.sin(fAng);
  const dot = tx * fx + ty * fy;
  const path: string[] = [];
  for (let s = 0; s <= 1.001; s += 0.02) path.push(`${px(s).toFixed(1)},${py(s).toFixed(1)}`);
  let acc = 0;
  for (let s = 0; s <= u; s += 0.02) {
    const ddx = 250, ddy = -108 + 16 * 2 * Math.PI * Math.cos(2 * Math.PI * s);
    const dd = Math.hypot(ddx, ddy);
    acc += (ddx / dd) * fx + (ddy / dd) * fy;
  }
  const arrows: JSX.Element[] = [];
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 3; j++) {
      const ax = 55 + i * 55, ay = 45 + j * 55;
      arrows.push(
        <g key={`${i}${j}`} opacity={0.3}>
          <line x1={ax} y1={ay} x2={ax + 18 * fx} y2={ay + 18 * fy} stroke={C.cyan} strokeWidth={2} />
          <polygon points={`${ax + 24 * fx},${ay + 24 * fy} ${ax + 14 * fx - 4 * fy},${ay + 14 * fy + 4 * fx} ${ax + 14 * fx + 4 * fy},${ay + 14 * fy - 4 * fx}`} fill={C.cyan} />
        </g>
      );
    }
  return (
    <FigSvg>
      {arrows}
      <polyline points={path.join(" ")} fill="none" stroke={C.dim} strokeWidth={2.5} />
      <circle cx={X} cy={Y} r={7} fill={C.gold} />
      <line x1={X} y1={Y} x2={X + 34 * fx} y2={Y + 34 * fy} stroke={C.cyan} strokeWidth={2.5} />
      <line x1={X} y1={Y} x2={X + 30 * tx} y2={Y + 30 * ty} stroke={C.dim} strokeWidth={2} />
      <line x1={X} y1={Y} x2={X + 34 * dot * tx} y2={Y + 34 * dot * ty} stroke={C.gold} strokeWidth={4.5} />
      <rect x={250} y={26} width={Math.max(acc * 1.15, 2)} height={10} fill={C.green} opacity={0.9} rx={3} />
      <text x={162} y={35} fontSize={10.5} fill={C.green}>集めた合計 →</text>
      <text x={44} y={177} fontSize={10.5} fill={C.dim}>水色=場の矢印 / 金=道の向きに「効く成分」</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 面積分: 面をタイルに刻み、タイルごとに「貫く本数」を数えて足す */
export function SurfaceTiles() {
  const t = useT();
  const pulse = (t * 30) % 24;
  const ux = 56, uy = -7;
  const vx = 15, vy = -30;
  const ox = 58, oy = 152;
  const tiles: JSX.Element[] = [];
  let total = 0;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const x = ox + i * ux + j * vx;
      const y = oy + i * uy + j * vy;
      const cx = x + (ux + vx) / 2;
      const cy = y + (uy + vy) / 2;
      const strength = 14 + 7 * i + 4 * j; // 場所によって場の強さが違う
      total += strength;
      tiles.push(
        <g key={`${i}${j}`}>
          <polygon
            points={`${x},${y} ${x + ux},${y + uy} ${x + ux + vx},${y + uy + vy} ${x + vx},${y + vy}`}
            fill={C.cyan} opacity={0.13} stroke={C.dim} strokeWidth={1}
          />
          <line x1={cx} y1={cy} x2={cx + 8} y2={cy - strength} stroke={C.gold} strokeWidth={2} opacity={0.9} />
          <circle cx={cx + 8 * (pulse / 24)} cy={cy - strength * (pulse / 24)} r={2} fill={C.gold} />
        </g>
      );
    }
  return (
    <FigSvg>
      {tiles}
      <text x={210} y={40} fontSize={11.5} fill={C.gold}>1枚: (貫く成分)×(面積)</text>
      <text x={210} y={58} fontSize={11.5} fill={C.green}>Φ = 全タイルの合計</text>
      <text x={30} y={176} fontSize={10.5} fill={C.dim}>タイルを細かくした極限が ∫B·dA</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** x(t)→v(t): 上のグラフの「傾き」が、下のグラフの「値」になる */
export function XvaChain() {
  const t = useT();
  const u = (t % 5) / 5;
  const X = 50 + 240 * u;
  const xTop = (x: number) => 82 - 55 * Math.pow((x - 50) / 240, 2);
  const yBot = (x: number) => 166 - 42 * ((x - 50) / 240);
  const slope = (-55 * 2 * (X - 50)) / (240 * 240); // px傾き
  const topPts: string[] = [];
  const botPts: string[] = [];
  for (let x = 50; x <= 290; x += 5) topPts.push(`${x},${xTop(x).toFixed(1)}`);
  for (let x = 50; x <= 290; x += 5) botPts.push(`${x},${yBot(x).toFixed(1)}`);
  return (
    <FigSvg>
      <line x1={50} y1={88} x2={295} y2={88} stroke={C.dim} strokeWidth={1} opacity={0.5} />
      <line x1={50} y1={166} x2={295} y2={166} stroke={C.dim} strokeWidth={1} opacity={0.5} />
      <polyline points={topPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.2} />
      <polyline points={botPts.join(" ")} fill="none" stroke={C.purple} strokeWidth={2.2} />
      <line x1={X - 26} y1={xTop(X) + 26 * -slope} x2={X + 26} y2={xTop(X) + 26 * slope} stroke={C.gold} strokeWidth={2.5} />
      <circle cx={X} cy={xTop(X)} r={5} fill={C.gold} />
      <circle cx={X} cy={yBot(X)} r={5} fill={C.purple} />
      <line x1={X} y1={xTop(X)} x2={X} y2={yBot(X)} stroke="#fff" strokeDasharray="3 4" opacity={0.3} />
      <text x={54} y={22} fontSize={11} fill={C.cyan}>位置 x(t) — 接線の傾きが増えていく</text>
      <text x={54} y={110} fontSize={11} fill={C.purple}>速度 v(t) — その傾きを「値」として描いた線</text>
      <text x={54} y={182} fontSize={10.5} fill={C.dim}>vの傾き(一定) = 加速度 a</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** トルク: 同じ力でも、回転軸から遠くを押すほどよく回る */
export function TorqueDoor() {
  const [r, setR] = useState(85);
  const t = useT();
  const hx = 55, hy = 92;
  const L = 215;
  const swing = 0.3 * (r / 100) * Math.sin(1.9 * t);
  const dx = Math.cos(swing), dy = Math.sin(swing);
  const fx = hx + (L * r) / 100 * dx;
  const fy = hy + (L * r) / 100 * dy;
  return (
    <div>
      <FigSvg>
        <circle cx={hx} cy={hy} r={7} fill={C.dim} />
        <text x={hx - 30} y={hy - 14} fontSize={10.5} fill={C.dim}>ちょうつがい</text>
        <line x1={hx} y1={hy} x2={hx + L * dx} y2={hy + L * dy} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
        <line x1={fx} y1={fy - 38} x2={fx} y2={fy - 10} stroke={C.red} strokeWidth={3} />
        <polygon points={`${fx},${fy - 4} ${fx - 6},${fy - 14} ${fx + 6},${fy - 14}`} fill={C.red} />
        <text x={fx - 24} y={fy - 44} fontSize={11} fill={C.red}>同じ力 F</text>
        <text x={54} y={160} fontSize={11.5} fill="#fff">押す位置: 軸から {r}%(揺れの大きさ = 回しやすさ)</text>
        <Caption text="遠くを押すほど、同じ角度で長い距離を動かせる = 仕事を注ぎ込める" />
      </FigSvg>
      <input className="fig-slider" type="range" min={15} max={100} value={r}
        onChange={(e) => setR(Number(e.target.value))} />
    </div>
  );
}

/** 重心: 質量で重み付けした平均位置。シーソーが釣り合う点 */
export function ComSeesaw() {
  const [m2, setM2] = useState(3);
  const m1 = 2;
  const x1 = 75, x2 = 250;
  const xg = (m1 * x1 + m2 * x2) / (m1 + m2);
  const r1 = 8 + m1 * 3.5, r2 = 8 + m2 * 3.5;
  return (
    <div>
      <FigSvg>
        <line x1={55} y1={104} x2={270} y2={104} stroke={C.dim} strokeWidth={5} strokeLinecap="round" />
        <circle cx={x1} cy={104 - r1 - 3} r={r1} fill={C.cyan} />
        <text x={x1 - 12} y={104 - 2 * r1 - 10} fontSize={11} fill={C.cyan}>m₁ = {m1}</text>
        <circle cx={x2} cy={104 - r2 - 3} r={r2} fill={C.purple} />
        <text x={x2 - 14} y={104 - 2 * r2 - 10} fontSize={11} fill={C.purple}>m₂ = {m2}</text>
        <polygon points={`${xg},108 ${xg - 13},138 ${xg + 13},138`} fill={C.gold} />
        <text x={xg - 22} y={156} fontSize={11} fill={C.gold}>重心 r_G</text>
        <text x={56} y={30} fontSize={11.5} fill="#fff">r_G = (m₁x₁ + m₂x₂) / (m₁+m₂) — 重い側に寄る</text>
        <Caption text="ここを支えれば釣り合う。「質量の平均位置」の意味" />
      </FigSvg>
      <input className="fig-slider" type="range" min={1} max={6} value={m2}
        onChange={(e) => setM2(Number(e.target.value))} />
    </div>
  );
}
