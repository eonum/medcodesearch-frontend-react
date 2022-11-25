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

export const skippableAttributes = [
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
    "created_at"
]

export const fetchURL = 'https://search.eonum.ch'

export function getPathnameAndSearch(code, language, catalog) {
    // Transform backend of code to frontend url for navigation
    // TODO: This split and assignment feels kinda error prone or unstylish but saves a ton of distinctions that
    //  where made via regexes. Any style suggestions?
    let backendUrlComponents = code.url.split("/").filter(e => e);
    let backendCode = backendUrlComponents[3];
    let backendResourceType = backendUrlComponents[1];
    let backendVersion = backendUrlComponents[2];
    // Convert base code 'ALL' from SwissDrg to version.
    let codeToNavigate = backendCode === 'ALL' ? backendVersion : backendCode;
    let queryString = "?query=" + RouterService.getQueryVariable('query');
    let pathname = "/" + [language, catalog, backendVersion, backendResourceType, codeToNavigate].join("/")
    let searchString = RouterService.getQueryVariable('query') === "" ? "" : queryString
    return {pathname, searchString}
}
