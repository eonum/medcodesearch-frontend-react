import { expect, test } from '@playwright/test';
import { fetchJson, visible } from './helpers';

const NEW_CODE_TEXT = 'Dies ist ein Neukode, der keine Vorgängercodes in Vorversionen hat.';

test.describe('Code attributes', () => {
    let drgB02A: any;

    test.beforeAll(async () => {
        drgB02A = await fetchJson('/de/drgs/V12.0/B02A?show_detail=1');
    });

    test('available and enabled attributes are displayed', async ({ page }) => {
        await page.goto('/de/MIGEL/migels/10.01.01.00.1');
        await visible(page, 'Krücken für Erwachsene, ergonomischer Griff, Kauf');
        await visible(page, 'Limitation');
        await expect(page.locator('#limitation_attribute_value')).toHaveText('HVB Pflege: Vergütung nur bei Anwendung durch Pflegefachfrauen und Pflegefachmänner die den Beruf selbständig und auf eigene Rechnung ausüben');
        await visible(page, 'Einheit');
        await expect(page.locator('#unit_attribute_value')).toHaveText('1 Paar');
        await visible(page, 'Ähnliche Codes');
        await visible(page, 'Höchstvergütungsbetrag (HVB) Selbstanwendung (CHF)');
        await expect(page.locator('#hvb_self_attribute_value')).toHaveText('35.13');
        await visible(page, 'Höchstvergütungsbetrag (HVB) Pflege (CHF)');
        await expect(page.locator('#hvb_care_attribute_value')).toHaveText('29.86');
        await visible(page, 'Zuletzt auf medcodesearch.ch aktualisiert');
        await visible(page, 'Gültig ab');
        await visible(page, 'Gültig bis');
    });

    test('show new code information', async ({ page }) => {
        await page.goto('/de/CHOP/CHOP_2022/chops/00.4I.11?query=00.4I.11');
        await visible(page, NEW_CODE_TEXT);
        await page.goto('/de/ICD/ICD10-GM-2021/icds/U13.5?query=u13.5');
        await visible(page, NEW_CODE_TEXT);
        await page.goto('/de/ICD/ICD10-GM-2011/icds/R11?query=r11');
        await expect(page.getByText(NEW_CODE_TEXT)).toHaveCount(0);
        await page.goto('/de/ICD/ICD10-GM-2021/icds/N19?query=N19');
        await expect(page.getByText(NEW_CODE_TEXT)).toHaveCount(0);
    });

    test('show drg code information', async ({ page }) => {
        await page.goto('/de/SwissDRG/V12.0/drgs/B02A');
        const table = page.locator('#attributesTable');
        await visible(table, 'Durchschnittliche Verweildauer (Tage)');
        await visible(table, drgB02A.average_stay_duration.toFixed(1));
        await visible(table, 'Erster Tag mit Abschlag');
        await visible(table, 'Abschlag pro Tag');
        await visible(table, drgB02A.discount_per_day.toFixed(3));
        await visible(table, 'Erster Tag mit Zuschlag');
        await visible(table, String(drgB02A.first_day_surcharge));
        await visible(table, 'Zuschlag pro Tag');
        await visible(table, drgB02A.surcharge_per_day.toFixed(3));

        await page.goto('/fr/SwissDRG/V12.0/drgs/B02A');
        await visible(page, 'Durée de séjour moyenne (journées)');
        await visible(page, 'Premier jour avec réduction');
        await visible(page, 'Réduction journalier');
        await visible(page, 'Premier jour avec supplément');
        await visible(page, 'Supplément journalier');

        await page.goto('/it/SwissDRG/V12.0/drgs/B02A');
        await visible(page, 'Durata media di degenza (giorni)');
        await visible(page, 'Primo giorno con riduzione');
        await visible(page, 'Tasso di riduzione giornaliero');
        await visible(page, 'Primo giorno con supplemento');
        await visible(page, 'Supplemento giornaliero');
    });

    test('SL code information', async ({ page }) => {
        // ASPIRIN CARDIO 100 mg 90 Stk, currently in the SL. Prices change, so compare against the backend.
        const gtin = '7680517950406';
        const drug = await fetchJson(`/de/drugs/DRUG/${gtin}?show_detail=1`);
        expect(drug.is_currently_in_sl).toBe(true);
        await page.goto(`/de/DRUG/drugs/${gtin}`);
        await expect(page.locator('#SL_status')).toContainText('Status: SL');
        await expect(page.locator('#SL_public_price')).toContainText(`Publikumspreis (CHF): ${drug.public_price}`);
        await expect(page.locator('#SL_date_added_in_sl')).toContainText('Zur SL hinzugefügt: 01.07.2020');
        await expect(page.locator('#SL_has_limitation')).toContainText('Limitation: Nein');
        await expect(page.locator('#SL_is_generica')).toContainText('Generika: Nein');
    });

    test('SL removal warning for drugs no longer in the SL', async ({ page }) => {
        // ASPIRIN CARDIO 300 mg 90 Stk, removed from the SL on 30.09.2026.
        await page.goto('/de/DRUG/drugs/7680517950673');
        await visible(page, 'Diese Packung ist aktuell nicht in der Spezialitätenliste.');
        await expect(page.locator('#SL_infos')).toHaveCount(0);
    });
});
