describe('Default Suite', function() {
    let driverDef;
    var webdriver = require("selenium-webdriver");
    var By = webdriver.By;
    var {browser, sleep, n, options} = require("../setupTests");
    var {urlMatches} = require("selenium-webdriver/lib/until");
    var assert = require('assert');

    beforeAll( async function() {
        await sleep(n);
    })
    beforeEach(async function() {
        driverDef = new webdriver.Builder().forBrowser(browser).setFirefoxOptions(options).build()
        await driverDef.manage().setTimeouts( { implicit: 1000 } );
        await driverDef.manage().window().maximize();
    })
    afterEach(async function() {
        await sleep(250);
        await driverDef.quit();
        await sleep(250);
    })

    it('clicking from one catalog to another (de)', async function() {

        await driverDef.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2 * n);
        await driverDef.findElement(By.css("div:nth-child(3) .customButton:nth-child(1)")).click()
        assert(urlMatches(/\\de\\SwissDRG\\V11.0\\mdcs\\V11.0/), "matches the url for drg")
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(4) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        assert(urlMatches(/de\\TARMED\\TARMED_01.09\\tarmed_chapters\\TARMED_01.09/), "matches the url for tarmed")
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(1) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(4) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
        await driverDef.findElement(By.name("MiGeL")).click()
        await sleep(n);
        await driverDef.findElement(By.name("AL")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(4) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
        await driverDef.findElement(By.name("DRUG")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(1) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(3) .customButton:nth-child(1)")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(4) > div > .catalogButtons > .customButton:nth-child(1)")).click()
        await sleep(n);
        await driverDef.findElement(By.name("DRUG")).click()
    })
    it('icd version newer to older and back (de)', async function() {
        await driverDef.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2 * n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        {
            const element = await driverDef.findElement(By.id("buttonversion"))
            await driverDef.actions({bridge: true}).move({origin: element}).perform()
        }
        await sleep(n);
        {
            const element = await driverDef.findElement(By.id("main"))
            await driverDef.actions({bridge: true}).move({origin: element}).perform()
        }
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2021")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2020")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2018")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2015")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2013")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2011")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2008")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2019")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2021")).click()
    })
    it('changing languages', async function() {

        await driverDef.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2 * n);
        await driverDef.findElement(By.css(".language-btn:nth-child(2)")).click()
        await sleep(n);
        await driverDef.findElement(By.css(".language-btn:nth-child(3)")).click()
        await sleep(n);
        await driverDef.findElement(By.css(".language-btn:nth-child(4)")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2020")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.css(".language-btn:nth-child(3)")).click()
        await sleep(n);
        {
            const element = await driverDef.findElement(By.css(".language-btn:nth-child(2)"))
            await driverDef.actions({bridge: true}).move({origin: element}).perform()
        }
        await sleep(n);
        {
            const element = await driverDef.findElement(By.id("main"))
            await driverDef.actions({bridge: true}).move({origin: element}).perform()
        }
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.css(".language-btn:nth-child(2)")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("V8.0")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2021")).click()
        await sleep(n);

    })
    it('click from button to other buttons version', async function() {
        await driverDef.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2 * n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("CHOP_2020")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("V8.0")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("TARMED_01.09")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2019")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("CHOP")).click()
    })
    it('hover over buttons', async function() {
        await driverDef.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2 * n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("CHOP")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("SwissDRG")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("TARMED")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.name("MiGeL")).click()
        await sleep(n);
        await driverDef.findElement(By.name("AL")).click()
        await sleep(n);
        await driverDef.findElement(By.name("DRUG")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
    })
    it('clicking a version from a different catalog', async function() {
        await driverDef.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2*n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("CHOP_2020")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("V10.0")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("TARMED_01.09")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2017")).click()
        await sleep(n);
        await driverDef.findElement(By.css(".language-btn:nth-child(2)")).click()
        await sleep(n);
        {
            const element = await driverDef.findElement(By.css(".language-btn:nth-child(1)"))
            await driverDef.actions({bridge: true}).move({origin: element}).perform()
        }
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2020")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("CHOP_2020")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("V10.0")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(4) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("TARMED_01.09")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(2) > div > .catalogButtons > #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("CHOP_2020")).click()
        await sleep(n);
        await driverDef.findElement(By.css(".language-btn:nth-child(4)")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2020")).click()
        await sleep(n);
        await driverDef.findElement(By.id("buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("ICD10-GM-2022")).click()
        await sleep(n);
        await driverDef.findElement(By.css(".language-btn:nth-child(3)")).click()
        await sleep(n);
        {
            const element = await driverDef.findElement(By.id("SwissDRG"))
            await driverDef.actions({bridge: true}).move({origin: element}).perform()
        }
        await sleep(n);
        {
            const element = await driverDef.findElement(By.id("main"))
            await driverDef.actions({bridge: true}).move({origin: element}).perform()
        }
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("V10.0")).click()
    })
    it('click on logo desktop', async function() {
        await driverDef.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2*n);
        await driverDef.findElement(By.id("SwissDRG")).click()
        await sleep(n);
        await driverDef.findElement(By.css("div:nth-child(3) #buttonversion")).click()
        await sleep(n);
        await driverDef.findElement(By.id("V7.0")).click()
        await sleep(n);
        await driverDef.findElement(By.id("logo")).click()
        await sleep(n);
        await driverDef.findElement(By.id("MiGeL")).click()
        await sleep(n);
        await driverDef.findElement(By.id("logo")).click()
        await sleep(n);
    })
    it('click on logo mobile', async function() {
        await driverDef.get("http://localhost:8080/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(2*n);
        await driverDef.manage().window().setRect({ width: 400, height: 800 })
        await sleep(n);
        await driverDef.findElement(By.id("mobilebutton catalog")).click()
        await sleep(n);
        await driverDef.findElement(By.linkText("SwissDRG")).click()
        await sleep(n);
        await driverDef.findElement(By.id("mobilebutton version")).click()
        await sleep(n);
        await driverDef.findElement(By.id("V9.0")).click()
        await sleep(n);
        await driverDef.findElement(By.id("logo")).click()
        await sleep(n);
        await driverDef.findElement(By.id("mobilebutton catalog")).click()
        await sleep(n);
        await driverDef.findElement(By.linkText("MiGeL")).click()
        await sleep(n);
        await driverDef.findElement(By.id("logo")).click()
        await sleep(n);
    })
})
