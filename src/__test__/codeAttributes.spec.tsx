import puppeteer from "puppeteer";
import packageJson from "../../package.json"

// TODO: Viewport should be set via config
describe('Code attributes test suite for desktop version', function () {
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
        await expect(value).toBe("35.13")
        await expect(page).toMatch("Höchstvergütungsbetrag (HVB) Pflege (CHF)")
        element = await page.$("#hvb_care_attribute_value")
        value = await page.evaluate(el => el.textContent, element)
        await expect(value).toBe("29.86")
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

    it ('show drg code information', async function () {
        await page.goto(baseUrl + '/de/SwissDRG/V12.0/drgs/B02A?query=A06A', {waitUntil: 'networkidle0'})
        await expect(page).toMatch("Durchschnittliche Verweildauer (Tage)")
        await expect(page).toMatch("15")
        await expect(page).toMatch("Erster Tag mit Abschlag")
        await expect(page).toMatch("4")
        await expect(page).toMatch("Abschlag pro Tag")
        await expect(page).toMatch("0.845")
        await expect(page).toMatch("Erster Tag mit Zuschlag")
        await expect(page).toMatch("29")
        await expect(page).toMatch("Zuschlag pro Tag")
        await expect(page).toMatch("0.289")

        await page.goto(baseUrl + '/fr/SwissDRG/V12.0/drgs/B02A?query=A06A', {waitUntil: 'networkidle0'})
        await expect(page).toMatch("Durée de séjour moyenne (journées)")
        await expect(page).toMatch("Premier jour avec réduction")
        await expect(page).toMatch("Réduction journalier")
        await expect(page).toMatch("Premier jour avec supplément")
        await expect(page).toMatch("Supplément journalier")

        await page.goto(baseUrl + '/it/SwissDRG/V12.0/drgs/B02A?query=A06A', {waitUntil: 'networkidle0'})
        await expect(page).toMatch("Durata media di degenza (giorni)")
        await expect(page).toMatch("Primo giorno con riduzione")
        await expect(page).toMatch("Tasso di riduzione giornaliero")
        await expect(page).toMatch("Primo giorno con supplemento")
        await expect(page).toMatch("Supplemento giornaliero")
        await expect(page).toMatch("Elementi simili")
    })

    it ('SL code information', async function() {
        await page.goto(baseUrl + '/de/DRUG/drugs/7680650440086?', {waitUntil: 'networkidle0'})
        await expect(page).toMatch("Diese Packung wurde aus der Spezialitätenliste gestrichen. " +
            "Die angezeigten Daten entsprechen dem letzten Stand.")
        expect(await page.$eval("#SL_status", (e) => e.textContent)).toContain(
            "Status: SL");
        expect(await page.$eval("#SL_public_price", (e) => e.textContent)).toContain(
            "Publikumspreis (CHF): 56.25");
        expect(await page.$eval("#SL_date_added_in_sl", (e) => e.textContent)).toContain(
            "Zur SL hinzugefügt: 01.09.2014");
        expect(await page.$eval("#SL_date_deleted_from_sl", (e) => e.textContent)).toContain(
            "Datum der Streichung aus SL: 01.02.2023");
        expect(await page.$eval("#SL_date_compulsatory_until", (e) => e.textContent)).toContain(
            "Kassenpflichtig bis: 30.04.2023");
        expect(await page.$eval("#SL_has_limitation", (e) => e.textContent)).toContain(
            "Limitation: Nein");
        expect(await page.$eval("#SL_is_generica", (e) => e.textContent)).toContain(
            "Generika: Ja");
    })
})
