import {Component} from "react";

class RouterService extends Component {


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

    static getLanguageFromURL() {
        if(window.location.pathname !== '/') {
            return window.location.pathname.split("/")[1]
        }
        return 'de'
    }
    static getCategoryFromURL() {
        if(window.location.pathname !== '/') {
            return window.location.pathname.split("/")[2]
        }
        return 'ICD'
    }
    static getVersionFromURL() {
        if(window.location.pathname !== '/') {
            return window.location.pathname.split("/")[3]
        }
        return 'ICD10-GM-2022'
    }
}
export default RouterService
