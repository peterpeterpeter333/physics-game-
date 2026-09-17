import { useT, C } from "./anim";
import {useState} from 'react';
import { FigSvg, Caption } from "./mechanics";

// 大学電磁気: 「全ステップに図解」体制のための追加図解 (26種)

const Arrow = ({ x, y, dx, dy, color, w = 2.5 }: { x: number; y: number; dx: number; dy: number; color: string; w?: number }) => {
  const l = Math.hypot(dx, dy) || 1;
  const ux = dx / l, uy = dy / l;
  const ex = x + dx, ey = y + dy;
  return (
    <g>
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={color} strokeWidth={w} />
      <polygon points={`${ex + 7 * ux},${ey + 7 * uy} ${ex - 4 * uy},${ey + 4 * ux} ${ex + 4 * uy},${ey - 4 * ux}`} fill={color} />
    </g>
  );
};

const Dot = ({ x, y, color = C.dim }: { x: number; y: number; color?: string }) => (
  <g opacity={0.6}>
    <circle cx={x} cy={y} r={5} fill="none" stroke={color} strokeWidth={1.2} />
    <circle cx={x} cy={y} r={1.4} fill={color} />
  </g>
);

const Steps3 = ({ labels, active }: { labels: [string, string][]; active: number }) => (
  <g>
    {labels.map(([a, b], i) => {
      const x = 14 + i * 104;
      const on = active === i;
      return (
        <g key={i} opacity={on ? 1 : 0.45}>
          <rect x={x} y={62} width={86} height={62} rx={10} fill={on ? "rgba(78,225,255,0.12)" : "none"} stroke={on ? C.cyan : C.dim} strokeWidth={on ? 2.5 : 1.5} />
          <text x={x + 8} y={88} fontSize={11} fill={on ? C.cyan : C.dim}>{a}</text>
          <text x={x + 8} y={106} fontSize={11} fill={on ? C.cyan : C.dim}>{b}</text>
          {i < 2 && <polygon points={`${x + 92},93 ${x + 100},88 ${x + 100},98`} fill={C.dim} />}
        </g>
      );
    })}
  </g>
);

/** ガウスの法則の使い方: 対称性を見る → 袋を選ぶ → E×面積 */
export function GaussRecipe() {
  const t = useT();
  return (
    <FigSvg>
      <Steps3 active={Math.floor(t / 1.4) % 3} labels={[["① 対称性から", "　 Eの向きを見抜く"], ["② Eが一定になる", "　 袋(面)を選ぶ"], ["③ E×面積 =", "　 Q/ε₀ を解く"]]} />
      <text x={30} y={158} fontSize={11.5} fill={C.gold}>典型例：球対称・円筒対称・平面対称</text>
      <Caption text="法則は一般に成立。対称性があると、電場を簡単に求められる" />
    </FigSvg>
  );
}

