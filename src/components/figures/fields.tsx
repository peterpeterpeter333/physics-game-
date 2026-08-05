import { useMemo, useState } from "react";
import { useT, bounce, rectPoint, wavePoints, sumWavePoints, C } from "./anim";
import { FigSvg, Caption } from "./mechanics";

/** 熱の移動: 高温→低温、分子の揺れが伝わる */
export function HeatFlow() {
  const t = useT();
  const p = (t % 5) / 5;
  const hotAmp = 5 - 2.5 * p;
  const coldAmp = 1.5 + 2.5 * p;
  const dots = [0, 1, 2, 3, 4, 5];
  return (
    <FigSvg>
      <rect x={55} y={55} width={85} height={80} rx={8} fill={C.red} opacity={0.14} stroke={C.red} />
      <rect x={180} y={55} width={85} height={80} rx={8} fill={C.cyan} opacity={0.12} stroke={C.cyan} />
      {dots.map((i) => (
        <circle
          key={`h${i}`}
          cx={72 + (i % 3) * 26 + hotAmp * Math.sin(t * 9 + i * 2)}
          cy={78 + Math.floor(i / 3) * 34 + hotAmp * Math.cos(t * 8 + i)}
          r={5}
          fill={C.red}
        />
      ))}
      {dots.map((i) => (
        <circle
          key={`c${i}`}
          cx={197 + (i % 3) * 26 + coldAmp * Math.sin(t * 7 + i)}
          cy={78 + Math.floor(i / 3) * 34 + coldAmp * Math.cos(t * 6 + i * 2)}
          r={5}
          fill={C.cyan}
        />
      ))}
      <line x1={145} y1={95} x2={172} y2={95} stroke={C.gold} strokeWidth={3.5} />
      <polygon points="178,95 166,88 166,102" fill={C.gold} />
      <text x={143} y={80} fontSize={11} fill={C.gold}>熱</text>
      <text x={78} y={48} fontSize={11} fill={C.red}>高温 (激しく振動)</text>
      <text x={192} y={48} fontSize={11} fill={C.cyan}>低温 (おだやか)</text>
      <Caption text="熱 = 分子の揺れの受け渡し。必ず高温→低温の一方通行" />
    </FigSvg>
  );
}

/** 気体分子: 温度スライダーで速さが変わる (インタラクティブ) */
export function GasBox() {
  const t = useT();
  const [temp, setTemp] = useState(50);
  const speed = 0.4 + (temp / 100) * 1.8;
  const seeds = useMemo(
    () =>
      Array.from({ length: 11 }).map((_, i) => ({
        x: 30 + ((i * 53) % 180),
        y: 15 + ((i * 37) % 95),
        vx: 22 + ((i * 17) % 30),
        vy: 16 + ((i * 23) % 28),
      })),
    []
  );
  return (
    <div>
      <FigSvg>
        <rect x={62} y={32} width={196} height={112} rx={6} fill="none" stroke={C.dim} strokeWidth={2.5} />
        {seeds.map((s, i) => (
          <circle
            key={i}
            cx={66 + bounce(s.x + s.vx * speed * t, 188)}
            cy={36 + bounce(s.y + s.vy * speed * t, 104)}
            r={5}
            fill={temp > 66 ? C.red : temp > 33 ? C.gold : C.cyan}
          />
        ))}
        <text x={64} y={24} fontSize={11} fill={C.dim}>圧力の正体 = 分子が壁を叩く連打</text>
        <Caption text="温度スライダーを動かすと分子の速さが変わる" />
      </FigSvg>
      <input
        className="fig-slider"
        type="range"
        min={0}
        max={100}
        value={temp}
        onChange={(e) => setTemp(Number(e.target.value))}
      />
    </div>
  );
}

