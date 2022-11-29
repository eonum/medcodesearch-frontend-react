import RouterService from "./Services/router.service";

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
    'valid_from'
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

export const fetchURL = 'https://search.eonum.ch'

// Get frontend url for navigation from backend code url.
export function getNavParams(code, language, catalog, resource_type?) {
    let backendUrlComponents = code.url.split("/").filter(e => e);
    let backendResourceType = backendUrlComponents[1];
    let backendVersion = backendUrlComponents[2];
    let backendCode = backendUrlComponents[3];
    // Convert base code 'ALL' from SwissDrg to version.
    let codeToNavigate = backendCode === 'ALL' ? backendVersion : backendCode;
    let pathname;
    let searchString;
    if (['MIGEL', 'AL'].includes(catalog.toUpperCase())) {
        pathname = "/" + [language, catalog.toUpperCase(), catalog === 'AL' ? 'laboratory_analyses' : resource_type, code.code].join("/")
        searchString = RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query');
    } else {
        searchString = RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query');
        pathname = "/" + [language, catalog, backendVersion, backendResourceType, codeToNavigate].join("/")
    }
    return {pathname, searchString}
}

// Use filter to select attributes we want to display, i.e not in skippable attributes and value not null,
// undefined or empty.
export function collectEnabledAttributes(attributes) {
    return Object.keys(attributes)
        .filter((key) => !skippableAttributes.includes(key))
        .filter((key) => !["", null, undefined].includes(attributes[key]))
        .filter((key) => attributes[key].length)
        .reduce((obj, key) => {
            return Object.assign(obj, {
                [key]: attributes[key]
            });
        }, {});
}
