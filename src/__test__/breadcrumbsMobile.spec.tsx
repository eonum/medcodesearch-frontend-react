import puppeteer from "puppeteer";
import packageJson from "../../package.json"

// TODO: We use 4 seconds sleep after await page.goto(baseUrl) since we didn't integrate waiting for page to load all
//  catalogs before clicking is allowed.
// TODO: Viewport should be set via config
describe('Breadcrumb test suite for mobile version', function () {
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

    it('clicking from DRG G72B to base chapter via breadcrumbs (de)', async function () {
        //Move to G72B
        await page.goto(baseUrl + '/de/SwissDRG/V10.0/drgs/G72B', {waitUntil: 'networkidle0'})
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(4)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Andere leichte bis moderate Erkrankungen der Verdauungsorgane oder Abdominalschmerz oder mesenteriale Lymphadenitis")
        await expect(page.url()).toBe(baseUrl + '/de/SwissDRG/V10.0/adrgs/G72')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(3)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("MDC 06 Medizinische Partition")
        await expect(page.url()).toBe(baseUrl + '/de/SwissDRG/V10.0/partitions/G_M')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(2)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Krankheiten und Störungen der Verdauungsorgane")
        await expect(page.url()).toBe(baseUrl + '/de/SwissDRG/V10.0/mdcs/06')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(1)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("SwissDRG 10.0")
        await expect(page.url()).toBe(baseUrl + '/de/SwissDRG/V10.0/mdcs/V10.0')
    })

    it('clicking from DRG G72B to base chapter via breadcrumbs (fr)', async function () {
        //Move to G72B
        await page.goto(baseUrl + '/fr/SwissDRG/V10.0/drgs/G72B', {waitUntil: 'networkidle0'})
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(4)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Autres affections bénignes à modérées des organes digestifs ou douleur abdominale ou adénite mésentérique")
        await expect(page.url()).toBe(baseUrl + '/fr/SwissDRG/V10.0/adrgs/G72')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(3)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("MDC 06 Partition médicale")
        await expect(page.url()).toBe(baseUrl + '/fr/SwissDRG/V10.0/partitions/G_M')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(2)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Maladies et troubles des organes digestifs")
        await expect(page.url()).toBe(baseUrl + '/fr/SwissDRG/V10.0/mdcs/06')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(1)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("SwissDRG 10.0")
        await expect(page.url()).toBe(baseUrl + '/fr/SwissDRG/V10.0/mdcs/V10.0')
    })

    it('clicking from DRG G72B to base chapter via breadcrumbs (it)', async function () {
        //Move to G72B
        await page.goto(baseUrl + '/it/SwissDRG/V10.0/drgs/G72B', {waitUntil: 'networkidle0'})
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(4)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Altre malattie da lievi a moderate dell'apparato digerente o dolore addominale o linfadenite mesenterica")
        await expect(page.url()).toBe(baseUrl + '/it/SwissDRG/V10.0/adrgs/G72')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(3)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("MDC 06 Partizione medica")
        await expect(page.url()).toBe(baseUrl + '/it/SwissDRG/V10.0/partitions/G_M')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(2)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Malattie e disturbi dell'apparato digerente")
        await expect(page.url()).toBe(baseUrl + '/it/SwissDRG/V10.0/mdcs/06')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(1)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("SwissDRG 10.0")
        await expect(page.url()).toBe(baseUrl + '/it/SwissDRG/V10.0/mdcs/V10.0')
    })

    it('clicking from MiGel 13.01.01.00.1 to base via breadcrumbs (de)', async function () {
        //Move to G72B
        await page.goto(baseUrl + '/de/MIGEL/migels/13.01.01.00.1', {waitUntil: 'networkidle0'})
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(3)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("Hörgeräte")
        await expect(page.url()).toBe(baseUrl + '/de/MIGEL/migels/13.01')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(2)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("HOERHILFEN")
        await expect(page.url()).toBe(baseUrl + '/de/MIGEL/migels/13')
        // Move one level up via breadcrumb.
        await page.click("ol>li.breadcrumb-item:nth-child(1)")
        await page.waitForTimeout(n);
        await expect(page).toMatch("MiGeL")
        await expect(page.url()).toBe(baseUrl + '/de/MIGEL/migels/MIGEL')
    })
})
