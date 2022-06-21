import {CodeSortService, IcdSortService} from "./Services/code-sort.service";
/**
 *  Fetch versionized codes (ICD, CHOP, DRG, TARMED) in the correct language and version
 * @param language
 * @param resource_type
 * @param version
 * @param code
 * @param catalog
 * @param attributes
 * @returns {Promise<any>}
 */

export async function fetchVersionizedCodeInformations(language, resource_type, version, code, catalog, attributes) {
    let newAttributes = attributes;
    let codeForFetch = code;
    // Set base code for mdcs, since this is not equal to version but equal to 'ALL'.
    if (resource_type === 'mdcs' && code === version) {
        codeForFetch = 'ALL'
    }
    let urlString = 'https://search.eonum.ch/' + language + "/" + resource_type + "/" + version + "/" + codeForFetch + "?show_detail=1";
    return fetch(urlString)
        .then((response) => response.json())
        .then((json) => {
                for (let attribute in attributes) {
                    newAttributes[attribute] = json[attribute]
                }
                if (catalog === "ICD") {
                    if (version === code) {
                        newAttributes["children"] = IcdSortService(json["children"])
                    }
                }
                if (catalog in ["CHOP", "TARMED"]) {
                    if (version === code) {
                        newAttributes["children"] = CodeSortService(json["children"])
                    }
                }
            }
        )
        .then(() => {
            return newAttributes
        })
}

/**
 * Does a case distinction for all the catalogs and set the string ready for fetching
 * @param language
 * @param resource_type
 * @param version
 * @param code
 * @returns {Promise<null|any>}
 */
export function fetchUnversionizedCodeInformations(language, resource_type, version, code) {
    resource_type = resource_type.toUpperCase();
    if(code === "all") {
        code = resource_type
    }
    if (code === "all" && code !== 'AL') {
        return null
    } else {
        if (version === 'AL'){
            resource_type = resource_type + "/" + resource_type;
            code = '?show_detail=1'
        }
        return fetch('https://search.eonum.ch/' + language + "/" + version + "/" + resource_type + "/" + code + "?show_detail=1")
            .then((res) => {
                return res.json()
            })
    }
}

export const initialCodeState = {
    code: "",
    med_interpret: null,
    tech_interpret: null,
    tp_al: null,
    tp_tl: null,
    groups: null,
    blocks: null,
    exclusions: null,
    inclusions: null,
    notes: null,
    coding_hint: null,
    synonyms: null,
    most_relevant_drgs: null,
    analogous_code_text: null,
    descriptions: null,
    successors: null,
    predecessors: null,
    supplement_codes: null,
    usage: "",
    text: "",
    children: [],
    parent: null,
    parents: [],
    siblings: [],
    terminal: null
}