/** 波の伝播: 媒質はその場で上下するだけ */
export function WaveTravel() {
  const t = useT();
  const phase = t * 4;
  const k = 0.055;
  const px = 168;
  const py = 88 - 32 * Math.sin(k * (px - 40) - phase);
  return (
    <FigSvg>
      <polyline points={wavePoints(40, 285, 88, 32, k, phase)} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <line x1={px} y1={40} x2={px} y2={140} stroke={C.dim} strokeDasharray="3 4" opacity={0.6} />
      <circle cx={px} cy={py} r={7} fill={C.red} />
      <text x={175} y={150} fontSize={11} fill={C.red}>この点はその場で上下するだけ</text>
      <text x={42} y={34} fontSize={11} fill={C.cyan}>波の形は右へ進む →</text>
      <Caption text="進むのは「振動のパターン」。媒質は移動しない" />
    </FigSvg>
  );
}

/** うなり: 2つの波の和 */
export function Beats() {
  const t = useT();
  const ph = t * 3;
  return (
    <FigSvg>
      <polyline points={wavePoints(30, 290, 42, 11, 0.16, ph)} fill="none" stroke={C.cyan} strokeWidth={1.8} />
      <polyline points={wavePoints(30, 290, 68, 11, 0.18, ph)} fill="none" stroke={C.gold} strokeWidth={1.8} />
      <polyline points={sumWavePoints(30, 290, 122, 40, 0.16, 0.18, ph)} fill="none" stroke={C.green} strokeWidth={2.2} />
      <text x={30} y={95} fontSize={10} fill={C.dim}>2つを重ねると…</text>
      <Caption text="わずかに違う2音の和 → 強弱がうねる = うなり" />
    </FigSvg>
  );
}

/** 屈折: 速さが変わるから曲がる */
export function Refraction() {
  const t = useT();
  const dash = -t * 30;
  return (
    <FigSvg>
      <rect x={0} y={95} width={320} height={75} fill={C.cyan} opacity={0.08} />
      <line x1={20} y1={95} x2={300} y2={95} stroke={C.dim} />
      <line x1={160} y1={30} x2={160} y2={160} stroke={C.dim} strokeDasharray="3 5" opacity={0.5} />
      <line x1={62} y1={25} x2={160} y2={95} stroke={C.gold} strokeWidth={2.5} strokeDasharray="10 6" strokeDashoffset={dash} />
      <line x1={160} y1={95} x2={212} y2={162} stroke={C.gold} strokeWidth={2.5} strokeDasharray="6 4" strokeDashoffset={dash * 0.6} />
      <text x={30} y={50} fontSize={11} fill={C.dim}>空気 (速い)</text>
      <text x={30} y={125} fontSize={11} fill={C.cyan}>水 (遅い)</text>
      <text x={218} y={140} fontSize={11} fill={C.gold}>折れ曲がる</text>
      <Caption text="遅い媒質に入ると進路が変わる = 屈折" />
    </FigSvg>
  );
}

/** ドップラー効果: 前方の波面が詰まる */
export function Doppler() {
  const t = useT();
  const T = t % 4;
  const sx = 70 + 40 * T;
  const waves = [];
  for (let k = 0; k < 8; k++) {
    const et = k * 0.5;
    if (T > et) {
      const r = 42 * (T - et);
      if (r < 150)
        waves.push(
          <circle key={k} cx={70 + 40 * et} cy={92} r={r} fill="none" stroke={C.cyan} strokeWidth={1.8} opacity={Math.max(0.15, 1 - r / 150)} />
        );
    }
  }
  return (
    <FigSvg>
      {waves}
      <circle cx={sx} cy={92} r={8} fill={C.gold} />
      <text x={sx - 15} y={75} fontSize={10} fill={C.gold}>音源→</text>
      <text x={225} y={35} fontSize={11} fill={C.cyan}>前方: 詰まる=高い音</text>
      <text x={18} y={35} fontSize={11} fill={C.dim}>後方: のびる=低い音</text>
      <Caption text="動く音源のまわりの波面。音速自体は変わらない" />
    </FigSvg>
  );
}

