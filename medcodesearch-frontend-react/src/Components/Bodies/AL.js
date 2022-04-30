import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import RouterService from "../../Services/router.service";
import {Breadcrumb} from "react-bootstrap";

class AL extends Component {
    static goToChild(code, navigate, language) {
        navigate({pathname: "/" + language + "/AL/als/" + code,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
    }

}
export default AL;
