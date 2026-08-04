import type { Chapter } from "../types";
import { mechanics } from "./mechanics";
import { thermo } from "./thermo";
import { waves } from "./waves";
import { electromagnetism } from "./electromagnetism";
import { atomic } from "./atomic";

// 高校物理の5分野。分野間は独立(学校の進度に合わせてどこからでも始められる)。
// 分野の中はステージ順にクリアで解放。
export const chapters: Chapter[] = [mechanics, thermo, waves, electromagnetism, atomic];
