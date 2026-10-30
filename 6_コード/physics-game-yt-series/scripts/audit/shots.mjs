// 修正した図解をギャラリー(#figs=...)で撮影し、レッスンの長い数式の縮小も確認する
import { chromium } from "playwright-core";
const OUT = process.env.OUT;
const ids = (process.env.IDS || "dot-projection,pendulum-force,torque-door,cross-product,rc-charge,predict-machine,decay-slope,gauss-sphere,lorentz-circle,vector-components,pythagoras-vec,integral-sum").split(",");
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 2 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 200)));
await page.goto(`http://localhost:8000/#figs=${ids.join(",")}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: OUT + "/figs-fixed.png", fullPage: true });
await page.waitForTimeout(2500);
await page.screenshot({ path: OUT + "/figs-fixed-2.png", fullPage: true });

// レッスンの数式縮小: 進捗を全クリア状態にしてから 大学編 のレッスンを開く
if (process.env.PROGRESS) {
  await page.goto("http://localhost:8000/", { waitUntil: "networkidle" });
  await page.evaluate((p) => { for (const [k, v] of Object.entries(JSON.parse(p))) localStorage.setItem(k, v); }, process.env.PROGRESS);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const targets = [
    { chapter: "数学の武器庫", stage: "微分の道具箱", step: 2, name: "formula-um-rules" },
    { chapter: "数学の武器庫", stage: "ベクトルの式の読み方", step: 2, name: "formula-um-vector" },
    { chapter: "数学の武器庫", stage: "内積", step: 2, name: "lesson-um-dot-step2" },
    { chapter: "力学【大学編】", stage: "振り子と振動", step: 1, name: "lesson-uc-shm-step1" },
  ];
  for (const tg of targets) {
    await page.goto("http://localhost:8000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const blocks = page.locator(".chapter-block");
    const n = await blocks.count();
    for (let i = 0; i < n; i++) {
      const b = blocks.nth(i);
      const title = (await b.locator(".chapter-toggle-title").innerText()).trim();
      if (!title.includes(tg.chapter)) continue;
      if ((await b.locator(".stage-path").count()) === 0) { await b.locator("button.chapter-toggle").click(); await page.waitForTimeout(250); }
      const node = b.locator(".stage-node", { hasText: tg.stage }).first();
      console.log("open", tg.stage, "nodes:", await b.locator(".stage-node").count(), "match:", await node.count());
      await node.locator("button", { hasText: "レッスン" }).click();
      await page.waitForSelector(".screen.lesson");
      for (let s = 0; s < 20; s++) {
        const nb = page.locator(".lesson-controls button.btn-primary");
        if ((await nb.count()) === 0) break;
        await nb.click();
        await page.waitForTimeout(250);
      }
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/${tg.name}.png`, fullPage: true });
      console.log("shot", tg.name);
      break;
    }
  }
}
console.log(JSON.stringify({ errors }));
await browser.close();
