import { expect, test } from '@playwright/test';
import { contains, latestVersion } from './helpers';

test.describe('General navigation via clicks (desktop)', () => {
    let latestIcd: string;
    let latestChop: string;
    let latestDrg: string;

    test.beforeAll(async () => {
        [latestIcd, latestChop, latestDrg] = await Promise.all(['icds', 'chops', 'drgs'].map(t => latestVersion(t)));
    });

    test('clicking from one catalog to another (de)', async ({ page }) => {
        await page.goto('/');
        await contains(page, 'ICD10-GM');
        await contains(page, 'IX: Krankheiten des Kreislaufsystems');
        await contains(page, 'Untergeordnete Codes');
        await expect(page).toHaveURL(`/de/ICD/${latestIcd}/icd_chapters/${latestIcd}`);

        await page.locator('#catalog_button').click();
        await page.locator('#CHOP_button').click();
        await contains(page, 'C14: Operationen am Bewegungsapparat');
        await contains(page, 'Untergeordnete Codes');
        await expect(page).toHaveURL(`/de/CHOP/${latestChop}/chop_chapters/${latestChop}`);

        await page.locator('#catalog_button').click();
        await page.locator('#SwissDRG_button').click();
        await contains(page, 'MDC 22:');
        await contains(page, 'Verbrennungen');
        await expect(page).toHaveURL(`/de/SwissDRG/${latestDrg}/mdcs/${latestDrg}`);

        await page.locator('#catalog_button').click();
        await page.locator('#TARMED_button').click();
        await contains(page, '24: Diagnostik und Therapie des Bewegungsapparates');
        await expect(page).toHaveURL('/de/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09');

        await page.locator('#catalog_button').click();
        await page.locator('#MIGEL_button').click();
        await contains(page, 'MiGeL');
        await contains(page, '13: HOERHILFEN');
        await expect(page).toHaveURL(/\/de\/MIGEL\/migels\/all/);
        await expect(page.locator('#datepicker')).toBeAttached();

        await page.locator('#catalog_button').click();
        await page.locator('#AL_button').click();
        await expect(page).toHaveURL(/\/de\/AL\/als\/all/);
        await contains(page, 'C: Mikrobiologie');
        await contains(page, 'Untergeordnete Codes');
        await expect(page.locator('#datepicker')).toBeAttached();
    });

    test('switch ICD versions (de)', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#ICD10-GM-2018')).toHaveCount(0);
        await page.locator('#version_button').click();
        await page.locator('#ICD10-GM-2018').click();
        await contains(page, 'ICD10-GM-2018');
        await contains(page, 'XV: Schwangerschaft, Geburt und Wochenbett');
        await page.locator('#version_button').click();
        await page.locator(`#${latestIcd}`).click();
        await contains(page, latestIcd);
        await contains(page, 'XXII: Schlüsselnummern für besondere Zwecke');
    });

    test('changing languages', async ({ page }) => {
        await page.goto('/');
        await page.locator('.language-btn:nth-child(2)').click();
        await contains(page, 'Eléments subordonnés');
        await contains(page, 'XIX: Lésions traumatiques, empoisonnements et certaines autres conséquences de causes externes');
        await page.locator('.language-btn:nth-child(3)').click();
        await contains(page, 'Elementi subordinati');
        await contains(page, 'XVIII: Sintomi, segni e risultati anormali di esami clinici e di laboratorio, non classificati altrove');
        await page.locator('.language-btn:nth-child(4)').click();
        await contains(page, 'Subordinate codes');
        await contains(page, 'VII: Diseases of the eye and adnexa');
        await page.locator('ul>li:nth-child(1)>.link').first().click();
        await contains(page, 'Certain infectious and parasitic diseases');
        await contains(page, 'A50-A64: Infections with a predominantly sexual mode of transmission');
        await page.locator('.language-btn:nth-child(2)').click();
        await contains(page, 'Certaines maladies infectieuses et parasitaires');
    });

    test('moving from a specific catalog version to other versions of other catalogs', async ({ page }) => {
        await page.goto('/');
        await page.locator('#catalog_button').click();
        await page.locator('#CHOP_button').click();
        await page.locator('#version_button').click();
        await page.locator('#CHOP_2020').click();
        await contains(page, 'CHOP 2020');
        await page.locator('#catalog_button').click();
        await page.locator('#SwissDRG_button').click();
        await page.locator('#version_button').click();
        await page.locator('#V80').click();
        await contains(page, 'SwissDRG 8.0');
        await page.locator('#catalog_button').click();
        await page.locator('#AL_button').click();
        await contains(page, 'A: Chemie/Hämatologie/Immunologie');
        await page.locator('#catalog_button').click();
        await page.locator('#ICD_button').click();
        await page.locator('#version_button').click();
        await page.locator('#ICD10-GM-2016').click();
        await contains(page, 'ICD10-GM-2016');
    });
});
