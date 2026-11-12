import { expect, Page, test } from '@playwright/test';
import { contains, fetchJson } from './helpers';

/**
 * Reads the inner texts of all elements matching the selector, after waiting for the first one.
 */
async function texts(page: Page, selector: string): Promise<string[]> {
    const locator = page.locator(selector);
    await expect(locator.first()).toBeVisible();
    return locator.allInnerTexts();
}

test.describe('Code attributes for components with custom pages', () => {
    let drgI06A: any;

    test.beforeAll(async () => {
        drgI06A = await fetchJson('/de/drgs/V13.0/I06A?show_detail=1');
    });

    test('drg', async ({ page }) => {
        await page.goto('/de/SwissDRG/V13.0/mdcs/V13.0');
        await expect(page.locator('.breadcrumb-item.active')).toHaveText('SwissDRG 13.0');
        await expect(page.locator('h3')).toHaveText('SwissDRG 13.0');

        await page.goto('/de/SwissDRG/V13.0/drgs/I06A');
        await expect(page.locator('#drgOnlineManualLink')).toHaveAttribute('href', 'https://manual.swissdrg.org/de/13.3/drgs/I06A');
        await expect(page.locator('#drgDynamicsLink')).toHaveAttribute('href', 'https://drgdynamics.eonum.ch/drgs/name?code=I06A&version=V13.0&locale=de');

        const ths = await texts(page, '#attributesTable tr th');
        expect(ths[0]).toBe('Eintrag aus dem Fallpauschalenkatalog');

        // Rows alternate: label, value, label, value, ...
        const tds = await texts(page, '#attributesTable tr td');
        const table: Record<string, string> = {};
        for (let i = 0; i < tds.length - 1; i += 2) table[tds[i]] = tds[i + 1];
        expect(table['Partition']).toBe(drgI06A.partition_letter);
        expect(table['Kostengewicht']).toBe(drgI06A.cost_weight.toFixed(3));
        expect(table['Durchschnittliche Verweildauer (Tage)']).toBe(drgI06A.average_stay_duration.toFixed(1));
        expect(table['Erster Tag mit Abschlag']).toBe(String(drgI06A.first_day_discount));
        expect(table['Abschlag pro Tag']).toBe(drgI06A.discount_per_day.toFixed(3));
        expect(table['Erster Tag mit Zuschlag']).toBe(String(drgI06A.first_day_surcharge));
        expect(table['Zuschlag pro Tag']).toBe(drgI06A.surcharge_per_day.toFixed(3));
        expect(table['Verlegungsabschlag pro Tag']).toBe(drgI06A.transfer_discount.toFixed(3));
        expect(table['Ausnahme von Wiederaufnahme']).toBe(drgI06A.exception_from_reuptake ? 'Ja' : 'Nein');

        await contains(page, 'Komplexe Eingriffe an der Wirbelsäule mit äusserst schweren CC und Alter < 16 Jahre oder sehr komplexe WS-Eingriffe oder intensivmedizinischer Komplexbehandlung/IMCK > 184 Aufwandspunkte oder geriatrische Akutrehabilitation ab 14 Behandlungstage');
    });

    test('supplement', async ({ page }) => {
        await page.goto('/de/Supplements/V13.0/supplements/ZE-2024-04.10');
        await expect(page.locator('.breadcrumb-item.active')).toHaveText('ZE-2024-04.10');
        await expect(page.locator('.breadcrumb-item.breadLink')).toHaveText(['Zusatzentgelte 13.0', 'ZE-2024-04']);
        await expect(page.locator('h3')).toHaveText('ZE-2024-04.10');

        const links = await texts(page, '#siblings a');
        expect(links.sort()).toEqual([
            'ZE-2024-04.01 (37.52): ',
            'ZE-2024-04.04 (37.6D.11): ',
            'ZE-2024-04.05 (37.6D.24): ',
            'ZE-2024-04.05 (37.6D.22): ',
            'ZE-2024-04.05 (37.6D.23): ',
            'ZE-2024-04.08 (37.6A.11): ',
            'ZE-2024-04.08 (37.6A.12): ',
            'ZE-2024-04.09 (37.6A.21): ',
            'ZE-2024-04.13 (37.6A.35): ',
            'ZE-2024-04.13 (37.6A.37): ',
            'ZE-2024-04.14 (37.6A.34): ',
            'ZE-2024-04.14 (37.6A.36): ',
            'ZE-2024-04.15 (37.6A.3A): ',
            'ZE-2024-04.16 (37.6A.38): ',
        ].sort());

        await page.locator('#siblings ul>li:nth-child(4)> a').click();
        await expect(page).toHaveURL('/de/Supplements/V13.0/supplements/ZE-2024-04.05');
    });

    test('rcg', async ({ page }) => {
        await page.goto('/de/Reha/REHA_2.0/arcgs/REHA_2.0');
        await expect(page.locator('.breadcrumb-item.active')).toHaveText('ST Reha 2.0');
        await expect(page.locator('h3')).toHaveText('ST Reha 2.0');

        await page.goto('/de/Reha/REHA_2.0/rcgs/TR19A');
        await expect(page.locator('#rcgOnlineManualLink')).toHaveAttribute('href', 'https://manual.swissdrg.org/de/r2.3/rcgs/TR19A');

        const ths = await texts(page, '#attributesTable tr th');
        expect(ths[0]).toBe('Eintrag aus dem RCG Katalog');
        const tds = await texts(page, '#attributesTable tr td');
        expect(tds.slice(0, 4)).toEqual(['Anzahl Phasen', '1', 'Tageskostengewicht von Phase 1', '0.878']);

        expect(await texts(page, '#siblings a')).toEqual(['TR19B: ']);
        await contains(page, 'Kardiale Rehabilitation');
    });

    test('constraint icds section for supplements', async ({ page }) => {
        await page.goto('/de/Supplements/V13.0/supplements/ZE-2024-30.50');
        await expect(page.locator('#CONSTRAINT_ICDS > h5')).toHaveText('Vorausgesetzte ICD-Codes');
        // TODO: test clicking a code once code linking is implemented.
    });

    test('constraint chops section for supplements', async ({ page }) => {
        await page.goto('/de/Supplements/V13.0/supplements/ZE-2024-108.01');
        await expect(page.locator('#CONSTRAINT_CHOPS > h5')).toHaveText('Vorausgesetzte CHOP-Codes');
        // TODO: test clicking a code once code linking is implemented.
    });

    test('relevant codes section for supplements', async ({ page }) => {
        await page.goto('/de/Supplements/V13.0/supplements/ZE-2024-01.01');
        await expect(page.locator('#RELEVANT_CODES > h5')).toHaveText('Relevante Codes (CHOP)');
        await page.goto('/de/Supplements/V13.0/supplements/ZE-2024-11.27');
        await expect(page.locator('#RELEVANT_CODES > h5')).toHaveText('Relevante Codes (ATC)');
    });

    test('excluded drgs section for supplements', async ({ page }) => {
        await page.goto('/de/Supplements/V13.0/supplements/ZE-2024-01.01');
        await expect(page.locator('#EXCLUDED_DRGS > h5')).toHaveText('(Basis-)DRGs, welche die Abrechnung des ZE ausschliessen');
        // TODO: test clicking a DRG once code linking is implemented.
    });
});
