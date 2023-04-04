import {fetchURL} from "../Utils";

export const languages = ['de', 'fr', 'it', 'en']
export const versionizedCatalogs = ['ICD', 'SwissDRG', 'CHOP', 'TARMED', 'AmbGroup']
export const currentCatalogsByButton = {
    'ICD': 'currentICD',
    'SwissDRG': 'currentSwissDRG',
    'CHOP': 'currentCHOP',
    'TARMED': 'currentTARMED',
    'AmbGroup': 'currentAmbGroup'}

/**
 * Cuts the catalog from the version, f.e. returns 10-GM-2021 for ICD10-GM-2021.
 * @param catalog
 * @param version
 * @returns {string|*}
 */
export function cutCatalogFromVersion(catalog, version) {
    switch (catalog) {
        case "ICD":
            return version.substring(3)
        case "CHOP":
            return version.substring(5)
        case "SwissDRG":
            return version
        case "TARMED":
            return version.substring(7)
        case "AmbGroup":
            return version
        default:
            return
    }
}

/**
 * Returns ressource type matching the catalog.
 * @param catalog
 * @returns {string}
 */
export function convertCatalogToResourceType(catalog) {
    switch (catalog) {
        case "ICD":
            return "icds"
        case "CHOP":
            return "chops"
        case "SwissDRG":
            return "drgs"
        case "TARMED":
            return "tarmeds"
        case "AmbGroup":
            return "amb_groups"
        default:
            return
    }
}

/**
 * Fetch all versions in the given language.
 * @param language
 * @returns {Promise<{}>}
 */
export async function getVersionsByLanguage(language) {
    let allVersions = {}
    for (let catalog of versionizedCatalogs) {
        await fetch([fetchURL, language, convertCatalogToResourceType(catalog), 'versions' ].join("/"))
            .then((res) => res.json())
            .then((json) => {
                allVersions[catalog] = json;
            })
    }
    return allVersions
}
