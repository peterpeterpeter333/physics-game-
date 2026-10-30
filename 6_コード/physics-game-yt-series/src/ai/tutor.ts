import Anthropic from "@anthropic-ai/sdk";

// AIチューター。ユーザー自身のAPIキーをブラウザに保存して直接Claude APIを呼ぶ。
// 注意: この方式は「自分専用ツール」向け。一般公開時はキーを配らず、
// サーバー側プロキシ経由に切り替えること。

export type ChatTurn = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `あなたは高校物理の家庭教師です。学習アプリ「Physics Quest」の中で、生徒が問題演習やレッスン中に抱いた疑問に答えます。

方針:
- 暗記ではなく理解を最優先する。公式は必ず「なぜそうなるか」に触れる。
- 答えを丸ごと教える前に、考え方の筋道を示す。ただし生徒が答えを求めたら出し惜しみしない。
- 高校生に分かる言葉で、短く区切って説明する。1回の返答は長くしすぎない。
- 数式は $...$ で囲んだLaTeXで書く(例: $v = v_0 + at$)。
- 生徒を励ます。分からないことは恥ずかしいことではないと伝わる話し方をする。`;

export async function streamTutorReply(opts: {
  apiKey: string;
  history: ChatTurn[];
  context: string;
  onText: (delta: string) => void;
}): Promise<{ ok: boolean; error?: string }> {
  const client = new Anthropic({
    apiKey: opts.apiKey,
    dangerouslyAllowBrowser: true,
  });

  const system = opts.context
    ? `${SYSTEM_PROMPT}\n\n# いま生徒が見ている画面\n${opts.context}`
    : SYSTEM_PROMPT;

  try {
    const stream = client.beta.messages.stream({
      model: "claude-opus-5",
      max_tokens: 2048,
      system,
      messages: opts.history,
      betas: ["server-side-fallback-2026-07-01"],
      // 安全分類器による拒否時は推奨フォールバックモデルで自動再実行
      ...({ fallbacks: "default" } as Record<string, unknown>),
    });

    stream.on("text", (delta) => opts.onText(delta));
    const final = await stream.finalMessage();

    if (final.stop_reason === "refusal") {
      return { ok: false, error: "この質問には答えられませんでした。表現を変えて試してください。" };
    }
    return { ok: true };
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return { ok: false, error: "APIキーが無効です。設定画面で確認してください。" };
    }
    if (err instanceof Anthropic.RateLimitError) {
      return { ok: false, error: "リクエストが多すぎます。少し待ってから再試行してください。" };
    }
    if (err instanceof Anthropic.APIError) {
      return { ok: false, error: `APIエラー (${err.status}): ${err.message}` };
    }
    return { ok: false, error: "通信に失敗しました。ネットワークを確認してください。" };
  }
}
