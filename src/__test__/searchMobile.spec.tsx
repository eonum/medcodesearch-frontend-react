import puppeteer from "puppeteer";
import {n, sleep} from "../setupTests";
import packageJson from "../../package.json"

// TODO: We use 4 seconds sleep after await page.goto(baseUrl) since we didn't integrate waiting for page to load all
//  catalogs before clicking is allowed.
// TODO: Viewport should be set via config
describe('Search test suite for mobile version', function () {
  let browser;
  let page;
  let baseUrl = packageJson.config.testURL;

  beforeAll(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({width: 400, height: 800})
  })

  afterAll(() => browser.close());

  it('search de icd code (A15.3)', async function() {
    await page.goto(baseUrl);
    await sleep(4*n);
    // Click into search field.
    await page.type(".me-2.form-control", "A15.3");
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022?query=A15.3')
    await sleep(n);
    await page.waitForSelector(".searchResult:nth-child(1)", {visible: true})
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    await sleep(n);
    expect(search_result).toMatch("A15")
  })

  it('search it icd text (stomaco)', async function() {
    await page.goto(baseUrl + '/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020');
    await sleep(4*n);
    // Click into search field.
    await page.type(".me-2.form-control", "stomaco");
    await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020?query=stomaco')
    await sleep(n);
    await page.waitForSelector(".searchResult:nth-child(1)", {visible: true})
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toMatch("stomaco")
  })

  it('search non existing text / code', async function() {
    await page.goto(baseUrl + '/de/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020');
    await sleep(4*n);
    // Click into search field.
    await page.type(".me-2.form-control", "$$$");
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020?query=%24%24%24');
    await sleep(n);
    await page.waitForSelector(".searchResult:nth-child(1)", {visible: true})
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toBe("Die Suche erzielte keinen Treffer.");
  })

  it('search fr chop text (robot)', async function() {
    await page.goto(baseUrl + "/fr/CHOP/CHOP_2022/chop_chapters/CHOP_2022");
    await sleep(4*n);
    // Click into search field.
    await page.type(".me-2.form-control", "robot");
    await expect(page.url()).toBe(baseUrl + '/fr/CHOP/CHOP_2022/chop_chapters/CHOP_2022?query=robot');
    await sleep(n);
    await page.waitForSelector(".searchResult:nth-child(1)", {visible: true})
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toMatch("robot opératoire");
  })

  it('search it tarmed code (12.0010)', async function() {
    await page.goto(baseUrl + "/it/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09");
    await sleep(4*n);
    // Click into search field.
    await page.type(".me-2.form-control", "12.0010");
    await expect(page.url()).toBe(baseUrl + '/it/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09?query=12.0010');
    await sleep(2*n);
    await page.waitForSelector(".searchResult:nth-child(1)", {visible: true})
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    await sleep(n);
    expect(search_result).toMatch("12.");
  })

  it('search de drug text (aspir)', async function() {
    await page.goto(baseUrl + "/de/DRUG/drugs/all");
    await sleep(4*n);
    // Click into search field.
    await page.type(".me-2.form-control", "aspir");
    await expect(page.url()).toBe(baseUrl + '/de/DRUG/drugs/all?query=aspir');
    await sleep(n);
    await page.waitForSelector(".searchResult:nth-child(1)", {visible: true})
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toMatch("ASPIRIN");
  })

  it('search result is clickable', async function() {
    await page.goto(baseUrl);
    await sleep(4*n);
    // Click into search field.
    await page.type(".me-2.form-control", "A15.2");
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022?query=A15.2')
    await page.waitForSelector(".searchResult:nth-child(1)", {visible: true})
    await page.click(".searchResult:nth-child(1)");
    await sleep(n);
    let element = await page.$('.text-start.ms-3')
    let value = await page.evaluate(el => el.textContent, element)
    await expect(value).toMatch("Lungentuberkulose")
  })
})
