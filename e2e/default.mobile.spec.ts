import { expect, test } from '@playwright/test';
import { contains } from './helpers';

test.describe('General navigation via clicks (mobile)', () => {
    test('click through mobile buttons (de)', async ({ page }) => {
        await page.goto('/');
        // Change to CHOP 2016.
        await page.locator('#catalog_button').click();
        await page.locator('#CHOP_button').click();
        await page.locator('#version_button').click();
        await page.locator('#CHOP_2016').click();
        await contains(page, 'CHOP 2016');
        await expect(page).toHaveURL('/de/CHOP/CHOP_2016/chop_chapters/CHOP_2016');
        // Change to CHOP 2020.
        await page.locator('#version_button').click();
        await page.locator('#CHOP_2020').click();
        await contains(page, 'CHOP 2020');
        await expect(page).toHaveURL('/de/CHOP/CHOP_2020/chop_chapters/CHOP_2020');
        // Change to SwissDRG V7.0.
        await page.locator('#catalog_button').click();
        await page.locator('#SwissDRG_button').click();
        await page.locator('#version_button').click();
        await page.locator('#V70').click();
        await contains(page, 'SwissDRG 7.0');
        await expect(page).toHaveURL('/de/SwissDRG/V7.0/mdcs/V7.0');
        // Change to TARMED.
        await page.locator('#catalog_button').click();
        await page.locator('#TARMED_button').click();
        await contains(page, 'TARMED');
        await expect(page).toHaveURL('/de/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09');
    });
});
