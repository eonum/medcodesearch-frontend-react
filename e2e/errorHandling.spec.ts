import { test } from '@playwright/test';
import { BACKEND_URL, visible } from './helpers';

test.describe('Error handling', () => {
    test('shows error toast when search API returns 500', async ({ page }) => {
        await page.route(`${BACKEND_URL}/de/icds/ICD10-GM-2024/search*`, route =>
            route.fulfill({ status: 500, body: 'Internal Server Error' }));
        const failedSearch = page.waitForResponse(r => r.url().startsWith(`${BACKEND_URL}/de/icds/ICD10-GM-2024/search`));

        await page.goto('/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024?query=magen');
        await failedSearch;
        await visible(page, 'Ein Fehler ist aufgetreten: Daten konnten nicht geladen werden.');
    });
});
