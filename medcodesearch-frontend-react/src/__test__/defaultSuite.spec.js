const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
require('selenium-webdriver/firefox')
require('selenium-webdriver/chrome')
require('geckodriver')
require('chromedriver')
require('selenium-webdriver/safari')

const {urlMatches} = require("selenium-webdriver/lib/until");

describe('Default Suite', function() {
  let driver;
  let n = 1000;
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  beforeEach(async function() {
      driver = await new Builder().forBrowser('firefox').build()
      await driver.manage().setTimeouts( { implicit: 10000 } );
      await driver.manage().window().maximize();
  })

  afterEach(async function() {
      await sleep(250);
      await driver.close();
      await sleep(250);
  })
    afterAll(async function() {
        await driver.quit();
    })

  it('clicking from one catalog to another (de)', async function() {

    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2*n);
    await driver.findElement(By.css("div:nth-child(3) .customButton:nth-child(1)")).click()
      assert(urlMatches(/\\de\\SwissDRG\\V11.0\\mdcs\\V11.0/), "matches the url for drg")
      await sleep(n);
    await driver.findElement(By.css("div:nth-child(4) > div > .catalogButtons > .customButton:nth-child(1)")).click()
      assert(urlMatches(/de\\TARMED\\TARMED_01.09\\tarmed_chapters\\TARMED_01.09/), "matches the url for tarmed")
      await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(1) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(4) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
    await driver.findElement(By.name("MiGeL")).click()
        await sleep(n);
    await driver.findElement(By.name("AL")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(4) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
    await driver.findElement(By.name("DRUG")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(1) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(3) .customButton:nth-child(1)")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(4) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
    await driver.findElement(By.name("DRUG")).click()
  })
  it('icd version newer to older and back (de)', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2*n);
    await driver.manage().window().setRect({ width: 1042, height: 796 })
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    {
      const element = await driver.findElement(By.id("buttonversion"))
      await driver.actions({ bridge: true }).move({origin: element}).perform()
    }
        await sleep(n);
    {
      const element = await driver.findElement(By.id("main"))
      await driver.actions({ bridge: true }).move({origin: element}).perform()
    }
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2021")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2020")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2018")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2015")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2013")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2011")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2008")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2019")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2021")).click()
  })
  it('changing languages', async function() {

    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2*n);
    await driver.findElement(By.css(".language-btn:nth-child(2)")).click()
        await sleep(n);
    await driver.findElement(By.css(".language-btn:nth-child(3)")).click()
        await sleep(n);
    await driver.findElement(By.css(".language-btn:nth-child(4)")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2020")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.css(".language-btn:nth-child(3)")).click()
        await sleep(n);
    {
      const element = await driver.findElement(By.css(".language-btn:nth-child(2)"))
      await driver.actions({ bridge: true }).move({origin: element}).perform()
    }
        await sleep(n);
    {
      const element = await driver.findElement(By.id("main"))
      await driver.actions({ bridge: true }).move({origin: element}).perform()
    }
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.css(".language-btn:nth-child(2)")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("V8.0")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2021")).click()
        await sleep(n);

  })
  it('click from button to other buttons version', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2*n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("CHOP_2020")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("V8.0")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("TARMED_01.09")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2019")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("CHOP")).click()
  })
  it('hover over buttons', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2*n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("CHOP")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("SwissDRG")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("TARMED")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.name("MiGeL")).click()
        await sleep(n);
    await driver.findElement(By.name("AL")).click()
        await sleep(n);
    await driver.findElement(By.name("DRUG")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
  })
  it('clicking a version from a different catalog', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("CHOP_2020")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("V10.0")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("TARMED_01.09")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2017")).click()
        await sleep(n);
    await driver.findElement(By.css(".language-btn:nth-child(2)")).click()
        await sleep(n);
    {
      const element = await driver.findElement(By.css(".language-btn:nth-child(1)"))
      await driver.actions({ bridge: true }).move({origin: element}).perform()
    }
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2020")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("CHOP_2020")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("V10.0")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("TARMED_01.09")).click()
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("CHOP_2020")).click()
        await sleep(n);
    await driver.findElement(By.css(".language-btn:nth-child(4)")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2020")).click()
        await sleep(n);
    await driver.findElement(By.id("buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("ICD10-GM-2022")).click()
        await sleep(n);
    await driver.findElement(By.css(".language-btn:nth-child(3)")).click()
        await sleep(n);
    {
      const element = await driver.findElement(By.id("SwissDRG"))
      await driver.actions({ bridge: true }).move({origin: element}).perform()
    }
        await sleep(n);
    {
      const element = await driver.findElement(By.id( "main"))
      await driver.actions({ bridge: true }).move({origin: element}).perform()
    }
        await sleep(n);
    await driver.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
    await driver.findElement(By.id("V10.0")).click()
  })
})
