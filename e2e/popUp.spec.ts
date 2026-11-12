import { expect, test } from '@playwright/test';
import { contains } from './helpers';

const ICD = 'ICD10-GM-2024';

test.describe('PopUp for versions not available in a language', () => {
    // Desktop checks fr / ICD 2021, mobile checks it / ICD 2019 (as in the original suites).
    const variants = {
        desktop: { langBtn: 2, lang: 'fr', version: 'ICD10-GM-2021', message: "Le catalogue sélectionné n'est pas disponible dans la langue actuelle." },
        mobile: { langBtn: 3, lang: 'it', version: 'ICD10-GM-2019', message: 'Il catalogo selezionato non è disponibile nel linguaggio corrente.' },
    };

    test('PopUp offers going back or switching language', async ({ page }, testInfo) => {
        const v = variants[testInfo.project.name as keyof typeof variants];
        await page.goto(`/de/ICD/${ICD}/icd_chapters/${ICD}`);
        await page.locator(`.language-btn:nth-child(${v.langBtn})`).click();
        await expect(page).toHaveURL(`/${v.lang}/ICD/${ICD}/icd_chapters/${ICD}`);
        // The available versions for the new language are fetched asynchronously; wait for them.
        await page.waitForLoadState('networkidle');

        // Select a version that isn't available in the current language.
        await page.locator('#version_button').click();
        await page.locator(`#${v.version}`).click();
        await expect(page.locator('.modal-content')).toContainText(v.message);

        // "Back" keeps the current URL.
        await page.locator('.modal-footer > .PopUpBtn').click();
        await expect(page).toHaveURL(`/${v.lang}/ICD/${ICD}/icd_chapters/${ICD}`);
        // The available versions for the new language are fetched asynchronously; wait for them.
        await page.waitForLoadState('networkidle');

        // Select it again and switch to 'de' (first language button in the popup).
        await page.locator('#version_button').click();
        await page.locator(`#${v.version}`).click();
        await page.locator('.modal-footer > div > .PopUpBtn:nth-child(1)').click();
        await expect(page).toHaveURL(`/de/ICD/${v.version}/icd_chapters/${v.version}`);
    });

    test('navigates to latest ICD with a toast if the version is not available after a language change', async ({ page }) => {
        await page.goto('/de/ICD/ICD10-GM-2021/icd_chapters/ICD10-GM-2021');
        // ICD 2021 doesn't exist in French: the latest French ICD is shown with a warning toast.
        await page.locator('.language-btn:nth-child(2)').click();
        await expect(page.locator('.Toastify__toast-container')).toBeVisible();
        await contains(page, "Cette version n'est pas disponible dans la langue sélectionnée.");
    });
});
