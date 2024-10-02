const puppeteer = require("puppeteer");
const cron = require("node-cron");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  // 毎日15:40に実行する設定
  cron.schedule("08 16 * * *", async () => {
    console.log("スクリプト実行中...");

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // 出席画面のサイトにアクセスし、完全に読み込まれるまで待つ
    await page.goto("https://btnmaker.me/", {
      waitUntil: "load", // ページが完全に読み込まれるのを待つ
    });

    // ボタンが表示されるのを待つ
    await page.waitForSelector("div.tweetButton button.c-btn.floating", {
      visible: true,
    });

    // ボタンをクリック
    await page.waitForSelector("div.tweetButton button.c-btn.floating", {
      visible: true,
    });
    await page.evaluate(() => {
      const button = document.querySelector(
        "div.tweetButton button.c-btn.floating"
      );
      if (button) {
        button.scrollIntoView(); // ボタンをスクロールして表示させる
        button.click(); // ボタンをクリック
      }
    });

    console.log("ボタンが押されました！");

    // ユーザーがEnterキーを押すまで待つ
    rl.question("Enterキーを押すとブラウザが閉じます...\n", async () => {
      await browser.close();
      rl.close();
    });
  });
})();