/** 円筒対称と平面対称の袋 */
export function GaussCylPlane() {
  const t = useT();
  const pulse = (t * 30) % 30;
  return (
    <FigSvg>
      <line x1={70} y1={30} x2={70} y2={150} stroke={C.red} strokeWidth={3} />
      <ellipse cx={70} cy={60} rx={34} ry={9} fill="none" stroke={C.cyan} strokeWidth={1.5} strokeDasharray="4 3" />
      <ellipse cx={70} cy={125} rx={34} ry={9} fill="none" stroke={C.cyan} strokeWidth={1.5} strokeDasharray="4 3" />
      <line x1={36} y1={60} x2={36} y2={125} stroke={C.cyan} strokeWidth={1.5} strokeDasharray="4 3" />
      <line x1={104} y1={60} x2={104} y2={125} stroke={C.cyan} strokeWidth={1.5} strokeDasharray="4 3" />
      {[75, 95, 115].map((y) => (
        <g key={y}>
          <Arrow x={70} y={y} dx={30 + pulse * 0.4} dy={0} color={C.gold} w={1.5} />
          <Arrow x={70} y={y} dx={-30 - pulse * 0.4} dy={0} color={C.gold} w={1.5} />
        </g>
      ))}
      <text x={20} y={170} fontSize={10.5} fill={C.cyan}>線電荷: 同軸の円筒 → E ∝ 1/r</text>
      <rect x={180} y={88} width={110} height={5} fill={C.red} />
      <rect x={215} y={60} width={40} height={60} fill="none" stroke={C.cyan} strokeWidth={1.5} strokeDasharray="4 3" />
      {[195, 235, 275].map((x) => (
        <g key={x}>
          <Arrow x={x} y={86} dx={0} dy={-22 - pulse * 0.3} color={C.gold} w={1.5} />
          <Arrow x={x} y={95} dx={0} dy={22 + pulse * 0.3} color={C.gold} w={1.5} />
        </g>
      ))}
      <text x={178} y={170} fontSize={10.5} fill={C.cyan}>面電荷: 貫く箱 → E は一定</text>
      <text x={40} y={22} fontSize={11} fill="#fff">点:1/r² → 線:1/r → 面:一定 の階段</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 帯電した殻の内側は電場ゼロ */
export function ShellZero() {
  const t = useT();
  const cx = 150, cy = 92;
  const a = 0.9 * t;
  const lines = Array.from({ length: 12 }, (_, i) => (2 * Math.PI * i) / 12);
  return (
    <FigSvg>
      {lines.map((th, i) => (
        <line key={i} x1={cx + 56 * Math.cos(th)} y1={cy + 56 * Math.sin(th)} x2={cx + 86 * Math.cos(th)} y2={cy + 86 * Math.sin(th)} stroke={C.gold} strokeWidth={1.5} opacity={0.8} />
      ))}
      <circle cx={cx} cy={cy} r={56} fill="rgba(255,93,122,0.08)" stroke={C.red} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={30} fill="none" stroke={C.cyan} strokeWidth={1.5} strokeDasharray="4 3" />
      <circle cx={cx + 18 * Math.cos(a)} cy={cy + 18 * Math.sin(a)} r={6} fill={C.cyan} />
      <text x={cx - 44} y={cy + 4} fontSize={10.5} fill={C.cyan}>中の袋: 電荷0</text>
      <text x={cx - 60} y={cy - 66} fontSize={11} fill={C.red}>帯電した殻 (電荷は表面)</text>
      <text x={18} y={168} fontSize={10.5} fill={C.dim}>一様な球殻：球対称性と流束0を併せて内部E=0</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 等電位面と電場: 等高線が混む所ほど坂が急 = Eが強い */
export function ContourMap() {
  const t = useT();
  const cx = 150, cy = 92;
  const a = 0.6 * t;
  const rs = [18, 26, 38, 56, 82];
  return (
    <FigSvg>
      {rs.map((r, i) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={C.purple} strokeWidth={1.5} opacity={0.9 - i * 0.12} />
      ))}
      <circle cx={cx} cy={cy} r={7} fill={C.red} />
      {[0, 1, 2, 3].map((k) => {
        const th = a + (k * Math.PI) / 2;
        const r0 = 22;
        return <Arrow key={k} x={cx + r0 * Math.cos(th)} y={cy + r0 * Math.sin(th)} dx={26 * Math.cos(th)} dy={26 * Math.sin(th)} color={C.cyan} w={2.5} />;
      })}
      <text x={20} y={26} fontSize={11} fill={C.purple}>紫 = 等電位線（平面上で電位が等しい線）</text>
      <text x={20} y={42} fontSize={11} fill={C.cyan}>水色 = 電場 (等電位面に直角、混む所で強い)</text>
      <Caption text="静電場：電場は等電位線に垂直で、電位が下がる向き" />
    </FigSvg>
  );
}

/** 導体の中は電位が平ら(台地)。E = 傾き = 0 */
export function ConductorPlateau() {
  const t = useT();
  const u = (t % 4) / 4;
  const X = 40 + 250 * u;
  const V = (x: number) => (x < 120 ? 140 - 0.55 * (x - 40) : x < 200 ? 96 : 96 - 0.4 * (x - 200));
  const pts: string[] = [];
  for (let x = 40; x <= 290; x += 4) pts.push(`${x},${V(x)}`);
  return (
    <FigSvg>
      <rect x={120} y={30} width={80} height={130} fill="rgba(255,209,102,0.12)" stroke={C.gold} strokeWidth={1.5} />
      <text x={134} y={48} fontSize={11} fill={C.gold}>導体</text>
      <polyline points={pts.join(" ")} fill="none" stroke={C.purple} strokeWidth={2.5} />
      <circle cx={X} cy={V(X)} r={5} fill={C.cyan} />
      <text x={22} y={26} fontSize={11} fill={C.purple}>電位 V の高さ</text>
      <text x={126} y={84} fontSize={11} fill={C.cyan}>{X > 120 && X < 200 ? "平ら → E = 0" : "坂 → E ≠ 0"}</text>
      <text x={20} y={172} fontSize={10.5} fill={C.dim}>内部E=0 → 傾き0 → 導体全体が同じ電位(等電位体)</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** C = ε₀S/d の導出の流れ */
export function CapDerivation() {
  const t = useT();
  const ph = Math.floor(t / 1.3) % 4;
  const items = [["ガウス", "E = σ/ε₀"], ["電圧", "V = Ed"], ["定義", "C = Q/V"], ["結果", "C = ε₀S/d"]];
  return (
    <FigSvg>
      {items.map(([a, b], i) => {
        const on = i <= ph;
        return (
          <g key={i} opacity={on ? 1 : 0.3}>
            <rect x={14 + i * 74} y={64} width={64} height={58} rx={9} fill={i === ph ? "rgba(255,209,102,0.15)" : "none"} stroke={i === 3 ? C.gold : C.cyan} strokeWidth={i === ph ? 2.5 : 1.5} />
            <text x={22 + i * 74} y={86} fontSize={10.5} fill={C.dim}>{a}</text>
            <text x={22 + i * 74} y={106} fontSize={11.5} fill={i === 3 ? C.gold : C.cyan}>{b}</text>
            {i < 3 && <polygon points={`${80 + i * 74},93 ${87 + i * 74},88 ${87 + i * 74},98`} fill={C.dim} />}
          </g>
        );
      })}
      <text x={40} y={156} fontSize={11} fill="#fff">σ = Q/S を入れると S と d だけ残る</text>
      <Caption text="高校の公式は4手で「作れる」" />
    </FigSvg>
  );
}

/** エネルギーは電場に宿る: 板の間の空間が濃く光る */
export function FieldEnergy() {
  const t = useT();
  const q = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 5);
  const u = q * q;
  return (
    <FigSvg>
      <rect x={90} y={40} width={8} height={110} fill={C.red} />
      <rect x={222} y={40} width={8} height={110} fill={C.cyan} />
      <rect x={98} y={40} width={124} height={110} fill={C.gold} opacity={0.08 + 0.5 * u} />
      {[60, 95, 130].map((y) => (
        <Arrow key={y} x={104} y={y} dx={108} dy={0} color={C.gold} w={1 + 2 * q} />
      ))}
      <text x={40} y={30} fontSize={11} fill="#fff">板の間の電場 E — 明るさ ∝ E² (エネルギー密度)</text>
      <text x={20} y={172} fontSize={10.5} fill={C.dim}>u = ½ε₀E²: 式に残ったのはEだけ — エネルギーは空間の状態に宿る</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 誘電体: 分極がEを部分的に打ち消し、同じQでもVが下がる */
export function Dielectric() {
  const t = useT();
  const align = Math.min(1, ((t % 4) / 4) * 1.6);
  return (
    <FigSvg>
      <rect x={70} y={40} width={8} height={110} fill={C.red} />
      <rect x={242} y={40} width={8} height={110} fill={C.cyan} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => {
          const x = 100 + c * 36, y = 60 + r * 36;
          const ang = (1 - align) * 1.2 * Math.sin(r * 3 + c * 5);
          return (
            <g key={`${r}${c}`} transform={`rotate(${(ang * 180) / Math.PI} ${x} ${y})`}>
              <line x1={x - 9} y1={y} x2={x + 9} y2={y} stroke={C.dim} strokeWidth={2} />
              <circle cx={x - 9} cy={y} r={3.5} fill={C.cyan} />
              <circle cx={x + 9} cy={y} r={3.5} fill={C.red} />
            </g>
          );
        })
      )}
      <Arrow x={84} y={165} dx={150} dy={0} color={C.gold} w={1.5 + 1.5 * (1 - align * 0.5)} />
      <text x={110} y={178} fontSize={10.5} fill={C.gold}>{align > 0.9 ? "分極の逆向き電場で E が弱まる" : "板間の電場 E"}</text>
      <text x={60} y={28} fontSize={11} fill="#fff">絶縁体の分子が電場に沿って向きを揃える(分極)</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 電子はノロノロ、合図は光速: 満水のホース */
export function Drift() {
  const t = useT();
  const sig = (t * 260) % 300;
  return (
    <FigSvg>
      <rect x={20} y={70} width={280} height={50} rx={12} fill="none" stroke={C.dim} strokeWidth={2} />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 32 + ((i * 20 + t * 6) % 264);
        return <circle key={i} cx={x} cy={95 + 12 * Math.sin(i)} r={5} fill={C.cyan} />;
      })}
      <rect x={sig} y={70} width={14} height={50} fill={C.gold} opacity={0.5} />
      <text x={24} y={50} fontSize={11} fill={C.cyan}>電子の平均の移動は遅い（電流密度などによる）</text>
      <text x={24} y={150} fontSize={11} fill={C.gold}>場の変化は有限の速さで伝わる（媒質・構造による）</text>
      <Caption text="電子の平均移動と場の変化の伝搬は別。合図も有限の時間をかけて届く" />
    </FigSvg>
  );
}

/** 抵抗の正体: 加速→格子に衝突→加速の繰り返し */
export function DriftCollisions() {
  const t = useT();
  const u = (t % 3) / 3;
  const ions = Array.from({ length: 12 }, (_, i) => [50 + (i % 6) * 44, 60 + Math.floor(i / 6) * 60]);
  const path: string[] = [];
  let x = 30, y = 95;
  const seg = 12;
  for (let i = 0; i <= seg * u; i++) {
    path.push(`${x},${y}`);
    x += 20;
    y = 95 + 28 * Math.sin(i * 2.3);
  }
  return (
    <FigSvg>
      {ions.map(([ix, iy], i) => (
        <circle key={i} cx={ix} cy={iy} r={7} fill="none" stroke={C.red} strokeWidth={1.5} opacity={0.6} />
      ))}
      <polyline points={path.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2} />
      {path.length > 0 && <circle cx={x - 20} cy={95 + 28 * Math.sin((path.length - 1) * 2.3)} r={5} fill={C.cyan} />}
      <Arrow x={260} y={160} dx={-220} dy={0} color={C.gold} w={2} />
      <text x={16} y={175} fontSize={10.5} fill={C.gold}>金：電場は左向き。青：電子は平均して右へ</text>
      <text x={20} y={30} fontSize={11} fill="#fff">青：電子の模式軌道。赤：散乱を起こす格子の目印</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 送電: 同じ電力でも高電圧なら電流が小さく、損失 I²R が激減 */
export function Transmission() {
  const t = useT();
  const hi = Math.floor(t / 2) % 2 === 1;
  const I = hi ? 1 : 10;
  const loss = I * I;
  return (
    <FigSvg>
      <line x1={30} y1={80} x2={290} y2={80} stroke={C.dim} strokeWidth={3} />
      {Array.from({ length: I }, (_, i) => (
        <circle key={i} cx={40 + ((i * 25 + t * 40) % 250)} cy={80} r={4} fill={C.cyan} />
      ))}
      <text x={30} y={40} fontSize={12} fill="#fff">{hi ? "高電圧 (100倍): 電流 1/100" : "低電圧: 電流が大きい"}</text>
      <text x={30} y={58} fontSize={10.5} fill={C.dim}>送る電力 P = IV は同じ</text>
      <rect x={200} y={150 - Math.min(loss, 100)} width={30} height={Math.min(loss, 100)} fill={C.red} opacity={0.85} />
      <text x={160} y={166} fontSize={10.5} fill={C.red}>送電線の損失 I²R</text>
      <text x={240} y={140} fontSize={11} fill={C.red}>{hi ? "1/10000!" : "大"}</text>
      <Caption text="P固定でVを100倍 → Iは1/100 → 損失は1万分の1" />
    </FigSvg>
  );
}

/** 磁場中の電流が受ける力 F = IL×B (モーターの原理) */
export function MotorForce() {
  const t = useT();
  const lift = 12 * Math.sin(2 * t);
  return (
    <FigSvg>
      {Array.from({ length: 5 }, (_, i) => Array.from({ length: 3 }, (_, j) => <Dot key={`${i}${j}`} x={50 + i * 55} y={45 + j * 55} />))}
      <line x1={60} y1={100 - lift} x2={260} y2={100 - lift} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
      <Arrow x={110} y={100 - lift} dx={80} dy={0} color={C.cyan} w={3} />
      <text x={130} y={92 - lift} fontSize={11} fill={C.cyan}>電流 I</text>
      <Arrow x={160} y={92 - lift} dx={0} dy={-40} color={C.red} w={3} />
      <text x={168} y={52 - lift} fontSize={11} fill={C.red}>力 F = IL×B</text>
      <text x={20} y={170} fontSize={10.5} fill={C.dim}>⊙ = 磁場B(手前向き)。無数の電子のローレンツ力を束ねたもの</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 荷電粒子は磁力線に巻き付くらせんを描く (オーロラ) */
export function Helix() {
  const t = useT();
  const u = (t % 4) / 4;
  const pts: string[] = [];
  for (let i = 0; i <= 200 * u; i++) {
    const s = i / 200;
    pts.push(`${40 + 240 * s},${95 + 30 * Math.sin(s * 28)}`);
  }
  const x = 40 + 240 * u, y = 95 + 30 * Math.sin(u * 28);
  return (
    <FigSvg>
      {[65, 95, 125].map((yy) => (
        <line key={yy} x1={20} y1={yy} x2={300} y2={yy} stroke={C.purple} strokeWidth={1.2} opacity={0.5} />
      ))}
      <text x={22} y={56} fontSize={10.5} fill={C.purple}>磁力線 B</text>
      {pts.length > 1 && <polyline points={pts.join(" ")} fill="none" stroke={C.gold} strokeWidth={2} />}
      <circle cx={x} cy={y} r={6} fill={C.gold} />
      <text x={20} y={30} fontSize={11} fill="#fff">磁場方向の速度はそのまま、垂直成分は円運動 → らせん</text>
      <text x={20} y={170} fontSize={10.5} fill={C.dim}>磁力線に導かれて極域へ → 大気と衝突して発光 = オーロラ</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** ビオ・サバール: 電流の欠片ごとの磁場の寄与を足す */
export function BiotSavart() {
  const t = useT();
  const [selected,setSelected]=useState<number|null>(null);
  const k = selected??Math.floor(t / 0.6) % 6;
  const px = 220, py = 60;
  const contributions=Array.from({length:6},(_,i)=>1/Math.pow(1+((40+i*20-py)/160)**2,1.5));
  const value=selected===null?contributions.slice(0,k+1).reduce((s,v)=>s+v,0):contributions[k];
  return (
    <div><FigSvg>
      <line x1={60} y1={150} x2={60} y2={30} stroke={C.red} strokeWidth={3} />
      <Arrow x={60} y={120} dx={0} dy={-40} color={C.red} w={3} />
      <text x={30} y={26} fontSize={11} fill={C.red}>電流 I</text>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 40 + i * 20;
        const on = selected===null?i<=k:i===k;
        return (
          <g key={i} opacity={on ? 1 : 0.2}>
            <rect x={56} y={y - 6} width={8} height={12} fill={C.gold} />
            <line x1={64} y1={y} x2={px} y2={py} stroke={C.gold} strokeWidth={1} strokeDasharray="3 3" />
          </g>
        );
      })}
      <circle cx={px} cy={py} r={5} fill={C.cyan} />
      <text x={px + 10} y={py - 4} fontSize={11} fill={C.cyan}>点P</text>
      <rect x={px - 6} y={py + 14} width={12} height={10*value} fill={C.cyan} opacity={0.7} />
      <text x={px - 45} y={py + 36 + 10*value} fontSize={10.5} fill={C.cyan}>{selected===null?'合計':'一区間'}：{value.toFixed(2)}（相対値）</text>
      <text x={110} y={165} fontSize={10.5} fill={C.dim}>dB = (μ₀/4π)·I dl sinθ / r²  を全欠片で積分</text>
      <Caption text="" />
    </FigSvg><label>まず一区間を見る<input aria-label="ビオ・サバールの導線区間" type="range" min="0" max="5" step="1" value={k} onChange={e=>setSelected(+e.target.value)}/></label><button className="btn btn-ghost" onClick={()=>setSelected(null)}>全区間を順に足す</button><p>金の線は導線区間から固定観測点Pへのr。電流は上向き、dBは紙面の奥向き。同じ長さの区間を点で近似し、sinθ/r²を比較しています。Pと同じ高さの区間の寄与を1とした相対値で、単位Tではありません。</p></div>
  );
}

/** アンペール: 同心円に沿ってBは一定 → B·2πr = μ₀I */
export function AmpereCircle() {
  const t = useT();
  const a = 1.2 * t;
  const cx = 130, cy = 92, R = 58;
  const px = cx + R * Math.cos(a), py = cy + R * Math.sin(a);
  return (
    <FigSvg>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.cyan} strokeWidth={2.5} strokeDasharray="6 4" />
      <circle cx={cx} cy={cy} r={9} fill="#0b1026" stroke={C.gold} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={3} fill={C.gold} />
      <circle cx={px} cy={py} r={6} fill={C.cyan} />
      <Arrow x={px} y={py} dx={-30 * Math.sin(a)} dy={30 * Math.cos(a)} color={C.purple} w={3} />
      <text x={px - 30 * Math.sin(a) + 6} y={py + 30 * Math.cos(a) + 4} fontSize={11} fill={C.purple}>B</text>
      <text x={198} y={60} fontSize={11} fill="#fff">どこでもBは円に沿い</text>
      <text x={198} y={76} fontSize={11} fill="#fff">大きさも同じ</text>
      <text x={198} y={104} fontSize={11.5} fill={C.gold}>∮B·dr = B×2πr</text>
      <text x={198} y={122} fontSize={11.5} fill={C.gold}>= μ₀I</text>
      <Caption text="輪を同心円に選べば1行で B = μ₀I/2πr" />
    </FigSvg>
  );
}

/** ソレノイド: 内部に一様な磁場、外部はほぼゼロ */
export function Solenoid() {
  const t = useT();
  const pulse = (t * 40) % 40;
  return (
    <FigSvg>
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx={60 + i * 25} cy={92} rx={9} ry={34} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.8} />
      ))}
      {[72, 92, 112].map((y) => (
        <g key={y}>
          <line x1={60} y1={y} x2={260} y2={y} stroke={C.cyan} strokeWidth={2} opacity={0.9} />
          <circle cx={60 + ((pulse * 5 + (y - 72) * 2) % 200)} cy={y} r={3} fill={C.cyan} />
        </g>
      ))}
      <text x={92} y={40} fontSize={11} fill={C.cyan}>内部: 一様な B = μ₀nI</text>
      <text x={92} y={160} fontSize={10.5} fill={C.dim}>外部: ほぼ 0。n = 単位長さあたりの巻き数</text>
      <Caption text="長方形の輪にアンペールの法則 → BL = μ₀(nL)I" />
    </FigSvg>
  );
}

