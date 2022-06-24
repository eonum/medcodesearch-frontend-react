const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
const {urlMatches} = require("selenium-webdriver/lib/until");
const {browser, sleep, n, options} = require("../setupTests");

describe('search', function() {
  let driverSearch;
  beforeAll( async function() {
    await sleep(n);
  })
  beforeEach(async function() {
    driverSearch = await new Builder().forBrowser(browser).setFirefoxOptions(options).build();
    await driverSearch.manage().setTimeouts( { implicit: 1000 } );
    await driverSearch.manage().window().maximize();
  })
  afterEach(async function() {
    await sleep(250);
    await driverSearch.quit();
    await sleep(250);
  })

  it('search de icd code (A15.3)', async function() {
    await driverSearch.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("A15.3")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search it icd (letters)', async function() {
    await driverSearch.get("http://localhost:8080/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("letters")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search de icd ($$$)', async function() {
    await driverSearch.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("$$$")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search en icd (letters)', async function() {
    await driverSearch.get("http://localhost:8080/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("letters")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search fr icd (letters)', async function() {
    await driverSearch.get("http://localhost:8080/fr/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("letters")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search de icd (letters)', async function() {
    await driverSearch.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("letters")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search en icd ($$$)', async function() {
    await driverSearch.get("http://localhost:8080/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("$$$")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search en icd code (A15.3)', async function() {
    await driverSearch.get("http://localhost:8080/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("A15.3")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search fr icd ($$$)', async function() {
    await driverSearch.get("http://localhost:8080/fr/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("$$$")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search fr icd code (A15.3)', async function() {
    await driverSearch.get("http://localhost:8080/fr/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("A15.3")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search it icd ($$$)', async function() {
    await driverSearch.get("http://localhost:8080/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("$$$")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search it icd code (A15.3)', async function() {
    await driverSearch.get("http://localhost:8080/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driverSearch.wait(until.elementLocated(By.css(".me-2"))).sendKeys("A15.3")
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
})
