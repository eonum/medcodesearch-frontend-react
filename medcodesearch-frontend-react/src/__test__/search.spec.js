// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
require('selenium-webdriver/firefox')
require('geckodriver')
const {urlMatches} = require("selenium-webdriver/lib/until");

describe('search', function() {
  let driver
  let n = 1000;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  beforeEach(async function() {
    driver = await new Builder().forBrowser('firefox').build()
    await driver.manage().setTimeouts( { implicit: 10000 } );
  })
  afterEach(async function() {
    await sleep(250);
    await driver.quit();
    await sleep(250);
  })
  it('search de icd code (A15.3)', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("A15.3")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search it icd (letters)', async function() {
    await driver.get("http://localhost:3000/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("letters")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search de icd ($$$)', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("$$$")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search en icd (letters)', async function() {
    await driver.get("http://localhost:3000/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("letters")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search fr icd (letters)', async function() {
    await driver.get("http://localhost:3000/fr/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("letters")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search de icd (letters)', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("letters")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search en icd ($$$)', async function() {
    await driver.get("http://localhost:3000/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("$$$")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search en icd code (A15.3)', async function() {
    await driver.get("http://localhost:3000/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("A15.3")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search fr icd ($$$)', async function() {
    await driver.get("http://localhost:3000/fr/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("$$$")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search fr icd code (A15.3)', async function() {
    await driver.get("http://localhost:3000/fr/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("A15.3")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search it icd ($$$)', async function() {
    await driver.get("http://localhost:3000/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("$$$")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
  it('search it icd code (A15.3)', async function() {
    await driver.get("http://localhost:3000/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).click()
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".me-2"))).sendKeys("A15.3")
    await sleep(n);
    await driver.wait(until.elementLocated(By.css(".searchResult:nth-child(1)"))).click()
    await sleep(2*n);
    assert(urlMatches(/^ICD\\ICD-GM-202\d\\icd_chapters\\ICD10-GM-202\d\\?query=/))
  })
})
