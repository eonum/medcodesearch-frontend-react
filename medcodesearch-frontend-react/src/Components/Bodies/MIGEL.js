import RouterService from "../../Services/router.service";
import {Component} from "react";

class MIGEL extends Component {
    static goToChild(code, navigate, language) {
        navigate({pathname: "/" + language + "/MIGEL/migels/" + code,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
    }
}
export default MIGEL;