/** 発電機: 回るコイルの磁束 cosωt を微分すると sinωt の交流電圧 */
export function Generator() {
  const t = useT();
  const w = 1.6 * t;
  const cx = 70, cy = 92;
  const flux: string[] = [];
  const emf: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const s = (i / 60) * 2 * Math.PI;
    flux.push(`${150 + 24 * s},${70 - 22 * Math.cos(s + w)}`);
    emf.push(`${150 + 24 * s},${130 - 22 * Math.sin(s + w)}`);
  }
  return (
    <FigSvg>
      <ellipse cx={cx} cy={cy} rx={Math.max(4, 40 * Math.abs(Math.cos(w)))} ry={40} fill="none" stroke={C.gold} strokeWidth={3} />
      {[62, 92, 122].map((y) => (
        <Arrow key={y} x={18} y={y} dx={100} dy={0} color={C.cyan} w={1.2} />
      ))}
      <text x={22} y={30} fontSize={10.5} fill={C.gold}>磁場中でコイルを回す</text>
      <polyline points={flux.join(" ")} fill="none" stroke={C.purple} strokeWidth={2} />
      <text x={152} y={38} fontSize={10.5} fill={C.purple}>磁束 Φ = BAcosωt</text>
      <polyline points={emf.join(" ")} fill="none" stroke={C.green} strokeWidth={2} />
      <text x={152} y={100} fontSize={10.5} fill={C.green}>起電力 V = −dΦ/dt ∝ sinωt</text>
      <Caption text="Φの微分が交流電圧。速く回すほど(ω大)高電圧" />
    </FigSvg>
  );
}

