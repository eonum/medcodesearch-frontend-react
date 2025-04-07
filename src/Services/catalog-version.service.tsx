import {fetchURL} from "../Utils";

export const languages = ['de', 'fr', 'it', 'en']
export const versionizedCatalogs = [
    'ICD',
    'SwissDRG',
    'CHOP',
    'TARMED',
    'Reha',
    'Supplements'
]
export const currentCatalogsByButton = {
    'ICD': 'currentICD',
    'SwissDRG': 'currentSwissDRG',
    'CHOP': 'currentCHOP',
    'TARMED': 'currentTARMED',
    'Reha': 'currentReha',
    'Supplements': 'currentSupplements'
}

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
        case "Reha":
            return version.substring(5).replace("_", " ")
        case "SwissDRG":
        case "Supplements":
        case "TARMED":
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
        case "Supplements":
            return "supplements"
        case "TARMED":
            return "tarmeds"
        case "Reha":
            return "rcgs"
        case "Supplements":
            return "supplements"
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
