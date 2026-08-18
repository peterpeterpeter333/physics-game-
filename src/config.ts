// 機能フラグ。ビルド先によって出し分ける。

import { Capacitor } from "@capacitor/core";

/**
 * AI先生(Claudeチャット)を表示するか。
 *
 * ストア審査では「利用者が自分でAPIキーを用意しないと動かない機能」が
 * 審査員に検証できず、リジェクト理由になり得る(App Store ガイドライン 2.1)。
 * そのため**ネイティブアプリ版では既定でオフ**にし、Web版でのみ有効にする。
 *
 * ネイティブでもAI先生を出したくなったら、
 * サーバー側プロキシ(キーをサーバーに置く)を用意してから true にすること。
 */
export const SHOW_AI_CHAT = !Capacitor.isNativePlatform();

/** ストア表示用のアプリ名 */
export const APP_NAME = "Physics Quest";
