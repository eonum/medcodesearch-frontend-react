import {Component} from "react";
import RouterService from "../../Services/router.service";

/**
 * responsible for the TARMED component and the pathname
 */
class TARMED extends Component {
    /**
     * navigate to the child component
     * @param code
     * @param navigate
     * @param version
     * @param language
     * @param url
     */
    static goToChild(code, navigate, version, language, url = null) {
        if(code.match(/^TARMED_[0-9][0-9].[0-9][0-9]$|^[0-9][0-9]$/)) {
            navigate({pathname: "/" + language + "/TARMED/" + version + "/tarmed_chapters/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else {
            navigate({pathname: "/" + language + "/TARMED/" + version + "/tarmeds/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }
}
export default TARMED;
