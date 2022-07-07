import {Component} from "react";
import RouterService from "../../Services/router.service";

/**
 * responsible for the AL Component and the pathname
 */
class AL extends Component {
    /**
     * navigate to the child component
     * @param code
     * @param navigate
     * @param language
     */
    static goToChild(code, navigate, language) {
        navigate({pathname: "/" + language + "/AL/als/" + code,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
    }

}
export default AL;
