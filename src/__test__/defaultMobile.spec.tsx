import puppeteer from "puppeteer";
import {n, sleep} from "../setupTests";
import packageJson from "../../package.json"

// TODO: We use 4 seconds sleep after await page.goto(baseUrl) since we didn't integrate waiting for page to load all
//  catalogs before clicking is allowed.
// TODO: Viewport should be set via config
describe('Default test suite for mobile version, testing general navigation via clicks', function () {
    let browser;
    let page;
    let baseUrl = packageJson.config.testURL;

    beforeAll(async function () {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.setViewport({width: 400, height: 800})
    })

    afterAll(() => browser.close());

    it('click on logo mobile', async function() {
        await page.goto(baseUrl + '/de/SwissDRG/V4.0/mdcs/V4.0');
        await sleep(4*n);
        await expect(page).toMatch("SwissDRG 4.0");
        await page.click("#logo");
        await expect(page).toMatch("ICD10-GM-");
    })

    it('click through mobile buttons (de)', async function() {
        // Load base URL
        await page.goto(baseUrl)
        await sleep(4*n);
        // Click on catalog button and select CHOP from dropdown.
        await page.click("#mobilebutton\\ catalog")
        await page.click(".dropdown.dropdown-menu.show>a#CHOP");
        await sleep(n);
        // Click on version button and select 2016 from dropdown.
        await page.click("#mobilebutton\\ version");
        await page.click("#CHOP_2016");
        await sleep(2*n);
        await expect(page.url()).toBe(baseUrl + '/de/CHOP/CHOP_2016/chop_chapters/CHOP_2016')
        await expect(page).toMatch("CHOP 2016")
        // Click on version button and select 2020 from dropdown.
        await page.click("#mobilebutton\\ version")
        await page.click("#CHOP_2020")
        await sleep(2*n);
        await expect(page.url()).toBe(baseUrl + '/de/CHOP/CHOP_2020/chop_chapters/CHOP_2020')
        await expect(page).toMatch("CHOP 2020")
        // Change to Swissdrg V7.0.
        await page.click("#mobilebutton\\ catalog")
        await page.click(".dropdown.dropdown-menu.show>a#SwissDRG")
        await sleep(n);
        // Click on version button and select V7.0 from dropdown.
        await page.click("#mobilebutton\\ version")
        await page.click("#V7\\.0")
        await sleep(n);
        await expect(page.url()).toBe(baseUrl + '/de/SwissDRG/V7.0/mdcs/V7.0')
        await expect(page).toMatch("SwissDRG 7.0")
        // Click on version button and select V7.0 from dropdown.
        await page.click("#mobilebutton\\ catalog")
        await page.click(".dropdown.dropdown-menu.show>a#TARMED")
        await sleep(n);
        await expect(page.url()).toBe(baseUrl + '/de/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09')
        await expect(page).toMatch("TARMED")
    })

    it('icd clicking from I to A00.0 (de, 2022)', async function () {
        await page.goto(baseUrl + "/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(4 * n);
        // Click on I (first ICD chapter).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/I')
        await expect(page).toMatch("Bestimmte infektiöse und parasitäre Krankheiten")
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        await expect(page).toMatch("Infektiöse Darmkrankheiten")
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A00')
        await expect(page).toMatch("Cholera")
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A00.0')
        await expect(page).toMatch("Cholera durch Vibrio cholerae O:1, Biovar cholerae")
        // Click on A00.1 (first sibling).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A00.1')
        await expect(page).toMatch("Cholera durch Vibrio cholerae O:1, Biovar eltor")
    })

    it('icd clicking from I to A00.0 (fr, 2022)', async function () {
        await page.goto(baseUrl + "/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(4 * n);
        // Click on I (first ICD chapter).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icd_chapters/I')
        await expect(page).toMatch("Certaines maladies infectieuses et parasitaires")
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        await expect(page).toMatch("Maladies intestinales infectieuses")
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icds/A00')
        await expect(page).toMatch("Choléra")
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icds/A00.0')
        await expect(page).toMatch("A Vibrio cholerae 01, biovar cholerae")
        // Click on A00.1 (first sibling).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icds/A00.1')
        await expect(page).toMatch("A Vibrio cholerae 01, biovar El Tor")
    })

    it('icd clicking from I to A00.0 (it, 2022)', async function () {
        await page.goto(baseUrl + "/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(4 * n);
        // Click on I (first ICD chapter).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icd_chapters/I')
        await expect(page).toMatch("Alcune malattie infettive e parassitarie")
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        await expect(page).toMatch("Malattie infettive intestinali")
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icds/A00')
        await expect(page).toMatch("Colera")
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icds/A00.0')
        await expect(page).toMatch("Colera da Vibrio cholerae O:1, biotipo del colera")
        // Click on A00.1 (first sibling).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icds/A00.1')
        await expect(page).toMatch("Colera da Vibrio cholerae O:1, biotipo El Tor")
    })

    it('icd clicking from I to A00.0 (en, 2022)', async function () {
        await page.goto(baseUrl + "/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await sleep(4 * n);
        // Click on I (first ICD chapter).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icd_chapters/I')
        await expect(page).toMatch("Certain infectious and parasitic diseases")
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        await expect(page).toMatch("Intestinal infectious diseases")
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icds/A00')
        await expect(page).toMatch("Cholera")
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icds/A00.0')
        await expect(page).toMatch("Cholera due to Vibrio cholerae 01, biovar cholerae")
        // Click on A00.1 (first sibling).
        await page.click("ul>li:first-child>a")
        await sleep(2 * n)
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icds/A00.1')
        await expect(page).toMatch("Cholera due to Vibrio cholerae 01, biovar eltor")
    })
})
