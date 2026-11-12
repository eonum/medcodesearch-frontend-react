import { expect, test } from '@playwright/test';
import { latestVersion, search } from './helpers';

const cases = [
    { name: 'it icd text (stomaco)', start: '/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020', term: 'stomaco', firstResult: /stomaco/i },
    { name: 'non existing text / code', start: '/de/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020', term: 'asadsafadfqefqfqcqefqef232425', firstResult: 'Die Suche erzielte keinen Treffer.' },
    { name: 'fr chop text (robot)', start: '/fr/CHOP/CHOP_2022/chop_chapters/CHOP_2022', term: 'robot', firstResult: 'robot opératoire' },
    { name: 'it tarmed code (12.0010)', start: '/it/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09', term: '12.0010', firstResult: '12.0010' },
    { name: 'de drug text (aspir)', start: '/de/DRUG/drugs/all', term: 'aspir', firstResult: 'ASPIRIN' },
];

test.describe('Search', () => {
    let latestIcd: string;

    test.beforeAll(async () => {
        latestIcd = await latestVersion('icds');
    });

    test('search de icd code (A15.3) in latest ICD', async ({ page }) => {
        await page.goto('/');
        await search(page, 'A15.3');
        await expect(page).toHaveURL(`/de/ICD/${latestIcd}/icd_chapters/${latestIcd}?query=A15.3`);
        await expect(page.locator('.searchResult').first()).toContainText('A15.3');
    });

    for (const { name, start, term, firstResult } of cases) {
        test(`search ${name}`, async ({ page }) => {
            await page.goto(start);
            await search(page, term);
            await expect(page.locator('#searchResults')).toBeVisible();
            await expect(page).toHaveURL(`${start}?query=${term}`);
            await expect(page.locator('.searchResult').first()).toContainText(firstResult);
        });
    }

    test('search result is clickable', async ({ page }) => {
        await page.goto('/');
        await search(page, 'A15');
        await expect(page).toHaveURL(`/de/ICD/${latestIcd}/icd_chapters/${latestIcd}?query=A15`);
        await page.locator('.searchResult').first().click();
        await expect(page).toHaveURL(`/de/ICD/${latestIcd}/icds/A15?query=A15`);
    });
});
