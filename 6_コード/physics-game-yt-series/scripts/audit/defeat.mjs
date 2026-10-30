// 敗北フロー (3問連続不正解) と ヒント / 中断ダイアログ の確認。play.mjs の補完。
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 200)));
page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 200)); });
page.on("dialog", (d) => d.accept());
await page.goto("http://localhost:8000/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);

const block = page.locator(".chapter-block").nth(0);
if ((await block.locator(".stage-path").count()) === 0) {
  await page.locator("button.chapter-toggle").nth(0).click();
  await page.waitForTimeout(250);
}
const node0 = block.locator(".stage-node").nth(0);
// 初回はレッスン未読なのでバトルボタンが無効。先にレッスンを読む
await node0.locator("button", { hasText: "レッスン" }).click();
await page.waitForTimeout(300);
for (let i = 0; i < 20; i++) {
  const b = page.locator(".lesson-controls button.btn-primary");
  if ((await b.count()) === 0) break;
  await b.click();
  await page.waitForTimeout(120);
}
// レッスン末尾の「〜に挑む!」ボタンでバトルへ
await page.locator(".lesson-controls button.btn-battle").click();
await page.waitForTimeout(300);
const out = [];
for (let i = 0; i < 3; i++) {
  const card = page.locator(".question-card");
  const ans = Number(await card.getAttribute("data-answer-index"));
  await card.locator(".choice").nth((ans + 1) % 4).click();
  await page.waitForTimeout(200);
  const head = (await card.locator(".feedback-head").innerText()).trim();
  const wrongMarked = await card.locator(".choice-wrong").count();
  const correctMarked = await card.locator(".choice-correct").count();
  const hp = await page.locator(".hp-bar, .player-hp, [class*=hp]").first().innerText().catch(() => "?");
  out.push({ q: i + 1, head, wrongMarked, correctMarked, hp });
  await card.locator(".feedback button.btn-primary").click();
  await page.waitForTimeout(250);
}
const defeated = (await page.locator(".defeat-title").count()) > 0;
const resultText = defeated ? (await page.locator(".result-card").innerText()).slice(0, 200) : (await page.locator("body").innerText()).slice(0, 300);
await page.screenshot({ path: process.env.OUT + "/defeat.png" });
console.log(JSON.stringify({ out, defeated, resultText, errors }, null, 2));
await browser.close();