/** インダクタンス = 電流の慣性: スイッチONでも電流はゆっくり立ち上がる */
export function InductorInertia() {
  const t = useT();
  const u = (t % 4) / 4;
  const X = 45 + 240 * u;
  const pts: string[] = [];
  for (let x = 45; x <= X; x += 4) pts.push(`${x},${(150 - 100 * (1 - Math.exp(-(x - 45) / 60))).toFixed(1)}`);
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={45} y1={150} x2={295} y2={150} />
        <line x1={45} y1={150} x2={45} y2={25} />
      </g>
      <line x1={45} y1={50} x2={295} y2={50} stroke={C.dim} strokeDasharray="5 4" />
      <text x={168} y={44} fontSize={10.5} fill={C.dim}>抵抗だけなら一瞬でここ</text>
      <polyline points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <text x={60} y={24} fontSize={11} fill={C.cyan}>コイルあり: 電流 I がゆっくり立ち上がる</text>
      <text x={60} y={168} fontSize={10.5} fill={C.gold}>V = −L(dI/dt) が変化に逆らう = 電流の慣性 (質量の役)</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 変圧器: 1次コイルの磁束変化が2次コイルに起電力を作る */
export function Transformer() {
  const t = useT();
  const s = Math.sin(3 * t);
  return (
    <FigSvg>
      <rect x={100} y={40} width={120} height={100} rx={8} fill="none" stroke={C.dim} strokeWidth={10} />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={100} cy={70 + i * 20} rx={14} ry={7} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse key={i} cx={220} cy={58 + i * 13} rx={14} ry={5} fill="none" stroke={C.gold} strokeWidth={2.5} />
      ))}
      <text x={20} y={30} fontSize={11} fill={C.cyan}>1次: 3巻き、交流 I₁</text>
      <text x={200} y={30} fontSize={11} fill={C.gold}>2次: 6巻き → 電圧2倍</text>
      <rect x={104} y={44} width={112} height={92} fill={C.purple} opacity={0.08 + 0.12 * Math.abs(s)} />
      <text x={128} y={95} fontSize={11} fill={C.purple}>磁束 Φ(t)</text>
      <text x={20} y={170} fontSize={10.5} fill={C.dim}>V₂ = −M dI₁/dt: 磁束の変化でエネルギーを渡す</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** 時定数 τ = RC: 大きいほどのんびり充電。63%到達の時間 */
