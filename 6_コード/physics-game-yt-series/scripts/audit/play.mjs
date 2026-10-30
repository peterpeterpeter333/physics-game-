import { chromium } from "playwright-core";
import fs from "fs";
const OUT = process.env.OUT;
const log = (m) => { fs.appendFileSync(OUT + "/log.txt", m + "\n"); };
const report = { stages: [], issues: [], consoleErrors: [], pageErrors: [] };
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 1 });
page.on("console", (m) => { if (m.type() === "error") report.consoleErrors.push(m.text().slice(0, 200)); });
page.on("pageerror", (e) => report.pageErrors.push(e.message.slice(0, 300)));
page.on("dialog", (d) => d.accept());
await page.goto("http://localhost:8000/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const textIssues = (ctx, txt) => {
  const bad = [];
  if (/\*\*/.test(txt)) bad.push("raw ** markdown");
  if (/\$[^$]*\$/.test(txt) || /\$/.test(txt)) bad.push("raw $ math delimiter");
  if (/\\(frac|vec|dfrac|int|oint|cdot|times|sqrt)/.test(txt)) bad.push("raw TeX command");
  if (/undefined|NaN|\[object/.test(txt)) bad.push("undefined/NaN");
  if (/、、|。。|（（|））/.test(txt)) bad.push("doubled punctuation");
  const open = (txt.match(/「/g) || []).length, close = (txt.match(/」/g) || []).length;
  if (open !== close) bad.push(`unbalanced 「」 (${open}/${close})`);
  for (const b of bad) report.issues.push({ where: ctx, issue: b });
  return bad.length;
};

const chapterToggles = await page.locator("button.chapter-toggle").all();
const nChapters = chapterToggles.length;
log(`chapters: ${nChapters}`);
let stageCounter = 0;
for (let ci = 0; ci < nChapters; ci++) {
  // 章を開く (開いていなければ)
  const toggle = page.locator("button.chapter-toggle").nth(ci);
  const chapterTitle = (await toggle.locator(".chapter-toggle-title").innerText()).trim();
  const nStages = await page.locator(".chapter-block").nth(ci).locator(".stage-node").count();
  const ensureOpen = async () => {
    const opened = await page.locator(".chapter-block").nth(ci).locator(".stage-path").count();
    if (!opened) { await page.locator("button.chapter-toggle").nth(ci).click(); await page.waitForTimeout(250); }
  };
  await ensureOpen();
  const total = await page.locator(".chapter-block").nth(ci).locator(".stage-node").count();
  log(`== ${chapterTitle}: ${total} stages`);
  for (let si = 0; si < total; si++) {
    await ensureOpen();
    const node = page.locator(".chapter-block").nth(ci).locator(".stage-node").nth(si);
    const stageTitle = (await node.locator(".stage-title").innerText()).trim();
    const locked = (await node.getAttribute("class")).includes("locked");
    const rec = { chapter: chapterTitle, stage: stageTitle, steps: 0, stepsWithFigure: 0, problems: 0, katexErrors: 0, textIssues: 0, cleared: false };
    if (locked) { rec.error = "LOCKED (previous not cleared)"; report.stages.push(rec); log(`  ${stageTitle}: LOCKED`); continue; }
    // ---- レッスン ----
    await node.locator("button", { hasText: "レッスン" }).click();
    await page.waitForTimeout(300);
    const stageId = await page.locator(".screen.lesson").getAttribute("data-stage-id");
    rec.id = stageId;
    textIssues(`${stageId}/intro`, await page.locator(".lesson-intro").innerText());
    let guard = 0;
    while (guard++ < 20) {
      const btn = page.locator(".lesson-controls button.btn-primary");
      if ((await btn.count()) === 0) break;
      await btn.click();
      await page.waitForTimeout(220);
    }
    const steps = await page.locator(".lesson-step").all();
    rec.steps = steps.length;
    for (let k = 0; k < steps.length; k++) {
      const st = steps[k];
      const hasFig = (await st.locator(".fig-wrap svg").count()) > 0;
      if (hasFig) rec.stepsWithFigure++;
      else report.issues.push({ where: `${stageId}/step${k + 1}`, issue: "no figure" });
      const t = await st.innerText();
      rec.textIssues += textIssues(`${stageId}/step${k + 1}`, t);
      rec.katexErrors += await st.locator(".katex-error").count();
    }
    if ((await page.locator(".lesson-outro").count()) === 0) report.issues.push({ where: stageId, issue: "outro not shown" });
    else textIssues(`${stageId}/outro`, await page.locator(".lesson-outro").innerText());
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/lesson-${String(stageCounter).padStart(2, "0")}-${stageId}.png`, fullPage: true });
    // ---- バトル ----
    const battleBtn = page.locator(".lesson-controls button.btn-battle");
    if ((await battleBtn.count()) === 0) { rec.error = "no battle button"; report.stages.push(rec); continue; }
    await battleBtn.click();
    await page.waitForTimeout(300);
    const seen = new Set();
    let bguard = 0, victory = false;
    while (bguard++ < 40) {
      const card = page.locator(".question-card");
      if ((await card.count()) === 0) break;
      const pid = await card.getAttribute("data-problem-id");
      const ans = Number(await card.getAttribute("data-answer-index"));
      if (!seen.has(pid)) {
        seen.add(pid);
        const qt = await card.locator(".question-text").innerText();
        textIssues(`${stageId}/${pid}/q`, qt);
        const choices = await card.locator(".choice").count();
        if (choices !== 4) report.issues.push({ where: `${stageId}/${pid}`, issue: `choices=${choices}` });
        rec.katexErrors += await card.locator(".katex-error").count();
        // 最初の問題だけヒントを開いてみる
        if (seen.size === 1) {
          await card.locator("button", { hasText: "ヒント" }).click();
          await page.waitForTimeout(150);
          if ((await card.locator(".hint-box").count()) === 0) report.issues.push({ where: `${stageId}/${pid}`, issue: "hint did not open" });
          else textIssues(`${stageId}/${pid}/hint`, await card.locator(".hint-box").innerText());
        }
      }
      await card.locator(".choice").nth(ans).click();
      await page.waitForTimeout(200);
      const head = await card.locator(".feedback-head").innerText().catch(() => "");
      if (!head.includes("正解")) report.issues.push({ where: `${stageId}/${pid}`, issue: `expected correct, got: ${head}` });
      const expl = await card.locator(".explanation").innerText().catch(() => "");
      if (!seen.has(pid + "/e")) { seen.add(pid + "/e"); textIssues(`${stageId}/${pid}/explanation`, expl); rec.katexErrors += await card.locator(".explanation .katex-error").count(); }
      await card.locator(".feedback button.btn-primary").click();
      await page.waitForTimeout(250);
      if ((await page.locator(".victory-title").count()) > 0) { victory = true; break; }
    }
    rec.problems = [...seen].filter((x) => !x.endsWith("/e")).length;
    rec.cleared = victory;
    if (!victory) report.issues.push({ where: stageId, issue: "battle did not reach victory" });
    else { await page.locator(".result-card button").click(); await page.waitForTimeout(300); }
    report.stages.push(rec);
    log(`  ${stageTitle}: steps=${rec.steps} figs=${rec.stepsWithFigure} problems=${rec.problems} katexErr=${rec.katexErrors} textIssues=${rec.textIssues} ${victory ? "CLEARED" : "FAILED"}`);
    stageCounter++;
  }
}

// ---- 敗北フロー / 時間切れ / 不正解のテスト (1ステージ目を再挑戦) ----
try {
  await page.locator("button.chapter-toggle").nth(0).click().catch(() => {});
  await page.waitForTimeout(200);
  const node0 = page.locator(".chapter-block").nth(0).locator(".stage-node").nth(0);
  await node0.locator("button.btn-primary", { hasText: "バトル" }).click();
  await page.waitForTimeout(300);
  for (let i = 0; i < 3; i++) {
    const card = page.locator(".question-card");
    const ans = Number(await card.getAttribute("data-answer-index"));
    await card.locator(".choice").nth((ans + 1) % 4).click();
    await page.waitForTimeout(200);
    const head = await card.locator(".feedback-head").innerText();
    if (!head.includes("おしい")) report.issues.push({ where: "defeat-test", issue: `wrong answer feedback: ${head}` });
    const wrongMarked = await card.locator(".choice-wrong").count();
    const correctMarked = await card.locator(".choice-correct").count();
    if (wrongMarked !== 1 || correctMarked !== 1) report.issues.push({ where: "defeat-test", issue: `marking wrong=${wrongMarked} correct=${correctMarked}` });
    await card.locator(".feedback button.btn-primary").click();
    await page.waitForTimeout(250);
  }
  const defeated = (await page.locator(".defeat-title").count()) > 0;
  if (!defeated) report.issues.push({ where: "defeat-test", issue: "defeat screen not shown after 3 wrong" });
  else { log("defeat flow OK"); await page.locator(".result-card button").click(); }
} catch (e) { report.issues.push({ where: "defeat-test", issue: String(e).slice(0, 200) }); }

// ---- 公式集 / 復習 / 設定 ----
try {
  await page.locator("nav.bottom-nav button", { hasText: "公式集" }).click();
  await page.waitForTimeout(400);
  const fcount = await page.locator(".katex").count();
  const ferr = await page.locator(".katex-error").count();
  log(`formula book: katex nodes=${fcount} errors=${ferr}`);
  if (ferr) report.issues.push({ where: "formula-book", issue: `katex errors ${ferr}` });
  await page.screenshot({ path: `${OUT}/formulas.png`, fullPage: true });
  await page.locator("nav.bottom-nav button", { hasText: "復習" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/review.png`, fullPage: true });
  await page.locator("nav.bottom-nav button", { hasText: "設定" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/settings.png`, fullPage: true });
  await page.locator("nav.bottom-nav button", { hasText: "クエスト" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/map-final.png`, fullPage: true });
} catch (e) { report.issues.push({ where: "nav", issue: String(e).slice(0, 200) }); }

fs.writeFileSync(OUT + "/report.json", JSON.stringify(report, null, 2));
log("DONE");
await browser.close();
