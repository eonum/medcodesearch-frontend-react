import puppeteer from "puppeteer";
import packageJson from "../../package.json"

describe('PopUp test suite', function () {
  let browser;
  let page;
  let baseUrl = packageJson.config.testURL;
  let n = 1000;

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
    await page.click("#version_button", {visible: true});
    // Select ICD 2021 (which is not available in 'fr').
    await page.click("#ICD10-GM-2021", {visible: true})
    // PopUp for language selection or got back should appear.
    await page.waitForSelector(".modal-content", {visible: true})
    let element = await page.$(".modal-content")
    let value = await page.evaluate(el => el.textContent, element)
    await expect(value).toMatch("Le catalogue sélectionné n'est pas disponible dans la langue actuelle.")
    // Click retour button, i.e. stay on page with same URL.
    await page.waitForSelector(".modal-footer>button", {visible: true})
    await page.click(".modal-footer>.PopUpBtn");
    await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022');
    // Again click ICD 2021 but now choose 'de' and check if correct forwarded.
    await page.click("#version_button", {visible: true});
    await page.click("#ICD10-GM-2021", {visible: true})
    // 'de' should be first button.
    await page.click(".modal-footer>div>.PopUpBtn:nth-child(1)", {visible:true});
    await page.waitForTimeout(2*n);
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2021/icd_chapters/ICD10-GM-2021');
  })

  it('Navigates to latest icd with toast warning if selected version for language change not available',
      async function () {
        await page.goto(baseUrl + '/de/ICD/ICD10-GM-2021/icd_chapters/ICD10-GM-2021', {waitUntil: 'networkidle0'});
        // Change language to 'fr'. 2021 ICD doesn't exist in french version which should trigger rendering of latest
        // existing icd version for 'fr' and rendering of a toast as warnging.
        await page.waitForSelector(".language-btn:nth-child(3)", {visible: true});
        await page.click(".language-btn:nth-child(2)");
        await page.waitForSelector(".Toastify__toast-container", {visible: true})
        await expect(page).toMatch("Cette version n'est pas disponible dans la langue sélectionnée.")
      })
})
