import { defineFeature, loadFeature } from 'jest-cucumber';
import puppeteer from "puppeteer";

const feature = loadFeature('./e2e/features/register-form.feature');

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, test => {
  
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: true });
    page = await browser.newPage();

    await page
      .goto("http://localhost:3000/home", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user is not registered in the site', ({given,when,then}) => {

    given('An unregistered user', () => {
    });

    when('I fill the data in the form and press submit', async () => {
      
      await expect(page).toMatch('Shop')
    });

    then('A confirmation message should be shown in the screen', async () => {
      await expect(page).toMatch('Shop')
      const text = await page.evaluate(() => document.body.textContent);
      expect(text).toContain('AMONG US™ CryptoBro');
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});

