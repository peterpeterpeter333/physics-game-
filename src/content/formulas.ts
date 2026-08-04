import type { Formula } from "../types";

export const formulas: Formula[] = [
  {
    id: "f-velocity",
    name: "速さの定義",
    tex: "v = \\dfrac{x}{t}",
    meaning: "速さ =「1秒あたりに進む距離」。距離÷時間は 1秒あたりに直す操作。",
    stageId: "m1-velocity",
  },
  {
    id: "f-distance",
    name: "等速直線運動の距離",
    tex: "x = vt",
    meaning: "1秒あたり v 進むなら、t 秒でその t 倍進む。",
    stageId: "m1-velocity",
  },
  {
    id: "f-acceleration",
    name: "加速度の定義",
    tex: "a = \\dfrac{v - v_0}{t}",
    meaning: "加速度 =「1秒あたりの速度の変化」。(あと − はじめ) ÷ 時間。",
    stageId: "m1-acceleration",
  },
  {
    id: "f-ua-1",
    name: "等加速度運動 第1式",
    tex: "v = v_0 + at",
    meaning: "加速度の定義を並べ替えただけ。はじめの速度に毎秒 a を t 秒ぶん積み増す。",
    stageId: "m1-uniform-accel",
  },
  {
    id: "f-ua-2",
    name: "等加速度運動 第2式",
    tex: "x = v_0 t + \\tfrac{1}{2}at^2",
    meaning: "v-tグラフの下の面積。長方形 v₀t + 三角形 ½at²。½は三角形の面積の½。",
    stageId: "m1-uniform-accel",
  },
  {
    id: "f-ua-3",
    name: "等加速度運動 第3式",
    tex: "v^2 - v_0^2 = 2ax",
    meaning: "第1式と第2式から t を消去した式。時間が与えられない問題用。",
    stageId: "m1-uniform-accel",
  },
];
