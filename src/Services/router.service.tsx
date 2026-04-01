
/**
 * Returns the value of a query parameter from the current URL, or "" if not found.
 * @param variable - The query parameter name to look up.
 * @returns {string}
 */
export function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return "";
}

/**
 * Reads the language segment from the current URL path, defaulting to 'de'.
 * @returns {string}
 */
export function initializeLanguageFromURL() {
    if(window.location.pathname !== '/') {
        return window.location.pathname.split("/")[1]
    }
    return 'de'
}

/**
 * Reads the catalog segment from the current URL path, defaulting to 'ICD'.
 * @returns {string}
 */
export function initializeCatalogFromURL() {
    if(window.location.pathname !== '/') {
        return window.location.pathname.split("/")[2]
    }
    return 'ICD'
}