export function TimeConstant() {
  const t = useT();
  const u = (t % 5) / 5;
  const X = 45 + 240 * u;
  const curve = (tau: number) => {
    const p: string[] = [];
    for (let x = 45; x <= X; x += 4) p.push(`${x},${(150 - 100 * (1 - Math.exp(-(x - 45) / tau))).toFixed(1)}`);
    return p.join(" ");
  };
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={45} y1={150} x2={295} y2={150} />
        <line x1={45} y1={150} x2={45} y2={25} />
      </g>
      <line x1={45} y1={87} x2={295} y2={87} stroke={C.gold} strokeDasharray="4 4" />
      <text x={230} y={82} fontSize={10.5} fill={C.gold}>63% ライン</text>
      <polyline points={curve(40)} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <polyline points={curve(110)} fill="none" stroke={C.purple} strokeWidth={2.5} />
      <text x={60} y={36} fontSize={11} fill={C.cyan}>RC 小: 速い (τ 短)</text>
      <text x={60} y={52} fontSize={11} fill={C.purple}>RC 大: のんびり (τ 長)</text>
      <Caption text="τ = RC は回路の「反応時間」。RやCで自在に設計できる" />
    </FigSvg>
  );
}

/** RL回路: ON で電流はなまり、急に OFF すると逆起電力の火花 */
export function RlRise() {
  const t = useT();
  const u = (t % 5) / 5;
  const on = u < 0.7;
  const pts: string[] = [];
  const end = on ? 45 + (240 * u) / 0.7 : 285;
  for (let x = 45; x <= Math.min(end, 285); x += 4) pts.push(`${x},${(150 - 95 * (1 - Math.exp(-(x - 45) / 70))).toFixed(1)}`);
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={45} y1={150} x2={295} y2={150} />
        <line x1={45} y1={150} x2={45} y2={25} />
      </g>
      <polyline points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      {!on && (
        <g>
          <line x1={285} y1={58} x2={285} y2={150} stroke={C.red} strokeWidth={3} />
          <polygon points="285,30 275,58 295,58" fill={C.red} opacity={0.9} />
          <text x={190} y={40} fontSize={11} fill={C.red}>OFF: dI/dt 巨大 → 高電圧の火花</text>
        </g>
      )}
      <text x={56} y={36} fontSize={11} fill={C.cyan}>ON: τ = L/R でゆっくり立ち上がる</text>
      <Caption text="電流の慣性を急停止させる衝撃の電気版" />
    </FigSvg>
  );
}

