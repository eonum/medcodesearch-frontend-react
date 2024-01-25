import RouterService from "./Services/router.service";
import React from "react";

export const initialCodeState = {
    attributes: {
        code: "",
        text: "",
        children: null,
        parent: null
    },
    parents: [],
    siblings: [],
}

const skippableAttributes = [
    "code",
    "text",
    "parent",
    "groups",
    "blocks",
    "terminal",
    "active",
    "version",
    "valid_to",
    "children",
    "is_limited",
    "rev",
    "is_limited",
    "base_analyis",
    "special_analysis",
    "auth_holder_nr",
    "prefix",
    "predecessors",
    "successors",
    "created_at",
    'updated_at',
    'valid_from',
    "public_price",
    "date_added_in_sl",
    "date_deleted_from_sl",
    "date_compulsatory_until",
    "has_limitation",
    "is_generica",
    "limitation_points",
    "is_ggsl",
    "is_currently_in_sl"
]

export const versionsWithoutMappingInfos = [
    "ICD10-2008",
    "ICD10-2010",
    "ICD10-2016",
    "ICD10-GM-2008",
    "ICD10-GM-2010",
    "ICD10-GM-2011",
    "CHOP 2011",
    "CHOP 2012",
    "CHOP 2013",
    "CHOP 2014",
    "CHOP 2015"]

export const fetchURL = 'http://localhost:3001/'

// Get frontend url for navigation from backend code url.
export function getNavParams(code, language, catalog, resource_type?) {
    let backendUrlComponents = code.url.split("/").filter(e => e);
    let backendResourceType = backendUrlComponents[1];
    let backendVersion = backendUrlComponents[2];
    let backendCode = backendUrlComponents[3];
    // Convert base code 'ALL' from SwissDrg / STReha to version.
    let codeToNavigate = backendCode === 'ALL' ? backendVersion : backendCode;
    let pathname;
    let searchString;
    if (['MIGEL', 'AL'].includes(catalog)) {
        pathname = "/" + [language, catalog, catalog === 'AL' ? 'laboratory_analyses' : resource_type, code.code].join("/")
        searchString = RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query');
    } else {
        searchString = RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query');
        pathname = "/" + [language, catalog, backendVersion, backendResourceType, codeToNavigate].join("/")
    }
    return {pathname, searchString}
}

export function collectAttributesSl(attributes, translation) {
    const attributesSl = ["public_price", "date_added_in_sl", "date_deleted_from_sl",
        "date_compulsatory_until", "has_limitation", "is_generica", "limitation_points"]
    return {
        status: translation("LBL_" + (attributes["is_ggsl"] ? "GGSL" : "SL")),
        ...Object.keys(attributes)
            .filter((key) => (
                attributesSl.includes(key) &&
                (attributes[key] && attributes[key].length > 0 ||
                    typeof attributes[key] == 'number' && !isNaN(attributes[key]) ||
                    typeof attributes[key] == 'boolean')))
            .reduce((obj, key) => {
                return Object.assign(obj, {
                    [key]: attributes[key]
                });
            }, {})
    };
}

/**
 * Looks for exclusions in the given code.
 * @param code
 */
function searchExclusion(code, navigate) {
    navigate({search: "?query=" + code})
}

/**
 * Looks if the given string has a pattern which indicates a link
 * @param aString
 * @param index
 * @returns {JSX.Element}
 */
function lookingForLink(aString, index, attribute, navigate) {
    let results = []
    const codeRegex = new RegExp(/[{(](([A-Z\d]{1,3}\.?){1,3})(-(([A-Z\d]{1,3}\.?){1,3})?)?[})]/g);
    let matches = aString.match(codeRegex)
    if(matches) {
        let firstIndex = aString.indexOf(matches[0])
        for (let i = 0; i < matches.length; i++) {
            matches[i] = matches[i].substring(1, matches[i].length - 1);
            let arr = matches[i].split("-")
            if(arr.length > 1 && arr[1] !== "") {
                results.push(<span key={attribute + "_" + index}>(<a onClick={() => {
                    searchExclusion(arr[0].replace(/\.$/, ''), navigate)
                }} className="link">{arr[0].replace(/\.$/, '')}</a>-<a onClick={() => {
                    searchExclusion(arr[1].replace(/\.$/, ''), navigate)
                }} className="link">{arr[1].replace(/\.$/, '')}</a>) </span>)
            } else {
                results.push(<span key={attribute + "_" + index}>(<a onClick={() => {
                    searchExclusion(arr[0].replace(/\.$/, ''), navigate)
                }} className="link">{arr[0].replace(/\.$/, '')}</a>) </span>)
            }
        }
        return <li key={`${attribute}_link_${index}`}>{aString.substring(0, firstIndex)} {results}</li>
    } else {
        return <li key={`${attribute}_link_${index}`}>{aString}</li>
    }
}


// Use filter to select attributes we want to display, i.e not in skippable attributes and value not null,
// undefined or empty.
function collectEnabledAttributes(attributes) {
    return Object.keys(attributes)
        .filter((key) => (
            !skippableAttributes.includes(key) &&
            (attributes[key] && attributes[key].length > 0 ||
                typeof attributes[key] == 'number' && !isNaN(attributes[key]) ||
                typeof attributes[key] == 'boolean')))
        .reduce((obj, key) => {
            return Object.assign(obj, {
                [key]: attributes[key]
            });
        }, {});
}

export function commonCodeInfos(attributes, translation, versionized, navigate) {
    const enabledAttributes = collectEnabledAttributes(attributes)
    const noCodeError = Object.keys(enabledAttributes).includes("error")
    const codeInfos = noCodeError ? [] : Object.keys(enabledAttributes).map(attribute => (
        <div key={attribute}>
            <h5>{translation("LBL_" + attribute.toUpperCase())}</h5>
            {typeof enabledAttributes[attribute] === 'object' ?
                <ul id={attribute + "_attribute_value"}>
                    {enabledAttributes[attribute].map((val, j) => (
                        ["exclusions", "supplement_codes"].includes(attribute) && versionized ?
                            lookingForLink(val, j, attribute, navigate) :
                            <li key={attribute + "_" + j}><p dangerouslySetInnerHTML={{__html: val}}/>
                            </li>
                    ))}
                </ul> :
                <div key={attribute} id={attribute + "_attribute_value"}>
                    {typeof enabledAttributes[attribute] === 'boolean' ?
                        <p>{translation("LBL_" + enabledAttributes[attribute].toString().toUpperCase())}</p> :
                        <p dangerouslySetInnerHTML={{__html: attributes[attribute]}}/>
                    }
                </div>
            }
        </div>
    ))
    return {noCodeError, codeInfos}
}
