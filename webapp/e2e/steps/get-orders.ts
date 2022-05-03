import { defineFeature, loadFeature } from "jest-cucumber";
import puppeteer from "puppeteer";

const feature = loadFeature("./e2e/features/get-orders.feature");

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    await page
      .goto("http://localhost:3000/dashboard", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const headers = request.headers();
      headers["token"] =
        "aHR0cHM6Ly9hbHZhbWlnZS5zb2xpZGNvbW11bml0eS5uZXQvcHJvZmlsZS9jYXJkI21l";
      request.continue({ headers });
    });
  });

  test("A logged user wants to see its orders", ({ given, when, then }) => {
    given("A logged user on the app", async () => {
      expect(page.url()).toContain("/dashboard");
    });

    when("I go to orders tab on dashboard", async () => {
      await page.goto("http://localhost:3000/dashboard/orders");
      expect(page.url()).toContain("/dashboard/orders");
      await delay(1000);
    });

    then("My orders from the DB are displayed", async () => {
      await delay(1000);
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toMatch("Order date");
      expect(text).toMatch("Subtotal");
      expect(text).toMatch("Shipping price");
      expect(text).toMatch("Price");
      expect(text).toMatch("Status");
      expect(text).toMatch("Show details");
      expect(text).toMatch("Received");
      expect(text).toMatch("See details");
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
