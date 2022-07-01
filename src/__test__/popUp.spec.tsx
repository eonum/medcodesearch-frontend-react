import puppeteer from "puppeteer";
import {n} from "../setupTests";
import packageJson from "../../package.json"

describe('PopUp test suite', function () {
  let browser;
  let page;
  let baseUrl = packageJson.config.testURL;

  beforeAll(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768})
  })

  afterAll(() => browser.close());

  it('PopUp for versions not available in language', async function () {
    await page.goto(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022', {waitUntil: 'networkidle0'});
    // Change language to 'fr'.
    await page.waitForSelector(".language-btn:nth-child(3)", {visible: true});
    await page.click(".language-btn:nth-child(2)");
    await page.waitForTimeout(2*n);
    await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022');
    // Click on versions button for icds.
    await page.waitForSelector("#buttonversion", {visible: true})
    await page.click("#buttonversion")
    // Select ICD 2021 (which is not available in 'fr').
    await page.waitForSelector("#ICD10-GM-2021", {visible: true})
    await page.click("#ICD10-GM-2021");
    // PopUp for language selection or got back should appear.
    await page.waitForSelector(".modal-content", {visible: true})
    let element = await page.$(".modal-content")
    let value = await page.evaluate(el => el.textContent, element)
    await expect(value).toMatch("Le catalogue sélectionné n'est pas disponible dans la langue actuelle.")
    // Click retour button, i.e. stay on page with same URL.
    await page.waitForSelector(".modal-footer>button", {visible: true})
    await page.click(".modal-footer>button");
    await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022');
    // Again click ICD 2021 but now choose 'de' and check if correct forwarded.
    await page.waitForSelector("#buttonversion", {visible: true});
    await page.click("#buttonversion");
    await page.waitForSelector("#ICD10-GM-2021", {visible: true})
    await page.click("#ICD10-GM-2021");
    await page.waitForSelector(".modal-footer>button", {visible: true})
    // 'de' should be first button.
    await page.click(".modal-footer>div>.customButton.langBtn:nth-child(1)");
    await page.waitForTimeout(2*n);
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2021/icd_chapters/ICD10-GM-2021');
  })
})
