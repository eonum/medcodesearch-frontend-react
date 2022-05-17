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
    static getCategoryFromURL() {
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
            return window.location.pathname.split("/")[3]
        }
        return 'ICD10-GM-2022'
    }
}
export default RouterService