/** 干渉: 2つの波源のリング */
export function Interference() {
  const t = useT();
  const rings = [0, 1, 2, 3, 4];
  const base = (t * 26) % 42;
  return (
    <FigSvg>
      {rings.map((k) => (
        <g key={k}>
          <circle cx={110} cy={92} r={base + k * 42} fill="none" stroke={C.cyan} strokeWidth={1.6} opacity={0.55 - k * 0.09} />
          <circle cx={210} cy={92} r={base + k * 42} fill="none" stroke={C.gold} strokeWidth={1.6} opacity={0.55 - k * 0.09} />
        </g>
      ))}
      <circle cx={110} cy={92} r={5} fill={C.cyan} />
      <circle cx={210} cy={92} r={5} fill={C.gold} />
      <text x={98} y={78} fontSize={11} fill={C.cyan}>S₁</text>
      <text x={214} y={78} fontSize={11} fill={C.gold}>S₂</text>
      <Caption text="山と山が重なる場所は強め合い、山と谷は打ち消し合う" />
    </FigSvg>
  );
}

/** 回路: 電子の流れ */
export function Circuit() {
  const t = useT();
  const dots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <FigSvg>
      <rect x={65} y={40} width={190} height={100} rx={6} fill="none" stroke={C.dim} strokeWidth={2.2} />
      {/* 電池 (左辺) */}
      <line x1={50} y1={78} x2={80} y2={78} stroke="#0b1026" strokeWidth={10} />
      <line x1={55} y1={90} x2={75} y2={90} stroke={C.gold} strokeWidth={3.5} />
      <line x1={60} y1={100} x2={70} y2={100} stroke={C.gold} strokeWidth={3.5} />
      <text x={84} y={94} fontSize={10} fill={C.gold}>電池</text>
      {/* 抵抗 (右辺) */}
      <polyline points="255,70 247,78 263,86 247,94 263,102 255,110" fill="none" stroke={C.red} strokeWidth={2.5} />
      <text x={222} y={94} fontSize={10} fill={C.red}>抵抗</text>
      {dots.map((i) => {
        const [x, y] = rectPoint(t * 0.12 + i / dots.length, 65, 40, 255, 140);
        return <circle key={i} cx={x} cy={y} r={4} fill={C.cyan} />;
      })}
      <Caption text="電流の正体 = 導線の中を流れる電子たち" />
    </FigSvg>
  );
}

/** 電磁誘導: 磁石を動かすと電流 */
export function Induction() {
  const t = useT();
  const mx = 62 + 46 * Math.sin(t * 1.6);
  const v = Math.cos(t * 1.6);
  const needle = 38 * v;
  return (
    <FigSvg>
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={196 + i * 14} cy={86} rx={7} ry={26} fill="none" stroke={C.cyan} strokeWidth={2.2} />
      ))}
      <rect x={mx} y={74} width={58} height={24} rx={4} fill={C.red} opacity={0.85} />
      <rect x={mx} y={74} width={29} height={24} rx={4} fill={C.cyan} opacity={0.9} />
      <text x={mx + 7} y={90} fontSize={11} fill="#0b1026" fontWeight="bold">S</text>
      <text x={mx + 38} y={90} fontSize={11} fill="#0b1026" fontWeight="bold">N</text>
      {/* メーター */}
      <circle cx={160} cy={155} r={22} fill="none" stroke={C.dim} strokeWidth={2} />
      <line
        x1={160}
        y1={155}
        x2={160 + 18 * Math.sin((needle * Math.PI) / 180)}
        y2={155 - 18 * Math.cos((needle * Math.PI) / 180)}
        stroke={Math.abs(v) > 0.2 ? C.gold : C.dim}
        strokeWidth={2.5}
      />
      <text x={190} y={160} fontSize={10} fill={C.dim}>電流計</text>
      <text x={40} y={40} fontSize={11} fill={C.dim}>磁石を動かしている間だけ針が振れる</text>
      <Caption text="磁場の変化 → 電流が生まれる (電磁誘導)" />
    </FigSvg>
  );
}

