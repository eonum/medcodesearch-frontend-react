import puppeteer from "puppeteer";
import packageJson from "../../package.json"

// TODO: Viewport should be set via config
describe('Code attributes test suite for desktop version and components with custom page', function () {
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

    it ('drg', async function() {
        await page.goto(baseUrl + "/de/SwissDRG/V13.0/mdcs/V13.0", {waitUntil: 'networkidle0'});
        let element = await page.$(".breadcrumb-item.active");
        let value = await page.evaluate(el => el.textContent, element);
        await expect(value).toBe("SwissDRG 13.0");
        element = await page.$("h3");
        value = await page.evaluate(el => el.textContent, element);
        await expect(value).toBe("SwissDRG 13.0");
        await page.goto(baseUrl + "/de/SwissDRG/V13.0/drgs/I06A", {waitUntil: 'networkidle0'});
        const links = await page.$$eval("a", (list) => list.map((el) => el.href));
        await expect(links).toContain("https://manual.swissdrg.org/de/13.3/drgs/I06A")
        await expect(links).toContain("https://drgdynamics.eonum.ch/drgs/name?code=I06A&version=V13.0&locale=de")
        const th = await page.$$eval("#attributesTable tr th", (ths) => ths.map((th) => (th.innerText)))
        await expect(th[0]).toBe("Eintrag aus dem Fallpauschalenkatalog");
        const tds = await page.$$eval("#attributesTable tr td", (tds) => tds.map((td) => (td.innerText)))
        await expect(tds[0]).toBe("Partition");
        await expect(tds[1]).toBe("O");
        await expect(tds[2]).toBe("Kostengewicht");
        await expect(tds[3]).toBe("8.137");
        await expect(tds[4]).toBe("Durchschnittliche Verweildauer (Tage)");
        await expect(tds[5]).toBe("17.0");
        await expect(tds[6]).toBe("Erster Tag mit Abschlag");
        await expect(tds[7]).toBe("5");
        await expect(tds[8]).toBe("Abschlag pro Tag");
        await expect(tds[9]).toBe("0.697");
        await expect(tds[10]).toBe("Erster Tag mit Zuschlag");
        await expect(tds[11]).toBe("33");
        await expect(tds[12]).toBe("Zuschlag pro Tag");
        await expect(tds[13]).toBe("0.242");
        await expect(tds[14]).toBe("Verlegungsfallpauschale");
        await expect(tds[15]).toBe("Nein (0.244)");
        await expect(tds[16]).toBe("Ausnahme von Wiederaufnahme");
        await expect(tds[17]).toBe("Nein");
        await expect(page).toMatch("Komplexe Eingriffe an der Wirbelsäule mit äusserst schweren CC und Alter < 16 Jahre oder sehr komplexe WS-Eingriffe oder intensivmedizinischer Komplexbehandlung/IMCK > 184 Aufwandspunkte oder geriatrische Akutrehabilitation ab 14 Behandlungstage")
    })

    it ('supplement', async function() {
        await page.goto(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-04.10", {waitUntil: 'networkidle0'});
        let activeElement = await page.$(".breadcrumb-item.active");
        let value = await page.evaluate(el => el.textContent, activeElement);
        await expect(value).toBe("ZE-2024-04.10");
        let otherElements = await page.$$eval(".breadcrumb-item.breadLink", (list) => list.map((el) => el.textContent));
        await expect(otherElements[0]).toBe("Zusatzentgelte 13.0");
        await expect(otherElements[1]).toBe("ZE-2024-04");
        let element = await page.$("h3");
        value = await page.evaluate(el => el.textContent, element);
        await expect(value).toBe("ZE-2024-04.10");
        let links = await page.$$eval("#siblings a", (list) => list.map((el) => el.innerText));
        await expect(links.sort()).toEqual([
            "ZE-2024-04.01 (37.52): ",
            "ZE-2024-04.04 (37.6D.11): ",
            "ZE-2024-04.05 (37.6D.24): ",
            "ZE-2024-04.05 (37.6D.22): ",
            "ZE-2024-04.05 (37.6D.23): ",
            "ZE-2024-04.08 (37.6A.11): ",
            "ZE-2024-04.08 (37.6A.12): ",
            "ZE-2024-04.09 (37.6A.21): ",
            "ZE-2024-04.13 (37.6A.35): "
            ,"ZE-2024-04.13 (37.6A.37): "
            ,"ZE-2024-04.14 (37.6A.34): "
            ,"ZE-2024-04.14 (37.6A.36): "
            ,"ZE-2024-04.15 (37.6A.3A): "
            ,"ZE-2024-04.16 (37.6A.38): "].sort());
        await page.click("#siblings ul>li:nth-child(4)> a");
        await expect(page.url()).toBe(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-04.05")
    })

    it ('rcg', async function() {
        await page.goto(baseUrl + "/de/Reha/REHA_2.0/arcgs/REHA_2.0", {waitUntil: 'networkidle0'});
        let element = await page.$(".breadcrumb-item.active");
        let value = await page.evaluate(el => el.textContent, element);
        await expect(value).toBe("ST Reha 2.0");
        element = await page.$("h3");
        value = await page.evaluate(el => el.textContent, element);
        await expect(value).toBe("ST Reha 2.0");
        await page.goto(baseUrl + "/de/Reha/REHA_2.0/rcgs/TR19A", {waitUntil: 'networkidle0'});
        let links = await page.$$eval("a", (list) => list.map((el) => el.href));
        await expect(links).toContain("https://manual.swissdrg.org/de/r2.3/rcgs/TR19A")
        const th = await page.$$eval("#attributesTable tr th", (ths) => ths.map((th) => (th.innerText)))
        await expect(th[0]).toBe("Eintrag aus dem RCG Katalog");
        const tds = await page.$$eval("#attributesTable tr td", (tds) => tds.map((td) => (td.innerText)))
        await expect(tds[0]).toBe("Anzahl Phasen");
        await expect(tds[1]).toBe("1");
        await expect(tds[2]).toBe("Tageskostengewicht von Phase 1");
        await expect(tds[3]).toBe("0.878");
        links = await page.$$eval("#siblings a", (list) => list.map((el) => el.innerText));
        await expect(links.sort()).toEqual(["TR19B: "]);
        await expect(page).toMatch("Kardiale Rehabilitation")
    })

    // TODO: Uncomment below tests as soon as code linking is properly implemented for codes with catalog switch.
    //  This was never the case until we added Supplements. There we have links to CHOP, ICD or DRG codes that trigger
    //  some state changes that have to be implemented properly.
    // it ('test constraint icds linking for supplements', async function() {
    //     await page.goto(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-30.50", {waitUntil: 'networkidle0'});
    //     let element = await page.$("#CONSTRAINT_ICDS > h5");
    //     let value = await page.evaluate(el => el.textContent, element);
    //     expect(value).toEqual("Vorausgesetzte ICD-Codes")
    //     await page.click("#CONSTRAINT_ICDS ul>li:nth-child(3)> a");
    //     await expect(page.url()).toBe(baseUrl + "/de/ICD/ICD10-GM-2022/icds/D65.2");
    // })
    //
    // it ('test constraint chop linking for supplements', async function() {
    //     await page.goto(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-108.01", {waitUntil: 'networkidle0'});
    //     let element = await page.$("#CONSTRAINT_CHOPS > h5");
    //     let value = await page.evaluate(el => el.textContent, element);
    //     expect(value).toEqual("Vorausgesetzte CHOP-Codes")
    //     await page.click("#CONSTRAINT_CHOPS ul>li:nth-child(3)> a");
    //     await expect(page.url()).toBe(baseUrl + "/de/CHOP/CHOP_2024/chops/92.26.20");
    // })
    //
    // it ('test relevant codes linking for supplements', async function() {
    //     await page.goto(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-01.01", {waitUntil: 'networkidle0'});
    //     let element = await page.$("#relevantChopCodes > h5");
    //     let value = await page.evaluate(el => el.textContent, element);
    //     expect(value).toEqual("Relevante Codes")
    //     await page.click("#relevantChopCodes ul>li:nth-child(4)> a");
    //     await expect(page.url()).toBe(baseUrl + "/de/CHOP/CHOP_2024/chops/39.95.62");
    // })
    //
    // it ('test excluded drgs linking for supplements', async function() {
    //     await page.goto(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-01.01", {waitUntil: 'networkidle0'});
    //     let element = await page.$("#EXCLUDED_DRGS > h5");
    //     let value = await page.evaluate(el => el.textContent, element);
    //     expect(value).toEqual("(Basis-)DRGs, welche die Abrechnung des ZE ausschliessen")
    //     await page.click("#EXCLUDED_DRGS ul>li:nth-child(1)>a");
    //     await expect(page.url()).toBe(baseUrl + "/de/SwissDrg/V13.0/adrgs/L60");
    // })
})