/** LC振動: 電場のエネルギーと磁場のエネルギーの交換ダンス */
export function LcOscillation() {
  const t = useT();
  const q = Math.cos(1.8 * t);
  const i = Math.sin(1.8 * t);
  return (
    <FigSvg>
      <rect x={40} y={60} width={26} height={70} fill="none" stroke={C.dim} strokeWidth={1.5} />
      <rect x={40} y={130 - 70 * q * q} width={26} height={70 * q * q} fill={C.cyan} opacity={0.85} />
      <text x={26} y={150} fontSize={10.5} fill={C.cyan}>電場 ½q²/C</text>
      <rect x={250} y={60} width={26} height={70} fill="none" stroke={C.dim} strokeWidth={1.5} />
      <rect x={250} y={130 - 70 * i * i} width={26} height={70 * i * i} fill={C.purple} opacity={0.85} />
      <text x={232} y={150} fontSize={10.5} fill={C.purple}>磁場 ½LI²</text>
      <rect x={110} y={82} width={30} height={26} fill="none" stroke={C.cyan} strokeWidth={2} />
      <path d="M170 95 q6 -12 12 0 q6 12 12 0 q6 -12 12 0" fill="none" stroke={C.purple} strokeWidth={2} />
      <line x1={140} y1={95} x2={170} y2={95} stroke={C.dim} strokeWidth={2} />
      <text x={104} y={70} fontSize={10.5} fill={C.dim}>C　　　　　L</text>
      <text x={60} y={36} fontSize={11} fill="#fff">L d²q/dt² = −q/C : 単振動の方程式 (m→L, k→1/C)</text>
      <Caption text="ω = 1/√(LC)。ラジオの選局はこの振動数を電波に合わせる操作" />
    </FigSvg>
  );
}

