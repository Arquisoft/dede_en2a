import { defineFeature, loadFeature } from "jest-cucumber";
import puppeteer from "puppeteer";

const feature = loadFeature("./e2e/features/get-reviews.feature");

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    await page
      .goto("http://localhost:3000/shop", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test("A user enters a product info and sees the reviews", ({
    given,
    when,
    then,
  }) => {
    given("A user on shop", async () => {
      expect(page.url()).toContain("/shop");
    });

    when("I enter on a product page", async () => {
      await page.goto("http://localhost:3000/product/1");
      expect(page.url()).toContain("/product/1");
      await delay(1000);
    });

    then("Info and reviews of the product are requested and displayed", async () => {
      const text = await page.evaluate(() => document.body.textContent);
      page.on("request", (interceptedRequest) => {
        if (interceptedRequest.url().includes("reviews"))
          expect(interceptedRequest.url()).toBe(
            "http://localhost:5000/reviews/listByCode/1"
          );
      });
      expect(text).toMatch("Super SUS T-Shirt");
      expect(text).toMatch("Do you wanna show your friends that you are THE GREATEST IMPOSTER? Then this shirt is for you!");
      expect(text).toMatch("User opinions about this product!");
    });
  });
});

afterAll(async () => {
  browser.close();
});

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
