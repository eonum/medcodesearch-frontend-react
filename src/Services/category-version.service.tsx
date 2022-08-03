import {fetchURL} from "../Utils";

export const languages = ['de', 'fr', 'it', 'en']
export const versionizedCatalogs = ['ICD', 'SwissDRG', 'CHOP', 'TARMED']

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
        default:
            return
    }
}

/**
 * Returns catalog matching the version.
 * @param version
 * @returns {string}
 */
export function findCatalog(version) {
    if (version.includes("ICD")) {
        return "ICD"
    } else if (version.includes("CHOP")) {
        return "CHOP"
    } else if (version.includes("TARMED")) {
        return "TARMED"
    } else {
        return "SwissDRG"
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

/**
 * Fetch latest versions for versionized catalogs.
 * @param language
 * @returns {Promise<{}>}
 */
export function getLatestVersions() {
    let latestVersions = {}
    for (let catalog of versionizedCatalogs) {
        fetch([fetchURL, 'de', convertCatalogToResourceType(catalog), 'versions' ].join("/"))
            .then((res) => res.json())
            .then((json) => {
                latestVersions[catalog] = json[-1];
            })
    }
    return latestVersions
}
