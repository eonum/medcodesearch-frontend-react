import puppeteer from "puppeteer";
import {n, sleep} from "../setupTests";
import packageJson from "../../package.json"

// TODO: We use 4 seconds sleep after await page.goto(baseUrl) since we didn't integrate waiting for page to load all
//  catalogs before clicking is allowed.
// TODO: Viewport should be set via config
describe('Breadcrumb test suite', function () {
  let browser;
  let page;
  let baseUrl = packageJson.config.testURL;

  beforeAll(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768})
  })

  afterAll(() => browser.close());

  it('icd clicking from I to A00.0 (de, 2008)', async function() {
    await page.goto(baseUrl + '/de/ICD/ICD10-GM-2008/icd_chapters/ICD10-GM-2008')
    await sleep(4*n);
    await driverCrumbs.findElement(By.linkText("I:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2008"))
  })

  it('icd clicking from I to A00.0 (fr, 2022)', async function() {
    await driverCrumbs.get("http://localhost:8080/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("I:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022"))
  })

  it('icd clicking from I to A00.0 (de, 2022)', async function() {
    await driverCrumbs.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("I:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00-A09"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022"))
  })

  it('icd clicking from I to A00.0 (en, 2022)', async function() {
    await driverCrumbs.get("http://localhost:8080/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("I:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00-A09"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022"))
  })

  it('icd clicking from I to A00.0 (it, 2022)', async function() {
    await driverCrumbs.get("http://localhost:8080/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("I:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00-A09"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022"))
  })

  it('icd clicking from I to A00.0 (de, 2022) mobil', async function() {
    await driverCrumbs.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I:"))
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1000)")
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:"))
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1000)")
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:"))
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1000)")
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022"))
  })
  it('icd clicking from I to A00.0 (fr, 2022) mobil', async function() {
    await driverCrumbs.get("http://localhost:8080/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022"))
  })
  it('icd clicking from I to A00.0 (it, 2022) mobil', async function() {
    await driverCrumbs.get("http://localhost:8080/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022"))
  })
  it('icd clicking from I to A00.0 (en, 2022) mobil', async function() {
    await driverCrumbs.get("http://localhost:8080/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:"))
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022"))
  })


  it('Chop version newer to older and back (de)', async function() {

    await driverCrumbs.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);

    await page.click("div:nth-child(2) > div > .catalogButtons > #buttonversion")
    await sleep(n);

    await page.click("CHOP")
    await sleep(n);

    await page.click("div:nth-child(2) > div > .catalogButtons > #buttonversion")
    await sleep(n);
    await page.click("CHOP_2021")
    await sleep(n);

    await page.click("div:nth-child(2) > div > .catalogButtons > #buttonversion")
    await sleep(n);
    await page.click("CHOP_2019")
    await sleep(n);

    await page.click("div:nth-child(2) > div > .catalogButtons > #buttonversion")
    await sleep(n);
    await page.click("CHOP_2018")
    await sleep(n);

    await page.click("div:nth-child(2) > div > .catalogButtons > #buttonversion")
    await sleep(n);
    await page.click("CHOP_2016")
    await sleep(n);

    await page.click("div:nth-child(2) > div > .catalogButtons > #buttonversion")
    await sleep(n);
    await page.click("CHOP_2015")
    await sleep(n);

    await page.click("div:nth-child(2) > div > .catalogButtons > #buttonversion")
    await sleep(n);
    await page.click("CHOP_2018")
    await sleep(n);

    await page.click("div:nth-child(2) > div > .catalogButtons > #buttonversion")
    await sleep(n);
    await page.click("CHOP_2020")
    await sleep(n);

    await page.click("div:nth-child(2) > div > .catalogButtons > #buttonversion")
    await sleep(n);
    await page.click("CHOP_2022")
  })

  it('chop clicking from C0 to 00.0 (de)', async function() {
    await driverCrumbs.get("http://localhost:8080/de/CHOP/CHOP_2022/chop_chapters/CHOP_2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("C0:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("00:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("00.0:"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("00"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("C0"))
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("CHOP 2022"))
  })

  it('breadcrumbs desktop migel de', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/de/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:"))
    await sleep(n);
    // 3 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:"))
    await sleep(n);
    // 4 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 5 | click | css=.breadcrumb-item:nth-child(3) |
    await page.click(".breadcrumb-item:nth-child(3)")
    await sleep(n);
    // 6 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14"))
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:"))
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("MiGeL"))
    await sleep(n);
  })

  it('breadcrumbs desktop migel fr', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/fr/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:"))
    await sleep(n);
    // 3 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:"))
    await sleep(n);
    // 4 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 5 | click | css=.breadcrumb-item:nth-child(3) |
    await page.click(".breadcrumb-item:nth-child(3)")
    await sleep(n);
    // 6 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14"))
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:"))
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("LiMA"))
    await sleep(n);
  })

  it('breadcrumbs desktop migel it', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/it/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:"))
    await sleep(n);
    // 3 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:"))
    await sleep(n);
    // 4 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 5 | click | css=.breadcrumb-item:nth-child(3) |
    await page.click(".breadcrumb-item:nth-child(3)")
    await sleep(n);
    // 6 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14"))
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:"))
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("EMAp"))
    await sleep(n);
  })

  it('breadcrumbs desktop migel en', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/en/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:"))
    await sleep(n);
    // 3 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:"))
    await sleep(n);
    // 4 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 5 | click | css=.breadcrumb-item:nth-child(3) |
    await page.click(".breadcrumb-item:nth-child(3)"))
    await sleep(n);
    // 6 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14"))
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:"))
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("MiGeL"))
    await sleep(n);
  })

  it('breadcrumbs mobil migel de', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/de/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | setWindowSize | 400x800 |
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(2*n);
    await driverCrumbs.executeScript("window.scrollTo(0,700)")
    await sleep(n);
    // 3 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:"))
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1250)")
    await sleep(n);
    // 4 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:"))
    await sleep(n);
    // 5 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 6 | click | css=.breadcrumb-item:nth-child(3) |
    await page.click(".breadcrumb-item:nth-child(3)")
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14"))
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:"))
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("MiGeL"))
    await sleep(n);
  })

  it('breadcrumbs mobil migel fr', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/fr/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | setWindowSize | 400x800 |
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(2*n);
    await driverCrumbs.executeScript("window.scrollTo(0,700)")
    await sleep(n);
    // 3 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:"))
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1250)")
    await sleep(n);
    // 4 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:"))
    await sleep(n);
    // 5 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 6 | click | css=.breadcrumb-item:nth-child(3) |
    await page.click(".breadcrumb-item:nth-child(3)")
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14"))
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:"))
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("LiMA"))
    await sleep(n);
  })

  it('breadcrumbs mobil migel en', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/en/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | setWindowSize | 400x800 |
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    // 3 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:"))
    await sleep(n);
    // 4 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:"))
    await sleep(n);
    // 5 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 6 | click | css=.breadcrumb-item:nth-child(3) |
    await page.click(".breadcrumb-item:nth-child(3)")
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14"))
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:"))
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("MiGeL"))
    await sleep(n);
  })

  it('breadcrumbs mobil migel it', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/it/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | setWindowSize | 400x800 |
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(2*n);
    await driverCrumbs.executeScript("window.scrollTo(0,700)")
    await sleep(n);
    // 3 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:"))
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1250)")
    await sleep(n);
    // 4 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:"))
    await sleep(n);
    // 5 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:"))
    await sleep(n);
    // 6 | click | css=.breadcrumb-item:nth-child(3) |
    await page.click(".breadcrumb-item:nth-child(3)")
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14"))
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:"))
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("EMAp"))
    await sleep(n);
  })
})
