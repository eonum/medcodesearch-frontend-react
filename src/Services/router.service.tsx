/**
 * Service to retrieve Information from the URL.
 */
export const RouterService = {
    /**
     * Extracts the version from the URL (or initializes a placeholder if path is empty).
     * @returns {string|*}
     */
    getVersion: (): string => {
        if(window.location.pathname !== '/') {
            let arr = window.location.pathname.split("/")
            if(arr.length === 6) {
                return arr[3]
            } else {
                return ''
            }
        }
        // Base version placeholder for ICD when visiting medcodesearch.ch.
        // Will be set in App first call to useEffect.
        return 'ICD10-GM-XXXX'
    },

    /**
     * Extracts and decodes the parameter value for a provided param name from the current URL's query string.
     * @param {string} paramName - The name of the URL parameter to retrieve
     * @returns {string} The decoded parameter value if found, empty string otherwise (default).
     * @example
     * // URL: http://example.com?search=term
     * getParamValue('search') // returns 'term'
     */
    getParamValue: (paramName: string): string => {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === paramName) {
                return decodeURIComponent(pair[1]);
            }
        }
        return "";
    },

    /**
     * Extracts the language from the URL.
     * @returns {string} The language if found, 'de' otherwise (default).
     */
    getLanguage: (): string => {
        if(window.location.pathname !== '/') {
            return window.location.pathname.split("/")[1]
        }
        return 'de'
    },

    /**
     * Extracts the catalog from the URL.
     * @returns {string} The catalog if found, 'ICD' otherwise (default).
     */
    getCatalog: (): string => {
        if(window.location.pathname !== '/') {
            return window.location.pathname.split("/")[2]
        }
        return 'ICD'
    },

    /**
     * Extracts the resource type from the URL.
     * @returns {string} The resource type if found, 'icd_chapters' otherwise (default).
     */
    getResourceType: (): string => {
        if(window.location.pathname !== '/') {
            const arr = window.location.pathname.split("/")
            if(arr.length === 6) {
                // Versionized code.
                return arr[4]
            } else {
                // Unversionized code.
                return arr[3]
            }
        }
        return 'icd_chapters'
    },

    /**
     * Extracts the code from the URL.
     * @returns {string} The code if found, empty string otherwise (default).
     */
    getCode: (): string => {
        if(window.location.pathname !== '/') {
            const arr = window.location.pathname.split("/")
            if(arr.length === 6) {
                // Versionized code.
                return arr[5]
            } else {
                // Unversionized code.
                return arr[4]
            }
        }
        return ''
    }
}