import puppeteer from "puppeteer";
import packageJson from "../../package.json"

// TODO: Viewport should be set via config
describe('Default test suite, testing general navigation via clicks', function () {
    let browser;
    let page;
    let baseUrl = packageJson.config.testURL;
    let n = 1000;

    beforeAll(async function () {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.setViewport({width: 1366, height: 768})
    })

    afterAll(() => browser.close());

    it('clicking from one catalog to another (de)', async function () {
        await page.goto(baseUrl, {waitUntil: 'networkidle0'});
        await page.click('#ICD');
        await expect(page).toMatch('ICD10-GM')
        await expect(page).toMatch('IX: Krankheiten des Kreislaufsystems')
        await expect(page).toMatch('Untergeordnete Codes')
        await expect(page.url()).toBe(baseUrl + "/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022")
        await page.click('#CHOP');
        await expect(page).toMatch('CHOP')
        await expect(page).toMatch('C14: Operationen an den Bewegungsorganen (76–84)')
        await expect(page).toMatch('Untergeordnete Codes')
        await expect(page.url()).toBe(baseUrl + "/de/CHOP/CHOP_2022/chop_chapters/CHOP_2022")
        await page.click('#SwissDRG');
        await page.waitForTimeout(n)
        await expect(page).toMatch('SwissDRG')
        await expect(page).toMatch('MDC 22:')
        await expect(page).toMatch('Verbrennungen')
        await expect(page).toMatch('Untergeordnete Codes')
        await expect(page.url()).toBe(baseUrl + "/de/SwissDRG/V11.0/mdcs/V11.0")
        await page.click("#TARMED");
        await expect(page).toMatch('TARMED')
        await expect(page).toMatch('24: Diagnostik und Therapie des Bewegungsapparates')
        await expect(page).toMatch('Untergeordnete Codes')
        await expect(page.url()).toBe(baseUrl + "/de/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09")
        await page.click('#MiGeL');
        await expect(page).toMatch('MiGeL')
        await expect(page).toMatch('13: HOERHILFEN')
        await expect(page).toMatch('Untergeordnete Codes')
        await expect(page.url()).toMatch(baseUrl + "/de/MIGEL/migels/all")
        var element = await page.$("#datepicker_MIGEL_desktop");
        // If "#datepicker_MIGEL_desktop" not existing, element would be null.
        await expect(element).toBeTruthy()
        await page.click('#AL');
        await expect(page.url()).toMatch(baseUrl + "/de/AL/als/all")
        await expect(page).toMatch('AL')
        await expect(page).toMatch('C: Mikrobiologie')
        await expect(page).toMatch('Untergeordnete Codes')
        var element = await page.$("#datepicker_AL_desktop");
        // If "#datepicker_AL_desktop" not existing, element would be null.
        await expect(element).toBeTruthy()
    })

    it('switch ICD versions (de)', async function () {
        await page.goto(baseUrl, {waitUntil: 'networkidle0'});
        // Catalogs other than the selected one shouldn't be visible if not clicked on versions button.
        var element = await page.$("#ICD10-GM-2018");
        await expect(element).toBeNull();
        await page.click("#ICD_version_button");
        await page.click("#ICD10-GM-2018")
        await expect(page).toMatch('ICD10-GM-2018')
        await expect(page).toMatch('XV: Schwangerschaft, Geburt und Wochenbett')
        await expect(element).toBeNull();
        await page.click("#ICD_version_button");
        await page.click("#ICD10-GM-2022");
        await expect(page).toMatch('ICD10-GM-2022')
        await expect(page).toMatch('XXII: Schlüsselnummern für besondere Zwecke')
    })

    it('changing languages', async function () {
        await page.goto(baseUrl, {waitUntil: 'networkidle0'});
        await page.click(".language-btn:nth-child(2)")
        await expect(page).toMatch('Eléments subordonnés')
        await expect(page).toMatch('XIX: Lésions traumatiques, empoisonnements et certaines autres conséquences de causes externes')
        await page.click(".language-btn:nth-child(3)")
        await expect(page).toMatch('Elementi subordinati')
        await expect(page).toMatch('XVIII: Sintomi, segni e risultati anormali di esami clinici e di laboratorio, non classificati altrove')
        await page.click(".language-btn:nth-child(4)")
        await expect(page).toMatch('Subordinate codes')
        await expect(page).toMatch('VII: Diseases of the eye and adnexa')
        // Clicks on first ICD Chapter
        await page.click(".link")
        await expect(page).toMatch('Certain infectious and parasitic diseases')
        await expect(page).toMatch('A50-A64: Infections with a predominantly sexual mode of transmission')
        // Click on french button
        await page.click(".language-btn:nth-child(2)")
        await expect(page).toMatch('Certaines maladies infectieuses et parasitaires')
    })

    it('moving from a specific catalog version to other versions of other catalogs', async function() {
        await page.goto(baseUrl, {waitUntil: 'networkidle0'});
        // Move from ICD 2022 to CHOP 2020
        await page.click("#CHOP_version_button");
        await page.click("#CHOP_2020");
        await expect(page).toMatch("CHOP 2020")
        // Move to DRG V8.0
        await page.click("#SwissDRG_version_button")
        await page.click("#V80")
        await page.waitForTimeout(n);
        await expect(page).toMatch("SwissDRG 8.0")
        // Move to AL
        await page.click("#AL")
        await expect(page).toMatch("A: Chemie/Hämatologie/Immunologie")
        // Move to ICD 2016
        await page.click("#ICD_version_button");
        await page.click("#ICD10-GM-2016");
        await page.click("#ICD_version_button");
        await expect(page).toMatch("ICD10-GM-2016")
    })

    it('go to base url when clicking on logo', async function() {
        await page.goto(baseUrl + '/de/SwissDRG/V4.0/mdcs/V4.0', {waitUntil: 'networkidle0'});
        await expect(page).toMatch("SwissDRG 4.0");
        await page.click("#logo");
        await expect(page).toMatch("ICD10-GM-");
    })

    it('icd clicking from I to A00.0 (de, 2022)', async function() {
        await page.goto(baseUrl + "/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022", {waitUntil: 'networkidle0'})
        // Click on I (first ICD chapter).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Bestimmte infektiöse und parasitäre Krankheiten")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_chapters/I')
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Infektiöse Darmkrankheiten")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A00')
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera durch Vibrio cholerae O:1, Biovar cholerae")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A00.0')
        // Click on A00.1 (first sibling).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera durch Vibrio cholerae O:1, Biovar eltor")
        await expect(page.url()).toBe(baseUrl + '/de/ICD/ICD10-GM-2022/icds/A00.1')
    })

    it('icd clicking from I to A00.0 (fr, 2022)', async function() {
        await page.goto(baseUrl + "/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022", {waitUntil: 'networkidle0'})
        // Click on I (first ICD chapter).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Certaines maladies infectieuses et parasitaires")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icd_chapters/I')
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Maladies intestinales infectieuses")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Choléra")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icds/A00')
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("A Vibrio cholerae 01, biovar cholerae")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icds/A00.0')
        // Click on A00.1 (first sibling).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("A Vibrio cholerae 01, biovar El Tor")
        await expect(page.url()).toBe(baseUrl + '/fr/ICD/ICD10-GM-2022/icds/A00.1')
    })

    it('icd clicking from I to A00.0 (it, 2022)', async function() {
        await page.goto(baseUrl + "/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022", {waitUntil: 'networkidle0'})
        // Click on I (first ICD chapter).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Alcune malattie infettive e parassitarie")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icd_chapters/I')
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Malattie infettive intestinali")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Colera")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icds/A00')
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Colera da Vibrio cholerae O:1, biotipo del colera")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icds/A00.0')
        // Click on A00.1 (first sibling).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Colera da Vibrio cholerae O:1, biotipo El Tor")
        await expect(page.url()).toBe(baseUrl + '/it/ICD/ICD10-GM-2022/icds/A00.1')
    })

    it('icd clicking from I to A00.0 (en, 2022)', async function() {
        await page.goto(baseUrl + "/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022", {waitUntil: 'networkidle0'})
        // Click on I (first ICD chapter).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Certain infectious and parasitic diseases")
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icd_chapters/I')
        // Click on A00-A09 (first group of ICD Chapter I).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Intestinal infectious diseases")
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icd_groups/A00-A09')
        // Click on A00 (first nonterminal of icd group A00-A09).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera")
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icds/A00')
        // Click on A00.0 (first code of ICD nonterminal A00).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera due to Vibrio cholerae 01, biovar cholerae")
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icds/A00.0')
        // Click on A00.1 (first sibling).
        await page.waitForSelector("ul>li:first-child>a")
        await page.click("ul>li:first-child>a")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Cholera due to Vibrio cholerae 01, biovar eltor")
        await expect(page.url()).toBe(baseUrl + '/en/ICD/ICD10-GM-2022/icds/A00.1')
    })

    it ('available and enabled attributes are displayed', async function() {
        await page.goto(baseUrl + "/de/MIGEL/migels/10.01.01.00.1", {waitUntil: 'networkidle0'})
        await expect(page).toMatch("Krücken für Erwachsene, ergonomischer Griff, Kauf")
        await expect(page).toMatch("Limitation")
        await expect(page).toMatch("Gültig ab")
        await expect(page).toMatch("HVB Pflege: Vergütung nur bei Anwendung durch Pflegefachfrauen und Pflegefachmänner die den Beruf selbständig und auf eigene Rechnung ausüben")
        await expect(page).toMatch("Einheit")
        await expect(page).toMatch("1 Paar")
        await expect(page).toMatch("Zuletzt geändert")
        await expect(page).toMatch("Ähnliche Codes")
    })

    it ('show new code information', async function() {
        await page.goto(baseUrl + '/de/CHOP/CHOP_2022/chops/00.4I.11?query=00.4I.11', {waitUntil: 'networkidle0'})
        await expect(page).toMatch("Dies ist ein Neukode, der keine Vorgängercodes in Vorversionen hat.")
        await page.goto(baseUrl + '/de/ICD/ICD10-GM-2021/icds/U13.5?query=u13.5', {waitUntil: 'networkidle0'})
        await expect(page).toMatch("Dies ist ein Neukode, der keine Vorgängercodes in Vorversionen hat.")
        await page.goto(baseUrl + '/de/ICD/ICD10-GM-2011/icds/R11?query=r11', {waitUntil: 'networkidle0'})
        await expect(page).not.toMatch("Dies ist ein Neukode, der keine Vorgängercodes in Vorversionen hat.")
        await page.goto(baseUrl + '/de/ICD/ICD10-GM-2021/icds/N19?query=N19', {waitUntil: 'networkidle0'})
        await expect(page).not.toMatch("Dies ist ein Neukode, der keine Vorgängercodes in Vorversionen hat.")
    })
})
