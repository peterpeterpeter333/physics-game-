import { useState } from "react";
import { loadApiKey, saveApiKey } from "../game/state";
import { SHOW_AI_CHAT } from "../config";
import { DEFAULT_REPORT_FORM_URL, reportFormUrl } from "../game/report-link";

export function SettingsView({ onResetProgress }: { onResetProgress: () => void }) {
  const [key, setKey] = useState(loadApiKey());
  const [saved, setSaved] = useState(false);
  const reportUrl = reportFormUrl(import.meta.env.VITE_REPORT_FORM_URL || DEFAULT_REPORT_FORM_URL);

  return (
    <div className="screen settings">
      <header className="screen-header">
        <div>
          <div className="screen-header-tag">⚙️ 設定</div>
          <h1>設定</h1>
        </div>
      </header>

      {SHOW_AI_CHAT && (
      <section className="settings-section">
        <h2>🤖 AI先生 (Claude API)</h2>
        <p className="screen-note">
          自分のAnthropic APIキーを設定すると、問題演習中にいつでもAI先生に質問できます。
          キーは<b>この端末のブラウザ内にのみ</b>保存され、外部には送信されません(API呼び出し時にAnthropicへ送られるのみ)。
          利用量に応じてAPIの従量課金が発生します。
        </p>
        <input
          className="input"
          type="password"
          placeholder="sk-ant-..."
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setSaved(false);
          }}
        />
        <div className="settings-row">
          <button
            className="btn btn-primary"
            onClick={() => {
              saveApiKey(key.trim());
              setSaved(true);
            }}
          >
            保存
          </button>
          {saved && <span className="saved-note pop-in">✅ 保存しました</span>}
        </div>
        <p className="screen-note small">
          APIキーは{" "}
          <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer">
            console.anthropic.com
          </a>{" "}
          で発行できます。共有端末では設定しないでください。
        </p>
      </section>
      )}

      <section className="settings-section">
        <h2>📝 誤り・不具合の報告</h2>
        <p className="screen-note">説明の誤り、読み間違い、動画の不具合をお知らせください。報告には外部のGoogleフォームを使います。</p>
        {reportUrl ? <a className="btn btn-ghost" href={reportUrl} target="_blank" rel="noopener noreferrer">報告フォームを開く ↗</a>
          : <p className="screen-note small">報告フォームは準備中です。</p>}
      </section>

      <section className="settings-section">
        <h2>🗑️ データ</h2>
        <button className="btn btn-danger" onClick={onResetProgress}>
          進行状況をリセット
        </button>
      </section>

      <section className="settings-section">
        <h2>ℹ️ このアプリについて</h2>
        <p className="screen-note">
          Physics Quest は「暗記ではなく理解」を合言葉にした高校・大学物理の学習RPGです。
          すべての公式に導出レッスンが付いています。オンライン配信の動画、AI先生、報告フォームには通信が必要です。
        </p>
      </section>
    </div>
  );
}
