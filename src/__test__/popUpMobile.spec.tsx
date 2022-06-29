import puppeteer from "puppeteer";
import {n, sleep} from "../setupTests";
import packageJson from "../../package.json"

// TODO: We use 4 seconds sleep after await page.goto(baseUrl) since we didn't integrate waiting for page to load all
//  catalogs before clicking is allowed.
// TODO: Viewport should be set via config
describe('PopUp test suite for mobile version', function () {
  let browser;
  let page;
  let baseUrl = packageJson.config.testURL;

  beforeAll(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 400, height: 800 });
  })

  afterAll(() => browser.close());

// Testing the same functionality for mobile screen (with different language and version).
  it('PopUp mobile', async function () {
    await page.goto(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022');
    await sleep(4 * n);
    // Change language to 'it'.
    await page.click(".language-btn:nth-child(3)");
    await sleep(3*n);
    await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022');
    // Click on versions button for icds.
    await page.waitForSelector("#mobilebutton\\ version", {visible: true})
    await page.click("#mobilebutton\\ version")
    await sleep(n);
    // Version stays the same when clicking on versions button.
    await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022');
    // Select ICD 2019 (which is not available in 'it').
    await page.waitForSelector("#ICD10-GM-2019", {visible: true})
    await page.click("#ICD10-GM-2019");
    // PopUp for language selection or got back should appear.
    await page.waitForSelector(".modal-content", {visible: true})
    let element = await page.$(".modal-content")
    let value = await page.evaluate(el => el.textContent, element)
    await expect(value).toMatch("Il catalogo selezionato non è disponibile nel linguaggio corrente.")
    // Click retour button, i.e. stay on page with same URL.
    await page.waitForSelector(".modal-footer>button", {visible: true})
    await page.click(".modal-footer>button");
    await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022');
    // Again click ICD 2021 but now choose 'de' and check if correct forwarded.
    await page.waitForSelector("#mobilebutton\\ version", {visible: true})
    await page.click("#mobilebutton\\ version")
    await page.waitForSelector("#ICD10-GM-2019", {visible: true})
    await page.click("#ICD10-GM-2019");
    await page.waitForSelector(".modal-footer>button", {visible: true})
    // 'de' should be first button.
    await page.click(".modal-footer>div>.customButton.langBtn:nth-child(1)");
    await sleep(3*n);
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2019/icd_chapters/ICD10-GM-2019');
  })
})
