
    export const languages = ['de', 'fr', 'it', 'en']

    export function versionExists(language, version) {
        fetch()
    }

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
        }

    }