/** インピーダンス: コイルは高周波に強気、コンデンサは弱気 */
export function Impedance() {
  const t = useT();
  const cursor = 50 + 240 * (1 - Math.cos(t*.5))/2;
  const cw = (cursor - 45)/245;
  const zl: string[] = [];
  const zc: string[] = [];
  for (let x = 50; x <= 290; x += 4) {
    const w = (x - 45) / 245;
    zl.push(`${x},${(150 - 110 * w).toFixed(1)}`);
    zc.push(`${x},${Math.max(28, 150 - 14 / (w + 0.06)).toFixed(1)}`);
  }
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5} fill={C.dim}>
        <line x1={45} y1={150} x2={295} y2={150} />
        <line x1={45} y1={150} x2={45} y2={25} />
        <text x={230} y={166} fontSize={11} stroke="none">周波数 ω →</text>
        <text x={12} y={35} fontSize={11} stroke="none">通しにくさ</text>
      </g>
      <polyline points={zl.join(" ")} fill="none" stroke={C.purple} strokeWidth={2.5} />
      <polyline points={zc.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <line x1={cursor} x2={cursor} y1={25} y2={150} stroke={C.gold} strokeDasharray="3 3" />
      <circle cx={cursor} cy={150-110*cw} r={4} fill={C.purple} />
      <circle cx={cursor} cy={Math.max(28,150-14/(cw+.06))} r={4} fill={C.cyan} />
      <text x={200} y={50} fontSize={11} fill={C.purple}>コイル Z = ωL</text>
      <text x={200} y={135} fontSize={11} fill={C.cyan}>コンデンサ Z = 1/ωC</text>
      <Caption text="周波数で通しやすさが変わる = 音域分割・フィルタの仕分け人" />
    </FigSvg>
  );
}

