import { defineFeature, loadFeature } from "jest-cucumber";
import puppeteer from "puppeteer";

const feature = loadFeature("./e2e/features/update.feature");

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const headers = request.headers();
      headers["token"] =
        "aHR0cHM6Ly9hbHZhbWlnZS5zb2xpZGNvbW11bml0eS5uZXQvcHJvZmlsZS9jYXJkI21l";
      request.continue({ headers });
    });

    await page
      .goto("http://localhost:3000/dashboard/", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test("An admin user enters the webpage", ({ given, when, then }) => {
    given("An user on home page", async () => {
      expect(page.url()).toContain("/dashboard");
    });

    when("I go to update products (on dashboard for admins)", async () => {
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        const headers = request.headers();
        headers["token"] =
          "aHR0cHM6Ly9hbHZhbWlnZS5zb2xpZGNvbW11bml0eS5uZXQvcHJvZmlsZS9jYXJkI21l";
        request.continue({ headers });
      });
      await page.goto("http://localhost:3000/dashboard/products/update");
      expect(page.url()).toContain("/dashboard/products/update");
      await delay(1000);
    });

    then("Update view is shown", async () => {
      await delay(1000);
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toMatch("Update product");
      expect(text).toMatch("Select a product to update");
      expect(text).toMatch("Name of the product");
      expect(text).toMatch("Write a description");
      expect(text).toMatch("Category");
      expect(text).toMatch("Price");
      expect(text).toMatch("Available stock");
      expect(text).toMatch("Weight on kilograms");
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
