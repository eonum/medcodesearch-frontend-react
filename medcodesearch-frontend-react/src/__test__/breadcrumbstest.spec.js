const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
require('selenium-webdriver/firefox')
require('geckodriver')

describe('Default Suite', function() {
  let driver
  let n = 1500;
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

  it('click through mobile buttons (de)', async function() {

    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driver.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driver.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n);

    await driver.findElement(By.id("CHOP 1")).click()
    await sleep(n);
    await driver.findElement(By.id("mobilebutton version")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2013")).click()
    await sleep(n);
    await driver.findElement(By.id("mobilebutton version")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2018")).click()
    await sleep(n);
    await driver.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n); //
    await driver.findElement(By.id("SwissDRG 2")).click()
    await sleep(n);
    await driver.findElement(By.linkText("MDC 03:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("Andere Partition:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("D40:")).click()
    await sleep(n);
    await driver.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n);
    await driver.findElement(By.id("SwissDRG 2")).click()
    await sleep(n);
    await driver.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n);

    await driver.findElement(By.id("CHOP 1")).click()
    await sleep(n);
    await driver.findElement(By.linkText("C1:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("01:")).click()
    await sleep(n);
    await driver.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n);

    await driver.findElement(By.id("ICD 0")).click()
    await sleep(n);
    await driver.findElement(By.linkText("V:")).click()
    await sleep(n);
    await driver.findElement(By.id("mobilebutton version")).click()
    await sleep(n);

    await driver.findElement(By.id("ICD10-GM-2018")).click()
    await sleep(n);
    await driver.findElement(By.linkText("III:")).click()
  })
  it('breadcrumbs in mobile', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driver.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driver.findElement(By.linkText("III:")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,1500)")
    await sleep(n);
    await driver.findElement(By.linkText("D55-D59:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("III")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,1500)")
    await sleep(n);
    await driver.findElement(By.linkText("D65-D69:")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,0)")
    await sleep(n);
    await driver.findElement(By.linkText("D69:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("D69.0:")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,0)")
    await sleep(n);
    {
      const element = await driver.findElement(By.linkText("ICD10-GM-2022"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.linkText("ICD10-GM-2022")).click()
    await sleep(n);
    await driver.findElement(By.id("mobilebutton version")).click()
    await sleep(n);

    await driver.findElement(By.id("ICD10-GM-2014")).click()
    await sleep(n);
    await driver.findElement(By.linkText("XII:")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,400)")
    await sleep(n);
    await driver.findElement(By.linkText("L00-L08:")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.linkText("XII"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.linkText("XII")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.id("mobilebutton catalog"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.id("main"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.id("MiGeL 4")).click()
    await sleep(n);
    await driver.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n);
    await driver.findElement(By.id("SwissDRG 2")).click()
    await sleep(n);

    await driver.findElement(By.css("li:nth-child(3)")).click()
    await sleep(n);
    await driver.findElement(By.linkText("MDC 03:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("Medizinische Partition:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("D62:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("D62B:")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.linkText("Medizinische Partition"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.linkText("Medizinische Partition")).click()
    await sleep(n);
    await driver.findElement(By.linkText("D60:")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.linkText("MDC 03"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.linkText("MDC 03")).click()
    await sleep(n);
    await driver.findElement(By.linkText("Operative Partition:")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.id("main"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,0)")
    await sleep(n);
    await driver.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP 1")).click()
    await sleep(n);
    await driver.findElement(By.linkText("C4:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("20:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("C4")).click()
    await sleep(n);
    await driver.findElement(By.linkText("18:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("18.3:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("18.31:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("CHOP 2022")).click()
  })
  it('testing breadcrumbs de', async function() {

    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2000);
    await driver.manage().window().setRect({ width: 1200, height: 800 })
    await sleep(n);
    await driver.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A01:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A01.0:")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,800)")
    await sleep(n);
    await driver.findElement(By.linkText("A01.2:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A01:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A01.0:")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,0)")
    await sleep(n);
    await driver.findElement(By.linkText("I")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,2*n)")
    await sleep(n);
    await driver.findElement(By.linkText("B00-B09:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("B08:")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP")).click()
    await sleep(n);
    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2018")).click()
    await sleep(n);
    await driver.findElement(By.linkText("C4:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("20:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("20.1:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("20.4:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("20.41:")).click()
    await sleep(n);
    await driver.findElement(By.id("SwissDRG")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.id("SwissDRG"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);

    {
      const element = await driver.findElement(By.id("main"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.linkText("MDC 05:")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(3) #buttonversion")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.css("div:nth-child(3) #buttonversion"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);

    {
      const element = await driver.findElement(By.id("main"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);

    await driver.findElement(By.id("V8.0")).click()
    await sleep(n);
    await driver.findElement(By.linkText("MDC 06:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("Andere Partition:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("G46:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("Andere Partition")).click()
    await sleep(n);
    await driver.findElement(By.linkText("G40:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("MDC 06")).click()
    await sleep(n);
    await driver.findElement(By.linkText("Andere Partition:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("G40:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("G40Z:")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.linkText("eonum"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.id("TARMED")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07:")).click()
    await sleep(n);

    await driver.findElement(By.css("ul > li:nth-child(2)")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07.02:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07.0140:")).click()
    await sleep(n);

    await driver.findElement(By.css("ul > li:nth-child(2)")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07.0120:")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,400)")
    await sleep(n);
    await driver.findElement(By.linkText("07.0260:")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,400)")
    await sleep(n);
    await driver.findElement(By.linkText("07.0250:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07")).click()
    await sleep(n);
    await driver.findElement(By.linkText("TARMED 01.09")).click()
    await sleep(n);
    await driver.findElement(By.linkText("11:")).click()
  })
  it('testing breadcrumbs fr', async function() {
    await driver.get("http://localhost:3000/fr/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020")
    await sleep(2*n);
    await driver.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A01:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A01.0:")).click()
    await sleep(n);
    await driver.executeScript("window.scrollTo(0,248)")
    await sleep(n);
    await driver.findElement(By.linkText("A01.2:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A01.3:")).click()
    await sleep(2*n);
    await driver.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A01:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A01.0:")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.linkText("eonum"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.linkText("I")).click()
    await sleep(n);
    await driver.findElement(By.linkText("B00-B09:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("B08:")).click()
    await sleep(n);

    await driver.findElement(By.id("CHOP")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2018")).click()
    await sleep(n);
    await driver.findElement(By.linkText("C4:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("20:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("20.1:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("20.4:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("20.41:")).click()
    await sleep(n);
    await driver.findElement(By.id("SwissDRG")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.id("SwissDRG"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    {
      const element = await driver.findElement(By.id("main"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.linkText("MDC 05:")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(3) #buttonversion")).click()
    await sleep(n);

    {
      const element = await driver.findElement(By.css("div:nth-child(3) #buttonversion"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);

    {
      const element = await driver.findElement(By.id("main"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);

    await driver.findElement(By.id("V8.0")).click()
    await sleep(n);
    await driver.findElement(By.linkText("MDC 06:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("Autre partition:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("G46:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("Autre partition")).click()
    await sleep(n);
    await driver.findElement(By.linkText("G40:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("MDC 06")).click()
    await sleep(n);
    await driver.findElement(By.linkText("Autre partition:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("G40:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("G40Z:")).click()
    await sleep(n);
    {
      const element = await driver.findElement(By.linkText("eonum"))
      await driver.actions({ bridge: true }).move({origin:element}).perform()
    }
    await sleep(n);
    await driver.findElement(By.id("TARMED")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07:")).click()
    await sleep(n);

    await driver.findElement(By.css("ul > li:nth-child(2)")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07.02:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07.0140:")).click()
    await sleep(n);

    await driver.findElement(By.css("ul > li:nth-child(2)")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07.0120:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07.0260:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07.0250:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("07")).click()
    await sleep(n);
    await driver.findElement(By.linkText("TARMED 01.09")).click()
    await sleep(n);
    await driver.findElement(By.linkText("11:")).click()
  })
  it('icd clicking from I to A00.0 (de, 2008)', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2008/icd_chapters/ICD10-GM-2008")
    await sleep(2*n);
    await driver.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driver.findElement(By.linkText("A00")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driver.findElement(By.linkText("I")).click()
    await sleep(n);
    await driver.findElement(By.linkText("ICD10-GM-2008")).click()
  })
  it('icd clicking from I to A00.0 (de, 2022)', async function() {
    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driver.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driver.findElement(By.linkText("A00")).click()
    await sleep(2*n);
    await driver.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driver.findElement(By.linkText("I")).click()
    await sleep(n);
    await driver.findElement(By.linkText("ICD10-GM-2022")).click()
  })
  it('Chop version newer to older and back (de)', async function() {

    await driver.get("http://localhost:3000/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);

    await driver.findElement(By.id("CHOP")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2021")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2019")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2018")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2016")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2015")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2018")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2020")).click()
    await sleep(n);

    await driver.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driver.findElement(By.id("CHOP_2022")).click()
  })
  it('chop clicking from C0 to 00.0 (de)', async function() {
    await sleep(2*n);
    await driver.get("http://localhost:3000/de/CHOP/CHOP_2022/chop_chapters/CHOP_2022")
    await sleep(n);
    await driver.findElement(By.linkText("C0:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("00:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("00.0:")).click()
    await sleep(n);
    await driver.findElement(By.linkText("00")).click()
    await sleep(n);
    await driver.findElement(By.linkText("C0")).click()
    await sleep(n);
    await driver.findElement(By.linkText("CHOP 2022")).click()
  })
})
