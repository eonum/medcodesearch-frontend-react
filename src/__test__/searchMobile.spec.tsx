import puppeteer from "puppeteer";
import packageJson from "../../package.json"

describe('Search test suite for mobile version', function () {
  let browser;
  let page;
  let baseUrl = packageJson.config.testURL;
  let n = 1000;

  beforeAll(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({width: 400, height: 800})
  })

  afterAll(() => browser.close());

  it('search de icd code (A15.3)', async function() {
    await page.goto(baseUrl, {waitUntil: 'networkidle0'});
    // Focus search field and send search chars all in once (avoiding speed issues).
    await page.focus(".me-2.form-control")
    await page.keyboard.sendCharacter("A15.3");
    await page.waitForTimeout(2*n);
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022?query=A15.3')
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toMatch("A15.3")
  })

  it('search it icd text (stomaco)', async function() {
    await page.goto(baseUrl + '/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020', {waitUntil: 'networkidle0'});
    // Focus search field and send search chars all in once (avoiding speed issues).
    await page.focus(".me-2.form-control")
    await page.keyboard.sendCharacter("stomaco");
    await page.waitForTimeout(2*n);
    await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020?query=stomaco')
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toMatch("stomaco")
  })

  it('search non existing text / code', async function() {
    await page.goto(baseUrl + '/de/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020', {waitUntil: 'networkidle0'});
    // Focus search field and send search chars all in once (avoiding speed issues).
    await page.focus(".me-2.form-control")
    await page.keyboard.sendCharacter("$$$");
    await page.waitForTimeout(2*n);
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020?query=%24%24%24');
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toBe("Die Suche erzielte keinen Treffer.");
  })

  it('search fr chop text (robot)', async function() {
    await page.goto(baseUrl + "/fr/CHOP/CHOP_2022/chop_chapters/CHOP_2022", {waitUntil: 'networkidle0'});
    // Focus search field and send search chars all in once (avoiding speed issues).
    await page.focus(".me-2.form-control")
    await page.keyboard.sendCharacter("robot");
    await page.waitForTimeout(2*n);
    await expect(page.url()).toBe(baseUrl + '/fr/CHOP/CHOP_2022/chop_chapters/CHOP_2022?query=robot');
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toMatch("robot opératoire");
  })

  it('search it tarmed code (12.0010)', async function() {
    await page.goto(baseUrl + "/it/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09", {waitUntil: 'networkidle0'});
    // Focus search field and send search chars all in once (avoiding speed issues).
    await page.focus(".me-2.form-control")
    await page.keyboard.sendCharacter("12.0010");
    await page.waitForTimeout(2*n);
    await expect(page.url()).toBe(baseUrl + '/it/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09?query=12.0010');
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toMatch("12.0010");
  })

  it('search de drug text (aspir)', async function() {
    await page.goto(baseUrl + "/de/DRUG/drugs/all", {waitUntil: 'networkidle0'});
    // Focus search field and send search chars all in once (avoiding speed issues).
    await page.focus(".me-2.form-control")
    await page.keyboard.sendCharacter("aspir");
    await page.waitForTimeout(2*n);
    await expect(page.url()).toBe(baseUrl + '/de/DRUG/drugs/all?query=aspir');
    let search_element = await page.$(".searchResult:nth-child(1)");
    let search_result = await page.evaluate( search_element => search_element.textContent, search_element);
    expect(search_result).toMatch("ASPIRIN");
  })

  it('search result is clickable (after expanding search results)', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    // Focus search field and send search chars all in once (avoiding speed issues).
    await page.focus(".me-2.form-control");
    await page.keyboard.sendCharacter("A15");
    await page.waitForTimeout(2 * n);
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022?query=A15');

    // Click the collapse-button button to show search results
    await page.waitForSelector("#collapse-button", {visible: true});
    const initialButtonText = await page.$eval('#collapse-button', (button) => button.textContent);
    expect(initialButtonText).toMatch("Suchresultate einblenden");
    await page.click("#collapse-button")
    const expandedButtonText = await page.$eval('#collapse-button', (button) => button.textContent);
    expect(expandedButtonText).toMatch("Suchresultate ausblenden");
    // Click the first search result
    await page.click(".searchResult:nth-child(1)");
    await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A15?query=A15');
  });

  it('load more and reset search results', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    // Focus search field and send search term
    await page.focus(".me-2.form-control")
    await page.keyboard.sendCharacter( "neubildung");
    // Wait for the initial search results to be present
    await page.waitForTimeout(2 * n);
    // Get the initial number of search results
    const initialResultCount = await page.$$eval('.searchResult', results => results.length);
    // Verify that 10 results are loaded.
    expect(initialResultCount).toBe(10);
    // Click the "Load More" button after scrolling it into view.
    await page.evaluate(() => {
      document.querySelector('#load-more-button').scrollIntoView();
    });
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    await page.click('#load-more-button');
    // Wait for the additional search results to be present
    await page.waitForFunction(
        `document.querySelectorAll('.searchResult').length > ${initialResultCount}`,
        { timeout: 10000 }
    );
    // Get the number of search results after clicking "Load More"
    const loadMoreResultCount = await page.$$eval('.searchResult', results => results.length);
    // Verify that 10 more results are loaded
    expect(loadMoreResultCount).toBe(initialResultCount + 10);
    // Click the "reset" button after scrolling it into view.
    await page.evaluate(() => {
      document.querySelector('#reset-button').scrollIntoView();
    });
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    await page.click('#reset-button');
    // Wait for the search results to be reset to the initial 10 results
    await page.waitForFunction(
        `document.querySelectorAll('.searchResult').length === 10`,
        { timeout: 10000 }
    );
    // Get the number of search results after clicking "Reset"
    const resetResultCount = await page.$$eval('.searchResult', results => results.length);
    // Verify that the search results are reset to the initial 10 results
    expect(resetResultCount).toBe(10);
  });
})
