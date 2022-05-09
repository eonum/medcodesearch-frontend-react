export const languages = ['de', 'fr', 'it', 'en']

    export function convertCategory(category, version) {
        switch(category) {
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

    export function findCategory(version) {
        if(version.includes("ICD")) {
            return "ICD"
        } else if(version.includes("CHOP")) {
            return "CHOP"
        } else if(version.includes("TARMED")) {
            return "TARMED"
        } else {
            return "SwissDRG"
        }
    }

    export function convertCategoryToCatalog(category) {
        switch(category) {
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
    export function convertCategoryToChapters(category) {
        switch(category) {
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
    export async function isValidVersion(language, button, list, chapters ) {
        if(language === "en") {
            if(button !== "ICD") {
                return false
            }
        } else if(language === "fr" || language === "it") {
            if(button !== "MIGEL" && button !== "AL" && button !== "DRUG") {
                let versions = await fetchVersions(language, button);
                if(!versions.includes(list)) {
                    return false
                }
            }
        }
        return true
    }

    async function fetchVersions(language, button) {
    let ret;
        if (button === "SwissDRG") {
            await fetch(`https://search.eonum.ch/` + language + `/drgs/versions`)
                .then((res) => res.json())
                .then((json) => {
                    ret = json
                })
        } else {
            await fetch(`https://search.eonum.ch/` + language + `/` + button.toLowerCase() + `s/versions`)
                .then((res) => res.json())
                .then((json) => {
                    ret = json
                })
        }
        return ret;
    }
