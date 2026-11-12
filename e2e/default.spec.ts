import { expect, test } from '@playwright/test';
import { contains, latestVersion } from './helpers';

test.describe('General navigation (desktop + mobile)', () => {
    let LATEST_ICD: string;

    test.beforeAll(async () => {
        LATEST_ICD = await latestVersion('icds');
    });

    test('go to base url when clicking on logo', async ({ page }) => {
        await page.goto('/de/SwissDRG/V4.0/mdcs/V4.0');
        await contains(page, 'SwissDRG 4.0');
        await page.locator('#logo').click();
        await contains(page, LATEST_ICD);
    });

    test('call to base URL redirects to latest ICD', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(`/de/ICD/${LATEST_ICD}/icd_chapters/${LATEST_ICD}`);
    });

    // Click from ICD chapter I down to A00.0 and then to its sibling A00.1.
    const icdPaths: Record<string, string[]> = {
        de: [
            'Bestimmte infektiöse und parasitäre Krankheiten',
            'Infektiöse Darmkrankheiten',
            'Cholera',
            'Cholera durch Vibrio cholerae O:1, Biovar cholerae',
            'Cholera durch Vibrio cholerae O:1, Biovar eltor',
        ],
        fr: [
            'Certaines maladies infectieuses et parasitaires',
            'Maladies intestinales infectieuses',
            'Choléra',
            'A Vibrio cholerae 01, biovar cholerae',
            'A Vibrio cholerae 01, biovar El Tor',
        ],
        it: [
            'Alcune malattie infettive e parassitarie',
            'Malattie infettive intestinali',
            'Colera',
            'Colera da Vibrio cholerae O:1, biotipo del colera',
            'Colera da Vibrio cholerae O:1, biotipo El Tor',
        ],
        en: [
            'Certain infectious and parasitic diseases',
            'Intestinal infectious diseases',
            'Cholera',
            'Cholera due to Vibrio cholerae 01, biovar cholerae',
            'Cholera due to Vibrio cholerae 01, biovar eltor',
        ],
    };
    const icdUrls = ['icd_chapters/I', 'icd_groups/A00-A09', 'icds/A00', 'icds/A00.0', 'icds/A00.1'];

    for (const [lang, texts] of Object.entries(icdPaths)) {
        test(`icd clicking from I to A00.1 (${lang})`, async ({ page }) => {
            await page.goto(`/${lang}/ICD/${LATEST_ICD}/icd_chapters/${LATEST_ICD}`);
            for (let i = 0; i < texts.length; i++) {
                await page.locator('ul>li:first-child>a').first().click();
                await contains(page, texts[i]);
                await expect(page).toHaveURL(`/${lang}/ICD/${LATEST_ICD}/${icdUrls[i]}`);
            }
        });
    }
});
