import {Component} from "react";

/**
 * Responsible for the url route
 */
class RouterService extends Component {

    /**
     * get the query variable and compares it
     * @param variable
     * @returns {string}
     */
    static getQueryVariable(variable) {
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
     * get the language defined in the url and if it isn't defined set it to 'de'
     * @returns {string|*}
     */
    static initializeLanguageFromURL() {
        if(window.location.pathname !== '/') {
            return window.location.pathname.split("/")[1]
        }
        return 'de'
    }

    /**
     * get the catalog defined in the url and if it isn't defined set it to 'ICD'
     * @returns {string|*}
     */
    static initializeCatalogFromURL() {
        if(window.location.pathname !== '/') {
            return window.location.pathname.split("/")[2]
        }
        return 'ICD'
    }

    static initializeResourceTypeFromURL() {
        if(window.location.pathname !== '/') {
            let arr = window.location.pathname.split("/")
            if(arr.length === 6) {
                // Versionized code.
                return arr[4]
            } else {
                // Unversionized code.
                return arr[3]
            }
        }
        return 'icd_chapters'
    }

    static initializeCodeFromURL() {
        if(window.location.pathname !== '/') {
            let arr = window.location.pathname.split("/")
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
export default RouterService