/** マクスウェル方程式4本の絵 */
export function MaxwellFour() {
  const t = useT();
  const k = Math.floor(t / 1.5) % 4;
  const panel = (i: number, x: number, title: string, sub: string, draw: JSX.Element) => (
    <g opacity={k === i ? 1 : 0.4}>
      <rect x={x} y={34} width={68} height={112} rx={8} fill={k === i ? "rgba(78,225,255,0.1)" : "none"} stroke={k === i ? C.cyan : C.dim} strokeWidth={k === i ? 2 : 1} />
      {draw}
      <text x={x + 6} y={126} fontSize={9.5} fill={k === i ? C.cyan : C.dim}>{title}</text>
      <text x={x + 6} y={140} fontSize={9.5} fill={C.dim}>{sub}</text>
    </g>
  );
  return (
    <FigSvg>
      {panel(0, 12, "①ガウス(E)", "袋の本数=電荷", <g><circle cx={46} cy={78} r={22} fill="none" stroke={C.gold} strokeDasharray="3 3" /><circle cx={46} cy={78} r={5} fill={C.red} />{[0, 1, 2, 3].map((j) => <line key={j} x1={46 + 7 * Math.cos(j * 1.57)} y1={78 + 7 * Math.sin(j * 1.57)} x2={46 + 30 * Math.cos(j * 1.57)} y2={78 + 30 * Math.sin(j * 1.57)} stroke={C.gold} strokeWidth={1.5} />)}</g>)}
      {panel(1, 86, "②ガウス(B)", "磁力線は閉じる", <g><circle cx={120} cy={78} r={22} fill="none" stroke={C.gold} strokeDasharray="3 3" /><ellipse cx={120} cy={78} rx={30} ry={12} fill="none" stroke={C.purple} strokeWidth={1.5} /></g>)}
      {panel(2, 160, "③ファラデー", "B変化→Eの渦", <g><ellipse cx={194} cy={78} rx={24} ry={10} fill="none" stroke={C.cyan} strokeWidth={2} /><line x1={194} y1={104} x2={194} y2={56} stroke={C.purple} strokeWidth={2} /><polygon points="194,50 189,60 199,60" fill={C.purple} /></g>)}
      {panel(3, 234, "④アンペール+", "I・E変化→Bの渦", <g><ellipse cx={268} cy={78} rx={24} ry={10} fill="none" stroke={C.purple} strokeWidth={2} /><line x1={268} y1={104} x2={268} y2={56} stroke={C.gold} strokeWidth={2} /><polygon points="268,50 263,60 273,60" fill={C.gold} /></g>)}
      <Caption text="場の四つの法則。物体の運動にはローレンツ力なども必要" />
    </FigSvg>
  );
}

/** 電磁波: EとBが互いを生み合いながら進む */
export function EmWave() {
  const t = useT();
  const e: string[] = [];
  const b: string[] = [];
  for (let x = 30; x <= 290; x += 3) {
    const ph = (x - 30) / 22 - 3 * t;
    e.push(`${x},${(95 - 40 * Math.sin(ph)).toFixed(1)}`);
    b.push(`${x + 14 * Math.sin(ph)},${(95 + 6 * Math.sin(ph)).toFixed(1)}`);
  }
  return (
    <FigSvg>
      <line x1={20} y1={95} x2={300} y2={95} stroke={C.dim} strokeWidth={1.2} />
      <polyline points={b.join(" ")} fill="none" stroke={C.purple} strokeWidth={2} opacity={0.8} />
      <polyline points={e.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <Arrow x={250} y={30} dx={36} dy={0} color={C.gold} w={2} />
      <text x={200} y={26} fontSize={10.5} fill={C.gold}>進む向き c</text>
      <text x={24} y={30} fontSize={11} fill={C.cyan}>E (縦に振動)</text>
      <text x={24} y={172} fontSize={11} fill={C.purple}>B (横に振動、Eと直角)</text>
      <Caption text="E変化→B、B変化→E の連鎖。速さ c = 1/√(ε₀μ₀) = 光速" />
    </FigSvg>
  );
}

/** ここまでの道のりと、この先の山々 */
export function JourneyMap() {
  const t = useT();
  const k = Math.floor(t / 1.2) % 6;
  const nodes = [
    [40, 140, "武器庫"],
    [95, 110, "力学"],
    [150, 82, "電磁気"],
    [205, 60, "量子"],
    [250, 44, "統計"],
    [290, 32, "相対論"],
  ] as [number, number, string][];
  return (
    <FigSvg>
      <polyline points={nodes.map((n) => `${n[0]},${n[1]}`).join(" ")} fill="none" stroke={C.dim} strokeWidth={2} strokeDasharray="5 4" />
      {nodes.map(([x, y, label], i) => (
        <g key={i} opacity={i <= k ? 1 : 0.35}>
          <circle cx={x} cy={y} r={i <= 2 ? 9 : 7} fill={i <= 2 ? C.gold : "none"} stroke={i <= 2 ? C.gold : C.dim} strokeWidth={2} />
          <text x={x - 16} y={y + 24} fontSize={10.5} fill={i <= 2 ? C.gold : C.dim}>{label}</text>
        </g>
      ))}
      <text x={20} y={172} fontSize={10.5} fill="#fff">登り方はどこでも同じ: 方程式を立て、解き、意味を読む</text>
      <Caption text="" />
    </FigSvg>
  );
}
