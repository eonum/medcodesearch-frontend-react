import {CodeSortService, IcdSortService} from "./Services/code-sort.service";
import {Breadcrumb} from "react-bootstrap";
import React from "react";
import {IShortEntry} from "./interfaces";
import {onBFCacheRestore} from "web-vitals/dist/modules/lib/onBFCacheRestore";

/**
 * Fetch versionized codes (ICD, CHOP, DRG, TARMED) in the correct language and version.
 * @param language
 * @param resource_type
 * @param version
 * @param code
 * @param catalog
 * @param attributes
 * @returns {Promise<any>}
 */
export async function fetchVersionizedCodeInformations(language, resource_type, version, code, catalog, attributes) {
    let newAttributes = {};
    let codeForFetch = code;
    // Set base code for mdcs, since this is not equal to version but equal to 'ALL'.
    if (resource_type === 'mdcs' && code === version) {
        codeForFetch = 'ALL'
    }
    let urlString = 'https://search.eonum.ch/' + language + "/" + resource_type + "/" + version + "/" + codeForFetch + "?show_detail=1";
    return fetch(urlString)
        .then((response) => response.json())
        .then((json) => {
                for (let attribute in json) {
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
 * Fetch unversionized codes (MIGEL, AL, DRUG) in the correct language and version.
 * @param language
 * @param resource_type
 * @param catalog
 * @param code
 * @returns {Promise<null|any>}
 */
export function fetchUnversionizedCodeInformations(language, resource_type, code, catalog) {
    catalog = catalog.toUpperCase();
    if(code === "all") {
        code = catalog
    }
    if (catalog === 'AL'){
        resource_type = 'laboratory_analyses';
    }
    return fetch('https://search.eonum.ch/' + language + "/" + resource_type + "/" + catalog + "/" + code + "?show_detail=1")
        .then((res) => {
            return res.json()
        })
}

/**
 * Collect breadcrumbs of a code.
 * @param parents
 * @returns {breadCrumbs}
 */
export function collectBreadcrumbs(parents) {
    let breadCrumbs = []
    for (let i = parents.length - 1; i >= 0; i--) {
        breadCrumbs.push(
            <Breadcrumb.Item
                key={i}
                onClick={() => this.goToChild(parents[i])}
                className="breadLink"
            >{this.extractLabel(parents[i].code)}
            </Breadcrumb.Item>)
    }
    return breadCrumbs
}

/**
 * Fetch grandparents of the code.
 * @param parent
 * @returns {Promise<void>}
 */
export function fetchGrandparents(parent) {
    let parents = [];
    while(parent) {
        parents = [...parents, parent]
        fetch('https://search.eonum.ch/' + parent.url + "?show_detail=1")
            .then((res) => res.json())
            .then((json) => {
                parent = json["parent"]
            })
    }
    return parents
}

/**
 * Fetch siblings of the code.
 * @param parent
 * @returns {Promise<void>}
 */
export function fetchSiblings(children, parent, siblings, code) {
    let collectedSiblings = [...siblings];
    if((children === null) && parent) {
        fetch('https://search.eonum.ch/' + parent.url + "?show_detail=1")
            .then((res) => res.json())
            .then((json) => {
                for(let i = 0; i < json.children.length; i++) {
                    if(json.children[i].code !== code) {
                        collectedSiblings.push(json.children[i])
                    }
                }
            })
    }
    return collectedSiblings
}


/**
 * Returns code in the correct language
 * @param code
 * @returns {string|*}
 */
export function extractLabel(code, language){
    let default_labels = {"MIGEL": "MiGeL", "AL": "AL", "DRUG": "Med"};
    let default_value = code in ["MIGEL", "AL", "DRUG"] ? default_labels[code] : code;
    switch (true) {
        case ((code === "MIGEL") && (language === "fr")):
            return "LiMA"
        case ((code === "MIGEL") && (language === "it")):
            return "EMAp"
        case ((code === "AL") && (language === "fr")):
            return "LA"
        case ((code === "AL") && (language === "it")):
            return "EA"
        default:
            return default_value
    }
}

export const initialCodeState = {
    attributes: {
        code: "",
        text: "",
        parent: null,
        children: null,
        med_interpret: null,
        tech_interpret: null,
        tp_al: null,
        tp_tl: null,
        groups: null,
        blocks: null,
        exclusions: null,
        inclusions: null,
        notes: null,
        hints: null,
        coding_hint: null,
        synonyms: null,
        most_relevant_drgs: null,
        analogous_code_text: null,
        descriptions: null,
        successors: null,
        predecessors: null,
        supplement_codes: null,
        usage: null,
        limitation: null,
        unit: null,
        hvb_self: null,
        hvb_care: null,
        it_number: null,
        substance_name: null,
        field_of_app: null,
        atc_code: null,
        auth_state: null,
        remedy_code: null,
        dispens_cat: null,
        pack_size: null,
        pack_unit: null,
        gln: null,
        tp: null,
        comment: null,
        cumulation: null,
        faculty: null,
        active_substances: null,
        terminal: null,
    },
    parents: [],
    siblings: [],
}
