// ネイティブ機能(iOS/Android)。Webで開いたときは何もしない。
// Capacitor の各プラグインは Web でも安全に呼べるが、明示的に分岐しておく。

import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";

export const isNative = Capacitor.isNativePlatform();

/** アプリ起動時の初期化(ステータスバーの色など) */
export async function initNative() {
  if (!isNative) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#0b1026" });
    }
  } catch {
    /* 端末によっては未対応。無視してよい */
  }
}

/** Androidの戻るボタン。呼び出し側で「戻る先」を返す */
export function onBackButton(handler: () => boolean) {
  if (!isNative) return () => {};
  const p = App.addListener("backButton", () => {
    // handler が true を返したらアプリ内で戻る。false なら何もしない。
    handler();
  });
  return () => {
    p.then((h) => h.remove());
  };
}

/** 正解時の軽い振動 */
export function hapticSuccess() {
  if (!isNative) return;
  Haptics.notification({ type: NotificationType.Success }).catch(() => {});
}

/** 不正解時の振動 */
export function hapticError() {
  if (!isNative) return;
  Haptics.notification({ type: NotificationType.Error }).catch(() => {});
}

/** ボタンを押した感触 */
export function hapticTap() {
  if (!isNative) return;
  Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
}