/** クーロン力と電場: 電気力線 */
export function Coulomb() {
  const t = useT();
  const pulse = 0.55 + 0.35 * Math.sin(t * 2.5);
  const dirs = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <FigSvg>
      {dirs.map((d) => {
        const rad = (d * Math.PI) / 180;
        const x1 = 150 + 18 * Math.cos(rad);
        const y1 = 92 + 18 * Math.sin(rad);
        const x2 = 150 + 62 * Math.cos(rad);
        const y2 = 92 + 62 * Math.sin(rad);
        return (
          <g key={d} opacity={pulse}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth={1.8} />
            <polygon
              points={`${150 + 68 * Math.cos(rad)},${92 + 68 * Math.sin(rad)} ${150 + 58 * Math.cos(rad) - 4 * Math.sin(rad)},${92 + 58 * Math.sin(rad) + 4 * Math.cos(rad)} ${150 + 58 * Math.cos(rad) + 4 * Math.sin(rad)},${92 + 58 * Math.sin(rad) - 4 * Math.cos(rad)}`}
              fill={C.gold}
            />
          </g>
        );
      })}
      <circle cx={150} cy={92} r={15} fill={C.red} />
      <text x={145} y={97} fontSize={13} fill="#fff" fontWeight="bold">+</text>
      <circle cx={262} cy={92} r={8} fill={C.cyan} />
      <text x={258} y={97} fontSize={11} fill="#0b1026" fontWeight="bold">+</text>
      <text x={236} y={70} fontSize={10} fill={C.cyan}>置いた電荷は</text>
      <text x={236} y={82} fontSize={10} fill={C.cyan}>力を受ける</text>
      <Caption text="電場 = 「+1Cを置いたら受ける力」の地図 (電気力線)" />
    </FigSvg>
  );
}

/** コンデンサー: 電荷をためる */
export function Capacitor() {
  const t = useT();
  const p = (t % 4) / 4;
  const n = Math.min(5, Math.floor(p * 7));
  return (
    <FigSvg>
      <line x1={128} y1={45} x2={128} y2={140} stroke={C.gold} strokeWidth={5} />
      <line x1={192} y1={45} x2={192} y2={140} stroke={C.cyan} strokeWidth={5} />
      {Array.from({ length: n }).map((_, i) => (
        <g key={i}>
          <text x={112} y={62 + i * 18} fontSize={13} fill={C.gold}>+</text>
          <text x={198} y={62 + i * 18} fontSize={13} fill={C.cyan}>−</text>
        </g>
      ))}
      {n > 0 &&
        [0, 1, 2].map((i) => (
          <g key={i} opacity={Math.min(1, n / 5)}>
            <line x1={138} y1={68 + i * 28} x2={178} y2={68 + i * 28} stroke={C.green} strokeWidth={1.8} />
            <polygon points={`${184},${68 + i * 28} ${174},${63 + i * 28} ${174},${73 + i * 28}`} fill={C.green} />
          </g>
        ))}
      <text x={140} y={160} fontSize={10} fill={C.green}>電場 E</text>
      <text x={40} y={40} fontSize={11} fill={C.dim}>電池をつなぐと電荷がたまっていく</text>
      <Caption text="ためた電気量 Q は電圧に比例: Q = CV" />
    </FigSvg>
  );
}

