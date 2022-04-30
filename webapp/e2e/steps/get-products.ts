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

    /*page.on("request", (interceptedRequest) => {
      console.log(interceptedRequest.url());
    });*/
  });

  test("A user enters the webpage", ({ given, when, then }) => {
    given("A user on home page", async () => {
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toMatch("Welcome");
      expect(text).toContain("AMONG US™ CryptoBro");
    });

    when("I go to shop section", async () => {
      await expect(page).toClick("a", { text: "Start shopping" });
      expect(page.url()).toContain("/shop");
      await delay(1000);
    });

    then("Products from the DB are displayed", async () => {
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toContain("Super SUS T-Shirt");
      expect(text).toContain("The Sussier Bag");
      expect(text).toContain('Among Us "Calle" pack');
      expect(text).toContain("Not sus T-Shirt");
      expect(text).toContain('"Sus Cough" Mask');
      expect(text).toContain("Among Us Airpods' Cover");
      expect(text).toContain("Sussy Chains");
      expect(text).toContain("Imposters Delicious Chocolate");
      expect(text).toContain("Car Personalized Sticker");
      expect(text).toContain('Among Us "CryptoBro"');
      expect(text).toContain("Among Us Music Vinyl");
      expect(text).toContain("Among Us Pencil Case");
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
