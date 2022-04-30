import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import RouterService from "../../Services/router.service";
import {Breadcrumb} from "react-bootstrap";

class MIGEL extends Component {
    static goToChild(code, navigate, language) {
        navigate({pathname: "/" + language + "/MIGEL/migels/" + code,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
    }
}
export default MIGEL;