/** 光電効果: 振動数がすべて */
export function Photoelectric() {
  const t = useT();
  const p = (t % 5) / 5;
  const firstHalf = p < 0.5;
  const q = firstHalf ? p * 2 : (p - 0.5) * 2;
  const photonX = 60 + 120 * Math.min(q * 1.6, 1);
  const photonY = 30 + 95 * Math.min(q * 1.6, 1);
  const hit = q * 1.6 >= 1;
  const eq = Math.max(0, (q - 0.625) * 2.6);
  return (
    <FigSvg>
      <rect x={40} y={128} width={240} height={16} rx={3} fill="#7a86ad" />
      <text x={125} y={158} fontSize={10} fill={C.dim}>金属板</text>
      {!hit && (
        <g transform={`translate(${photonX},${photonY}) rotate(38)`}>
          <polyline
            points={firstHalf ? "0,0 8,-6 16,6 24,-6 32,6 40,0" : "0,0 4,-6 8,6 12,-6 16,6 20,-6 24,6 28,0"}
            fill="none"
            stroke={firstHalf ? C.red : C.purple}
            strokeWidth={2.5}
          />
        </g>
      )}
      {firstHalf && hit && (
        <text x={150} y={110} fontSize={12} fill={C.red}>…何も起きない</text>
      )}
      {!firstHalf && hit && (
        <circle cx={185 + 70 * eq} cy={120 - 80 * eq} r={6} fill={C.cyan} opacity={eq > 0 ? 1 : 0} />
      )}
      <text x={38} y={30} fontSize={11} fill={firstHalf ? C.red : C.purple}>
        {firstHalf ? "赤い光(振動数小): いくら当てても出ない" : "紫の光(振動数大): 電子が飛び出す!"}
      </text>
      <Caption text="決め手は明るさではなく振動数 → 光は粒 (E = hν)" />
    </FigSvg>
  );
}

/** 半減期: 半分ずつ減る */
export function HalfLife() {
  const t = useT();
  const p = (t % 5) / 5;
  const bars = [100, 50, 25, 12.5, 6.25];
  return (
    <FigSvg>
      <line x1={45} y1={145} x2={295} y2={145} stroke={C.dim} strokeWidth={1.5} />
      {bars.map((h, i) => {
        const show = p * 6 > i;
        return (
          <g key={i} opacity={show ? 1 : 0.12}>
            <rect x={60 + i * 48} y={145 - h * 1.05} width={28} height={h * 1.05} rx={3} fill={C.green} opacity={0.8} />
            <text x={62 + i * 48} y={160} fontSize={10} fill={C.dim}>{i === 0 ? "0" : `${i}T`}</text>
            <text x={58 + i * 48} y={138 - h * 1.05} fontSize={9} fill={C.green}>{h}%</text>
          </g>
        );
      })}
      <Caption text="半減期Tごとに半分 → 1/2, 1/4, 1/8… (掛け算で減る)" />
    </FigSvg>
  );
}

/** ボーア模型: 定常波の軌道と光子 */
export function Bohr() {
  const t = useT();
  const p = (t % 4) / 4;
  const outer = p < 0.5;
  const r = outer ? 66 : 44;
  const th = t * 2.2;
  const ex = 160 + r * Math.cos(th);
  const ey = 92 + r * Math.sin(th);
  const photonP = outer ? 0 : Math.min(1, (p - 0.5) * 3);
  return (
    <FigSvg>
      <circle cx={160} cy={92} r={9} fill={C.gold} />
      {[24, 44, 66].map((rr) => (
        <circle key={rr} cx={160} cy={92} r={rr} fill="none" stroke={C.dim} strokeDasharray="3 4" opacity={0.55} />
      ))}
      <circle cx={ex} cy={ey} r={6} fill={C.cyan} />
      {photonP > 0 && photonP < 1 && (
        <g transform={`translate(${215 + 60 * photonP},${45 - 20 * photonP}) rotate(-18)`} opacity={1 - photonP * 0.6}>
          <polyline points="0,0 6,-5 12,5 18,-5 24,5 30,0" fill="none" stroke={C.purple} strokeWidth={2.5} />
        </g>
      )}
      <text x={30} y={35} fontSize={11} fill={C.dim}>電子は決まった軌道(準位)だけ</text>
      <text x={222} y={30} fontSize={10} fill={C.purple}>落ちるとき光子を放出</text>
      <Caption text="軌道が飛び飛び → 出る光の色も飛び飛び (線スペクトル)" />
    </FigSvg>
  );
}
