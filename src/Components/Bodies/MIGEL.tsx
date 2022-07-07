import RouterService from "../../Services/router.service";
import {Component} from "react";

/**
 * responsible for the MIGEL component and the pathname
 */
class MIGEL extends Component {

    /**
     * navigate to the child component
     * @param code
     * @param navigate
     * @param language
     */
    static goToChild(code, navigate, language) {
        navigate({pathname: "/" + language + "/MIGEL/migels/" + code,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
    }
}
export default MIGEL;
