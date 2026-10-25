import { useState, useSyncExternalStore } from "react";
import { loadApiKey, saveApiKey } from "../game/state";
import { SHOW_AI_CHAT } from "../config";
import { hasYouTubeConsent, setYouTubeConsent, subscribeYouTubeConsent } from "../game/youtube-consent";

export function SettingsView({ onResetProgress }: { onResetProgress: () => void }) {
  const [key, setKey] = useState(loadApiKey());
  const [saved, setSaved] = useState(false);
  const youtubeAllowed = useSyncExternalStore(subscribeYouTubeConsent, hasYouTubeConsent, () => false);

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
        <h2>YouTube動画の通信</h2>
        <p className="screen-note">
          YouTube動画を読み込むと、再生・広告表示などのため、IPアドレス・端末情報・視聴操作の情報がGoogle／YouTubeへ送信されます。
          初回の動画画面で同意した選択をこの端末に保存し、次回からの読み込みに使います。再生には通信が必要で、広告や通信料金が発生する場合があります。
        </p>
        <p className="screen-note" role="status">現在：{youtubeAllowed ? "YouTube動画の読み込みに同意済み" : "YouTube動画の読み込みは未同意"}</p>
        <button className="btn btn-ghost" disabled={!youtubeAllowed} onClick={() => setYouTubeConsent(false)}>
          YouTube動画の同意を取り消す
        </button>
        <p className="screen-note small">
          取り消すと読み込み中のプレーヤーも閉じ、次の読み込みには動画画面での同意が必要です。
          すでに送信された情報は取り消せません。端末の保存機能を利用できない場合、選択の変更は今回の起動中だけ反映されます。
          起動し直すと再確認が必要になったり、以前保存した選択に戻ったりする場合があります。
          {" "}<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Googleのプライバシーポリシー</a>
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
          Physics Quest は「暗記ではなく理解」を合言葉にした高校・大学物理の学習RPGです。
          すべての公式に導出レッスンが付いています。端末内にある教材はオフラインでも利用できますが、YouTube動画・AI先生・更新確認には通信が必要です。
        </p>
      </section>
    </div>
  );
}
