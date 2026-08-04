import { useState } from "react";
import { loadApiKey, saveApiKey } from "../game/state";

export function SettingsView({ onResetProgress }: { onResetProgress: () => void }) {
  const [key, setKey] = useState(loadApiKey());
  const [saved, setSaved] = useState(false);

  return (
    <div className="screen settings">
      <header className="screen-header">
        <div>
          <div className="screen-header-tag">⚙️ 設定</div>
          <h1>設定</h1>
        </div>
      </header>

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

      <section className="settings-section">
        <h2>🗑️ データ</h2>
        <button className="btn btn-danger" onClick={onResetProgress}>
          進行状況をリセット
        </button>
      </section>

      <section className="settings-section">
        <h2>ℹ️ このアプリについて</h2>
        <p className="screen-note">
          Physics Quest は「暗記ではなく理解」を合言葉にした高校物理の学習RPGです。
          すべての公式に導出レッスンが付いています。オフラインでも動作します(AI先生を除く)。
        </p>
      </section>
    </div>
  );
}
