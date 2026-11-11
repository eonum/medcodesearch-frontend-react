import { expect, test } from '@playwright/test';
import { visible } from './helpers';

/** Each step: breadcrumb link text to click, text expected afterwards, expected URL. */
type Step = [crumb: string, expectedText: string, expectedUrl: string];

const cases: Record<string, { start: string; steps: Step[] }> = {
    'DRG G72B to base chapter (de)': {
        start: '/de/SwissDRG/V10.0/drgs/G72B',
        steps: [
            ['G72', 'Andere leichte bis moderate Erkrankungen der Verdauungsorgane oder Abdominalschmerz oder mesenteriale Lymphadenitis', '/de/SwissDRG/V10.0/adrgs/G72'],
            ['Medizinische Partition', 'MDC 06 Medizinische Partition', '/de/SwissDRG/V10.0/partitions/G_M'],
            ['MDC 06', 'Krankheiten und Störungen der Verdauungsorgane', '/de/SwissDRG/V10.0/mdcs/06'],
            ['SwissDRG 10.0', 'MDC 01', '/de/SwissDRG/V10.0/mdcs/V10.0'],
        ],
    },
    'DRG G72B to base chapter (fr)': {
        start: '/fr/SwissDRG/V10.0/drgs/G72B',
        steps: [
            ['G72', 'Autres affections bénignes à modérées des organes digestifs ou douleur abdominale ou adénite mésentérique', '/fr/SwissDRG/V10.0/adrgs/G72'],
            ['Partition médicale', 'MDC 06 Partition médicale', '/fr/SwissDRG/V10.0/partitions/G_M'],
            ['MDC 06', 'Maladies et troubles des organes digestifs', '/fr/SwissDRG/V10.0/mdcs/06'],
            ['SwissDRG 10.0', 'MDC 01', '/fr/SwissDRG/V10.0/mdcs/V10.0'],
        ],
    },
    'DRG G72B to base chapter (it)': {
        start: '/it/SwissDRG/V10.0/drgs/G72B',
        steps: [
            ['G72', "Altre malattie da lievi a moderate dell'apparato digerente o dolore addominale o linfadenite mesenterica", '/it/SwissDRG/V10.0/adrgs/G72'],
            ['Partizione medica', 'MDC 06 Partizione medica', '/it/SwissDRG/V10.0/partitions/G_M'],
            ['MDC 06', "Malattie e disturbi dell'apparato digerente", '/it/SwissDRG/V10.0/mdcs/06'],
            ['SwissDRG 10.0', 'MDC 01', '/it/SwissDRG/V10.0/mdcs/V10.0'],
        ],
    },
    'MiGeL 13.01.01.00.1 to base (de)': {
        start: '/de/MIGEL/migels/13.01.01.00.1',
        steps: [
            ['13.01', 'Hörgeräte', '/de/MIGEL/migels/13.01'],
            ['13', 'HOERHILFEN', '/de/MIGEL/migels/13'],
            ['MiGeL', 'ABSAUGGERAETE', '/de/MIGEL/migels/MIGEL'],
        ],
    },
};

test.describe('Breadcrumbs', () => {
    for (const [name, { start, steps }] of Object.entries(cases)) {
        test(`clicking from ${name} via breadcrumbs`, async ({ page }) => {
            await page.goto(start);
            for (const [crumb, expectedText, expectedUrl] of steps) {
                await page.locator('.breadcrumb-item > a', { hasText: crumb }).first().click();
                await visible(page, expectedText);
                await expect(page).toHaveURL(expectedUrl);
            }
        });
    }
});
