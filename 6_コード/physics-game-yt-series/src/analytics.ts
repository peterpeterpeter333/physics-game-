// 利用状況の計測。
//
// 方針:
// - 個人を特定する情報は一切送らない (Cookieなし・IDなし・入力内容も送らない)
// - 送るのは「どのステージで何が起きたか」という匿名の行動イベントだけ
// - 未設定(siteId が空)のときは完全に無効。通信も一切しない
//
// 設定方法は README の「利用状況の計測」を参照。

type Provider = "umami" | "goatcounter" | "none";

// ▼ ここを書き換えるだけで有効になる ▼
const PROVIDER: Provider = "none";
const SITE_ID = ""; // umami: Website ID / goatcounter: サブドメイン名
// ▲▲▲

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
    goatcounter?: { count: (opts: { path: string; title?: string; event: boolean }) => void };
  }
}

let ready = false;

/** 計測スクリプトを読み込む (アプリ起動時に1回だけ呼ぶ) */
export function initAnalytics() {
  if (PROVIDER === "none" || !SITE_ID || import.meta.env.DEV) return;

  const s = document.createElement("script");
  s.defer = true;

  if (PROVIDER === "umami") {
    s.src = "https://cloud.umami.is/script.js";
    s.setAttribute("data-website-id", SITE_ID);
  } else {
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", `https://${SITE_ID}.goatcounter.com/count`);
  }

  s.onload = () => {
    ready = true;
  };
  document.head.appendChild(s);
}

/** 行動イベントを送る。失敗してもアプリの動作には一切影響させない */
export function track(event: string, data?: Record<string, string | number>) {
  if (PROVIDER === "none" || !ready) return;
  try {
    if (PROVIDER === "umami") {
      window.umami?.track(event, data);
    } else {
      // GoatCounter は path をイベント名として扱う
      const suffix = data?.stage ? `/${data.stage}` : "";
      window.goatcounter?.count({ path: `${event}${suffix}`, event: true });
    }
  } catch {
    /* 計測の失敗でユーザー体験を壊さない */
  }
}

// ---- アプリ内で使うイベント定義 (名前をここに集約して表記ゆれを防ぐ) ----

export const analytics = {
  lessonStart: (stage: string) => track("lesson-start", { stage }),
  lessonComplete: (stage: string) => track("lesson-complete", { stage }),
  battleStart: (stage: string) => track("battle-start", { stage }),
  battleVictory: (stage: string) => track("battle-victory", { stage }),
  battleDefeat: (stage: string) => track("battle-defeat", { stage }),
  chatOpen: () => track("chat-open"),
  formulaBookOpen: () => track("formulas-open"),
  reviewOpen: () => track("review-open"),
};
