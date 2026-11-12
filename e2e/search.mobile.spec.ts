import { expect, test } from '@playwright/test';
import { search } from './helpers';

test.use({ viewport: { width: 450, height: 1200 } });

test.describe('Search (mobile)', () => {
    test('search results collapse after clicking a result', async ({ page }) => {
        await page.goto('/');
        await search(page, 'A15');
        await expect(page.locator('#collapse-button')).toHaveText('Suchresultate ausblenden');
        await page.locator('.searchResult').first().click();
        await expect(page.locator('#collapse-button')).toHaveText('Suchresultate einblenden');
        await expect(page).toHaveURL(/\/icds\/A15\?query=A15$/);
    });

    test('load more search results', async ({ page }) => {
        await page.goto('/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024?query=neubildung');
        const collapseButton = page.locator('#collapse-button');
        await expect(collapseButton).toBeVisible();
        if ((await collapseButton.textContent()) === 'Suchresultate einblenden') {
            await collapseButton.click();
        }
        await expect(page.locator('.searchResult')).toHaveCount(10);
        await page.locator('#load-more-button').click();
        await expect.poll(() => page.locator('.searchResult').count()).toBeGreaterThan(10);
    });
});
