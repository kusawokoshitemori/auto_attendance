require("dotenv").config();
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  // 毎日決まった時間に実行する設定
  cron.schedule("42 15 * * *", async () => {
    console.log("スクリプト実行中...");

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // 出席画面のサイトにアクセスし、完全に読み込まれるまで待つ(個人情報漏洩の為URLをenvに)
    await page.goto(process.env.TARGET_URL, {
      waitUntil: "load", // ページが完全に読み込まれるのを待つ
    });

    // 特定のリンクをクリック
    await page.waitForSelector(`a[href="${process.env.CLICK_URL}"]`); // バックティックを使用
    await Promise.all([
      page.click(`a[href="${process.env.CLICK_URL}"]`),
      page.waitForNavigation({ waitUntil: "networkidle2" }), // ページの遷移を待機
    ]);

    // 五秒待つ
    await page.waitForTimeout(5000);
    // キーボードでメールアドレスを入力
    await page.keyboard.type("me-ruadoresu");

    // // ボタンが表示されるのを待つ
    // await page.waitForSelector("div.tweetButton button.c-btn.floating", {
    //   visible: true,
    // });

    // // ボタンをクリック
    // await page.waitForSelector("div.tweetButton button.c-btn.floating", {
    //   visible: true,
    // });
    // await page.evaluate(() => {
    //   const button = document.querySelector(
    //     "div.tweetButton button.c-btn.floating"
    //   );
    //   if (button) {
    //     button.scrollIntoView(); // ボタンをスクロールして表示させる
    //     button.click(); // ボタンをクリック
    //   }
    // });

    // console.log("ボタンが押されました！");

    // ユーザーがEnterキーを押すまで待つ
    rl.question("Enterキーを押すとブラウザが閉じます...\n", async () => {
      await browser.close();
      rl.close();
    });
  });
})();
