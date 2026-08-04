import { useEffect, useRef, useState } from "react";
import { loadApiKey } from "../game/state";
import { streamTutorReply, type ChatTurn } from "../ai/tutor";
import { MathText } from "./MathText";

export function AIChat({ context, onClose }: { context: string; onClose: () => void }) {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const apiKey = loadApiKey();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns, streamingText]);

  async function send() {
    const q = input.trim();
    if (!q || streamingText !== null) return;
    setError(null);
    setInput("");
    const history: ChatTurn[] = [...turns, { role: "user", content: q }];
    setTurns(history);
    setStreamingText("");

    let acc = "";
    const result = await streamTutorReply({
      apiKey,
      history,
      context,
      onText: (delta) => {
        acc += delta;
        setStreamingText(acc);
      },
    });

    setStreamingText(null);
    if (result.ok) {
      setTurns([...history, { role: "assistant", content: acc }]);
    } else {
      setTurns(turns); // 失敗した質問は入力欄に戻す
      setInput(q);
      setError(result.error ?? "エラーが発生しました");
    }
  }

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-drawer" onClick={(e) => e.stopPropagation()}>
        <header className="chat-header">
          <div>
            <div className="chat-title">🤖 AI先生</div>
            <div className="chat-sub">わからないことは何でも聞こう</div>
          </div>
          <button className="btn-back" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="chat-messages" ref={scrollRef}>
          {!apiKey && (
            <div className="chat-notice">
              AI先生を使うには、設定画面でAnthropic APIキーを登録してください。
            </div>
          )}
          {apiKey && turns.length === 0 && streamingText === null && (
            <div className="chat-notice">
              例:「なぜ x = v₀t + ½at² に ½ が付くの?」「この問題のヒントだけちょうだい」
            </div>
          )}
          {turns.map((t, i) => (
            <div key={i} className={`chat-bubble ${t.role}`}>
              <MathText text={t.content} />
            </div>
          ))}
          {streamingText !== null && (
            <div className="chat-bubble assistant">
              {streamingText === "" ? (
                <span className="thinking-dots">考え中…</span>
              ) : (
                <MathText text={streamingText} />
              )}
            </div>
          )}
          {error && <div className="chat-error">⚠️ {error}</div>}
        </div>

        <div className="chat-input-row">
          <input
            className="input"
            value={input}
            placeholder={apiKey ? "質問を入力…" : "APIキー未設定"}
            disabled={!apiKey || streamingText !== null}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) send();
            }}
          />
          <button
            className="btn btn-primary"
            disabled={!apiKey || streamingText !== null || !input.trim()}
            onClick={send}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
