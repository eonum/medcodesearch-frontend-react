export const languages = ['de', 'fr', 'it', 'en']
export const categories = ['ICD', 'SwissDRG', 'CHOP', 'TARMED']

/**
 * cuts the string as long as the category is
 * @param category
 * @param version
 * @returns {string|*}
 */
export function convertCategory(category, version) {
    switch (category) {
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
 * compare which version is used
 * @param version
 * @returns {string}
 */
export function findCategory(version) {
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
 * converts the category to in the catalog needed format
 * @param category
 * @returns {string}
 */
export function convertCategoryToCatalog(category) {
    switch (category) {
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
 * converts the category to in the chapter needed format
 * @param category
 * @returns {string}
 */
export function convertCategoryToChapters(category) {
    switch (category) {
        case "ICD":
            return "icd_chapters"
        case "CHOP":
            return "chop_chapters"
        case "SwissDRG":
            return "mdcs"
        case "TARMED":
            return "tarmed_chapters"
        default:
            return
    }
}

/**
 * fetch all categories in the given language
 * @param language
 * @returns {Promise<{}>}
 */
export async function getVersionsByLanguage(language) {
    let allVersions = {}
    for (let category of categories) {
        await fetch('https://search.eonum.ch/' + language + "/" + convertCategoryToCatalog(category) + '/versions')
            .then((res) => res.json())
            .then((json) => {
                allVersions[category] = json;
            })
    }
    return allVersions
}
