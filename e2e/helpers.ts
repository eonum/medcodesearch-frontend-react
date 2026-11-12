import { expect, Locator, Page } from '@playwright/test';

/** Backend used by the app; some specs read expected values directly from it. */
export const BACKEND_URL = 'https://search.eonum.ch';

/**
 * Fetches JSON from the backend.
 * @param path - path relative to BACKEND_URL
 */
export async function fetchJson(path: string): Promise<any> {
    const res = await fetch(BACKEND_URL + path);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
}

/**
 * Asserts that the page contains the given text somewhere (equivalent of `cy.contains(text)`).
 */
export async function contains(page: Page, text: string): Promise<void> {
    await expect(page.locator('body')).toContainText(text);
}

/**
 * Asserts that an element containing the given text is visible
 * (equivalent of `cy.contains(text).should('be.visible')`).
 */
export async function visible(scope: Page | Locator, text: string): Promise<void> {
    await expect(scope.getByText(text).first()).toBeVisible();
}

/**
 * Builds a regex matching URLs that contain the given string literally.
 */
export function urlIncluding(part: string): RegExp {
    return new RegExp(part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}

/**
 * Returns the latest version of a catalog in the given language, e.g. latestVersion('icds') -> 'ICD10-GM-2026'.
 * @param resourceType - backend resource type, e.g. 'icds', 'chops', 'drgs'
 */
export async function latestVersion(resourceType: string, lang = 'de'): Promise<string> {
    return (await fetchJson(`/${lang}/${resourceType}/versions`)).at(-1);
}

/**
 * Types a search term into the search bar. Clicks first (like a user would), since on mobile
 * the click is what expands the search results.
 */
export async function search(page: Page, term: string): Promise<void> {
    const input = page.locator('#searchbarInput');
    await input.click();
    await input.fill(term);
}
