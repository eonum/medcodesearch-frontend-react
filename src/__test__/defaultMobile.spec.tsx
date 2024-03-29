import puppeteer from "puppeteer";
import packageJson from "../../package.json"

// TODO: Viewport should be set via config
describe('Default test suite for mobile version, testing general navigation via clicks', function () {
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

    it('click on logo mobile', async function() {
        await page.goto(baseUrl + '/de/SwissDRG/V4.0/mdcs/V4.0', {waitUntil: 'networkidle0'});
        await expect(page).toMatch("SwissDRG 4.0");
        await page.click("#logo");
        // TODO: Adapt when new ICD version seeded.
        await expect(page).toMatch("ICD10-GM-2022");
    })

    it('click through mobile buttons (de)', async function() {
        // Load base URL
        await page.goto(baseUrl, {waitUntil: 'networkidle0'})
        // Change to CHOP 2016.
        await page.click("#catalog_button", {visible: true})
        await page.click("#CHOP_button");
        await page.click("#version_button", {visible: true});
        await page.waitForSelector("#CHOP_2016", {visible: true});
        await page.click("#CHOP_2016");
        await page.waitForTimeout(n);
        await expect(page).toMatch("CHOP 2016")
        await expect(page.url()).toBe(baseUrl + '/de/CHOP/CHOP_2016/chop_chapters/CHOP_2016')
        // Change to CHOP 2020.
        await page.click("#version_button", {visible: true});
        await page.waitForSelector("#CHOP_2020", {visible: true});
        await page.click("#CHOP_2020");
        await page.waitForTimeout(n);
        await expect(page).toMatch("CHOP 2020")
        await expect(page.url()).toBe(baseUrl + '/de/CHOP/CHOP_2020/chop_chapters/CHOP_2020')
        // Change to Swissdrg V7.0.
        await page.click("#catalog_button", {visible: true})
        await page.click("#SwissDRG_button", {visible: true})
        await page.click("#version_button", {visible: true});
        await page.waitForSelector("#V70", {visible: true})
        await page.click("#V70")
        await page.waitForTimeout(n);
        await expect(page).toMatch("SwissDRG 7.0")
        await expect(page.url()).toBe(baseUrl + '/de/SwissDRG/V7.0/mdcs/V7.0')
        // Change to TARMED.
        await page.click("#catalog_button", {visible: true})
        await page.click("#TARMED_button")
        await page.waitForTimeout(n);
        await expect(page).toMatch("TARMED")
        await expect(page.url()).toBe(baseUrl + '/de/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09')
    })

    it('icd clicking from I to A00.0 (de, 2022)', async function () {
        await page.goto(baseUrl + "/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        // Without specifying n-th child, ul>li>a applies for first child.
        // Click on I (first ICD chapter).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Bestimmte infektiöse und parasitäre Krankheiten")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/I')
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.waitForSelector("ul>li>a", {visible: true});
        // We have to scroll down one window height since otherwise selector is out of viewport...
        await page.evaluate( () => {
            window.scrollBy(0, window.innerHeight);
        });
        await page.waitForTimeout(n);
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Infektiöse Darmkrankheiten")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A00')
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera durch Vibrio cholerae O:1, Biovar cholerae")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A00.0')
        // Click on A00.1 (first sibling).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera durch Vibrio cholerae O:1, Biovar eltor")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A00.1')
    })

    it('icd clicking from I to A00.0 (fr, 2022)', async function () {
        await page.goto(baseUrl + "/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022", {waitUntil: 'networkidle0'})
        // Click on I (first ICD chapter).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Certaines maladies infectieuses et parasitaires")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icd_chapters/I')
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.waitForSelector("ul>li>a", {visible: true});
        // We have to scroll down one window height since otherwise selector is out of viewport...
        await page.evaluate( () => {
            window.scrollBy(0, window.innerHeight);
        });
        await page.waitForTimeout(n);
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Maladies intestinales infectieuses")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Choléra")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icds/A00')
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("A Vibrio cholerae 01, biovar cholerae")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icds/A00.0')
        // Click on A00.1 (first sibling).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("A Vibrio cholerae 01, biovar El Tor")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icds/A00.1')
    })

    it('icd clicking from I to A00.0 (it, 2022)', async function () {
        await page.goto(baseUrl + "/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022", {waitUntil: 'networkidle0'})
        // Click on I (first ICD chapter).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Alcune malattie infettive e parassitarie")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icd_chapters/I')
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.waitForSelector("ul>li>a", {visible: true});
        // We have to scroll down one window height since otherwise selector is out of viewport...
        await page.evaluate( () => {
            window.scrollBy(0, window.innerHeight);
        });
        await page.waitForTimeout(n);
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Malattie infettive intestinali")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Colera")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icds/A00')
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Colera da Vibrio cholerae O:1, biotipo del colera")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icds/A00.0')
        // Click on A00.1 (first sibling).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Colera da Vibrio cholerae O:1, biotipo El Tor")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icds/A00.1')
    })

    it('icd clicking from I to A00.0 (en, 2022)', async function () {
        await page.goto(baseUrl + "/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022", {waitUntil: 'networkidle0'})
        // Click on I (first ICD chapter).
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Certain infectious and parasitic diseases")
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icd_chapters/I')
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Intestinal infectious diseases")
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera")
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icds/A00')
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icds/A00.0')
        await expect(page).toMatch("Cholera due to Vibrio cholerae 01, biovar cholerae")
        // Click on A00.1 (first sibling).
        await page.waitForSelector("ul>li>a", {visible: true});
        await page.click("ul>li>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera due to Vibrio cholerae 01, biovar eltor")
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icds/A00.1')
    })

    // If last ICD version is newer than 2022, this test has to be adapted.
    it ('call to base URL', async function() {
        await page.goto(baseUrl, {waitUntil: 'networkidle0'})
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022')
    })
})
