import { defineFeature, loadFeature } from "jest-cucumber";
import puppeteer from "puppeteer";

const feature = loadFeature("./e2e/features/get-products.feature");

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test("A user enters the webpage", ({ given, when, then }) => {
    given("A user on home page", async () => {
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toMatch("Welcome");
      expect(text).toContain("AMONG US™ CryptoBro");
      const button = await page.evaluate(() => document.getElementsByName('Button'));
      console.log(button)

      //await expect(page).toClick('button', { text: 'Start shopping' })
    });

    when("I go to shop section", async () => {
    });

    then("Products from the DB are displayed", async () => {});
  });

  afterAll(async () => {
    browser.close();
  });
});

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
