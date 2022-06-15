import {CodeSortService, IcdSortService} from "./Services/code-sort.service";
/**
 *  Fetch versionized codes (ICD, CHOP, DRG, TARMED) in the correct language and version
 * @param language
 * @param code_type
 * @param version
 * @param code
 * @param catalog
 * @param attributes
 * @returns {Promise<any>}
 */

export function fetchVersionizedCodeInformations(language, code_type, version, code, catalog, attributes) {
    let newAttributes = attributes
    // TODO: Fix DRG fetching (see original DRG body)
    return fetch('https://search.eonum.ch/' + language + "/" + code_type + "/" + version + "/" + code + "?show_detail=1")
        .then((res) => res.json())
        .then((json) => {
            for(let attribute in attributes) {
                newAttributes[attribute] = json[attribute]
            }
            if(catalog == "ICD") {
                if(version === code) {
                    newAttributes["children"] = IcdSortService(json["children"])
                }
            }
            if(catalog in ["CHOP","TARMED"]) {
                if(version === code) {
                    newAttributes["children"] = CodeSortService(json["children"])
                }
            }
        })
        .then(() => {return newAttributes})
}

/**
 * navigate to the child component
 * @param code
 * @param navigate
 * @param version
 * @param language
 */

/**
 * Does a case distinction for all the catalogs and set the string ready for fetching
 * @param language
 * @param code_type
 * @param version
 * @param code
 * @returns {Promise<null|any>}
 */
export function fetchUnversionizedCodeInformations(language, code_type, version, code) {
    code_type = code_type.toUpperCase();
    if(code === "all") {
        code = code_type
    }
    if (code === "all" && code !== 'AL') {
        return null
    } else {
        if (version === 'AL'){
            code_type = code_type + "/" + code_type;
            code = '?show_detail=1'
        }
        return fetch('https://search.eonum.ch/' + language + "/" + version + "/" + code_type + "/" + code + "?show_detail=1")
            .then((res) => {
                return res.json()
            })
    }
}
