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
    static getLanguageFromURL() {
        if(window.location.pathname !== '/') {
            return window.location.pathname.split("/")[1]
        }
        return 'de'
    }

    /**
     * get the category defined in the url and if it isn't defined set it to 'ICD'
     * @returns {string|*}
     */
    static getCatalogFromURL() {
        if(window.location.pathname !== '/') {
            return window.location.pathname.split("/")[2]
        }
        return 'ICD'
    }

    /**
     * get the version defined in the url and if it isn't defined set it to 'ICD10-GM-2022'
     * @returns {string|*}
     */
    static getVersionFromURL() {
        if(window.location.pathname !== '/') {
            let arr = window.location.pathname.split("/")
            if(arr.length === 6) {
                return arr[3]
            } else {
                return ''
            }
        }
        return 'ICD10-GM-2022'
    }

    static getResourceTypeFromURL() {
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

    static getCodeFromURL() {
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
        // Base code for ICD, which is the catalog for root url, i.e. when visiting medcodesearch.ch.
        // TODO: Get newest ICD base code dynamically since this will not work when catalog is newer than 2022.
        return 'ICD10-GM-2022'
    }

}
export default RouterService
