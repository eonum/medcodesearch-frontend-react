import {Component} from "react";
import RouterService from "../../Services/router.service";

class AL extends Component {
    static goToChild(code, navigate, language) {
        navigate({pathname: "/" + language + "/AL/als/" + code,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
    }

}
export default AL;
