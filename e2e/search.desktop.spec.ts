import { expect, test } from '@playwright/test';
import { search } from './helpers';

test('load more and reset search results', async ({ page }) => {
    await page.goto('/');
    await search(page, 'neubildung');
    await expect(page.locator('.searchResult')).toHaveCount(10);
    await page.locator('#load-more-button').click();
    await expect.poll(() => page.locator('.searchResult').count()).toBeGreaterThan(10);
    await page.locator('#reset-button').click();
    await expect(page.locator('.searchResult')).toHaveCount(10);
});
