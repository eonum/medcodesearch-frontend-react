import puppeteer from "puppeteer";
import packageJson from "../../package.json"

// TODO: Viewport should be set via config
describe('Code attributes test suite for mobile version', function () {
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

    it ('available and enabled attributes are displayed', async function() {
        await page.goto(baseUrl + "/de/MIGEL/migels/10.01.01.00.1", {waitUntil: 'networkidle0'})
        await expect(page).toMatch("Krücken für Erwachsene, ergonomischer Griff, Kauf")
        await expect(page).toMatch("Limitation")
        let element = await page.$("#limitation_attribute_value")
        let value = await page.evaluate(el => el.textContent, element)
        await expect(value).toBe("HVB Pflege: Vergütung nur bei Anwendung durch Pflegefachfrauen und Pflegefachmänner die den Beruf selbständig und auf eigene Rechnung ausüben")
        await expect(page).toMatch("Einheit")
        element = await page.$("#unit_attribute_value")
        value = await page.evaluate(el => el.textContent, element)
        await expect(value).toBe("1 Paar")
        await expect(page).toMatch("Ähnliche Codes")
        await expect(page).toMatch("Höchstvergütungsbetrag (HVB) Selbstanwendung (CHF)")
        element = await page.$("#hvb_self_attribute_value")
        value = await page.evaluate(el => el.textContent, element)
        await expect(value).toBe("35")
        await expect(page).toMatch("Höchstvergütungsbetrag (HVB) Pflege (CHF)")
        element = await page.$("#hvb_care_attribute_value")
        value = await page.evaluate(el => el.textContent, element)
        await expect(value).toBe("29.75")
        await expect(page).toMatch("Zuletzt auf medcodesearch.ch aktualisiert")
        await expect(page).toMatch("Gültig ab")
        await expect(page).toMatch("Gültig bis")
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
