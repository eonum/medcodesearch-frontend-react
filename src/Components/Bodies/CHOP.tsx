import {Component} from "react";
import RouterService from "../../Services/router.service";

/**
 * responsible for the AL component and the pathname
 */
class CHOP extends Component {
    /**
     * navigate to the child component
     * @param code
     * @param navigate
     * @param version
     * @param language
     * @param url
     */
    static goToChild(code, navigate, version, language, url = null) {
        if(code.match(/^CHOP_[0-9][0-9][0-9][0-9]|C[0-9]?[0-9]$/)) {
            navigate({pathname: "/" + language + "/CHOP/" + version + "/chop_chapters/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else {
            navigate({pathname: "/" + language + "/CHOP/" + version + "/chops/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }
}
export default CHOP;
