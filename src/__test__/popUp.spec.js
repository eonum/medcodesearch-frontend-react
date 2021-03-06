import {urlContains} from "selenium-webdriver/lib/until";
import {browser, n, sleep, options} from '../setupTests';
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')


describe('PopUp', function() {
  let driverPopUp;
  beforeAll(async function () {
    await sleep(n);
  })
  beforeEach(async function () {
    driverPopUp = await new Builder().forBrowser(browser).setFirefoxOptions(options).build();
    await sleep(n);
    //await driverPopUp.manage().setTimeouts( { implicit: 1000 } );
    //await driverPopUp.manage().window().maximize();
  })
  afterEach(async function () {
    await sleep(250);
    await driverPopUp.close();
    await sleep(250);
  })

  it('PopUp', async function () {
    // Test name: PopUp
    // Step # | name | target | value | comment
    // 1 | open | /de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022 |  | 
    await driverPopUp.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2 * n);

    // 3 | mouseOver | css=.language-btn:nth-child(4) |  |
    {
      const element = await driverPopUp.wait(until.elementLocated(By.css(".language-btn:nth-child(4)")))
      await driverPopUp.actions({bridge: true}).move({origin: element}).perform()
    }
    await sleep(n);
    assert(urlContains('fr'), 'changed language correctly to french')
    // 4 | click | css=.language-btn:nth-child(2) |  |
    await driverPopUp.wait(until.elementLocated(By.css(".language-btn:nth-child(2)"))).click()
    await sleep(n);
    // 5 | click | id=buttonversion |  |
    await driverPopUp.wait(until.elementLocated(By.id("buttonversion"))).click()
    await sleep(n);
    assert(urlContains('2022'), 'version stays the same')
    // 6 | click | id=ICD10-GM-2021 |  |
    await driverPopUp.wait(until.elementLocated(By.id("ICD10-GM-2021"))).click()
    await sleep(n);
    assert(urlContains('2021') && urlContains('de', 'changed language correctly via popup to de 2021'))
    // 7 | click | css=.modal-footer > .customButton |  |
    await driverPopUp.wait(until.elementLocated(By.css(".modal-footer > .customButton"))).click()
    await sleep(n);
    assert(urlContains('fr', 'changed language correctly to fr'))
    // 8 | click | id=buttonversion |  |
    await driverPopUp.wait(until.elementLocated(By.id("buttonversion"))).click()
    await sleep(n);
    // 9 | click | id=ICD10-GM-2019 |  |
    await driverPopUp.wait(until.elementLocated(By.id("ICD10-GM-2019"))).click()
    await sleep(n);
    assert(urlContains('2022'), 'version stays the same')
    // 10 | click | css=.langBtn:nth-child(1) |  |
    await driverPopUp.wait(until.elementLocated(By.css(".langBtn:nth-child(1)"))).click()
    await sleep(n);
    assert(urlContains('2019') && urlContains('en'), 'changed language via pop up correctly to en 2019')

  })
  it('PopUp mobile', async function () {
    // Test name: PopUp mobile
    // Step # | name | target | value | comment
    // 1 | open | /de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022 |  | 
    await driverPopUp.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
    await sleep(2 * n);
    // 2 | setWindowSize | 400x800 |  |
    await driverPopUp.manage().window().setRect({width: 400, height: 800})
    await sleep(n);
    // 3 | click | css=.language-btn:nth-child(2) |  |
    await driverPopUp.wait(until.elementLocated(By.css(".language-btn:nth-child(2)"))).click()
    await sleep(n);
    assert(urlContains('fr'), 'changed language correctly to french')
    // 4 | click | id=mobilebutton version |  |
    await driverPopUp.wait(until.elementLocated(By.id("mobilebutton version"))).click()
    await sleep(n);
    // 5 | click | id=ICD10-GM-2021 |  |
    await driverPopUp.wait(until.elementLocated(By.id("ICD10-GM-2021"))).click()
    await sleep(n);
    assert(urlContains('2022'), 'version stays the same')
    // 6 | click | css=.langBtn:nth-child(1) |  |
    await driverPopUp.wait(until.elementLocated(By.css(".langBtn:nth-child(1)"))).click()
    await sleep(n);
    assert(urlContains('2021') && urlContains('de', 'changed language correctly via popup to de 2021'))
    // 7 | click | css=.language-btn:nth-child(2) |  |
    await driverPopUp.wait(until.elementLocated(By.css(".language-btn:nth-child(2)"))).click()
    await sleep(n);
    assert(urlContains('fr', 'changed language correctly to fr'))
    // 8 | click | id=mobilebutton version |  |
    await driverPopUp.wait(until.elementLocated(By.id("mobilebutton version"))).click()
    await sleep(n);
    // 9 | click | id=ICD10-GM-2019 |  |
    await driverPopUp.wait(until.elementLocated(By.id("ICD10-GM-2019"))).click()
    await sleep(n);
    assert(urlContains('2022'), 'version stays the same')
    // 10 | click | css=.langBtn:nth-child(2) |  |
    await driverPopUp.wait(until.elementLocated(By.css(".langBtn:nth-child(2)"))).click()
    await sleep(n);
    assert(urlContains('2019') && urlContains('en'), 'changed language via pop up correctly to en 2019')

  })
})
