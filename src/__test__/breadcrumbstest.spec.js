const { Builder, By} = require('selenium-webdriver')
const {browser, sleep, n, options} = require("../setupTests");

describe('Default Suite', function() {
  let driverCrumbs
  beforeAll( async function() {
    await sleep(n);
  })
  beforeEach(async function() {
    driverCrumbs = await new Builder().forBrowser(browser).setFirefoxOptions(options).build();
    await driverCrumbs.manage().setTimeouts( { implicit: 1000 } );
    await driverCrumbs.manage().window().maximize();

  })
  afterEach(async function() {
    await sleep(250);
    await driverCrumbs.quit();
    await sleep(250);
  })

  it('click through mobile buttons (de)', async function() {
    await driverCrumbs.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driverCrumbs.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP 1")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("mobilebutton version")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2013")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("mobilebutton version")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2018")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n); //
    await driverCrumbs.findElement(By.id("SwissDRG 2")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("MDC 03:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("Andere Partition:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("D40:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("mobilebutton catalog")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("TARMED 3")).click()
    await sleep(n);
  })

  it('icd clicking from I to A00.0 (de, 2008)', async function() {
    await driverCrumbs.get("http://localhost:8080/de/ICD/ICD10-GM-2008/icd_chapters/ICD10-GM-2008")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2008")).click()
  })
  it('icd clicking from I to A00.0 (fr, 2022)', async function() {
    await driverCrumbs.get("http://localhost:8080/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022")).click()
  })
  it('icd clicking from I to A00.0 (de, 2022)', async function() {
    await driverCrumbs.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022")).click()
  })
  it('icd clicking from I to A00.0 (en, 2022)', async function() {
    await driverCrumbs.get("http://localhost:8080/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022")).click()
  })
  it('icd clicking from I to A00.0 (it, 2022)', async function() {
    await driverCrumbs.get("http://localhost:8080/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022")).click()
  })

  it('icd clicking from I to A00.0 (de, 2022) mobil', async function() {
    await driverCrumbs.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1000)")
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1000)")
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1000)")
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022")).click()
  })
  it('icd clicking from I to A00.0 (fr, 2022) mobil', async function() {
    await driverCrumbs.get("http://localhost:8080/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022")).click()
  })
  it('icd clicking from I to A00.0 (it, 2022) mobil', async function() {
    await driverCrumbs.get("http://localhost:8080/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022")).click()
  })
  it('icd clicking from I to A00.0 (en, 2022) mobil', async function() {
    await driverCrumbs.get("http://localhost:8080/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);
    await driverCrumbs.manage().window().setRect({ width: 400, height: 800 })
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00.0:")).click()
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("A00")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("A00-A09")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("I")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("ICD10-GM-2022")).click()
  })


  it('Chop version newer to older and back (de)', async function() {

    await driverCrumbs.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2*n);

    await driverCrumbs.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);

    await driverCrumbs.findElement(By.id("CHOP")).click()
    await sleep(n);

    await driverCrumbs.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2021")).click()
    await sleep(n);

    await driverCrumbs.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2019")).click()
    await sleep(n);

    await driverCrumbs.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2018")).click()
    await sleep(n);

    await driverCrumbs.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2016")).click()
    await sleep(n);

    await driverCrumbs.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2015")).click()
    await sleep(n);

    await driverCrumbs.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2018")).click()
    await sleep(n);

    await driverCrumbs.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2020")).click()
    await sleep(n);

    await driverCrumbs.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.id("CHOP_2022")).click()
  })
  it('chop clicking from C0 to 00.0 (de)', async function() {
    await driverCrumbs.get("http://localhost:8080/de/CHOP/CHOP_2022/chop_chapters/CHOP_2022")
    await sleep(2*n);
    await driverCrumbs.findElement(By.linkText("C0:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("00:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("00.0:")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("00")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("C0")).click()
    await sleep(n);
    await driverCrumbs.findElement(By.linkText("CHOP 2022")).click()
  })

  it('breadcrumbs desktop migel de', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/de/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:")).click()
    await sleep(n);
    // 3 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:")).click()
    await sleep(n);
    // 4 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 5 | click | css=.breadcrumb-item:nth-child(3) |
    await driverCrumbs.findElement(By.css(".breadcrumb-item:nth-child(3)")).click()
    await sleep(n);
    // 6 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14")).click()
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:")).click()
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("MiGeL")).click()
    await sleep(n);
  })
  it('breadcrumbs desktop migel fr', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/fr/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:")).click()
    await sleep(n);
    // 3 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:")).click()
    await sleep(n);
    // 4 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 5 | click | css=.breadcrumb-item:nth-child(3) |
    await driverCrumbs.findElement(By.css(".breadcrumb-item:nth-child(3)")).click()
    await sleep(n);
    // 6 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14")).click()
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:")).click()
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("LiMA")).click()
    await sleep(n);
  })
  it('breadcrumbs desktop migel it', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/it/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:")).click()
    await sleep(n);
    // 3 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:")).click()
    await sleep(n);
    // 4 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 5 | click | css=.breadcrumb-item:nth-child(3) |
    await driverCrumbs.findElement(By.css(".breadcrumb-item:nth-child(3)")).click()
    await sleep(n);
    // 6 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14")).click()
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:")).click()
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("EMAp")).click()
    await sleep(n);
  })
  it('breadcrumbs desktop migel en', async function() {
    // Step # | name | target | value
    // 1 | open | /de/MIGEL/migels/all |
    await driverCrumbs.get("http://localhost:8080/en/MIGEL/migels/all")
    await sleep(2*n);
    // 2 | click | linkText=14: |
    await driverCrumbs.findElement(By.linkText("14:")).click()
    await sleep(n);
    // 3 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:")).click()
    await sleep(n);
    // 4 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 5 | click | css=.breadcrumb-item:nth-child(3) |
    await driverCrumbs.findElement(By.css(".breadcrumb-item:nth-child(3)")).click()
    await sleep(n);
    // 6 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14")).click()
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:")).click()
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("MiGeL")).click()
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
    await driverCrumbs.findElement(By.linkText("14:")).click()
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1250)")
    await sleep(n);
    // 4 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:")).click()
    await sleep(n);
    // 5 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 6 | click | css=.breadcrumb-item:nth-child(3) |
    await driverCrumbs.findElement(By.css(".breadcrumb-item:nth-child(3)")).click()
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14")).click()
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:")).click()
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("MiGeL")).click()
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
    await driverCrumbs.findElement(By.linkText("14:")).click()
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1250)")
    await sleep(n);
    // 4 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:")).click()
    await sleep(n);
    // 5 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 6 | click | css=.breadcrumb-item:nth-child(3) |
    await driverCrumbs.findElement(By.css(".breadcrumb-item:nth-child(3)")).click()
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14")).click()
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:")).click()
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("LiMA")).click()
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
    await driverCrumbs.findElement(By.linkText("14:")).click()
    await sleep(n);
    // 4 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:")).click()
    await sleep(n);
    // 5 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 6 | click | css=.breadcrumb-item:nth-child(3) |
    await driverCrumbs.findElement(By.css(".breadcrumb-item:nth-child(3)")).click()
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14")).click()
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:")).click()
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("MiGeL")).click()
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
    await driverCrumbs.findElement(By.linkText("14:")).click()
    await sleep(n);
    await driverCrumbs.executeScript("window.scrollTo(0,1250)")
    await sleep(n);
    // 4 | click | linkText=14.02: |
    await driverCrumbs.findElement(By.linkText("14.02:")).click()
    await sleep(n);
    // 5 | click | linkText=14.02.03.00.1: |
    await driverCrumbs.findElement(By.linkText("14.02.03.00.1:")).click()
    await sleep(n);
    // 6 | click | css=.breadcrumb-item:nth-child(3) |
    await driverCrumbs.findElement(By.css(".breadcrumb-item:nth-child(3)")).click()
    await sleep(n);
    // 7 | click | linkText=14 |
    await driverCrumbs.findElement(By.linkText("14")).click()
    await sleep(n);
    // 8 | click | linkText=14.01: |
    await driverCrumbs.findElement(By.linkText("14.01:")).click()
    await sleep(n);
    // 9 | click | linkText=MiGeL |
    await driverCrumbs.findElement(By.linkText("EMAp")).click()
    await sleep(n);
  })

})
